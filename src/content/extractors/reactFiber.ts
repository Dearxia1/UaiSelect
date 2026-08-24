import { ComponentHierarchyNode, SourceLocation } from '../../types';

// Inlined Main World Bridge Script for instant synchronous execution in the page context
const MAIN_WORLD_BRIDGE_SCRIPT = `
(function() {
  if (window.__UAISELECT_BRIDGE_READY__) return;
  window.__UAISELECT_BRIDGE_READY__ = true;

  function cleanPath(p) {
    if (!p || typeof p !== 'string') return '';
    var path = p.replace(/\\\\/g, '/');
    path = path.replace(/^\/@fs\//, '/');
    path = path.replace(/\?.*$/, '');
    path = path.replace(/^webpack:\/\/[^/]*\//, '');
    path = path.replace(/^file:\/\/\/?/, '');
    path = path.replace(/^\/([a-zA-Z]:)/, '$1');
    return path;
  }

  function getComponentName(type) {
    if (!type) return null;
    if (typeof type === 'string') return type;
    if (typeof type === 'function') return type.displayName || type.name || 'Component';
    if (typeof type === 'object') {
      if (type.displayName) return type.displayName;
      if (type.name) return type.name;
      if (type.render) return type.render.displayName || type.render.name || 'ForwardRef';
      if (type.type) return getComponentName(type.type);
    }
    return null;
  }

  function findFiber(node) {
    var curr = node;
    var depth = 0;
    while (curr && depth < 6) {
      var keys = Object.keys(curr);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')) {
          var fiber = curr[k];
          if (fiber) return fiber;
        }
      }
      curr = curr.parentElement;
      depth++;
    }
    return null;
  }

  function extractFiberSource(fiber) {
    if (!fiber) return null;

    // 1. Standard _debugSource (React 16, 17, 18, Vite Babel, Next.js)
    var dbg = fiber._debugSource || (fiber._debugOwner && fiber._debugOwner._debugSource);
    if (dbg && dbg.fileName) {
      return {
        fileName: cleanPath(dbg.fileName),
        lineNumber: Number(dbg.lineNumber) || 1,
        columnNumber: Number(dbg.columnNumber) || undefined
      };
    }

    // 2. Props __source / _source (Babel / SWC JSX Dev)
    var props = fiber.memoizedProps || fiber.pendingProps;
    if (props && (props.__source || props._source)) {
      var s = props.__source || props._source;
      if (s.fileName) {
        return {
          fileName: cleanPath(s.fileName),
          lineNumber: Number(s.lineNumber) || 1,
          columnNumber: Number(s.columnNumber) || undefined
        };
      }
    }

    // 3. React 19 _debugInfo array
    if (Array.isArray(fiber._debugInfo)) {
      for (var i = 0; i < fiber._debugInfo.length; i++) {
        var info = fiber._debugInfo[i];
        if (info && typeof info === 'object') {
          if (info.fileName) {
            return {
              fileName: cleanPath(info.fileName),
              lineNumber: Number(info.lineNumber) || 1,
              columnNumber: Number(info.columnNumber) || undefined
            };
          }
          if (typeof info.stack === 'string') {
            var stackMatch = info.stack.match(/(?:https?:\\/\\/[^/\\s]+\\/|file:\\/\\/\\/?)((?:src|app|pages|components|lib|views)\\/[^?:\\s"']+\\.[a-zA-Z0-9]+)(?:\\?[^:\\s"']*)?:(\\d+)/);
            if (stackMatch) {
              return {
                fileName: cleanPath(stackMatch[1]),
                lineNumber: parseInt(stackMatch[2], 10) || 1
              };
            }
          }
        }
      }
    }

    // 4. React 19 _debugStack regex
    if (fiber._debugStack && typeof fiber._debugStack === 'string') {
      var match = fiber._debugStack.match(/(?:https?:\\/\\/[^/\\s]+\\/|file:\\/\\/\\/?)((?:src|app|pages|components|lib|views)\\/[^?:\\s"']+\\.[a-zA-Z0-9]+)(?:\\?[^:\\s"']*)?:(\\d+)/);
      if (match) {
        return {
          fileName: cleanPath(match[1]),
          lineNumber: parseInt(match[2], 10) || 1
        };
      }
    }

    return null;
  }

  document.addEventListener('UAISELECT_INSPECT_DOM_EVENT', function(e) {
    var target = e.target;
    if (!target) return;

    var result = { source: null, hierarchy: [] };
    var visitedNames = {};

    // 1. React Fiber Traversal
    var fiber = findFiber(target);
    if (fiber) {
      var current = fiber;
      while (current) {
        var compName = getComponentName(current.type);
        var src = extractFiberSource(current);
        var isCustom = typeof current.type === 'function' || (typeof current.type === 'object' && compName !== null && typeof current.type !== 'string');

        if (compName && compName !== 'div' && compName !== 'span' && isCustom) {
          if (!visitedNames[compName]) {
            visitedNames[compName] = true;
            var nodeSource = null;
            if (src) {
              nodeSource = {
                fileName: src.fileName,
                lineNumber: src.lineNumber,
                columnNumber: src.columnNumber,
                componentName: compName,
                framework: 'react'
              };
            }

            result.hierarchy.unshift({
              name: compName,
              tag: typeof current.type === 'string' ? current.type : 'component',
              source: nodeSource,
              isCustomComponent: true
            });

            if (!result.source && nodeSource) {
              result.source = nodeSource;
            }
          }
        }

        if (!result.source && src) {
          result.source = {
            fileName: src.fileName,
            lineNumber: src.lineNumber,
            columnNumber: src.columnNumber,
            componentName: compName || target.tagName.toLowerCase(),
            framework: 'react'
          };
        }

        current = current.return;
      }
    }

    // 2. Vue / Vite / React Inspector Traversal
    var currElem = target;
    while (currElem && currElem !== document.body && currElem !== document.documentElement) {
      var vInspector = currElem.getAttribute('data-v-inspector') || 
                       currElem.getAttribute('data-source') || 
                       currElem.getAttribute('data-loc') ||
                       currElem.getAttribute('data-locator') ||
                       currElem.getAttribute('data-source-loc');
      
      // Some React inspectors use separate attributes
      var reactInspectorPath = currElem.getAttribute('data-inspector-relative-path');
      var reactInspectorLine = currElem.getAttribute('data-inspector-line');

      if (vInspector && !result.source) {
        var parts = vInspector.split(':');
        if (parts.length >= 2) {
          var fName = parts[0];
          var lNum = parseInt(parts[1], 10) || 1;
          if (parts[0].length === 1 && parts.length >= 3) { // Handle Windows paths like C:\...
            fName = parts[0] + ':' + parts[1];
            lNum = parseInt(parts[2], 10) || 1;
          }
          var cName = fName.split('/').pop().replace(/\.[^.]+$/, '') || 'Component';
          result.source = {
            fileName: cleanPath(fName),
            lineNumber: lNum,
            componentName: cName,
            framework: fName.endsWith('.vue') ? 'vue' : 'react'
          };
          result.hierarchy.unshift({
            name: cName,
            tag: currElem.tagName.toLowerCase(),
            source: result.source,
            isCustomComponent: true
          });
        }
      } else if (reactInspectorPath && reactInspectorLine && !result.source) {
         var cName = reactInspectorPath.split('/').pop().replace(/\.[^.]+$/, '') || 'Component';
         result.source = {
           fileName: cleanPath(reactInspectorPath),
           lineNumber: parseInt(reactInspectorLine, 10) || 1,
           componentName: cName,
           framework: 'react'
         };
         result.hierarchy.unshift({
            name: cName,
            tag: currElem.tagName.toLowerCase(),
            source: result.source,
            isCustomComponent: true
         });
      }

      var vueComp = currElem.__vueParentComponent || currElem.__vue__;
      if (vueComp && vueComp.type && !result.source) {
        var vName = vueComp.type.name || vueComp.type.__name || 'VueComponent';
        if (vueComp.type.__file) {
          result.source = {
            fileName: cleanPath(vueComp.type.__file),
            lineNumber: 1,
            componentName: vName,
            framework: 'vue'
          };
        }
        result.hierarchy.unshift({
          name: vName,
          tag: currElem.tagName.toLowerCase(),
          source: result.source,
          isCustomComponent: true
        });
      }

      currElem = currElem.parentElement;
    }

    target.setAttribute('data-uaiselect-result', JSON.stringify(result));
  }, true);
})();
`;

function ensureMainWorldBridge() {
  if (document.getElementById('uaiselect-inline-bridge')) return;
  if (document.getElementById('uaiselect-main-world-bridge')) return;
  try {
    const scriptSrc = document.createElement('script');
    scriptSrc.id = 'uaiselect-main-world-bridge';
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      scriptSrc.src = chrome.runtime.getURL('mainWorld.js');
      scriptSrc.onload = function() {
        scriptSrc.setAttribute('data-loaded', 'true');
      };
      (document.head || document.documentElement).appendChild(scriptSrc);
    } else {
      const scriptInline = document.createElement('script');
      scriptInline.id = 'uaiselect-inline-bridge';
      scriptInline.textContent = MAIN_WORLD_BRIDGE_SCRIPT;
      (document.head || document.documentElement).appendChild(scriptInline);
    }
  } catch (err) {
    console.error('UaiSelect bridge error:', err);
  }
}

/**
 * Extracts React & Framework metadata synchronously using the DOM Bridge
 */
export function extractReactMetadata(element: HTMLElement): {
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
} {
  ensureMainWorldBridge();

  try {
    // Dispatch synchronous DOM event on the target element
    // Note: Firefox might need a small delay if the script was injected via SRC.
    // However, since it's user-triggered (click), it should be loaded by now.
    element.dispatchEvent(
      new CustomEvent('UAISELECT_INSPECT_DOM_EVENT', {
        bubbles: true,
        cancelable: true,
      })
    );
    // Also dispatch the alternative event name from mainWorld.ts just in case
    window.dispatchEvent(
      new CustomEvent('UAISELECT_INSPECT_REQ', {
        detail: { targetId: element.getAttribute('data-uaiselect-id') }
      })
    );

    const raw = element.getAttribute('data-uaiselect-result');
    element.removeAttribute('data-uaiselect-result');

    if (raw) {
      const data = JSON.parse(raw);
      return {
        source: data.source || undefined,
        hierarchy: data.hierarchy || [],
      };
    }
  } catch (err) {
    console.error('Error querying UaiSelect DOM bridge:', err);
  }

  return { hierarchy: [] };
}
