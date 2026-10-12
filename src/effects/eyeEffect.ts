import { FaceRegions, Point2D } from '../types/face';
import { EyeEffectSettings } from '../types/effects';
import { applyLocalRadialScale, createPathFromPoints } from '../utils/imageUtils';

/**
 * Applies eye beauty adjustments:
 * - Làm mắt to nhẹ (subtle radial enlargement around each iris)
 * - Làm sáng vùng dưới mắt (concealer brightening under eyes)
 * - Làm mắt sáng hơn (sclera/iris brightness lift)
 * - Làm mắt long lanh (natural catchlights on iris)
 * - Điều chỉnh hiệu ứng mắt / Độ trong (iris contrast & clarity ring)
 */
export function applyEyeEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: EyeEffectSettings
): void {
  const { brighten, sparkle, enlarge, underEyeBright, clarity } = settings;

  // 1. Làm mắt to nhẹ (Subtle eye enlargement capped at +12% max so it stays natural)
  if (enlarge > 0) {
    const scaleFactor = 1 + (enlarge / 100) * 0.12;
    const eyeRadius = regions.faceScale * 0.135;
    applyLocalRadialScale(ctx, sourceCanvas, regions.leftIrisCenter, eyeRadius, scaleFactor);
    applyLocalRadialScale(ctx, sourceCanvas, regions.rightIrisCenter, eyeRadius, scaleFactor);
  }

  // 2. Làm sáng vùng dưới mắt (Tự nhiên theo rãnh lệ dưới mắt, không tạo vệt trắng bệch)
  if (underEyeBright > 0) {
    const alpha = (underEyeBright / 100) * 0.085;
    const rx = regions.faceScale * 0.078;
    const ry = regions.faceScale * 0.028;
    const offsetY = regions.faceScale * 0.044;

    const drawUnderEyeGlow = (iris: Point2D) => {
      const cx = iris.x;
      const cy = iris.y + offsetY;
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      ctx.filter = 'blur(8px)';
      ctx.fillStyle = `rgba(255, 224, 205, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, regions.rollAngle, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawUnderEyeGlow(regions.leftIrisCenter);
    drawUnderEyeGlow(regions.rightIrisCenter);
  }

  // 3. Làm mắt sáng hơn (Feathered eye brightening inside eye contour)
  if (brighten > 0) {
    const alpha = (brighten / 100) * 0.18;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.filter = 'blur(3px)';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;

    createPathFromPoints(ctx, regions.leftEye, true);
    ctx.fill();

    createPathFromPoints(ctx, regions.rightEye, true);
    ctx.fill();
    ctx.restore();
  }

  // 4. Điều chỉnh hiệu ứng mắt / Độ rõ nét (Limbal ring & iris clarity)
  if (clarity > 0) {
    const irisRadius = regions.faceScale * 0.036;
    const ringAlpha = (clarity / 100) * 0.28;

    const drawIrisDefinition = (center: Point2D, eyePoly: Point2D[]) => {
      ctx.save();
      createPathFromPoints(ctx, eyePoly, true);
      ctx.clip();

      ctx.beginPath();
      ctx.arc(center.x, center.y, irisRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(28, 22, 20, ${ringAlpha})`;
      ctx.lineWidth = Math.max(1.2, regions.faceScale * 0.006);
      ctx.stroke();
      ctx.restore();
    };

    drawIrisDefinition(regions.leftIrisCenter, regions.leftEye);
    drawIrisDefinition(regions.rightIrisCenter, regions.rightEye);
  }

  // 5. Làm mắt long lanh (Natural studio catchlights following iris center)
  if (sparkle > 0) {
    const catchlightAlpha = (sparkle / 100) * 0.72;
    const irisRadius = regions.faceScale * 0.034;

    const drawCatchlight = (center: Point2D, eyePoly: Point2D[]) => {
      ctx.save();
      createPathFromPoints(ctx, eyePoly, true);
      ctx.clip();

      // Primary upper-left studio catchlight
      const mainX = center.x - irisRadius * 0.32;
      const mainY = center.y - irisRadius * 0.32;
      const mainR = Math.max(1.4, irisRadius * 0.24);

      const grad = ctx.createRadialGradient(mainX, mainY, 0, mainX, mainY, mainR * 1.4);
      grad.addColorStop(0, `rgba(255, 255, 255, ${catchlightAlpha})`);
      grad.addColorStop(0.6, `rgba(255, 250, 245, ${catchlightAlpha * 0.6})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mainX, mainY, mainR * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Secondary tiny lower-right reflection dot
      const subX = center.x + irisRadius * 0.28;
      const subY = center.y + irisRadius * 0.26;
      const subR = Math.max(0.9, irisRadius * 0.13);

      ctx.fillStyle = `rgba(255, 255, 255, ${catchlightAlpha * 0.65})`;
      ctx.beginPath();
      ctx.arc(subX, subY, subR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawCatchlight(regions.leftIrisCenter, regions.leftEye);
    drawCatchlight(regions.rightIrisCenter, regions.rightEye);
  }
}
