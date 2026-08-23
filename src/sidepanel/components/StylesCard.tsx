import React, { useState } from 'react';
import { Palette, Copy, Check, Eye } from 'lucide-react';
import { ComputedStyleSummary } from '../../types';

interface StylesCardProps {
  tailwindClasses: string[];
  customClasses: string[];
  computedStyles: ComputedStyleSummary;
}

export const StylesCard: React.FC<StylesCardProps> = ({
  tailwindClasses,
  customClasses,
  computedStyles,
}) => {
  const [copied, setCopied] = useState(false);
  const [showComputed, setShowComputed] = useState(false);

  const handleCopyClasses = () => {
    const all = [...tailwindClasses, ...customClasses].join(' ');
    if (!all) return;
    navigator.clipboard.writeText(all);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const hasClasses = tailwindClasses.length > 0 || customClasses.length > 0;

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clases & Estilos</span>
          {hasClasses && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
              {tailwindClasses.length + customClasses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowComputed(!showComputed)}
            className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
              showComputed ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Ver estilos computados"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {hasClasses && (
            <button
              onClick={handleCopyClasses}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Copiar todas las clases"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Tailwind & Custom Classes */}
      {hasClasses ? (
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {tailwindClasses.map((cls, idx) => (
            <span
              key={`tw-${idx}`}
              className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono hover:bg-cyan-500/20 transition-colors"
            >
              {cls}
            </span>
          ))}
          {customClasses.map((cls, idx) => (
            <span
              key={`custom-${idx}`}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono"
            >
              .{cls}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">No se detectaron clases CSS en este elemento.</p>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Dimensiones</span>
          <span className="font-mono font-medium text-slate-200">{computedStyles.width} × {computedStyles.height}</span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Display</span>
          <span className="font-mono font-medium text-slate-200">{computedStyles.display}</span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Color / Fondo</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-3 h-3 rounded-full border border-slate-700 inline-block shadow-sm"
              style={{ backgroundColor: computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ? computedStyles.backgroundColor : '#1e293b' }}
              title={`Fondo: ${computedStyles.backgroundColor}`}
            />
            <span
              className="w-3 h-3 rounded-full border border-slate-700 inline-block shadow-sm"
              style={{ backgroundColor: computedStyles.color }}
              title={`Texto: ${computedStyles.color}`}
            />
          </div>
        </div>
      </div>

      {/* Extended Computed Styles Accordion */}
      {showComputed && (
        <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5 text-[11px] font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Padding:</span>
            <span className="text-slate-200">{computedStyles.padding}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Margin:</span>
            <span className="text-slate-200">{computedStyles.margin}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Font:</span>
            <span className="text-slate-200">{computedStyles.fontSize} ({computedStyles.fontFamily})</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Border:</span>
            <span className="text-slate-200">{computedStyles.border} (r: {computedStyles.borderRadius})</span>
          </div>
        </div>
      )}
    </div>
  );
};
