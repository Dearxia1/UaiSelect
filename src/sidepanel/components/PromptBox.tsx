import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, ExternalLink, Wrench, RefreshCw, Palette, HelpCircle, MessageSquare } from 'lucide-react';
import { PromptMode, SelectedElementData } from '../../types';
import { PROMPT_TEMPLATES, getTemplateById } from '../../utils/promptTemplates';

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
  const [activeMode, setActiveMode] = useState<PromptMode>('fix-visual');
  const [userInstruction, setUserInstruction] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  useEffect(() => {
    const template = getTemplateById(activeMode);
    const prompt = template.generatePrompt(elementData, userInstruction);
    setGeneratedPrompt(prompt);
  }, [activeMode, userInstruction, elementData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWebAI = (service: 'chatgpt' | 'claude' | 'gemini') => {
    handleCopy();
    let url = 'https://chatgpt.com';
    if (service === 'claude') url = 'https://claude.ai/new';
    if (service === 'gemini') url = 'https://gemini.google.com';

    window.open(url, '_blank');
  };

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Generador de Prompt para IA</span>
        </div>
      </div>

      {/* Mode / Action Selector Pills */}
      <div className="grid grid-cols-2 gap-1.5">
        {PROMPT_TEMPLATES.map((tmpl) => {
          const isSelected = activeMode === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => setActiveMode(tmpl.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-sm font-semibold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                {TEMPLATE_ICONS[tmpl.iconName] || <Sparkles className="w-3.5 h-3.5" />}
              </span>
              <span className="truncate">{tmpl.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Instruction Customizer */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400 block">
          ¿Qué quieres que la IA haga? (opcional)
        </label>
        <textarea
          value={userInstruction}
          onChange={(e) => setUserInstruction(e.target.value)}
          placeholder="Ej: Añade un icono a la izquierda, haz que sea responsive y cambia el color a azul..."
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans"
        />
      </div>

      {/* Prompt Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Vista previa del prompt:</span>
          <button
            onClick={() => setShowFullPrompt(!showFullPrompt)}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            {showFullPrompt ? 'Colapsar' : 'Expandir'}
          </button>
        </div>
        <div
          className={`bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap ${
            showFullPrompt ? 'max-h-96' : 'max-h-24'
          } overflow-y-auto`}
        >
          {generatedPrompt}
        </div>
      </div>

      {/* Primary Action Button (Copy) */}
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
          copied
            ? 'bg-emerald-600 text-white shadow-emerald-600/30'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>¡Prompt Copiado al Portapapeles!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copiar Prompt Completo con Contexto</span>
          </>
        )}
      </button>

      {/* Direct AI Web Launchers */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
          Copiar y abrir directamente en:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleOpenWebAI('chatgpt')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700/80"
          >
            <span>ChatGPT</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>

          <button
            onClick={() => handleOpenWebAI('claude')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700/80"
          >
            <span>Claude</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>

          <button
            onClick={() => handleOpenWebAI('gemini')}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700/80"
          >
            <span>Gemini</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
