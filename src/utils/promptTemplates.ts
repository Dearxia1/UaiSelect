import {
  ComponentDataContext,
  ComponentHierarchyNode,
  PromptMode,
  PromptTemplate,
  SelectedElementData,
} from '../types';

export function normalizeComponentName(rawName: string | null | undefined): string | null {
  if (!rawName || typeof rawName !== 'string') return null;
  let name = rawName.trim();

  // Unwrap common HOCs like Styled(Comp), Memo(Comp), ForwardRef(Comp)
  let prev = '';
  while (name !== prev) {
    prev = name;
    const match = name.match(
      /^(?:Styled|Memo|ForwardRef|Connect|With[A-Za-z0-9_]*|inject|observer)\(([^)]+)\)$/i
    );
    if (match && match[1]) {
      name = match[1].trim();
    }
  }

  return name || null;
}

export function isNoiseComponentName(rawName: string | null | undefined): boolean {
  const name = normalizeComponentName(rawName);
  if (!name) return true;
  if (name.startsWith('<') && name.endsWith('>')) return false; // HTML tag fallback like <button>

  if (name.length <= 2) return true; // Minified: e, N, Y, q, eo, mV, eV, e9, Ht
  if (/^[a-zA-Z_$]{1,2}[0-9]+$/.test(name)) return true; // Minified with numbers: e10, a12
  if (/^_+[a-zA-Z0-9]*$/.test(name)) return true;
  if (/^(styled|motion|primitive)\.[a-zA-Z0-9]+$/i.test(name)) return true; // styled.div, motion.div
  if (
    /^(AnonymousComponent|Component|ForwardRef|Memo|Fragment|Suspense|StrictMode|Profiler|ContextProvider|ContextConsumer|Slot|SlotClone|Presence|Collection|Popper)$/i.test(
      name
    )
  ) {
    return true;
  }
  return false;
}

export function isWrapperComponentName(rawName: string | null | undefined): boolean {
  const name = normalizeComponentName(rawName);
  if (!name) return false;
  if (
    /(Provider|Context|Boundary|Consumer|FeatureFlags|ExperimentScope|Telemetry|Analytics|Profiler|Router|Routes|Route|RouteId|IsDataRoute|Location|Navigation|KeyboardScope|ScopedCommands|FocusScope|Portal|PartialEntry|BaseProviders)$/i.test(
      name
    )
  ) {
    return true;
  }
  if (/^(REACT-PARTIAL|With\(|hoc\(|Connect\(|Relay\()/i.test(name)) {
    return true;
  }
  if (name.includes('Context') || name.includes('Provider') || name.includes('Boundary')) {
    return true;
  }
  return false;
}

export function getCleanHierarchy(
  hierarchy: ComponentHierarchyNode[],
  fallbackTagName?: string
): ComponentHierarchyNode[] {
  if (!hierarchy || hierarchy.length === 0) {
    return fallbackTagName
      ? [{ name: `<${fallbackTagName}>`, tag: fallbackTagName, isCustomComponent: false }]
      : [];
  }

  const seen = new Set<string>();
  const uiNodes: ComponentHierarchyNode[] = [];

  for (const node of hierarchy) {
    const cleanName = normalizeComponentName(node.name) || node.name;
    if (isNoiseComponentName(cleanName)) continue;
    const isWrap = node.isWrapper || isWrapperComponentName(cleanName);
    if (isWrap) continue;

    if (!seen.has(cleanName)) {
      seen.add(cleanName);
      uiNodes.push({
        ...node,
        name: cleanName,
        isWrapper: false,
      });
    }
  }

  if (uiNodes.length > 0) {
    return uiNodes;
  }

  // If all framework components were minified in production, return a clean tag node
  if (fallbackTagName) {
    return [{ name: `<${fallbackTagName}>`, tag: fallbackTagName, isCustomComponent: false }];
  }

  return [];
}

export function getTargetComponentName(data: SelectedElementData): string {
  const clean = getCleanHierarchy(data.hierarchy, data.tagName);
  for (let i = clean.length - 1; i >= 0; i--) {
    if (clean[i].isCustomComponent && !clean[i].name.startsWith('<')) {
      return clean[i].name;
    }
  }
  const normSource = normalizeComponentName(data.source?.componentName);
  if (normSource && !isNoiseComponentName(normSource) && !isWrapperComponentName(normSource)) {
    return normSource;
  }
  return `<${data.tagName}>`;
}

function formatHierarchyBreadcrumb(data: SelectedElementData, maxNodes = 5): string {
  const clean = getCleanHierarchy(data.hierarchy, data.tagName);
  if (clean.length === 0) return `\`<${data.tagName}>\``;

  const formatNode = (n: ComponentHierarchyNode) => {
    if (n.source?.fileName) {
      const shortFile = n.source.fileName.split('/').pop();
      return `\`${n.name}\` (${shortFile}:${n.source.lineNumber})`;
    }
    return `\`${n.name}\``;
  };

  if (clean.length <= maxNodes) {
    return clean.map(formatNode).join(' > ');
  }

  const first = clean[0];
  const tail = clean.slice(-(maxNodes - 1));
  const hiddenCount = clean.length - maxNodes;
  return `${formatNode(first)} > ... (+${hiddenCount}) > ${tail.map(formatNode).join(' > ')}`;
}

function formatSearchAnchors(data: SelectedElementData): string {
  const anchors: string[] = [];
  const a = data.anchors;

  if (data.id) anchors.push(`id="#${data.id}"`);
  if (a?.testId) anchors.push(`data-testid="${a.testId}"`);
  if (a?.ariaLabel) anchors.push(`aria-label="${a.ariaLabel}"`);
  if (a?.name) anchors.push(`name="${a.name}"`);
  if (a?.placeholder) anchors.push(`placeholder="${a.placeholder}"`);
  if (a?.role) anchors.push(`role="${a.role}"`);

  const textSample = a?.textAnchor || data.innerTextSnippet;
  if (textSample && textSample.length > 0 && textSample.length <= 70) {
    anchors.push(`texto="${textSample.replace(/"/g, "'")}"`);
  }

  const lines: string[] = [];
  if (anchors.length > 0) {
    lines.push(`- Anclas en código: ${anchors.map((x) => `\`${x}\``).join(' | ')}`);
  }
  if (a?.uniqueSelector) {
    lines.push(`- Selector DOM: \`${a.uniqueSelector}\``);
  }
  return lines.length > 0 ? `${lines.join('\n')}\n` : '';
}

function formatParentContext(data: SelectedElementData): string {
  const p = data.parentContext;
  if (!p) return '';

  const layoutParts = [`display: \`${p.display}\``];
  if (p.flexDirection) layoutParts.push(`dir: \`${p.flexDirection}\``);
  if (p.justifyContent) layoutParts.push(`justify: \`${p.justifyContent}\``);
  if (p.alignItems) layoutParts.push(`align: \`${p.alignItems}\``);
  if (p.gap) layoutParts.push(`gap: \`${p.gap}\``);
  if (p.position) layoutParts.push(`pos: \`${p.position}\``);

  const classesStr = p.classes.length > 0 ? ` | Clases padre: \`${p.classes.slice(0, 8).join(' ')}\`` : '';
  return `- Contenedor Padre (\`<${p.tagName}${p.id ? `#${p.id}` : ''}>\`): ${layoutParts.join(', ')}${classesStr}\n`;
}

function formatLiveClassDiff(data: SelectedElementData): string {
  const diff = data.liveClassChanges;
  if (!diff || (diff.added.length === 0 && diff.removed.length === 0)) return '';

  const lines: string[] = ['\n**Cambios de Clases Previsualizados en el Navegador (Aplicar exactamente):**'];
  if (diff.removed.length > 0) {
    lines.push(`- **Eliminar clases:** \`${diff.removed.join(' ')}\``);
  }
  if (diff.added.length > 0) {
    lines.push(`- **Añadir clases:** \`${diff.added.join(' ')}\``);
  }
  return `${lines.join('\n')}\n`;
}

function formatPinnedReference(pinned?: SelectedElementData | null): string {
  if (!pinned) return '';
  const refName = getTargetComponentName(pinned);
  const refSource = pinned.source ? ` (\`${pinned.source.fileName}:${pinned.source.lineNumber}\`)` : '';
  return `\n**Elemento #2 de Referencia / Comparación:**
- Componente: \`${refName}\` → \`<${pinned.tagName}>\`${refSource}
- Dimensiones: \`${pinned.computedStyles.width} × ${pinned.computedStyles.height}\` | display: \`${pinned.computedStyles.display}\`
- Clases: \`${pinned.classList.join(' ') || 'ninguna'}\`
\`\`\`html
${pinned.outerHTMLSnippet.slice(0, 600)}
\`\`\`\n`;
}

function formatDataContextPrompt(dataContext?: ComponentDataContext): string {
  if (!dataContext) return '';

  const sections: string[] = [];

  if (dataContext.props && Object.keys(dataContext.props).length > 0) {
    sections.push(`- **Props recibidas:**\n\`\`\`json\n${JSON.stringify(dataContext.props, null, 2)}\n\`\`\``);
  }

  if (
    dataContext.state &&
    (Array.isArray(dataContext.state)
      ? dataContext.state.length > 0
      : Object.keys(dataContext.state).length > 0)
  ) {
    sections.push(`- **Estado / Hooks:**\n\`\`\`json\n${JSON.stringify(dataContext.state, null, 2)}\n\`\`\``);
  }

  if (dataContext.events && dataContext.events.length > 0) {
    const eventLines = dataContext.events
      .map((ev) => `  - \`${ev.name}\`: ${ev.handlerName ? `\`${ev.handlerName}\`` : 'attached'}`)
      .join('\n');
    sections.push(`- **Event Listeners:**\n${eventLines}`);
  }

  if (sections.length === 0) return '';

  return `\n**Datos y Estado del Componente:**\n${sections.join('\n')}\n`;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'fix-visual',
    label: 'Estilos / Fix Visual',
    iconName: 'Wrench',
    description: 'Ajustar alineación, espaciado, colores o comportamiento responsive.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const hierarchyStr = formatHierarchyBreadcrumb(data);
      const anchorsStr = formatSearchAnchors(data);
      const parentStr = formatParentContext(data);
      const liveDiffStr = formatLiveClassDiff(data);
      const pinnedStr = formatPinnedReference(pinnedElement);
      const dataCtx = formatDataContextPrompt(data.dataContext);

      return `### Tarea: Corregir Estilos / Layout Visual

**Objetivo Exacto:**
${data.source ? `- Archivo origen: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework?.toUpperCase() || 'UI'})` : `- Componente objetivo: \`${targetName}\``}
- Componente: \`${targetName}\` → elemento \`<${data.tagName}>\`
- Ruta UI: ${hierarchyStr}
${anchorsStr}**Layout y Estilos Actuales:**
- Clases Tailwind: \`${data.tailwindClasses.join(' ') || 'ninguna'}\`
${data.customClasses.length > 0 ? `- Clases CSS: \`${data.customClasses.join(' ')}\`\n` : ''}- Caja del elemento: \`${data.computedStyles.width} × ${data.computedStyles.height}\` | display: \`${data.computedStyles.display}\`${data.computedStyles.flexDirection ? ` (${data.computedStyles.flexDirection})` : ''}${data.computedStyles.gap ? ` | gap: \`${data.computedStyles.gap}\`` : ''}
- Spacing: margin \`${data.computedStyles.margin}\` | padding \`${data.computedStyles.padding}\`
- Colores: texto \`${data.computedStyles.color}\` | fondo \`${data.computedStyles.backgroundColor}\`
${parentStr}${liveDiffStr}${dataCtx}
**HTML del Elemento:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Cambio solicitado:**
${userInstruction?.trim() || (liveDiffStr ? 'Aplica en el archivo fuente los cambios de clases previsualizados en el navegador.' : 'Corrige la alineación, espaciado y diseño visual de este elemento manteniendo consistencia con su contenedor padre.')}

Aplica el cambio únicamente sobre este elemento (o su contenedor inmediato si el layout depende del padre) sin alterar efectos secundarios.`;
    },
  },
  {
    id: 'add-feature',
    label: 'Funcionalidad',
    iconName: 'Sparkles',
    description: 'Añadir eventos, estados, props o nueva lógica a este componente.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const hierarchyStr = formatHierarchyBreadcrumb(data);
      const anchorsStr = formatSearchAnchors(data);
      const liveDiffStr = formatLiveClassDiff(data);
      const pinnedStr = formatPinnedReference(pinnedElement);
      const dataCtx = formatDataContextPrompt(data.dataContext);

      return `### Tarea: Añadir Funcionalidad al Componente

**Ubicación del Componente:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : `- Componente a buscar: \`${targetName}\``}
- Componente objetivo: \`${targetName}\` (\`<${data.tagName}>\`)
- Jerarquía UI: ${hierarchyStr}
${anchorsStr}${liveDiffStr}${dataCtx}
**Estructura Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Requerimiento a implementar:**
${userInstruction?.trim() || 'Añade la interactividad necesaria (manejo de estado, callbacks o eventos) a este elemento.'}

Edita el componente manteniendo el tipado TypeScript y la arquitectura actual del proyecto.`;
    },
  },
  {
    id: 'refactor',
    label: 'Refactorizar',
    iconName: 'RefreshCw',
    description: 'Mejorar arquitectura, legibilidad, tipado TypeScript o separar en subcomponentes.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const hierarchyStr = formatHierarchyBreadcrumb(data);
      const anchorsStr = formatSearchAnchors(data);
      const liveDiffStr = formatLiveClassDiff(data);
      const pinnedStr = formatPinnedReference(pinnedElement);
      const dataCtx = formatDataContextPrompt(data.dataContext);

      return `### Tarea: Refactorizar Componente UI

**Contexto:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`\n` : ''}- Componente: \`${targetName}\` (\`<${data.tagName}>\`)
- Jerarquía UI: ${hierarchyStr}
${anchorsStr}- Clases actuales: \`${data.classList.join(' ') || 'ninguna'}\`
${liveDiffStr}${dataCtx}
**HTML Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Objetivo de refactorización:**
${userInstruction?.trim() || 'Simplifica la estructura de este componente, limpia clases redundantes y mejora su legibilidad manteniendo el comportamiento visual intacto.'}`;
    },
  },
  {
    id: 'tailwind-convert',
    label: 'Tailwind CSS',
    iconName: 'Palette',
    description: 'Transformar estilos CSS inline o tradicionales a clases utilitarias de Tailwind.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const anchorsStr = formatSearchAnchors(data);
      const parentStr = formatParentContext(data);
      const liveDiffStr = formatLiveClassDiff(data);
      const pinnedStr = formatPinnedReference(pinnedElement);

      return `### Tarea: Optimizar / Convertir a Tailwind CSS

**Elemento Objetivo:**
- Componente: \`${targetName}\` ${data.source ? `(\`${data.source.fileName}:${data.source.lineNumber}\`)` : `(\`<${data.tagName}>\`)`}
${anchorsStr}**Estilos Computados Actuales:**
- Dimensiones: \`${data.computedStyles.width} × ${data.computedStyles.height}\`
- Display: \`${data.computedStyles.display}\`${data.computedStyles.flexDirection ? ` (dir: \`${data.computedStyles.flexDirection}\`)` : ''}${data.computedStyles.gap ? ` (gap: \`${data.computedStyles.gap}\`)` : ''}
- Padding / Margin: \`${data.computedStyles.padding}\` / \`${data.computedStyles.margin}\`
- Color / Fondo: \`${data.computedStyles.color}\` / \`${data.computedStyles.backgroundColor}\`
- Borde / Radio: \`${data.computedStyles.border}\` / \`${data.computedStyles.borderRadius}\`
${parentStr}${liveDiffStr}
**HTML Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Petición:**
${userInstruction?.trim() || 'Reemplaza los estilos personalizados o redundantes por clases utilitarias limpias y responsivas de Tailwind CSS.'}`;
    },
  },
  {
    id: 'explain',
    label: 'Explicar UI',
    iconName: 'HelpCircle',
    description: 'Comprender qué hace el componente, cómo está construido y cómo modificarlo.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const hierarchyStr = formatHierarchyBreadcrumb(data);
      const parentStr = formatParentContext(data);
      const pinnedStr = formatPinnedReference(pinnedElement);
      const dataCtx = formatDataContextPrompt(data.dataContext);

      return `### Consulta: Explicación de Componente UI

**Elemento Inspeccionado:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`\n` : ''}- Componente: \`${targetName}\` (\`<${data.tagName}>\`)
- Jerarquía UI: ${hierarchyStr}
- Clases: \`${data.classList.join(' ') || 'ninguna'}\`
${parentStr}${dataCtx}
**HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Pregunta:**
${userInstruction?.trim() || 'Explícame cómo está estructurado este componente, qué props/estados maneja y dónde debería tocar para modificar su diseño o comportamiento.'}`;
    },
  },
  {
    id: 'custom',
    label: 'Personalizado',
    iconName: 'MessageSquare',
    description: 'Escribe tu propia instrucción con el contexto técnico exacto.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string, pinnedElement?: SelectedElementData | null) => {
      const targetName = getTargetComponentName(data);
      const hierarchyStr = formatHierarchyBreadcrumb(data);
      const anchorsStr = formatSearchAnchors(data);
      const parentStr = formatParentContext(data);
      const liveDiffStr = formatLiveClassDiff(data);
      const pinnedStr = formatPinnedReference(pinnedElement);
      const dataCtx = formatDataContextPrompt(data.dataContext);

      return `### Contexto de Edición UI

**Objetivo:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework || 'Web'})\n` : ''}- Componente: \`${targetName}\` (\`<${data.tagName}>\`)
- Jerarquía UI: ${hierarchyStr}
${anchorsStr}- Clases: \`${data.classList.join(' ') || 'none'}\`
${parentStr}${liveDiffStr}${dataCtx}
**HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`
${pinnedStr}
**Instrucción:**
${userInstruction?.trim() || 'Realiza los cambios necesarios sobre este elemento.'}`;
    },
  },
];

export function getTemplateById(id: PromptMode): PromptTemplate {
  return PROMPT_TEMPLATES.find((t) => t.id === id) || PROMPT_TEMPLATES[0];
}

/**
 * Generates a clean, structured JSON payload of the element context
 */
export function generateElementJSON(
  data: SelectedElementData,
  userInstruction?: string,
  pinnedElement?: SelectedElementData | null
): string {
  const cleanHierarchy = getCleanHierarchy(data.hierarchy, data.tagName);
  const targetComponent = getTargetComponentName(data);

  const payload = {
    $schema: 'https://uaiselect.dev/schema/element-context.v1.json',
    instruction:
      userInstruction?.trim() ||
      'Review and update this component based on the provided context.',
    target: {
      componentName: targetComponent,
      tag: data.tagName,
      id: data.id || undefined,
      source: data.source
        ? {
            file: data.source.fileName,
            line: data.source.lineNumber,
            column: data.source.columnNumber,
            framework: data.source.framework || 'unknown',
          }
        : null,
      anchors: data.anchors || undefined,
      liveClassChanges: data.liveClassChanges || undefined,
    },
    referenceElement: pinnedElement
      ? {
          componentName: getTargetComponentName(pinnedElement),
          tag: pinnedElement.tagName,
          source: pinnedElement.source || null,
          classes: pinnedElement.classList,
          dimensions: {
            width: pinnedElement.computedStyles.width,
            height: pinnedElement.computedStyles.height,
          },
        }
      : undefined,
    component: {
      hierarchy: cleanHierarchy.map((h) => ({
        name: h.name,
        tag: h.tag,
        file: h.source ? `${h.source.fileName}:${h.source.lineNumber}` : undefined,
      })),
      classes: {
        tailwind: data.tailwindClasses,
        custom: data.customClasses,
      },
      dataContext: data.dataContext
        ? {
            props: data.dataContext.props || undefined,
            state: data.dataContext.state || undefined,
            events: data.dataContext.events || undefined,
          }
        : undefined,
    },
    styles: {
      dimensions: {
        width: data.computedStyles.width,
        height: data.computedStyles.height,
      },
      display: data.computedStyles.display,
      position: data.computedStyles.position,
      flexDirection: data.computedStyles.flexDirection,
      gap: data.computedStyles.gap,
      padding: data.computedStyles.padding,
      margin: data.computedStyles.margin,
      colors: {
        text: data.computedStyles.color,
        background: data.computedStyles.backgroundColor,
      },
      typography: {
        fontSize: data.computedStyles.fontSize,
        fontFamily: data.computedStyles.fontFamily,
      },
      border: {
        style: data.computedStyles.border,
        radius: data.computedStyles.borderRadius,
      },
      parentContainer: data.parentContext || undefined,
    },
    dom: {
      outerHTML: data.outerHTMLSnippet,
      innerText: data.innerTextSnippet || undefined,
    },
    meta: {
      pageUrl: data.url,
      pageTitle: data.pageTitle,
      timestamp: new Date(data.timestamp).toISOString(),
    },
  };

  return JSON.stringify(payload, null, 2);
}
