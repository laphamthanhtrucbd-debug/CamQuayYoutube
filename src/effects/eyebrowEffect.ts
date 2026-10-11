import { FaceRegions, Point2D } from '../types/face';
import { EyebrowColorId, EyebrowEffectSettings } from '../types/effects';
import { applyVerticalColumnShift, hexToRgb } from '../utils/imageUtils';

export const EYEBROW_COLORS: { id: EyebrowColorId; name: string; hex: string; rgb: [number, number, number] }[] = [
  { id: 'natural-black', name: 'Đen tự nhiên', hex: '#231F20', rgb: [35, 31, 32] },
  { id: 'dark-brown', name: 'Nâu đen', hex: '#3E2C23', rgb: [62, 44, 35] },
  { id: 'ash-brown', name: 'Nâu khói', hex: '#584B42', rgb: [88, 75, 66] },
  { id: 'soft-taupe', name: 'Nâu tây nhẹ', hex: '#755C48', rgb: [117, 92, 72] },
];

export function resolveEyebrowRgb(colorId: EyebrowColorId, customHex: string): [number, number, number] {
  if (colorId === 'custom') {
    return hexToRgb(customHex || '#4A3728');
  }
  const found = EYEBROW_COLORS.find((c) => c.id === colorId);
  return found ? found.rgb : EYEBROW_COLORS[1].rgb;
}

function getEyebrowSpine(browLoop: Point2D[]): Point2D[] {
  if (browLoop.length < 10) return browLoop;
  const head = {
    x: (browLoop[0].x + browLoop[9].x) / 2,
    y: (browLoop[0].y + browLoop[9].y) / 2,
  };
  const mid = {
    x: (browLoop[1].x + browLoop[8].x) / 2,
    y: (browLoop[1].y + browLoop[8].y) / 2,
  };
  const arch = {
    x: (browLoop[2].x + browLoop[7].x) / 2,
    y: (browLoop[2].y + browLoop[7].y) / 2,
  };
  const upperOuter = {
    x: (browLoop[3].x + browLoop[4].x) / 2,
    y: (browLoop[3].y + browLoop[4].y) / 2,
  };
  const lowerOuter = {
    x: (browLoop[6].x + browLoop[5].x) / 2,
    y: (browLoop[6].y + browLoop[5].y) / 2,
  };
  const tail = {
    x: (upperOuter.x + lowerOuter.x) / 2,
    y: (upperOuter.y + lowerOuter.y) / 2,
  };

  return [head, mid, arch, tail];
}

export function applyEyebrowEffect(
  ctx: CanvasRenderingContext2D,
  _sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: EyebrowEffectSettings
): void {
  const { intensity, definition, colorId, customHex, archLift } = settings;
  if (intensity <= 0 && definition <= 0 && archLift <= 0) return;

  const leftSpine = getEyebrowSpine(regions.leftEyebrow);
  const rightSpine = getEyebrowSpine(regions.rightEyebrow);
  const faceW = regions.faceScale;

  if (archLift > 0 && leftSpine.length >= 4 && rightSpine.length >= 4) {
    const liftPx = -(archLift / 100) * (faceW * 0.022);
    const leftArch = leftSpine[2];
    const rightArch = rightSpine[2];

    applyVerticalColumnShift(ctx, leftArch.x, leftArch.y, faceW * 0.11, faceW * 0.07, liftPx);
    applyVerticalColumnShift(ctx, rightArch.x, rightArch.y, faceW * 0.11, faceW * 0.07, liftPx);
  }

  if (intensity <= 0 && definition <= 0) return;

  const [r, g, b] = resolveEyebrowRgb(colorId, customHex);

  const maxAlpha = Math.min(0.24, (intensity / 100) * 0.17 + (definition / 100) * 0.07);
  const strokeWidth = Math.max(2.2, faceW * 0.022);
  const blurPx = Math.max(3.5, faceW * 0.022 - (definition / 100) * 1.2);

  const drawSoftBrowPowder = (spine: Point2D[]) => {
    if (spine.length < 4) return;
    const [head, mid, arch, tail] = spine;

    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.filter = `blur(${blurPx.toFixed(1)}px)`;

    const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(maxAlpha * 0.1).toFixed(3)})`);
    grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${(maxAlpha * 0.8).toFixed(3)})`);
    grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${maxAlpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${(maxAlpha * 0.15).toFixed(3)})`);

    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo(mid.x, mid.y, arch.x, arch.y);
    ctx.lineTo(tail.x, tail.y);

    ctx.strokeStyle = grad;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.globalCompositeOperation = 'multiply';
    const mulGrad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    mulGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    mulGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${(maxAlpha * 0.48).toFixed(3)})`);
    mulGrad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${(maxAlpha * 0.55).toFixed(3)})`);
    mulGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.strokeStyle = mulGrad;
    ctx.lineWidth = strokeWidth * 0.7;
    ctx.stroke();

    ctx.restore();
  };

  drawSoftBrowPowder(leftSpine);
  drawSoftBrowPowder(rightSpine);
}
