import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, ShieldCheck, Coffee, Heart, ExternalLink, Layout, Cpu, Copy, Palette } from 'lucide-react';
import { AppSettings, CardVisibilitySettings } from '../../types';

const HIGHLIGHT_COLOR_PRESETS = [
  '#ffffff',
  '#22d3ee',
  '#a78bfa',
  '#f472b6',
  '#facc15',
  '#4ade80',
  '#fb923c',
  '#f87171',
];

const BACKGROUND_COLOR_PRESETS = [
  '#000000',
  '#09090b',
  '#0f172a',
  '#1e1b4b',
  '#052e16',
  '#450a0a',
  '#1c1917',
  '#111827',
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated?: (newSettings: AppSettings) => void;
}

const DEFAULT_CARDS: CardVisibilitySettings = {
  showHierarchy: true,
  showSnapshot: true,
  showState: true,
  showStyles: true,
  showPrompt: true,
};

const DEFAULT_SETTINGS: AppSettings = {
  autoCaptureScreenshot: true,
  showFloatingBanner: true,
  theme: 'dark',
  highlightColor: '#ffffff',
  backgroundColor: '#000000',
  customPromptPrefix: '',
  cards: DEFAULT_CARDS,
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsUpdated }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [mcpConnected, setMcpConnected] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['settings'], (res) => {
      if (res.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...res.settings,
          cards: { ...DEFAULT_CARDS, ...(res.settings.cards || {}) },
        });
      }
    });

    // Check MCP status
    if (isOpen) {
      fetch('http://127.0.0.1:42123/api/status')
        .then((res) => res.json())
        .then((data) => setMcpConnected(data?.status === 'online'))
        .catch(() => setMcpConnected(false));
    }
  }, [isOpen]);

  const handleCopyMcpConfig = async () => {
    const config = {
      mcpServers: {
        uaiselect: {
          command: "npx",
          args: ["-y", "uaiselect-mcp"]
        }
      }
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopiedMcp(true);
      setTimeout(() => setCopiedMcp(false), 2000);
    } catch {}
  };

  const handleSave = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      if (onSettingsUpdated) {
        onSettingsUpdated(settings);
      }
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 700);
    });
  };

  const toggleCard = (cardKey: keyof CardVisibilitySettings) => {
    setSettings((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardKey]: !prev.cards[cardKey],
      },
    }));
  };

  const toggleSetting = (settingKey: 'showFloatingBanner' | 'autoCaptureScreenshot') => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const handleOpenDonate = () => {
    window.open('https://ko-fi.com/danielmejiaruales', '_blank');
  };

  const handleOpenGithub = () => {
    window.open('https://github.com/Dearxia1/UaiSelect', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-850 bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-semibold text-xs text-zinc-100 tracking-wide">Configuración</h2>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800/80 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Inspector Overlay Behavior Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Comportamiento del Inspector</span>
            </div>
            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2 space-y-1.5">
              <div
                onClick={() => toggleSetting('showFloatingBanner')}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-900/60 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] text-zinc-300 block select-none">Barra flotante inferior</span>
                  <span className="text-[10px] text-zinc-500 block select-none">Muestra los atajos de teclado en pantalla</span>
                </div>
                <div
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    settings.showFloatingBanner !== false ? 'bg-[var(--uaiselect-accent)]' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-transform ${
                      settings.showFloatingBanner !== false
                        ? 'bg-[var(--uaiselect-accent-fg)] translate-x-3'
                        : 'bg-zinc-500 translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <div
                onClick={() => toggleSetting('autoCaptureScreenshot')}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-900/60 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] text-zinc-300 block select-none">Captura visual automática</span>
                  <span className="text-[10px] text-zinc-500 block select-none">Toma foto del elemento al hacer clic</span>
                </div>
                <div
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    settings.autoCaptureScreenshot !== false ? 'bg-[var(--uaiselect-accent)]' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-transform ${
                      settings.autoCaptureScreenshot !== false
                        ? 'bg-[var(--uaiselect-accent-fg)] translate-x-3'
                        : 'bg-zinc-500 translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Color Personalization Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium text-[11px]">
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span>Color de Resaltado</span>
            </div>
            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2.5 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {HIGHLIGHT_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSettings((prev) => ({ ...prev, highlightColor: color }))}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                      settings.highlightColor === color ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <label className="relative w-6 h-6 rounded-full cursor-pointer overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center bg-zinc-900">
                  <input
                    type="color"
                    value={settings.highlightColor || '#ffffff'}
                    onChange={(e) => setSettings((prev) => ({ ...prev, highlightColor: e.target.value }))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Color personalizado"
                  />
                  <div
                    className="w-full h-full"
                    style={{
                      background: HIGHLIGHT_COLOR_PRESETS.includes(settings.highlightColor)
                        ? 'conic-gradient(from 0deg, #f87171, #facc15, #4ade80, #22d3ee, #a78bfa, #f472b6, #f87171)'
                        : settings.highlightColor,
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Define el color del recuadro y la insignia que resalta el elemento seleccionado en la página.
              </p>
            </div>
          </div>

          {/* Background Color Personalization Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium text-[11px]">
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span>Color de Fondo</span>
            </div>
            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2.5 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {BACKGROUND_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: color }))}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 border border-zinc-800 ${
                      settings.backgroundColor === color ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <label className="relative w-6 h-6 rounded-full cursor-pointer overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center bg-zinc-900">
                  <input
                    type="color"
                    value={settings.backgroundColor || '#000000'}
                    onChange={(e) => setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Color personalizado"
                  />
                  <div
                    className="w-full h-full"
                    style={{
                      background: BACKGROUND_COLOR_PRESETS.includes(settings.backgroundColor)
                        ? 'conic-gradient(from 0deg, #000000, #1e1b4b, #052e16, #450a0a, #111827, #1c1917, #000000)'
                        : settings.backgroundColor,
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Define el color base del panel de la extensión. Se recomiendan tonos oscuros para mantener la legibilidad del texto.
              </p>
            </div>
          </div>

          {/* Card Visibility / Modules Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium text-[11px]">
              <Layout className="w-3.5 h-3.5 text-zinc-400" />
              <span>Módulos Visibles en el Panel</span>
            </div>
            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2 space-y-1.5">
              {[
                { key: 'showHierarchy', label: 'Jerarquía de Componentes' },
                { key: 'showSnapshot', label: 'Captura Visual Recortada' },
                { key: 'showStyles', label: 'Clases Tailwind & Estilos' },
                { key: 'showState', label: 'Props, Estado & Eventos' },
                { key: 'showPrompt', label: 'Generador de Prompt & JSON' },
              ].map((item) => {
                const isChecked = settings.cards[item.key as keyof CardVisibilitySettings];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleCard(item.key as keyof CardVisibilitySettings)}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-900/60 cursor-pointer transition-colors"
                  >
                    <span className="text-[11px] text-zinc-300 select-none">{item.label}</span>
                    <div
                      className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                        isChecked ? 'bg-[var(--uaiselect-accent)]' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-transform ${
                          isChecked
                            ? 'bg-[var(--uaiselect-accent-fg)] translate-x-3'
                            : 'bg-zinc-500 translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MCP Integration Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>Integración MCP (Cursor / Claude / Antigravity)</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                mcpConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}>
                {mcpConnected ? 'ONLINE :42123' : 'DESCONECTADO'}
              </span>
            </div>

            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2.5 space-y-2">
              <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                Permite a tus agentes de IA en el IDE consultar directamente el elemento seleccionado en el navegador sin copiar prompts.
              </p>

              <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-zinc-500">$ </span>
                  <span>npx -y uaiselect-mcp</span>
                </div>
                <button
                  onClick={handleCopyMcpConfig}
                  className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 rounded text-[10px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  title="Copiar configuración JSON para Cursor o Claude Desktop"
                >
                  {copiedMcp ? <Check className="w-3 h-3 text-zinc-100" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMcp ? 'Copiado' : 'Copiar Config'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shortcut reminder */}
          <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium text-[11px]">Atajo de activación</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-900 text-white rounded border border-zinc-700 font-mono font-semibold text-[10px]">
                Alt + Shift + X
              </kbd>
            </div>
          </div>

          {/* Support & Community */}
          <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-[11px]">
              <Heart className="w-3 h-3 text-zinc-400 fill-zinc-400" />
              <span>Proyecto Open Source</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              UaiSelect es libre y gratuito. Puedes apoyar su mantenimiento invitándome un café en Ko-fi.
            </p>
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={handleOpenDonate}
                className="flex-1 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Coffee className="w-3 h-3 text-zinc-300" />
                <span>Apoyar en Ko-fi</span>
              </button>
              <button
                onClick={handleOpenGithub}
                className="py-1.5 px-3 bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-lg font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
              >
                <ExternalLink className="w-3 h-3 text-zinc-400" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-2 bg-zinc-900/20 rounded-xl border border-zinc-850 text-zinc-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              Procesamiento 100% local en tu navegador. Ningún dato sale de tu equipo.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-zinc-850 bg-black/60 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--uaiselect-accent)] hover:brightness-90 text-[var(--uaiselect-accent-fg)] rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
