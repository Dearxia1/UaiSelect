import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, ShieldCheck, Coffee, Heart, ExternalLink, Layout } from 'lucide-react';
import { AppSettings, CardVisibilitySettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated?: (newSettings: AppSettings) => void;
}

const DEFAULT_CARDS: CardVisibilitySettings = {
  showSource: true,
  showHierarchy: true,
  showSnapshot: true,
  showStyles: true,
  showPrompt: true,
};

const DEFAULT_SETTINGS: AppSettings = {
  defaultEditor: 'vscode',
  customEditorScheme: 'vscode',
  autoCaptureScreenshot: true,
  theme: 'dark',
  highlightColor: '#ffffff',
  customPromptPrefix: '',
  cards: DEFAULT_CARDS,
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsUpdated }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

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
  }, [isOpen]);

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
          {/* Card Visibility / Modules Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium text-[11px]">
              <Layout className="w-3.5 h-3.5 text-zinc-400" />
              <span>Módulos Visibles en el Panel</span>
            </div>
            <div className="bg-black/60 rounded-xl border border-zinc-850 p-2 space-y-1.5">
              {[
                { key: 'showSource', label: 'Ubicación de Código (Archivo:Línea)' },
                { key: 'showHierarchy', label: 'Jerarquía de Componentes' },
                { key: 'showSnapshot', label: 'Captura Visual Recortada' },
                { key: 'showStyles', label: 'Clases Tailwind & Estilos' },
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
                        isChecked ? 'bg-white' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-transform ${
                          isChecked
                            ? 'bg-black translate-x-3'
                            : 'bg-zinc-500 translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editor selection */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-[11px] block">Editor de Código por Defecto</label>
            <select
              value={settings.defaultEditor}
              onChange={(e) => setSettings({ ...settings, defaultEditor: e.target.value as any })}
              className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-500 cursor-pointer font-sans text-xs"
            >
              <option value="vscode">Visual Studio Code (vscode://)</option>
              <option value="cursor">Cursor IDE (cursor://)</option>
              <option value="webstorm">WebStorm (webstorm://)</option>
            </select>
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
