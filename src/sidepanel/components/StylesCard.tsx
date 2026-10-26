import React, { useState } from 'react';
import { Palette, Copy, Check, Eye, Plus, RotateCcw } from 'lucide-react';
import { ComputedStyleSummary, LiveClassChanges, ParentLayoutContext } from '../../types';

interface StylesCardProps {
  tailwindClasses: string[];
  customClasses: string[];
  computedStyles: ComputedStyleSummary;
  parentContext?: ParentLayoutContext;
  liveClassChanges?: LiveClassChanges;
  onMutateClasses?: (action: 'toggle' | 'add' | 'reset', className?: string) => void;
}

export const StylesCard: React.FC<StylesCardProps> = ({
  tailwindClasses,
  customClasses,
  computedStyles,
  parentContext,
  liveClassChanges,
  onMutateClasses,
}) => {
  const [copied, setCopied] = useState(false);
  const [showComputed, setShowComputed] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [newClassInput, setNewClassInput] = useState('');

  const removedSet = new Set(liveClassChanges?.removed || []);
  const addedList = liveClassChanges?.added || [];
  const hasLiveChanges = removedSet.size > 0 || addedList.length > 0;

  const baseClasses = [
    ...tailwindClasses.map((c) => ({ name: c, raw: c, isTailwind: true, isAdded: false })),
    ...customClasses.map((c) => ({ name: `.${c}`, raw: c, isTailwind: false, isAdded: false })),
  ];

  const baseRawSet = new Set([...tailwindClasses, ...customClasses]);
  const extraAdded = addedList
    .filter((c) => !baseRawSet.has(c))
    .map((c) => ({ name: c, raw: c, isTailwind: true, isAdded: true }));

  const allClasses = [...baseClasses, ...extraAdded];

  const handleCopyClasses = () => {
    const activeClasses = [
      ...tailwindClasses.filter((c) => !removedSet.has(c)),
      ...customClasses.filter((c) => !removedSet.has(c)),
      ...addedList,
    ].join(' ');
    if (!activeClasses) return;
    navigator.clipboard.writeText(activeClasses);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newClassInput.trim();
    if (!val || !onMutateClasses) return;
    onMutateClasses('add', val);
    setNewClassInput('');
  };

  const hasClasses = allClasses.length > 0;
  const MAX_INITIAL_CLASSES = 12;
  const visibleClasses = showAllClasses ? allClasses : allClasses.slice(0, MAX_INITIAL_CLASSES);
  const hiddenClassesCount = Math.max(0, allClasses.length - MAX_INITIAL_CLASSES);

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-zinc-400" />
          <span>Estilos & Live Tweak</span>
          {hasClasses && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
              {allClasses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {hasLiveChanges && onMutateClasses && (
            <button
              onClick={() => onMutateClasses('reset')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1 cursor-pointer transition-colors"
              title="Restaurar clases originales en la página"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}

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
              title="Copiar clases activas"
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
          <span className="text-zinc-500 text-[10px]">
            {computedStyles.width}×{computedStyles.height}
          </span>
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

      {/* Interactive Tailwind & Custom Classes (Click to toggle live!) */}
      {hasClasses ? (
        <div className="flex flex-wrap items-center gap-1">
          {visibleClasses.map((item, idx) => {
            const isRemoved = removedSet.has(item.raw);
            return (
              <button
                key={`cls-${item.raw}-${idx}`}
                type="button"
                onClick={() => onMutateClasses && onMutateClasses('toggle', item.raw)}
                title={
                  isRemoved
                    ? `Clic para reactivar "${item.raw}" en vivo`
                    : `Clic para desactivar "${item.raw}" en vivo`
                }
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer border ${
                  isRemoved
                    ? 'bg-black/40 text-zinc-600 border-zinc-900 line-through'
                    : item.isAdded
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700 font-semibold'
                      : item.isTailwind
                        ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-zinc-100'
                        : 'bg-zinc-900/50 text-zinc-400 border-zinc-800/60 hover:border-zinc-700'
                }`}
              >
                {item.isAdded ? `+${item.name}` : item.name}
              </button>
            );
          })}
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

      {/* Live Class Input */}
      {onMutateClasses && (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1 pt-0.5">
          <input
            type="text"
            value={newClassInput}
            onChange={(e) => setNewClassInput(e.target.value)}
            placeholder="Probar clase en vivo (ej. p-4 bg-red-500)..."
            className="flex-1 bg-black/80 border border-zinc-800/80 rounded-lg px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer shrink-0"
            title="Aplicar clase en vivo y añadir al Prompt"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
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
