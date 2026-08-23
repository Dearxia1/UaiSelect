import { ComponentHierarchyNode, SourceLocation } from '../../types';

let currentTargetId = 0;

/**
 * Communicates synchronously with the main world script where React Fiber is accessible
 */
export function queryMainWorldMetadata(element: HTMLElement): {
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
} {
  const targetId = `uai-${Date.now()}-${++currentTargetId}`;
  element.setAttribute('data-uaiselect-id', targetId);

  let result: { source?: SourceLocation; hierarchy: ComponentHierarchyNode[] } = { hierarchy: [] };

  const handler = (e: any) => {
    if (e.detail?.targetId === targetId && e.detail.metadata) {
      result = e.detail.metadata;
    }
  };

  window.addEventListener('UAISELECT_INSPECT_RES', handler as EventListener, { once: true });

  // Dispatches event to Main World (Synchronous)
  window.dispatchEvent(
    new CustomEvent('UAISELECT_INSPECT_REQ', {
      detail: { targetId },
    })
  );

  element.removeAttribute('data-uaiselect-id');
  window.removeEventListener('UAISELECT_INSPECT_RES', handler as EventListener);

  return result;
}

/**
 * Extracts React metadata: source file, line number, and component hierarchy
 */
export function extractReactMetadata(element: HTMLElement): {
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
} {
  // Query the main world script running inside the webpage context
  const mainWorldResult = queryMainWorldMetadata(element);
  if (mainWorldResult.source || (mainWorldResult.hierarchy && mainWorldResult.hierarchy.length > 0)) {
    return mainWorldResult;
  }

  return { hierarchy: [] };
}
