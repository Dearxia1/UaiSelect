import React, { useEffect, useState } from 'react';
import { Target, Settings as SettingsIcon, Coffee } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onToggleInspector: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleInspector,
  onOpenSettings,
}) => {
  const [mcpOnline, setMcpOnline] = useState(false);

  useEffect(() => {
    const checkMcp = () => {
      fetch('http://127.0.0.1:42123/api/status', { method: 'GET' })
        .then((res) => res.json())
        .then((data) => {
          setMcpOnline(data?.status === 'online');
        })
        .catch(() => {
          setMcpOnline(false);
        });
    };

    checkMcp();
    const timer = setInterval(checkMcp, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenDonate = () => {
    window.open('https://ko-fi.com/danielmejiaruales', '_blank');
  };

  return (
    <header className="flex items-center justify-between px-3.5 py-2.5 bg-black/90 backdrop-blur border-b border-zinc-800/80 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Logo height={15} className="text-white hover:opacity-90 transition-opacity" />
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
            mcpOnline
              ? 'bg-zinc-900 text-white border-zinc-700 shadow-sm'
              : 'bg-zinc-950 text-zinc-500 border-zinc-850'
          }`}
          title={mcpOnline ? "MCP Bridge Conectado con IDE (127.0.0.1:42123)" : "MCP Bridge Inactivo. Haz clic para ver guía de conexión"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${mcpOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-500' : 'bg-zinc-600'}`} />
          <span>MCP</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleOpenDonate}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
          title="Apoyar en Ko-fi ☕"
        >
          <Coffee className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleInspector}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-200 text-black rounded-md text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          title="Activar selector en la página (Alt+Shift+X)"
        >
          <Target className="w-3 h-3" />
          <span>Inspeccionar</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
          title="Configuración"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
