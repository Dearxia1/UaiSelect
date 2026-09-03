import React, { useState, useEffect } from 'react';
import { Target, Sparkles, MousePointerClick, Layers } from 'lucide-react';
import { AppSettings, CardVisibilitySettings, ExtensionMessage, SelectedElementData } from '../types';
import { Header } from './components/Header';
import { ComponentTree } from './components/ComponentTree';
import { StateCard } from './components/StateCard';
import { StylesCard } from './components/StylesCard';
import { SnapshotCard } from './components/SnapshotCard';
import { PromptBox } from './components/PromptBox';
import { SettingsModal } from './components/SettingsModal';
import { applyAccentTheme, applyBackgroundTheme } from '../utils/accentTheme';

const DEFAULT_CARDS: CardVisibilitySettings = {
  showHierarchy: true,
  showSnapshot: true,
  showState: true,
  showStyles: true,
  showPrompt: true,
};

export const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cardsVisibility, setCardsVisibility] = useState<CardVisibilitySettings>(DEFAULT_CARDS);

  useEffect(() => {
    // 1. Load initial selected element and settings from storage
    chrome.storage.local.get(['lastSelectedElement', 'settings'], (result) => {
      if (result.lastSelectedElement) {
        setSelectedElement(result.lastSelectedElement);
      }
      if (result.settings?.cards) {
        setCardsVisibility({ ...DEFAULT_CARDS, ...result.settings.cards });
      }
      applyAccentTheme(result.settings?.highlightColor);
      applyBackgroundTheme(result.settings?.backgroundColor);
    });

    // 2. Listen for real-time element selections
    const messageListener = (message: ExtensionMessage) => {
      if (message.type === 'ELEMENT_SELECTED') {
        setSelectedElement(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleToggleInspector = async () => {
    try {
      let targetTab: chrome.tabs.Tab | undefined;

      // 1. Try current window
      const tabsCurrent = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabsCurrent && tabsCurrent.length > 0 && tabsCurrent[0].id) {
        targetTab = tabsCurrent[0];
      }

      // 2. Try last focused window (standard in Firefox Sidebar)
      if (!targetTab) {
        const tabsFocused = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tabsFocused && tabsFocused.length > 0 && tabsFocused[0].id) {
          targetTab = tabsFocused[0];
        }
      }

      // 3. Fallback: any active tab
      if (!targetTab) {
        const allActive = await chrome.tabs.query({ active: true });
        if (allActive && allActive.length > 0 && allActive[0].id) {
          targetTab = allActive[0];
        }
      }

      if (!targetTab?.id) return;

      chrome.tabs.sendMessage(targetTab.id, { type: 'TOGGLE_INSPECTOR' }).catch(async () => {
        // In case content script is not yet injected into page
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

      <main className="flex-1 p-3 space-y-3 overflow-y-auto max-w-md mx-auto w-full pb-8">
        {selectedElement ? (
          <>
            {/* Component Hierarchy */}
            {cardsVisibility.showHierarchy && selectedElement.hierarchy && selectedElement.hierarchy.length > 0 && (
              <ComponentTree hierarchy={selectedElement.hierarchy} />
            )}

            {/* Visual Snapshot */}
            {cardsVisibility.showSnapshot && (
              <SnapshotCard elementData={selectedElement} />
            )}

            {/* Tailwind Classes & CSS Metrics */}
            {cardsVisibility.showStyles && (
              <StylesCard
                tailwindClasses={selectedElement.tailwindClasses}
                customClasses={selectedElement.customClasses}
                computedStyles={selectedElement.computedStyles}
              />
            )}

            {/* Props, Local State & Event Handlers */}
            {cardsVisibility.showState && (
              <StateCard dataContext={selectedElement.dataContext} />
            )}

            {/* AI Prompt Generator & JSON */}
            {cardsVisibility.showPrompt && (
              <PromptBox elementData={selectedElement} />
            )}
          </>
        ) : (
          /* Clean Monochromatic Empty State */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
              <MousePointerClick className="w-6 h-6 text-zinc-200" />
            </div>

            <div className="space-y-1 max-w-xs">
              <h2 className="text-sm font-semibold text-white">
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
                  <span>Árbol UI</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Jerarquía completa de componentes y DOM.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>AI Ready</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Genera prompts y JSON estructurado.
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
