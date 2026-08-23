<div align="center">

# 🎯 UaiSelect

**The AI UI Inspector & Prompt Generator for Modern Web Developers**

*Selecciona cualquier elemento visual en tu navegador y conecta tu código fuente directamente con la IA.*

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension%20MV3-blue.svg?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Firefox Addon](https://img.shields.io/badge/Firefox-WebExtension-orange.svg?logo=firefox&logoColor=white)](https://addons.mozilla.org/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Apoyar%20Proyecto-ff5e5b.svg?logo=ko-fi&logoColor=white)](https://ko-fi.com/danielmejiaruales)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

</div>

---

## ⚡ El Problema vs. La Solución

### ❌ Flujo Tradicional (Fricción y pérdida de tiempo)

```mermaid
flowchart LR
    A[Ver bug o diseño] --> B[Abrir DevTools F12]
    B --> C[Buscar elemento en el DOM]
    C --> D[Copiar HTML y clases]
    D --> E[Buscar archivo en VS Code]
    E --> F[Redactar prompt en la IA]
```

### ✅ Con UaiSelect (1 Clic, flujo instantáneo)

```mermaid
flowchart LR
    A[Alt + Shift + X] --> B[Clic en el elemento]
    B --> C1[📁 Archivo y Línea: Header.tsx:42]
    B --> C2[🎨 Clases Tailwind y CSS]
    B --> C3[📸 Captura visual recortada]
    B --> C4[🤖 Prompt estructurado / JSON]
    C1 & C2 & C3 & C4 --> D[ChatGPT / Claude / Cursor / Gemini]
```

---

## ✨ Características Principales

| Característica | Descripción |
| :--- | :--- |
| 🎯 **Inspector Visual** | Overlay aislado con Shadow DOM. Muestra badges en tiempo real con nombre de componente, archivo y dimensiones. |
| 📁 **Click-to-Source** | Detecta automáticamente la ubicación real del archivo (`src/components/Header.tsx:42`) mediante React Fiber (`_debugSource`) y Vite Inspector (`data-v-inspector`). |
| 🚀 **Deep Linking IDE** | Botones de 1 clic para abrir el archivo directamente en **VS Code** (`vscode://`) o **Cursor** (`cursor://`). |
| 🌳 **Jerarquía de Componentes** | Visualiza la ruta completa del componente (`App > DashboardLayout > Navbar > UserAvatar > button`). |
| 🎨 **Extracción Tailwind & CSS** | Filtra clases utilitarias de Tailwind, detecta dimensiones, display/flex, padding, margin y paleta de colores. |
| 📸 **Captura Recortada** | Genera una captura de pantalla nítida y ajustada al elemento considerando la escala y el DPR de la pantalla. |
| 🤖 **Modo Dual: Prompts & JSON** | Genera prompts optimizados con presets (*Fix Visual*, *Feature*, *Refactor*, *Tailwind*, *Explain*) o exporta un payload **JSON estructurado** para APIs y agentes. |
| 🔒 **100% Privado y Local** | Toda la extracción y procesamiento se realiza en tu máquina local. Ningún dato sale de tu navegador. |

---

## 🏗️ Arquitectura Técnica

```mermaid
graph TD
    subgraph Browser["🌐 Navegador Web (Página en Desarrollo)"]
        CS["Content Script: Overlay & Mouse Tracker"]
        EXTR["Extractores: React Fiber / Vue / DOM Metadata"]
        CS --> EXTR
    end

    subgraph Core["⚙️ UaiSelect Core (Manifest V3)"]
        SW["Background Service Worker"]
        CAP["Screen Capture Engine"]
        SW --> CAP
    end

    subgraph UI["💻 Interfaz de Usuario"]
        SP["Side Panel / Sidebar UI (React + Tailwind)"]
        PG["Prompt & JSON Generator"]
        SP --> PG
    end

    CS <-->|Chrome Messaging| SW
    SW <-->|Chrome Messaging| SP
    PG -->|vscode:// / cursor://| IDE["VS Code / Cursor IDE"]
    PG -->|Clipboard / Direct Link| AI["ChatGPT / Claude / Gemini / Cursor"]
```

---

## 📦 Instalación

### 🌐 Google Chrome / Brave / Microsoft Edge / Opera

1. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/Dearxia1/UaiSelect.git
   cd UaiSelect
   npm install
   npm run build
   ```
2. Abre `chrome://extensions/` en tu navegador.
3. Activa el **Modo de desarrollador** (arriba a la derecha).
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta **`dist`**.

---

### 🦊 Mozilla Firefox

1. **Compilar el proyecto:**
   ```bash
   npm run build
   ```
2. En Firefox, ingresa a `about:debugging#/runtime/this-firefox`.
3. Haz clic en **Cargar complemento temporal...**.
4. Selecciona el archivo **`dist-firefox/manifest.json`**.

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd> | Activar / Desactivar el inspector visual |
| <kbd>Clic Izquierdo</kbd> | Seleccionar elemento y abrir panel lateral |
| <kbd>↑</kbd> (Flecha Arriba) | Subir al elemento padre en el DOM |
| <kbd>↓</kbd> (Flecha Abajo) | Bajar al primer elemento hijo |
| <kbd>Esc</kbd> | Cancelar y salir del modo selección |

---

## 🛠️ Scripts de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar versiones para producción (Chrome en dist/ y Firefox en dist-firefox/)
npm run build

# Generar archivos .zip listos para subir a las tiendas oficiales
npm run package
```

---

## ☕ Apoya el Proyecto

UaiSelect es un proyecto 100% de código abierto y gratuito. Si te ayuda a ahorrar tiempo en tu día a día como desarrollador, puedes invitarme un café:

<div align="center">

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/danielmejiaruales)

</div>

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
