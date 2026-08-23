import { PromptMode, PromptTemplate, SelectedElementData } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'fix-visual',
    label: 'Corregir Bug Visual / Estilos',
    iconName: 'Wrench',
    description: 'Ajustar alineación, espaciado, colores o comportamiento responsive.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### 🛠️ Tarea: Corregir Estilos / Bug Visual

**Ubicación del Componente:**
${data.source ? `- 📁 Archivo: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework?.toUpperCase() || 'Web'})` : '- 📁 Archivo: No detectado directamente (inspeccionado en el DOM)'}
- ⚛️ Jerarquía: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- 🏷️ Tag HTML: \`<${data.tagName}>\` ${data.id ? `#${data.id}` : ''}

**Clases y Estilos Actuales:**
- Clases Tailwind: \`${data.tailwindClasses.join(' ') || 'Ninguna'}\`
${data.customClasses.length > 0 ? `- Clases personalizadas: \`${data.customClasses.join(' ')}\`` : ''}
- Dimensiones: ${data.computedStyles.width} × ${data.computedStyles.height} (Display: \`${data.computedStyles.display}\`)
- Margins: \`${data.computedStyles.margin}\` | Paddings: \`${data.computedStyles.padding}\`
- Colores: Texto \`${data.computedStyles.color}\`, Fondo \`${data.computedStyles.backgroundColor}\`

**Fragmento HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Instrucción específica del desarrollador:**
${userInstruction || 'Por favor corrige los estilos visuales de este elemento para que se vea limpio, alineado y responsive.'}

Por favor proporciona el código modificado directamente aplicable al archivo origen.`;
    }
  },
  {
    id: 'add-feature',
    label: 'Añadir Funcionalidad / Interactividad',
    iconName: 'Sparkles',
    description: 'Añadir eventos, estados, props o nueva lógica a este componente.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### ⚡ Tarea: Añadir Funcionalidad al Componente

**Ubicación en el Proyecto:**
${data.source ? `- 📁 Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : '- 📁 Archivo: No detectado directamente'}
- ⚛️ Componente: \`${data.hierarchy[data.hierarchy.length - 1]?.name || data.tagName}\`
- 🌳 Jerarquía completa: \`${data.hierarchy.map(h => h.name).join(' > ')}\`

**Estructura del Elemento:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Qué necesito implementar:**
${userInstruction || 'Añade la interactividad necesaria (manejo de estado, callbacks o eventos) a este componente.'}

Indica exactamente en qué archivo y líneas hacer los cambios con las mejores prácticas de TypeScript/React/Vue.`;
    }
  },
  {
    id: 'refactor',
    label: 'Refactorizar / Limpiar Código',
    iconName: 'RefreshCw',
    description: 'Mejorar arquitectura, legibilidad, tipado TypeScript o separar en subcomponentes.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### 🧹 Tarea: Refactorización y Limpieza de Código

**Contexto del Código:**
${data.source ? `- 📁 Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : ''}
- ⚛️ Componente: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Clases aplicadas: \`${data.classList.join(' ') || 'Ninguna'}\`

**HTML Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Objetivo de la refactorización:**
${userInstruction || 'Revisa este componente, simplifica su estructura, elimina redundancias en CSS/Tailwind y optimiza su legibilidad manteniendo su funcionalidad intacta.'}`;
    }
  },
  {
    id: 'tailwind-convert',
    label: 'Convertir / Optimizar Tailwind CSS',
    iconName: 'Palette',
    description: 'Transformar estilos CSS inline o tradicionales a clases utilitarias de Tailwind.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### 🎨 Tarea: Convertir / Optimizar a Tailwind CSS

**Ubicación:** ${data.source ? `\`${data.source.fileName}:${data.source.lineNumber}\`` : 'Elemento DOM'}
**Estilos Computados Detectados:**
- Dimensiones: ${data.computedStyles.width} x ${data.computedStyles.height}
- Display / Flex: \`${data.computedStyles.display}\` ${data.computedStyles.flexDirection ? `(flex-dir: ${data.computedStyles.flexDirection})` : ''}
- Padding / Margin: \`${data.computedStyles.padding}\` / \`${data.computedStyles.margin}\`
- Color / Fondo: \`${data.computedStyles.color}\` / \`${data.computedStyles.backgroundColor}\`
- Borde / Radio: \`${data.computedStyles.border}\` / \`${data.computedStyles.borderRadius}\`

**HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Petición:**
${userInstruction || 'Convierte los estilos de este elemento en clases utilitarias limpias y modernas de Tailwind CSS v3/v4.'}`;
    }
  },
  {
    id: 'explain',
    label: 'Explicar Componente y Estructura',
    iconName: 'HelpCircle',
    description: 'Comprender qué hace el componente, cómo está construido y cómo modificarlo.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### 💡 Explicación de Componente UI

**Datos del elemento:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : ''}
- Jerarquía: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Clases: \`${data.classList.join(' ')}\`

**HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Pregunta del desarrollador:**
${userInstruction || 'Explícame la estructura de este componente, cómo se relaciona con sus padres y cómo está estructurado su diseño.'}`;
    }
  },
  {
    id: 'custom',
    label: 'Prompt Personalizado',
    iconName: 'MessageSquare',
    description: 'Escribe tu propia instrucción con todo el contexto técnico ya incluido.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### 🤖 Instrucción para Asistente de IA

**Contexto del elemento seleccionado en pantalla:**
${data.source ? `- 📁 Archivo origen: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework || 'Web'})` : ''}
- ⚛️ Componente / Jerarquía: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- 🏷️ Tag: \`<${data.tagName}>\` ${data.id ? `#${data.id}` : ''}
- 🎨 Clases: \`${data.classList.join(' ') || 'none'}\`

**Estructura HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Instrucción:**
${userInstruction || 'Analiza este elemento y ayúdame con los cambios necesarios.'}`;
    }
  }
];

export function getTemplateById(id: PromptMode): PromptTemplate {
  return PROMPT_TEMPLATES.find((t) => t.id === id) || PROMPT_TEMPLATES[0];
}

/**
 * Generates a clean, structured JSON payload of the element context
 */
export function generateElementJSON(data: SelectedElementData, userInstruction?: string): string {
  const payload = {
    $schema: "https://uaiselect.dev/schema/element-context.v1.json",
    instruction: userInstruction?.trim() || "Review and update this component based on the provided context.",
    source: data.source
      ? {
          file: data.source.fileName,
          line: data.source.lineNumber,
          column: data.source.columnNumber,
          component: data.source.componentName,
          framework: data.source.framework || "unknown",
        }
      : null,
    component: {
      tag: data.tagName,
      id: data.id || undefined,
      hierarchy: data.hierarchy.map((h) => ({
        name: h.name,
        tag: h.tag,
        isCustomComponent: h.isCustomComponent,
      })),
      classes: {
        tailwind: data.tailwindClasses,
        custom: data.customClasses,
        all: data.classList,
      },
    },
    styles: {
      dimensions: {
        width: data.computedStyles.width,
        height: data.computedStyles.height,
      },
      display: data.computedStyles.display,
      position: data.computedStyles.position,
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
