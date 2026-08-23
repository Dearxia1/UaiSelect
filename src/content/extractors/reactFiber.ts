import { ComponentHierarchyNode, SourceLocation } from '../../types';

interface ReactFiberNode {
  tag?: number;
  key?: string | null;
  type?: any;
  elementType?: any;
  stateNode?: any;
  return?: ReactFiberNode | null;
  child?: ReactFiberNode | null;
  sibling?: ReactFiberNode | null;
  memoizedProps?: Record<string, any>;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  _debugOwner?: ReactFiberNode;
}

/**
 * Finds the React Fiber key on a DOM element (e.g. __reactFiber$...)
 */
export function getReactFiber(element: HTMLElement): ReactFiberNode | null {
  const keys = Object.keys(element);
  const fiberKey = keys.find(
    (key) =>
      key.startsWith('__reactFiber$') ||
      key.startsWith('__reactInternalInstance$')
  );

  if (!fiberKey) return null;
  return (element as any)[fiberKey] as ReactFiberNode;
}

/**
 * Gets a clean component name from a Fiber type
 */
function getComponentName(type: any): string | null {
  if (!type) return null;
  if (typeof type === 'string') return type;
  if (typeof type === 'function') {
    return type.displayName || type.name || 'AnonymousComponent';
  }
  if (typeof type === 'object') {
    if (type.$$typeof && typeof type.$$typeof === 'symbol') {
      const symbolString = type.$$typeof.toString();
      if (symbolString.includes('react.memo')) {
        return getComponentName(type.type) ? `Memo(${getComponentName(type.type)})` : 'Memo';
      }
      if (symbolString.includes('react.forward_ref')) {
        return type.render ? (type.render.displayName || type.render.name || 'ForwardRef') : 'ForwardRef';
      }
      if (symbolString.includes('react.provider')) {
        return 'ContextProvider';
      }
    }
    if (type.displayName) return type.displayName;
    if (type.name) return type.name;
  }
  return null;
}

/**
 * Cleans up file paths for easier readability (e.g. removes webpack:// or localhost prefixes)
 */
function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  return fileName
    .replace(/^webpack:\/\/[^/]*\//, '')
    .replace(/^file:\/\/\/?/, '')
    .replace(/^\/([A-Z]:)/, '$1'); // Fix Windows drive path if needed
}

/**
 * Extracts React metadata: source file, line number, and component hierarchy
 */
export function extractReactMetadata(element: HTMLElement): {
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
} {
  const hierarchy: ComponentHierarchyNode[] = [];
  let source: SourceLocation | undefined = undefined;

  const fiber = getReactFiber(element);
  if (!fiber) {
    return { hierarchy };
  }

  let current: ReactFiberNode | null = fiber;
  const visitedNames = new Set<string>();

  while (current) {
    const compName = getComponentName(current.type);
    const debugSource = current._debugSource || (current._debugOwner?._debugSource);
    const isCustom = typeof current.type === 'function' || (typeof current.type === 'object' && compName !== null && typeof current.type !== 'string');

    if (compName && compName !== 'div' && compName !== 'span' && isCustom) {
      if (!visitedNames.has(compName)) {
        visitedNames.add(compName);

        let nodeSource: SourceLocation | undefined = undefined;
        if (debugSource) {
          nodeSource = {
            fileName: sanitizeFileName(debugSource.fileName),
            lineNumber: debugSource.lineNumber,
            columnNumber: debugSource.columnNumber,
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

        // Set closest custom component source as primary source
        if (!source && nodeSource) {
          source = nodeSource;
        }
      }
    }

    // Direct element debugSource fallback if no custom component found yet
    if (!source && current._debugSource) {
      source = {
        fileName: sanitizeFileName(current._debugSource.fileName),
        lineNumber: current._debugSource.lineNumber,
        columnNumber: current._debugSource.columnNumber,
        componentName: compName || element.tagName.toLowerCase(),
        framework: 'react',
      };
    }

    current = current.return || null;
  }

  return { source, hierarchy };
}
