import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileCode,
  Copy,
  Check,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { ComponentHierarchyNode, SelectedElementData } from '../../types';
import {
  getCleanHierarchy,
  getTargetComponentName,
  isNoiseComponentName,
  normalizeComponentName,
} from '../../utils/promptTemplates';

interface ComponentTreeProps {
  hierarchy: ComponentHierarchyNode[];
  elementData?: SelectedElementData;
  onNavigateRelative?: (direction: 'parent' | 'child') => void;
}

export const ComponentTree: React.FC<ComponentTreeProps> = ({
  hierarchy,
  elementData,
  onNavigateRelative,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showWrappers, setShowWrappers] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  // Reset collapse state when a new element is selected
  useEffect(() => {
    setExpanded(false);
    setShowWrappers(false);
  }, [elementData?.timestamp]);

  if (!hierarchy || hierarchy.length === 0) return null;

  const cleanNodes = getCleanHierarchy(hierarchy, elementData?.tagName);
  const nonNoiseAllNodes = hierarchy
    .map((n) => ({ ...n, name: normalizeComponentName(n.name) || n.name }))
    .filter((n) => !isNoiseComponentName(n.name));
  const wrapperCount = Math.max(0, nonNoiseAllNodes.length - cleanNodes.length);
  const activeNodes = showWrappers && nonNoiseAllNodes.length > 0 ? nonNoiseAllNodes : cleanNodes;

  const MAX_VISIBLE = 4;
  const shouldCollapse = !expanded && activeNodes.length > MAX_VISIBLE;
  const hiddenMiddleCount = shouldCollapse ? activeNodes.length - MAX_VISIBLE : 0;

  const visibleNodes: { node: ComponentHierarchyNode; originalIndex: number; isEllipsis?: boolean }[] = [];

  if (shouldCollapse) {
    visibleNodes.push({ node: activeNodes[0], originalIndex: 0 });
    visibleNodes.push({
      node: { name: `+${hiddenMiddleCount}`, tag: 'ellipsis', isCustomComponent: false },
      originalIndex: -1,
      isEllipsis: true,
    });
    const tail = activeNodes.slice(-(MAX_VISIBLE - 1));
    tail.forEach((n, idx) => {
      visibleNodes.push({
        node: n,
        originalIndex: activeNodes.length - (MAX_VISIBLE - 1) + idx,
      });
    });
  } else {
    activeNodes.forEach((n, idx) => {
      visibleNodes.push({ node: n, originalIndex: idx });
    });
  }

  const targetName = elementData ? getTargetComponentName(elementData) : activeNodes[activeNodes.length - 1]?.name;
  const source = elementData?.source;
  const shortFile = source?.fileName ? source.fileName.split('/').pop() : null;

  const handleCopySourceMention = () => {
    if (!source) return;
    navigator.clipboard.writeText(`@${source.fileName}:${source.lineNumber}`);
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 1500);
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      {/* Element Identity & Quick Navigation Bar */}
      {elementData && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono font-semibold text-xs text-zinc-100 truncate">
              {targetName}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[10px] shrink-0">
              &lt;{elementData.tagName}&gt;
            </span>
            <span className="text-[10px] font-mono text-zinc-500 shrink-0">
              {elementData.rect.width}×{elementData.rect.height}
            </span>
          </div>

          {onNavigateRelative && (
            <div className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded-lg border border-zinc-800/80 shrink-0">
              <button
                onClick={() => onNavigateRelative('parent')}
                className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                title="Seleccionar contenedor padre (↑)"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateRelative('child')}
                className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                title="Seleccionar primer elemento hijo (↓)"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Source File Pill (if detected) */}
      {source && shortFile && (
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-black/60 border border-zinc-900 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="font-mono text-zinc-300 truncate" title={`${source.fileName}:${source.lineNumber}`}>
              {shortFile}
              <span className="text-zinc-500">:{source.lineNumber}</span>
            </span>
          </div>
          <button
            onClick={handleCopySourceMention}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] font-mono transition-colors cursor-pointer shrink-0"
            title="Copiar mención @archivo:línea para tu IDE"
          >
            {copiedSource ? (
              <>
                <Check className="w-2.5 h-2.5 text-zinc-100" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-zinc-400" />
                <span>@file</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Hierarchy Header & Noise Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium">
          <Layers className="w-3 h-3 text-zinc-500" />
          <span>Jerarquía UI</span>
          <span className="text-[10px] font-mono text-zinc-500">
            ({cleanNodes.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {expanded && activeNodes.length > MAX_VISIBLE && (
            <button
              onClick={() => setExpanded(false)}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Compactar
            </button>
          )}

          {wrapperCount > 0 && (
            <button
              onClick={() => {
                setShowWrappers(!showWrappers);
                if (!showWrappers) setExpanded(true);
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                showWrappers
                  ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                  : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/60 hover:text-zinc-300'
              }`}
              title={
                showWrappers
                  ? 'Ocultar Context Providers y Boundaries'
                  : `${wrapperCount} Providers/Contexts ocultos para mayor claridad. Clic para mostrar.`
              }
            >
              <Filter className="w-2.5 h-2.5" />
              <span>{showWrappers ? 'Limpiar ctx' : `+${wrapperCount} ctx`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Pills */}
      <div className="flex flex-wrap items-center gap-1 text-xs">
        {visibleNodes.map((item, idx) => {
          const isLast = idx === visibleNodes.length - 1;

          if (item.isEllipsis) {
            return (
              <React.Fragment key="ellipsis">
                <button
                  onClick={() => setExpanded(true)}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  title={`Mostrar ${hiddenMiddleCount} componentes intermedios`}
                >
                  <MoreHorizontal className="w-3 h-3" />
                  <span>{item.node.name}</span>
                </button>
                <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
              </React.Fragment>
            );
          }

          const { node } = item;
          return (
            <React.Fragment key={`${node.name}-${item.originalIndex}`}>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors max-w-[180px] ${
                  isLast
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold'
                    : node.isWrapper
                      ? 'bg-black/40 text-zinc-500 border border-zinc-900 italic'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200'
                }`}
                title={
                  node.source
                    ? `${node.name} (${node.source.fileName}:${node.source.lineNumber})`
                    : node.name
                }
              >
                <span className="truncate">{node.name}</span>
              </div>
              {!isLast && <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
