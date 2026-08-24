#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { startLocalBridge, getCurrentElement } from './bridge.js';
import {
  handleGetSelectedElement,
  handleGetElementPrompt,
  handleGetComponentHierarchy,
  handleGetStylesAndProps,
  handleOpenElementSource,
} from './tools.js';

// Start Local Bridge Server in parallel
startLocalBridge().catch(() => {});

// Initialize MCP Server
const server = new Server(
  {
    name: 'uaiselect-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 1. List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_selected_element',
        description:
          'Retrieves the currently selected UI element from the browser via UaiSelect. Returns component name, exact file path (e.g. src/components/Header.tsx:42), HTML snippet, Tailwind classes, props, and state.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_element_prompt',
        description:
          'Generates a comprehensive, structured prompt for modifying, fixing, refactoring, or explaining the currently selected UI element.',
        inputSchema: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              enum: ['fix-visual', 'add-feature', 'refactor', 'tailwind-convert', 'custom', 'explain'],
              description: 'The task mode for prompt generation (default: fix-visual)',
            },
            userInstruction: {
              type: 'string',
              description: 'Optional custom instruction describing the desired change or fix',
            },
          },
        },
      },
      {
        name: 'get_component_hierarchy',
        description:
          'Returns the full React / Vue component hierarchy tree from root to the selected UI element.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_element_styles_and_props',
        description:
          'Returns the computed styles, Tailwind classes, and extracted React / Vue props and state of the inspected element.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'open_element_source',
        description:
          'Opens the detected source file of the currently selected element in the editor at the exact line number.',
        inputSchema: {
          type: 'object',
          properties: {
            editor: {
              type: 'string',
              enum: ['cursor', 'code', 'windsurf', 'vscodium', 'zed'],
              description: 'The editor to open the file in (default: cursor)',
            },
          },
        },
      },
    ],
  };
});

// 2. Call Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_selected_element':
      return handleGetSelectedElement();

    case 'get_element_prompt':
      return handleGetElementPrompt(args as any || {});

    case 'get_component_hierarchy':
      return handleGetComponentHierarchy();

    case 'get_element_styles_and_props':
      return handleGetStylesAndProps();

    case 'open_element_source':
      return handleOpenElementSource(args as any || {});

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 3. List Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'uaiselect://current-element',
        name: 'Current Selected UI Element',
        mimeType: 'application/json',
        description: 'Live JSON data of the currently inspected UI element from UaiSelect.',
      },
    ],
  };
});

// 4. Read Resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'uaiselect://current-element') {
    const elem = getCurrentElement();
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify(elem || { status: 'none', message: 'No element selected yet' }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${request.params.uri}`);
});

// Connect to stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal MCP server error:', err);
  process.exit(1);
});
