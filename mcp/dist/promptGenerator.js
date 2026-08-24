export function formatDataContext(data) {
    if (!data.dataContext)
        return '';
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
export function generatePrompt(data, mode = 'fix-visual', userInstruction = '') {
    const componentName = data.source?.componentName ||
        (data.hierarchy.length > 0 ? data.hierarchy.find((h) => h.isCustomComponent)?.name || data.hierarchy[0]?.name : `<${data.tagName}>`);
    const fileLocation = data.source ? `${data.source.fileName}:${data.source.lineNumber}` : 'Ubicación no detectada';
    const customClassesStr = data.customClasses.length > 0 ? `\n- **Clases personalizadas**: \`${data.customClasses.join(' ')}\`` : '';
    const dataContextStr = formatDataContext(data);
    if (mode === 'fix-visual') {
        return `### 🛠️ Tarea: Corregir Estilos Visuales del Componente UI

**Contexto del Elemento Seleccionado:**
- **Componente**: \`${componentName}\`
- **Archivo Origen**: \`${fileLocation}\`
- **Etiqueta HTML**: \`<${data.tagName}>\`
- **Clases Tailwind actuales**: \`${data.tailwindClasses.join(' ') || 'ninguna'}\`${customClassesStr}
- **Dimensiones en pantalla**: \`${data.rect.width}px × ${data.rect.height}px\`
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
- **Nombre**: \`${componentName}\`
- **Archivo**: \`${fileLocation}\`
- **Jerarquía**: ${data.hierarchy.map((h) => `\`${h.name}\``).join(' > ')}
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
- **Componente**: \`${componentName}\`
- **Archivo**: \`${fileLocation}\`
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
- **Clases**: \`${data.classList.join(' ')}\`
${dataContextStr}
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

${userInstruction || 'Realiza las modificaciones solicitadas en el componente.'}`;
}
