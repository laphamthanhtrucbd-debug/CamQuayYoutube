import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { NormalizedLandmark } from '../types/face';

let isConsoleFilterInstalled = false;

/**
 * MediaPipe's compiled Emscripten WASM runtime writes standard C++ TFLite
 * INFO and WARNING status messages (such as "INFO: Created TensorFlow Lite XNNPACK delegate for CPU")
 * directly to stderr, which Emscripten maps to `console.error`.
 * We filter out those non-error diagnostic messages so they are not misreported as application errors.
 */
function installMediaPipeLogFilter(): void {
  if (isConsoleFilterInstalled || typeof window === 'undefined') return;
  isConsoleFilterInstalled = true;

  const isBenignMediaPipeLog = (args: unknown[]): boolean => {
    if (args.length === 0) return false;
    const first = String(args[0] ?? '');
    return (
      first.includes('INFO: Created TensorFlow Lite') ||
      first.includes('XNNPACK delegate') ||
      first.includes('gl_context') ||
      first.includes('Graph successfully started running') ||
      first.startsWith('I0000 ') ||
      first.startsWith('W0000 ')
    );
  };

  const origError = console.error.bind(console);
  const origWarn = console.warn.bind(console);

  console.error = (...args: unknown[]) => {
    if (isBenignMediaPipeLog(args)) return;
    origError(...args);
  };

  console.warn = (...args: unknown[]) => {
    if (isBenignMediaPipeLog(args)) return;
    origWarn(...args);
  };
}

installMediaPipeLogFilter();

export class FaceLandmarkerService {
  private landmarker: FaceLandmarker | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;
  private lastVideoTime = -1;
  private lastTimestampMs = 0;

  public async initialize(): Promise<void> {
    if (this.landmarker) return;
    if (this.initPromise) return this.initPromise;

    installMediaPipeLogFilter();
    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/wasm');

        try {
          this.landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            outputFaceBlendshapes: false,
            runningMode: 'VIDEO',
            numFaces: 1,
          });
        } catch {
          // Fallback to CPU delegate if WebGL/GPU delegate is restricted
          this.landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'CPU',
            },
            outputFaceBlendshapes: false,
            runningMode: 'VIDEO',
            numFaces: 1,
          });
        }
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  public detect(video: HTMLVideoElement, timestampMs: number): NormalizedLandmark[] | null {
    if (!this.landmarker || this.isInitializing) return null;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) return null;

    if (video.currentTime === this.lastVideoTime) {
      return null; // Same video frame
    }
    this.lastVideoTime = video.currentTime;

    // MediaPipe requires strictly monotonically increasing timestamps
    const safeTimestamp = Math.max(Math.floor(timestampMs), this.lastTimestampMs + 1);
    this.lastTimestampMs = safeTimestamp;

    try {
      const result = this.landmarker.detectForVideo(video, safeTimestamp);
      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        return result.faceLandmarks[0] as NormalizedLandmark[];
      }
    } catch {
      return null;
    }

    return null;
  }

  public isReady(): boolean {
    return !!this.landmarker;
  }
}

export const faceLandmarkerService = new FaceLandmarkerService();
