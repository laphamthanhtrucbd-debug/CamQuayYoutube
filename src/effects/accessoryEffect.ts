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

export const EARRING_STYLES: { id: EarringStyleId; name: string; desc: string }[] = [
  { id: 'ruby-heart', name: 'Hồng ngọc Trái tim Quý phái', desc: 'Trái tim Ruby giác cắt giác & Viền kim cương Pavé' },
  { id: 'pearl-drop', name: 'Ngọc trai Giọt nước Hoàng gia', desc: 'Hạt ngọc Akoya óng ả chấu vàng 18K quý phái' },
  { id: 'diamond-chandelier', name: 'Kim cương Đèn chùm Dạ tiệc', desc: 'Dáng dài lộng lẫy nhiều tầng lấp lánh ánh kim' },
  { id: 'gold-hoop', name: 'Khoen tròn Vàng Ý Sang trọng', desc: 'Khoen tròn đúc vàng ôm sát vành dái tai' },
  { id: 'emerald-tear', name: 'Ngọc lục bảo Giọt sương Tinh tế', desc: 'Mặt giọt lệ Emerald xanh ngọc chấu vàng cổ điển' },
  { id: 'crystal-star', name: 'Ngôi sao Pha lê Lấp lánh', desc: 'Sao bắc cực giác cắt 8 cánh tỏa sáng rực rỡ' },
];

export const NECKLACE_STYLES: {
  id: NecklaceStyleId;
  name: string;
  outfit: string;
  desc: string;
}[] = [
  {
    id: 'ao-dai-kieng',
    name: 'Kiềng Vàng Hoàng Kim Chạm Trổ',
    outfit: 'Áo Dài Truyền Thống / Lễ Phục',
    desc: 'Bản kiềng vàng 24K truyền thống uốn quanh cổ áo dài, chạm khắc tinh xảo',
  },
  {
    id: 'diamond-royal',
    name: 'Vòng Cổ Kim Cương & Sapphire',
    outfit: 'Áo Trễ Vai / Đầm Dạ Hội',
    desc: 'Chuỗi kim cương rủ nhiều tầng tôn trọn bờ vai trần và xương quai xanh',
  },
  {
    id: 'gold-pendant',
    name: 'Dây Chuyền Chữ Y Mặt Giọt Lệ',
    outfit: 'Áo Cổ Chữ V / Sơ Mi Mở Cúc',
    desc: 'Dây xích vàng mảnh uốn hình chữ Y rủ sâu quyến rũ theo khe áo chữ V',
  },
  {
    id: 'pearl-choker',
    name: 'Chuỗi Ngọc Trai Quý Tộc Ôm Cổ',
    outfit: 'Áo Cổ Tròn / Kín Đáo',
    desc: 'Chuỗi ngọc trai Akoya kép ôm sát chân cổ áo, thanh lịch quý phái',
  },
  {
    id: 'ruby-heart-collier',
    name: 'Vòng Cổ Trái Tim Ruby Hoàng Gia',
    outfit: 'Áo Cổ Vuông / Cúp Ngực',
    desc: 'Mặt trái tim Ruby huyết bồ câu giác cắt đa diện nổi bật trước ngực',
  },
  {
    id: 'velvet-choker',
    name: 'Choker Nhung Đen Mặt Ngọc Bích',
    outfit: 'Áo Cổ Tròn / Quyến Rũ Huyền Bí',
    desc: 'Dải nhung đen mịn màng ôm sát cổ đính viên ngọc bích Jadeite quý tộc',
  },
  {
    id: 'minimal-chain',
    name: 'Dây Xích Bạc Mặt Trăng Sao',
    outfit: 'Trang Phục Thường Ngày / Năng Động',
    desc: 'Dây bạc mảnh mai đính mặt trăng lưỡi liềm và tinh tú lấp lánh',
  },
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

/**
 * Trái tim Hồng ngọc chuẩn trang sức cao cấp (Bézier hoàn mỹ, giác cắt đa diện, viền kim cương Pavé)
 */
function drawLuxuryRubyHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const r = size * 0.44;
  const topY = -size * 0.16;
  const tipY = size * 0.52;

  // Perfect symmetric heart geometry using Bézier curves
  const traceHeart = (radius: number, bottomTipY: number, topCleftY: number) => {
    ctx.beginPath();
    ctx.moveTo(0, topCleftY);
    ctx.bezierCurveTo(-radius * 0.5, topCleftY - radius * 0.88, -radius * 1.35, topCleftY + radius * 0.22, 0, bottomTipY);
    ctx.bezierCurveTo(radius * 1.35, topCleftY + radius * 0.22, radius * 0.5, topCleftY - radius * 0.88, 0, topCleftY);
    ctx.closePath();
  };

  // 1. Viền vàng kim 18K bao bọc (Gold bezel setting)
  traceHeart(r * 1.15, tipY + 2.5, topY - 2.5);
  ctx.fillStyle = '#D97706';
  ctx.shadowColor = 'rgba(225, 29, 72, 0.45)';
  ctx.shadowBlur = 6;
  ctx.fill();

  // 2. Thân ngọc Ruby đỏ mọng kiêu sa
  traceHeart(r, tipY, topY);
  const rubyGrad = ctx.createRadialGradient(-r * 0.25, topY + r * 0.1, r * 0.08, 0, topY + r * 0.4, r * 1.15);
  rubyGrad.addColorStop(0, '#FF4D6D');
  rubyGrad.addColorStop(0.32, '#E11D48');
  rubyGrad.addColorStop(0.72, '#9F1239');
  rubyGrad.addColorStop(1, '#4C0519');
  ctx.fillStyle = rubyGrad;
  ctx.shadowBlur = 0;
  ctx.fill();

  // 3. Đường rãnh phản quang trung tâm
  ctx.beginPath();
  ctx.moveTo(0, topY);
  ctx.lineTo(0, tipY * 0.85);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.lineWidth = Math.max(1, size * 0.022);
  ctx.stroke();

  // 4. Ánh sáng lấp lánh phản quang trên cánh tim trái
  ctx.beginPath();
  ctx.ellipse(-r * 0.42, topY - r * 0.22, r * 0.26, r * 0.12, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();

  // 5. Đốm sáng kim cương nhỏ
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-r * 0.38, topY - r * 0.2, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function renderEarrings(
  ctx: CanvasRenderingContext2D,
  leftEar: Point2D,
  rightEar: Point2D,
  rollAngle: number,
  faceW: number,
  style: EarringStyleId,
  earringScaleMultiplier: number = 1.0,
  offsetYUnits: number = 0,
  offsetXUnits: number = 0
): void {
  const drawSingleEarring = (lobe: Point2D, isLeft: boolean) => {
    ctx.save();

    // Hướng chếch ra ngoài: tai trái đi sang trái (-), tai phải sang phải (+)
    const outwardDir = isLeft ? -1 : 1;
    const cosR = Math.cos(rollAngle);
    const sinR = Math.sin(rollAngle);

    // Tinh chỉnh người dùng
    const userOffX = (offsetXUnits / 100) * (faceW * 0.12) * outwardDir;
    const userOffY = (offsetYUnits / 100) * (faceW * 0.12);

    const posX = lobe.x + userOffX * cosR - userOffY * sinR;
    const posY = lobe.y + userOffX * sinR + userOffY * cosR;

    ctx.translate(posX, posY);
    // Bông tai rủ xuống theo trọng lực tự nhiên, chỉ nghiêng 35% theo chuyển động đầu
    ctx.rotate(rollAngle * 0.35);

    const scaleFactor = Math.max(0.5, earringScaleMultiplier);
    const dropLen = faceW * 0.24 * scaleFactor;
    const studR = Math.max(3.8, faceW * 0.026 * scaleFactor);

    // 1. Chốt khuyên tai (Ear piercing stud) ôm khít dái tai
    ctx.beginPath();
    ctx.arc(0, 0, studR, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24'; // Chấu vàng 18K
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.fill();

    // Hạt kim cương nhỏ ở tâm chốt khuyên
    ctx.beginPath();
    ctx.arc(0, 0, studR * 0.68, 0, Math.PI * 2);
    ctx.fillStyle = style === 'ruby-heart' ? '#FFFFFF' : '#F8FAFC';
    ctx.fill();

    // 2. Từng mẫu bông tai cao cấp
    if (style === 'ruby-heart') {
      // Dây nối mảnh vàng nối từ dái tai xuống mặt tim
      ctx.beginPath();
      ctx.moveTo(0, studR);
      ctx.lineTo(0, dropLen * 0.35);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = Math.max(1.5, faceW * 0.009 * scaleFactor);
      ctx.stroke();

      // Mặt trái tim Ruby quý phái tinh xảo
      const heartSize = faceW * 0.105 * scaleFactor;
      drawLuxuryRubyHeart(ctx, 0, dropLen * 0.35 + heartSize * 0.45, heartSize);
    } else if (style === 'pearl-drop') {
      // Dây chuyền rủ nối đến ngọc trai
      ctx.beginPath();
      ctx.moveTo(0, studR);
      ctx.lineTo(0, dropLen * 0.5);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = Math.max(1.8, faceW * 0.009 * scaleFactor);
      ctx.stroke();

      // Khóa chấu mạ vàng đính đá nhỏ phía trên ngọc trai
      drawGemstone(ctx, 0, dropLen * 0.48, faceW * 0.016 * scaleFactor, '#F59E0B');

      // Hạt ngọc trai to tròn quý phái
      const pearlRy = faceW * 0.062 * scaleFactor;
      const pearlRx = faceW * 0.048 * scaleFactor;
      ctx.beginPath();
      ctx.ellipse(0, dropLen * 0.9, pearlRx, pearlRy, 0, 0, Math.PI * 2);

      const pearlGrad = ctx.createRadialGradient(
        -pearlRx * 0.35,
        dropLen * 0.9 - pearlRy * 0.35,
        pearlRx * 0.1,
        0,
        dropLen * 0.9,
        pearlRy
      );
      pearlGrad.addColorStop(0, '#FFFFFF');
      pearlGrad.addColorStop(0.3, '#FFFBEB');
      pearlGrad.addColorStop(0.75, '#F1F5F9');
      pearlGrad.addColorStop(1, '#94A3B8');

      ctx.fillStyle = pearlGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Ánh sáng bóng trên ngọc trai
      ctx.beginPath();
      ctx.ellipse(
        -pearlRx * 0.3,
        dropLen * 0.9 - pearlRy * 0.35,
        pearlRx * 0.25,
        pearlRy * 0.16,
        -Math.PI * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 0;
      ctx.fill();
    } else if (style === 'diamond-chandelier') {
      // Dây chuyền kim cương dạ tiệc nhiều tầng
      drawGemstone(ctx, 0, dropLen * 0.28, faceW * 0.024 * scaleFactor, '#E0F2FE');
      drawGemstone(ctx, -faceW * 0.028 * scaleFactor, dropLen * 0.52, faceW * 0.022 * scaleFactor, '#F0F9FF');
      drawGemstone(ctx, faceW * 0.028 * scaleFactor, dropLen * 0.52, faceW * 0.022 * scaleFactor, '#F0F9FF');
      drawGemstone(ctx, 0, dropLen * 0.78, faceW * 0.026 * scaleFactor, '#BAE6FD');
      drawGemstone(ctx, 0, dropLen * 1.08, faceW * 0.035 * scaleFactor, '#38BDF8');
    } else if (style === 'gold-hoop') {
      // Khoen tròn Vàng Ý ôm sát dái tai
      const hoopR = faceW * 0.055 * scaleFactor;
      ctx.beginPath();
      ctx.arc(0, hoopR * 0.85, hoopR, -Math.PI * 0.35, Math.PI * 1.35);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = Math.max(3.0, faceW * 0.016 * scaleFactor);
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 5;
      ctx.stroke();

      // Điểm sáng kim loại
      ctx.beginPath();
      ctx.arc(0, hoopR * 0.85, hoopR, Math.PI * 0.5, Math.PI * 0.8);
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = Math.max(1.5, faceW * 0.008 * scaleFactor);
      ctx.stroke();
    } else if (style === 'emerald-tear') {
      // Dây vàng nối
      ctx.beginPath();
      ctx.moveTo(0, studR);
      ctx.lineTo(0, dropLen * 0.45);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = Math.max(1.8, faceW * 0.009 * scaleFactor);
      ctx.stroke();

      // Viên đá Emerald xanh lục bảo giọt nước
      const emW = faceW * 0.048 * scaleFactor;
      const emH = faceW * 0.075 * scaleFactor;
      ctx.save();
      ctx.translate(0, dropLen * 0.8);
      ctx.beginPath();
      ctx.moveTo(0, -emH * 0.5);
      ctx.quadraticCurveTo(emW * 0.55, 0, emW * 0.45, emH * 0.35);
      ctx.quadraticCurveTo(0, emH * 0.58, -emW * 0.45, emH * 0.35);
      ctx.quadraticCurveTo(-emW * 0.55, 0, 0, -emH * 0.5);
      ctx.closePath();

      const emGrad = ctx.createRadialGradient(-emW * 0.15, -emH * 0.1, emW * 0.05, 0, 0, emW * 0.6);
      emGrad.addColorStop(0, '#6EE7B7');
      emGrad.addColorStop(0.4, '#059669');
      emGrad.addColorStop(1, '#064E3B');
      ctx.fillStyle = emGrad;
      ctx.shadowColor = 'rgba(5, 150, 105, 0.45)';
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.lineWidth = Math.max(1.5, faceW * 0.008 * scaleFactor);
      ctx.strokeStyle = '#FDE047';
      ctx.stroke();
      ctx.restore();
    } else {
      // Ngôi sao Pha lê Lấp lánh (crystal-star)
      const starR = faceW * 0.065 * scaleFactor;
      ctx.save();
      ctx.translate(0, dropLen * 0.6);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? starR : starR * 0.38;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Tâm đá xanh
      drawGemstone(ctx, 0, 0, starR * 0.28, '#38BDF8');
      ctx.restore();
    }

    ctx.restore();
  };

  drawSingleEarring(leftEar, true);
  drawSingleEarring(rightEar, false);
}

function renderNecklace(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  rollAngle: number,
  faceW: number,
  style: NecklaceStyleId,
  lengthMultiplier: number = 1.0,
  widthMultiplier: number = 1.0,
  offsetYUnits: number = 0
): void {
  ctx.save();

  // Bám sát chuyển động: vị trí gốc là hõm cổ / xương quai xanh
  const userOffY = (offsetYUnits / 100) * (faceW * 0.15);
  ctx.translate(neckCenter.x, neckCenter.y + userOffY);

  // Vòng cổ bám theo vai/thân (chỉ xoay 35% theo chuyển động đầu, giữ vẻ rơi tự nhiên của trang sức)
  ctx.rotate(rollAngle * 0.35);

  const rx = faceW * 0.38 * Math.max(0.6, widthMultiplier);
  const ry = faceW * 0.15 * Math.max(0.5, lengthMultiplier);

  if (style === 'ao-dai-kieng') {
    // 👘 Kiềng Vàng Hoàng Kim chạm trổ (Áo Dài Truyền Thống / Lễ Phục)
    const kiengR = rx * 0.88;
    const kiengThickness = Math.max(4.5, faceW * 0.028);

    ctx.beginPath();
    ctx.ellipse(0, 0, kiengR, ry * 0.95, 0, Math.PI * 0.08, Math.PI * 0.92);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = kiengThickness;
    ctx.shadowColor = 'rgba(217, 119, 6, 0.5)';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Viền kim loại bóng ánh vàng 24K
    ctx.beginPath();
    ctx.ellipse(0, 0, kiengR, ry * 0.95, 0, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = kiengThickness * 0.4;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Họa tiết hoa văn chạm trổ / mặt hoa sen vàng cổ điển ở trung tâm kiềng
    drawGemstone(ctx, 0, ry * 0.95, faceW * 0.038, '#F59E0B', '#FEF08A');
    drawGemstone(ctx, -kiengR * 0.28, ry * 0.88, faceW * 0.022, '#D97706', '#FEF08A');
    drawGemstone(ctx, kiengR * 0.28, ry * 0.88, faceW * 0.022, '#D97706', '#FEF08A');
  } else if (style === 'pearl-choker') {
    // 👕 Chuỗi Ngọc Trai Quý Tộc Ôm Cổ (Áo Cổ Tròn / Kín Đáo)
    const numPearls = 15;
    for (let i = 0; i <= numPearls; i++) {
      const t = i / numPearls;
      const angle = Math.PI * 0.12 + t * Math.PI * 0.76;
      const px = Math.cos(angle) * rx * 0.85;
      const py = Math.sin(angle) * ry * 0.88;
      const pr = faceW * (0.019 + Math.sin(t * Math.PI) * 0.009);
      drawGemstone(ctx, px, py, pr, '#FAF8F5');
    }
    // Khóa cài hoa đá nhỏ ở trung tâm
    drawGemstone(ctx, 0, ry * 0.88, faceW * 0.025, '#F59E0B', '#FFFFFF');
  } else if (style === 'diamond-royal') {
    // 👗 Vòng Cổ Kim Cương & Sapphire Hoàng Gia (Áo Trễ Vai / Đầm Dạ Hội)
    // Tầng dây kim cương thứ 1 (ôm quai xanh)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.92, ry * 0.85, 0, Math.PI * 0.10, Math.PI * 0.90);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = Math.max(2.2, faceW * 0.012);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Tầng dây kim cương thứ 2 (rủ rộng xuống ngực áo)
    ctx.beginPath();
    ctx.ellipse(0, ry * 0.15, rx * 1.05, ry * 1.15, 0, Math.PI * 0.12, Math.PI * 0.88);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = Math.max(2.0, faceW * 0.010);
    ctx.stroke();

    const numGems = 11;
    for (let i = 0; i <= numGems; i++) {
      const t = i / numGems;
      const angle = Math.PI * 0.15 + t * Math.PI * 0.70;
      const px = Math.cos(angle) * rx * 0.92;
      const py = Math.sin(angle) * ry * 0.85;
      drawGemstone(ctx, px, py, faceW * 0.016, '#F8FAFC');
    }

    // Tâm điểm: Viên đá Sapphire Hoàng gia xanh biển thẫm giọt lệ rủ xuống
    const dropY = ry * 1.25;
    ctx.beginPath();
    ctx.moveTo(0, ry * 0.85);
    ctx.lineTo(0, dropY);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    drawGemstone(ctx, 0, dropY, faceW * 0.042, '#1E40AF', '#93C5FD');
    drawGemstone(ctx, 0, dropY - faceW * 0.038, faceW * 0.020, '#F8FAFC');
  } else if (style === 'gold-pendant') {
    // 👚 Dây Chuyền Chữ Y Mặt Giọt Lệ (Áo Cổ Chữ V / Sơ Mi Mở Cúc)
    const vSpanX = rx * 0.85;
    const vJointY = ry * 0.85;

    // Dây hình chữ V ôm theo mép áo
    ctx.beginPath();
    ctx.moveTo(-vSpanX, 0);
    ctx.quadraticCurveTo(-vSpanX * 0.45, vJointY * 0.7, 0, vJointY);
    ctx.quadraticCurveTo(vSpanX * 0.45, vJointY * 0.7, vSpanX, 0);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = Math.max(2.0, faceW * 0.011);
    ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
    ctx.shadowBlur = 5;
    ctx.stroke();

    // Nhánh rủ chữ Y dài xuống khe áo
    const stemEnd = vJointY + ry * 0.95;
    ctx.beginPath();
    ctx.moveTo(0, vJointY);
    ctx.lineTo(0, stemEnd);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = Math.max(1.8, faceW * 0.010);
    ctx.stroke();

    // Hạt khóa vàng ở ngã 3 chữ Y
    drawGemstone(ctx, 0, vJointY, faceW * 0.022, '#F59E0B');

    // Mặt đá Emerald xanh lục bảo hoặc kim cương rủ ở đuôi chữ Y
    drawGemstone(ctx, 0, stemEnd, faceW * 0.036, '#10B981', '#A7F3D0');
  } else if (style === 'ruby-heart-collier') {
    // 🖤 Vòng Cổ Trái Tim Ruby Hoàng Gia (Áo Cổ Vuông / Cúp Ngực)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.95, ry * 0.95, 0, Math.PI * 0.12, Math.PI * 0.88);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = Math.max(2.2, faceW * 0.012);
    ctx.stroke();

    const numDiamonds = 13;
    for (let i = 0; i <= numDiamonds; i++) {
      const t = i / numDiamonds;
      const angle = Math.PI * 0.14 + t * Math.PI * 0.72;
      const px = Math.cos(angle) * rx * 0.95;
      const py = Math.sin(angle) * ry * 0.95;
      drawGemstone(ctx, px, py, faceW * 0.014, '#F8FAFC');
    }

    // Mặt trái tim Ruby quý phái đính ở trung tâm ngực áo
    const heartCenterY = ry * 0.95 + faceW * 0.045;
    drawLuxuryRubyHeart(ctx, 0, heartCenterY, faceW * 0.12);
  } else if (style === 'velvet-choker') {
    // 🎀 Choker Nhung Đen Mặt Ngọc Bích (Áo Cổ Tròn / Quyến Rũ Huyền Bí)
    const chokerThickness = Math.max(5.5, faceW * 0.032);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.78, ry * 0.78, 0, Math.PI * 0.10, Math.PI * 0.90);
    ctx.strokeStyle = '#18181B'; // Dải nhung đen tuyền
    ctx.lineWidth = chokerThickness;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Khóa viền vàng và viên ngọc bích đính chính giữa
    drawGemstone(ctx, 0, ry * 0.78, faceW * 0.035, '#059669', '#A7F3D0');
  } else {
    // ✨ Dây Xích Bạc Mặt Trăng Sao (Trang Phục Thường Ngày / Năng Động)
    ctx.beginPath();
    ctx.moveTo(-rx * 0.85, 0);
    ctx.quadraticCurveTo(0, ry * 1.8, rx * 0.85, 0);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = Math.max(1.8, faceW * 0.009);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.stroke();

    // Mặt trăng lưỡi liềm bạc ở giữa
    ctx.save();
    ctx.translate(0, ry * 0.92);
    const moonR = faceW * 0.032;
    ctx.beginPath();
    ctx.arc(0, 0, moonR, 0, Math.PI * 2);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonR * 0.45, -moonR * 0.25, moonR * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = '#18181B';
    ctx.fill();

    // Ngôi sao nhỏ đính bên cạnh
    drawGemstone(ctx, moonR * 0.85, moonR * 0.2, faceW * 0.015, '#F8FAFC');
    ctx.restore();
  }

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
    const lengthMultiplier = (settings.necklaceLength ?? 100) / 100;
    const widthMultiplier = (settings.necklaceWidth ?? 100) / 100;
    const offsetYUnits = settings.necklaceOffsetY ?? 0;
    renderNecklace(
      ctx,
      regions.neckCenter,
      roll,
      faceW,
      necklaceStyle,
      lengthMultiplier,
      widthMultiplier,
      offsetYUnits
    );
  }

  if (earrings) {
    const earringScaleMultiplier = (settings.earringScale ?? 100) / 100;
    const offsetYUnits = settings.earringOffsetY ?? 0;
    const offsetXUnits = settings.earringOffsetX ?? 0;
    renderEarrings(
      ctx,
      regions.leftEarLobe,
      regions.rightEarLobe,
      roll,
      faceW,
      earringStyle,
      earringScaleMultiplier,
      offsetYUnits,
      offsetXUnits
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
