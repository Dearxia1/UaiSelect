import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Wrench,
  RefreshCw,
  Palette,
  HelpCircle,
  MessageSquare,
  Code,
  FileJson,
  Download,
  ChevronDown,
  ChevronUp,
  Pin,
  X,
} from 'lucide-react';
import { PromptMode, SelectedElementData } from '../../types';
import {
  PROMPT_TEMPLATES,
  getTemplateById,
  generateElementJSON,
  getTargetComponentName,
} from '../../utils/promptTemplates';

interface PromptBoxProps {
  elementData: SelectedElementData;
  pinnedElement?: SelectedElementData | null;
  onClearPinned?: () => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-3 h-3 shrink-0" />,
  Sparkles: <Sparkles className="w-3 h-3 shrink-0" />,
  RefreshCw: <RefreshCw className="w-3 h-3 shrink-0" />,
  Palette: <Palette className="w-3 h-3 shrink-0" />,
  HelpCircle: <HelpCircle className="w-3 h-3 shrink-0" />,
  MessageSquare: <MessageSquare className="w-3 h-3 shrink-0" />,
};

export const PromptBox: React.FC<PromptBoxProps> = ({
  elementData,
  pinnedElement,
  onClearPinned,
}) => {
  const [outputFormat, setOutputFormat] = useState<'prompt' | 'json'>('prompt');
  const [activeMode, setActiveMode] = useState<PromptMode>('fix-visual');
  const [userInstruction, setUserInstruction] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const hasLiveChanges =
    (elementData.liveClassChanges?.added.length || 0) > 0 ||
    (elementData.liveClassChanges?.removed.length || 0) > 0;

  useEffect(() => {
    if (outputFormat === 'json') {
      setGeneratedContent(generateElementJSON(elementData, userInstruction, pinnedElement));
    } else {
      const template = getTemplateById(activeMode);
      setGeneratedContent(template.generatePrompt(elementData, userInstruction, pinnedElement));
    }
  }, [outputFormat, activeMode, userInstruction, elementData, pinnedElement]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([generatedContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uaiselect-context-${elementData.source?.componentName || elementData.tagName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      {/* Header with Format Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
          {outputFormat === 'prompt' ? (
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          ) : (
            <FileJson className="w-3.5 h-3.5 text-zinc-300" />
          )}
          <span>{outputFormat === 'prompt' ? 'Prompt AI' : 'Contexto JSON'}</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 bg-black/60 rounded-lg border border-zinc-800/80">
          <button
            onClick={() => setOutputFormat('prompt')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              outputFormat === 'prompt'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Prompt
          </button>
          <button
            onClick={() => setOutputFormat('json')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              outputFormat === 'json'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3 h-3" /> JSON
          </button>
        </div>
      </div>

      {/* Compact Mode Selector Pills */}
      {outputFormat === 'prompt' && (
        <div className="grid grid-cols-3 gap-1">
          {PROMPT_TEMPLATES.map((tmpl) => {
            const isSelected = activeMode === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setActiveMode(tmpl.id)}
                title={tmpl.description}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] transition-all cursor-pointer border truncate ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold shadow-sm'
                    : 'bg-black/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`}
              >
                <span className={isSelected ? 'text-zinc-200' : 'text-zinc-500'}>
                  {TEMPLATE_ICONS[tmpl.iconName] || <Sparkles className="w-3 h-3" />}
                </span>
                <span className="truncate">{tmpl.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Context Badges (Pinned Reference / Live Tweaks) */}
      {(pinnedElement || hasLiveChanges) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {hasLiveChanges && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-200">
              <span>⚡ Live Tweak incluido en el prompt</span>
            </div>
          )}
          {pinnedElement && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-200">
              <Pin className="w-2.5 h-2.5 text-zinc-400" />
              <span>Ref #2: {getTargetComponentName(pinnedElement)}</span>
              {onClearPinned && (
                <button
                  onClick={onClearPinned}
                  className="text-zinc-400 hover:text-zinc-100 cursor-pointer"
                  title="Quitar elemento de referencia"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Instruction Input */}
      <div>
        <textarea
          value={userInstruction}
          onChange={(e) => setUserInstruction(e.target.value)}
          placeholder="Instrucción específica (ej. centra el ícono, cambia el padding a p-3...)"
          rows={2}
          className="w-full bg-black/80 border border-zinc-800/80 rounded-lg p-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none font-sans"
        />
      </div>

      {/* Primary Action Buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
            copied
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'bg-[var(--uaiselect-accent)] hover:brightness-90 text-[var(--uaiselect-accent-fg)] shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado al portapapeles</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{outputFormat === 'json' ? 'Copiar JSON' : 'Copiar Prompt para IDE'}</span>
            </>
          )}
        </button>

        {outputFormat === 'json' && (
          <button
            onClick={handleDownloadJSON}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors cursor-pointer border border-zinc-800"
            title="Descargar archivo JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Collapsible Content Preview */}
      <div className="pt-1 border-t border-zinc-900">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-between text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer py-0.5"
        >
          <span>Vista previa ({outputFormat.toUpperCase()})</span>
          {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showPreview && (
          <div className="mt-1.5 bg-black/90 border border-zinc-800/80 rounded-lg p-2.5 font-mono text-[10.5px] text-zinc-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
            {generatedContent}
          </div>
        )}
      </div>
    </div>
  );
};
