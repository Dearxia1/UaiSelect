import React, { useState, useEffect } from 'react';
import { X, Check, Laptop, ShieldCheck, Coffee, Heart, ExternalLink } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultEditor: 'vscode',
  customEditorScheme: 'vscode',
  autoCaptureScreenshot: true,
  theme: 'dark',
  highlightColor: '#6366f1',
  customPromptPrefix: '',
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['settings'], (res) => {
      if (res.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...res.settings });
      }
    });
  }, [isOpen]);

  const handleSave = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    });
  };

  const handleOpenDonate = () => {
    window.open('https://ko-fi.com/dearxia1', '_blank');
  };

  const handleOpenGithub = () => {
    window.open('https://github.com/Dearxia1/UaiSelect', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold text-sm text-slate-100">Configuración</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Editor selection */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Editor de Código por Defecto</label>
            <select
              value={settings.defaultEditor}
              onChange={(e) => setSettings({ ...settings, defaultEditor: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="vscode">Visual Studio Code (vscode://)</option>
              <option value="cursor">Cursor IDE (cursor://)</option>
              <option value="webstorm">WebStorm (webstorm://)</option>
            </select>
          </div>

          {/* Shortcut reminder */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block font-medium">Atajo de teclado global</span>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold text-[11px]">
                Alt + Shift + X
              </kbd>
              <span className="text-slate-500 text-[11px]">para activar el selector</span>
            </div>
          </div>

          {/* Support & Community */}
          <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>¿Te gusta UaiSelect?</span>
            </div>
            <p className="text-[11px] text-slate-400">
              UaiSelect es 100% gratuito y open source. Puedes apoyar su desarrollo invitándome un café en Ko-fi.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleOpenDonate}
                className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Apoyar en Ko-fi</span>
              </button>
              <button
                onClick={handleOpenGithub}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              UaiSelect procesa toda la información de forma 100% local en tu navegador. Ningún dato sale de tu máquina.
            </span>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? '¡Guardado!' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
