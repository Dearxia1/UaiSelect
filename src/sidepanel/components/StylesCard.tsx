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
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-zinc-400" />
          <span>Clases & Estilos</span>
          {hasClasses && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
              {tailwindClasses.length + customClasses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowComputed(!showComputed)}
            className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
              showComputed ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Ver estilos computados"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {hasClasses && (
            <button
              onClick={handleCopyClasses}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Copiar todas las clases"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Tailwind & Custom Classes */}
      {hasClasses ? (
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
          {tailwindClasses.map((cls, idx) => (
            <span
              key={`tw-${idx}`}
              className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] font-mono hover:border-zinc-700 transition-colors"
            >
              {cls}
            </span>
          ))}
          {customClasses.map((cls, idx) => (
            <span
              key={`custom-${idx}`}
              className="px-1.5 py-0.5 rounded bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 text-[11px] font-mono"
            >
              .{cls}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-600 italic">Sin clases CSS detectadas.</p>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-900 text-[11px]">
        <div className="bg-black/60 p-2 rounded-lg border border-zinc-900">
          <span className="text-zinc-500 block text-[10px]">Dimensiones</span>
          <span className="font-mono font-medium text-zinc-200">{computedStyles.width} × {computedStyles.height}</span>
        </div>

        <div className="bg-black/60 p-2 rounded-lg border border-zinc-900">
          <span className="text-zinc-500 block text-[10px]">Display</span>
          <span className="font-mono font-medium text-zinc-200">{computedStyles.display}</span>
        </div>

        <div className="bg-black/60 p-2 rounded-lg border border-zinc-900">
          <span className="text-zinc-500 block text-[10px]">Color / Fondo</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-3 h-3 rounded-full border border-zinc-700 inline-block shadow-sm"
              style={{ backgroundColor: computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ? computedStyles.backgroundColor : '#18181b' }}
              title={`Fondo: ${computedStyles.backgroundColor}`}
            />
            <span
              className="w-3 h-3 rounded-full border border-zinc-700 inline-block shadow-sm"
              style={{ backgroundColor: computedStyles.color }}
              title={`Texto: ${computedStyles.color}`}
            />
          </div>
        </div>
      </div>

      {/* Extended Computed Styles Accordion */}
      {showComputed && (
        <div className="p-2.5 bg-black/80 rounded-lg border border-zinc-800/80 space-y-1.5 text-[11px] font-mono">
          <div className="flex justify-between text-zinc-400">
            <span>Padding:</span>
            <span className="text-zinc-200">{computedStyles.padding}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Margin:</span>
            <span className="text-zinc-200">{computedStyles.margin}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Font:</span>
            <span className="text-zinc-200">{computedStyles.fontSize} ({computedStyles.fontFamily})</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Border:</span>
            <span className="text-zinc-200">{computedStyles.border} (r: {computedStyles.borderRadius})</span>
          </div>
        </div>
      )}
    </div>
  );
};
