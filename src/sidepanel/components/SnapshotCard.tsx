import React, { useEffect, useState } from 'react';
import { Camera, Image as ImageIcon, Download, Copy, Check, Maximize2, Crop, Globe, RefreshCw } from 'lucide-react';
import { SelectedElementData } from '../../types';
import { cropElementScreenshot } from '../../utils/imageCrop';

interface SnapshotCardProps {
  elementData: SelectedElementData;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ elementData }) => {
  const [viewMode, setViewMode] = useState<'crop' | 'fullPage' | 'viewport'>('crop');
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [viewportUrl, setViewportUrl] = useState<string | null>(elementData.screenshotUrl || null);
  const [fullPageUrl, setFullPageUrl] = useState<string | null>(elementData.fullPageScreenshotUrl || null);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [loadingFullPage, setLoadingFullPage] = useState(false);
  const [loadingViewport, setLoadingViewport] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Always sync state when elementData updates or when navigating to another element/page
    setFullPageUrl(elementData.fullPageScreenshotUrl || null);
    setViewportUrl(elementData.screenshotUrl || null);

    if (elementData.screenshotUrl) {
      setLoadingCrop(true);
      cropElementScreenshot(elementData.screenshotUrl, elementData.rect, elementData.viewport)
        .then((url) => {
          if (isMounted) {
            setCroppedUrl(url);
            setLoadingCrop(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setCroppedUrl(elementData.screenshotUrl || null);
            setLoadingCrop(false);
          }
        });
    } else {
      setCroppedUrl(null);
    }

    return () => {
      isMounted = false;
    };
  }, [elementData]);

  const handleCaptureFullPage = () => {
    setLoadingFullPage(true);
    chrome.runtime.sendMessage({ type: 'CAPTURE_FULL_PAGE_REQUEST' }, (res) => {
      setLoadingFullPage(false);
      if (res && res.screenshotUrl) {
        setFullPageUrl(res.screenshotUrl);
        setViewMode('fullPage');
      }
    });
  };

  const handleCaptureViewport = () => {
    setLoadingViewport(true);
    chrome.runtime.sendMessage({ type: 'CAPTURE_VIEWPORT_REQUEST' }, (res) => {
      setLoadingViewport(false);
      if (res && res.screenshotUrl) {
        setViewportUrl(res.screenshotUrl);
        setViewMode('viewport');
        if (elementData.rect) {
          setLoadingCrop(true);
          cropElementScreenshot(res.screenshotUrl, elementData.rect, elementData.viewport)
            .then((url) => {
              setCroppedUrl(url);
              setLoadingCrop(false);
            })
            .catch(() => {
              setCroppedUrl(res.screenshotUrl);
              setLoadingCrop(false);
            });
        }
      }
    });
  };

  const getActiveUrl = () => {
    if (viewMode === 'crop') return croppedUrl;
    if (viewMode === 'fullPage') return fullPageUrl;
    return viewportUrl || elementData.screenshotUrl || null;
  };

  const activeUrl = getActiveUrl();

  const handleDownload = () => {
    if (!activeUrl) return;
    const a = document.createElement('a');
    a.href = activeUrl;
    const suffix = viewMode === 'crop' ? 'element' : viewMode === 'fullPage' ? 'full-webpage' : 'viewport';
    a.download = `uaiselect-${elementData.source?.componentName || elementData.tagName}-${suffix}-${Date.now()}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!activeUrl) return;
    try {
      const res = await fetch(activeUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Error copying image:', err);
    }
  };

  return (
    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2.5 shadow-sm">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5 text-zinc-400" />
          <span>Captura Visual</span>
        </div>

        {activeUrl && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyImage}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Copiar imagen al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Descargar imagen PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* View Mode Switcher: Recorte vs Toda la Web vs Pantalla */}
      <div className="flex rounded-lg bg-black/60 p-0.5 border border-zinc-900 text-[11px] font-medium gap-0.5">
        <button
          onClick={() => setViewMode('crop')}
          className={`flex-1 py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
            viewMode === 'crop'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Recorte ajustado al elemento seleccionado"
        >
          <Crop className="w-3 h-3 shrink-0" />
          <span className="truncate">Recorte</span>
        </button>

        <button
          onClick={() => {
            setViewMode('fullPage');
            if (!fullPageUrl && !loadingFullPage) {
              handleCaptureFullPage();
            }
          }}
          className={`flex-1 py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
            viewMode === 'fullPage'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Captura de TODA la página web completa con scroll"
        >
          <Globe className="w-3 h-3 shrink-0" />
          <span className="truncate">Toda la Web</span>
        </button>

        <button
          onClick={() => {
            setViewMode('viewport');
            if (!viewportUrl && !loadingViewport) {
              handleCaptureViewport();
            }
          }}
          className={`flex-1 py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
            viewMode === 'viewport'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Captura de la pantalla visible"
        >
          <Maximize2 className="w-3 h-3 shrink-0" />
          <span className="truncate">Pantalla</span>
        </button>
      </div>

      {/* Snapshot Preview Box */}
      <div className="relative rounded-lg overflow-hidden border border-zinc-900 bg-black min-h-[100px] flex flex-col items-center justify-center p-2">
        {loadingCrop && viewMode === 'crop' ? (
          <div className="text-xs text-zinc-500 flex items-center gap-2 py-4">
            <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span>Procesando recorte...</span>
          </div>
        ) : loadingFullPage && viewMode === 'fullPage' ? (
          <div className="text-xs text-zinc-400 flex flex-col items-center gap-2 py-6">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-zinc-300">Capturando toda la página web con scroll...</span>
            <span className="text-[10px] text-zinc-500">Uniendo secciones y limpiando navbars fijas</span>
          </div>
        ) : loadingViewport && viewMode === 'viewport' ? (
          <div className="text-xs text-zinc-400 flex flex-col items-center gap-2 py-6">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-zinc-300">Capturando pantalla actual...</span>
          </div>
        ) : viewMode === 'fullPage' && !fullPageUrl ? (
          <div className="text-xs text-zinc-400 flex flex-col items-center gap-2 py-4">
            <Globe className="w-6 h-6 text-zinc-600" />
            <span className="text-zinc-300 font-medium">Captura de Toda la Web</span>
            <p className="text-[10px] text-zinc-500 text-center max-w-[220px]">
              Hace scroll por toda la página para capturarla completa de arriba a abajo.
            </p>
            <button
              onClick={handleCaptureFullPage}
              className="mt-1 px-2.5 py-1 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>Capturar Toda la Web</span>
            </button>
          </div>
        ) : viewMode === 'viewport' && !activeUrl ? (
          <div className="text-xs text-zinc-400 flex flex-col items-center gap-2 py-4">
            <Maximize2 className="w-6 h-6 text-zinc-600" />
            <span className="text-zinc-300 font-medium">Captura de Pantalla Visible</span>
            <p className="text-[10px] text-zinc-500 text-center max-w-[220px]">
              Captura lo que se está viendo en pantalla en este momento.
            </p>
            <button
              onClick={handleCaptureViewport}
              className="mt-1 px-2.5 py-1 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>Capturar Pantalla</span>
            </button>
          </div>
        ) : activeUrl ? (
          <div className="relative w-full flex flex-col items-center">
            <img
              src={activeUrl}
              alt="Snapshot preview"
              className={`w-auto object-contain rounded border border-zinc-800/60 shadow-sm ${
                viewMode === 'fullPage' ? 'max-h-64' : 'max-h-48'
              }`}
            />
            <div className="w-full flex justify-end pt-1.5 gap-2">
              {viewMode === 'fullPage' && (
                <button
                  onClick={handleCaptureFullPage}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Volver a capturar toda la página"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Recapturar web</span>
                </button>
              )}
              {viewMode === 'viewport' && (
                <button
                  onClick={handleCaptureViewport}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Actualizar y recapturar la pantalla visible actual"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Recapturar pantalla</span>
                </button>
              )}
            </div>
          </div>
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
