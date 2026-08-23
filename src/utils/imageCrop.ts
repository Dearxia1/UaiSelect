import { SelectedElementData } from '../types';

/**
 * Crops a full viewport screenshot to the bounding box of the selected element
 */
export async function cropElementScreenshot(
  fullDataUrl: string,
  rect: SelectedElementData['rect'],
  padding = 12
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Calculate scale factor in case of high-DPI / Retina displays
      const dpr = window.devicePixelRatio || 1;
      
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const clientWidth = window.innerWidth;
      const clientHeight = window.innerHeight;

      const scaleX = naturalWidth / clientWidth || dpr;
      const scaleY = naturalHeight / clientHeight || dpr;

      // Calculate padded coordinates
      const cropX = Math.max(0, (rect.left - padding) * scaleX);
      const cropY = Math.max(0, (rect.top - padding) * scaleY);
      const cropWidth = Math.min(naturalWidth - cropX, (rect.width + padding * 2) * scaleX);
      const cropHeight = Math.min(naturalHeight - cropY, (rect.height + padding * 2) * scaleY);

      if (cropWidth <= 0 || cropHeight <= 0) {
        resolve(fullDataUrl);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(fullDataUrl);
        return;
      }

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      resolve(fullDataUrl);
    };

    img.src = fullDataUrl;
  });
}
