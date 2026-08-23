import { SelectedElementData } from '../types';
import { extractElementData } from './extractors/domExtractor';

export class UaiSelectOverlay {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private highlightBox: HTMLDivElement | null = null;
  private badge: HTMLDivElement | null = null;
  private banner: HTMLDivElement | null = null;
  private currentElement: HTMLElement | null = null;
  private isActive = false;
  private onSelectCallback?: (data: SelectedElementData) => void;

  constructor(onSelect?: (data: SelectedElementData) => void) {
    this.onSelectCallback = onSelect;
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

    // Styles for the shadow DOM
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
        border: 2px solid #6366f1;
        background: rgba(99, 102, 241, 0.12);
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(99, 102, 241, 0.25);
        pointer-events: none;
        transition: all 0.08s cubic-bezier(0.4, 0, 0.2, 1);
        display: none;
        z-index: 2147483645;
      }
      .uaiselect-badge {
        position: fixed;
        background: #0f172a;
        color: #ffffff;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        display: none;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        border: 1px solid #334155;
        z-index: 2147483646;
        pointer-events: none;
        max-width: 380px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.08s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .uaiselect-badge-comp {
        color: #818cf8;
        font-weight: 700;
      }
      .uaiselect-badge-src {
        color: #94a3b8;
        font-size: 10px;
        background: #1e293b;
        padding: 2px 5px;
        border-radius: 4px;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .uaiselect-badge-dim {
        color: #e2e8f0;
        font-size: 10px;
        opacity: 0.8;
      }
      .uaiselect-banner {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(8px);
        color: #f8fafc;
        padding: 8px 18px;
        border-radius: 9999px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
        z-index: 2147483647;
        pointer-events: auto;
        animation: uaiselect-fade-in 0.2s ease-out;
      }
      .uaiselect-kbd {
        background: #334155;
        color: #e2e8f0;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        border: 1px solid #475569;
      }
      .uaiselect-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      @keyframes uaiselect-fade-in {
        from { opacity: 0; transform: translate(-50%, 10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes uaiselect-flash {
        0% { background: rgba(99, 102, 241, 0.4); transform: scale(1); }
        50% { background: rgba(99, 102, 241, 0.8); transform: scale(1.02); }
        100% { background: rgba(99, 102, 241, 0.12); transform: scale(1); }
      }
      .uaiselect-flash-anim {
        animation: uaiselect-flash 0.3s ease-out;
      }
    `;

    this.highlightBox = document.createElement('div');
    this.highlightBox.className = 'uaiselect-highlight';

    this.badge = document.createElement('div');
    this.badge.className = 'uaiselect-badge';

    this.banner = document.createElement('div');
    this.banner.className = 'uaiselect-banner';
    this.banner.innerHTML = `
      <span class="uaiselect-dot"></span>
      <strong>UaiSelect Inspector</strong>
      <span>Clic para capturar</span>
      <span><span class="uaiselect-kbd">↑ / ↓</span> Cambiar nivel</span>
      <span><span class="uaiselect-kbd">Esc</span> Salir</span>
    `;

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

    // Ignore overlay itself
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

    // Visual feedback
    if (this.highlightBox) {
      this.highlightBox.classList.add('uaiselect-flash-anim');
      setTimeout(() => {
        this.highlightBox?.classList.remove('uaiselect-flash-anim');
      }, 300);
    }

    const data = extractElementData(target);

    if (this.onSelectCallback) {
      this.onSelectCallback(data);
    }

    // After selection, keep overlay or deactivate based on UX preference
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

    // Extract quick metadata for badge
    const data = extractElementData(element);
    const compName = data.source?.componentName || data.hierarchy[0]?.name || `<${element.tagName.toLowerCase()}>`;
    const sourceText = data.source ? `${data.source.fileName.split('/').pop()}:${data.source.lineNumber}` : '';
    const dims = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;

    this.badge.innerHTML = `
      <span class="uaiselect-badge-comp">${compName}</span>
      ${sourceText ? `<span class="uaiselect-badge-src">${sourceText}</span>` : ''}
      <span class="uaiselect-badge-dim">${dims}</span>
    `;

    this.badge.style.display = 'flex';
    
    // Position badge above or below element
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
