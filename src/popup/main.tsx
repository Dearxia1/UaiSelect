import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Target, Sparkles, PanelRight } from 'lucide-react';
import '../sidepanel/index.css';

const PopupApp: React.FC = () => {
  const [active, setActive] = useState(false);

  const handleInspect = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_INSPECTOR' }, (res) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ['content.js'],
        }).then(() => {
          chrome.tabs.sendMessage(tab.id!, { type: 'TOGGLE_INSPECTOR' });
        });
      }
      setActive(res?.active ?? true);
      window.close();
    });
  };

  const handleOpenSidePanel = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (chrome.sidePanel && tab) {
      if (tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
          if (tab.windowId) chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
        });
      }
      window.close();
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-slate-100">UaiSelect</span>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/30">
          DevTools
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Haz clic en cualquier elemento en pantalla para ver su archivo, clases Tailwind y generar prompts de IA.
      </p>

      <button
        onClick={handleInspect}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
      >
        <Target className="w-4 h-4" />
        <span>{active ? 'Inspector Activo' : 'Activar Selector Visual'}</span>
      </button>

      <button
        onClick={handleOpenSidePanel}
        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <PanelRight className="w-3.5 h-3.5 text-indigo-400" />
        <span>Abrir Side Panel</span>
      </button>

      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
        <span>Atajo global:</span>
        <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-300 font-bold">
          Alt + Shift + X
        </kbd>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<PopupApp />);
}
