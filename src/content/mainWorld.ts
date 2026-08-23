// UaiSelect Main World Bridge (Runs directly in the page context with full access to React Fiber and window)

function getReactFiber(element: HTMLElement): any {
  const keys = Object.keys(element);
  const fiberKey = keys.find(
    (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')
  );
  if (fiberKey) {
    return (element as any)[fiberKey];
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
  }
  return null;
}

function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  return fileName
    .replace(/^webpack:\/\/[^/]*\//, '')
    .replace(/^file:\/\/\/?/, '')
    .replace(/^\/([A-Z]:)/, '$1');
}

function extractFrameworkMetadata(element: HTMLElement) {
  let source: any = null;
  const hierarchy: any[] = [];
  const visitedNames = new Set<string>();

  // 1. React Fiber Extraction
  const fiber = getReactFiber(element);
  if (fiber) {
    let current = fiber;
    while (current) {
      const compName = getComponentName(current.type);
      const debugSource = current._debugSource || current._debugOwner?._debugSource;
      const isCustom =
        typeof current.type === 'function' ||
        (typeof current.type === 'object' && compName !== null && typeof current.type !== 'string');

      if (compName && compName !== 'div' && compName !== 'span' && isCustom) {
        if (!visitedNames.has(compName)) {
          visitedNames.add(compName);

          let nodeSource: any = null;
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

          if (!source && nodeSource) {
            source = nodeSource;
          }
        }
      }

      if (!source && current._debugSource) {
        source = {
          fileName: sanitizeFileName(current._debugSource.fileName),
          lineNumber: current._debugSource.lineNumber,
          columnNumber: current._debugSource.columnNumber,
          componentName: compName || element.tagName.toLowerCase(),
          framework: 'react',
        };
      }

      current = current.return;
    }
  }

  // 2. Vue Extraction
  const vueComp = (element as any).__vueParentComponent || (element as any).__vue__;
  if (vueComp && vueComp.type) {
    const name = vueComp.type.name || vueComp.type.__name || 'VueComponent';
    if (!source) {
      source = {
        fileName: vueComp.type.__file ? sanitizeFileName(vueComp.type.__file) : 'Component.vue',
        lineNumber: 1,
        componentName: name,
        framework: 'vue',
      };
    }
    if (!hierarchy.some((h) => h.name === name)) {
      hierarchy.unshift({
        name,
        tag: element.tagName.toLowerCase(),
        source,
        isCustomComponent: true,
      });
    }
  }

  // 3. Svelte Extraction
  const svelteMeta = (element as any).__svelte_meta;
  if (svelteMeta && svelteMeta.loc && !source) {
    source = {
      fileName: sanitizeFileName(svelteMeta.loc.file),
      lineNumber: svelteMeta.loc.line,
      columnNumber: svelteMeta.loc.column,
      componentName: svelteMeta.loc.file.split('/').pop()?.replace(/\.[^.]+$/, '') || 'SvelteComponent',
      framework: 'svelte',
    };
    hierarchy.unshift({
      name: source.componentName,
      tag: element.tagName.toLowerCase(),
      source,
      isCustomComponent: true,
    });
  }

  return { source, hierarchy };
}

// Listen for inspect requests from content script
window.addEventListener('UAISELECT_INSPECT_REQ', (e: any) => {
  const targetId = e.detail?.targetId;
  const target = document.querySelector(`[data-uaiselect-id="${targetId}"]`) as HTMLElement;

  if (target) {
    const metadata = extractFrameworkMetadata(target);
    window.dispatchEvent(
      new CustomEvent('UAISELECT_INSPECT_RES', {
        detail: {
          targetId,
          metadata,
        },
      })
    );
  }
});
