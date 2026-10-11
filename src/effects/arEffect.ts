import { FaceRegions, Point2D } from '../types/face';
import { AREffectId, AREffectSettings } from '../types/effects';

export interface AREffectOption {
  id: AREffectId;
  name: string;
  folderPath: string;
  description: string;
}

export const AR_EFFECT_OPTIONS: AREffectOption[] = [
  { id: 'none', name: 'Không dùng', folderPath: '', description: 'Tắt phụ kiện AR' },
  {
    id: 'bunny-ears',
    name: 'Tai thỏ',
    folderPath: 'hiệu ứng/tai thỏ',
    description: 'Tai ở trán (taitho.png), mũi nhỏ (muitho.png), râu mảnh thấp (rautho.png)',
  },
  {
    id: 'cat-ears',
    name: 'Tai mèo',
    folderPath: 'hiệu ứng/tai mèo',
    description: 'Tai mèo bám ở vùng trán trên kèm mũi và ria mèo mảnh',
  },
  {
    id: 'flowers',
    name: 'Hoa',
    folderPath: 'hiệu ứng/hoa',
    description: 'Vòng hoa anh đào ngang vùng trán',
  },
  {
    id: 'hearts',
    name: 'Tim',
    folderPath: 'hiệu ứng/tim',
    description: 'Trái tim hồng bay quanh trán và hai bên má',
  },
  {
    id: 'stars',
    name: 'Sao',
    folderPath: 'hiệu ứng/sao',
    description: 'Ngôi sao vàng lấp lánh ngang vùng trán',
  },
  {
    id: 'sparkle',
    name: 'Sparkle',
    folderPath: 'hiệu ứng/sparkle',
    description: 'Ánh kim lấp lánh quanh mắt và gò má',
  },
  {
    id: 'soft-light',
    name: 'Ánh sáng mềm',
    folderPath: 'hiệu ứng/ánh sáng mềm',
    description: 'Hào quang studio dịu nhẹ quanh khuôn mặt',
  },
];

interface BunnyAssets {
  taitho: HTMLImageElement | null;
  muitho: HTMLImageElement | null;
  rautho: HTMLImageElement | null;
  loaded: {
    taitho: boolean;
    muitho: boolean;
    rautho: boolean;
  };
}

const bunnyAssets: BunnyAssets = {
  taitho: null,
  muitho: null,
  rautho: null,
  loaded: {
    taitho: false,
    muitho: false,
    rautho: false,
  },
};

function ensureBunnyAssetsLoaded(): void {
  if (typeof window === 'undefined') return;

  const loadWithFallback = (
    key: 'taitho' | 'muitho' | 'rautho',
    primarySrc: string,
    fallbackSrc: string
  ) => {
    if (bunnyAssets[key]) return;
    const img = new Image();
    img.onload = () => {
      bunnyAssets.loaded[key] = true;
    };
    img.onerror = () => {
      if (!img.src.endsWith(fallbackSrc)) {
        img.src = fallbackSrc;
      }
    };
    img.src = primarySrc;
    bunnyAssets[key] = img;
  };

  loadWithFallback(
    'taitho',
    '/hiệu ứng/tai thỏ/taitho.png',
    '/hieu-ung/tai-tho/taitho.png'
  );
  loadWithFallback(
    'muitho',
    '/hiệu ứng/tai thỏ/muitho.png',
    '/hieu-ung/tai-tho/muitho.png'
  );
  loadWithFallback(
    'rautho',
    '/hiệu ứng/tai thỏ/rautho.png',
    '/hieu-ung/tai-tho/rautho.png'
  );
}

ensureBunnyAssetsLoaded();

export function updateBunnyAssetImage(
  key: 'taitho' | 'muitho' | 'rautho',
  fileUrl: string
): void {
  const img = new Image();
  img.onload = () => {
    bunnyAssets[key] = img;
    bunnyAssets.loaded[key] = true;
  };
  img.src = fileUrl;
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
  ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawFourPointSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const outerX = Math.cos(angle) * radius;
    const outerY = Math.sin(angle) * radius;
    const midAngle = angle + Math.PI / 4;
    const innerX = Math.cos(midAngle) * (radius * 0.22);
    const innerY = Math.sin(midAngle) * (radius * 0.22);
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawFivePointStar(ctx: CanvasRenderingContext2D, x: number, y: number, outerR: number, color: string): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  const innerR = outerR * 0.45;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, petalColor: string): void {
  ctx.save();
  ctx.translate(x, y);
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -radius * 0.55, radius * 0.36, radius * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = petalColor;
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = '#FDE047';
  ctx.fill();
  ctx.restore();
}

/**
 * Renders 2D/AR accessories anchored to real-time face landmarks:
 * - Ears (`taitho.png`, `cat-ears`, `flowers`, `hearts`, `stars`) are anchored directly at `regions.foreheadCenter` (Landmark #10 on the forehead).
 * - Nose (`muitho.png`) is scaled compactly (`faceW * 0.88`) and anchored right at `regions.noseTip` (Landmark #1).
 * - Whiskers (`rautho.png`) are rendered thin (`drawH * 0.65`) and shifted lower (`+faceW * 0.095`) on the lower cheeks aligned with the nose tip & upper philtrum.
 */
export function applyAREffect(
  ctx: CanvasRenderingContext2D,
  regions: FaceRegions,
  settings: AREffectSettings,
  timestampMs: number
): void {
  const { activeEffect, intensity, scale } = settings;
  if (activeEffect === 'none' || intensity <= 0) return;

  ensureBunnyAssetsLoaded();

  const alpha = Math.min(1, intensity / 100);
  const scaleMul = scale / 100;
  const faceW = regions.faceScale * scaleMul;

  // Forehead anchor (Landmark #10) as requested so ears sit right on the forehead!
  const forehead = regions.foreheadCenter;
  const roll = regions.rollAngle;
  const t = timestampMs * 0.0025;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (activeEffect === 'bunny-ears') {
    // 1. TAI THỎ (`taitho.png`): Gắn trực tiếp ở phần TRÁN (`regions.foreheadCenter` - Landmark #10)
    if (bunnyAssets.taitho && bunnyAssets.loaded.taitho) {
      const img = bunnyAssets.taitho;
      const aspect = img.naturalHeight / (img.naturalWidth || 1);
      const drawW = faceW * 1.95;
      const drawH = drawW * aspect;

      ctx.save();
      ctx.translate(forehead.x, forehead.y);
      ctx.rotate(roll);
      // Chân tai thỏ trong ảnh `taitho.png` nằm ở khoảng 48% chiều cao ảnh -> đặt khớp ngay tại trán
      ctx.drawImage(
        img,
        -drawW * 0.51,
        -drawH * 0.48,
        drawW,
        drawH
      );
      ctx.restore();
    }

    // 2. RÂU THỎ (`rautho.png`): Mỏng hơn và sít xuống thấp hơn ở phần má dưới (ngang chóp mũi / nhân trung)
    if (bunnyAssets.rautho && bunnyAssets.loaded.rautho) {
      const img = bunnyAssets.rautho;
      const aspect = img.naturalHeight / (img.naturalWidth || 1);
      const cheekMidX = (regions.leftCheekCenter.x + regions.rightCheekCenter.x) * 0.5;
      // Dịch sít xuống thấp hơn (ngang giữa chóp mũi và môi trên)
      const lowerCheekY =
        (regions.leftCheekCenter.y + regions.rightCheekCenter.y) * 0.5 +
        faceW * 0.095;

      const drawW = faceW * 1.18;
      // Nén chiều dọc 0.65 để sợi râu mảnh và sát nhau hơn nữa
      const drawH = drawW * aspect * 0.65;

      ctx.save();
      ctx.translate(cheekMidX, lowerCheekY);
      ctx.rotate(roll);
      ctx.drawImage(
        img,
        -drawW * 0.5,
        -drawH * 0.55,
        drawW,
        drawH
      );
      ctx.restore();
    }

    // 3. MŨI THỎ (`muitho.png`): Nhỏ nhắn, gọn gàng, gắn chính xác tại đầu mũi (`regions.noseTip` - Landmark #1)
    if (bunnyAssets.muitho && bunnyAssets.loaded.muitho) {
      const img = bunnyAssets.muitho;
      const aspect = img.naturalHeight / (img.naturalWidth || 1);
      const nose = regions.noseTip;
      // Giảm kích thước xuống nhỏ gọn tự nhiên (`faceW * 0.85`)
      const drawW = faceW * 0.85;
      const drawH = drawW * aspect;

      ctx.save();
      ctx.translate(nose.x, nose.y);
      ctx.rotate(roll);
      // Tâm mũi hồng trong `muitho.png` nằm tại (50% X, 55% Y)
      ctx.drawImage(
        img,
        -drawW * 0.5,
        -drawH * 0.55,
        drawW,
        drawH
      );
      ctx.restore();
    }
  } else if (activeEffect === 'cat-ears') {
    // Tai mèo gắn ở phần trán (`foreheadCenter`)
    ctx.save();
    ctx.translate(forehead.x, forehead.y);
    ctx.rotate(roll);

    const earSize = faceW * 0.31;
    const drawCatEarOnForehead = (side: -1 | 1) => {
      ctx.save();
      ctx.translate(side * faceW * 0.32, -faceW * 0.02);
      ctx.rotate(side * 0.28);

      ctx.beginPath();
      ctx.moveTo(0, -earSize);
      ctx.quadraticCurveTo(earSize * 0.54, -earSize * 0.3, earSize * 0.5, earSize * 0.12);
      ctx.quadraticCurveTo(0, earSize * 0.02, -earSize * 0.5, earSize * 0.12);
      ctx.quadraticCurveTo(-earSize * 0.54, -earSize * 0.3, 0, -earSize);
      ctx.closePath();
      ctx.fillStyle = 'rgba(36, 36, 42, 0.94)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(0, -earSize * 0.74);
      ctx.lineTo(earSize * 0.3, 0);
      ctx.lineTo(-earSize * 0.3, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(244, 143, 177, 0.9)';
      ctx.fill();
      ctx.restore();
    };

    drawCatEarOnForehead(-1);
    drawCatEarOnForehead(1);
    ctx.restore();

    // Mũi mèo nhỏ & ria mèo mảnh thấp ở má dưới
    ctx.save();
    ctx.fillStyle = 'rgba(244, 114, 182, 0.88)';
    ctx.beginPath();
    ctx.arc(regions.noseTip.x, regions.noseTip.y, faceW * 0.024, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 245, 250, 0.78)';
    ctx.lineWidth = Math.max(1.1, faceW * 0.0045);
    ctx.lineCap = 'round';

    const drawWhiskers = (cheek: Point2D, dir: -1 | 1) => {
      const baseY = cheek.y + faceW * 0.065;
      for (let i = -1; i <= 1; i++) {
        const yOff = i * faceW * 0.024;
        ctx.beginPath();
        ctx.moveTo(cheek.x - dir * faceW * 0.02, baseY + yOff);
        ctx.quadraticCurveTo(
          cheek.x + dir * faceW * 0.07,
          baseY + yOff - faceW * 0.008,
          cheek.x + dir * faceW * 0.15,
          baseY + yOff + (i + 0.5) * faceW * 0.015
        );
        ctx.stroke();
      }
    };
    drawWhiskers(regions.leftCheekCenter, -1);
    drawWhiskers(regions.rightCheekCenter, 1);
    ctx.restore();
  } else if (activeEffect === 'flowers') {
    ctx.save();
    ctx.translate(forehead.x, forehead.y);
    ctx.rotate(roll);

    const crownFlowers = [
      { x: -faceW * 0.35, y: faceW * 0.04, r: faceW * 0.072, c: '#F9A8D4' },
      { x: -faceW * 0.18, y: -faceW * 0.03, r: faceW * 0.084, c: '#FBCFE8' },
      { x: 0, y: -faceW * 0.06, r: faceW * 0.092, c: '#F472B6' },
      { x: faceW * 0.18, y: -faceW * 0.03, r: faceW * 0.084, c: '#FBCFE8' },
      { x: faceW * 0.35, y: faceW * 0.04, r: faceW * 0.072, c: '#F9A8D4' },
    ];

    for (const f of crownFlowers) {
      drawFlower(ctx, f.x, f.y, f.r, f.c);
    }
    ctx.restore();

    drawFlower(
      ctx,
      regions.rightCheekCenter.x + faceW * 0.05,
      regions.rightCheekCenter.y + faceW * 0.04,
      faceW * 0.038,
      'rgba(251, 207, 232, 0.9)'
    );
  } else if (activeEffect === 'hearts') {
    ctx.save();
    ctx.translate(forehead.x, forehead.y);
    ctx.rotate(roll);

    const heartHalo = [
      { x: -0.4, y: -0.02, s: 0.1, phase: 0, color: 'rgba(244, 63, 94, 0.88)' },
      { x: -0.22, y: -0.15, s: 0.088, phase: 1.2, color: 'rgba(249, 168, 212, 0.92)' },
      { x: 0, y: -0.2, s: 0.115, phase: 2.1, color: 'rgba(251, 113, 133, 0.92)' },
      { x: 0.22, y: -0.15, s: 0.088, phase: 3.1, color: 'rgba(244, 114, 182, 0.88)' },
      { x: 0.4, y: -0.02, s: 0.1, phase: 4.2, color: 'rgba(244, 63, 94, 0.88)' },
    ];

    for (const h of heartHalo) {
      const floatY = Math.sin(t + h.phase) * (faceW * 0.03);
      drawHeart(ctx, h.x * faceW, h.y * faceW + floatY, faceW * h.s, h.color);
    }
    ctx.restore();

    drawHeart(
      ctx,
      regions.leftCheekCenter.x,
      regions.leftCheekCenter.y + faceW * 0.03,
      faceW * 0.048,
      'rgba(244, 63, 94, 0.72)'
    );
    drawHeart(
      ctx,
      regions.rightCheekCenter.x,
      regions.rightCheekCenter.y + faceW * 0.03,
      faceW * 0.048,
      'rgba(244, 63, 94, 0.72)'
    );
  } else if (activeEffect === 'stars') {
    ctx.save();
    ctx.translate(forehead.x, forehead.y);
    ctx.rotate(roll);

    const starHalo = [
      { x: -0.4, y: 0, r: 0.062, p: 0 },
      { x: -0.21, y: -0.12, r: 0.052, p: 1.1 },
      { x: 0, y: -0.17, r: 0.075, p: 2.2 },
      { x: 0.21, y: -0.12, r: 0.052, p: 3.3 },
      { x: 0.4, y: 0, r: 0.062, p: 4.4 },
    ];

    for (const s of starHalo) {
      const pulse = 0.85 + 0.22 * Math.sin(t * 1.6 + s.p);
      drawFivePointStar(ctx, s.x * faceW, s.y * faceW, faceW * s.r * pulse, 'rgba(253, 224, 71, 0.94)');
    }
    ctx.restore();
  } else if (activeEffect === 'sparkle') {
    const points = [
      { pt: regions.leftCheekCenter, dx: -faceW * 0.06, dy: faceW * 0.02, r: 0.06, p: 0 },
      { pt: regions.leftCheekCenter, dx: faceW * 0.04, dy: faceW * 0.06, r: 0.04, p: 1.4 },
      { pt: regions.rightCheekCenter, dx: faceW * 0.06, dy: faceW * 0.02, r: 0.06, p: 0.7 },
      { pt: regions.rightCheekCenter, dx: -faceW * 0.04, dy: faceW * 0.06, r: 0.04, p: 2.1 },
      { pt: forehead, dx: -faceW * 0.26, dy: -faceW * 0.04, r: 0.068, p: 2.8 },
      { pt: forehead, dx: faceW * 0.26, dy: -faceW * 0.04, r: 0.068, p: 3.6 },
    ];

    for (const sp of points) {
      const pulse = 0.65 + 0.35 * Math.abs(Math.sin(t * 1.8 + sp.p));
      drawFourPointSparkle(
        ctx,
        sp.pt.x + sp.dx,
        sp.pt.y + sp.dy,
        faceW * sp.r * pulse,
        'rgba(255, 252, 235, 0.95)'
      );
    }
  } else if (activeEffect === 'soft-light') {
    const cx = regions.faceBox.centerX;
    const cy = regions.faceBox.centerY;
    const radius = faceW * 0.95;

    ctx.globalCompositeOperation = 'screen';
    const grad = ctx.createRadialGradient(cx, cy, faceW * 0.15, cx, cy, radius);
    grad.addColorStop(0, `rgba(255, 235, 240, ${(0.22 * alpha).toFixed(3)})`);
    grad.addColorStop(0.5, `rgba(253, 215, 228, ${(0.12 * alpha).toFixed(3)})`);
    grad.addColorStop(1, 'rgba(255, 240, 245, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
