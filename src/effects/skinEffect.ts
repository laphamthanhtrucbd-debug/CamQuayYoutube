import { FaceRegions, Point2D } from '../types/face';
import { SkinEffectSettings } from '../types/effects';
import { createSmoothClosedPath } from '../utils/imageUtils';

let localPatchCanvas: HTMLCanvasElement | null = null;
let bgSkinCanvas: HTMLCanvasElement | null = null;
let maskCanvas: HTMLCanvasElement | null = null;

// Optimized responsive downscaling for 60FPS real-time performance without main-thread lag
const DOWNSCALE = 0.25;

function getCanvases(width: number, height: number): {
  patchCanvas: HTMLCanvasElement;
  bgCanvas: HTMLCanvasElement;
  featherMaskCanvas: HTMLCanvasElement;
  sw: number;
  sh: number;
} {
  const sw = Math.max(160, Math.round(width * DOWNSCALE));
  const sh = Math.max(120, Math.round(height * DOWNSCALE));

  if (!localPatchCanvas) localPatchCanvas = document.createElement('canvas');
  if (!bgSkinCanvas) bgSkinCanvas = document.createElement('canvas');
  if (!maskCanvas) maskCanvas = document.createElement('canvas');

  if (localPatchCanvas.width !== sw || localPatchCanvas.height !== sh) {
    localPatchCanvas.width = sw;
    localPatchCanvas.height = sh;
  }
  if (bgSkinCanvas.width !== sw || bgSkinCanvas.height !== sh) {
    bgSkinCanvas.width = sw;
    bgSkinCanvas.height = sh;
  }
  if (maskCanvas.width !== sw || maskCanvas.height !== sh) {
    maskCanvas.width = sw;
    maskCanvas.height = sh;
  }
  return {
    patchCanvas: localPatchCanvas,
    bgCanvas: bgSkinCanvas,
    featherMaskCanvas: maskCanvas,
    sw,
    sh,
  };
}

function shrinkPolygonTowardsCenter(points: Point2D[], center: Point2D, ratio: number): Point2D[] {
  return points.map((p) => ({
    x: (center.x + (p.x - center.x) * ratio) * DOWNSCALE,
    y: (center.y + (p.y - center.y) * ratio) * DOWNSCALE,
  }));
}

function expandAndScalePolygon(points: Point2D[], ratio: number): Point2D[] {
  if (points.length === 0) return [];
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  cx /= points.length;
  cy /= points.length;

  return points.map((p) => ({
    x: (cx + (p.x - cx) * ratio) * DOWNSCALE,
    y: (cy + (p.y - cy) * ratio) * DOWNSCALE,
  }));
}

function buildUnderEyeTroughPolygons(regions: FaceRegions): { leftTrough: Point2D[]; rightTrough: Point2D[] } {
  const faceW = regions.faceScale;
  const dropSmall = faceW * 0.012;
  const dropMid = faceW * 0.052;
  const dropDeep = faceW * 0.068;

  const makeTrough = (eyePoly: Point2D[]): Point2D[] => {
    if (eyePoly.length < 10) return [];
    const inner = eyePoly[0];
    const outer = eyePoly[8];
    // Lower eyelid points in MediaPipe eye contour are indices 8..15 and 0
    const lowerLid = [eyePoly[0], eyePoly[15], eyePoly[14], eyePoly[13], eyePoly[12], eyePoly[11], eyePoly[10], eyePoly[9], eyePoly[8]];
    const topEdge = lowerLid.map((p) => ({
      x: p.x * DOWNSCALE,
      y: (p.y + dropSmall) * DOWNSCALE,
    }));
    const bottomEdge = [
      { x: outer.x * DOWNSCALE, y: (outer.y + dropMid) * DOWNSCALE },
      { x: ((inner.x + outer.x) * 0.5 + (outer.x - inner.x) * 0.22) * DOWNSCALE, y: (Math.max(inner.y, outer.y) + dropDeep) * DOWNSCALE },
      { x: ((inner.x + outer.x) * 0.5) * DOWNSCALE, y: (Math.max(inner.y, outer.y) + dropDeep * 1.05) * DOWNSCALE },
      { x: ((inner.x + outer.x) * 0.5 - (outer.x - inner.x) * 0.22) * DOWNSCALE, y: (Math.max(inner.y, outer.y) + dropDeep * 0.95) * DOWNSCALE },
      { x: inner.x * DOWNSCALE, y: (inner.y + dropMid * 0.9) * DOWNSCALE },
    ];
    return [...topEdge, ...bottomEdge];
  };

  return {
    leftTrough: makeTrough(regions.leftEye),
    rightTrough: makeTrough(regions.rightEye),
  };
}

/**
 * Targeted Spot-Detection & Under-Eye Dark Circle Healing Engine:
 * - ZERO white cast or bright plastic overlay on the face!
 * - Compares each skin pixel against its immediate local healthy skin neighborhood (`bgCanvas`).
 * - ONLY heals pixels that are detected as:
 *   1. Acne / Red Pimple (`acneRemove`): Localized excess redness (`R - G` spike relative to surrounding skin) or inflamed dark/red core.
 *   2. Dark Spot / Blemish / Freckle (`blemishReduce` / `freckleRemove`): Localized dark pigmentation dip (`L_bg - L > threshold`) smaller than facial features.
 *   3. Under-Eye Dark Circles (`blemishReduce` / `evenTone`): Tear-trough shadow zones encoded in the green channel of the mask, healed toward adjacent upper-cheek skin tone.
 * - Normal healthy skin pixels where no acne or dark circle is detected remain 100% untouched original camera pixels!
 */
export function applySkinEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  regions: FaceRegions,
  settings: SkinEffectSettings
): void {
  const {
    smooth,
    brighten,
    evenTone,
    acneRemove = 100,
    blemishReduce,
    freckleRemove = 100,
    antiShine,
    soften,
  } = settings;

  const hasAnySkinEffect =
    smooth > 0 ||
    brighten > 0 ||
    evenTone > 0 ||
    acneRemove > 0 ||
    blemishReduce > 0 ||
    freckleRemove > 0 ||
    antiShine > 0 ||
    soften > 0;

  if (!hasAnySkinEffect) return;

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const { patchCanvas, bgCanvas, featherMaskCanvas, sw, sh } = getCanvases(width, height);
  const patchCtx = patchCanvas.getContext('2d', { willReadFrequently: true });
  const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });
  const maskCtx = featherMaskCanvas.getContext('2d', { willReadFrequently: true });
  if (!patchCtx || !bgCtx || !maskCtx) return;

  const faceCenter = { x: regions.faceBox.centerX, y: regions.faceBox.centerY };
  const faceW = regions.faceScale;
  const insetOval = shrinkPolygonTowardsCenter(regions.faceOval, faceCenter, 0.96);

  // 1. Build Anatomical Mask:
  //    - Red channel = Valid skin area (Face + Neck + Shoulders, excluding eyes, brows, lips, nostrils)
  //    - Green channel = Under-eye dark circle (tear-trough) zone
  maskCtx.clearRect(0, 0, sw, sh);
  maskCtx.save();

  const outerFeatherPx = Math.max(6, Math.round(faceW * 0.065 * DOWNSCALE));
  maskCtx.filter = `blur(${outerFeatherPx}px)`;
  maskCtx.fillStyle = 'rgb(255, 0, 0)';

  // 1A. Face Oval
  createSmoothClosedPath(maskCtx, insetOval);
  maskCtx.fill();

  // 1B. Neck & Shoulder skin continuity (so neck/collarbone blemishes are also healed cleanly)
  const jawY = (regions.leftEarLobe.y + regions.rightEarLobe.y) * 0.5;
  const chinY = regions.chinCenter.y;
  const neckTopHalfW = faceW * 0.42;
  const shoulderY = chinY + faceW * 0.34;
  const shoulderHalfW = faceW * 1.35;

  const neckShoulderPoly: Point2D[] = [
    { x: (faceCenter.x - neckTopHalfW) * DOWNSCALE, y: jawY * DOWNSCALE },
    { x: (faceCenter.x + neckTopHalfW) * DOWNSCALE, y: jawY * DOWNSCALE },
    { x: (faceCenter.x + shoulderHalfW) * DOWNSCALE, y: shoulderY * DOWNSCALE },
    { x: (faceCenter.x - shoulderHalfW) * DOWNSCALE, y: shoulderY * DOWNSCALE },
  ];
  createSmoothClosedPath(maskCtx, neckShoulderPoly);
  maskCtx.fill();

  // 1C. Paint Under-Eye Dark Circle (Tear-Trough) zone in Green channel
  const { leftTrough, rightTrough } = buildUnderEyeTroughPolygons(regions);
  const troughBlurPx = Math.max(4, Math.round(faceW * 0.032 * DOWNSCALE));
  maskCtx.filter = `blur(${troughBlurPx}px)`;
  maskCtx.fillStyle = 'rgb(255, 255, 0)'; // Both Red (valid skin) and Green (under-eye dark circle zone)
  if (leftTrough.length >= 3) {
    createSmoothClosedPath(maskCtx, leftTrough);
    maskCtx.fill();
  }
  if (rightTrough.length >= 3) {
    createSmoothClosedPath(maskCtx, rightTrough);
    maskCtx.fill();
  }

  // 1D. Strictly cut out Eyes, Eyebrows, Lips, and Nostrils so facial features are 100% untouched
  maskCtx.globalCompositeOperation = 'destination-out';
  const featureFeatherPx = Math.max(3, Math.round(faceW * 0.024 * DOWNSCALE));
  maskCtx.filter = `blur(${featureFeatherPx}px)`;
  maskCtx.fillStyle = '#000000';

  const cutOutFeature = (pts: Point2D[], expand = 1.22) => {
    if (pts.length < 3) return;
    createSmoothClosedPath(maskCtx, expandAndScalePolygon(pts, expand));
    maskCtx.fill();
  };

  // Cut out eyes tightly (1.16) so under-eye dark circles right below lower lashes CAN be healed
  cutOutFeature(regions.leftEye, 1.16);
  cutOutFeature(regions.rightEye, 1.16);
  cutOutFeature(regions.leftEyebrow, 1.28);
  cutOutFeature(regions.rightEyebrow, 1.28);

  const fullLips = [...regions.upperLipOuter, ...regions.lowerLipOuter.slice().reverse()];
  cutOutFeature(fullLips, 1.25);

  // Protect nostrils (dark openings of the nose must never be mistaken for dark blemishes)
  const nostrilR = Math.max(4, faceW * 0.042 * DOWNSCALE);
  maskCtx.beginPath();
  maskCtx.arc(regions.leftNostril.x * DOWNSCALE, regions.leftNostril.y * DOWNSCALE, nostrilR, 0, Math.PI * 2);
  maskCtx.arc(regions.rightNostril.x * DOWNSCALE, regions.rightNostril.y * DOWNSCALE, nostrilR, 0, Math.PI * 2);
  maskCtx.fill();

  maskCtx.restore();

  // 2. Prepare sharp downscaled source on patchCanvas and local surrounding skin reference on bgCanvas
  patchCtx.clearRect(0, 0, sw, sh);
  patchCtx.drawImage(sourceCanvas, 0, 0, sw, sh);

  // bgCanvas holds a tight local neighborhood average (radius ~2.4% of face width) representing
  // the immediate skin right next to a pimple or freckle without blurring across 3D facial contours!
  const spotNeighborhoodRadius = Math.max(2.2, Math.min(6.0, faceW * 0.024 * DOWNSCALE));
  bgCtx.clearRect(0, 0, sw, sh);
  bgCtx.save();
  bgCtx.filter = `blur(${spotNeighborhoodRadius.toFixed(1)}px)`;
  bgCtx.drawImage(sourceCanvas, 0, 0, sw, sh);
  bgCtx.restore();

  // 3. Per-Pixel Spot & Dark Circle Detection (Only heals detected acne, blemishes, and dark circles)
  const srcImage = patchCtx.getImageData(0, 0, sw, sh);
  const bgImage = bgCtx.getImageData(0, 0, sw, sh);
  const maskImage = maskCtx.getImageData(0, 0, sw, sh);

  const srcData = srcImage.data;
  const bgData = bgImage.data;
  const mData = maskImage.data;

  const acneStrength = acneRemove / 100;
  const blemishStrength = blemishReduce / 100;
  const freckleStrength = freckleRemove / 100;
  const smoothStrength = (smooth * 0.55 + soften * 0.45) / 100;
  const darkCircleStrength = Math.max(blemishStrength, evenTone / 100);
  const shineStrength = antiShine / 100;
  // Subtle natural warmth/radiance ONLY if user explicitly increases brighten, never a white cast
  const subtleLift = (brighten / 100) * 2.2;

  const spotHealPower = Math.max(acneStrength, blemishStrength, freckleStrength);
  const totalPixels = sw * sh;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const maskAlpha = mData[idx + 3]; // Overall skin mask weight (0..255)
    if (maskAlpha < 12) {
      srcData[idx + 3] = 0;
      continue;
    }

    const skinWeight = maskAlpha / 255;
    const underEyeWeight = (mData[idx + 1] / 255) * skinWeight; // Green channel = tear-trough dark circle zone

    const r = srcData[idx];
    const g = srcData[idx + 1];
    const b = srcData[idx + 2];

    const br = bgData[idx];
    const bg = bgData[idx + 1];
    const bb = bgData[idx + 2];

    // Perceived luminance of current pixel vs local surrounding healthy skin
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const bgLum = 0.299 * br + 0.587 * bg + 0.114 * bb;

    // Local darkness dip (positive when pixel is darker than immediate surrounding skin)
    const darkDiff = bgLum - lum;

    // Local redness spike (positive when pixel is redder/more inflamed than immediate surrounding skin)
    const redness = r - (g * 0.65 + b * 0.35);
    const bgRedness = br - (bg * 0.65 + bb * 0.35);
    const redSpike = redness - bgRedness;

    let healFactor = 0;

    // A. Detect Isolated Acne, Pimples, Blemishes & Freckles
    // Uses strict local contrast thresholds so natural facial shadows (cheek hollows, jawline, nasolabial folds) are NEVER flattened!
    if (spotHealPower > 0 && darkDiff < 42) {
      // 1. Red/inflamed pimple detection: requires distinct local redness spike above surrounding skin
      const redAcneScore = redSpike > 3.6 ? Math.min(0.92, ((redSpike - 3.6) / 12.0) * acneStrength) : 0;

      // 2. Dark spot / acne scar / freckle / blackhead detection: requires distinct local darkness dip
      const darkSpotScore =
        darkDiff > 4.5
          ? Math.min(0.88, ((darkDiff - 4.5) / 16.0) * Math.max(acneStrength, blemishStrength, freckleStrength))
          : 0;

      // 3. Combined inflamed + shadowed pimple core
      const comboAcneScore =
        redSpike > 2.4 && darkDiff > 2.8
          ? Math.min(0.94, ((redSpike + darkDiff - 5.2) / 13.0) * acneStrength)
          : 0;

      healFactor = Math.max(redAcneScore, darkSpotScore, comboAcneScore);
    }

    // B. Detect Under-Eye Dark Circles (Quầng thâm mắt) strictly inside the tear-trough zone
    let darkCircleHeal = 0;
    if (underEyeWeight > 0.08 && darkCircleStrength > 0 && darkDiff > 1.2) {
      darkCircleHeal = Math.min(0.72, ((darkDiff - 1.2) / 18.0) * underEyeWeight * darkCircleStrength);
      healFactor = Math.max(healFactor, darkCircleHeal);
    }

    // C. Optional micro-texture smoothing (0 by default so 100% of natural skin pores and facial contours stay intact)
    let poreSmooth = 0;
    if (smoothStrength > 0 && Math.abs(darkDiff) < 4.5) {
      poreSmooth = smoothStrength * 0.14;
    }

    // Final blend weight toward clean local skin neighborhood
    const finalBlend = Math.min(0.9, Math.max(healFactor, poreSmooth)) * skinWeight;

    // D. Anti-shine (only compresses harsh specular oil highlights where lum >> bgLum)
    let shineCompress = 0;
    if (shineStrength > 0 && lum - bgLum > 15) {
      shineCompress = Math.min(0.5, ((lum - bgLum - 15) / 30) * shineStrength) * skinWeight;
    }

    const totalReplace = Math.min(0.9, finalBlend + shineCompress);

    if (totalReplace < 0.02 && subtleLift < 0.2) {
      // Pixel is normal skin or natural facial contour -> leave 100% untouched!
      srcData[idx + 3] = 0;
      continue;
    }

    // Target clean skin color from immediate neighborhood
    let targetR = br;
    let targetG = bg;
    let targetB = bb;

    // When healing a distinct pimple or dark spot, gently compensate if the spot itself darkened the local average
    if (healFactor > 0.25) {
      const compensation = Math.min(6.5, Math.max(0, darkDiff * 0.28));
      targetR = Math.min(255, targetR + compensation);
      targetG = Math.min(255, targetG + compensation * 0.96);
      targetB = Math.min(255, targetB + compensation * 0.92);

      if (redSpike > 3.5) {
        const greenRestore = Math.min(6, (redSpike - 3.5) * 0.3 * acneStrength);
        targetG = Math.min(255, targetG + greenRestore);
        targetB = Math.min(255, targetB + greenRestore * 0.45);
      }
    }

    // When healing under-eye dark circles, gently neutralize bluish/greyish shadow toward natural cheek tone
    if (darkCircleHeal > 0.12) {
      const eyeLift = Math.min(7.5, Math.max(0, darkDiff * 0.32) * darkCircleHeal);
      targetR = Math.min(255, targetR + eyeLift * 1.05);
      targetG = Math.min(255, targetG + eyeLift * 0.96);
      targetB = Math.min(255, targetB + eyeLift * 0.85);
    }

    const lift = subtleLift * skinWeight * 0.2;
    const outR = Math.min(255, r + (targetR - r) * totalReplace + lift);
    const outG = Math.min(255, g + (targetG - g) * totalReplace + lift * 0.96);
    const outB = Math.min(255, b + (targetB - b) * totalReplace + lift * 0.92);

    srcData[idx] = outR;
    srcData[idx + 1] = outG;
    srcData[idx + 2] = outB;
    srcData[idx + 3] = Math.min(255, Math.round(Math.max(totalReplace, lift > 0.2 ? 0.14 * skinWeight : 0) * 255));
  }

  patchCtx.putImageData(srcImage, 0, 0);

  // 4. Composite ONLY the healed spots/dark-circles smoothly onto the full-resolution frame
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(patchCanvas, 0, 0, sw, sh, 0, 0, width, height);
  ctx.restore();
}
