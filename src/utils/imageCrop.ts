import { SelectedElementData } from '../types';

/**
 * Crops a full viewport screenshot to the bounding box of the selected element
 */
export async function cropElementScreenshot(
  fullDataUrl: string,
  rect: SelectedElementData['rect'],
  viewport?: SelectedElementData['viewport'],
  padding = 12
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // Use viewport from the target webpage where selection was made
      const pageWidth = viewport?.width || (naturalWidth / (viewport?.devicePixelRatio || window.devicePixelRatio || 1));
      const pageHeight = viewport?.height || (naturalHeight / (viewport?.devicePixelRatio || window.devicePixelRatio || 1));

      const scaleX = naturalWidth / pageWidth;
      const scaleY = naturalHeight / pageHeight;

      // Calculate padded bounding box in image pixel coordinates
      const cropX = Math.max(0, Math.floor((rect.left - padding) * scaleX));
      const cropY = Math.max(0, Math.floor((rect.top - padding) * scaleY));
      const cropRight = Math.min(naturalWidth, Math.ceil((rect.right + padding) * scaleX));
      const cropBottom = Math.min(naturalHeight, Math.ceil((rect.bottom + padding) * scaleY));

      const cropWidth = cropRight - cropX;
      const cropHeight = cropBottom - cropY;

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
