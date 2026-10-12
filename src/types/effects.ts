export interface SkinEffectSettings {
  smooth: number;        // Mịn da (0-100)
  brighten: number;      // Làm sáng da (0-100)
  evenTone: number;      // Làm đều màu da (0-100)
  acneRemove: number;    // Xóa mụn (0-100)
  blemishReduce: number; // Xóa khuyết điểm (0-100)
  freckleRemove: number; // Xóa tàn nhang (0-100)
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

export type EyeMakeupStyleId =
  | 'none'
  | 'korean-peach'
  | 'korean-rose-quartz'
  | 'korean-milk-tea'
  | 'korean-strawberry'
  | 'asian-cherry-blossom'
  | 'asian-terracotta'
  | 'asian-red-ruby'
  | 'asian-apricot-gold'
  | 'western-smoky-bronze'
  | 'western-hollywood-taupe'
  | 'western-sunset-copper'
  | 'western-champagne-glam'
  | 'african-royal-gold'
  | 'african-emerald-queen'
  | 'african-amethyst-velvet'
  | 'african-sahara-berry'
  | 'custom';

export interface EyeMakeupEffectSettings {
  styleId: EyeMakeupStyleId; // 16 kiểu màu mắt Hàn / Á / Âu Mỹ / Phi + tự chọn
  customHex: string;         // Màu phấn mắt tự chọn (HEX)
  intensity: number;         // Độ đậm phấn mắt (0-100)
  shimmer: number;           // Nhũ kim tuyến bầu mắt & bọng mắt Aegyo-sal (0-100)
  lensIntensity: number;     // Độ trong màu tròng mắt / Lens đồng bộ (0-100)
}

export type EyelinerStyleId =
  | 'none'
  | 'korean-puppy'
  | 'korean-natural-tightline'
  | 'korean-idol-wing'
  | 'asian-phoenix'
  | 'asian-douyin-wing'
  | 'asian-manga-doll'
  | 'asian-kitten-flick'
  | 'western-classic-cat'
  | 'western-foxy-siren'
  | 'western-hollywood-glam'
  | 'western-smoky-wing'
  | 'western-double-wing'
  | 'african-cleopatra-royal'
  | 'african-graphic-floating'
  | 'african-bold-winged'
  | 'arabian-kohl-dramatic';

export type EyelinerColorId =
  | 'jet-black'
  | 'espresso-brown'
  | 'cocoa-brown'
  | 'burgundy-wine'
  | 'navy-midnight'
  | 'custom';

export interface EyelinerEffectSettings {
  styleId: EyelinerStyleId;
  colorId: EyelinerColorId;
  customHex: string;
  intensity: number;   // Độ đậm nét kẻ mắt (0-100)
  thickness: number;   // Độ mảnh / dày nét vẽ (20-100)
  wingLength: number;  // Độ dài đuôi eyeliner (20-100)
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
export type EarringStyleId =
  | 'ruby-heart'
  | 'pearl-drop'
  | 'diamond-chandelier'
  | 'gold-hoop'
  | 'emerald-tear'
  | 'crystal-star';

export type NecklaceStyleId =
  | 'diamond-royal'
  | 'pearl-choker'
  | 'gold-pendant'
  | 'ao-dai-kieng'
  | 'ruby-heart-collier'
  | 'velvet-choker'
  | 'minimal-chain';

export type typeBinduStyleId = 'lotus-huadian' | 'classic-red' | 'royal-gold';

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
  earringScale?: number;       // Tỷ lệ phóng to riêng cho bông tai (50-200, mặc định 100)
  earringOffsetY?: number;     // Tinh chỉnh lên/xuống cho bông tai (-50 đến +50, mặc định 0)
  earringOffsetX?: number;     // Tinh chỉnh trong/ngoài cho bông tai (-50 đến +50, mặc định 0)
  necklaceLength?: number;     // Độ dài rủ xuống của vòng cổ (50-180, mặc định 100)
  necklaceWidth?: number;      // Độ rộng vòm vòng cổ (60-150, mặc định 100)
  necklaceOffsetY?: number;    // Vị trí nâng lên/hạ xuống vòng cổ (-50 đến +50, mặc định 0)
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

export type BackgroundModeId =
  | 'none'
  | 'blur-soft'
  | 'blur-bokeh'
  | 'studio-warm'
  | 'studio-rose'
  | 'luxury-dark'
  | 'sky-pastel'
  | 'neon-cyber'
  | 'custom-image';

export interface BackgroundEffectSettings {
  mode: BackgroundModeId;
  blurStrength: number;  // Độ mờ phông nền (0-100)
  customImageUrl: string;// Ảnh nền tự tải lên
}

export type OutfitCategory =
  | 'traditional'
  | 'evening'
  | 'casual'
  | 'office'
  | 'coquette'
  | 'streetwear';

export type OutfitStyleId =
  | 'none'
  | 'ao-dai-gam'        // Áo Dài Gấm Hoa Cung Đình Truyền Thống
  | 'ao-dai-cach-tan'   // Áo Dài Cách Tân Thanh Nhã
  | 'dam-da-hoi-offshoulder' // Đầm Dạ Hội Lụa Trễ Vai Quyến Rũ
  | 'dam-co-vuong-vintage'   // Đầm Dạ Hội Cổ Vuông Quý Tộc
  | 'so-mi-cong-so'     // Áo Sơ Mi Lụa Cổ Bẻ Công Sở Thanh Lịch
  | 'ao-vest-blazer'    // Áo Vest / Blazer Sang Trọng Hiện Đại
  | 'ao-thun-basic'     // Áo Thun Cotton Cổ Tròn Năng Động
  | 'ao-polo-casual'    // Áo Polo Thể Thao Cao Cấp
  | 'ao-len-co-lo'      // Áo Len Dệt Kim Cổ Lọ Ấm Áp
  | 'ao-croptop-y2k'    // Áo Cổ Tim Nơ Xinh Xắn (Coquette)
  | 'hoodie-streetwear';// Áo Hoodie Streetwear Cá Tính

export type OutfitPatternId =
  | 'solid'      // Trơn tinh tế
  | 'silk-flow'  // Gấm hoa chìm hoàng gia
  | 'stripes'    // Kẻ sọc thanh lịch
  | 'polka'      // Chấm bi cổ điển
  | 'plaid'      // Caro hiện đại
  | 'sparkle';   // Kim tuyến lấp lánh

export interface OutfitEffectSettings {
  styleId: OutfitStyleId;
  colorHex: string;             // Tùy ý đổi màu sắc trang phục
  secondaryColorHex: string;    // Màu viền / họa tiết phụ
  patternId: OutfitPatternId;   // Họa tiết trang phục (trơn hoặc hoa văn)
  patternIntensity: number;     // Độ rõ của họa tiết (0-100)
  opacity: number;              // Độ đậm lớp trang phục (0-100, mặc định 100)
  necklineDepth: number;        // Độ sâu cổ áo (điều chỉnh nông/sâu: -30 đến +30)
  shoulderWidth: number;        // Độ rộng vai áo (80-130%, mặc định 100)
  verticalOffset: number;       // Tinh chỉnh nâng/hạ vị trí cổ áo (-30 đến +30)
  autoSyncNecklace: boolean;    // Tự động phối vòng cổ khớp hoàn hảo với cổ áo
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
  eyeMakeup: EyeMakeupEffectSettings;
  eyeliner: EyelinerEffectSettings;
  faceShape: FaceShapeSettings;
  ar: AREffectSettings;
  accessory: AccessoryEffectSettings;
  outfit: OutfitEffectSettings;
  colorFilter: ColorFilterSettings;
  background: BackgroundEffectSettings;
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
