import { ComponentHierarchyNode, SelectedElementData } from './types.js';

function getCleanHierarchy(hierarchy: ComponentHierarchyNode[]): ComponentHierarchyNode[] {
  if (!hierarchy || hierarchy.length === 0) return [];
  const uiNodes = hierarchy.filter((n) => !n.isWrapper && n.name.trim().length > 2);
  return uiNodes.length > 0 ? uiNodes : hierarchy.filter((n) => n.name.trim().length > 1);
}

function getTargetComponentName(data: SelectedElementData): string {
  const clean = getCleanHierarchy(data.hierarchy);
  for (let i = clean.length - 1; i >= 0; i--) {
    if (clean[i].isCustomComponent) return clean[i].name;
  }
  if (data.source?.componentName && data.source.componentName.length > 2) {
    return data.source.componentName;
  }
  return `<${data.tagName}>`;
}

export function formatDataContext(data: SelectedElementData): string {
  if (!data.dataContext) return '';
  const { props, state, events } = data.dataContext;
  let text = '';

  if (props && Object.keys(props).length > 0) {
    text += `\n### Props del Componente:\n\`\`\`json\n${JSON.stringify(props, null, 2)}\n\`\`\`\n`;
  }

  if (state && Object.keys(state).length > 0) {
    text += `\n### Estado / Hooks del Componente:\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\`\n`;
  }

  if (events && events.length > 0) {
    text += `\n### Eventos & Handlers:\n${events.map((e) => `- **${e.name}**: \`${e.handlerName || 'handler'}\``).join('\n')}\n`;
  }

  return text;
}

export function generatePrompt(
  data: SelectedElementData,
  mode: 'fix-visual' | 'add-feature' | 'refactor' | 'tailwind-convert' | 'custom' | 'explain' = 'fix-visual',
  userInstruction = ''
): string {
  const componentName = getTargetComponentName(data);
  const cleanHierarchy = getCleanHierarchy(data.hierarchy).slice(-5);
  const hierarchyStr =
    cleanHierarchy.length > 0
      ? cleanHierarchy.map((h) => `\`${h.name}\``).join(' > ')
      : `\`<${data.tagName}>\``;

  const fileLocation = data.source
    ? `${data.source.fileName}:${data.source.lineNumber}`
    : 'Ubicación no detectada';
  const customClassesStr =
    data.customClasses.length > 0
      ? `\n- **Clases personalizadas**: \`${data.customClasses.join(' ')}\``
      : '';
  const parentStr = data.parentContext
    ? `\n- **Contenedor Padre (\`<${data.parentContext.tagName}>\`)**: display \`${data.parentContext.display}\`${data.parentContext.flexDirection ? ` (${data.parentContext.flexDirection})` : ''}${data.parentContext.gap ? `, gap \`${data.parentContext.gap}\`` : ''}`
    : '';
  const selectorStr = data.anchors?.uniqueSelector
    ? `\n- **Selector DOM**: \`${data.anchors.uniqueSelector}\``
    : '';
  const dataContextStr = formatDataContext(data);

  if (mode === 'fix-visual') {
    return `### 🛠️ Tarea: Corregir Estilos Visuales del Componente UI

**Contexto del Elemento Seleccionado:**
- **Componente Objetivo**: \`${componentName}\` (\`<${data.tagName}>\`)
- **Archivo Origen**: \`${fileLocation}\`
- **Jerarquía UI**: ${hierarchyStr}${selectorStr}
- **Clases Tailwind actuales**: \`${data.tailwindClasses.join(' ') || 'ninguna'}\`${customClassesStr}
- **Dimensiones en pantalla**: \`${data.rect.width}px × ${data.rect.height}px\`${parentStr}
${dataContextStr}
**Snippet HTML / JSX Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Instrucción de corrección visual:**
${userInstruction || 'Corrige los estilos visuales del componente asegurando diseño responsivo, alineación limpia y consistencia de diseño.'}

Por favor, modifica directamente el archivo \`${fileLocation}\` aplicando los cambios solicitados.`;
  }

  if (mode === 'add-feature') {
    return `### 🚀 Tarea: Añadir Funcionalidad / Modificar Componente

**Componente Objetivo:**
- **Nombre**: \`${componentName}\` (\`<${data.tagName}>\`)
- **Archivo**: \`${fileLocation}\`
- **Jerarquía UI**: ${hierarchyStr}${selectorStr}
${dataContextStr}
**Código Actual del Elemento:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Requerimiento / Funcionalidad a implementar:**
${userInstruction || 'Añade la nueva funcionalidad requerida manteniendo la arquitectura existente.'}

Por favor, implementa la solución editando \`${fileLocation}\`.`;
  }

  if (mode === 'explain') {
    return `### 💡 Tarea: Explicar y Analizar Componente UI

**Elemento Inspeccionado:**
- **Componente**: \`${componentName}\` (\`<${data.tagName}>\`)
- **Archivo**: \`${fileLocation}\`
- **Jerarquía UI**: ${hierarchyStr}
- **Clases**: \`${data.classList.join(' ')}\`
${dataContextStr}
**Estructura HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

Explica detalladamente la estructura, responsabilidades y estilos aplicados en este componente.`;
  }

  return `### ⚡ Modificación de Componente UI

- **Componente**: \`${componentName}\` (\`${fileLocation}\`)
- **Jerarquía UI**: ${hierarchyStr}${selectorStr}
- **Clases**: \`${data.classList.join(' ')}\`${parentStr}
${dataContextStr}
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

${userInstruction || 'Realiza las modificaciones solicitadas en el componente.'}`;
}
