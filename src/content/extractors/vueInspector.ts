import { ComponentHierarchyNode, SourceLocation } from '../../types';

/**
 * Parses Vite / Vue Inspector data attribute format: "filepath:line:col"
 */
function parseInspectorAttribute(value: string, framework: SourceLocation['framework']): SourceLocation | undefined {
  if (!value) return undefined;
  
  // Format: "src/components/Button.vue:10:3" or "C:/project/src/App.vue:25:5" or "/@fs/C:/..."
  const parts = value.split(':');
  if (parts.length >= 2) {
    let rawFileName = '';
    let lineNumber = 1;
    let columnNumber: number | undefined = undefined;

    // Handle Windows drive colon (e.g. C:/...)
    if (parts[0].length === 1 && parts.length >= 3) {
      rawFileName = `${parts[0]}:${parts[1]}`;
      lineNumber = parseInt(parts[2], 10) || 1;
      columnNumber = parts[3] ? parseInt(parts[3], 10) : undefined;
    } else {
      rawFileName = parts[0];
      lineNumber = parseInt(parts[1], 10) || 1;
      columnNumber = parts[2] ? parseInt(parts[2], 10) : undefined;
    }

    let fileName = rawFileName.replace(/\\/g, '/');
    fileName = fileName.replace(/^\/@fs\//, '/');
    fileName = fileName.replace(/\?.*$/, '');
    fileName = fileName.replace(/^\/([a-zA-Z]:)/, '$1');

    const componentName = fileName.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Component';

    return {
      fileName,
      lineNumber,
      columnNumber,
      componentName,
      framework,
    };
  }

  return undefined;
}

/**
 * Extracts metadata for Vue, Nuxt, Svelte, Astro, and Vite Inspector attributes
 */
export function extractVueAndViteMetadata(element: HTMLElement): {
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
} {
  const hierarchy: ComponentHierarchyNode[] = [];
  let source: SourceLocation | undefined = undefined;

  let current: HTMLElement | null = element;

  while (current && current !== document.body && current !== document.documentElement) {
    // Check Vite Vue Inspector
    const vueInspector = current.getAttribute('data-v-inspector');
    if (vueInspector && !source) {
      source = parseInspectorAttribute(vueInspector, 'vue');
      if (source?.componentName) {
        hierarchy.unshift({
          name: source.componentName,
          tag: current.tagName.toLowerCase(),
          source,
          isCustomComponent: true,
        });
      }
    }

    // Check Astro source file
    const astroSource = current.getAttribute('data-astro-source-file');
    const astroLoc = current.getAttribute('data-astro-source-loc');
    if (astroSource && !source) {
      const line = astroLoc ? parseInt(astroLoc.split(':')[0], 10) : 1;
      const compName = astroSource.split('/').pop()?.replace(/\.[^.]+$/, '') || 'AstroComponent';
      source = {
        fileName: astroSource,
        lineNumber: line,
        componentName: compName,
        framework: 'unknown',
      };
      hierarchy.unshift({
        name: compName,
        tag: current.tagName.toLowerCase(),
        source,
        isCustomComponent: true,
      });
    }

    // Check Svelte dev inspection
    const svelteInspector = (current as any).__svelte_meta;
    if (svelteInspector && svelteInspector.loc && !source) {
      source = {
        fileName: svelteInspector.loc.file,
        lineNumber: svelteInspector.loc.line,
        columnNumber: svelteInspector.loc.column,
        componentName: svelteInspector.loc.file.split('/').pop()?.replace(/\.[^.]+$/, '') || 'SvelteComponent',
        framework: 'svelte',
      };
      hierarchy.unshift({
        name: source.componentName || 'SvelteComponent',
        tag: current.tagName.toLowerCase(),
        source,
        isCustomComponent: true,
      });
    }

    // Check Vue 3 instance __vueParentComponent
    const vueInstance = (current as any).__vueParentComponent;
    if (vueInstance && vueInstance.type) {
      const name = vueInstance.type.name || vueInstance.type.__name || 'VueComponent';
      if (!hierarchy.some((h) => h.name === name)) {
        hierarchy.unshift({
          name,
          tag: current.tagName.toLowerCase(),
          isCustomComponent: true,
        });
      }
    }

    current = current.parentElement;
  }

  return { source, hierarchy };
}
