import React, { useState, useEffect } from 'react';
import { Target, Sparkles, MousePointerClick, Code2 } from 'lucide-react';
import { ExtensionMessage, SelectedElementData } from '../types';
import { Header } from './components/Header';
import { SourceCard } from './components/SourceCard';
import { ComponentTree } from './components/ComponentTree';
import { StylesCard } from './components/StylesCard';
import { SnapshotCard } from './components/SnapshotCard';
import { PromptBox } from './components/PromptBox';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultEditor, setDefaultEditor] = useState('vscode');

  useEffect(() => {
    // 1. Load initial selected element from storage
    chrome.storage.local.get(['lastSelectedElement', 'settings'], (result) => {
      if (result.lastSelectedElement) {
        setSelectedElement(result.lastSelectedElement);
      }
      if (result.settings?.defaultEditor) {
        setDefaultEditor(result.settings.defaultEditor);
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Header
        onToggleInspector={handleToggleInspector}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-w-md mx-auto w-full pb-8">
        {selectedElement ? (
          <>
            {/* Source Code Location & Editor Launcher */}
            <SourceCard
              source={selectedElement.source}
              tagName={selectedElement.tagName}
              defaultEditor={defaultEditor}
            />

            {/* Component Hierarchy */}
            {selectedElement.hierarchy && selectedElement.hierarchy.length > 0 && (
              <ComponentTree hierarchy={selectedElement.hierarchy} />
            )}

            {/* Visual Snapshot */}
            <SnapshotCard elementData={selectedElement} />

            {/* Tailwind Classes & CSS Metrics */}
            <StylesCard
              tailwindClasses={selectedElement.tailwindClasses}
              customClasses={selectedElement.customClasses}
              computedStyles={selectedElement.computedStyles}
            />

            {/* AI Prompt Generator */}
            <PromptBox elementData={selectedElement} />
          </>
        ) : (
          /* Empty State */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 animate-pulse">
              <MousePointerClick className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h2 className="text-base font-bold text-slate-100">
                Selecciona cualquier elemento
              </h2>
              <p className="text-xs text-slate-400">
                Haz clic en el botón inferior o presiona <kbd className="px-1.5 py-0.5 bg-slate-800 text-indigo-300 rounded font-mono text-[11px] border border-slate-700">Alt+Shift+X</kbd> para activar el inspector visual.
              </p>
            </div>

            <button
              onClick={handleToggleInspector}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Activar Inspector Visual</span>
            </button>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 gap-2 w-full pt-6 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Click-to-Source</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Detecta archivo `.tsx` o `.vue` y línea exacta.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Ready Prompts</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Genera prompts estructurados con 1 clic.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
