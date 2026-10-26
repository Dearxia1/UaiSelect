import React, { useState } from 'react';
import { Palette, Copy, Check, Eye } from 'lucide-react';
import { ComputedStyleSummary, ParentLayoutContext } from '../../types';

interface StylesCardProps {
  tailwindClasses: string[];
  customClasses: string[];
  computedStyles: ComputedStyleSummary;
  parentContext?: ParentLayoutContext;
}

export const StylesCard: React.FC<StylesCardProps> = ({
  tailwindClasses,
  customClasses,
  computedStyles,
  parentContext,
}) => {
  const [copied, setCopied] = useState(false);
  const [showComputed, setShowComputed] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);

  const allClasses = [
    ...tailwindClasses.map((c) => ({ name: c, isTailwind: true })),
    ...customClasses.map((c) => ({ name: `.${c}`, isTailwind: false })),
  ];

  const handleCopyClasses = () => {
    const raw = [...tailwindClasses, ...customClasses].join(' ');
    if (!raw) return;
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const hasClasses = allClasses.length > 0;
  const MAX_INITIAL_CLASSES = 10;
  const visibleClasses = showAllClasses ? allClasses : allClasses.slice(0, MAX_INITIAL_CLASSES);
  const hiddenClassesCount = Math.max(0, allClasses.length - MAX_INITIAL_CLASSES);

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-zinc-400" />
          <span>Estilos & Layout</span>
          {hasClasses && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
              {allClasses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowComputed(!showComputed)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer border ${
              showComputed
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800/60 hover:text-zinc-200'
            }`}
            title="Ver detalles de CSS computado y contenedor padre"
          >
            <Eye className="w-3 h-3" />
            <span>CSS</span>
          </button>

          {hasClasses && (
            <button
              onClick={handleCopyClasses}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Copiar todas las clases"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Compact Single-Line Metrics Strip */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-black/60 rounded-lg border border-zinc-900 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="text-zinc-500 text-[10px] font-sans">Display:</span>
          <span>{computedStyles.display}</span>
          {computedStyles.flexDirection && (
            <span className="text-zinc-500">({computedStyles.flexDirection})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" title={`Texto: ${computedStyles.color}`}>
            <span
              className="w-2.5 h-2.5 rounded-full border border-zinc-700 inline-block"
              style={{ backgroundColor: computedStyles.color }}
            />
          </div>
          <div className="flex items-center gap-1" title={`Fondo: ${computedStyles.backgroundColor}`}>
            <span
              className="w-2.5 h-2.5 rounded-full border border-zinc-700 inline-block"
              style={{
                backgroundColor:
                  computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)'
                    ? computedStyles.backgroundColor
                    : '#18181b',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tailwind & Custom Classes */}
      {hasClasses ? (
        <div className="flex flex-wrap items-center gap-1">
          {visibleClasses.map((item, idx) => (
            <span
              key={`cls-${idx}`}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                item.isTailwind
                  ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800/60'
              }`}
            >
              {item.name}
            </span>
          ))}
          {hiddenClassesCount > 0 && !showAllClasses && (
            <button
              onClick={() => setShowAllClasses(true)}
              className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[10px] font-mono cursor-pointer transition-colors"
            >
              +{hiddenClassesCount} más
            </button>
          )}
          {showAllClasses && allClasses.length > MAX_INITIAL_CLASSES && (
            <button
              onClick={() => setShowAllClasses(false)}
              className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[10px] font-mono cursor-pointer transition-colors"
            >
              Menos
            </button>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-zinc-500 italic">Sin clases CSS directas.</p>
      )}

      {/* Extended Computed Styles & Parent Container Accordion */}
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
            <span>Tipografía:</span>
            <span className="text-zinc-200">
              {computedStyles.fontSize} · {computedStyles.fontFamily}
            </span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Borde:</span>
            <span className="text-zinc-200">
              {computedStyles.borderRadius} ({computedStyles.border})
            </span>
          </div>
          {parentContext && (
            <div className="pt-1.5 mt-1.5 border-t border-zinc-900 flex justify-between text-zinc-400">
              <span>Padre (&lt;{parentContext.tagName}&gt;):</span>
              <span className="text-zinc-200">
                {parentContext.display}
                {parentContext.flexDirection ? ` (${parentContext.flexDirection})` : ''}
                {parentContext.gap ? ` · gap ${parentContext.gap}` : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
