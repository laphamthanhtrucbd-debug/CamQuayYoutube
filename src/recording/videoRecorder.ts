import { CapturedMediaItem } from '../types/effects';
import { getSupportedVideoMimeType } from '../utils/browserUtils';
import { formatReadableTimestamp, generateMediaFilename } from './fileNaming';

/**
 * Records the real-time processed canvas combined with the user's selected Microphone audio track.
 * Uses hardware-friendly codecs (H264/VP8), direct frame capture without timer jitter,
 * and continuous buffer recording so playback is 100% smooth without stutter.
 */
export class ProcessedVideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTimeMs: number = 0;
  private canvasStream: MediaStream | null = null;

  public startRecording(
    processedCanvas: HTMLCanvasElement,
    audioStream: MediaStream | null
  ): { hasAudio: boolean } {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      return { hasAudio: false };
    }

    this.recordedChunks = [];

    // Passing 0 or 30: captureStream(30) with hardware H.264/VP8 and 3.5 Mbps bitrate
    // avoids CPU encoder bottlenecks and syncs cleanly with requestAnimationFrame
    this.canvasStream = processedCanvas.captureStream(30);

    const combinedTracks: MediaStreamTrack[] = [...this.canvasStream.getVideoTracks()];
    let hasAudio = false;

    if (audioStream) {
      const audioTracks = audioStream
        .getAudioTracks()
        .filter((t) => t.readyState === 'live' && t.enabled);
      if (audioTracks.length > 0) {
        // Clone audio track so stopping the recorder never disrupts the live mic stream
        combinedTracks.push(...audioTracks.map((t) => t.clone()));
        hasAudio = true;
      }
    }

    const combinedStream = new MediaStream(combinedTracks);
    const mimeType = getSupportedVideoMimeType();

    const recorderOptions: MediaRecorderOptions = {
      videoBitsPerSecond: 4_000_000,
      audioBitsPerSecond: 128_000,
    };
    if (mimeType) {
      recorderOptions.mimeType = mimeType;
    }

    this.mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.startTimeMs = Date.now();
    // Record in a continuous stream and flush every 500ms so both header keyframes and frames are intact
    this.mediaRecorder.start(500);
    return { hasAudio };
  }

  public stopRecording(): Promise<CapturedMediaItem> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('Trình ghi video hiện không hoạt động.'));
        return;
      }

      const recorder = this.mediaRecorder;
      const mimeType = recorder.mimeType || 'video/webm';
      const durationSec = Math.max(1, Math.round((Date.now() - this.startTimeMs) / 1000));

      recorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const filename = generateMediaFilename('Lumina_Video', ext);

        // Clean up cloned recording tracks
        recorder.stream.getTracks().forEach((t) => t.stop());
        if (this.canvasStream) {
          this.canvasStream.getTracks().forEach((t) => t.stop());
          this.canvasStream = null;
        }

        this.recordedChunks = [];
        this.mediaRecorder = null;

        resolve({
          id: `video_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          type: 'video',
          url,
          filename,
          timestamp: formatReadableTimestamp(),
          durationSec,
          sizeBytes: blob.size,
        });
      };

      try {
        if (recorder.state === 'recording') {
          recorder.requestData();
        }
      } catch {
        // Ignore if browser flushes automatically on stop
      }
      recorder.stop();
    });
  }

  public isRecording(): boolean {
    return !!this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }
}

export const processedVideoRecorder = new ProcessedVideoRecorder();
