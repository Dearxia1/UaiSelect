import { getCurrentElement } from './bridge.js';
import { generatePrompt } from './promptGenerator.js';
import { spawn } from 'node:child_process';
import path from 'node:path';
export function handleGetSelectedElement() {
    const element = getCurrentElement();
    if (!element) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No element has been selected yet in the browser. Activate UaiSelect in your browser (Alt+Shift+X) and click on an element to inspect it.',
                },
            ],
        };
    }
    const componentName = element.source?.componentName ||
        (element.hierarchy.length > 0 ? element.hierarchy.find((h) => h.isCustomComponent)?.name || element.hierarchy[0]?.name : `<${element.tagName}>`);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    componentName,
                    source: element.source || null,
                    tagName: element.tagName,
                    id: element.id || null,
                    className: element.className || null,
                    tailwindClasses: element.tailwindClasses,
                    customClasses: element.customClasses,
                    hierarchy: element.hierarchy,
                    dataContext: element.dataContext || null,
                    rect: element.rect,
                    url: element.url,
                    pageTitle: element.pageTitle,
                    outerHTMLSnippet: element.outerHTMLSnippet,
                    hasScreenshot: Boolean(element.screenshotUrl || element.fullPageScreenshotUrl),
                    timestamp: element.timestamp,
                }, null, 2),
            },
        ],
    };
}
export function handleGetElementPrompt(args) {
    const element = getCurrentElement();
    if (!element) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No element currently selected. Please inspect an element in your browser using UaiSelect first.',
                },
            ],
        };
    }
    const prompt = generatePrompt(element, args.mode || 'fix-visual', args.userInstruction || '');
    return {
        content: [
            {
                type: 'text',
                text: prompt,
            },
        ],
    };
}
export function handleGetComponentHierarchy() {
    const element = getCurrentElement();
    if (!element) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No element currently selected.',
                },
            ],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    hierarchy: element.hierarchy,
                    source: element.source,
                    componentName: element.source?.componentName || element.tagName,
                }, null, 2),
            },
        ],
    };
}
export function handleGetStylesAndProps() {
    const element = getCurrentElement();
    if (!element) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No element currently selected.',
                },
            ],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    tailwindClasses: element.tailwindClasses,
                    customClasses: element.customClasses,
                    computedStyles: element.computedStyles,
                    props: element.dataContext?.props || null,
                    state: element.dataContext?.state || null,
                    events: element.dataContext?.events || null,
                }, null, 2),
            },
        ],
    };
}
const ALLOWED_EDITORS = ['cursor', 'code', 'windsurf', 'vscodium', 'zed'];
export function handleOpenElementSource(args) {
    const element = getCurrentElement();
    if (!element?.source?.fileName) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No source file detected for the currently selected element.',
                },
            ],
        };
    }
    const selectedEditor = ALLOWED_EDITORS.includes(args.editor) ? args.editor : 'cursor';
    const filePath = element.source.fileName;
    const line = Math.max(1, parseInt(String(element.source.lineNumber), 10) || 1);
    const col = Math.max(1, parseInt(String(element.source.columnNumber), 10) || 1);
    // Sanitize path against shell injections and path traversals
    const cleanPath = path.normalize(filePath).replace(/[;&|`$><"']/g, '');
    const target = `${cleanPath}:${line}:${col}`;
    try {
        const child = spawn(selectedEditor, ['-g', target], {
            detached: true,
            stdio: 'ignore',
            shell: process.platform === 'win32',
        });
        child.unref();
        child.on('error', () => {
            if (selectedEditor !== 'code') {
                const fallback = spawn('code', ['-g', target], {
                    detached: true,
                    stdio: 'ignore',
                    shell: process.platform === 'win32',
                });
                fallback.unref();
            }
        });
    }
    catch (err) {
        console.error('Error opening editor:', err);
    }
    return {
        content: [
            {
                type: 'text',
                text: `Opened ${cleanPath} at line ${line} in ${selectedEditor}.`,
            },
        ],
    };
}
