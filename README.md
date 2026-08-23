# 🎯 UaiSelect - AI UI Inspector & Prompt Generator

> **Selecciona cualquier elemento visual en tu navegador y conecta tu código fuente directamente con la IA en segundos.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension%20MV3-blue.svg?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ⚡ El Problema que Resuelve UaiSelect

Cuando programas y usas IA (ChatGPT, Claude, Cursor, Gemini), el flujo habitual de inspección tiene demasiada fricción:
$$\text{Ver bug/diseño} \longrightarrow \text{Abrir DevTools (F12)} \longrightarrow \text{Buscar elemento} \longrightarrow \text{Copiar HTML sucio} \longrightarrow \text{Buscar archivo en VS Code} \longrightarrow \text{Redactar prompt}$$

**Con UaiSelect:**
$$\textbf{1 Clic en el elemento} \longrightarrow \textbf{La IA ya conoce el archivo exacto, la línea, las clases Tailwind, la captura visual y el contexto.}$$

---

## ✨ Características Principales

- 🖱️ **Selector Visual Interactivo**: Activa el inspector con `Alt + Shift + X` o desde el popup. Resalta cualquier elemento con overlay y badge de componentes en tiempo real.
- 📁 **Click-to-Source (React / Vue / Vite)**:
  - En **React**: Lee React Fiber (`_debugSource`) y te indica `src/components/Header.tsx:42`.
  - En **Vue / Nuxt / Vite**: Lee atributos de depuración `data-v-inspector`.
  - 🚀 **Botón 1-Clic para abrir en VS Code (`vscode://`) o Cursor (`cursor://`)**.
- 🌳 **Jerarquía de Componentes**: Visualiza el árbol de componentes (ej: `App > DashboardLayout > Navbar > UserAvatar > button`).
- 🎨 **Clases Tailwind & Estilos Computados**:
  - Filtra y destaca automáticamente todas las clases utilitarias de Tailwind.
  - Muestra dimensiones, display/flex, padding, margin, bordes y paleta de colores detectada.
- 📸 **Captura Visual Recortada**: Toma una instantánea nítida del elemento seleccionado lista para IAs multimodales.
- 📝 **Generador Inteligente de Prompts**:
  - 🛠️ *Corregir Bug Visual / Estilos*
  - ⚡ *Añadir Funcionalidad / Interactividad*
  - 🧹 *Refactorizar / Limpiar Código*
  - 🎨 *Convertir / Optimizar a Tailwind CSS*
  - 💡 *Explicar Componente*
  - 💬 *Prompt Personalizado*
- 🚀 **Acciones Rápidas**: Copia al portapapeles o abre directamente en ChatGPT, Claude o Gemini con un solo clic.
- 🔒 **100% Local y Seguro**: Toda la extracción se ejecuta localmente en tu máquina. Ningún dato sale de tu navegador.

---

## 📦 Instalación Rápida en Chrome / Brave / Edge

1. **Clonar o descargar este repositorio**:
   ```bash
   git clone https://github.com/Dearxia1/UaiSelect.git
   cd UaiSelect
   ```

2. **Instalar dependencias y compilar**:
   ```bash
   npm install
   npm run build
   ```

3. **Cargar la extensión en tu navegador**:
   - Abre tu navegador y ve a `chrome://extensions/` (o `brave://extensions/` / `edge://extensions/`).
   - Activa el interruptor de **Modo de desarrollador** (esquina superior derecha).
   - Haz clic en **"Cargar descomprimida"** (Load unpacked).
   - Selecciona la carpeta **`dist`** generada dentro de `UaiSelect`.

¡Listo! Ya verás el icono de **UaiSelect** en tu barra de herramientas.

---

## ⌨️ Atajos y Uso

| Acción | Atajo / Método |
| :--- | :--- |
| **Activar / Desactivar Selector** | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd> (o clic en el icono de la extensión) |
| **Seleccionar Elemento** | Clic izquierdo sobre el elemento |
| **Subir a Elemento Padre** | Tecla <kbd>↑</kbd> (Flecha Arriba) |
| **Bajar a Elemento Hijo** | Tecla <kbd>↓</kbd> (Flecha Abajo) |
| **Cancelar Selección** | Tecla <kbd>Esc</kbd> |

---

## 🛠️ Tecnologías y Arquitectura

- **Manifest**: Chrome Extensions Manifest V3 con SidePanel API.
- **Frontend SidePanel & Popup**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Build Tool**: Vite 6 con Rollup multi-target.
- **Content Overlay**: Shadow DOM aislado para evitar colisiones con el CSS de tus proyectos.

---

## 👨‍💻 Scripts Disponibles

- `npm run build`: Compila TypeScript y genera el bundle listo para producción en la carpeta `dist/`.
- `npm run dev`: Inicia el servidor de desarrollo de Vite.

---

## 📄 Licencia

MIT License © 2026 UaiSelect.
