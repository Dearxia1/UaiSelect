# uaiselect-mcp

Official Model Context Protocol (MCP) Server for **[UaiSelect](https://github.com/Dearxia1/UaiSelect)** — AI UI Element Inspector & Code Context Extractor.

Connect your browser element inspector directly to **Claude Code**, **Cursor**, **Claude Desktop**, **Windsurf**, and **Antigravity**.

---

## ⚡ Quick Setup with npx

You do **not** need to install this package manually. Simply configure it in your AI editor:

### Claude Code for VS Code (`.mcp.json`)
Add to `.mcp.json` in your workspace root:
```json
{
  "mcpServers": {
    "uaiselect": {
      "command": "npx",
      "args": ["-y", "uaiselect-mcp"]
    }
  }
}
```

### Cursor IDE (`~/.cursor/mcp.json` or Settings > Features > MCP)
```json
{
  "mcpServers": {
    "uaiselect": {
      "command": "npx",
      "args": ["-y", "uaiselect-mcp"]
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "uaiselect": {
      "command": "npx",
      "args": ["-y", "uaiselect-mcp"]
    }
  }
}
```

---

## 🛠️ MCP Tools

* **`get_selected_element`**: Returns the currently inspected element in your browser, including React/Vue component name, exact file path (e.g. `src/components/Header.tsx:42`), HTML snippet, Tailwind classes, props, and state.
* **`get_element_prompt`**: Generates a structured task prompt (`fix-visual`, `add-feature`, `refactor`, `tailwind-convert`, `explain`).
* **`get_component_hierarchy`**: Returns the component tree path from root to the selected UI element.
* **`get_element_styles_and_props`**: Returns computed styles, custom classes, React/Vue props, and state hooks.
* **`open_element_source`**: Automatically opens the detected source file in Cursor or VS Code at the exact line number.

---

## 🌐 Browser Extension

Install the UaiSelect browser extension for Chrome or Firefox from [GitHub](https://github.com/Dearxia1/UaiSelect).
