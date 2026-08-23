import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { ComponentHierarchyNode } from '../../types';

interface ComponentTreeProps {
  hierarchy: ComponentHierarchyNode[];
}

export const ComponentTree: React.FC<ComponentTreeProps> = ({ hierarchy }) => {
  if (!hierarchy || hierarchy.length === 0) return null;

  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Jerarquía de Componentes</span>
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs">
        {hierarchy.map((node, index) => {
          const isLast = index === hierarchy.length - 1;
          return (
            <React.Fragment key={index}>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                  isLast
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:text-slate-200'
                }`}
                title={node.source ? `${node.source.fileName}:${node.source.lineNumber}` : node.tag}
              >
                <span>{node.name}</span>
              </div>
              {!isLast && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
