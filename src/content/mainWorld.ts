// UaiSelect Main World Engine
// Runs directly inside the target webpage context with 100% native access to React Fiber, Vue, Svelte, and window

import { SelectedElementData, ComputedStyleSummary, SourceLocation, ComponentHierarchyNode, ComponentDataContext, ComponentEventData } from '../types';

(function initUaiSelectMainWorld() {
  if ((window as any).__UAISELECT_MAIN_WORLD_INITIALIZED__) return;
  (window as any).__UAISELECT_MAIN_WORLD_INITIALIZED__ = true;

  const STACK_URL_REGEX = /(?:https?:\/\/[^/\s]+\/|file:\/\/\/?)((?:src|app|pages|components|lib|views)\/[^?:\s"']+\.[a-zA-Z0-9]+)(?:\?[^:\s"']*)?:(\d+)(?::(\d+))?/;

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

  function getReactFiberFromDOM(element: HTMLElement | null): any {
    if (!element) return null;
    let current: HTMLElement | null = element;
    let depth = 0;

    while (current && depth < 6) {
      // Check direct property keys (standard in modern React)
      try {
        const keys = Object.keys(current);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (
            key.startsWith('__reactFiber$') ||
            key.startsWith('__reactInternalInstance$')
          ) {
            const fiber = (current as any)[key];
            if (fiber) return fiber;
          }
        }
      } catch {}

      // Check property names including non-enumerable
      try {
        const propNames = Object.getOwnPropertyNames(current);
        for (let i = 0; i < propNames.length; i++) {
          const key = propNames[i];
          if (
            key.startsWith('__reactFiber$') ||
            key.startsWith('__reactInternalInstance$')
          ) {
            const fiber = (current as any)[key];
            if (fiber) return fiber;
          }
        }
      } catch {}

      current = current.parentElement;
      depth++;
    }

    return null;
  }

  function getComponentName(type: any): string | null {
    if (!type) return null;
    if (typeof type === 'string') return type;
    if (typeof type === 'function') {
      return type.displayName || type.name || 'AnonymousComponent';
    }
    if (typeof type === 'object') {
      if (type.$$typeof && typeof type.$$typeof === 'symbol') {
        const symbolStr = type.$$typeof.toString();
        if (symbolStr.includes('react.memo')) {
          return getComponentName(type.type) ? `Memo(${getComponentName(type.type)})` : 'Memo';
        }
        if (symbolStr.includes('react.forward_ref')) {
          return type.render ? (type.render.displayName || type.render.name || 'ForwardRef') : 'ForwardRef';
        }
        if (symbolStr.includes('react.provider')) {
          return 'ContextProvider';
        }
      }
      if (type.displayName) return type.displayName;
      if (type.name) return type.name;
      if (type.render) return getComponentName(type.render);
    }
    return null;
  }

  function extractReactSourceFromFiber(fiber: any): { fileName: string; lineNumber: number; columnNumber?: number } | null {
    if (!fiber) return null;

    // Strategy A: Direct _debugSource (React 16, 17, 18 standard Vite/Next.js/CRA)
    const directSource = fiber._debugSource || fiber._debugOwner?._debugSource;
    if (directSource && directSource.fileName) {
      return {
        fileName: sanitizeFilePath(directSource.fileName),
        lineNumber: Number(directSource.lineNumber) || 1,
        columnNumber: directSource.columnNumber ? Number(directSource.columnNumber) : undefined,
      };
    }

    // Strategy B: Props __source / _source (Babel & SWC JSX dev transforms)
    const propsSource =
      fiber.memoizedProps?.__source ||
      fiber.pendingProps?.__source ||
      fiber.memoizedProps?._source ||
      fiber.pendingProps?._source;
    if (propsSource && propsSource.fileName) {
      return {
        fileName: sanitizeFilePath(propsSource.fileName),
        lineNumber: Number(propsSource.lineNumber) || 1,
        columnNumber: propsSource.columnNumber ? Number(propsSource.columnNumber) : undefined,
      };
    }

    // Strategy C: React 19 _debugInfo array
    if (Array.isArray(fiber._debugInfo)) {
      for (const info of fiber._debugInfo) {
        if (info && typeof info === 'object') {
          if (info.fileName) {
            return {
              fileName: sanitizeFilePath(info.fileName),
              lineNumber: Number(info.lineNumber) || 1,
              columnNumber: info.columnNumber ? Number(info.columnNumber) : undefined,
            };
          }
          if (typeof info.stack === 'string') {
            const match = info.stack.match(STACK_URL_REGEX);
            if (match) {
              return {
                fileName: sanitizeFilePath(match[1]),
                lineNumber: parseInt(match[2], 10) || 1,
                columnNumber: match[3] ? parseInt(match[3], 10) : undefined,
              };
            }
          }
        }
      }
    }

    // Strategy D: React 19 _debugStack regex
    if (fiber._debugStack && typeof fiber._debugStack === 'string') {
      const match = fiber._debugStack.match(STACK_URL_REGEX);
      if (match) {
        return {
          fileName: sanitizeFilePath(match[1]),
          lineNumber: parseInt(match[2], 10) || 1,
          columnNumber: match[3] ? parseInt(match[3], 10) : undefined,
        };
      }
    }

    return null;
  }

  function findBestSourceInFiberTree(fiberRoot: any): SourceLocation | null {
    if (!fiberRoot) return null;

    let fallbackSource: SourceLocation | null = null;

    // 1. Search up the _debugOwner chain (JSX call sites)
    let owner = fiberRoot;
    let ownerDepth = 0;
    while (owner && ownerDepth < 30) {
      const src = extractReactSourceFromFiber(owner);
      if (src) {
        const isNodeModules = src.fileName.includes('node_modules');
        const isUserCode =
          src.fileName.includes('/src/') ||
          src.fileName.includes('/app/') ||
          src.fileName.includes('/pages/') ||
          src.fileName.startsWith('src/');

        if (isUserCode && !isNodeModules) {
          return src;
        }

        if (!fallbackSource && !isNodeModules) {
          fallbackSource = src;
        }
      }
      owner = owner._debugOwner;
      ownerDepth++;
    }

    // 2. Search up the fiber.return chain (DOM component tree)
    let curr = fiberRoot;
    let returnDepth = 0;
    while (curr && returnDepth < 30) {
      const src = extractReactSourceFromFiber(curr);
      if (src) {
        const isNodeModules = src.fileName.includes('node_modules');
        const isUserCode =
          src.fileName.includes('/src/') ||
          src.fileName.includes('/app/') ||
          src.fileName.includes('/pages/') ||
          src.fileName.startsWith('src/');

        if (isUserCode && !isNodeModules) {
          return src;
        }

        if (!fallbackSource && !isNodeModules) {
          fallbackSource = src;
        }
      }
      curr = curr.return;
      returnDepth++;
    }

    return fallbackSource;
  }

  function extractMetadata(element: HTMLElement): {
    source?: SourceLocation;
    hierarchy: ComponentHierarchyNode[];
  } {
    let source: SourceLocation | undefined = undefined;
    const hierarchy: ComponentHierarchyNode[] = [];
    const visitedNames = new Set<string>();

    // 1. REACT FIBER INSPECTION
    const fiber = getReactFiberFromDOM(element);
    if (fiber) {
      // Find best source by climbing owner and return chains
      const bestFiberSource = findBestSourceInFiberTree(fiber);
      if (bestFiberSource) {
        source = bestFiberSource;
      }

      let current = fiber;
      while (current) {
        const compName = getComponentName(current.type);
        const sourceInfo = extractReactSourceFromFiber(current);
        const isCustom =
          typeof current.type === 'function' ||
          (typeof current.type === 'object' && compName !== null && typeof current.type !== 'string');

        if (compName && compName !== 'div' && compName !== 'span' && isCustom) {
          if (!visitedNames.has(compName)) {
            visitedNames.add(compName);

            let nodeSource: SourceLocation | undefined = undefined;
            if (sourceInfo) {
              nodeSource = {
                fileName: sourceInfo.fileName,
                lineNumber: sourceInfo.lineNumber,
                columnNumber: sourceInfo.columnNumber,
                componentName: compName,
                framework: 'react',
              };
            }

            hierarchy.unshift({
              name: compName,
              tag: typeof current.type === 'string' ? current.type : 'component',
              source: nodeSource,
              isCustomComponent: true,
            });

            if (!source && nodeSource) {
              source = nodeSource;
            }
          }
        }

        if (!source && sourceInfo) {
          source = {
            fileName: sourceInfo.fileName,
            lineNumber: sourceInfo.lineNumber,
            columnNumber: sourceInfo.columnNumber,
            componentName: compName || element.tagName.toLowerCase(),
            framework: 'react',
          };
        }

        current = current.return;
      }
    }

    // 2. VUE / VITE / ASTRO / SVELTE DOM ATTRIBUTES & INSTANCES
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

      // Check Vue component instance
      const vueComp = (currentElem as any).__vueParentComponent || (currentElem as any).__vue__;
      if (vueComp && vueComp.type) {
        const name = vueComp.type.name || vueComp.type.__name || 'VueComponent';
        if (!source && vueComp.type.__file) {
          source = {
            fileName: sanitizeFilePath(vueComp.type.__file),
            lineNumber: 1,
            componentName: name,
            framework: 'vue',
          };
        }
        if (!hierarchy.some((h) => h.name === name)) {
          hierarchy.unshift({
            name,
            tag: currentElem.tagName.toLowerCase(),
            source: source || undefined,
            isCustomComponent: true,
          });
        }
      }

      // Check Svelte metadata
      const svelteMeta = (currentElem as any).__svelte_meta;
      if (svelteMeta && svelteMeta.loc && !source) {
        const svelteFile = svelteMeta.loc.file;
        const compName = svelteFile.split('/').pop()?.replace(/\.[^.]+$/, '') || 'SvelteComponent';
        source = {
          fileName: sanitizeFilePath(svelteFile),
          lineNumber: svelteMeta.loc.line || 1,
          columnNumber: svelteMeta.loc.column,
          componentName: compName,
          framework: 'svelte',
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

  function safeSerialize(val: any, depth = 0, maxDepth = 3, seen = new WeakSet()): any {
    if (val === null || val === undefined) return val;
    const t = typeof val;
    if (t === 'function') {
      return `[Function: ${val.displayName || val.name || 'anonymous'}]`;
    }
    if (t === 'symbol') return val.toString();
    if (t === 'bigint') return `${val.toString()}n`;
    if (t === 'string') {
      return val.length > 300 ? `${val.slice(0, 300)}...` : val;
    }
    if (t === 'number' || t === 'boolean') return val;
    if (val instanceof Element || (val && val.nodeType)) {
      return `<${val.tagName ? val.tagName.toLowerCase() : 'Node'} />`;
    }
    if (val && (val.$$typeof || val._isReactElement)) {
      const compName = getComponentName(val.type);
      return `<${compName || 'ReactNode'} />`;
    }
    if (depth >= maxDepth) {
      return Array.isArray(val) ? `[Array(${val.length})]` : '[Object]';
    }
    if (typeof val === 'object') {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);

      if (val instanceof Date) return val.toISOString();
      if (val instanceof RegExp) return val.toString();

      if (Array.isArray(val)) {
        return val.slice(0, 25).map((item) => safeSerialize(item, depth + 1, maxDepth, seen));
      }

      if (val instanceof Map) {
        const obj: Record<string, any> = {};
        let count = 0;
        for (const [k, v] of val.entries()) {
          if (count++ > 25) break;
          obj[String(k)] = safeSerialize(v, depth + 1, maxDepth, seen);
        }
        return obj;
      }

      if (val instanceof Set) {
        return Array.from(val).slice(0, 25).map((item) => safeSerialize(item, depth + 1, maxDepth, seen));
      }

      const result: Record<string, any> = {};
      const keys = Object.keys(val).slice(0, 35);
      for (const k of keys) {
        if (k === '_owner' || k === '_store' || k === '$$typeof' || k === '__self' || k === '__source' || k === 'children') continue;
        try {
          result[k] = safeSerialize(val[k], depth + 1, maxDepth, seen);
        } catch {
          result[k] = '[Unserializable]';
        }
      }
      return result;
    }
    return String(val);
  }

  function extractComponentDataContext(element: HTMLElement): ComponentDataContext | undefined {
    const events: ComponentEventData[] = [];
    const visitedEvents = new Set<string>();
    let rawProps: Record<string, any> | undefined = undefined;
    let rawState: Record<string, any> | undefined = undefined;

    // 1. REACT FIBER EXTRACTION
    const fiber = getReactFiberFromDOM(element);
    if (fiber) {
      // Find nearest custom component fiber or direct fiber
      let customFiber: any = fiber;
      let fallbackPropsFiber: any = fiber;
      while (customFiber) {
        const isCustom =
          typeof customFiber.type === 'function' ||
          (typeof customFiber.type === 'object' && customFiber.type !== null && typeof customFiber.type !== 'string');
        if (isCustom && (customFiber.memoizedProps || customFiber.memoizedState)) {
          break;
        }
        customFiber = customFiber.return;
      }

      const targetFiber = customFiber || fallbackPropsFiber;
      const memoProps = targetFiber?.memoizedProps || targetFiber?.pendingProps || fiber.memoizedProps || fiber.pendingProps;

      if (memoProps && typeof memoProps === 'object') {
        const filteredProps: Record<string, any> = {};
        for (const key of Object.keys(memoProps)) {
          if (key === 'children' || key === 'key' || key === 'ref' || key === '__source' || key === '__self') continue;

          const val = memoProps[key];
          // Detect Event handlers (props like onClick, onChange, onSubmit)
          if (key.startsWith('on') && key.length > 2 && /[A-Z]/.test(key[2])) {
            if (!visitedEvents.has(key)) {
              visitedEvents.add(key);
              events.push({
                name: key,
                handlerName: typeof val === 'function' ? (val.displayName || val.name || 'anonymous') : 'handler',
              });
            }
          } else {
            filteredProps[key] = val;
          }
        }
        if (Object.keys(filteredProps).length > 0) {
          rawProps = safeSerialize(filteredProps);
        }
      }

      // Inspect Hooks & State
      if (targetFiber?.memoizedState) {
        if (typeof targetFiber.type === 'function') {
          // Function Component Hooks linked list
          const extractedHooks: Record<string, any> = {};
          let hook = targetFiber.memoizedState;
          let hookIdx = 0;
          while (hook && hookIdx < 20) {
            if (hook.memoizedState !== undefined) {
              const isEffect =
                hook.memoizedState &&
                typeof hook.memoizedState === 'object' &&
                ('create' in hook.memoizedState ||
                  'destroy' in hook.memoizedState ||
                  ('tag' in hook.memoizedState && 'inst' in hook.memoizedState));

              if (!isEffect) {
                const serialized = safeSerialize(hook.memoizedState);
                if (serialized !== undefined) {
                  extractedHooks[`state_${hookIdx}`] = serialized;
                }
              }
            }
            hook = hook.next;
            hookIdx++;
          }
          if (Object.keys(extractedHooks).length > 0) {
            rawState = extractedHooks;
          }
        } else if (typeof targetFiber.memoizedState === 'object') {
          // Class component state
          rawState = safeSerialize(targetFiber.memoizedState);
        }
      }
    }

    // 2. VUE EXTRACTION
    let currentElem: HTMLElement | null = element;
    while (currentElem && currentElem !== document.body && currentElem !== document.documentElement) {
      const vueComp = (currentElem as any).__vueParentComponent || (currentElem as any).__vue__;
      if (vueComp) {
        if (vueComp.props && typeof vueComp.props === 'object' && Object.keys(vueComp.props).length > 0) {
          rawProps = { ...rawProps, ...safeSerialize(vueComp.props) };
        }
        const vueState = vueComp.setupState || vueComp.data;
        if (vueState && typeof vueState === 'object' && Object.keys(vueState).length > 0) {
          rawState = { ...(rawState || {}), ...safeSerialize(vueState) };
        }
        break;
      }
      currentElem = currentElem.parentElement;
    }

    // 3. Native DOM inline events (e.g. onclick, onchange)
    const domEventAttrs = ['onclick', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup', 'oninput', 'onfocus', 'onblur'];
    for (const attr of domEventAttrs) {
      const handler = (element as any)[attr] || element.getAttribute(attr);
      if (handler) {
        const eventName = 'on' + attr.slice(2).charAt(0).toUpperCase() + attr.slice(3);
        if (!visitedEvents.has(eventName)) {
          visitedEvents.add(eventName);
          events.push({
            name: eventName,
            handlerName: typeof handler === 'function' ? (handler.name || 'inline') : String(handler).slice(0, 40),
          });
        }
      }
    }

    if (!rawProps && !rawState && events.length === 0) {
      return undefined;
    }

    return {
      props: rawProps,
      state: rawState,
      events: events.length > 0 ? events : undefined,
    };
  }

  function extractFullElementData(element: HTMLElement): SelectedElementData {
    const rect = element.getBoundingClientRect();
    const classList = Array.from(element.classList || []);
    const tailwindClasses = classList.filter(isTailwindClass);
    const customClasses = classList.filter((c) => !isTailwindClass(c));

    const { source, hierarchy } = extractMetadata(element);

    if (hierarchy.length === 0) {
      hierarchy.push({
        name: `<${element.tagName.toLowerCase()}>`,
        tag: element.tagName.toLowerCase(),
        isCustomComponent: false,
      });
    }

    const { innerSnippet, outerSnippet } = getCleanHTMLSnippet(element);
    const computedStyles = extractComputedStyles(element);
    const dataContext = extractComponentDataContext(element);

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
      dataContext,
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

  // Visual Overlay Class running in Main World
  class MainWorldOverlay {
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

      document.documentElement.appendChild(this.container);
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

      if (this.highlightBox) {
        this.highlightBox.classList.add('uaiselect-flash-anim');
        setTimeout(() => {
          this.highlightBox?.classList.remove('uaiselect-flash-anim');
        }, 300);
      }

      const data = extractFullElementData(target);

      // Send to Content Script via postMessage
      window.postMessage({
        type: 'UAISELECT_ELEMENT_SELECTED',
        payload: data,
      }, '*');

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

      const { source, hierarchy } = extractMetadata(element);
      const compName = source?.componentName || hierarchy[0]?.name || `<${element.tagName.toLowerCase()}>`;
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

  const overlay = new MainWorldOverlay();

  // Listen for synchronous DOM inspect requests from Content Script
  document.addEventListener('UAISELECT_INSPECT_DOM_EVENT', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    try {
      const data = extractFullElementData(target);
      target.setAttribute('data-uaiselect-data', JSON.stringify(data));
    } catch (err) {
      console.error('[UaiSelect] Error extracting in main world:', err);
    }
  }, true);

  // Listen for messages from Content Script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'UAISELECT_TOGGLE_INSPECTOR') {
      overlay.toggle();
    } else if (event.data.type === 'UAISELECT_START_INSPECTION') {
      overlay.activate();
    } else if (event.data.type === 'UAISELECT_STOP_INSPECTION') {
      overlay.deactivate();
    }
  });
})();
