import { FaceRegions, Point2D } from '../types/face';
import { FaceShapeSettings } from '../types/effects';
import {
  applyHorizontalBandSqueeze,
  applyVerticalColumnShift,
} from '../utils/imageUtils';

/**
 * Applies crisp, ghost-free facial contour adjustments anchored to real landmarks:
 * - Thon mặt (continuous horizontal band compression across mid-lower cheeks)
 * - Gọn hàm (continuous horizontal V-line tapering across lower jaw)
 * - Thon cằm (subtle upward chin tuck + narrow taper)
 * - Điều chỉnh má (cheekbone lift & subtle rosy contour)
 * - Làm mặt cân đối hơn (soft 3D studio contour & center highlight)
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

  // 1. Thon mặt (Crisp horizontal strip compression across mid-lower cheeks — zero ghosting!)
  if (slimFace > 0) {
    const cheekY = (regions.leftCheekCenter.y + regions.rightCheekCenter.y) * 0.5 + faceW * 0.08;
    const halfWidth = faceW * 0.62;
    const bandHalfHeight = faceW * 0.36;
    const squeezeRatio = (slimFace / 100) * 0.085; // Max 8.5% natural slimming

    applyHorizontalBandSqueeze(ctx, faceCenterX, cheekY, halfWidth, bandHalfHeight, squeezeRatio);
  }

  // 2. Gọn hàm (Crisp V-line tapering across the lower jawline)
  if (jawline > 0) {
    const jawY = (regions.noseTip.y + regions.chinCenter.y) * 0.54;
    const halfWidth = faceW * 0.56;
    const bandHalfHeight = faceW * 0.28;
    const squeezeRatio = (jawline / 100) * 0.08;

    applyHorizontalBandSqueeze(ctx, faceCenterX, jawY, halfWidth, bandHalfHeight, squeezeRatio);
  }

  // 3. Thon cằm (Subtle chin tuck upward + gentle horizontal narrowing at chin tip)
  if (chin > 0) {
    const chinX = regions.chinCenter.x;
    const chinY = regions.chinCenter.y;
    const tuckPx = -(chin / 100) * (faceW * 0.032);

    applyVerticalColumnShift(ctx, chinX, chinY, faceW * 0.28, faceW * 0.18, tuckPx);
    applyHorizontalBandSqueeze(
      ctx,
      chinX,
      chinY - faceW * 0.03,
      faceW * 0.35,
      faceW * 0.16,
      (chin / 100) * 0.065
    );
  }

  // 4. Điều chỉnh má (Soft lifted apple-cheek warmth & subtle upward lift)
  if (cheekbone > 0) {
    const liftPx = -(cheekbone / 100) * (faceW * 0.02);
    applyVerticalColumnShift(
      ctx,
      regions.leftCheekCenter.x,
      regions.leftCheekCenter.y,
      faceW * 0.18,
      faceW * 0.16,
      liftPx
    );
    applyVerticalColumnShift(
      ctx,
      regions.rightCheekCenter.x,
      regions.rightCheekCenter.y,
      faceW * 0.18,
      faceW * 0.16,
      liftPx
    );

    const alpha = (cheekbone / 100) * 0.11;
    const cheekRadius = faceW * 0.16;

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
    const lightAlpha = (balance / 100) * 0.1;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';

    const points = [
      { pt: regions.foreheadCenter, r: faceW * 0.18 },
      { pt: regions.chinCenter, r: faceW * 0.11 },
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
