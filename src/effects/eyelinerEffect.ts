import { FaceRegions, Point2D } from '../types/face';
import { EyelinerColorId, EyelinerEffectSettings, EyelinerStyleId } from '../types/effects';
import { createSmoothClosedPath, hexToRgb } from '../utils/imageUtils';

export interface EyelinerStyleDefinition {
  id: EyelinerStyleId;
  name: string;
  regionTag: 'Hàn Quốc' | 'Châu Á' | 'Âu Mỹ' | 'Châu Phi' | 'Cơ bản';
  subtitle: string;
  wingAngleDeg: number;     // Góc vểnh đuôi mắt so với trục mắt (âm = hướng lên, dương = cụp nhẹ)
  wingLengthMul: number;    // Hệ số độ dài đuôi
  thicknessMul: number;     // Hệ số độ dày nét
  innerCornerPoint: boolean;// Có mở góc mắt trong (Foxy/Douyin/Cleopatra) hay không
  lowerLineRatio: number;   // Tỷ lệ viền mí dưới (0 = không, 0.35 = 1/3 đuôi mắt dưới)
  floatingCrease: boolean;  // Kẻ mí đôi graphic (Floating Crease)
  doubleWing: boolean;      // Kẻ đuôi kép song song (Double Wing)
  smokyBlur: number;        // Độ tán khói (0 = sắc nét, > 1 = tán khói)
}

export const EYELINER_STYLES: EyelinerStyleDefinition[] = [
  {
    id: 'none',
    name: 'Không kẻ mắt',
    regionTag: 'Cơ bản',
    subtitle: 'Giữ nguyên mí mắt tự nhiên',
    wingAngleDeg: 0,
    wingLengthMul: 0,
    thicknessMul: 0,
    innerCornerPoint: false,
    lowerLineRatio: 0,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0,
  },
  // === PHONG CÁCH HÀN QUỐC ===
  {
    id: 'korean-puppy',
    name: 'Mắt Cún Puppy Hàn',
    regionTag: 'Hàn Quốc',
    subtitle: 'Đuôi kẻ xuôi nhẹ xuống tạo ánh nhìn ngây thơ to tròn',
    wingAngleDeg: 12,
    wingLengthMul: 0.9,
    thicknessMul: 0.9,
    innerCornerPoint: false,
    lowerLineRatio: 0.25,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.3,
  },
  {
    id: 'korean-natural-tightline',
    name: 'Kẻ Sát Chân Mi Hàn',
    regionTag: 'Hàn Quốc',
    subtitle: 'Siêu mảnh sát gốc mi tự nhiên như không trang điểm',
    wingAngleDeg: -5,
    wingLengthMul: 0.6,
    thicknessMul: 0.72,
    innerCornerPoint: false,
    lowerLineRatio: 0,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.2,
  },
  {
    id: 'korean-idol-wing',
    name: 'Idol K-Pop Thanh Mảnh',
    regionTag: 'Hàn Quốc',
    subtitle: 'Đuôi mắt bay ngang thanh thoát chuẩn sân khấu Seoul',
    wingAngleDeg: -12,
    wingLengthMul: 1.05,
    thicknessMul: 0.9,
    innerCornerPoint: false,
    lowerLineRatio: 0.2,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.15,
  },

  // === PHONG CÁCH CHÂU Á ===
  {
    id: 'asian-phoenix',
    name: 'Mắt Phượng Á Đông',
    regionTag: 'Châu Á',
    subtitle: 'Đuôi vút cao thanh mảnh quý phái kiểu truyền thống',
    wingAngleDeg: -25,
    wingLengthMul: 1.35,
    thicknessMul: 1.0,
    innerCornerPoint: true,
    lowerLineRatio: 0.2,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },
  {
    id: 'asian-douyin-wing',
    name: 'Douyin Sắc Sảo',
    regionTag: 'Châu Á',
    subtitle: 'Mở khóe mắt trong kèm đuôi vểnh sắc nét ăn ảnh',
    wingAngleDeg: -20,
    wingLengthMul: 1.25,
    thicknessMul: 1.05,
    innerCornerPoint: true,
    lowerLineRatio: 0.35,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },
  {
    id: 'asian-manga-doll',
    name: 'Mắt Búp Bê Anime',
    regionTag: 'Châu Á',
    subtitle: 'Nhấn tròn giữa mí mắt tạo hiệu ứng mắt to long lanh',
    wingAngleDeg: -8,
    wingLengthMul: 0.85,
    thicknessMul: 1.2,
    innerCornerPoint: false,
    lowerLineRatio: 0.3,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.15,
  },
  {
    id: 'asian-kitten-flick',
    name: 'Mắt Mèo Con Kitten',
    regionTag: 'Châu Á',
    subtitle: 'Đuôi nhọn ngắn tinh tế ở góc ngoài mí mắt',
    wingAngleDeg: -16,
    wingLengthMul: 0.8,
    thicknessMul: 0.85,
    innerCornerPoint: false,
    lowerLineRatio: 0,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },

  // === PHONG CÁCH ÂU MỸ ===
  {
    id: 'western-classic-cat',
    name: 'Cat-Eye Cổ Điển Mỹ',
    regionTag: 'Âu Mỹ',
    subtitle: 'Cánh mắt mèo dày dặn, sắc lẹm chuẩn retro Âu Mỹ',
    wingAngleDeg: -23,
    wingLengthMul: 1.3,
    thicknessMul: 1.22,
    innerCornerPoint: false,
    lowerLineRatio: 0,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0,
  },
  {
    id: 'western-foxy-siren',
    name: 'Foxy Siren Quyến Rũ',
    regionTag: 'Âu Mỹ',
    subtitle: 'Kéo dài đầu mắt và đuôi mắt tạo dáng mắt cáo cuốn hút',
    wingAngleDeg: -18,
    wingLengthMul: 1.45,
    thicknessMul: 1.08,
    innerCornerPoint: true,
    lowerLineRatio: 0.3,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },
  {
    id: 'western-hollywood-glam',
    name: 'Hollywood Glam Dày',
    regionTag: 'Âu Mỹ',
    subtitle: 'Đường kẻ đậm đầy đặn tôn hàng mi cong quyến rũ',
    wingAngleDeg: -22,
    wingLengthMul: 1.35,
    thicknessMul: 1.35,
    innerCornerPoint: false,
    lowerLineRatio: 0.25,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },
  {
    id: 'western-smoky-wing',
    name: 'Smoky Wing Tán Khói',
    regionTag: 'Âu Mỹ',
    subtitle: 'Đường kẻ mắt tán mờ khói mềm mại có chiều sâu',
    wingAngleDeg: -19,
    wingLengthMul: 1.25,
    thicknessMul: 1.32,
    innerCornerPoint: false,
    lowerLineRatio: 0.45,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 1.5,
  },
  {
    id: 'western-double-wing',
    name: 'Double Wing Cá Tính',
    regionTag: 'Âu Mỹ',
    subtitle: 'Hai đường đuôi song song tách nhẹ ở khóe mắt ngoài',
    wingAngleDeg: -21,
    wingLengthMul: 1.3,
    thicknessMul: 1.0,
    innerCornerPoint: false,
    lowerLineRatio: 0.35,
    floatingCrease: false,
    doubleWing: true,
    smokyBlur: 0,
  },

  // === PHONG CÁCH CHÂU PHI & TRUNG ĐÔNG ===
  {
    id: 'african-cleopatra-royal',
    name: 'Nữ Hoàng Cleopatra',
    regionTag: 'Châu Phi',
    subtitle: 'Đuôi kẻ dài sắc sảo ôm trọn khung mắt quyền lực',
    wingAngleDeg: -15,
    wingLengthMul: 1.55,
    thicknessMul: 1.3,
    innerCornerPoint: true,
    lowerLineRatio: 0.65,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.1,
  },
  {
    id: 'african-graphic-floating',
    name: 'Graphic Floating Crease',
    regionTag: 'Châu Phi',
    subtitle: 'Đường kẻ nghệ thuật kèm nét lượn mí trên hiện đại',
    wingAngleDeg: -24,
    wingLengthMul: 1.4,
    thicknessMul: 1.08,
    innerCornerPoint: true,
    lowerLineRatio: 0,
    floatingCrease: true,
    doubleWing: false,
    smokyBlur: 0,
  },
  {
    id: 'african-bold-winged',
    name: 'Afro-Glam Bold Wing',
    regionTag: 'Châu Phi',
    subtitle: 'Cánh eyeliner bản lớn sắc nét nổi bật trên mọi tông da',
    wingAngleDeg: -22,
    wingLengthMul: 1.45,
    thicknessMul: 1.4,
    innerCornerPoint: false,
    lowerLineRatio: 0.3,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0,
  },
  {
    id: 'arabian-kohl-dramatic',
    name: 'Kohl Huyền Bí Sa Mạc',
    regionTag: 'Châu Phi',
    subtitle: 'Viền sắc nét cả mí trên và mí dưới tôn ánh nhìn sâu thẳm',
    wingAngleDeg: -17,
    wingLengthMul: 1.4,
    thicknessMul: 1.28,
    innerCornerPoint: true,
    lowerLineRatio: 0.75,
    floatingCrease: false,
    doubleWing: false,
    smokyBlur: 0.3,
  },
];

export const EYELINER_COLORS: {
  id: EyelinerColorId;
  name: string;
  hex: string;
  rgb: [number, number, number];
}[] = [
  { id: 'jet-black', name: 'Đen Tuyền', hex: '#141416', rgb: [20, 20, 22] },
  { id: 'espresso-brown', name: 'Nâu Đen Tự Nhiên', hex: '#32221A', rgb: [50, 34, 26] },
  { id: 'cocoa-brown', name: 'Nâu Cacao Mềm', hex: '#54382B', rgb: [84, 56, 43] },
  { id: 'burgundy-wine', name: 'Đỏ Rượu Vang', hex: '#5E1929', rgb: [94, 25, 41] },
  { id: 'navy-midnight', name: 'Xanh Đen Midnight', hex: '#172542', rgb: [23, 37, 66] },
];

function resolveEyelinerRgb(colorId: EyelinerColorId, customHex: string): [number, number, number] {
  if (colorId === 'custom') {
    return hexToRgb(customHex || '#141416');
  }
  const found = EYELINER_COLORS.find((c) => c.id === colorId);
  return found ? found.rgb : EYELINER_COLORS[0].rgb;
}

/**
 * Evaluates a Catmull-Rom spline through a sequence of 2D points to produce
 * an ultra-smooth, unbroken curve with `subdivisions` points per segment.
 */
function sampleSmoothArchPoints(points: Point2D[], subdivisions = 5): Point2D[] {
  if (points.length < 2) return points;
  const result: Point2D[] = [];
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    for (let s = 0; s < subdivisions; s++) {
      const t = s / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      result.push({ x, y });
    }
  }
  result.push(points[n - 1]);
  return result;
}

let eyelinerLayerCanvas: HTMLCanvasElement | null = null;

/**
 * Renders 16 global Eyeliner styles locked 100% into the LOCAL ANATOMICAL COORDINATE FRAME OF EACH EYE!
 *
 * WHY THIS STAYS GLUED UNDER ANY 3D HEAD ROTATION (YAW, PITCH, ROLL, BLINK):
 * - Instead of using a single global `noseTip.x` or global `rollAngle`, each eye computes its own
 *   true inner-to-outer corner axis (`axisX, axisY`) and its own upward eyelid normal (`upX, upY`)
 *   directly from its corner landmarks (`eyePoly[0]` and `eyePoly[8]`).
 * - Even if you turn your head 45° sideways, nod up/down, tilt, or blink, the eyeliner ribbon and wing
 *   scale and rotate in exact 1:1 lockstep with that individual eye!
 */
export function applyEyelinerEffect(
  ctx: CanvasRenderingContext2D,
  regions: FaceRegions,
  settings: EyelinerEffectSettings
): void {
  if (!settings || settings.styleId === 'none' || settings.intensity <= 0) return;

  const style = EYELINER_STYLES.find((s) => s.id === settings.styleId);
  if (!style || style.id === 'none') return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  if (!eyelinerLayerCanvas) {
    eyelinerLayerCanvas = document.createElement('canvas');
  }
  if (eyelinerLayerCanvas.width !== width || eyelinerLayerCanvas.height !== height) {
    eyelinerLayerCanvas.width = width;
    eyelinerLayerCanvas.height = height;
  }

  const layerCtx = eyelinerLayerCanvas.getContext('2d');
  if (!layerCtx) return;
  layerCtx.clearRect(0, 0, width, height);

  const [r, g, b] = resolveEyelinerRgb(settings.colorId, settings.customHex);
  const alpha = Math.min(0.95, (settings.intensity / 100) * 0.92);
  const thickScale = (settings.thickness / 55) * style.thicknessMul;
  const wingScale = (settings.wingLength / 60) * style.wingLengthMul;

  // Midpoint between the two eyes (inter-ocular center) is invariant under 3D head yaw!
  // For each eye, the corner closer to `interOcularCenter` is ALWAYS the anatomical inner tear-duct corner,
  // and the corner farther from `interOcularCenter` is ALWAYS the anatomical outer temple corner!
  const interOcularCenter: Point2D = {
    x: (regions.leftIrisCenter.x + regions.rightIrisCenter.x) * 0.5,
    y: (regions.leftIrisCenter.y + regions.rightIrisCenter.y) * 0.5,
  };

  const drawLockedEyeLiner = (eyePoly: Point2D[]) => {
    if (eyePoly.length < 12) return;

    // MediaPipe indices 0..8 are the 9 upper eyelid points from one corner (`eyePoly[0]`) to the other (`eyePoly[8]`).
    const upperArchRaw = eyePoly.slice(0, 9);
    const c0 = upperArchRaw[0];
    const c8 = upperArchRaw[upperArchRaw.length - 1];

    const dist0 = Math.hypot(c0.x - interOcularCenter.x, c0.y - interOcularCenter.y);
    const dist8 = Math.hypot(c8.x - interOcularCenter.x, c8.y - interOcularCenter.y);

    // `innerToOuter` ALWAYS runs from the inner tear-duct corner to the outer temple corner!
    const innerToOuter = dist0 <= dist8 ? upperArchRaw : [...upperArchRaw].reverse();

    // Lower eyelid points from inner corner to outer corner
    const lowerArchRaw = [eyePoly[0], ...eyePoly.slice(9).reverse(), eyePoly[8]];
    const lowerInnerToOuter = dist0 <= dist8 ? lowerArchRaw : [...lowerArchRaw].reverse();

    const innerCorner = innerToOuter[0];
    const outerCorner = innerToOuter[innerToOuter.length - 1];

    // Local eye axis vector from inner corner -> outer corner (automatically handles 3D yaw foreshortening & roll!)
    const dx = outerCorner.x - innerCorner.x;
    const dy = outerCorner.y - innerCorner.y;
    const eyeSpan = Math.max(10, Math.hypot(dx, dy));

    // Unit vector pointing outward along the eye's own axis (from inner corner toward outer temple)
    const outUnitX = dx / eyeSpan;
    const outUnitY = dy / eyeSpan;

    // Unit vector pointing upward perpendicular to THIS eye's corner-to-corner axis (toward the upper eyelid & eyebrow)
    // Determine which perpendicular points upward (smaller Y in canvas coordinates)
    let upX = -outUnitY;
    let upY = outUnitX;
    if (upY > 0) {
      upX = -upX;
      upY = -upY;
    }

    const maxStrokeW = Math.max(1.8, eyeSpan * 0.082 * thickScale);

    // Subdivide the 9 upper lid landmarks into 41 smooth points locked directly to the eyelid curve
    const denseUpper = sampleSmoothArchPoints(innerToOuter, 5);

    // Compute Wing direction in the eye's own local basis (`outUnit`, `upUnit`):
    // `wingAngleDeg` negative means lifting upward toward the eyebrow (`+upUnit`), positive means drooping (`-upUnit`).
    const liftRad = (-style.wingAngleDeg * Math.PI) / 180;
    const cosL = Math.cos(liftRad);
    const sinL = Math.sin(liftRad);

    const wingDirX = outUnitX * cosL + upX * sinL;
    const wingDirY = outUnitY * cosL + upY * sinL;
    const wingLen = eyeSpan * 0.27 * wingScale;

    const wingTip: Point2D = {
      x: outerCorner.x + wingDirX * wingLen,
      y: outerCorner.y + wingDirY * wingLen,
    };

    const bottomRibbon: Point2D[] = [];
    const topRibbon: Point2D[] = [];

    const startRatio = style.innerCornerPoint ? 0.0 : 0.05;
    const startIdx = Math.floor(denseUpper.length * startRatio);

    for (let i = startIdx; i < denseUpper.length; i++) {
      const pt = denseUpper[i];
      const u = (i - startIdx) / Math.max(1, denseUpper.length - 1 - startIdx);

      let thicknessFactor: number;
      if (style.id === 'asian-manga-doll') {
        thicknessFactor = 0.26 + 0.85 * Math.sin(u * Math.PI) + 0.55 * Math.pow(u, 1.2);
      } else {
        thicknessFactor = 0.24 + 0.54 * Math.sin(u * Math.PI * 0.85) + 0.52 * Math.pow(u, 1.15);
      }

      const w = maxStrokeW * thicknessFactor;

      // Bottom edge locks directly and tightly onto the anatomical upper lashline
      bottomRibbon.push({
        x: pt.x,
        y: pt.y,
      });

      // Top edge rises along the eye's local upward normal
      topRibbon.push({
        x: pt.x + upX * w,
        y: pt.y + upY * w,
      });
    }

    const lastTop = topRibbon[topRibbon.length - 1] || outerCorner;
    const wingMidTop: Point2D = {
      x: (lastTop.x + wingTip.x) * 0.5 + wingDirX * (wingLen * 0.08),
      y: (lastTop.y + wingTip.y) * 0.5 + upY * (maxStrokeW * 0.12),
    };
    const wingMidBottom: Point2D = {
      x: (outerCorner.x + wingTip.x) * 0.5 + wingDirX * (wingLen * 0.06),
      y: (outerCorner.y + wingTip.y) * 0.5,
    };

    layerCtx.save();
    const blurAmt = 0.35 + style.smokyBlur;
    layerCtx.filter = `blur(${blurAmt.toFixed(2)}px)`;
    const colorStr = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
    layerCtx.fillStyle = colorStr;
    layerCtx.strokeStyle = colorStr;
    layerCtx.lineCap = 'round';
    layerCtx.lineJoin = 'round';

    // 1. Unified Continuous Eyeliner Ribbon + Wing Polygon
    layerCtx.beginPath();
    layerCtx.moveTo(bottomRibbon[0].x, bottomRibbon[0].y);
    for (let i = 1; i < bottomRibbon.length; i++) {
      layerCtx.lineTo(bottomRibbon[i].x, bottomRibbon[i].y);
    }
    layerCtx.quadraticCurveTo(wingMidBottom.x, wingMidBottom.y, wingTip.x, wingTip.y);
    layerCtx.quadraticCurveTo(wingMidTop.x, wingMidTop.y, lastTop.x, lastTop.y);
    for (let i = topRibbon.length - 2; i >= 0; i--) {
      layerCtx.lineTo(topRibbon[i].x, topRibbon[i].y);
    }
    layerCtx.closePath();
    layerCtx.fill();

    // 2. Core Tightline Reinforcement right on the lashline
    layerCtx.beginPath();
    for (let i = 0; i < bottomRibbon.length; i++) {
      const p = bottomRibbon[i];
      const u = i / Math.max(1, bottomRibbon.length - 1);
      const cx = p.x + upX * (maxStrokeW * 0.28 * (0.4 + 0.6 * u));
      const cy = p.y + upY * (maxStrokeW * 0.28 * (0.4 + 0.6 * u));
      if (i === 0) layerCtx.moveTo(cx, cy);
      else layerCtx.lineTo(cx, cy);
    }
    layerCtx.lineWidth = Math.max(1.2, maxStrokeW * 0.45);
    layerCtx.stroke();

    // 3. Optional Inner Tear-Duct Point (Mở khóe mắt trong: Foxy / Douyin / Mắt Phượng / Cleopatra)
    if (style.innerCornerPoint) {
      const innerLen = eyeSpan * 0.11;
      const innerTipX = innerCorner.x - outUnitX * innerLen - upX * (eyeSpan * 0.02);
      const innerTipY = innerCorner.y - outUnitY * innerLen - upY * (eyeSpan * 0.02);

      layerCtx.beginPath();
      layerCtx.moveTo(innerCorner.x + upX * (maxStrokeW * 0.35), innerCorner.y + upY * (maxStrokeW * 0.35));
      layerCtx.lineTo(innerTipX, innerTipY);
      layerCtx.lineTo(innerCorner.x - upX * (maxStrokeW * 0.2), innerCorner.y - upY * (maxStrokeW * 0.2));
      layerCtx.closePath();
      layerCtx.fill();
    }

    // 4. Optional Lower Outer Lashline Accent
    if (style.lowerLineRatio > 0 && lowerInnerToOuter.length >= 4) {
      const denseLower = sampleSmoothArchPoints(lowerInnerToOuter, 4);
      const startLowerIdx = Math.max(0, Math.floor(denseLower.length * (1 - style.lowerLineRatio)));

      layerCtx.beginPath();
      for (let i = startLowerIdx; i < denseLower.length; i++) {
        const pt = denseLower[i];
        const px = pt.x - upX * (maxStrokeW * 0.22);
        const py = pt.y - upY * (maxStrokeW * 0.22);
        if (i === startLowerIdx) layerCtx.moveTo(px, py);
        else layerCtx.lineTo(px, py);
      }
      layerCtx.lineWidth = Math.max(1.1, maxStrokeW * 0.48);
      layerCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.68).toFixed(3)})`;
      layerCtx.stroke();
    }

    // 5. Optional Double Wing parallel flick
    if (style.doubleWing) {
      const offsetDown = maxStrokeW * 1.25;
      layerCtx.beginPath();
      layerCtx.moveTo(outerCorner.x - upX * offsetDown, outerCorner.y - upY * offsetDown);
      layerCtx.lineTo(wingTip.x - upX * (offsetDown * 0.8), wingTip.y - upY * (offsetDown * 0.8));
      layerCtx.lineWidth = Math.max(1.2, maxStrokeW * 0.5);
      layerCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.85).toFixed(3)})`;
      layerCtx.stroke();
    }

    // 6. Optional Graphic Floating Crease
    if (style.floatingCrease) {
      const creaseLift = eyeSpan * 0.23;
      const creaseStart = Math.floor(denseUpper.length * 0.22);
      layerCtx.beginPath();
      for (let i = creaseStart; i < denseUpper.length; i++) {
        const pt = denseUpper[i];
        const u = (i - creaseStart) / Math.max(1, denseUpper.length - 1 - creaseStart);
        const archLift = creaseLift * (0.75 + 0.35 * Math.sin(u * Math.PI));
        const px = pt.x + upX * archLift;
        const py = pt.y + upY * archLift;
        if (i === creaseStart) layerCtx.moveTo(px, py);
        else layerCtx.lineTo(px, py);
      }
      layerCtx.lineTo(wingTip.x, wingTip.y);
      layerCtx.lineWidth = Math.max(1.2, maxStrokeW * 0.55);
      layerCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.88).toFixed(3)})`;
      layerCtx.stroke();
    }

    layerCtx.restore();
  };

  drawLockedEyeLiner(regions.leftEye);
  drawLockedEyeLiner(regions.rightEye);

  // Trim only the interior of the eyeball opening shrunk slightly inward (by 10%)
  // so the eyeliner stays glued on the upper lashline without ever entering the eye!
  layerCtx.save();
  layerCtx.globalCompositeOperation = 'destination-out';
  layerCtx.fillStyle = '#000000';

  const shrinkEyeInward = (eyePoly: Point2D[]): Point2D[] => {
    let cx = 0;
    let cy = 0;
    for (const p of eyePoly) {
      cx += p.x;
      cy += p.y;
    }
    cx /= eyePoly.length;
    cy /= eyePoly.length;
    return eyePoly.map((p) => ({
      x: cx + (p.x - cx) * 0.90,
      y: cy + (p.y - cy) * 0.86,
    }));
  };

  createSmoothClosedPath(layerCtx, shrinkEyeInward(regions.leftEye));
  layerCtx.fill();
  createSmoothClosedPath(layerCtx, shrinkEyeInward(regions.rightEye));
  layerCtx.fill();
  layerCtx.restore();

  ctx.save();
  ctx.drawImage(eyelinerLayerCanvas, 0, 0);
  ctx.restore();
}
