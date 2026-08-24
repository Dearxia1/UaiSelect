import React, { useState } from 'react';
import { Database, Zap, Copy, Check } from 'lucide-react';
import { ComponentDataContext } from '../../types';

interface StateCardProps {
  dataContext?: ComponentDataContext;
}

export const StateCard: React.FC<StateCardProps> = ({ dataContext }) => {
  const [activeTab, setActiveTab] = useState<'props' | 'state' | 'events'>('props');
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!dataContext) return null;

  const { props, state, events } = dataContext;

  const propsCount = props ? Object.keys(props).length : 0;
  const stateCount = state ? (Array.isArray(state) ? state.length : Object.keys(state).length) : 0;
  const eventsCount = events ? events.length : 0;

  const totalItems = propsCount + stateCount + eventsCount;
  if (totalItems === 0) return null;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(dataContext, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopySingle = (key: string, value: any) => {
    const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const renderFormattedValue = (val: any) => {
    if (val === null) return <span className="text-zinc-500 font-mono">null</span>;
    if (val === undefined) return <span className="text-zinc-500 font-mono">undefined</span>;
    if (typeof val === 'boolean') {
      return <span className="text-purple-400 font-mono font-medium">{String(val)}</span>;
    }
    if (typeof val === 'number') {
      return <span className="text-sky-400 font-mono font-medium">{val}</span>;
    }
    if (typeof val === 'string') {
      if (val.startsWith('[Function:')) {
        return <span className="text-amber-400/90 font-mono">{val}</span>;
      }
      if (val.startsWith('<') && val.endsWith('/>')) {
        return <span className="text-emerald-400/90 font-mono">{val}</span>;
      }
      return <span className="text-emerald-300 font-mono font-normal">"{val}"</span>;
    }
    if (typeof val === 'object') {
      return (
        <span className="text-zinc-400 font-mono text-[10px]">
          {JSON.stringify(val)}
        </span>
      );
    }
    return <span className="text-zinc-300 font-mono">{String(val)}</span>;
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          <span>Datos & Estado</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
            {totalItems}
          </span>
        </div>

        <button
          onClick={handleCopyAll}
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
          title="Copiar todo el contexto de datos (JSON)"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg bg-black/60 p-0.5 border border-zinc-900 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('props')}
          className={`flex-1 py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'props'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Props</span>
          {propsCount > 0 && (
            <span className="text-[9px] px-1 rounded bg-zinc-900 text-zinc-400 font-mono">
              {propsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('state')}
          className={`flex-1 py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'state'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Estado</span>
          {stateCount > 0 && (
            <span className="text-[9px] px-1 rounded bg-zinc-900 text-zinc-400 font-mono">
              {stateCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'events'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Eventos</span>
          {eventsCount > 0 && (
            <span className="text-[9px] px-1 rounded bg-zinc-900 text-zinc-400 font-mono">
              {eventsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-black/80 rounded-lg border border-zinc-850 p-2.5 max-h-48 overflow-y-auto space-y-1.5 text-xs">
        {activeTab === 'props' && (
          props && propsCount > 0 ? (
            <div className="space-y-1">
              {Object.entries(props).map(([k, v]) => (
                <div
                  key={`prop-${k}`}
                  className="group flex items-start justify-between gap-2 p-1 rounded hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-start gap-1.5 overflow-hidden flex-1">
                    <span className="text-zinc-400 font-mono text-[11px] shrink-0 font-medium">{k}:</span>
                    <span className="truncate text-[11px]">{renderFormattedValue(v)}</span>
                  </div>
                  <button
                    onClick={() => handleCopySingle(k, v)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-zinc-200 transition-opacity cursor-pointer"
                    title={`Copiar valor de ${k}`}
                  >
                    {copiedKey === k ? <Check className="w-3 h-3 text-zinc-200" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-600 italic py-1 text-center">
              Sin props detectadas en este componente.
            </p>
          )
        )}

        {activeTab === 'state' && (
          state && stateCount > 0 ? (
            <div className="space-y-1">
              {Object.entries(state).map(([k, v]) => (
                <div
                  key={`state-${k}`}
                  className="group flex items-start justify-between gap-2 p-1 rounded hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-start gap-1.5 overflow-hidden flex-1">
                    <span className="text-zinc-400 font-mono text-[11px] shrink-0 font-medium">{k}:</span>
                    <span className="truncate text-[11px]">{renderFormattedValue(v)}</span>
                  </div>
                  <button
                    onClick={() => handleCopySingle(k, v)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-zinc-200 transition-opacity cursor-pointer"
                    title={`Copiar valor de ${k}`}
                  >
                    {copiedKey === k ? <Check className="w-3 h-3 text-zinc-200" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-600 italic py-1 text-center">
              Sin estado local detectado.
            </p>
          )
        )}

        {activeTab === 'events' && (
          events && eventsCount > 0 ? (
            <div className="space-y-1.5">
              {events.map((ev, idx) => (
                <div
                  key={`event-${idx}`}
                  className="flex items-center justify-between p-1.5 rounded-md bg-zinc-900/50 border border-zinc-800/80 text-[11px]"
                >
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-mono text-zinc-200 font-semibold">{ev.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-[10px] bg-black/60 px-1.5 py-0.5 rounded border border-zinc-800">
                    {ev.handlerName ? `fn: ${ev.handlerName}` : 'attached'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-600 italic py-1 text-center">
              Sin event handlers detectados.
            </p>
          )
        )}
      </div>
    </div>
  );
};
