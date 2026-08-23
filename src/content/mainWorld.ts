// UaiSelect Main World Inspection Engine
// Runs directly in the target webpage context with complete access to React Fiber, Vue, Svelte, and window

(function initUaiSelectMainWorld() {
  if ((window as any).__UAISELECT_MAIN_WORLD_INITIALIZED__) return;
  (window as any).__UAISELECT_MAIN_WORLD_INITIALIZED__ = true;

  // Regex to extract clean file path and line number from stack traces or URLs
  const STACK_URL_REGEX = /(?:https?:\/\/[^/\s]+\/|file:\/\/\/?)((?:src|app|pages|components|lib|views)\/[^?:\s"']+\.[a-zA-Z0-9]+)(?:\?[^:\s"']*)?:(\d+)(?::(\d+))?/;

  function sanitizeFilePath(rawPath: string): string {
    if (!rawPath) return '';
    return rawPath
      .replace(/^webpack:\/\/[^/]*\//, '')
      .replace(/^file:\/\/\/?/, '')
      .replace(/^\/([A-Z]:)/, '$1')
      .replace(/\?.*$/, ''); // remove query params like ?t=17000000
  }

  function getReactFiberFromDOM(element: HTMLElement | null): any {
    if (!element) return null;

    // Check on the element itself and up to 3 parent DOM levels
    let current: HTMLElement | null = element;
    let depth = 0;

    while (current && depth < 4) {
      // 1. Standard React 16/17/18/19 key prefixes
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

      // 2. Check property names including non-enumerable
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
    }
    return null;
  }

  function extractReactSourceFromFiber(fiber: any): any {
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

    // Strategy C: React 19 _debugStack or _debugInfo
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

    // Strategy D: React 19 _debugInfo array
    if (Array.isArray(fiber._debugInfo)) {
      for (const info of fiber._debugInfo) {
        if (info && info.fileName) {
          return {
            fileName: sanitizeFilePath(info.fileName),
            lineNumber: Number(info.lineNumber) || 1,
            columnNumber: info.columnNumber ? Number(info.columnNumber) : undefined,
          };
        }
      }
    }

    return null;
  }

  function extractMetadata(element: HTMLElement) {
    let source: any = null;
    const hierarchy: any[] = [];
    const visitedNames = new Set<string>();

    // 1. REACT FIBER INSPECTION
    const fiber = getReactFiberFromDOM(element);
    if (fiber) {
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

            let nodeSource: any = null;
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

    // 2. VUE / VITE INSPECTION
    let currentElem: HTMLElement | null = element;
    while (currentElem && currentElem !== document.body && currentElem !== document.documentElement) {
      // Check data-v-inspector
      const vInspector = currentElem.getAttribute('data-v-inspector');
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
            framework: 'vue',
          };
          hierarchy.unshift({
            name: compName,
            tag: currentElem.tagName.toLowerCase(),
            source,
            isCustomComponent: true,
          });
        }
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

  // Handle Synchronous Inspection Request
  window.addEventListener('UAISELECT_INSPECT_REQ', (e: any) => {
    const targetId = e.detail?.targetId;
    let target = targetId ? (document.querySelector(`[data-uaiselect-id="${targetId}"]`) as HTMLElement) : null;
    if (!target && (window as any).__UAISELECT_ACTIVE_TARGET__) {
      target = (window as any).__UAISELECT_ACTIVE_TARGET__;
    }

    if (target) {
      const metadata = extractMetadata(target);
      (window as any).__UAISELECT_LAST_METADATA__ = metadata;

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
})();
