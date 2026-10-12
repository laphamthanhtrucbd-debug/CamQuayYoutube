import React from 'react';
import {
  Sparkles,
  Palette,
  RotateCcw,
  Sliders,
  Check,
  Shirt,
  Scissors,
} from 'lucide-react';
import {
  OutfitEffectSettings,
  OutfitStyleId,
  OutfitPatternId,
} from '../../types/effects';
import {
  OUTFIT_DEFINITIONS,
  OutfitDefinition,
} from '../../effects/outfitEffect';

interface OutfitPanelProps {
  settings: OutfitEffectSettings;
  onChange: (settings: OutfitEffectSettings) => void;
  onReset: () => void;
}

const PRESET_COLORS = [
  { name: 'Đỏ son gấm', hex: '#DC2626' },
  { name: 'Xanh lam ngọc', hex: '#0EA5E9' },
  { name: 'Xanh Sapphire', hex: '#1E1B4B' },
  { name: 'Đỏ rượu Burgundy', hex: '#831843' },
  { name: 'Trắng tinh khôi', hex: '#F8FAFC' },
  { name: 'Đen huyền bí', hex: '#18181B' },
  { name: 'Xanh Emerald', hex: '#059669' },
  { name: 'Hồng phấn pastel', hex: '#F472B6' },
  { name: 'Vàng Hoàng Kim', hex: '#F59E0B' },
  { name: 'Nâu Mocha', hex: '#78350F' },
  { name: 'Tím Oải Hương', hex: '#7C3AED' },
  { name: 'Xám Khói', hex: '#475569' },
];

const PATTERN_OPTIONS: { id: OutfitPatternId; name: string }[] = [
  { id: 'solid', name: 'Trơn Tinh Tế' },
  { id: 'silk-flow', name: 'Gấm Hoa Hoàng Gia' },
  { id: 'stripes', name: 'Kẻ Sọc Thanh Lịch' },
  { id: 'polka', name: 'Chấm Bi Cổ Điển' },
  { id: 'plaid', name: 'Caro Hiện Đại' },
  { id: 'sparkle', name: 'Kim Tuyến Lấp Lánh' },
];

const CATEGORIES = [
  'Tất cả',
  'Truyền Thống',
  'Dạ Hội',
  'Công Sở',
  'Thường Ngày',
  'Dạo Phố',
  'Thu Đông',
];

export const OutfitPanel: React.FC<OutfitPanelProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Tất cả');

  const filteredOutfits = React.useMemo(() => {
    if (selectedCategory === 'Tất cả') return OUTFIT_DEFINITIONS;
    return OUTFIT_DEFINITIONS.filter(
      (o) => o.category === selectedCategory || o.id === 'none'
    );
  }, [selectedCategory]);

  const activeOutfit = React.useMemo(
    () => OUTFIT_DEFINITIONS.find((o) => o.id === settings.styleId) || OUTFIT_DEFINITIONS[0],
    [settings.styleId]
  );

  const handleSelectOutfit = (outfit: OutfitDefinition) => {
    if (outfit.id === 'none') {
      onChange({
        ...settings,
        styleId: 'none',
      });
      return;
    }

    onChange({
      ...settings,
      styleId: outfit.id,
      colorHex: outfit.defaultColor,
      secondaryColorHex: outfit.defaultSecondaryColor,
      necklineDepth: outfit.defaultNecklineDepth,
      shoulderWidth: outfit.defaultShoulderWidth,
      opacity: 100,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Thay Đổi Trang Phục Thực Tế
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          title="Khôi phục trang phục thật ban đầu"
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Mặc định</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-500 text-white font-semibold shadow-xs'
                : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
        {filteredOutfits.map((outfit) => {
          const isSelected = settings.styleId === outfit.id;
          return (
            <button
              key={outfit.id}
              type="button"
              onClick={() => handleSelectOutfit(outfit)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500 text-white shadow-sm'
                  : 'bg-zinc-950/70 border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 w-full">
                <span className="font-semibold text-xs text-zinc-100 line-clamp-1">
                  {outfit.name}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>

              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {outfit.description}
              </p>

              {outfit.necklaceRecommendation && (
                <div className="mt-2 text-[9.5px] font-medium text-amber-400/90 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Gợi ý: {outfit.necklaceRecommendation}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Outfit Customization Controls (Shown when an outfit is active) */}
      {settings.styleId !== 'none' && (
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          {/* Color Palette Customizer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                Màu sắc trang phục
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-zinc-700 shadow-xs"
                  style={{ backgroundColor: settings.colorHex }}
                />
                <input
                  type="color"
                  value={settings.colorHex || '#DC2626'}
                  onChange={(e) =>
                    onChange({ ...settings, colorHex: e.target.value })
                  }
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                  title="Chọn màu tùy biến khác"
                />
              </div>
            </div>

            {/* Quick color circles */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => onChange({ ...settings, colorHex: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                    settings.colorHex.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-white scale-110 shadow-md ring-2 ring-rose-500/50'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              Họa tiết & Chất liệu vải
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {PATTERN_OPTIONS.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => onChange({ ...settings, patternId: pat.id })}
                  className={`py-1.5 px-2 text-[10.5px] font-medium rounded-lg border text-center transition-colors truncate cursor-pointer ${
                    (settings.patternId || 'solid') === pat.id
                      ? 'bg-rose-500/20 text-rose-200 border-rose-500/60'
                      : 'bg-zinc-950/70 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {pat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Precision Tailoring Sliders */}
          <div className="space-y-2 pt-1 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Cắt may & Khớp kích cỡ với cơ thể</span>
            </div>

            {/* Neckline depth */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Độ sâu cổ áo</span>
                <span className="font-semibold text-zinc-200">
                  {settings.necklineDepth > 0
                    ? `+${settings.necklineDepth}`
                    : settings.necklineDepth}
                </span>
              </div>
              <input
                type="range"
                min={-25}
                max={25}
                value={settings.necklineDepth ?? 0}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    necklineDepth: Number(e.target.value),
                  })
                }
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Shoulder width */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Độ rộng vai áo</span>
                <span className="font-semibold text-zinc-200">
                  {settings.shoulderWidth ?? 100}%
                </span>
              </div>
              <input
                type="range"
                min={85}
                max={125}
                value={settings.shoulderWidth ?? 100}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    shoulderWidth: Number(e.target.value),
                  })
                }
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Độ đậm trang phục</span>
                <span className="font-semibold text-zinc-200">
                  {settings.opacity ?? 100}%
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                value={settings.opacity ?? 100}
                onChange={(e) =>
                  onChange({ ...settings, opacity: Number(e.target.value) })
                }
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
