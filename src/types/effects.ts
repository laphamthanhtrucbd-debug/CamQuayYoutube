export interface SkinEffectSettings {
  smooth: number;        // Mịn da (0-100)
  brighten: number;      // Làm sáng da (0-100)
  evenTone: number;      // Làm đều màu da (0-100)
  blemishReduce: number; // Giảm khuyết điểm (0-100)
  antiShine: number;     // Giảm bóng dầu (0-100)
  soften: number;        // Làm mềm da (0-100)
}

export interface EyeEffectSettings {
  brighten: number;      // Làm mắt sáng hơn (0-100)
  sparkle: number;       // Làm mắt long lanh (0-100)
  enlarge: number;       // Làm mắt to nhẹ (0-100)
  underEyeBright: number;// Làm sáng vùng dưới mắt (0-100)
  clarity: number;       // Điều chỉnh hiệu ứng mắt / Độ sắc nét (0-100)
}

export interface NoseEffectSettings {
  slim: number;          // Thu gọn mũi (0-100)
  tipRefine: number;     // Điều chỉnh đầu mũi (0-100)
  balance: number;       // Làm mũi cân đối hơn (0-100)
}

export type LipColorId =
  | 'light-pink'
  | 'peach-pink'
  | 'dusty-rose'
  | 'rose-red'
  | 'soft-red'
  | 'peach-orange'
  | 'nude'
  | 'custom';

export interface LipColorOption {
  id: LipColorId;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

export interface LipEffectSettings {
  colorId: LipColorId;   // Chọn màu son
  customHex: string;     // Màu son tự chọn (HEX)
  intensity: number;     // Điều chỉnh độ đậm (0-100, mặc định 100%)
  gloss: number;         // Làm môi sáng / Bóng nhẹ (0-100)
  plump: number;         // Làm môi căng nhẹ (0-100)
  naturalBlend: number;  // Tạo màu môi tự nhiên (0-100)
}

export type EyebrowColorId =
  | 'natural-black'
  | 'dark-brown'
  | 'ash-brown'
  | 'soft-taupe'
  | 'custom';

export interface EyebrowEffectSettings {
  intensity: number;     // Làm đậm (0-100)
  definition: number;    // Làm rõ (0-100)
  colorId: EyebrowColorId;// Điều chỉnh màu
  customHex: string;     // Màu lông mày tự chọn (HEX)
  archLift: number;      // Tạo dáng nhẹ (0-100)
}

export interface FaceShapeSettings {
  slimFace: number;      // Thon mặt (0-100)
  jawline: number;       // Gọn hàm (0-100)
  chin: number;          // Thon cằm (0-100)
  cheekbone: number;     // Điều chỉnh má (0-100)
  balance: number;       // Làm mặt cân đối hơn (0-100)
}

export type AREffectId =
  | 'none'
  | 'bunny-ears'
  | 'cat-ears'
  | 'flowers'
  | 'hearts'
  | 'stars'
  | 'sparkle'
  | 'soft-light';

export interface AREffectSettings {
  activeEffect: AREffectId;
  intensity: number;     // Cường độ hiệu ứng AR (0-100)
  scale: number;         // Kích thước phụ kiện AR (50-150)
}

export type CrownStyleId = 'gold-royal' | 'crystal-queen' | 'floral-tiara';
export type EarringStyleId = 'pearl-drop' | 'diamond-chandelier' | 'ruby-heart';
export type NecklaceStyleId = 'diamond-royal' | 'pearl-choker' | 'gold-pendant';
export typeBinduStyleId = 'lotus-huadian' | 'classic-red' | 'royal-gold';

export interface AccessoryEffectSettings {
  crown: boolean;              // Vương miện trên đỉnh đầu
  crownStyle: CrownStyleId;
  earrings: boolean;           // Bông tai hai bên
  earringStyle: EarringStyleId;
  necklace: boolean;           // Vòng cổ
  necklaceStyle: NecklaceStyleId;
  cinnabarMark: boolean;       // Chu sa giữa 2 đầu lông mày (Ấn đường)
  cinnabarStyle: typeBinduStyleId;
  opacity: number;             // Độ rõ phụ kiện (0-100)
  scale: number;               // Kích thước phụ kiện (70-135)
}

export type ColorFilterId =
  | 'natural'
  | 'vibrant-oil'
  | 'bw'
  | 'soft'
  | 'dreamy'
  | 'warm'
  | 'cool'
  | 'film'
  | 'clear'
  | 'gentle'
  | 'pink-tint';

export interface ColorFilterSettings {
  filterId: ColorFilterId;
  intensity: number;     // Độ mạnh bộ lọc màu (0-100)
}

export interface AllEffectsState {
  enabled: boolean;
  compareOriginal: boolean;
  showLandmarks: boolean;
  skin: SkinEffectSettings;
  eye: EyeEffectSettings;
  nose: NoseEffectSettings;
  lip: LipEffectSettings;
  eyebrow: EyebrowEffectSettings;
  faceShape: FaceShapeSettings;
  ar: AREffectSettings;
  accessory: AccessoryEffectSettings;
  colorFilter: ColorFilterSettings;
}

export interface CapturedMediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  filename: string;
  timestamp: string;
  durationSec?: number;
  sizeBytes?: number;
}
