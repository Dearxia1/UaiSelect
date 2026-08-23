import React, { useEffect, useState } from 'react';
import { Camera, Image as ImageIcon, Download, Copy, Check } from 'lucide-react';
import { SelectedElementData } from '../../types';
import { cropElementScreenshot } from '../../utils/imageCrop';

interface SnapshotCardProps {
  elementData: SelectedElementData;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ elementData }) => {
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (elementData.screenshotUrl) {
      setLoading(true);
      cropElementScreenshot(elementData.screenshotUrl, elementData.rect)
        .then((url) => {
          if (isMounted) {
            setCroppedUrl(url);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setCroppedUrl(elementData.screenshotUrl || null);
            setLoading(false);
          }
        });
    } else {
      setCroppedUrl(null);
    }
    return () => {
      isMounted = false;
    };
  }, [elementData]);

  const handleDownload = () => {
    if (!croppedUrl) return;
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = `uaiselect-${elementData.source?.componentName || elementData.tagName}-${Date.now()}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!croppedUrl) return;
    try {
      const res = await fetch(croppedUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Captura Visual</span>
        </div>

        {croppedUrl && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyImage}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Copiar imagen al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Descargar captura PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950/80 min-h-[100px] flex items-center justify-center p-2">
        {loading ? (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Procesando captura...</span>
          </div>
        ) : croppedUrl ? (
          <img
            src={croppedUrl}
            alt="Element snapshot"
            className="max-h-48 max-w-full object-contain rounded shadow-md"
          />
        ) : (
          <div className="text-xs text-slate-600 flex flex-col items-center gap-1 py-4">
            <ImageIcon className="w-6 h-6 text-slate-700" />
            <span>Sin captura disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};
