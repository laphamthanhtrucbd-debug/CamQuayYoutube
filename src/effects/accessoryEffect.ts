import { FaceRegions, Point2D } from '../types/face';
import {
  AccessoryEffectSettings,
  CrownStyleId,
  EarringStyleId,
  NecklaceStyleId,
  typeBinduStyleId,
} from '../types/effects';

export const CROWN_STYLES: { id: CrownStyleId; name: string }[] = [
  { id: 'gold-royal', name: 'Hoàng gia Vàng Hồng ngọc' },
  { id: 'crystal-queen', name: 'Nữ hoàng Pha lê Băng' },
  { id: 'floral-tiara', name: 'Vương miện Ngọc trai' },
];

export const EARRING_STYLES: { id: EarringStyleId; name: string }[] = [
  { id: 'pearl-drop', name: 'Ngọc trai Giọt nước' },
  { id: 'diamond-chandelier', name: 'Kim cương Dáng dài' },
  { id: 'ruby-heart', name: 'Hồng ngọc Trái tim' },
];

export const NECKLACE_STYLES: { id: NecklaceStyleId; name: string }[] = [
  { id: 'diamond-royal', name: 'Vòng cổ Kim cương Hoàng gia' },
  { id: 'pearl-choker', name: 'Chuỗi Ngọc trai Quý phái' },
  { id: 'gold-pendant', name: 'Dây chuyền Vàng Mặt ngọc' },
];

export const CINNABAR_STYLES: { id: typeBinduStyleId; name: string }[] = [
  { id: 'lotus-huadian', name: 'Hoa điền Chu sa Cổ trang' },
  { id: 'classic-red', name: 'Chu sa Giọt lệ Đỏ thẫm' },
  { id: 'royal-gold', name: 'Ấn đường Phượng Hoàng Vàng' },
];

function drawGemstone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  mainColor: string,
  highlightColor = '#FFFFFF'
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = mainColor;
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 4;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.32, 0, Math.PI * 2);
  ctx.fillStyle = highlightColor;
  ctx.fill();
  ctx.restore();
}

function renderCrown(
  ctx: CanvasRenderingContext2D,
  crownCenter: Point2D,
  rollAngle: number,
  faceW: number,
  style: CrownStyleId
): void {
  ctx.save();
  ctx.translate(crownCenter.x, crownCenter.y);
  ctx.rotate(rollAngle);

  const w = faceW * 0.88;
  const h = faceW * 0.42;

  const isCrystal = style === 'crystal-queen';
  const isPearl = style === 'floral-tiara';

  const metalGrad = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, -h);
  if (isCrystal) {
    metalGrad.addColorStop(0, '#E2E8F0');
    metalGrad.addColorStop(0.5, '#F8FAFC');
    metalGrad.addColorStop(1, '#94A3B8');
  } else if (isPearl) {
    metalGrad.addColorStop(0, '#FDE68A');
    metalGrad.addColorStop(0.5, '#FFFBEB');
    metalGrad.addColorStop(1, '#F59E0B');
  } else {
    metalGrad.addColorStop(0, '#D97706');
    metalGrad.addColorStop(0.35, '#FDE047');
    metalGrad.addColorStop(0.65, '#F59E0B');
    metalGrad.addColorStop(1, '#B45309');
  }

  // Crown base band & royal peaks extending UPWARD (negative Y)
  ctx.beginPath();
  ctx.moveTo(-w * 0.46, h * 0.08);
  ctx.lineTo(-w * 0.5, -h * 0.48);
  ctx.quadraticCurveTo(-w * 0.36, -h * 0.15, -w * 0.25, -h * 0.72);
  ctx.quadraticCurveTo(-w * 0.12, -h * 0.22, 0, -h * 0.98);
  ctx.quadraticCurveTo(w * 0.12, -h * 0.22, w * 0.25, -h * 0.72);
  ctx.quadraticCurveTo(w * 0.36, -h * 0.15, w * 0.5, -h * 0.48);
  ctx.lineTo(w * 0.46, h * 0.08);
  ctx.quadraticCurveTo(0, -h * 0.02, -w * 0.46, h * 0.08);
  ctx.closePath();

  ctx.fillStyle = metalGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = Math.max(1.5, faceW * 0.008);
  ctx.strokeStyle = isCrystal ? '#FFFFFF' : '#FEF08A';
  ctx.stroke();

  // Jewels along the peaks and center
  const gemColor = isCrystal ? '#38BDF8' : isPearl ? '#FFF1F2' : '#E11D48';
  const subGemColor = isCrystal ? '#E0F2FE' : '#FEF9C3';

  drawGemstone(ctx, 0, -h * 0.42, faceW * 0.036, gemColor);
  drawGemstone(ctx, -w * 0.22, -h * 0.28, faceW * 0.025, gemColor);
  drawGemstone(ctx, w * 0.22, -h * 0.28, faceW * 0.025, gemColor);

  // Peak tips
  drawGemstone(ctx, 0, -h * 0.98, faceW * 0.024, subGemColor);
  drawGemstone(ctx, -w * 0.25, -h * 0.72, faceW * 0.02, subGemColor);
  drawGemstone(ctx, w * 0.25, -h * 0.72, faceW * 0.02, subGemColor);
  drawGemstone(ctx, -w * 0.5, -h * 0.48, faceW * 0.018, subGemColor);
  drawGemstone(ctx, w * 0.5, -h * 0.48, faceW * 0.018, subGemColor);

  ctx.restore();
}

function renderEarrings(
  ctx: CanvasRenderingContext2D,
  leftEar: Point2D,
  rightEar: Point2D,
  rollAngle: number,
  faceW: number,
  style: EarringStyleId
): void {
  const drawSingleEarring = (lobe: Point2D) => {
    ctx.save();
    ctx.translate(lobe.x, lobe.y);
    // Earrings hang slightly with gravity while following head tilt partially
    ctx.rotate(rollAngle * 0.45);

    const dropLen = faceW * 0.19;
    const studR = faceW * 0.018;

    // Gold/Silver chain link
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, dropLen);
    ctx.strokeStyle = style === 'diamond-chandelier' ? '#E2E8F0' : '#FBBF24';
    ctx.lineWidth = Math.max(1.4, faceW * 0.007);
    ctx.stroke();

    // Top stud at ear lobe
    drawGemstone(
      ctx,
      0,
      0,
      studR,
      style === 'ruby-heart' ? '#E11D48' : '#FFFBEB'
    );

    if (style === 'pearl-drop') {
      // Teardrop pearl at bottom
      ctx.beginPath();
      ctx.ellipse(0, dropLen, faceW * 0.028, faceW * 0.036, 0, 0, Math.PI * 2);
      const pearlGrad = ctx.createRadialGradient(
        -faceW * 0.008,
        dropLen - faceW * 0.01,
        1,
        0,
        dropLen,
        faceW * 0.036
      );
      pearlGrad.addColorStop(0, '#FFFFFF');
      pearlGrad.addColorStop(0.7, '#F5F5F4');
      pearlGrad.addColorStop(1, '#D6D3D1');
      ctx.fillStyle = pearlGrad;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 5;
      ctx.fill();
    } else if (style === 'diamond-chandelier') {
      // 3-tier sparkling diamond chandelier
      drawGemstone(ctx, 0, dropLen * 0.45, faceW * 0.018, '#E0F2FE');
      drawGemstone(ctx, -faceW * 0.025, dropLen * 0.78, faceW * 0.016, '#F0F9FF');
      drawGemstone(ctx, faceW * 0.025, dropLen * 0.78, faceW * 0.016, '#F0F9FF');
      drawGemstone(ctx, 0, dropLen * 1.05, faceW * 0.024, '#38BDF8');
    } else {
      // Ruby heart pendant
      const s = faceW * 0.055;
      ctx.save();
      ctx.translate(0, dropLen - s * 0.3);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, s * 0.3);
      ctx.bezierCurveTo(-s / 2, s * 0.7, 0, s * 0.9, 0, s * 1.15);
      ctx.bezierCurveTo(0, s * 0.9, s / 2, s * 0.7, s / 2, s * 0.3);
      ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, s * 0.3);
      ctx.closePath();
      ctx.fillStyle = '#E11D48';
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  drawSingleEarring(leftEar);
  drawSingleEarring(rightEar);
}

function renderNecklace(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  rollAngle: number,
  faceW: number,
  style: NecklaceStyleId
): void {
  ctx.save();
  ctx.translate(neckCenter.x, neckCenter.y);
  ctx.rotate(rollAngle);

  const rx = faceW * 0.36;
  const ry = faceW * 0.13;

  if (style === 'pearl-choker') {
    const numPearls = 13;
    for (let i = 0; i <= numPearls; i++) {
      const t = i / numPearls;
      const angle = Math.PI * 0.12 + t * Math.PI * 0.76;
      const px = Math.cos(angle) * rx;
      const py = Math.sin(angle) * ry;
      const pr = faceW * (0.018 + Math.sin(t * Math.PI) * 0.008);
      drawGemstone(ctx, px, py, pr, '#FAF8F5');
    }
  } else if (style === 'diamond-royal') {
    // Shimmering curved diamond band + center sapphire/diamond drop
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 0.12, Math.PI * 0.88);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = Math.max(2.2, faceW * 0.014);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.stroke();

    const numGems = 9;
    for (let i = 0; i <= numGems; i++) {
      const t = i / numGems;
      const angle = Math.PI * 0.15 + t * Math.PI * 0.7;
      const px = Math.cos(angle) * rx;
      const py = Math.sin(angle) * ry;
      drawGemstone(ctx, px, py, faceW * 0.015, '#F8FAFC');
    }

    // Center royal teardrop gem
    drawGemstone(ctx, 0, ry + faceW * 0.038, faceW * 0.03, '#E11D48');
  } else {
    // Gold chain + emerald/ruby pendant
    ctx.beginPath();
    ctx.moveTo(-rx * 0.88, 0);
    ctx.quadraticCurveTo(0, ry * 2.1, rx * 0.88, 0);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = Math.max(2, faceW * 0.011);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.stroke();

    drawGemstone(ctx, 0, ry * 1.12, faceW * 0.032, '#10B981', '#A7F3D0');
  }

  ctx.restore();
}

function renderCinnabarMark(
  ctx: CanvasRenderingContext2D,
  glabella: Point2D,
  rollAngle: number,
  faceW: number,
  style: typeBinduStyleId
): void {
  ctx.save();
  ctx.translate(glabella.x, glabella.y);
  ctx.rotate(rollAngle);

  const s = faceW * 0.055;

  if (style === 'lotus-huadian') {
    // Traditional crimson 3-petal lotus Huadian between eyebrows
    ctx.fillStyle = '#DC2626';
    ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
    ctx.shadowBlur = 4;

    // Center vertical flame petal
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.95);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.1, 0, s * 0.65);
    ctx.quadraticCurveTo(-s * 0.35, -s * 0.1, 0, -s * 0.95);
    ctx.fill();

    // Left & right side petals
    for (const dir of [-1, 1]) {
      ctx.save();
      ctx.translate(dir * s * 0.42, s * 0.05);
      ctx.rotate(dir * 0.48);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55);
      ctx.quadraticCurveTo(s * 0.22, 0, 0, s * 0.42);
      ctx.quadraticCurveTo(-s * 0.22, 0, 0, -s * 0.55);
      ctx.fill();
      ctx.restore();
    }

    // Tiny gold pearl beneath lotus
    ctx.beginPath();
    ctx.arc(0, s * 0.85, s * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = '#FDE047';
    ctx.fill();
  } else if (style === 'classic-red') {
    // Classic cinnabar teardrop mark
    ctx.fillStyle = '#B91C1C';
    ctx.shadowColor = 'rgba(185, 28, 28, 0.4)';
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.75);
    ctx.bezierCurveTo(s * 0.48, -s * 0.1, s * 0.42, s * 0.55, 0, s * 0.6);
    ctx.bezierCurveTo(-s * 0.42, s * 0.55, -s * 0.48, -s * 0.1, 0, -s * 0.75);
    ctx.fill();
  } else {
    // Royal Gold & Crimson Phoenix mark
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.95);
    ctx.lineTo(s * 0.32, 0);
    ctx.lineTo(0, s * 0.75);
    ctx.lineTo(-s * 0.32, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function applyAccessoryEffect(
  ctx: CanvasRenderingContext2D,
  regions: FaceRegions,
  settings: AccessoryEffectSettings
): void {
  const {
    crown,
    crownStyle,
    earrings,
    earringStyle,
    necklace,
    necklaceStyle,
    cinnabarMark,
    cinnabarStyle,
    opacity,
    scale,
  } = settings;

  if (!crown && !earrings && !necklace && !cinnabarMark) return;
  if (opacity <= 0) return;

  const faceW = regions.faceScale * (scale / 100);
  const roll = regions.rollAngle;

  ctx.save();
  ctx.globalAlpha = Math.min(1, opacity / 100);

  if (necklace) {
    renderNecklace(ctx, regions.neckCenter, roll, faceW, necklaceStyle);
  }

  if (earrings) {
    renderEarrings(
      ctx,
      regions.leftEarLobe,
      regions.rightEarLobe,
      roll,
      faceW,
      earringStyle
    );
  }

  if (cinnabarMark) {
    renderCinnabarMark(ctx, regions.glabellaCenter, roll, faceW, cinnabarStyle);
  }

  if (crown) {
    renderCrown(ctx, regions.foreheadCenter, roll, faceW, crownStyle);
  }

  ctx.restore();
}
