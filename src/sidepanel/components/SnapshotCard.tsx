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
      cropElementScreenshot(elementData.screenshotUrl, elementData.rect, elementData.viewport)
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
    } catch {}
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5 text-zinc-400" />
          <span>Captura Visual</span>
        </div>

        {croppedUrl && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyImage}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Copiar imagen"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Descargar PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden border border-zinc-900 bg-black min-h-[90px] flex items-center justify-center p-2">
        {loading ? (
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span>Procesando captura...</span>
          </div>
        ) : croppedUrl ? (
          <img
            src={croppedUrl}
            alt="Element snapshot"
            className="max-h-44 max-w-full object-contain rounded border border-zinc-800/60 shadow-sm"
          />
        ) : (
          <div className="text-xs text-zinc-600 flex flex-col items-center gap-1 py-3">
            <ImageIcon className="w-5 h-5 text-zinc-700" />
            <span>Sin captura disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};
