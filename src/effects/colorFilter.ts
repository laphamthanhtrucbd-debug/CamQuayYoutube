import { ColorFilterId, ColorFilterSettings } from '../types/effects';

export interface ColorFilterDefinition {
  id: ColorFilterId;
  name: string;
  subtitle: string;
  previewGradient: string;
}

export const COLOR_FILTERS: ColorFilterDefinition[] = [
  {
    id: 'natural',
    name: 'Natural',
    subtitle: 'Tự nhiên gốc',
    previewGradient: 'from-zinc-700 to-zinc-900',
  },
  {
    id: 'vibrant-oil',
    name: 'Sặc sỡ (Sơn dầu)',
    subtitle: 'Đậm sắc tố toàn khung hình, sơn dầu điện ảnh',
    previewGradient: 'from-rose-600 via-amber-500 to-indigo-700',
  },
  {
    id: 'bw',
    name: 'Đen trắng',
    subtitle: 'Đơn sắc toàn khung hình',
    previewGradient: 'from-zinc-200 via-zinc-500 to-zinc-950',
  },
  {
    id: 'soft',
    name: 'Soft',
    subtitle: 'Mềm mại tự nhiên',
    previewGradient: 'from-amber-200/40 via-rose-200/30 to-zinc-800',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    subtitle: 'Mơ màng sáng mịn',
    previewGradient: 'from-pink-300/40 via-purple-300/30 to-zinc-800',
  },
  {
    id: 'warm',
    name: 'Warm',
    subtitle: 'Ấm áp nắng chiều',
    previewGradient: 'from-amber-400/40 via-orange-300/30 to-zinc-800',
  },
  {
    id: 'cool',
    name: 'Cool',
    subtitle: 'Lạnh hiện đại',
    previewGradient: 'from-sky-400/40 via-indigo-300/30 to-zinc-800',
  },
  {
    id: 'film',
    name: 'Film',
    subtitle: 'Màu phim cổ điển',
    previewGradient: 'from-emerald-400/30 via-amber-200/30 to-zinc-800',
  },
  {
    id: 'clear',
    name: 'Trong trẻo',
    subtitle: 'Sáng trong vắt',
    previewGradient: 'from-cyan-200/40 via-sky-200/30 to-zinc-800',
  },
  {
    id: 'gentle',
    name: 'Dịu dàng',
    subtitle: 'Kem đào dịu mắt',
    previewGradient: 'from-orange-200/40 via-rose-200/30 to-zinc-800',
  },
  {
    id: 'pink-tint',
    name: 'Hồng nhẹ',
    subtitle: 'Hồng phấn YouTube',
    previewGradient: 'from-rose-300/45 via-pink-200/35 to-zinc-800',
  },
];

let globalFilterBuffer: HTMLCanvasElement | null = null;
function getGlobalFilterBuffer(width: number, height: number): HTMLCanvasElement {
  if (!globalFilterBuffer) {
    globalFilterBuffer = document.createElement('canvas');
  }
  if (globalFilterBuffer.width !== width || globalFilterBuffer.height !== height) {
    globalFilterBuffer.width = width;
    globalFilterBuffer.height = height;
  }
  return globalFilterBuffer;
}


/**
 * We now apply all global color grading AT THE VERY END of the pipeline (`applyGlobalColorFilter`)
 * so that 100% of the frame (background, hair, clothes, skin, makeup, AR, and accessories)
 * gets the exact same rich, uniform color grade without any mismatch between face and background!
 */
export function getCanvasFilterString(_settings: ColorFilterSettings): string {
  return 'none';
}

export function applyColorFilterOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: ColorFilterSettings
): void {
  const { filterId, intensity } = settings;
  if (filterId === 'natural' || intensity <= 0) return;

  const t = intensity / 100;
  const buf = getGlobalFilterBuffer(width, height);
  const bufCtx = buf.getContext('2d');
  if (!bufCtx) return;

  // Snapshot the ENTIRE completed frame (background + retouched face + makeup + AR + accessories)
  bufCtx.clearRect(0, 0, width, height);
  bufCtx.drawImage(ctx.canvas, 0, 0);

  ctx.save();

  switch (filterId) {
    case 'vibrant-oil': {
      // 1. Apply extreme saturation, deep contrast, and richness uniformly across the ENTIRE frame
      const sat = (100 + 145 * t).toFixed(0);
      const con = (100 + 48 * t).toFixed(0);
      const bri = (100 + 3 * t).toFixed(1);

      ctx.clearRect(0, 0, width, height);
      ctx.filter = `saturate(${sat}%) contrast(${con}%) brightness(${bri}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';

      // 2. Deep S-curve pigment richness pass across the entire frame (deepens darks & pops highlights)
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.42 * t;
      ctx.drawImage(buf, 0, 0);

      break;
    }
    case 'bw': {
      // Uniform 100% monochrome black-and-white across the entire frame (including lipstick, AR, accessories, background)
      const gray = (100 * t).toFixed(0);
      const con = (100 + 28 * t).toFixed(0);
      ctx.clearRect(0, 0, width, height);
      ctx.filter = `grayscale(${gray}%) contrast(${con}%) brightness(102%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      break;
    }
    case 'soft': {
      ctx.filter = `brightness(${(100 + 4 * t).toFixed(1)}%) contrast(${(100 - 5 * t).toFixed(1)}%) saturate(${(100 - 4 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(255, 244, 238, ${(0.12 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'dreamy': {
      ctx.filter = `brightness(${(100 + 6 * t).toFixed(1)}%) contrast(${(100 - 6 * t).toFixed(1)}%) saturate(${(100 + 6 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'screen';
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `rgba(252, 220, 240, ${(0.11 * t).toFixed(3)})`);
      grad.addColorStop(1, `rgba(225, 215, 255, ${(0.11 * t).toFixed(3)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'warm': {
      ctx.filter = `brightness(${(100 + 3 * t).toFixed(1)}%) sepia(${(14 * t).toFixed(1)}%) saturate(${(100 + 12 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(255, 200, 150, ${(0.16 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'cool': {
      ctx.filter = `brightness(${(100 + 3 * t).toFixed(1)}%) contrast(${(100 + 4 * t).toFixed(1)}%) hue-rotate(${(-6 * t).toFixed(1)}deg)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(175, 215, 255, ${(0.16 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'film': {
      ctx.filter = `contrast(${(100 + 8 * t).toFixed(1)}%) saturate(${(100 - 12 * t).toFixed(1)}%) sepia(${(8 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(215, 225, 210, ${(0.14 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'clear': {
      ctx.filter = `brightness(${(100 + 6 * t).toFixed(1)}%) contrast(${(100 + 5 * t).toFixed(1)}%) saturate(${(100 + 8 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(240, 248, 255, ${(0.15 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'gentle': {
      ctx.filter = `brightness(${(100 + 4 * t).toFixed(1)}%) contrast(${(100 - 4 * t).toFixed(1)}%) sepia(${(6 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(255, 228, 218, ${(0.16 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'pink-tint': {
      ctx.filter = `brightness(${(100 + 5 * t).toFixed(1)}%) saturate(${(100 + 10 * t).toFixed(1)}%)`;
      ctx.drawImage(buf, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(255, 192, 215, ${(0.2 * t).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }

  ctx.restore();
}
