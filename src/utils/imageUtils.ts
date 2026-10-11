import { Point2D, BoundingBox } from '../types/face';

export function createPathFromPoints(ctx: CanvasRenderingContext2D, points: Point2D[], close = true): void {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  if (close) {
    ctx.closePath();
  }
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 220;
    const g = parseInt(clean[1] + clean[1], 16) || 90;
    const b = parseInt(clean[2] + clean[2], 16) || 120;
    return [r, g, b];
  }
  const num = parseInt(clean.slice(0, 6), 16);
  if (Number.isNaN(num)) return [220, 90, 120];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Draws a smooth closed curve through polygon points using quadratic midpoints
 * so masks never have sharp polygonal vertices.
 */
export function createSmoothClosedPath(ctx: CanvasRenderingContext2D, points: Point2D[]): void {
  if (points.length < 3) return;
  ctx.beginPath();
  const len = points.length;
  const firstMidX = (points[len - 1].x + points[0].x) / 2;
  const firstMidY = (points[len - 1].y + points[0].y) / 2;
  ctx.moveTo(firstMidX, firstMidY);

  for (let i = 0; i < len; i++) {
    const curr = points[i];
    const next = points[(i + 1) % len];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
  }
  ctx.closePath();
}

export function computeBoundingBox(points: Point2D[]): BoundingBox {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

let stripWarpCanvas: HTMLCanvasElement | null = null;
function getStripWarpCanvas(width: number, height: number): HTMLCanvasElement {
  if (!stripWarpCanvas) {
    stripWarpCanvas = document.createElement('canvas');
  }
  if (stripWarpCanvas.width !== width || stripWarpCanvas.height !== height) {
    stripWarpCanvas.width = width;
    stripWarpCanvas.height = height;
  }
  return stripWarpCanvas;
}

/**
 * Applies a strictly LOCALIZED horizontal band compression (for Thon mặt, Gọn hàm, Thu gọn mũi).
 * Crucially, the outer compensation buffer is confined to a narrow local margin (only 16% of halfWidth)
 * right next to the cheek/jaw contour. Pixels outside `centerX ± (halfWidth + localBuffer)` are NEVER touched,
 * so the background room/walls/space NEVER bends or warps!
 */
export function applyHorizontalBandSqueeze(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  bandHalfHeight: number,
  squeezeRatio: number
): void {
  if (bandHalfHeight <= 4 || halfWidth <= 4 || Math.abs(squeezeRatio) < 0.002) return;

  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  const snap = getStripWarpCanvas(width, height);
  const snapCtx = snap.getContext('2d');
  if (!snapCtx) return;

  const startY = Math.max(0, Math.floor(centerY - bandHalfHeight));
  const endY = Math.min(height, Math.ceil(centerY + bandHalfHeight));
  const bandH = endY - startY;
  if (bandH <= 2) return;

  // Copy ONLY the affected horizontal band into the snapshot canvas (6x faster than full-screen copy)
  snapCtx.clearRect(0, startY, width, bandH);
  snapCtx.drawImage(canvas, 0, startY, width, bandH, 0, startY, width, bandH);

  const stripStep = 4;

  for (let y = startY; y < endY; y += stripStep) {
    const h = Math.min(stripStep, endY - y);
    const normY = (y + h * 0.5 - centerY) / bandHalfHeight; // -1 to 1
    if (Math.abs(normY) >= 1) continue;

    // Cosine bell curve along Y
    const falloffY = 0.5 * (1 + Math.cos(normY * Math.PI));
    // Circular horizontal width at this Y so the warp area is an ellipse inside the face, not a rectangle!
    const ellipseChord = Math.sqrt(Math.max(0.15, 1 - normY * normY * 0.75));
    const rowHalfW = halfWidth * ellipseChord;

    const leftEdgeX = Math.max(0, centerX - rowHalfW);
    const rightEdgeX = Math.min(width, centerX + rowHalfW);
    const spanW = rightEdgeX - leftEdgeX;
    if (spanW <= 4) continue;

    const currentSqueeze = squeezeRatio * falloffY;
    const targetSpanW = spanW * (1 - currentSqueeze);
    const newLeftX = centerX - targetSpanW * 0.5;
    const newRightX = centerX + targetSpanW * 0.5;

    // Strictly local transition buffer (only ~18px-28px around the jaw edge, NOT the whole screen!)
    const localMargin = Math.max(14, rowHalfW * 0.22);
    const anchorLeftX = Math.max(0, leftEdgeX - localMargin);
    const anchorRightX = Math.min(width, rightEdgeX + localMargin);

    // 1. Left local transition [anchorLeftX .. leftEdgeX] -> [anchorLeftX .. newLeftX]
    if (leftEdgeX > anchorLeftX + 1) {
      ctx.drawImage(
        snap,
        anchorLeftX,
        y,
        leftEdgeX - anchorLeftX,
        h,
        anchorLeftX,
        y,
        newLeftX - anchorLeftX,
        h
      );
    }

    // 2. Center compressed facial contour [leftEdgeX .. rightEdgeX] -> [newLeftX .. newRightX]
    ctx.drawImage(snap, leftEdgeX, y, spanW, h, newLeftX, y, targetSpanW, h);

    // 3. Right local transition [rightEdgeX .. anchorRightX] -> [newRightX .. anchorRightX]
    if (anchorRightX > rightEdgeX + 1) {
      ctx.drawImage(
        snap,
        rightEdgeX,
        y,
        anchorRightX - rightEdgeX,
        h,
        newRightX,
        y,
        anchorRightX - newRightX,
        h
      );
    }
  }
}

/**
 * Applies a strictly localized 2D radial expansion or contraction around a point (eye enlarge, nose tip, lip plump)
 * confined strictly to `radius * 1.25` so surrounding facial features and background never warp.
 */
export function applyLocalRadialScale(
  ctx: CanvasRenderingContext2D,
  _sourceCanvas: HTMLCanvasElement,
  center: Point2D,
  radius: number,
  scaleFactor: number
): void {
  if (radius <= 4 || Math.abs(scaleFactor - 1) < 0.003) return;

  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  const snap = getStripWarpCanvas(width, height);
  const snapCtx = snap.getContext('2d');
  if (!snapCtx) return;

  const startY = Math.max(0, Math.floor(center.y - radius));
  const endY = Math.min(height, Math.ceil(center.y + radius));
  const roiH = endY - startY;
  if (roiH <= 2) return;

  snapCtx.clearRect(0, startY, width, roiH);
  snapCtx.drawImage(canvas, 0, startY, width, roiH, 0, startY, width, roiH);

  const stripStep = 3;

  for (let y = startY; y < endY; y += stripStep) {
    const h = Math.min(stripStep, endY - y);
    const dy = y + h * 0.5 - center.y;
    const normY = dy / radius;
    if (Math.abs(normY) >= 1) continue;

    const chordHalfW = Math.sqrt(Math.max(0, 1 - normY * normY)) * radius;
    if (chordHalfW <= 2) continue;

    const falloff = 0.5 * (1 + Math.cos(normY * Math.PI));
    const rowScale = 1 + (scaleFactor - 1) * falloff;

    const srcLeft = Math.max(0, center.x - chordHalfW);
    const srcRight = Math.min(width, center.x + chordHalfW);
    const srcW = srcRight - srcLeft;
    if (srcW <= 2) continue;

    const dstW = srcW * rowScale;
    const dstLeft = center.x - dstW * 0.5;
    const dstRight = center.x + dstW * 0.5;

    const outerMargin = Math.max(8, radius * 0.25);
    const anchorLeft = Math.max(0, srcLeft - outerMargin);
    if (srcLeft > anchorLeft + 1) {
      ctx.drawImage(
        snap,
        anchorLeft,
        y,
        srcLeft - anchorLeft,
        h,
        anchorLeft,
        y,
        dstLeft - anchorLeft,
        h
      );
    }

    ctx.drawImage(snap, srcLeft, y, srcW, h, dstLeft, y, dstW, h);

    const anchorRight = Math.min(width, srcRight + outerMargin);
    if (anchorRight > srcRight + 1) {
      ctx.drawImage(
        snap,
        srcRight,
        y,
        anchorRight - srcRight,
        h,
        dstRight,
        y,
        anchorRight - dstRight,
        h
      );
    }
  }
}

/**
 * Applies a localized vertical column lift or tuck (for chin shortening or eyebrow arch lift)
 * confined strictly inside `halfWidth` and `halfHeight`.
 */
export function applyVerticalColumnShift(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  shiftY: number
): void {
  if (halfWidth <= 4 || halfHeight <= 4 || Math.abs(shiftY) < 0.4) return;

  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  const snap = getStripWarpCanvas(width, height);
  const snapCtx = snap.getContext('2d');
  if (!snapCtx) return;

  const startX = Math.max(0, Math.floor(centerX - halfWidth));
  const endX = Math.min(width, Math.ceil(centerX + halfWidth));
  const topY = Math.max(0, Math.floor(centerY - halfHeight));
  const botY = Math.min(height, Math.ceil(centerY + halfHeight));
  const roiW = endX - startX;
  const roiH = botY - topY;
  if (roiW <= 2 || roiH <= 2) return;

  snapCtx.clearRect(startX, topY, roiW, roiH);
  snapCtx.drawImage(canvas, startX, topY, roiW, roiH, startX, topY, roiW, roiH);

  const colStep = 4;

  for (let x = startX; x < endX; x += colStep) {
    const w = Math.min(colStep, endX - x);
    const normX = (x + w * 0.5 - centerX) / halfWidth;
    if (Math.abs(normX) >= 1) continue;

    const falloffX = 0.5 * (1 + Math.cos(normX * Math.PI));
    const dy = shiftY * falloffX;
    const newCenterY = centerY + dy;

    if (centerY > topY + 2 && newCenterY > topY + 2) {
      ctx.drawImage(snap, x, topY, w, centerY - topY, x, topY, w, newCenterY - topY);
    }

    if (botY > centerY + 2 && botY > newCenterY + 2) {
      ctx.drawImage(snap, x, centerY, w, botY - centerY, x, newCenterY, w, botY - newCenterY);
    }
  }
}
