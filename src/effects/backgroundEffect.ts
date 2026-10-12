import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';
import { FaceRegions, Point2D } from '../types/face';
import { BackgroundEffectSettings, BackgroundModeId } from '../types/effects';
import { createSmoothClosedPath } from '../utils/imageUtils';

export interface BackgroundOption {
  id: BackgroundModeId;
  name: string;
  subtitle: string;
  previewCss: string;
}

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'none',
    name: 'Phông nền gốc',
    subtitle: 'Giữ nguyên không gian thật',
    previewCss: 'linear-gradient(135deg, #27272A 0%, #18181B 100%)',
  },
  {
    id: 'blur-soft',
    name: 'Xóa phông tự nhiên',
    subtitle: 'Làm mờ nhẹ hậu cảnh kiểu ống kính chân dung',
    previewCss: 'linear-gradient(135deg, #52525B 0%, #27272A 100%)',
  },
  {
    id: 'blur-bokeh',
    name: 'Xóa phông sâu Studio',
    subtitle: 'Làm mờ mạnh hậu cảnh, làm nổi bật chủ thể',
    previewCss: 'linear-gradient(135deg, #71717A 0%, #18181B 100%)',
  },
  {
    id: 'studio-warm',
    name: 'Phông Studio Kem Ấm',
    subtitle: 'Ánh sáng ấm Hàn Quốc hòa quyện tự nhiên',
    previewCss: 'linear-gradient(135deg, #F5E6D3 0%, #D9B89C 100%)',
  },
  {
    id: 'studio-rose',
    name: 'Phông Studio Hồng Phấn',
    subtitle: 'Ánh hồng pastel dịu nhẹ tôn da',
    previewCss: 'linear-gradient(135deg, #FCE7F3 0%, #F472B6 100%)',
  },
  {
    id: 'luxury-dark',
    name: 'Phông Studio Đen Sang Trọng',
    subtitle: 'Hậu cảnh tối chiều sâu tập trung vào gương mặt',
    previewCss: 'radial-gradient(circle, #3F3F46 0%, #09090B 100%)',
  },
  {
    id: 'sky-pastel',
    name: 'Mây Trời Trong Trẻo',
    subtitle: 'Hậu cảnh xanh lam dịu mát tự nhiên',
    previewCss: 'linear-gradient(180deg, #BAE6FD 0%, #FEF3C7 100%)',
  },
  {
    id: 'neon-cyber',
    name: 'Ánh Đèn Đêm Neon',
    subtitle: 'Hậu cảnh tím hồng điện ảnh hiện đại',
    previewCss: 'linear-gradient(135deg, #311042 0%, #831843 55%, #1E1B4B 100%)',
  },
  {
    id: 'custom-image',
    name: 'Ảnh nền tự chọn',
    subtitle: 'Tải ảnh nền bất kỳ từ máy tính',
    previewCss: 'linear-gradient(135deg, #E11D48 0%, #4F46E5 100%)',
  },
];

class SelfieSegmenterManager {
  private segmenter: ImageSegmenter | null = null;
  private isInitializing = false;
  private lastTimestampMs = 0;
  private maskCanvas: HTMLCanvasElement | null = null;
  private maskImageData: ImageData | null = null;

  public ensureInitialized(): void {
    if (this.segmenter || this.isInitializing || typeof window === 'undefined') return;
    this.isInitializing = true;

    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/wasm');
        const modelUrls = [
          'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
          'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite',
        ];

        for (const modelAssetPath of modelUrls) {
          try {
            this.segmenter = await ImageSegmenter.createFromOptions(vision, {
              baseOptions: { modelAssetPath, delegate: 'GPU' },
              runningMode: 'VIDEO',
              outputCategoryMask: false,
              outputConfidenceMasks: true,
            });
            break;
          } catch {
            try {
              this.segmenter = await ImageSegmenter.createFromOptions(vision, {
                baseOptions: { modelAssetPath, delegate: 'CPU' },
                runningMode: 'VIDEO',
                outputCategoryMask: false,
                outputConfidenceMasks: true,
              });
              break;
            } catch {
              // Try next URL
            }
          }
        }
      } finally {
        this.isInitializing = false;
      }
    })();
  }

  public getPersonMaskCanvas(
    sourceCanvas: HTMLCanvasElement,
    timestampMs: number
  ): HTMLCanvasElement | null {
    this.ensureInitialized();
    if (!this.segmenter) return null;

    const safeTs = Math.max(Math.floor(timestampMs), this.lastTimestampMs + 1);
    this.lastTimestampMs = safeTs;

    try {
      const result = this.segmenter.segmentForVideo(sourceCanvas, safeTs);
      const confMasks = result.confidenceMasks;
      if (!confMasks || confMasks.length === 0) {
        result.close();
        return null;
      }

      const mask = confMasks[0];
      const mw = mask.width;
      const mh = mask.height;
      const floatData = mask.getAsFloat32Array();

      if (!this.maskCanvas) {
        this.maskCanvas = document.createElement('canvas');
      }
      if (this.maskCanvas.width !== mw || this.maskCanvas.height !== mh) {
        this.maskCanvas.width = mw;
        this.maskCanvas.height = mh;
        this.maskImageData = null;
      }

      const mCtx = this.maskCanvas.getContext('2d');
      if (!mCtx) {
        result.close();
        return null;
      }

      if (!this.maskImageData) {
        this.maskImageData = mCtx.createImageData(mw, mh);
      }
      const imgData = this.maskImageData.data;

      // Soft, wide-feathered confidence ramp so hair strands and shoulders blend naturally without sharp cutout borders!
      for (let i = 0; i < floatData.length; i++) {
        const prob = floatData[i];
        const norm = Math.max(0, Math.min(1, (prob - 0.15) / 0.65));
        const smoothAlpha = Math.round(norm * norm * (3 - 2 * norm) * 255);
        const idx = i * 4;
        imgData[idx] = 255;
        imgData[idx + 1] = 255;
        imgData[idx + 2] = 255;
        imgData[idx + 3] = smoothAlpha;
      }

      mCtx.putImageData(this.maskImageData, 0, 0);
      result.close();
      return this.maskCanvas;
    } catch {
      return null;
    }
  }
}

const selfieSegmenter = new SelfieSegmenterManager();

let bgLayerCanvas: HTMLCanvasElement | null = null;
let fgLayerCanvas: HTMLCanvasElement | null = null;
let silMaskCanvas: HTMLCanvasElement | null = null;
let cachedCustomBgUrl = '';
let cachedCustomBgImg: HTMLImageElement | null = null;
let cachedCustomBgLoaded = false;

function ensureCustomBgLoaded(url: string): HTMLImageElement | null {
  if (!url) return null;
  if (url !== cachedCustomBgUrl) {
    cachedCustomBgUrl = url;
    cachedCustomBgLoaded = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedCustomBgLoaded = true;
    };
    img.src = url;
    cachedCustomBgImg = img;
  }
  return cachedCustomBgLoaded ? cachedCustomBgImg : null;
}

/**
 * Renders natural, optical studio background lighting & portrait bokeh:
 * Instead of a flat, fake-looking solid wall cutout, studio presets blend a blurred version
 * of the real room depth with studio color lighting and soft vignette so hair & shoulders
 * look 100% natural like a real DSLR lens!
 */
function drawVirtualBackdrop(
  bgCtx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  settings: BackgroundEffectSettings
): void {
  const { mode, blurStrength, customImageUrl } = settings;
  const blurPx = Math.max(6, Math.round((blurStrength / 100) * 26));

  if (mode === 'blur-soft') {
    bgCtx.save();
    bgCtx.filter = `blur(${Math.max(5, Math.round(blurPx * 0.65))}px)`;
    bgCtx.drawImage(sourceCanvas, 0, 0, width, height);
    bgCtx.restore();
    return;
  }

  if (mode === 'blur-bokeh') {
    bgCtx.save();
    bgCtx.filter = `blur(${Math.max(12, blurPx)}px) brightness(95%) contrast(104%)`;
    bgCtx.drawImage(sourceCanvas, 0, 0, width, height);
    bgCtx.restore();
    return;
  }

  if (mode === 'custom-image') {
    const customImg = ensureCustomBgLoaded(customImageUrl);
    if (customImg && customImg.naturalWidth > 0) {
      const imgRatio = customImg.naturalWidth / customImg.naturalHeight;
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;
      let offsetX = 0;
      let offsetY = 0;
      if (imgRatio > canvasRatio) {
        drawW = height * imgRatio;
        offsetX = (width - drawW) * 0.5;
      } else {
        drawH = width / imgRatio;
        offsetY = (height - drawH) * 0.5;
      }
      bgCtx.save();
      if (blurStrength > 15) {
        bgCtx.filter = `blur(${Math.round(((blurStrength - 15) / 85) * 8)}px)`;
      }
      bgCtx.drawImage(customImg, offsetX, offsetY, drawW, drawH);
      bgCtx.restore();
      return;
    }
  }

  // For Studio Presets: First draw a deeply blurred optical bokeh of the real environment
  // so lighting & hair transitions look 100% natural (never like a flat pasted sticker!),
  // then infuse the studio color atmosphere over the blurred background.
  bgCtx.save();
  bgCtx.filter = `blur(${Math.max(14, blurPx)}px) brightness(92%)`;
  bgCtx.drawImage(sourceCanvas, 0, 0, width, height);
  bgCtx.restore();

  const grad = bgCtx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.08,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  if (mode === 'studio-warm') {
    grad.addColorStop(0, 'rgba(253, 246, 236, 0.72)');
    grad.addColorStop(0.6, 'rgba(238, 217, 196, 0.78)');
    grad.addColorStop(1, 'rgba(200, 169, 142, 0.85)');
  } else if (mode === 'studio-rose') {
    grad.addColorStop(0, 'rgba(255, 241, 245, 0.72)');
    grad.addColorStop(0.6, 'rgba(251, 207, 232, 0.78)');
    grad.addColorStop(1, 'rgba(244, 114, 182, 0.84)');
  } else if (mode === 'luxury-dark') {
    grad.addColorStop(0, 'rgba(63, 63, 70, 0.72)');
    grad.addColorStop(0.55, 'rgba(24, 24, 27, 0.86)');
    grad.addColorStop(1, 'rgba(9, 9, 11, 0.94)');
  } else if (mode === 'sky-pastel') {
    grad.addColorStop(0, 'rgba(254, 249, 195, 0.70)');
    grad.addColorStop(0.5, 'rgba(224, 242, 254, 0.78)');
    grad.addColorStop(1, 'rgba(125, 211, 252, 0.85)');
  } else if (mode === 'neon-cyber') {
    grad.addColorStop(0, 'rgba(112, 26, 117, 0.74)');
    grad.addColorStop(0.55, 'rgba(59, 7, 100, 0.84)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
  } else {
    grad.addColorStop(0, 'rgba(228, 228, 231, 0.7)');
    grad.addColorStop(1, 'rgba(161, 161, 170, 0.8)');
  }

  bgCtx.save();
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, width, height);
  bgCtx.restore();
}

export function applyBackgroundEffect(
  outCtx: CanvasRenderingContext2D,
  workCanvas: HTMLCanvasElement,
  regions: FaceRegions | null,
  settings: BackgroundEffectSettings,
  timestampMs: number
): void {
  if (!settings || settings.mode === 'none') return;

  const width = workCanvas.width;
  const height = workCanvas.height;

  if (!bgLayerCanvas) bgLayerCanvas = document.createElement('canvas');
  if (!fgLayerCanvas) fgLayerCanvas = document.createElement('canvas');
  if (!silMaskCanvas) silMaskCanvas = document.createElement('canvas');

  if (bgLayerCanvas.width !== width || bgLayerCanvas.height !== height) {
    bgLayerCanvas.width = width;
    bgLayerCanvas.height = height;
    fgLayerCanvas.width = width;
    fgLayerCanvas.height = height;
    silMaskCanvas.width = width;
    silMaskCanvas.height = height;
  }

  const bgCtx = bgLayerCanvas.getContext('2d');
  const fgCtx = fgLayerCanvas.getContext('2d');
  const silCtx = silMaskCanvas.getContext('2d');
  if (!bgCtx || !fgCtx || !silCtx) return;

  const aiMask = selfieSegmenter.getPersonMaskCanvas(workCanvas, timestampMs);

  silCtx.clearRect(0, 0, width, height);
  silCtx.save();

  if (aiMask) {
    // Wide 14px feather so hair strands & shoulders transition smoothly into the background
    silCtx.filter = 'blur(14px)';
    silCtx.drawImage(aiMask, 0, 0, width, height);
  } else if (regions) {
    const faceW = regions.faceScale;
    const cx = regions.faceBox.centerX;
    const cy = regions.faceBox.centerY;
    const chinY = regions.chinCenter.y;

    silCtx.filter = `blur(${Math.max(24, Math.round(faceW * 0.16))}px)`;
    silCtx.fillStyle = '#FFFFFF';

    // Hair & Head Crown ellipse
    silCtx.beginPath();
    silCtx.ellipse(
      cx,
      cy - faceW * 0.08,
      faceW * 0.82,
      regions.faceBox.height * 0.86,
      regions.rollAngle,
      0,
      Math.PI * 2
    );
    silCtx.fill();

    // Neck + Shoulders + Arms silhouette polygon
    const bodyPoly: Point2D[] = [
      { x: cx - faceW * 0.54, y: cy + faceW * 0.22 },
      { x: cx + faceW * 0.54, y: cy + faceW * 0.22 },
      { x: cx + faceW * 1.68, y: chinY + faceW * 0.3 },
      { x: cx + faceW * 1.92, y: height * 1.05 },
      { x: cx - faceW * 1.92, y: height * 1.05 },
      { x: cx - faceW * 1.68, y: chinY + faceW * 0.3 },
    ];
    createSmoothClosedPath(silCtx, bodyPoly);
    silCtx.fill();
  } else {
    silCtx.restore();
    return;
  }
  silCtx.restore();

  // Render backdrop onto bgLayerCanvas
  bgCtx.clearRect(0, 0, width, height);
  drawVirtualBackdrop(bgCtx, workCanvas, width, height, settings);

  // Extract foreground person from workCanvas using soft-feathered silMaskCanvas
  fgCtx.clearRect(0, 0, width, height);
  fgCtx.drawImage(workCanvas, 0, 0);
  fgCtx.save();
  fgCtx.globalCompositeOperation = 'destination-in';
  fgCtx.drawImage(silMaskCanvas, 0, 0, width, height);
  fgCtx.restore();

  const workCtx = workCanvas.getContext('2d');
  if (workCtx) {
    workCtx.clearRect(0, 0, width, height);
    workCtx.drawImage(bgLayerCanvas, 0, 0);
    workCtx.drawImage(fgLayerCanvas, 0, 0);
  }

  outCtx.clearRect(0, 0, width, height);
  outCtx.drawImage(bgLayerCanvas, 0, 0);
  outCtx.drawImage(fgLayerCanvas, 0, 0);
}
