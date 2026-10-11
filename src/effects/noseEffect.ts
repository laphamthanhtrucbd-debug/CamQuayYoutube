import { FaceRegions } from '../types/face';
import { NoseEffectSettings } from '../types/effects';
import { applyHorizontalBandSqueeze, applyLocalRadialScale } from '../utils/imageUtils';

/**
 * Applies crisp, natural nose refinements without ghosting:
 * - Thu gọn mũi (opaque horizontal band squeeze across the nose wings)
 * - Điều chỉnh đầu mũi (subtle nose tip refinement)
 * - Làm mũi cân đối hơn (soft nose bridge highlight)
 */
export function applyNoseEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: NoseEffectSettings
): void {
  const { slim, tipRefine, balance } = settings;
  const faceW = regions.faceScale;

  // 1. Thu gọn cánh mũi rất nhẹ bằng nén dải ngang sắc nét (không bóng ma)
  if (slim > 0) {
    const noseCenterX = regions.noseTip.x;
    const noseWingY = (regions.leftNostril.y + regions.rightNostril.y) * 0.5;
    const squeezeRatio = (slim / 100) * 0.09;
    applyHorizontalBandSqueeze(
      ctx,
      noseCenterX,
      noseWingY,
      faceW * 0.16,
      faceW * 0.1,
      squeezeRatio
    );
  }

  // 2. Điều chỉnh đầu mũi thon gọn nhẹ
  if (tipRefine > 0) {
    const scaleFactor = 1 - (tipRefine / 100) * 0.06;
    const tipRadius = faceW * 0.08;
    applyLocalRadialScale(ctx, sourceCanvas, regions.noseTip, tipRadius, scaleFactor);
  }

  // 3. Làm mũi cân đối hơn (Highlight sống mũi tự nhiên)
  if (balance > 0 && regions.noseBridge.length >= 2) {
    const highlightAlpha = (balance / 100) * 0.15;
    const topBridge = regions.noseBridge[0];
    const bottomBridge = regions.noseBridge[regions.noseBridge.length - 1];

    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.filter = 'blur(4px)';

    ctx.beginPath();
    ctx.moveTo(topBridge.x, topBridge.y);
    for (let i = 1; i < regions.noseBridge.length; i++) {
      ctx.lineTo(regions.noseBridge[i].x, regions.noseBridge[i].y);
    }
    ctx.strokeStyle = `rgba(255, 250, 245, ${highlightAlpha.toFixed(3)})`;
    ctx.lineWidth = Math.max(2, faceW * 0.02);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bottomBridge.x, bottomBridge.y, faceW * 0.016, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 252, 248, ${(highlightAlpha * 0.85).toFixed(3)})`;
    ctx.fill();

    ctx.restore();
  }
}
