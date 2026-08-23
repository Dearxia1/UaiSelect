import { ComputedStyleSummary, SelectedElementData } from '../../types';
import { extractReactMetadata } from './reactFiber';
import { extractVueAndViteMetadata } from './vueInspector';

// Common Tailwind utility prefixes for classification
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

/**
 * Checks if a class is likely a Tailwind CSS utility class
 */
export function isTailwindClass(cls: string): boolean {
  if (!cls || typeof cls !== 'string') return false;
  return TAILWIND_PREFIXES.some(prefix => cls.startsWith(prefix) || cls === prefix);
}

/**
 * Extracts a concise summary of computed styles
 */
export function extractComputedStyles(element: HTMLElement): ComputedStyleSummary {
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

/**
 * Generates a clean, depth-truncated HTML snippet of the element
 */
export function getCleanHTMLSnippet(element: HTMLElement, maxDepth = 2): {
  innerSnippet: string;
  outerSnippet: string;
} {
  const clone = element.cloneNode(true) as HTMLElement;

  function prune(node: HTMLElement, currentDepth: number) {
    if (currentDepth >= maxDepth && node.children.length > 0) {
      node.innerHTML = `<!-- ... ${node.children.length} child elements truncated ... -->`;
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      prune(node.children[i] as HTMLElement, currentDepth + 1);
    }
  }

  prune(clone, 0);

  const outerSnippet = clone.outerHTML.slice(0, 1500);
  const innerSnippet = clone.innerHTML.slice(0, 1000);

  return {
    innerSnippet,
    outerSnippet,
  };
}

/**
 * Extracts all relevant element metadata
 */
export function extractElementData(element: HTMLElement): SelectedElementData {
  const rect = element.getBoundingClientRect();
  const classList = Array.from(element.classList || []);
  const tailwindClasses = classList.filter(isTailwindClass);
  const customClasses = classList.filter((c) => !isTailwindClass(c));

  // Extract framework metadata
  const reactData = extractReactMetadata(element);
  const vueData = extractVueAndViteMetadata(element);

  const source = reactData.source || vueData.source;
  const hierarchy = reactData.hierarchy.length > 0 ? reactData.hierarchy : vueData.hierarchy;

  // Add default node if hierarchy is empty
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
