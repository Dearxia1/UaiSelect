import React from 'react';
import { Target, Settings as SettingsIcon, Sparkles, Coffee } from 'lucide-react';

interface HeaderProps {
  onToggleInspector: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleInspector,
  onOpenSettings,
}) => {
  const handleOpenDonate = () => {
    window.open('https://ko-fi.com/danielmejiaruales', '_blank');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-200" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 leading-none">
            UaiSelect
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">AI Visual Inspector</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleOpenDonate}
          className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors cursor-pointer"
          title="Invítame un café ☕ (Buy Me a Coffee)"
        >
          <Coffee className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleInspector}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          title="Activar selector en la página (Alt+Shift+X)"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Inspeccionar</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          title="Configuración"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
