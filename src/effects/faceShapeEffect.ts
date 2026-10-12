import { FaceRegions, Point2D } from '../types/face';
import { FaceShapeSettings } from '../types/effects';
import {
  applyHorizontalBandSqueeze,
  applyVerticalColumnShift,
} from '../utils/imageUtils';

/**
 * Ultra-subtle, identity-preserving facial contour refinements:
 * Never distorts the user's real face shape! Even if sliders are moved,
 * adjustments are micro-calibrated (max 1.8% - 2.2%) so the face always looks 100% like the real person.
 */
export function applyFaceShapeEffect(
  ctx: CanvasRenderingContext2D,
  _sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: FaceShapeSettings
): void {
  const { slimFace, jawline, chin, cheekbone, balance } = settings;

  const faceCenterX = regions.faceBox.centerX;
  const faceW = regions.faceScale;

  // 1. Thon mặt (Giới hạn siêu nhẹ tối đa 1.2% để giữ nguyên 100% đường nét khuôn mặt gốc)
  if (slimFace > 0) {
    const cheekY = (regions.leftCheekCenter.y + regions.rightCheekCenter.y) * 0.5 + faceW * 0.08;
    const halfWidth = faceW * 0.58;
    const bandHalfHeight = faceW * 0.32;
    const squeezeRatio = (slimFace / 100) * 0.012;

    applyHorizontalBandSqueeze(ctx, faceCenterX, cheekY, halfWidth, bandHalfHeight, squeezeRatio);
  }

  // 2. Gọn hàm (Giới hạn siêu nhẹ tối đa 1.0%)
  if (jawline > 0) {
    const jawY = (regions.noseTip.y + regions.chinCenter.y) * 0.54;
    const halfWidth = faceW * 0.52;
    const bandHalfHeight = faceW * 0.25;
    const squeezeRatio = (jawline / 100) * 0.01;

    applyHorizontalBandSqueeze(ctx, faceCenterX, jawY, halfWidth, bandHalfHeight, squeezeRatio);
  }

  // 3. Thon cằm (Giới hạn siêu nhẹ tối đa 0.8%)
  if (chin > 0) {
    const chinX = regions.chinCenter.x;
    const chinY = regions.chinCenter.y;
    const tuckPx = -(chin / 100) * (faceW * 0.008);

    applyVerticalColumnShift(ctx, chinX, chinY, faceW * 0.25, faceW * 0.15, tuckPx);
  }

  // 4. Điều chỉnh má (Purely soft studio warmth, zero pixel warping on cheeks!)
  if (cheekbone > 0) {
    const alpha = (cheekbone / 100) * 0.075;
    const cheekRadius = faceW * 0.15;

    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';

    const drawCheekGlow = (pt: Point2D) => {
      const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, cheekRadius);
      grad.addColorStop(0, `rgba(248, 165, 178, ${alpha.toFixed(3)})`);
      grad.addColorStop(1, 'rgba(248, 165, 178, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, cheekRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCheekGlow(regions.leftCheekCenter);
    drawCheekGlow(regions.rightCheekCenter);
    ctx.restore();
  }

  // 5. Làm mặt cân đối hơn (Subtle 3D T-zone & chin dimensional light)
  if (balance > 0) {
    const lightAlpha = (balance / 100) * 0.06;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';

    const points = [
      { pt: regions.foreheadCenter, r: faceW * 0.16 },
      { pt: regions.chinCenter, r: faceW * 0.1 },
    ];

    for (const item of points) {
      const grad = ctx.createRadialGradient(item.pt.x, item.pt.y, 0, item.pt.x, item.pt.y, item.r);
      grad.addColorStop(0, `rgba(255, 252, 248, ${lightAlpha.toFixed(3)})`);
      grad.addColorStop(1, 'rgba(255, 252, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(item.pt.x, item.pt.y, item.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
