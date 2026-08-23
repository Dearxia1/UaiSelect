import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { ComponentHierarchyNode } from '../../types';

interface ComponentTreeProps {
  hierarchy: ComponentHierarchyNode[];
}

export const ComponentTree: React.FC<ComponentTreeProps> = ({ hierarchy }) => {
  if (!hierarchy || hierarchy.length === 0) return null;

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
        <Layers className="w-3.5 h-3.5 text-zinc-400" />
        <span>Jerarquía</span>
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs">
        {hierarchy.map((node, index) => {
          const isLast = index === hierarchy.length - 1;
          return (
            <React.Fragment key={index}>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                  isLast
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-semibold'
                    : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200'
                }`}
                title={node.source ? `${node.source.fileName}:${node.source.lineNumber}` : node.tag}
              >
                <span>{node.name}</span>
              </div>
              {!isLast && <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
