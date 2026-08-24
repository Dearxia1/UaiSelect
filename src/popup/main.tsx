import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Target, PanelRight } from 'lucide-react';
import { Logo } from '../sidepanel/components/Logo';
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
    
    // Firefox SidebarAction
    const firefoxBrowser = (globalThis as any).browser;
    if (firefoxBrowser?.sidebarAction?.open) {
      await firefoxBrowser.sidebarAction.open().catch(() => {});
      window.close();
      return;
    }

    // Chrome SidePanel
    const browserApi = (globalThis as any).chrome;
    const sidePanelApi = browserApi ? browserApi['sidePanel'] : undefined;
    if (sidePanelApi && typeof sidePanelApi.open === 'function' && tab) {
      if (tab.id) {
        await sidePanelApi.open({ tabId: tab.id }).catch(() => {
          if (tab.windowId) sidePanelApi.open({ windowId: tab.windowId }).catch(() => {});
        });
      }
    }

    window.close();
  };

  return (
    <div className="space-y-3 bg-black text-zinc-100 p-1">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <Logo height={16} className="text-white" />
        <span className="text-[9px] bg-zinc-900 text-zinc-400 font-mono font-semibold px-1.5 py-0.5 rounded border border-zinc-800">
          DevTools
        </span>
      </div>

      <p className="text-xs text-zinc-400">
        Haz clic en cualquier elemento en pantalla para ver su archivo, clases Tailwind y generar prompts o JSON.
      </p>

      <button
        onClick={handleInspect}
        className="w-full py-2 px-3 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
      >
        <Target className="w-3.5 h-3.5" />
        <span>{active ? 'Inspector Activo' : 'Activar Selector Visual'}</span>
      </button>

      <button
        onClick={handleOpenSidePanel}
        className="w-full py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <PanelRight className="w-3.5 h-3.5 text-zinc-400" />
        <span>Abrir Panel Lateral</span>
      </button>

      <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-900">
        <span>Atajo global:</span>
        <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-zinc-300 font-bold">
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
