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
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>Elemento DOM estándar: <code className="text-slate-300 font-mono">&lt;{tagName}&gt;</code></span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          (Para ver archivo y línea exacta, ejecuta tu proyecto en modo desarrollo con React/Vite/Vue).
        </p>
      </div>
    );
  }

  const fileNameOnly = source.fileName.split('/').pop() || source.fileName;
  const directoryPath = source.fileName.substring(0, source.fileName.lastIndexOf('/'));

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-200">
                {source.componentName || fileNameOnly}
              </span>
              {source.framework && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {source.framework}
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate max-w-[220px]" title={source.fileName}>
              {directoryPath ? `${directoryPath}/` : ''}<span className="text-indigo-300 font-bold">{fileNameOnly}</span>:{source.lineNumber}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          title="Copiar ruta y línea"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={() => handleOpenEditor('vscode')}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer border border-slate-700"
        >
          <ExternalLink className="w-3 h-3 text-sky-400" />
          <span>Abrir en VS Code</span>
        </button>

        <button
          onClick={() => handleOpenEditor('cursor')}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer border border-slate-700"
        >
          <ExternalLink className="w-3 h-3 text-violet-400" />
          <span>Abrir en Cursor</span>
        </button>
      </div>
    </div>
  );
};
