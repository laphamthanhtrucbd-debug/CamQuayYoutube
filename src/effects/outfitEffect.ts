import { FaceRegions, Point2D } from '../types/face';
import { OutfitEffectSettings, OutfitStyleId } from '../types/effects';

export interface OutfitDefinition {
  id: OutfitStyleId;
  name: string;
  category: string;
  description: string;
  defaultColor: string;
  defaultSecondaryColor: string;
  defaultNecklineDepth: number; // offset
  defaultShoulderWidth: number; // percentage
  necklaceRecommendation?: string;
}

export const OUTFIT_DEFINITIONS: OutfitDefinition[] = [
  {
    id: 'none',
    name: 'Mặc định (Trang phục thật)',
    category: 'Gốc',
    description: 'Giữ nguyên 100% trang phục thật bạn đang mặc trên camera',
    defaultColor: '#000000',
    defaultSecondaryColor: '#000000',
    defaultNecklineDepth: 0,
    defaultShoulderWidth: 100,
  },
  {
    id: 'ao-dai-gam',
    name: 'Áo Dài Gấm Cung Đình',
    category: 'Truyền Thống',
    description: 'Áo dài truyền thống cổ cao 3cm, tà gấm hoa văn sang trọng, viền vàng kim quý phái',
    defaultColor: '#DC2626', // Đỏ son gấm
    defaultSecondaryColor: '#F59E0B', // Viền vàng hoàng gia
    defaultNecklineDepth: -14, // Cổ cao ôm sát
    defaultShoulderWidth: 102,
    necklaceRecommendation: 'Kiềng Cổ Hoàng Gia',
  },
  {
    id: 'ao-dai-cach-tan',
    name: 'Áo Dài Cách Tân Thêu Hoa',
    category: 'Truyền Thống',
    description: 'Áo dài cổ tròn thanh tao, vải lụa tơ tằm thêu hoa sen trang nhã',
    defaultColor: '#0EA5E9', // Xanh lam ngọc
    defaultSecondaryColor: '#FBCFE8', // Hồng pastel
    defaultNecklineDepth: 0,
    defaultShoulderWidth: 100,
    necklaceRecommendation: 'Vòng Cổ Ngọc Trai',
  },
  {
    id: 'dam-da-hoi-offshoulder',
    name: 'Đầm Dạ Hội Trễ Vai Lụa Satin',
    category: 'Dạ Hội',
    description: 'Đầm dạ hội trễ vai sang chảnh, khoe xương quai xanh quyến rũ với vạt lụa gợn sóng',
    defaultColor: '#1E1B4B', // Xanh đen Midnight Sapphire
    defaultSecondaryColor: '#E2E8F0', // Ánh bạc kiêu sa
    defaultNecklineDepth: 18, // Trễ vai sâu thanh lịch
    defaultShoulderWidth: 112,
    necklaceRecommendation: 'Vòng Cổ Kim Cương Dạ Hội',
  },
  {
    id: 'dam-co-vuong-vintage',
    name: 'Đầm Quý Tộc Cổ Vuông Pháp',
    category: 'Dạ Hội',
    description: 'Đầm vintage cổ vuông hoàng gia, cúp ngực tinh xảo và tay bồng tiểu thư',
    defaultColor: '#831843', // Đỏ rượu vang Burgundy
    defaultSecondaryColor: '#FDE047', // Viền ren vàng
    defaultNecklineDepth: 12,
    defaultShoulderWidth: 106,
    necklaceRecommendation: 'Vòng Cổ Trái Tim Hồng Ngọc',
  },
  {
    id: 'so-mi-cong-so',
    name: 'Áo Sơ Mi Lụa Cổ Bẻ Công Sở',
    category: 'Công Sở',
    description: 'Áo sơ mi lụa tơ tằm cổ bẻ V-neck hiện đại, hàng khuy xà cừ lịch thiệp',
    defaultColor: '#F8FAFC', // Trắng ngà thanh lịch
    defaultSecondaryColor: '#94A3B8', // Viền xám ngọc
    defaultNecklineDepth: 6,
    defaultShoulderWidth: 102,
    necklaceRecommendation: 'Mặt Dây Chuyền Giọt Lệ Y-Pendant',
  },
  {
    id: 'ao-vest-blazer',
    name: 'Blazer Doanh Nhân Cao Cấp',
    category: 'Công Sở',
    description: 'Áo vest ve nhọn thời thượng, form vai đứng tôn dáng quyền lực và thanh lịch',
    defaultColor: '#18181B', // Đen Onyx sang trọng
    defaultSecondaryColor: '#D97706', // Khuy vàng đúc
    defaultNecklineDepth: 15,
    defaultShoulderWidth: 110,
    necklaceRecommendation: 'Dây Xích Bạc Tối Giản',
  },
  {
    id: 'ao-thun-basic',
    name: 'Áo Thun Cotton Cổ Tròn Trẻ Trung',
    category: 'Thường Ngày',
    description: 'Áo thun cotton cao cấp co giãn 4 chiều, bo viền cổ gân mềm mại',
    defaultColor: '#3B82F6', // Xanh Cobalt năng động
    defaultSecondaryColor: '#FFFFFF',
    defaultNecklineDepth: -2,
    defaultShoulderWidth: 100,
    necklaceRecommendation: 'Dây Xích Bạc Mặt Trăng Sao',
  },
  {
    id: 'ao-polo-casual',
    name: 'Áo Polo Thể Thao Smart-Casual',
    category: 'Thường Ngày',
    description: 'Áo polo dệt pique cao cấp có cổ bẻ và nẹp khuy thể thao hiện đại',
    defaultColor: '#059669', // Xanh Ngọc Lục Bảo
    defaultSecondaryColor: '#F3F4F6',
    defaultNecklineDepth: 4,
    defaultShoulderWidth: 102,
  },
  {
    id: 'ao-len-co-lo',
    name: 'Áo Len Dệt Kim Cổ Lọ Thu Đông',
    category: 'Thu Đông',
    description: 'Áo len dệt kim ribbed cổ lọ ấm áp, phong cách Hàn Quốc dịu dàng',
    defaultColor: '#78350F', // Nâu caramel ấm áp
    defaultSecondaryColor: '#FDE68A',
    defaultNecklineDepth: -22, // Cổ cao ôm kín
    defaultShoulderWidth: 104,
  },
  {
    id: 'ao-croptop-y2k',
    name: 'Áo Cổ Tim Đính Nơ Coquette',
    category: 'Dạo Phố',
    description: 'Thiết kế viền ren ngọt ngào, cổ tim đính nơ ruy băng nữ tính đáng yêu',
    defaultColor: '#F43F5E', // Hồng dâu ngọt ngào
    defaultSecondaryColor: '#FFF1F2',
    defaultNecklineDepth: 14,
    defaultShoulderWidth: 98,
    necklaceRecommendation: 'Vòng Cổ Choker Nhung',
  },
  {
    id: 'hoodie-streetwear',
    name: 'Áo Hoodie Streetwear Năng Động',
    category: 'Dạo Phố',
    description: 'Áo hoodie nỉ bông form rộng cá tính, dây rút mũ dệt dày dặn',
    defaultColor: '#475569', // Xám khói Streetwear
    defaultSecondaryColor: '#F8FAFC',
    defaultNecklineDepth: -4,
    defaultShoulderWidth: 114,
  },
];

/**
 * Procedural Canvas Pattern Generator for high realism (Gấm hoa chìm, Kẻ sọc, Chấm bi, Caro, Kim tuyến)
 */
function createFabricPattern(
  ctx: CanvasRenderingContext2D,
  patternId: string,
  baseColor: string,
  secColor: string,
  intensity: number
): CanvasPattern | string {
  if (patternId === 'solid' || intensity <= 0) {
    return baseColor;
  }

  const pCanvas = document.createElement('canvas');
  const pSize = 48;
  pCanvas.width = pSize;
  pCanvas.height = pSize;
  const pCtx = pCanvas.getContext('2d');
  if (!pCtx) return baseColor;

  pCtx.fillStyle = baseColor;
  pCtx.fillRect(0, 0, pSize, pSize);

  pCtx.save();
  const alpha = (intensity / 100) * 0.45;
  pCtx.globalAlpha = alpha;

  if (patternId === 'stripes') {
    pCtx.strokeStyle = secColor;
    pCtx.lineWidth = 4;
    pCtx.beginPath();
    pCtx.moveTo(0, 0);
    pCtx.lineTo(pSize, pSize);
    pCtx.moveTo(0, pSize / 2);
    pCtx.lineTo(pSize / 2, pSize);
    pCtx.moveTo(pSize / 2, 0);
    pCtx.lineTo(pSize, pSize / 2);
    pCtx.stroke();
  } else if (patternId === 'polka') {
    pCtx.fillStyle = secColor;
    pCtx.beginPath();
    pCtx.arc(pSize / 4, pSize / 4, 3, 0, Math.PI * 2);
    pCtx.arc((pSize * 3) / 4, (pSize * 3) / 4, 3, 0, Math.PI * 2);
    pCtx.fill();
  } else if (patternId === 'plaid') {
    pCtx.fillStyle = secColor;
    pCtx.fillRect(10, 0, 4, pSize);
    pCtx.fillRect(0, 10, pSize, 4);
    pCtx.fillRect(32, 0, 2, pSize);
    pCtx.fillRect(0, 32, pSize, 2);
  } else if (patternId === 'sparkle') {
    pCtx.fillStyle = secColor;
    for (let i = 0; i < 8; i++) {
      const rx = (i * 17) % pSize;
      const ry = (i * 29) % pSize;
      pCtx.beginPath();
      pCtx.arc(rx, ry, 1.2, 0, Math.PI * 2);
      pCtx.fill();
    }
  } else if (patternId === 'silk-flow') {
    // Royal Damask / Lotus brocade motif
    pCtx.strokeStyle = secColor;
    pCtx.lineWidth = 1.5;
    pCtx.beginPath();
    pCtx.arc(pSize / 2, pSize / 2, 12, 0, Math.PI);
    pCtx.bezierCurveTo(pSize / 2, pSize / 4, pSize / 4, pSize / 2, pSize / 2, pSize / 2);
    pCtx.stroke();
  }
  pCtx.restore();

  const pattern = ctx.createPattern(pCanvas, 'repeat');
  return pattern || baseColor;
}

/**
 * Render procedural outfit seamlessly adapted to user's body, neck, chest, and shoulders
 */
export function applyOutfitEffect(
  ctx: CanvasRenderingContext2D,
  regions: FaceRegions,
  settings: OutfitEffectSettings
): void {
  if (!settings || settings.styleId === 'none' || settings.opacity <= 0) {
    return;
  }

  const {
    faceBox,
    chinCenter,
    neckCenter,
    rollAngle,
  } = regions;

  const styleId = settings.styleId;
  const outfitDef = OUTFIT_DEFINITIONS.find((o) => o.id === styleId);
  const colorHex = settings.colorHex || outfitDef?.defaultColor || '#DC2626';
  const secHex = settings.secondaryColorHex || outfitDef?.defaultSecondaryColor || '#F59E0B';
  const opacity = Math.min(1.0, Math.max(0.0, (settings.opacity ?? 100) / 100));

  const faceW = faceBox.width;
  const faceH = faceBox.height;

  // Rotation & Geometry
  const cosR = Math.cos(rollAngle);
  const sinR = Math.sin(rollAngle);
  const downUnitX = sinR;
  const downUnitY = cosR;

  // Custom offsets
  const neckDepthOffset = (settings.necklineDepth ?? 0) * (faceH * 0.005);
  const shoulderMultiplier = (settings.shoulderWidth ?? 100) / 100;
  const verticalShift = (settings.verticalOffset ?? 0) * (faceH * 0.004);

  // Anatomical neck base: anchored smoothly relative to chinCenter and neckCenter
  // neckCenter from faceGeometry is located right above the suprasternal notch (hõm ức).
  const baseNeckX = chinCenter.x * 0.25 + neckCenter.x * 0.75;
  const baseNeckY = chinCenter.y * 0.25 + neckCenter.y * 0.75;

  const adjustedNeckCenter: Point2D = {
    x: baseNeckX + downUnitX * (neckDepthOffset + verticalShift),
    y: baseNeckY + downUnitY * (neckDepthOffset + verticalShift),
  };

  // Shoulder span (~2.15x face width) positioned at natural shoulder drop angle (18 deg)
  const halfShoulderSpan = faceW * 1.15 * shoulderMultiplier;
  const shoulderDownwardDrop = faceH * 0.12;

  const leftShoulder: Point2D = {
    x: adjustedNeckCenter.x - cosR * halfShoulderSpan + downUnitX * shoulderDownwardDrop,
    y: adjustedNeckCenter.y - sinR * halfShoulderSpan + downUnitY * shoulderDownwardDrop,
  };
  const rightShoulder: Point2D = {
    x: adjustedNeckCenter.x + cosR * halfShoulderSpan + downUnitX * shoulderDownwardDrop,
    y: adjustedNeckCenter.y + sinR * halfShoulderSpan + downUnitY * shoulderDownwardDrop,
  };

  const canvasBottomY = ctx.canvas.height + 40;

  ctx.save();
  ctx.globalAlpha = opacity;

  const fabricFill = createFabricPattern(
    ctx,
    settings.patternId || 'solid',
    colorHex,
    secHex,
    settings.patternIntensity ?? 60
  );

  // Render specific outfit cuts
  if (styleId === 'ao-dai-gam' || styleId === 'ao-dai-cach-tan') {
    renderAoDai(
      ctx,
      chinCenter,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      colorHex,
      secHex,
      styleId === 'ao-dai-gam'
    );
  } else if (styleId === 'dam-da-hoi-offshoulder') {
    renderOffShoulderDress(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'dam-co-vuong-vintage') {
    renderSquareNeckDress(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'so-mi-cong-so') {
    renderShirtCollar(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'ao-vest-blazer') {
    renderBlazerSuit(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'ao-len-co-lo') {
    renderTurtleneck(
      ctx,
      chinCenter,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'ao-croptop-y2k') {
    renderSweetheartBowTop(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else if (styleId === 'hoodie-streetwear') {
    renderHoodie(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex
    );
  } else {
    // Default Casual T-shirt or Polo
    renderCrewNeckTee(
      ctx,
      adjustedNeckCenter,
      leftShoulder,
      rightShoulder,
      canvasBottomY,
      faceW,
      faceH,
      cosR,
      sinR,
      downUnitX,
      downUnitY,
      fabricFill,
      secHex,
      styleId === 'ao-polo-casual'
    );
  }

  ctx.restore();
}

/**
 * 1. Traditional Áo Dài with Royal High Collar / Rounded Collar & Chest Flap (Tà áo dài cung đình)
 */
function renderAoDai(
  ctx: CanvasRenderingContext2D,
  chinCenter: Point2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  baseColor: string,
  goldColor: string,
  isHighCollar: boolean
): void {
  const neckWidth = faceW * 0.44;

  // Neck collar points — positioned below the chin so it hugs the neck naturally without covering the chin
  const leftCollarTop: Point2D = {
    x: chinCenter.x - cosR * (neckWidth * 0.5) + downUnitX * (faceH * (isHighCollar ? 0.04 : 0.09)),
    y: chinCenter.y - sinR * (neckWidth * 0.5) + downUnitY * (faceH * (isHighCollar ? 0.04 : 0.09)),
  };
  const rightCollarTop: Point2D = {
    x: chinCenter.x + cosR * (neckWidth * 0.5) + downUnitX * (faceH * (isHighCollar ? 0.04 : 0.09)),
    y: chinCenter.y + sinR * (neckWidth * 0.5) + downUnitY * (faceH * (isHighCollar ? 0.04 : 0.09)),
  };

  const collarBottom: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * (isHighCollar ? 0.03 : 0.08)),
    y: neckCenter.y + downUnitY * (faceH * (isHighCollar ? 0.03 : 0.08)),
  };

  // Main Ao Dai Body & Shoulder Silhouette
  ctx.beginPath();
  ctx.moveTo(leftCollarTop.x, leftCollarTop.y);
  ctx.quadraticCurveTo(collarBottom.x, collarBottom.y, rightCollarTop.x, rightCollarTop.y);
  // Shoulder seam right
  ctx.quadraticCurveTo(
    (rightCollarTop.x + rightShoulder.x) / 2 - downUnitX * 10,
    (rightCollarTop.y + rightShoulder.y) / 2 - downUnitY * 10,
    rightShoulder.x,
    rightShoulder.y
  );
  // Down to chest & canvas boundary
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x, leftShoulder.y);
  // Shoulder seam left
  ctx.quadraticCurveTo(
    (leftCollarTop.x + leftShoulder.x) / 2 - downUnitX * 10,
    (leftCollarTop.y + leftShoulder.y) / 2 - downUnitY * 10,
    leftCollarTop.x,
    leftCollarTop.y
  );
  ctx.closePath();

  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Shading & Fabric 3D Contours
  const grad = ctx.createLinearGradient(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y);
  grad.addColorStop(0, 'rgba(0,0,0,0.3)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.12)');
  grad.addColorStop(0.65, 'rgba(255,255,255,0.05)');
  grad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = grad;
  ctx.fill();

  // High mandarin collar band if royal style
  if (isHighCollar) {
    ctx.beginPath();
    ctx.moveTo(leftCollarTop.x - cosR * 4, leftCollarTop.y - sinR * 4);
    ctx.lineTo(rightCollarTop.x + cosR * 4, rightCollarTop.y + sinR * 4);
    ctx.quadraticCurveTo(collarBottom.x, collarBottom.y + downUnitY * 8, leftCollarTop.x, leftCollarTop.y);
    ctx.closePath();
    ctx.fillStyle = baseColor;
    ctx.fill();

    // Gold trim on collar
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Golden buttons diagonal across right chest (Hàng khuy áo dài bấm chéo nách)
    const buttonStart = {
      x: collarBottom.x + cosR * 6,
      y: collarBottom.y + sinR * 6,
    };
    ctx.beginPath();
    ctx.moveTo(buttonStart.x, buttonStart.y);
    ctx.quadraticCurveTo(
      rightShoulder.x * 0.7 + collarBottom.x * 0.3,
      rightShoulder.y * 0.7 + collarBottom.y * 0.3 + 20,
      rightShoulder.x - cosR * 15 + downUnitX * 60,
      rightShoulder.y - sinR * 15 + downUnitY * 60
    );
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pearl / Gold frog knots (Nút bấm ngọc)
    for (let i = 0; i < 4; i++) {
      const t = 0.2 + i * 0.22;
      const bx = buttonStart.x + (rightShoulder.x - buttonStart.x) * t;
      const by = buttonStart.y + (rightShoulder.y - buttonStart.y) * t + i * 10;
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = goldColor;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
  } else {
    // Elegant soft satin piping around round collar
    ctx.beginPath();
    ctx.moveTo(leftCollarTop.x, leftCollarTop.y);
    ctx.quadraticCurveTo(collarBottom.x, collarBottom.y, rightCollarTop.x, rightCollarTop.y);
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }
}

/**
 * 2. Off-shoulder Evening Silk Gown (Đầm dạ hội trễ vai quyến rũ)
 */
function renderOffShoulderDress(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  silverTrimColor: string
): void {
  // Deep elegant sweetheart / draped curve below collarbone
  const bustCenter: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * 0.28),
    y: neckCenter.y + downUnitY * (faceH * 0.28),
  };

  const leftDrape: Point2D = {
    x: leftShoulder.x + cosR * 15 + downUnitX * 12,
    y: leftShoulder.y + sinR * 15 + downUnitY * 12,
  };
  const rightDrape: Point2D = {
    x: rightShoulder.x - cosR * 15 + downUnitX * 12,
    y: rightShoulder.y - sinR * 15 + downUnitY * 12,
  };

  // Main gown body
  ctx.beginPath();
  ctx.moveTo(leftDrape.x, leftDrape.y);
  // Sweetheart dip in the center
  ctx.bezierCurveTo(
    leftDrape.x + cosR * (faceW * 0.4),
    leftDrape.y + downUnitY * (faceH * 0.15),
    bustCenter.x - cosR * (faceW * 0.2),
    bustCenter.y - downUnitY * 6,
    bustCenter.x,
    bustCenter.y
  );
  ctx.bezierCurveTo(
    bustCenter.x + cosR * (faceW * 0.2),
    bustCenter.y - downUnitY * 6,
    rightDrape.x - cosR * (faceW * 0.4),
    rightDrape.y + downUnitY * (faceH * 0.15),
    rightDrape.x,
    rightDrape.y
  );
  ctx.lineTo(rightShoulder.x + cosR * 35, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 35, bottomY);
  ctx.closePath();

  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Off-shoulder fold satin ribbon overlay
  ctx.beginPath();
  ctx.moveTo(leftDrape.x - cosR * 10, leftDrape.y - downUnitY * 12);
  ctx.quadraticCurveTo(bustCenter.x, bustCenter.y - downUnitY * 10, rightDrape.x + cosR * 10, rightDrape.y - downUnitY * 12);
  ctx.quadraticCurveTo(bustCenter.x, bustCenter.y + downUnitY * 18, leftDrape.x - cosR * 10, leftDrape.y + downUnitY * 16);
  ctx.closePath();

  const drapeGrad = ctx.createLinearGradient(leftDrape.x, leftDrape.y, rightDrape.x, rightDrape.y);
  drapeGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
  drapeGrad.addColorStop(0.5, 'rgba(255,255,255,0.45)');
  drapeGrad.addColorStop(1, 'rgba(255,255,255,0.2)');
  ctx.fillStyle = drapeGrad;
  ctx.fill();

  // Subtle crystal edging
  ctx.strokeStyle = silverTrimColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

/**
 * 3. Square-Neck Vintage Royal Dress (Đầm cổ vuông Pháp quý tộc)
 */
function renderSquareNeckDress(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  laceColor: string
): void {
  const neckHalfWidth = faceW * 0.48;
  const squareDepth = faceH * 0.22;

  const leftCornerTop: Point2D = {
    x: neckCenter.x - cosR * neckHalfWidth - downUnitX * (faceH * 0.05),
    y: neckCenter.y - sinR * neckHalfWidth - downUnitY * (faceH * 0.05),
  };
  const leftCornerBottom: Point2D = {
    x: neckCenter.x - cosR * neckHalfWidth + downUnitX * squareDepth,
    y: neckCenter.y - sinR * neckHalfWidth + downUnitY * squareDepth,
  };
  const rightCornerBottom: Point2D = {
    x: neckCenter.x + cosR * neckHalfWidth + downUnitX * squareDepth,
    y: neckCenter.y + sinR * neckHalfWidth + downUnitY * squareDepth,
  };
  const rightCornerTop: Point2D = {
    x: neckCenter.x + cosR * neckHalfWidth - downUnitX * (faceH * 0.05),
    y: neckCenter.y + sinR * neckHalfWidth - downUnitY * (faceH * 0.05),
  };

  // Body
  ctx.beginPath();
  ctx.moveTo(leftCornerTop.x, leftCornerTop.y);
  ctx.lineTo(leftCornerBottom.x, leftCornerBottom.y);
  ctx.lineTo(rightCornerBottom.x, rightCornerBottom.y);
  ctx.lineTo(rightCornerTop.x, rightCornerTop.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x, leftShoulder.y);
  ctx.closePath();

  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Puff sleeve caps
  ctx.beginPath();
  ctx.arc(leftShoulder.x, leftShoulder.y, faceW * 0.32, Math.PI * 0.7, Math.PI * 1.8);
  ctx.fillStyle = fabricFill;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightShoulder.x, rightShoulder.y, faceW * 0.32, Math.PI * 1.2, Math.PI * 0.3, true);
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Delicate Victorian lace trim along square neckline
  ctx.beginPath();
  ctx.moveTo(leftCornerTop.x, leftCornerTop.y);
  ctx.lineTo(leftCornerBottom.x, leftCornerBottom.y);
  ctx.lineTo(rightCornerBottom.x, rightCornerBottom.y);
  ctx.lineTo(rightCornerTop.x, rightCornerTop.y);
  ctx.strokeStyle = laceColor;
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Scalloped lace detail
  ctx.save();
  ctx.strokeStyle = laceColor;
  ctx.lineWidth = 1.2;
  const numScallops = 10;
  for (let i = 0; i < numScallops; i++) {
    const t = i / numScallops;
    const sx = leftCornerBottom.x + (rightCornerBottom.x - leftCornerBottom.x) * t;
    const sy = leftCornerBottom.y + (rightCornerBottom.y - leftCornerBottom.y) * t;
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * 4. Office Silk Button-Down Shirt with V-Collar Lapels (Áo sơ mi lụa công sở)
 */
function renderShirtCollar(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  trimColor: string
): void {
  const vDip: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * 0.22),
    y: neckCenter.y + downUnitY * (faceH * 0.22),
  };

  const leftCollarCorner: Point2D = {
    x: neckCenter.x - cosR * (faceW * 0.38) + downUnitX * (faceH * 0.04),
    y: neckCenter.y - sinR * (faceW * 0.38) + downUnitY * (faceH * 0.04),
  };
  const rightCollarCorner: Point2D = {
    x: neckCenter.x + cosR * (faceW * 0.38) + downUnitX * (faceH * 0.04),
    y: neckCenter.y + sinR * (faceW * 0.38) + downUnitY * (faceH * 0.04),
  };

  // Shirt body
  ctx.beginPath();
  ctx.moveTo(leftCollarCorner.x, leftCollarCorner.y);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.lineTo(rightCollarCorner.x, rightCollarCorner.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x, leftShoulder.y);
  ctx.closePath();

  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Left Collar Lapel
  ctx.beginPath();
  ctx.moveTo(leftCollarCorner.x + cosR * 15, leftCollarCorner.y - downUnitY * 20);
  ctx.lineTo(leftCollarCorner.x - cosR * 20 + downUnitX * 30, leftCollarCorner.y + downUnitY * 30);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Right Collar Lapel
  ctx.beginPath();
  ctx.moveTo(rightCollarCorner.x - cosR * 15, rightCollarCorner.y - downUnitY * 20);
  ctx.lineTo(rightCollarCorner.x + cosR * 20 + downUnitX * 30, rightCollarCorner.y + downUnitY * 30);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mother-of-pearl buttons down placket
  for (let i = 1; i <= 3; i++) {
    const by = vDip.y + downUnitY * (i * faceH * 0.16);
    const bx = vDip.x + downUnitX * (i * faceH * 0.16);
    ctx.beginPath();
    ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/**
 * 5. Modern Blazer Suit with Peaked Lapels (Áo vest blazer doanh nhân)
 */
function renderBlazerSuit(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  goldButtonColor: string
): void {
  // Inside shirt layer (white silk inner)
  const vDip: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * 0.36),
    y: neckCenter.y + downUnitY * (faceH * 0.36),
  };

  ctx.beginPath();
  ctx.moveTo(neckCenter.x - cosR * (faceW * 0.25), neckCenter.y);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.lineTo(neckCenter.x + cosR * (faceW * 0.25), neckCenter.y);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Left Jacket Panel
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(leftShoulder.x + cosR * (faceW * 0.2), leftShoulder.y - downUnitY * 15);
  ctx.lineTo(neckCenter.x - cosR * 10, neckCenter.y + downUnitY * 10);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.lineTo(vDip.x + cosR * 10, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Right Jacket Panel
  ctx.beginPath();
  ctx.moveTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightShoulder.x - cosR * (faceW * 0.2), rightShoulder.y - downUnitY * 15);
  ctx.lineTo(neckCenter.x + cosR * 10, neckCenter.y + downUnitY * 10);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.lineTo(vDip.x - cosR * 10, bottomY);
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Blazer Lapel Sharp Lines & Shadow
  ctx.beginPath();
  ctx.moveTo(neckCenter.x - cosR * 10, neckCenter.y + downUnitY * 10);
  ctx.lineTo(vDip.x, vDip.y);
  ctx.lineTo(neckCenter.x + cosR * 10, neckCenter.y + downUnitY * 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Gold embossed blazer button
  ctx.beginPath();
  ctx.arc(vDip.x, vDip.y + downUnitY * 25, 6, 0, Math.PI * 2);
  ctx.fillStyle = goldButtonColor;
  ctx.fill();
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * 6. Ribbed Turtleneck Sweater (Áo len cổ lọ thu đông)
 */
function renderTurtleneck(
  ctx: CanvasRenderingContext2D,
  chinCenter: Point2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  ribColor: string
): void {
  const neckHalfW = faceW * 0.32;

  // Turtleneck Tube
  const topRollLeft: Point2D = {
    x: chinCenter.x - cosR * neckHalfW + downUnitX * (faceH * 0.05),
    y: chinCenter.y - sinR * neckHalfW + downUnitY * (faceH * 0.05),
  };
  const topRollRight: Point2D = {
    x: chinCenter.x + cosR * neckHalfW + downUnitX * (faceH * 0.05),
    y: chinCenter.y + sinR * neckHalfW + downUnitY * (faceH * 0.05),
  };
  const bottomRollLeft: Point2D = {
    x: neckCenter.x - cosR * (neckHalfW * 1.15),
    y: neckCenter.y - sinR * (neckHalfW * 1.15),
  };
  const bottomRollRight: Point2D = {
    x: neckCenter.x + cosR * (neckHalfW * 1.15),
    y: neckCenter.y + sinR * (neckHalfW * 1.15),
  };

  // Shoulder & Body
  ctx.beginPath();
  ctx.moveTo(bottomRollLeft.x, bottomRollLeft.y);
  ctx.lineTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(bottomRollRight.x, bottomRollRight.y);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Chunky turtleneck collar roll
  ctx.beginPath();
  ctx.moveTo(topRollLeft.x, topRollLeft.y);
  ctx.lineTo(topRollRight.x, topRollRight.y);
  ctx.quadraticCurveTo(
    (topRollRight.x + bottomRollRight.x) / 2 + cosR * 5,
    (topRollRight.y + bottomRollRight.y) / 2 + sinR * 5,
    bottomRollRight.x,
    bottomRollRight.y
  );
  ctx.lineTo(bottomRollLeft.x, bottomRollLeft.y);
  ctx.quadraticCurveTo(
    (topRollLeft.x + bottomRollLeft.x) / 2 - cosR * 5,
    (topRollLeft.y + bottomRollLeft.y) / 2 - sinR * 5,
    topRollLeft.x,
    topRollLeft.y
  );
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Ribbed texture vertical lines on neck
  ctx.save();
  ctx.strokeStyle = ribColor;
  ctx.lineWidth = 1.8;
  const numRibs = 8;
  for (let i = 1; i < numRibs; i++) {
    const t = i / numRibs;
    const tx = topRollLeft.x + (topRollRight.x - topRollLeft.x) * t;
    const ty = topRollLeft.y + (topRollRight.y - topRollRight.y) * t;
    const bx = bottomRollLeft.x + (bottomRollRight.x - bottomRollLeft.x) * t;
    const by = bottomRollLeft.y + (bottomRollRight.y - bottomRollLeft.y) * t;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * 7. Sweetheart Bow Top (Áo cổ tim đính nơ nữ tính)
 */
function renderSweetheartBowTop(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  bowColor: string
): void {
  const heartDip: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * 0.2),
    y: neckCenter.y + downUnitY * (faceH * 0.2),
  };

  // Body with sweetheart neckline
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.quadraticCurveTo(
    neckCenter.x - cosR * (faceW * 0.25),
    neckCenter.y + downUnitY * (faceH * 0.1),
    heartDip.x,
    heartDip.y
  );
  ctx.quadraticCurveTo(
    neckCenter.x + cosR * (faceW * 0.25),
    neckCenter.y + downUnitY * (faceH * 0.1),
    rightShoulder.x,
    rightShoulder.y
  );
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Dainty Ribbon Bow at center
  ctx.save();
  ctx.translate(heartDip.x, heartDip.y);
  ctx.rotate(Math.atan2(downUnitY, downUnitX) - Math.PI / 2);

  ctx.fillStyle = bowColor;
  // Left bow loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-15, -12, -22, 10, 0, 4);
  ctx.fill();
  // Right bow loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, -12, 22, 10, 0, 4);
  ctx.fill();
  // Center knot
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();
}

/**
 * 8. Streetwear Oversized Hoodie (Áo hoodie năng động)
 */
function renderHoodie(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  drawstringColor: string
): void {
  // Broad oversized shoulders
  const leftOverShoulder: Point2D = {
    x: leftShoulder.x - cosR * 25,
    y: leftShoulder.y - sinR * 25,
  };
  const rightOverShoulder: Point2D = {
    x: rightShoulder.x + cosR * 25,
    y: rightShoulder.y + sinR * 25,
  };

  const hoodCenter: Point2D = {
    x: neckCenter.x + downUnitX * (faceH * 0.14),
    y: neckCenter.y + downUnitY * (faceH * 0.14),
  };

  // Hoodie body
  ctx.beginPath();
  ctx.moveTo(hoodCenter.x - cosR * (faceW * 0.35), hoodCenter.y - downUnitY * 10);
  ctx.quadraticCurveTo(hoodCenter.x, hoodCenter.y + downUnitY * 12, hoodCenter.x + cosR * (faceW * 0.35), hoodCenter.y - downUnitY * 10);
  ctx.lineTo(rightOverShoulder.x, rightOverShoulder.y);
  ctx.lineTo(rightOverShoulder.x + cosR * 35, bottomY);
  ctx.lineTo(leftOverShoulder.x - cosR * 35, bottomY);
  ctx.lineTo(leftOverShoulder.x, leftOverShoulder.y);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Thick fleece hood rim behind neck
  ctx.beginPath();
  ctx.moveTo(hoodCenter.x - cosR * (faceW * 0.42), hoodCenter.y - downUnitY * 15);
  ctx.quadraticCurveTo(hoodCenter.x, hoodCenter.y + downUnitY * 18, hoodCenter.x + cosR * (faceW * 0.42), hoodCenter.y - downUnitY * 15);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // White braided drawstrings (2 sợi dây rút hoodie)
  const drawStringLen = faceH * 0.28;
  const drawLeftX = hoodCenter.x - cosR * 16;
  const drawLeftY = hoodCenter.y + downUnitY * 8;
  ctx.beginPath();
  ctx.moveTo(drawLeftX, drawLeftY);
  ctx.quadraticCurveTo(drawLeftX - cosR * 8, drawLeftY + drawStringLen * 0.5, drawLeftX, drawLeftY + drawStringLen);
  ctx.strokeStyle = drawstringColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  const drawRightX = hoodCenter.x + cosR * 16;
  const drawRightY = hoodCenter.y + downUnitY * 8;
  ctx.beginPath();
  ctx.moveTo(drawRightX, drawRightY);
  ctx.quadraticCurveTo(drawRightX + cosR * 8, drawRightY + drawStringLen * 0.5, drawRightX, drawRightY + drawStringLen);
  ctx.strokeStyle = drawstringColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Metal aglets on string tips
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(drawLeftX - 2, drawLeftY + drawStringLen - 2, 4, 8);
  ctx.fillRect(drawRightX - 2, drawRightY + drawStringLen - 2, 4, 8);
}

/**
 * 9. Crew-neck T-shirt or Polo (Áo thun cổ tròn / Áo polo)
 */
function renderCrewNeckTee(
  ctx: CanvasRenderingContext2D,
  neckCenter: Point2D,
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  bottomY: number,
  faceW: number,
  faceH: number,
  cosR: number,
  sinR: number,
  downUnitX: number,
  downUnitY: number,
  fabricFill: CanvasPattern | string,
  trimColor: string,
  isPolo: boolean
): void {
  const neckRadiusX = faceW * 0.36;
  const neckRadiusY = faceH * 0.16;

  const collarBottom: Point2D = {
    x: neckCenter.x + downUnitX * neckRadiusY,
    y: neckCenter.y + downUnitY * neckRadiusY,
  };

  // Body
  ctx.beginPath();
  ctx.moveTo(neckCenter.x - cosR * neckRadiusX, neckCenter.y);
  ctx.quadraticCurveTo(collarBottom.x, collarBottom.y, neckCenter.x + cosR * neckRadiusX, neckCenter.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightShoulder.x + cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x - cosR * 30, bottomY);
  ctx.lineTo(leftShoulder.x, leftShoulder.y);
  ctx.closePath();
  ctx.fillStyle = fabricFill;
  ctx.fill();

  // Ribbed collar trim
  ctx.beginPath();
  ctx.moveTo(neckCenter.x - cosR * neckRadiusX, neckCenter.y);
  ctx.quadraticCurveTo(collarBottom.x, collarBottom.y, neckCenter.x + cosR * neckRadiusX, neckCenter.y);
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = isPolo ? 4.5 : 3.5;
  ctx.stroke();

  // Polo button placket
  if (isPolo) {
    const placketLen = faceH * 0.2;
    ctx.beginPath();
    ctx.moveTo(collarBottom.x, collarBottom.y);
    ctx.lineTo(collarBottom.x + downUnitX * placketLen, collarBottom.y + downUnitY * placketLen);
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(
        collarBottom.x + downUnitX * (placketLen * 0.45 * i),
        collarBottom.y + downUnitY * (placketLen * 0.45 * i),
        2.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
  }
}
