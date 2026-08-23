import { PromptMode, PromptTemplate, SelectedElementData } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'fix-visual',
    label: 'Corregir Bug Visual / Estilos',
    iconName: 'Wrench',
    description: 'Ajustar alineación, espaciado, colores o comportamiento responsive.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Tarea: Corregir Estilos / Bug Visual

**Ubicacion del Componente:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework?.toUpperCase() || 'WEB'})` : '- Archivo: No detectado directamente (inspeccionado en el DOM)'}
- Jerarquia: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Tag HTML: \`<${data.tagName}>\` ${data.id ? `#${data.id}` : ''}

**Clases y Estilos Actuales:**
- Clases Tailwind: \`${data.tailwindClasses.join(' ') || 'Ninguna'}\`
${data.customClasses.length > 0 ? `- Clases personalizadas: \`${data.customClasses.join(' ')}\`` : ''}
- Dimensiones: ${data.computedStyles.width} x ${data.computedStyles.height} (Display: \`${data.computedStyles.display}\`)
- Margins: \`${data.computedStyles.margin}\` | Paddings: \`${data.computedStyles.padding}\`
- Colores: Texto \`${data.computedStyles.color}\`, Fondo \`${data.computedStyles.backgroundColor}\`

**Fragmento HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Instruccion del desarrollador:**
${userInstruction || 'Por favor corrige los estilos visuales de este elemento para que se vea limpio, alineado y responsive.'}

Proporciona el codigo modificado directamente aplicable al archivo origen.`;
    }
  },
  {
    id: 'add-feature',
    label: 'Añadir Funcionalidad / Interactividad',
    iconName: 'Sparkles',
    description: 'Añadir eventos, estados, props o nueva lógica a este componente.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Tarea: Añadir Funcionalidad al Componente

**Ubicacion en el Proyecto:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : '- Archivo: No detectado directamente'}
- Componente: \`${data.hierarchy[data.hierarchy.length - 1]?.name || data.tagName}\`
- Jerarquia completa: \`${data.hierarchy.map(h => h.name).join(' > ')}\`

**Estructura del Elemento:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Requerimiento a implementar:**
${userInstruction || 'Añade la interactividad necesaria (manejo de estado, callbacks o eventos) a este componente.'}

Indica exactamente en que archivo y lineas hacer los cambios con las mejores practicas de TypeScript/React/Vue.`;
    }
  },
  {
    id: 'refactor',
    label: 'Refactorizar / Limpiar Código',
    iconName: 'RefreshCw',
    description: 'Mejorar arquitectura, legibilidad, tipado TypeScript o separar en subcomponentes.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Tarea: Refactorizacion y Limpieza de Codigo

**Contexto del Codigo:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : ''}
- Componente: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Clases aplicadas: \`${data.classList.join(' ') || 'Ninguna'}\`

**HTML Actual:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Objetivo de la refactorizacion:**
${userInstruction || 'Revisa este componente, simplifica su estructura, elimina redundancias en CSS/Tailwind y optimiza su legibilidad manteniendo su funcionalidad intacta.'}`;
    }
  },
  {
    id: 'tailwind-convert',
    label: 'Convertir / Optimizar Tailwind CSS',
    iconName: 'Palette',
    description: 'Transformar estilos CSS inline o tradicionales a clases utilitarias de Tailwind.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Tarea: Convertir / Optimizar a Tailwind CSS

**Ubicacion:** ${data.source ? `\`${data.source.fileName}:${data.source.lineNumber}\`` : 'Elemento DOM'}
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

**Peticion:**
${userInstruction || 'Convierte los estilos de este elemento en clases utilitarias limpias y modernas de Tailwind CSS.'}`;
    }
  },
  {
    id: 'explain',
    label: 'Explicar Componente y Estructura',
    iconName: 'HelpCircle',
    description: 'Comprender qué hace el componente, cómo está construido y cómo modificarlo.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Explicacion de Componente UI

**Datos del elemento:**
${data.source ? `- Archivo: \`${data.source.fileName}:${data.source.lineNumber}\`` : ''}
- Jerarquia: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Clases: \`${data.classList.join(' ')}\`

**HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Consulta del desarrollador:**
${userInstruction || 'Explicame la estructura de este componente, como se relaciona con sus padres y como esta estructurado su diseño.'}`;
    }
  },
  {
    id: 'custom',
    label: 'Prompt Personalizado',
    iconName: 'MessageSquare',
    description: 'Escribe tu propia instrucción con todo el contexto técnico ya incluido.',
    generatePrompt: (data: SelectedElementData, userInstruction?: string) => {
      return `### Contexto del Componente UI

**Ubicacion:**
${data.source ? `- Archivo origen: \`${data.source.fileName}:${data.source.lineNumber}\` (${data.source.framework || 'Web'})` : '- Inspeccionado directamente en el DOM'}
- Componente / Jerarquia: \`${data.hierarchy.map(h => h.name).join(' > ')}\`
- Tag: \`<${data.tagName}>\` ${data.id ? `#${data.id}` : ''}
- Clases: \`${data.classList.join(' ') || 'none'}\`

**Estructura HTML:**
\`\`\`html
${data.outerHTMLSnippet}
\`\`\`

**Instruccion:**
${userInstruction || 'Analiza este elemento y ayudame con los cambios necesarios.'}`;
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
