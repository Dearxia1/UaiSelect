import { SelectedElementData, ComputedStyleSummary, SourceLocation, ComponentHierarchyNode } from '../types';

(function initUaiSelectContentEngine() {
  if ((window as any).__UAISELECT_CONTENT_INITIALIZED__) return;
  (window as any).__UAISELECT_CONTENT_INITIALIZED__ = true;

  const TAILWIND_PREFIXES = [
    'flex', 'grid', 'inline', 'block', 'hidden',
    'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-',
    'm-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-',
    'bg-', 'text-', 'border-', 'rounded-', 'shadow-',
    'w-', 'h-', 'min-w-', 'max-w-', 'min-h-', 'max-h-',
    'gap-', 'space-', 'items-', 'justify-', 'self-',
    'opacity-', 'transition-', 'duration-', 'ease-',
    'font-', 'tracking-', 'leading-', 'text-',
    'relative', 'absolute', 'fixed', 'sticky', 'inset-',
    'top-', 'bottom-', 'left-', 'right-', 'z-',
    'hover:', 'focus:', 'active:', 'dark:', 'sm:', 'md:', 'lg:', 'xl:', '2xl:',
    'group-hover:', 'cursor-', 'overflow-', 'select-'
  ];

  function isTailwindClass(cls: string): boolean {
    if (!cls || typeof cls !== 'string') return false;
    return TAILWIND_PREFIXES.some(prefix => cls.startsWith(prefix) || cls === prefix);
  }

  function sanitizeFilePath(rawPath: string): string {
    if (!rawPath || typeof rawPath !== 'string') return '';
    let p = rawPath.replace(/\\/g, '/');
    p = p.replace(/^\/@fs\//, '/');
    p = p.replace(/\?.*$/, '');
    p = p.replace(/^webpack:\/\/[^/]*\//, '');
    p = p.replace(/^file:\/\/\/?/, '');
    p = p.replace(/^\/([a-zA-Z]:)/, '$1');
    return p;
  }

  function ensureMainWorldBridge() {
    if (document.getElementById('uaiselect-main-world-bridge')) return;
    try {
      const scriptSrc = document.createElement('script');
      scriptSrc.id = 'uaiselect-main-world-bridge';
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        scriptSrc.src = chrome.runtime.getURL('mainWorld.js');
        scriptSrc.onload = () => {
          scriptSrc.setAttribute('data-loaded', 'true');
        };
        (document.head || document.documentElement).appendChild(scriptSrc);
      }
    } catch (err) {
      console.error('[UaiSelect] Bridge injection error:', err);
    }
  }

  ensureMainWorldBridge();

  function queryMainWorldData(element: HTMLElement): SelectedElementData | null {
    ensureMainWorldBridge();
    try {
      element.dispatchEvent(
        new CustomEvent('UAISELECT_INSPECT_DOM_EVENT', {
          bubbles: true,
          cancelable: true,
        })
      );
      const raw = element.getAttribute('data-uaiselect-data');
      if (raw) {
        element.removeAttribute('data-uaiselect-data');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[UaiSelect] Error querying main world bridge:', err);
    }
    return null;
  }

  function extractDOMFallbackMetadata(element: HTMLElement): {
    source?: SourceLocation;
    hierarchy: ComponentHierarchyNode[];
  } {
    let source: SourceLocation | undefined = undefined;
    const hierarchy: ComponentHierarchyNode[] = [];

    let currentElem: HTMLElement | null = element;
    while (currentElem && currentElem !== document.body && currentElem !== document.documentElement) {
      const vInspector =
        currentElem.getAttribute('data-v-inspector') ||
        currentElem.getAttribute('data-source') ||
        currentElem.getAttribute('data-loc') ||
        currentElem.getAttribute('data-locator') ||
        currentElem.getAttribute('data-source-loc');

      const reactInspectorPath = currentElem.getAttribute('data-inspector-relative-path');
      const reactInspectorLine = currentElem.getAttribute('data-inspector-line');

      if (vInspector && !source) {
        const parts = vInspector.split(':');
        if (parts.length >= 2) {
          let fileName = parts[0];
          let lineNumber = parseInt(parts[1], 10) || 1;
          if (parts[0].length === 1 && parts.length >= 3) {
            fileName = `${parts[0]}:${parts[1]}`;
            lineNumber = parseInt(parts[2], 10) || 1;
          }
          const compName = fileName.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Component';
          source = {
            fileName: sanitizeFilePath(fileName),
            lineNumber,
            componentName: compName,
            framework: fileName.endsWith('.vue') ? 'vue' : 'react',
          };
          hierarchy.unshift({
            name: compName,
            tag: currentElem.tagName.toLowerCase(),
            source,
            isCustomComponent: true,
          });
        }
      } else if (reactInspectorPath && reactInspectorLine && !source) {
        const compName = reactInspectorPath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Component';
        source = {
          fileName: sanitizeFilePath(reactInspectorPath),
          lineNumber: parseInt(reactInspectorLine, 10) || 1,
          componentName: compName,
          framework: 'react',
        };
        hierarchy.unshift({
          name: compName,
          tag: currentElem.tagName.toLowerCase(),
          source,
          isCustomComponent: true,
        });
      }

      currentElem = currentElem.parentElement;
    }

    return { source, hierarchy };
  }

  function extractComputedStyles(element: HTMLElement): ComputedStyleSummary {
    const styles = window.getComputedStyle(element);
    return {
      display: styles.display,
      position: styles.position,
      width: `${Math.round(parseFloat(styles.width) || 0)}px`,
      height: `${Math.round(parseFloat(styles.height) || 0)}px`,
      margin: `${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}`,
      padding: `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily.split(',')[0].replace(/['"]/g, ''),
      borderRadius: styles.borderRadius,
      border: `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`,
      gap: styles.gap !== 'normal' ? styles.gap : undefined,
      flexDirection: styles.display.includes('flex') ? styles.flexDirection : undefined,
    };
  }

  function getCleanHTMLSnippet(element: HTMLElement, maxDepth = 2): {
    innerSnippet: string;
    outerSnippet: string;
  } {
    const clone = element.cloneNode(true) as HTMLElement;

    function prune(node: HTMLElement, currentDepth: number) {
      if (currentDepth >= maxDepth && node.children.length > 0) {
        node.textContent = `<!-- ... ${node.children.length} child elements truncated ... -->`;
        return;
      }
      for (let i = 0; i < node.children.length; i++) {
        prune(node.children[i] as HTMLElement, currentDepth + 1);
      }
    }

    prune(clone, 0);

    return {
      innerSnippet: clone.innerHTML.slice(0, 1000),
      outerSnippet: clone.outerHTML.slice(0, 1500),
    };
  }

  function extractFullElementData(element: HTMLElement): SelectedElementData {
    // 1. Try Main World rich data first (React Fiber, Vue, State, Props, Events)
    const mainWorldData = queryMainWorldData(element);
    if (mainWorldData) {
      return mainWorldData;
    }

    // 2. Safe Fallback for pure DOM / static sites
    const rect = element.getBoundingClientRect();
    const classList = Array.from(element.classList || []);
    const tailwindClasses = classList.filter(isTailwindClass);
    const customClasses = classList.filter((c) => !isTailwindClass(c));

    const { source, hierarchy } = extractDOMFallbackMetadata(element);

    if (hierarchy.length === 0) {
      hierarchy.push({
        name: `<${element.tagName.toLowerCase()}>`,
        tag: element.tagName.toLowerCase(),
        isCustomComponent: false,
      });
    }

    const { innerSnippet, outerSnippet } = getCleanHTMLSnippet(element);
    const computedStyles = extractComputedStyles(element);

    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id || '',
      className: element.className || '',
      classList,
      tailwindClasses,
      customClasses,
      source,
      hierarchy,
      innerHTMLSnippet: innerSnippet,
      outerHTMLSnippet: outerSnippet,
      innerTextSnippet: (element.innerText || '').slice(0, 200).trim(),
      computedStyles,
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        bottom: Math.round(rect.bottom),
        right: Math.round(rect.right),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
      },
      url: window.location.href,
      pageTitle: document.title,
      timestamp: Date.now(),
    };
  }

  // Visual Overlay Class running with 100% Firefox & Chrome compatibility
  class BrowserOverlay {
    private container: HTMLDivElement | null = null;
    private shadowRoot: ShadowRoot | null = null;
    private highlightBox: HTMLDivElement | null = null;
    private badge: HTMLDivElement | null = null;
    private banner: HTMLDivElement | null = null;
    private currentElement: HTMLElement | null = null;
    private isActive = false;

    constructor() {
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
    }

    public activate(): void {
      if (this.isActive) return;
      this.isActive = true;
      ensureMainWorldBridge();
      this.createOverlayDOM();
      this.bindEvents();
    }

    public deactivate(): void {
      if (!this.isActive) return;
      this.isActive = false;
      this.unbindEvents();
      this.removeOverlayDOM();
      this.currentElement = null;
    }

    public toggle(): boolean {
      if (this.isActive) {
        this.deactivate();
        return false;
      } else {
        this.activate();
        return true;
      }
    }

    private createOverlayDOM(): void {
      if (document.getElementById('uaiselect-overlay-root')) return;

      this.container = document.createElement('div');
      this.container.id = 'uaiselect-overlay-root';
      this.container.style.position = 'fixed';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100vw';
      this.container.style.height = '100vh';
      this.container.style.zIndex = '2147483647';
      this.container.style.pointerEvents = 'none';

      this.shadowRoot = this.container.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .uaiselect-highlight {
          position: fixed;
          border: 1.5px solid #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.5);
          pointer-events: none;
          transition: all 0.06s cubic-bezier(0.4, 0, 0.2, 1);
          display: none;
          z-index: 2147483645;
        }
        .uaiselect-badge {
          position: fixed;
          background: #09090b;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          display: none;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          border: 1px solid #27272a;
          z-index: 2147483646;
          pointer-events: none;
          max-width: 380px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.06s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .uaiselect-badge-comp {
          color: #ffffff;
          font-weight: 700;
        }
        .uaiselect-badge-src {
          color: #a1a1aa;
          font-size: 10px;
          background: #18181b;
          padding: 2px 5px;
          border-radius: 4px;
          border: 1px solid #27272a;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .uaiselect-badge-dim {
          color: #71717a;
          font-size: 10px;
          font-family: monospace;
        }
        .uaiselect-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(12px);
          color: #f4f4f5;
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 0 1px #27272a;
          z-index: 2147483647;
          pointer-events: auto;
          animation: uaiselect-fade-in 0.2s ease-out;
        }
        .uaiselect-kbd {
          background: #18181b;
          color: #d4d4d8;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          border: 1px solid #3f3f46;
          font-family: monospace;
        }
        .uaiselect-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px #ffffff;
        }
        @keyframes uaiselect-fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes uaiselect-flash {
          0% { background: rgba(255, 255, 255, 0.3); transform: scale(1); }
          50% { background: rgba(255, 255, 255, 0.6); transform: scale(1.01); }
          100% { background: rgba(255, 255, 255, 0.08); transform: scale(1); }
        }
        .uaiselect-flash-anim {
          animation: uaiselect-flash 0.25s ease-out;
        }
      `;

      this.highlightBox = document.createElement('div');
      this.highlightBox.className = 'uaiselect-highlight';

      this.badge = document.createElement('div');
      this.badge.className = 'uaiselect-badge';

      this.banner = document.createElement('div');
      this.banner.className = 'uaiselect-banner';

      const dot = document.createElement('div');
      dot.className = 'uaiselect-dot';

      const titleSpan = document.createElement('span');
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = 'UaiSelect';
      titleSpan.appendChild(titleStrong);
      titleSpan.appendChild(document.createTextNode(' Inspector activo'));

      const escKbd = document.createElement('span');
      escKbd.className = 'uaiselect-kbd';
      escKbd.textContent = 'ESC para salir';

      const navKbd = document.createElement('span');
      navKbd.className = 'uaiselect-kbd';
      navKbd.textContent = '↑ / ↓ navegar';

      this.banner.replaceChildren(dot, titleSpan, escKbd, navKbd);

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(this.highlightBox);
      this.shadowRoot.appendChild(this.badge);
      this.shadowRoot.appendChild(this.banner);

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['settings'], (res) => {
          if (res.settings && res.settings.showFloatingBanner === false && this.banner) {
            this.banner.style.display = 'none';
          }
        });
      }

      (document.documentElement || document.body).appendChild(this.container);
    }

    private removeOverlayDOM(): void {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.container = null;
      this.shadowRoot = null;
      this.highlightBox = null;
      this.badge = null;
      this.banner = null;
    }

    private bindEvents(): void {
      window.addEventListener('mousemove', this.handleMouseMove, true);
      window.addEventListener('click', this.handleClick, true);
      window.addEventListener('keydown', this.handleKeyDown, true);
      window.addEventListener('scroll', this.handleScroll, true);
    }

    private unbindEvents(): void {
      window.removeEventListener('mousemove', this.handleMouseMove, true);
      window.removeEventListener('click', this.handleClick, true);
      window.removeEventListener('keydown', this.handleKeyDown, true);
      window.removeEventListener('scroll', this.handleScroll, true);
    }

    private handleMouseMove(e: MouseEvent): void {
      if (!this.isActive) return;
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target === this.container || this.container?.contains(target)) return;
      this.updateHighlight(target);
    }

    private handleScroll(): void {
      if (this.currentElement && this.isActive) {
        this.updateHighlight(this.currentElement);
      }
    }

    private handleKeyDown(e: KeyboardEvent): void {
      if (!this.isActive) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.deactivate();
        return;
      }

      if (e.key === 'ArrowUp' && this.currentElement) {
        e.preventDefault();
        e.stopPropagation();
        const parent = this.currentElement.parentElement;
        if (parent && parent !== document.body && parent !== document.documentElement) {
          this.updateHighlight(parent);
        }
        return;
      }

      if (e.key === 'ArrowDown' && this.currentElement) {
        e.preventDefault();
        e.stopPropagation();
        const firstChild = this.currentElement.firstElementChild as HTMLElement | null;
        if (firstChild) {
          this.updateHighlight(firstChild);
        }
        return;
      }
    }

    private handleClick(e: MouseEvent): void {
      if (!this.isActive) return;

      e.preventDefault();
      e.stopPropagation();

      const target = this.currentElement || (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null);
      if (!target) return;

      // Immediately hide inspector overlay
      if (this.container) {
        this.container.style.display = 'none';
      }

      // Hide all foreign fixed/sticky elements (like floating navbars/headers)
      // so they do NOT appear in the component screenshot unless target is inside them
      const fixedToHide: { elem: HTMLElement; origVisibility: string }[] = [];
      try {
        const all = document.querySelectorAll('*');
        for (let i = 0; i < all.length; i++) {
          const el = all[i] as HTMLElement;
          if (el.id === 'uaiselect-overlay-root' || el.contains(target) || target.contains(el)) continue;
          const comp = window.getComputedStyle(el);
          if (comp.position === 'fixed' || comp.position === 'sticky') {
            fixedToHide.push({
              elem: el,
              origVisibility: el.style.visibility,
            });
            el.style.visibility = 'hidden';
          }
        }
      } catch {}

      const data = extractFullElementData(target);

      // Send to background directly
      chrome.runtime.sendMessage({
        type: 'ELEMENT_SELECTED',
        payload: data,
      }).catch(() => {});

      // Restore fixed elements visibility after screenshot is captured
      setTimeout(() => {
        fixedToHide.forEach((item) => {
          item.elem.style.visibility = item.origVisibility;
        });
      }, 150);

      this.deactivate();
    }

    private updateHighlight(element: HTMLElement): void {
      this.currentElement = element;
      if (!this.highlightBox || !this.badge) return;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      this.highlightBox.style.display = 'block';
      this.highlightBox.style.top = `${rect.top}px`;
      this.highlightBox.style.left = `${rect.left}px`;
      this.highlightBox.style.width = `${rect.width}px`;
      this.highlightBox.style.height = `${rect.height}px`;

      const data = queryMainWorldData(element);
      const source = data?.source;
      const hierarchy = data?.hierarchy || [];

      const compName = source?.componentName || (hierarchy.length > 0 ? (hierarchy.find((h) => h.isCustomComponent)?.name || hierarchy[0]?.name) : `<${element.tagName.toLowerCase()}>`);
      const sourceText = source ? `${source.fileName.split('/').pop()}:${source.lineNumber}` : '';
      const dims = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;

      const compSpan = document.createElement('span');
      compSpan.className = 'uaiselect-badge-comp';
      compSpan.textContent = compName;

      const badgeNodes: Node[] = [compSpan];

      if (sourceText) {
        const srcSpan = document.createElement('span');
        srcSpan.className = 'uaiselect-badge-src';
        srcSpan.textContent = sourceText;
        badgeNodes.push(srcSpan);
      }

      const dimSpan = document.createElement('span');
      dimSpan.className = 'uaiselect-badge-dim';
      dimSpan.textContent = dims;
      badgeNodes.push(dimSpan);

      this.badge.replaceChildren(...badgeNodes);

      this.badge.style.display = 'flex';

      let badgeTop = rect.top - 32;
      if (badgeTop < 10) {
        badgeTop = rect.bottom + 8;
      }
      let badgeLeft = Math.max(10, rect.left);
      if (badgeLeft + 300 > window.innerWidth) {
        badgeLeft = window.innerWidth - 310;
      }

      this.badge.style.top = `${badgeTop}px`;
      this.badge.style.left = `${badgeLeft}px`;
    }
  }

  const overlay = new BrowserOverlay();

  /**
   * Captures the ENTIRE scrollable webpage from top to bottom
   * Handles fixed/sticky navbars cleanly to avoid duplication across slices
   */
  async function captureFullScrollablePage(): Promise<string> {
    const origScrollX = window.scrollX;
    const origScrollY = window.scrollY;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;

    // Temporarily hide overlay if open
    overlay.deactivate();

    const fullWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      window.innerWidth
    );
    const fullHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );
    const viewportHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Find all fixed & sticky elements (headers, navbars, floating toolbars)
    const fixedElements: { elem: HTMLElement; origVisibility: string }[] = [];
    try {
      const all = document.querySelectorAll('*');
      for (let i = 0; i < all.length; i++) {
        const el = all[i] as HTMLElement;
        if (el.id === 'uaiselect-overlay-root') continue;
        const comp = window.getComputedStyle(el);
        if (comp.position === 'fixed' || comp.position === 'sticky') {
          fixedElements.push({
            elem: el,
            origVisibility: el.style.visibility,
          });
        }
      }
    } catch {}

    const slices: { y: number; dataUrl: string }[] = [];
    const yPositions: number[] = [];

    // Calculate vertical scroll step points
    for (let y = 0; y < fullHeight; y += viewportHeight - 16) {
      const clampedY = Math.min(y, Math.max(0, fullHeight - viewportHeight));
      yPositions.push(clampedY);
      if (y + viewportHeight >= fullHeight) break;
    }
    const uniqueYPositions = Array.from(new Set(yPositions));

    for (let i = 0; i < uniqueYPositions.length; i++) {
      const yPos = uniqueYPositions[i];
      window.scrollTo(0, yPos);

      // On slice 0 (top): Keep navbars visible.
      // On slice > 0: Hide fixed elements so they don't get repeated on every slice!
      if (i > 0) {
        fixedElements.forEach((item) => {
          item.elem.style.visibility = 'hidden';
        });
      } else {
        fixedElements.forEach((item) => {
          item.elem.style.visibility = item.origVisibility;
        });
      }

      // Wait for layout repaint & scrolling stabilization
      await new Promise((r) => setTimeout(r, 100));

      const sliceRes: any = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'CAPTURE_SLICE_REQUEST' }, (res) => {
          resolve(res);
        });
      });

      if (sliceRes && sliceRes.dataUrl) {
        slices.push({ y: yPos, dataUrl: sliceRes.dataUrl });
      }
    }

    // Restore fixed elements visibility
    fixedElements.forEach((item) => {
      item.elem.style.visibility = item.origVisibility;
    });

    // Restore original scroll positions and styles
    document.documentElement.style.overflow = origHtmlOverflow;
    document.body.style.overflow = origBodyOverflow;
    window.scrollTo(origScrollX, origScrollY);

    if (slices.length === 0) return '';

    // If page fits in one single screen, return that slice directly
    if (slices.length === 1 && fullHeight <= viewportHeight + 10) {
      return slices[0].dataUrl;
    }

    // Stitch all slices onto canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(fullWidth * dpr);
    canvas.height = Math.round(fullHeight * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return slices[0].dataUrl;

    for (const slice of slices) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, Math.round(slice.y * dpr));
          resolve();
        };
        img.onerror = () => resolve();
        img.src = slice.dataUrl;
      });
    }

    return canvas.toDataURL('image/png');
  }

  // Listen for extension runtime messages
  chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
    if (message.type === 'TOGGLE_INSPECTOR') {
      const isNowActive = overlay.toggle();
      sendResponse({ active: isNowActive });
      return true;
    }

    if (message.type === 'START_INSPECTION') {
      overlay.activate();
      sendResponse({ active: true });
      return true;
    }

    if (message.type === 'STOP_INSPECTION') {
      overlay.deactivate();
      sendResponse({ active: false });
      return true;
    }

    if (message.type === 'DO_FULL_PAGE_CAPTURE') {
      captureFullScrollablePage().then((screenshotUrl) => {
        sendResponse({ screenshotUrl });
      }).catch(() => {
        sendResponse({ screenshotUrl: '' });
      });
      return true;
    }
  });
})();
