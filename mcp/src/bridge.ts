import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { SelectedElementData } from './types.js';

export const BRIDGE_PORT = 42123;
export const BRIDGE_HOST = '127.0.0.1';

// In-memory store of the latest selected element
let currentElement: SelectedElementData | null = null;
let changeListeners: Array<(elem: SelectedElementData) => void> = [];

const CACHE_DIR = path.join(os.homedir(), '.uaiselect');
const CACHE_FILE = path.join(CACHE_DIR, 'latest-element.json');

// Try loading cached element on start
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    currentElement = JSON.parse(raw);
  }
} catch {}

export function getCurrentElement(): SelectedElementData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      if (raw && raw.trim().length > 0) {
        currentElement = JSON.parse(raw);
      }
    }
  } catch {}
  return currentElement;
}

export function setCurrentElement(data: SelectedElementData) {
  currentElement = data;

  // Persist to disk
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}

  // Notify listeners
  for (const listener of changeListeners) {
    try {
      listener(data);
    } catch {}
  }
}

export function onElementChange(listener: (elem: SelectedElementData) => void) {
  changeListeners.push(listener);
  return () => {
    changeListeners = changeListeners.filter((l) => l !== listener);
  };
}

export function startLocalBridge(port = BRIDGE_PORT): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = req.url || '/';

      if (url === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'online',
            service: 'UaiSelect MCP Bridge',
            version: '1.0.0',
            port,
            hasElement: currentElement !== null,
            timestamp: Date.now(),
          })
        );
        return;
      }

      if (url === '/api/element' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentElement || { message: 'No element selected yet' }));
        return;
      }

      if (url === '/api/element' && req.method === 'POST') {
        let body = '';
        let tooLarge = false;

        req.on('data', (chunk) => {
          body += chunk;
          // Protect against denial-of-service with payloads exceeding 25MB
          if (body.length > 25 * 1024 * 1024) {
            tooLarge = true;
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Payload Too Large' }));
            req.destroy();
          }
        });

        req.on('end', () => {
          if (tooLarge) return;
          try {
            const parsed = JSON.parse(body) as SelectedElementData;
            if (!parsed || typeof parsed !== 'object' || typeof parsed.tagName !== 'string') {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid element payload format' }));
              return;
            }
            setCurrentElement(parsed);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
          } catch (err: any) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    server.listen(port, BRIDGE_HOST, () => {
      // Bridge started successfully
      resolve(server);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port in use, another instance or bridge might be running
      }
      resolve(server);
    });
  });
}
