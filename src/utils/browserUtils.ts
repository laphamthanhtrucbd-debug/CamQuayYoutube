export function isMediaDevicesSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Selects the most reliable real-time Canvas video codec supported by the browser.
 * Note: On Windows Chrome/Edge, `video/webm;codecs=h264` hardware encoders frequently fail
 * to encode RGB canvas frames and output a black video stream. VP8 (`vp8,opus`) is 100%
 * compatible with `canvas.captureStream()`, ultra-fast, and always records true video frames.
 */
export function getSupportedVideoMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9,opus',
    'video/webm',
    'video/mp4',
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return '';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
