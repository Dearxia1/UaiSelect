import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, ExternalLink, Wrench, RefreshCw, Palette, HelpCircle, MessageSquare, Code, FileJson, Download } from 'lucide-react';
import { PromptMode, SelectedElementData } from '../../types';
import { PROMPT_TEMPLATES, getTemplateById, generateElementJSON } from '../../utils/promptTemplates';

interface PromptBoxProps {
  elementData: SelectedElementData;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  RefreshCw: <RefreshCw className="w-3.5 h-3.5" />,
  Palette: <Palette className="w-3.5 h-3.5" />,
  HelpCircle: <HelpCircle className="w-3.5 h-3.5" />,
  MessageSquare: <MessageSquare className="w-3.5 h-3.5" />,
};

export const PromptBox: React.FC<PromptBoxProps> = ({ elementData }) => {
  const [outputFormat, setOutputFormat] = useState<'prompt' | 'json'>('prompt');
  const [activeMode, setActiveMode] = useState<PromptMode>('fix-visual');
  const [userInstruction, setUserInstruction] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (outputFormat === 'json') {
      const jsonStr = generateElementJSON(elementData, userInstruction);
      setGeneratedContent(jsonStr);
    } else {
      const template = getTemplateById(activeMode);
      const prompt = template.generatePrompt(elementData, userInstruction);
      setGeneratedContent(prompt);
    }
  }, [outputFormat, activeMode, userInstruction, elementData]);

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

  const handleOpenWebAI = (service: 'chatgpt' | 'claude' | 'gemini') => {
    handleCopy();
    let url = 'https://chatgpt.com';
    if (service === 'claude') url = 'https://claude.ai/new';
    if (service === 'gemini') url = 'https://gemini.google.com';

    window.open(url, '_blank');
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-3 shadow-sm">
      {/* Header with Format Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
          {outputFormat === 'prompt' ? (
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          ) : (
            <FileJson className="w-3.5 h-3.5 text-zinc-300" />
          )}
          <span>{outputFormat === 'prompt' ? 'Generador de Prompt' : 'Exportador JSON'}</span>
        </div>

        {/* Tab Switcher: Prompt vs JSON */}
        <div className="flex items-center p-0.5 bg-black rounded-lg border border-zinc-800">
          <button
            onClick={() => setOutputFormat('prompt')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              outputFormat === 'prompt'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Prompt</span>
          </button>
          <button
            onClick={() => setOutputFormat('json')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              outputFormat === 'json'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Mode / Action Selector Pills (Only for Prompt Mode) */}
      {outputFormat === 'prompt' && (
        <div className="grid grid-cols-2 gap-1.5">
          {PROMPT_TEMPLATES.map((tmpl) => {
            const isSelected = activeMode === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setActiveMode(tmpl.id)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm font-semibold'
                    : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <span className={isSelected ? 'text-zinc-200' : 'text-zinc-500'}>
                  {TEMPLATE_ICONS[tmpl.iconName] || <Sparkles className="w-3.5 h-3.5" />}
                </span>
                <span className="truncate">{tmpl.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* User Instruction Customizer */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400 block">
          {outputFormat === 'json'
            ? 'Instrucción en JSON (opcional):'
            : 'Instrucción para la IA (opcional):'}
        </label>
        <textarea
          value={userInstruction}
          onChange={(e) => setUserInstruction(e.target.value)}
          placeholder={
            outputFormat === 'json'
              ? 'Ej: Refactorizar a componentes modulares y añadir prop isDisabled...'
              : 'Ej: Añade un icono a la izquierda, haz que sea responsive y cambia el color a azul...'
          }
          rows={2}
          className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none font-sans"
        />
      </div>

      {/* Content Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>Vista previa ({outputFormat.toUpperCase()}):</span>
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-zinc-300 hover:underline cursor-pointer"
          >
            {showFull ? 'Colapsar' : 'Expandir'}
          </button>
        </div>
        <div
          className={`bg-black/90 border border-zinc-800/80 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap ${
            showFull ? 'max-h-96' : 'max-h-24'
          } overflow-y-auto`}
        >
          {generatedContent}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
            copied
              ? 'bg-zinc-800 text-white border border-zinc-600'
              : 'bg-white hover:bg-zinc-200 text-black shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{outputFormat === 'json' ? '¡JSON Copiado!' : '¡Prompt Copiado!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{outputFormat === 'json' ? 'Copiar JSON' : 'Copiar Prompt con Contexto'}</span>
            </>
          )}
        </button>

        {outputFormat === 'json' && (
          <button
            onClick={handleDownloadJSON}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors cursor-pointer border border-zinc-800"
            title="Descargar JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Direct AI Web Launchers */}
      <div className="pt-2 border-t border-zinc-900">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">
          Copiar y abrir en:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleOpenWebAI('chatgpt')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer border border-zinc-800/80"
          >
            <span>ChatGPT</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </button>

          <button
            onClick={() => handleOpenWebAI('claude')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer border border-zinc-800/80"
          >
            <span>Claude</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </button>

          <button
            onClick={() => handleOpenWebAI('gemini')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer border border-zinc-800/80"
          >
            <span>Gemini</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
