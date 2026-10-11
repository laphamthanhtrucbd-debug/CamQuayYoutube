import { FaceRegions, Point2D } from '../types/face';
import { LipColorId, LipColorOption, LipEffectSettings } from '../types/effects';
import { applyLocalRadialScale, hexToRgb } from '../utils/imageUtils';

export const LIP_COLOR_PALETTE: LipColorOption[] = [
  { id: 'light-pink', name: 'Hồng nhạt', hex: '#F48FB1', rgb: [244, 143, 177] },
  { id: 'peach-pink', name: 'Hồng đào', hex: '#F0788C', rgb: [240, 120, 140] },
  { id: 'dusty-rose', name: 'Hồng đất', hex: '#B85D6F', rgb: [184, 93, 111] },
  { id: 'rose-red', name: 'Đỏ hồng', hex: '#D83A56', rgb: [216, 58, 86] },
  { id: 'soft-red', name: 'Đỏ nhẹ', hex: '#C93B3B', rgb: [201, 59, 59] },
  { id: 'peach-orange', name: 'Cam đào', hex: '#EB7A53', rgb: [235, 122, 83] },
  { id: 'nude', name: 'Nude', hex: '#C68474', rgb: [198, 132, 116] },
];

export function resolveLipRgb(colorId: LipColorId, customHex: string): [number, number, number] {
  if (colorId === 'custom') {
    return hexToRgb(customHex || '#E11D48');
  }
  const found = LIP_COLOR_PALETTE.find((c) => c.id === colorId);
  return found ? found.rgb : LIP_COLOR_PALETTE[0].rgb;
}

function drawPolygonRing(
  ctx: CanvasRenderingContext2D,
  outer: Point2D[],
  inner: Point2D[]
): void {
  if (outer.length === 0 || inner.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(outer[0].x, outer[0].y);
  for (let i = 1; i < outer.length; i++) {
    ctx.lineTo(outer[i].x, outer[i].y);
  }
  for (let i = inner.length - 1; i >= 0; i--) {
    ctx.lineTo(inner[i].x, inner[i].y);
  }
  ctx.closePath();
}

/**
 * Applies natural lip color, full-lip luminosity ("Làm môi sáng"), plumping, and feathering
 * strictly to upper and lower lip polygons.
 * Replaces the old tiny center dot with a full, natural lip brightening & satin sheen across both lips!
 */
export function applyLipEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: LipEffectSettings
): void {
  const { colorId, customHex, intensity, gloss, plump, naturalBlend } = settings;

  const midUpper = regions.upperLipInner[Math.floor(regions.upperLipInner.length / 2)] || regions.noseTip;
  const midLower = regions.lowerLipOuter[Math.floor(regions.lowerLipOuter.length / 2)] || regions.chinCenter;
  const lipCenter: Point2D = {
    x: (midUpper.x + midLower.x) / 2,
    y: (midUpper.y + midLower.y) / 2,
  };

  // 1. Làm môi căng nhẹ (Subtle lip plump before painting color)
  if (plump > 0) {
    const scaleFactor = 1 + (plump / 100) * 0.075;
    const lipRadius = regions.faceScale * 0.13;
    applyLocalRadialScale(ctx, sourceCanvas, lipCenter, lipRadius, scaleFactor);
  }

  // 2. Tô màu son môi bám chính xác vào môi trên và môi dưới (hỗ trợ cả bảng màu sẵn & màu tự chọn)
  if (intensity > 0) {
    const [r, g, b] = resolveLipRgb(colorId, customHex);
    const alpha = (intensity / 100) * 0.35;
    const blurPx = 2.6 + (naturalBlend / 100) * 3.4;

    ctx.save();
    ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 1.15).toFixed(3)})`;

    drawPolygonRing(ctx, regions.upperLipOuter, regions.upperLipInner);
    ctx.fill();
    drawPolygonRing(ctx, regions.lowerLipOuter, regions.lowerLipInner);
    ctx.fill();

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.55).toFixed(3)})`;
    drawPolygonRing(ctx, regions.upperLipOuter, regions.upperLipInner);
    ctx.fill();
    drawPolygonRing(ctx, regions.lowerLipOuter, regions.lowerLipInner);
    ctx.fill();

    ctx.restore();
  }

  // 3. Làm môi sáng (Full-lip brightening + smooth satin sheen along the entire lip contour, NO tiny dot!)
  if (gloss > 0 && regions.lowerLipOuter.length >= 6 && regions.upperLipOuter.length >= 6) {
    const brightAlpha = (gloss / 100) * 0.28;
    const sheenAlpha = (gloss / 100) * 0.22;

    ctx.save();
    ctx.filter = 'blur(3.2px)';
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = `rgba(255, 235, 240, ${brightAlpha.toFixed(3)})`;

    // Brighten the entire upper and lower lip evenly so dark/dull lips become bright and fresh
    drawPolygonRing(ctx, regions.upperLipOuter, regions.upperLipInner);
    ctx.fill();
    drawPolygonRing(ctx, regions.lowerLipOuter, regions.lowerLipInner);
    ctx.fill();

    // Draw a smooth satin ribbon along the full width of the lower lip (from left corner to right corner)
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'blur(3.5px)';
    ctx.beginPath();
    const len = regions.lowerLipOuter.length;
    for (let i = 2; i <= len - 3; i++) {
      const outerPt = regions.lowerLipOuter[i];
      const innerPt = regions.lowerLipInner[i] || outerPt;
      const midX = outerPt.x * 0.45 + innerPt.x * 0.55;
      const midY = outerPt.y * 0.45 + innerPt.y * 0.55;
      if (i === 2) ctx.moveTo(midX, midY);
      else ctx.lineTo(midX, midY);
    }
    ctx.strokeStyle = `rgba(255, 248, 250, ${sheenAlpha.toFixed(3)})`;
    ctx.lineWidth = Math.max(2.5, regions.faceScale * 0.022);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
  }
}
