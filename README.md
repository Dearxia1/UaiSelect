<div align="center">

# UaiSelect

**AI UI Inspector & Context Extractor for Web Developers**

*Selecciona cualquier elemento visual en tu navegador y extrae su contexto de código fuente directamente para asistentes de IA.*

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension%20MV3-blue.svg?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Firefox Addon](https://img.shields.io/badge/Firefox-WebExtension-orange.svg?logo=firefox&logoColor=white)](https://addons.mozilla.org/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b.svg?logo=ko-fi&logoColor=white)](https://ko-fi.com/danielmejiaruales)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

</div>

---

## Flujo de Trabajo

### Flujo Tradicional (DevTools)

```mermaid
flowchart LR
    A[Detectar cambio o bug] --> B[Abrir DevTools F12]
    B --> C[Inspeccionar elemento]
    C --> D[Copiar HTML y estilos]
    D --> E[Buscar archivo en el editor]
    E --> F[Redactar prompt a la IA]
```

### Con UaiSelect

```mermaid
flowchart LR
    A[Alt + Shift + X] --> B[Clic en elemento]
    B --> C1[Archivo y Línea: Header.tsx:42]
    B --> C2[Clases Tailwind y estilos]
    B --> C3[Captura visual recortada]
    B --> C4[Prompt estructurado / JSON]
    C1 & C2 & C3 & C4 --> D[ChatGPT / Claude / Cursor / Gemini]
```

---

## Características

| Característica | Descripción |
| :--- | :--- |
| **Inspector Visual** | Overlay aislado en Shadow DOM con detección en tiempo real de componente, archivo y métricas. |
| **Click-to-Source** | Obtención del archivo y línea exacta (`src/components/Header.tsx:42`) mediante React Fiber (`_debugSource`) y Vite Inspector (`data-v-inspector`). |
| **Integración con IDE** | Acceso directo en 1 clic a **VS Code** (`vscode://`) y **Cursor** (`cursor://`). |
| **Jerarquía de Componentes** | Ruta del árbol de componentes (`App > DashboardLayout > Navbar > UserAvatar > button`). |
| **Clases Tailwind & CSS** | Clasificación de clases utilitarias de Tailwind, dimensiones, padding, margin y paleta de colores. |
| **Captura Visual Recortada** | Instantánea ajustada al elemento respetando la escala y el DPR de la pantalla. |
| **Doble Formato: Prompt & JSON** | Generación de prompts en Markdown con presets técnicos o exportación en **JSON estructurado** para APIs y agentes. |
| **Procesamiento 100% Local** | La extracción se ejecuta exclusivamente en el navegador local. |

---

## Arquitectura

```mermaid
graph TD
    subgraph Browser["Navegador Web (Página en Desarrollo)"]
        CS["Content Script: Overlay & Tracker"]
        EXTR["Extractores: React Fiber / Vue / DOM Metadata"]
        CS --> EXTR
    end

    subgraph Core["UaiSelect Core (Manifest V3)"]
        SW["Background Service Worker"]
        CAP["Screen Capture Engine"]
        SW --> CAP
    end

    subgraph UI["Interfaz de Usuario"]
        SP["Side Panel / Sidebar (React + Tailwind)"]
        PG["Prompt & JSON Generator"]
        SP --> PG
    end

    CS <-->|Chrome Messaging| SW
    SW <-->|Chrome Messaging| SP
    PG -->|vscode:// / cursor://| IDE["VS Code / Cursor IDE"]
    PG -->|Clipboard / Direct Link| AI["ChatGPT / Claude / Gemini / Cursor"]
```

---

## Instalación

### Google Chrome / Brave / Microsoft Edge / Opera

1. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/Dearxia1/UaiSelect.git
   cd UaiSelect
   npm install
   npm run build
   ```
2. Accede a `chrome://extensions/` en tu navegador.
3. Activa el **Modo de desarrollador** en la esquina superior derecha.
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta **`dist`**.

---

### Mozilla Firefox

1. **Compilar el proyecto:**
   ```bash
   npm run build
   ```
2. En Firefox, ingresa a `about:debugging#/runtime/this-firefox`.
3. Haz clic en **Cargar complemento temporal...**.
4. Selecciona el archivo **`dist-firefox/manifest.json`**.

---

## Atajos de Teclado

| Atajo | Acción |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd> | Activar / Desactivar el inspector visual |
| <kbd>Clic Izquierdo</kbd> | Seleccionar elemento y abrir panel lateral |
| <kbd>↑</kbd> (Flecha Arriba) | Seleccionar elemento padre en el DOM |
| <kbd>↓</kbd> (Flecha Abajo) | Seleccionar primer elemento hijo |
| <kbd>Esc</kbd> | Cancelar y salir del modo selección |

---

## Scripts

```bash
# Servidor de desarrollo
npm run dev

# Compilación de producción (Chrome en dist/ y Firefox en dist-firefox/)
npm run build

# Empaquetado de archivos .zip para tiendas
npm run package
```

---

## Apoyo

UaiSelect es un proyecto de código abierto y de uso gratuito. Si te resulta útil en tu flujo de trabajo, puedes apoyar su desarrollo:

<div align="center">

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/danielmejiaruales)

</div>

---

## Licencia

MIT License. Consulta el archivo [LICENSE](LICENSE) para más detalles.
