import React, { useState } from 'react';
import { FileCode, ExternalLink, Copy, Check, Terminal } from 'lucide-react';
import { SourceLocation } from '../../types';

interface SourceCardProps {
  source?: SourceLocation;
  tagName: string;
  defaultEditor?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  tagName,
  defaultEditor = 'vscode',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!source) return;
    const text = `${source.fileName}:${source.lineNumber}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenEditor = (editorName = defaultEditor) => {
    if (!source) return;
    chrome.runtime.sendMessage({
      type: 'OPEN_IN_EDITOR',
      source,
      editor: editorName,
    });
  };

  if (!source) {
    return (
      <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <Terminal className="w-3.5 h-3.5 text-zinc-500" />
          <span>Elemento DOM: <code className="text-zinc-200 font-mono">&lt;{tagName}&gt;</code></span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">
          Ejecuta tu proyecto en modo desarrollo con React/Vite/Vue para detectar archivo y línea.
        </p>
      </div>
    );
  }

  const fileNameOnly = source.fileName.split('/').pop() || source.fileName;
  const directoryPath = source.fileName.substring(0, source.fileName.lastIndexOf('/'));

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-800">
            <FileCode className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-zinc-100">
                {source.componentName || fileNameOnly}
              </span>
              {source.framework && (
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-700/60">
                  {source.framework}
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-zinc-400 truncate max-w-[220px]" title={source.fileName}>
              {directoryPath ? `${directoryPath}/` : ''}<span className="text-white font-semibold">{fileNameOnly}</span>:{source.lineNumber}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
          title="Copiar ruta y línea"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-zinc-900">
        <button
          onClick={() => handleOpenEditor('vscode')}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg text-[11px] font-medium transition-all active:scale-95 cursor-pointer border border-zinc-800"
        >
          <ExternalLink className="w-3 h-3 text-zinc-400" />
          <span>VS Code</span>
        </button>

        <button
          onClick={() => handleOpenEditor('cursor')}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg text-[11px] font-medium transition-all active:scale-95 cursor-pointer border border-zinc-800"
        >
          <ExternalLink className="w-3 h-3 text-zinc-400" />
          <span>Cursor</span>
        </button>
      </div>
    </div>
  );
};
