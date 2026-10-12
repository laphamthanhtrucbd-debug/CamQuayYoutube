import { FaceRegions, Point2D } from '../types/face';
import { EyeMakeupEffectSettings, EyeMakeupStyleId } from '../types/effects';
import { createSmoothClosedPath, hexToRgb } from '../utils/imageUtils';

export interface EyeMakeupStyleDefinition {
  id: EyeMakeupStyleId;
  name: string;
  regionTag: 'Hàn Quốc' | 'Châu Á' | 'Âu Mỹ' | 'Châu Phi' | 'Cơ bản';
  subtitle: string;
  primaryRgb: [number, number, number];   // Màu phấn bầu mắt chính (trên mí mắt)
  outerRgb: [number, number, number];     // Màu phấn nhấn đuôi bầu mắt & hốc mắt
  shimmerRgb: [number, number, number];   // Màu nhũ kim tuyến trên bầu mí mắt
  previewGradient: string;
}

export const EYE_MAKEUP_STYLES: EyeMakeupStyleDefinition[] = [
  {
    id: 'none',
    name: 'Không đánh phấn mắt',
    regionTag: 'Cơ bản',
    subtitle: 'Giữ nguyên bầu mắt tự nhiên',
    primaryRgb: [0, 0, 0],
    outerRgb: [0, 0, 0],
    shimmerRgb: [255, 255, 255],
    previewGradient: 'linear-gradient(135deg, #27272A 0%, #18181B 100%)',
  },
  // === PHONG CÁCH HÀN QUỐC (K-BEAUTY) ===
  {
    id: 'korean-peach',
    name: 'Phấn Mắt Cam Đào Seoul',
    regionTag: 'Hàn Quốc',
    subtitle: 'Phấn bầu mắt cam san hô trong trẻo kèm nhũ mịn',
    primaryRgb: [244, 142, 118],
    outerRgb: [206, 96, 78],
    shimmerRgb: [255, 236, 218],
    previewGradient: 'linear-gradient(135deg, #FDBA74 0%, #FB7185 100%)',
  },
  {
    id: 'korean-rose-quartz',
    name: 'Phấn Mắt Hồng Thạch Anh',
    regionTag: 'Hàn Quốc',
    subtitle: 'Phấn bầu mắt hồng phấn sương mai chuẩn Idol',
    primaryRgb: [236, 138, 168],
    outerRgb: [186, 86, 118],
    shimmerRgb: [255, 235, 245],
    previewGradient: 'linear-gradient(135deg, #F9A8D4 0%, #E11D48 100%)',
  },
  {
    id: 'korean-milk-tea',
    name: 'Phấn Mắt Nâu Trà Sữa',
    regionTag: 'Hàn Quốc',
    subtitle: 'Phấn bầu mắt nâu hạnh nhân ấm tự nhiên',
    primaryRgb: [192, 138, 110],
    outerRgb: [138, 88, 66],
    shimmerRgb: [252, 236, 218],
    previewGradient: 'linear-gradient(135deg, #E7CBA9 0%, #9A6B50 100%)',
  },
  {
    id: 'korean-strawberry',
    name: 'Phấn Mắt Hồng Dâu Lạnh',
    regionTag: 'Hàn Quốc',
    subtitle: 'Phấn bầu mắt hồng tím lạnh ánh nhũ bạc',
    primaryRgb: [228, 128, 178],
    outerRgb: [164, 74, 128],
    shimmerRgb: [252, 240, 255],
    previewGradient: 'linear-gradient(135deg, #F472B6 0%, #A855F7 100%)',
  },

  // === PHONG CÁCH CHÂU Á (ĐÔNG Á & Á ĐÔNG) ===
  {
    id: 'asian-cherry-blossom',
    name: 'Phấn Mắt Hoa Anh Đào',
    regionTag: 'Châu Á',
    subtitle: 'Phấn bầu mắt hồng đào trong trẻo kiểu Tokyo',
    primaryRgb: [242, 150, 172],
    outerRgb: [198, 96, 124],
    shimmerRgb: [255, 242, 246],
    previewGradient: 'linear-gradient(135deg, #FBCFE8 0%, #F43F5E 100%)',
  },
  {
    id: 'asian-terracotta',
    name: 'Phấn Mắt Cam Đất Douyin',
    regionTag: 'Châu Á',
    subtitle: 'Phấn bầu mắt cam gạch tạo chiều sâu hốc mắt',
    primaryRgb: [206, 102, 72],
    outerRgb: [152, 58, 38],
    shimmerRgb: [255, 226, 190],
    previewGradient: 'linear-gradient(135deg, #FB923C 0%, #9A3412 100%)',
  },
  {
    id: 'asian-red-ruby',
    name: 'Phấn Mắt Đỏ Rượu Á Đông',
    regionTag: 'Châu Á',
    subtitle: 'Phấn bầu mắt đỏ hồng ngọc quyến rũ sắc sảo',
    primaryRgb: [192, 64, 84],
    outerRgb: [134, 30, 48],
    shimmerRgb: [255, 220, 212],
    previewGradient: 'linear-gradient(135deg, #F43F5E 0%, #881337 100%)',
  },
  {
    id: 'asian-apricot-gold',
    name: 'Phấn Mắt Mơ Vàng Ánh Kim',
    regionTag: 'Châu Á',
    subtitle: 'Phấn bầu mắt vàng mơ thanh lịch pha nhũ kim sa',
    primaryRgb: [226, 162, 104],
    outerRgb: [168, 106, 56],
    shimmerRgb: [255, 244, 204],
    previewGradient: 'linear-gradient(135deg, #FDE047 0%, #D97706 100%)',
  },

  // === PHONG CÁCH ÂU MỸ (WESTERN / HOLLYWOOD) ===
  {
    id: 'western-smoky-bronze',
    name: 'Phấn Mắt Nâu Khói Âu Mỹ',
    regionTag: 'Âu Mỹ',
    subtitle: 'Phấn bầu mắt Smoky Bronze nhấn hốc mắt sâu',
    primaryRgb: [154, 104, 78],
    outerRgb: [86, 50, 34],
    shimmerRgb: [244, 216, 184],
    previewGradient: 'linear-gradient(135deg, #D6A27A 0%, #451A03 100%)',
  },
  {
    id: 'western-hollywood-taupe',
    name: 'Phấn Mắt Khói Xám Tây',
    regionTag: 'Âu Mỹ',
    subtitle: 'Phấn bầu mắt xám nâu lạnh chuẩn Hollywood',
    primaryRgb: [136, 120, 118],
    outerRgb: [70, 58, 60],
    shimmerRgb: [240, 238, 244],
    previewGradient: 'linear-gradient(135deg, #A1A1AA 0%, #27272A 100%)',
  },
  {
    id: 'western-sunset-copper',
    name: 'Phấn Mắt Đồng Hoàng Hôn',
    regionTag: 'Âu Mỹ',
    subtitle: 'Phấn bầu mắt cam đồng rực rỡ ánh kim loại',
    primaryRgb: [212, 114, 64],
    outerRgb: [146, 60, 28],
    shimmerRgb: [255, 228, 178],
    previewGradient: 'linear-gradient(135deg, #F97316 0%, #7C2D12 100%)',
  },
  {
    id: 'western-champagne-glam',
    name: 'Phấn Mắt Champagne Glam',
    regionTag: 'Âu Mỹ',
    subtitle: 'Phấn bầu mắt vàng rượu vang kết hợp đuôi nâu tây',
    primaryRgb: [216, 178, 148],
    outerRgb: [132, 92, 68],
    shimmerRgb: [255, 250, 235],
    previewGradient: 'linear-gradient(135deg, #FEF08A 0%, #A16207 100%)',
  },

  // === PHONG CÁCH CHÂU PHI (AFRO-GLAM & EDITORIAL) ===
  {
    id: 'african-royal-gold',
    name: 'Phấn Mắt Vàng Hoàng Gia',
    regionTag: 'Châu Phi',
    subtitle: 'Phấn bầu mắt vàng kim 24K rực rỡ nổi bật',
    primaryRgb: [234, 176, 52],
    outerRgb: [152, 90, 20],
    shimmerRgb: [255, 242, 168],
    previewGradient: 'linear-gradient(135deg, #FACC15 0%, #854D0E 100%)',
  },
  {
    id: 'african-emerald-queen',
    name: 'Phấn Mắt Ngọc Lục Bảo',
    regionTag: 'Châu Phi',
    subtitle: 'Phấn bầu mắt xanh lục bảo pha nhũ vàng đồng',
    primaryRgb: [44, 156, 122],
    outerRgb: [20, 88, 68],
    shimmerRgb: [212, 252, 228],
    previewGradient: 'linear-gradient(135deg, #34D399 0%, #064E3B 100%)',
  },
  {
    id: 'african-amethyst-velvet',
    name: 'Phấn Mắt Tím Thạch Anh',
    regionTag: 'Châu Phi',
    subtitle: 'Phấn bầu mắt tím mận nhung quyến rũ huyền bí',
    primaryRgb: [156, 78, 176],
    outerRgb: [92, 34, 114],
    shimmerRgb: [242, 218, 255],
    previewGradient: 'linear-gradient(135deg, #C084FC 0%, #581C87 100%)',
  },
  {
    id: 'african-sahara-berry',
    name: 'Phấn Mắt Đỏ Mận Sahara',
    regionTag: 'Châu Phi',
    subtitle: 'Phấn bầu mắt đỏ berry nồng nàn pha ánh đồng',
    primaryRgb: [184, 56, 88],
    outerRgb: [110, 24, 50],
    shimmerRgb: [255, 214, 194],
    previewGradient: 'linear-gradient(135deg, #FB7185 0%, #701A75 100%)',
  },
];

let eyeshadowCanvas: HTMLCanvasElement | null = null;

/**
 * Sorts the 5 lower contour points of the eyebrow (`indices 5..9` in `LEFT_EYEBROW_INDICES` / `RIGHT_EYEBROW_INDICES`)
 * from inner corner (closer to nose) to outer corner (closer to temple).
 */
function getSortedEyebrowLowerArch(browPoly: Point2D[], interOcularCenter: Point2D): Point2D[] {
  const lower = browPoly.length >= 10 ? browPoly.slice(5, 10) : browPoly;
  if (lower.length < 2) return lower;
  const c0 = lower[0];
  const cLast = lower[lower.length - 1];
  const d0 = Math.hypot(c0.x - interOcularCenter.x, c0.y - interOcularCenter.y);
  const dLast = Math.hypot(cLast.x - interOcularCenter.x, cLast.y - interOcularCenter.y);
  return d0 <= dLast ? lower : [...lower].reverse();
}

/**
 * Sorts the 9 upper eyelid points (`indices 0..8` of `leftEye` / `rightEye`)
 * from inner corner (closer to interOcularCenter) to outer corner (closer to temple).
 */
function getSortedUpperLashArch(eyePoly: Point2D[], interOcularCenter: Point2D): Point2D[] {
  const upper = eyePoly.slice(0, 9);
  if (upper.length < 2) return upper;
  const c0 = upper[0];
  const cLast = upper[upper.length - 1];
  const d0 = Math.hypot(c0.x - interOcularCenter.x, c0.y - interOcularCenter.y);
  const dLast = Math.hypot(cLast.x - interOcularCenter.x, cLast.y - interOcularCenter.y);
  return d0 <= dLast ? upper : [...upper].reverse();
}

/**
 * Renders 100% authentic Eyeshadow (Phấn bầu mắt) strictly on the upper eyelid skin
 * between the upper lashline (`upperArch`) and the lower eyebrow (`browLowerArch`).
 *
 * NEVER touches, tints, or alters the eyeball, iris, or pupil!
 */
export function applyEyeMakeupEffect(
  ctx: CanvasRenderingContext2D,
  regions: FaceRegions,
  settings: EyeMakeupEffectSettings
): void {
  if (!settings || settings.styleId === 'none') return;

  const { styleId, customHex, intensity, shimmer } = settings;
  if (intensity <= 0 && shimmer <= 0) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  if (!eyeshadowCanvas) {
    eyeshadowCanvas = document.createElement('canvas');
  }
  if (eyeshadowCanvas.width !== width || eyeshadowCanvas.height !== height) {
    eyeshadowCanvas.width = width;
    eyeshadowCanvas.height = height;
  }

  const layerCtx = eyeshadowCanvas.getContext('2d');
  if (!layerCtx) return;
  layerCtx.clearRect(0, 0, width, height);

  let primaryRgb: [number, number, number];
  let outerRgb: [number, number, number];
  let shimmerRgb: [number, number, number];

  if (styleId === 'custom') {
    const base = hexToRgb(customHex || '#E11D48');
    primaryRgb = base;
    outerRgb = [
      Math.max(0, Math.round(base[0] * 0.65)),
      Math.max(0, Math.round(base[1] * 0.65)),
      Math.max(0, Math.round(base[2] * 0.65)),
    ];
    shimmerRgb = [
      Math.min(255, Math.round(base[0] * 0.35 + 165)),
      Math.min(255, Math.round(base[1] * 0.35 + 165)),
      Math.min(255, Math.round(base[2] * 0.35 + 165)),
    ];
  } else {
    const found = EYE_MAKEUP_STYLES.find((s) => s.id === styleId) || EYE_MAKEUP_STYLES[1];
    primaryRgb = found.primaryRgb;
    outerRgb = found.outerRgb;
    shimmerRgb = found.shimmerRgb;
  }

  const interOcularCenter: Point2D = {
    x: (regions.leftIrisCenter.x + regions.rightIrisCenter.x) * 0.5,
    y: (regions.leftIrisCenter.y + regions.rightIrisCenter.y) * 0.5,
  };

  const paintUpperEyelidShadow = (eyePoly: Point2D[], browPoly: Point2D[]) => {
    if (eyePoly.length < 9) return;

    const upperLash = getSortedUpperLashArch(eyePoly, interOcularCenter);
    const browLower = getSortedEyebrowLowerArch(browPoly, interOcularCenter);

    const innerCorner = upperLash[0];
    const outerCorner = upperLash[upperLash.length - 1];
    const dx = outerCorner.x - innerCorner.x;
    const dy = outerCorner.y - innerCorner.y;
    const eyeSpan = Math.max(12, Math.hypot(dx, dy));

    const outUnitX = dx / eyeSpan;
    const outUnitY = dy / eyeSpan;

    let upX = -outUnitY;
    let upY = outUnitX;
    if (upY > 0) {
      upX = -upX;
      upY = -upY;
    }

    // Build the anatomical Upper Eyelid Crescent Polygon:
    // Bottom boundary: slightly above the upper lashline so it starts right at the eyelashes
    // Top boundary: 58% of the way up toward the eyebrow (the natural orbital crease / bầu mắt trên)
    const bottomEdge: Point2D[] = upperLash.map((pt, idx) => {
      const t = idx / (upperLash.length - 1);
      const outShift = t > 0.75 ? (t - 0.75) * 4 * (eyeSpan * 0.14) : 0;
      return {
        x: pt.x + outUnitX * outShift + upX * 1.2,
        y: pt.y + outUnitY * outShift + upY * 1.2,
      };
    });

    const topCreaseEdge: Point2D[] = upperLash.map((pt, idx) => {
      const t = idx / (upperLash.length - 1);
      const browIdx = Math.min(browLower.length - 1, Math.floor(t * (browLower.length - 1)));
      const browPt = browLower[browIdx];
      const distToBrow = browPt
        ? Math.max(eyeSpan * 0.22, Math.min(eyeSpan * 0.52, Math.hypot(browPt.x - pt.x, browPt.y - pt.y)))
        : eyeSpan * 0.34;

      const archDome = Math.sin(Math.pow(t, 0.85) * Math.PI);
      const liftDist = distToBrow * (0.28 + 0.44 * archDome);
      const outShift = t > 0.6 ? (t - 0.6) * 2.5 * (eyeSpan * 0.20) : 0;

      return {
        x: pt.x + outUnitX * outShift + upX * liftDist,
        y: pt.y + outUnitY * outShift + upY * liftDist,
      };
    });

    const eyelidCrescentPoly: Point2D[] = [...bottomEdge, ...[...topCreaseEdge].reverse()];

    // 1. Base Eyeshadow Wash across the Upper Eyelid (Bầu mắt trên)
    if (intensity > 0) {
      const baseAlpha = (intensity / 100) * 0.46;
      const outerAlpha = (intensity / 100) * 0.38;
      const blurPx = Math.max(4, eyeSpan * 0.14);

      layerCtx.save();
      layerCtx.filter = `blur(${blurPx.toFixed(1)}px)`;

      const grad = layerCtx.createLinearGradient(
        innerCorner.x,
        innerCorner.y,
        outerCorner.x + outUnitX * (eyeSpan * 0.18),
        outerCorner.y + outUnitY * (eyeSpan * 0.18) + upY * (eyeSpan * 0.2)
      );
      grad.addColorStop(0, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${(baseAlpha * 0.45).toFixed(3)})`);
      grad.addColorStop(0.45, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${baseAlpha.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${outerRgb[0]}, ${outerRgb[1]}, ${outerRgb[2]}, ${outerAlpha.toFixed(3)})`);

      layerCtx.fillStyle = grad;
      createSmoothClosedPath(layerCtx, eyelidCrescentPoly);
      layerCtx.fill();

      const outerCreasePt = topCreaseEdge[Math.min(topCreaseEdge.length - 1, 6)];
      const outerLidCenterX = (outerCorner.x + outerCreasePt.x) * 0.5 + outUnitX * (eyeSpan * 0.06);
      const outerLidCenterY = (outerCorner.y + outerCreasePt.y) * 0.5 + outUnitY * (eyeSpan * 0.06);

      layerCtx.fillStyle = `rgba(${outerRgb[0]}, ${outerRgb[1]}, ${outerRgb[2]}, ${(outerAlpha * 0.72).toFixed(3)})`;
      layerCtx.beginPath();
      layerCtx.ellipse(
        outerLidCenterX,
        outerLidCenterY,
        eyeSpan * 0.24,
        eyeSpan * 0.14,
        regions.rollAngle,
        0,
        Math.PI * 2
      );
      layerCtx.fill();
      layerCtx.restore();
    }

    // 2. Eyelid Center Shimmer Highlight (Nhũ kim tuyến ngay giữa bầu mí mắt trên)
    if (shimmer > 0) {
      const shimAlpha = (shimmer / 100) * 0.38;
      const midLash = bottomEdge[4];
      const midCrease = topCreaseEdge[4];
      const shimX = (midLash.x + midCrease.x) * 0.5;
      const shimY = (midLash.y + midCrease.y) * 0.5;
      const blurPx = Math.max(3, eyeSpan * 0.10);

      layerCtx.save();
      layerCtx.filter = `blur(${blurPx.toFixed(1)}px)`;
      layerCtx.fillStyle = `rgba(${shimmerRgb[0]}, ${shimmerRgb[1]}, ${shimmerRgb[2]}, ${shimAlpha.toFixed(3)})`;
      layerCtx.beginPath();
      layerCtx.ellipse(
        shimX,
        shimY,
        eyeSpan * 0.22,
        eyeSpan * 0.11,
        regions.rollAngle,
        0,
        Math.PI * 2
      );
      layerCtx.fill();
      layerCtx.restore();
    }
  };

  paintUpperEyelidShadow(regions.leftEye, regions.leftEyebrow);
  paintUpperEyelidShadow(regions.rightEye, regions.rightEyebrow);

  // STRICT PROTECTION MASK:
  // Completely erase the entire eyeball opening (`leftEye` & `rightEye`) plus a 2px safety margin
  // so 0% of the eyeshadow blur ever enters the eye, sclera, or iris!
  layerCtx.save();
  layerCtx.globalCompositeOperation = 'destination-out';
  layerCtx.filter = 'blur(1px)';
  layerCtx.fillStyle = '#000000';
  layerCtx.strokeStyle = '#000000';
  layerCtx.lineWidth = Math.max(3, regions.faceScale * 0.012);
  layerCtx.lineJoin = 'round';

  createSmoothClosedPath(layerCtx, regions.leftEye);
  layerCtx.fill();
  layerCtx.stroke();

  createSmoothClosedPath(layerCtx, regions.rightEye);
  layerCtx.fill();
  layerCtx.stroke();
  layerCtx.restore();

  // Natural skin-texture blending onto the upper eyelid skin
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.58;
  ctx.drawImage(eyeshadowCanvas, 0, 0);

  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.85;
  ctx.drawImage(eyeshadowCanvas, 0, 0);
  ctx.restore();
}
