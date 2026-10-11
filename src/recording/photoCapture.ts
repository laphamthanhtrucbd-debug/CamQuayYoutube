import { CapturedMediaItem } from '../types/effects';
import { formatReadableTimestamp, generateMediaFilename } from './fileNaming';

/**
 * Captures a high-quality PNG frame directly from the processed output canvas
 * (containing all Beauty, Face, Eye, Nose, Lip, Eyebrow, AR, and Filter effects).
 */
export async function captureProcessedPhoto(
  processedCanvas: HTMLCanvasElement
): Promise<CapturedMediaItem> {
  return new Promise((resolve, reject) => {
    processedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Không thể tạo ảnh từ khung hình hiện tại.'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const filename = generateMediaFilename('Lumina_Photo', 'png');
        resolve({
          id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          type: 'photo',
          url,
          filename,
          timestamp: formatReadableTimestamp(),
          sizeBytes: blob.size,
        });
      },
      'image/png',
      1.0
    );
  });
}

export function triggerFileDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
