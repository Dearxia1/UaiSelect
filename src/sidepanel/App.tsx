import React, { useState, useEffect } from 'react';
import { Target, Sparkles, MousePointerClick, Layers, History, Pin } from 'lucide-react';
import { AppSettings, CardVisibilitySettings, ExtensionMessage, SelectedElementData } from '../types';
import { Header } from './components/Header';
import { ComponentTree } from './components/ComponentTree';
import { StateCard } from './components/StateCard';
import { StylesCard } from './components/StylesCard';
import { SnapshotCard } from './components/SnapshotCard';
import { PromptBox } from './components/PromptBox';
import { SettingsModal } from './components/SettingsModal';
import { applyAccentTheme, applyBackgroundTheme } from '../utils/accentTheme';
import { getTargetComponentName } from '../utils/promptTemplates';

const DEFAULT_CARDS: CardVisibilitySettings = {
  showHierarchy: true,
  showSnapshot: true,
  showState: true,
  showStyles: true,
  showPrompt: true,
};

const MAX_HISTORY = 5;

export const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [elementHistory, setElementHistory] = useState<SelectedElementData[]>([]);
  const [pinnedElement, setPinnedElement] = useState<SelectedElementData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cardsVisibility, setCardsVisibility] = useState<CardVisibilitySettings>(DEFAULT_CARDS);

  const pushToHistory = (newElem: SelectedElementData) => {
    setElementHistory((prev) => {
      const targetName = getTargetComponentName(newElem);
      const filtered = prev.filter(
        (item) =>
          !(
            getTargetComponentName(item) === targetName &&
            item.tagName === newElem.tagName &&
            item.rect.top === newElem.rect.top &&
            item.rect.left === newElem.rect.left
          )
      );
      const next = [newElem, ...filtered].slice(0, MAX_HISTORY);
      chrome.storage.local.set({ elementHistory: next });
      return next;
    });
  };

  useEffect(() => {
    chrome.storage.local.get(['lastSelectedElement', 'elementHistory', 'settings'], (result) => {
      if (result.lastSelectedElement) {
        setSelectedElement(result.lastSelectedElement);
      }
      if (Array.isArray(result.elementHistory) && result.elementHistory.length > 0) {
        setElementHistory(result.elementHistory);
      } else if (result.lastSelectedElement) {
        setElementHistory([result.lastSelectedElement]);
      }
      if (result.settings?.cards) {
        setCardsVisibility({ ...DEFAULT_CARDS, ...result.settings.cards });
      }
      applyAccentTheme(result.settings?.highlightColor);
      applyBackgroundTheme(result.settings?.backgroundColor);
    });

    const messageListener = (message: ExtensionMessage) => {
      if (message.type === 'ELEMENT_SELECTED') {
        setSelectedElement(message.payload);
        pushToHistory(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const getTargetTab = async (): Promise<chrome.tabs.Tab | undefined> => {
    const tabsCurrent = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabsCurrent && tabsCurrent.length > 0 && tabsCurrent[0].id) {
      return tabsCurrent[0];
    }
    const tabsFocused = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tabsFocused && tabsFocused.length > 0 && tabsFocused[0].id) {
      return tabsFocused[0];
    }
    const allActive = await chrome.tabs.query({ active: true });
    if (allActive && allActive.length > 0 && allActive[0].id) {
      return allActive[0];
    }
    return undefined;
  };

  const handleToggleInspector = async () => {
    try {
      const targetTab = await getTargetTab();
      if (!targetTab?.id) return;

      chrome.tabs.sendMessage(targetTab.id, { type: 'TOGGLE_INSPECTOR' }).catch(async () => {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: targetTab!.id! },
            files: ['content.js'],
          });
          chrome.tabs.sendMessage(targetTab!.id!, { type: 'TOGGLE_INSPECTOR' });
        } catch (e) {
          console.error('Error executing script:', e);
        }
      });
    } catch (err) {
      console.error('Error toggling inspector:', err);
    }
  };

  const handleNavigateRelative = async (direction: 'parent' | 'child') => {
    try {
      const targetTab = await getTargetTab();
      if (!targetTab?.id) return;
      chrome.tabs.sendMessage(targetTab.id, {
        type: 'SELECT_RELATIVE_ELEMENT',
        direction,
      }).catch(() => {});
    } catch {}
  };

  const handlePingHighlight = async () => {
    try {
      const targetTab = await getTargetTab();
      if (!targetTab?.id) return;
      chrome.tabs.sendMessage(targetTab.id, {
        type: 'PING_HIGHLIGHT_ELEMENT',
      }).catch(() => {});
    } catch {}
  };

  const handleMutateClasses = async (
    action: 'toggle' | 'add' | 'reset',
    className?: string
  ) => {
    try {
      const targetTab = await getTargetTab();
      if (!targetTab?.id) return;
      chrome.tabs.sendMessage(
        targetTab.id,
        {
          type: 'MUTATE_ELEMENT_CLASSES',
          action,
          className,
        },
        (res) => {
          if (res && res.ok) {
            setSelectedElement((prev) => {
              if (!prev) return prev;
              const updated: SelectedElementData = {
                ...prev,
                computedStyles: res.computedStyles || prev.computedStyles,
                rect: res.rect || prev.rect,
                liveClassChanges: res.liveClassChanges,
              };
              chrome.storage.local.set({ lastSelectedElement: updated });
              return updated;
            });
          }
        }
      );
    } catch {}
  };

  const handleSettingsUpdated = (newSettings: AppSettings) => {
    if (newSettings.cards) {
      setCardsVisibility({ ...DEFAULT_CARDS, ...newSettings.cards });
    }
    applyAccentTheme(newSettings.highlightColor);
    applyBackgroundTheme(newSettings.backgroundColor);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--uaiselect-bg)] text-zinc-100 antialiased font-sans">
      <Header
        onToggleInspector={handleToggleInspector}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-w-md mx-auto w-full pb-8">
        {selectedElement ? (
          <>
            {/* Recent Elements History & Multi-Element Pin Bar */}
            {elementHistory.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                <div
                  className="flex items-center gap-1 px-1.5 py-1 text-[10px] text-zinc-500 shrink-0"
                  title="Elementos recientes (clic en el pin para comparar 2 elementos en el prompt)"
                >
                  <History className="w-3 h-3" />
                </div>
                {elementHistory.map((item) => {
                  const isCurrent = item.timestamp === selectedElement.timestamp;
                  const isPinned = pinnedElement?.timestamp === item.timestamp;
                  const label = getTargetComponentName(item);
                  return (
                    <div
                      key={item.timestamp}
                      className={`flex items-center rounded-lg border text-[10px] font-mono shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
                          : isPinned
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                            : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedElement(item)}
                        className="px-2 py-0.5 truncate max-w-[110px] cursor-pointer"
                        title={`Ver ${label} (<${item.tagName}>)`}
                      >
                        {label}
                      </button>
                      {!isCurrent && (
                        <button
                          onClick={() =>
                            setPinnedElement(isPinned ? null : item)
                          }
                          className={`px-1 py-0.5 border-l border-zinc-800/80 cursor-pointer transition-colors ${
                            isPinned ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-500 hover:text-zinc-200'
                          }`}
                          title={
                            isPinned
                              ? 'Quitar como referencia en el prompt'
                              : 'Fijar este elemento como Referencia #2 en el prompt'
                          }
                        >
                          <Pin className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Component Identity & Clean Hierarchy */}
            {cardsVisibility.showHierarchy && selectedElement.hierarchy && selectedElement.hierarchy.length > 0 && (
              <ComponentTree
                hierarchy={selectedElement.hierarchy}
                elementData={selectedElement}
                onNavigateRelative={handleNavigateRelative}
                onPingHighlight={handlePingHighlight}
              />
            )}

            {/* AI Prompt Generator & JSON */}
            {cardsVisibility.showPrompt && (
              <PromptBox
                elementData={selectedElement}
                pinnedElement={pinnedElement}
                onClearPinned={() => setPinnedElement(null)}
              />
            )}

            {/* Tailwind Classes, Live Class Tweaker & CSS Metrics */}
            {cardsVisibility.showStyles && (
              <StylesCard
                tailwindClasses={selectedElement.tailwindClasses}
                customClasses={selectedElement.customClasses}
                computedStyles={selectedElement.computedStyles}
                parentContext={selectedElement.parentContext}
                liveClassChanges={selectedElement.liveClassChanges}
                onMutateClasses={handleMutateClasses}
              />
            )}

            {/* Visual Snapshot */}
            {cardsVisibility.showSnapshot && (
              <SnapshotCard elementData={selectedElement} />
            )}

            {/* Props, Local State & Event Handlers */}
            {cardsVisibility.showState && (
              <StateCard dataContext={selectedElement.dataContext} />
            )}
          </>
        ) : (
          /* Clean Monochromatic Empty State */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
              <MousePointerClick className="w-6 h-6 text-zinc-200" />
            </div>

            <div className="space-y-1 max-w-xs">
              <h2 className="text-sm font-semibold text-zinc-100">
                Inspecciona cualquier elemento
              </h2>
              <p className="text-xs text-zinc-400">
                Presiona <kbd className="px-1.5 py-0.5 bg-zinc-900 text-zinc-200 rounded font-mono text-[10px] border border-zinc-800">Alt+Shift+X</kbd> o haz clic abajo para activar el selector.
              </p>
            </div>

            <button
              onClick={handleToggleInspector}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--uaiselect-accent)] hover:brightness-90 text-[var(--uaiselect-accent-fg)] rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Activar Inspector Visual</span>
            </button>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 gap-2 w-full pt-4 text-left">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Árbol UI Limpio</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Jerarquía filtrada sin ruido y navegación padre/hijo.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Live Tweak + AI</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Prueba clases en vivo y genera prompts exactos.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={handleSettingsUpdated}
      />
    </div>
  );
};

export default App;
