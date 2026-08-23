import React, { useState, useEffect } from 'react';
import { Target, Sparkles, MousePointerClick, Code2 } from 'lucide-react';
import { AppSettings, CardVisibilitySettings, ExtensionMessage, SelectedElementData } from '../types';
import { Header } from './components/Header';
import { SourceCard } from './components/SourceCard';
import { ComponentTree } from './components/ComponentTree';
import { StylesCard } from './components/StylesCard';
import { SnapshotCard } from './components/SnapshotCard';
import { PromptBox } from './components/PromptBox';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_CARDS: CardVisibilitySettings = {
  showSource: true,
  showHierarchy: true,
  showSnapshot: true,
  showStyles: true,
  showPrompt: true,
};

export const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultEditor, setDefaultEditor] = useState('vscode');
  const [cardsVisibility, setCardsVisibility] = useState<CardVisibilitySettings>(DEFAULT_CARDS);

  useEffect(() => {
    // 1. Load initial selected element and settings from storage
    chrome.storage.local.get(['lastSelectedElement', 'settings'], (result) => {
      if (result.lastSelectedElement) {
        setSelectedElement(result.lastSelectedElement);
      }
      if (result.settings?.defaultEditor) {
        setDefaultEditor(result.settings.defaultEditor);
      }
      if (result.settings?.cards) {
        setCardsVisibility({ ...DEFAULT_CARDS, ...result.settings.cards });
      }
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
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_INSPECTOR' }).catch(async () => {
        // In case content script is not yet injected
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ['content.js'],
        });
        chrome.tabs.sendMessage(tab.id!, { type: 'TOGGLE_INSPECTOR' });
      });
    } catch (err) {
      console.error('Error toggling inspector:', err);
    }
  };

  const handleSettingsUpdated = (newSettings: AppSettings) => {
    if (newSettings.defaultEditor) {
      setDefaultEditor(newSettings.defaultEditor);
    }
    if (newSettings.cards) {
      setCardsVisibility({ ...DEFAULT_CARDS, ...newSettings.cards });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-100 antialiased font-sans">
      <Header
        onToggleInspector={handleToggleInspector}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 p-3 space-y-3 overflow-y-auto max-w-md mx-auto w-full pb-8">
        {selectedElement ? (
          <>
            {/* Source Code Location & Editor Launcher */}
            {cardsVisibility.showSource && (
              <SourceCard
                source={selectedElement.source}
                tagName={selectedElement.tagName}
                defaultEditor={defaultEditor}
              />
            )}

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
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Activar Inspector Visual</span>
            </button>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 gap-2 w-full pt-4 text-left">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-200 text-xs font-semibold">
                  <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Click-to-Source</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Detecta archivo `.tsx`/`.vue` y línea exacta.
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
