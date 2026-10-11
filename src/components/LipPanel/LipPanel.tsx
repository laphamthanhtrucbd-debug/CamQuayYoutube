import React from 'react';
import { LipColorId, LipEffectSettings } from '../../types/effects';
import { LIP_COLOR_PALETTE } from '../../effects/lipEffect';
import { RotateCcw, Palette } from 'lucide-react';

interface LipPanelProps {
  settings: LipEffectSettings;
  onChange: (updated: LipEffectSettings) => void;
  onReset: () => void;
}

const LIP_SLIDERS: {
  key: Exclude<keyof LipEffectSettings, 'colorId' | 'customHex'>;
  label: string;
  hint: string;
}[] = [
  { key: 'intensity', label: 'Điều chỉnh độ đậm', hint: 'Cường độ màu son trên môi trên và môi dưới' },
  { key: 'gloss', label: 'Làm môi sáng', hint: 'Làm sáng hồng đều toàn bộ môi kèm ánh satin dịu nhẹ' },
  { key: 'plump', label: 'Làm môi căng nhẹ', hint: 'Làm đầy dáng môi nhẹ nhàng tự nhiên' },
  { key: 'naturalBlend', label: 'Tạo màu môi tự nhiên', hint: 'Độ tán mờ viền môi mềm mại như đánh son thật' },
];

export const LipPanel: React.FC<LipPanelProps> = ({ settings, onChange, onReset }) => {
  const handleSelectColor = (colorId: LipColorId) => {
    onChange({
      ...settings,
      colorId,
    });
  };

  const handleCustomHexChange = (hex: string) => {
    onChange({
      ...settings,
      colorId: 'custom',
      customHex: hex,
    });
  };

  const handleSliderChange = (
    key: Exclude<keyof LipEffectSettings, 'colorId' | 'customHex'>,
    value: number
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Trang điểm môi</h2>
          <p className="text-xs text-zinc-400">
            Màu son bám sát viền môi trên và môi dưới ngay cả khi nói cười
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mặc định</span>
        </button>
      </div>

      {/* Lip Color Swatches + Custom Color Picker */}
      <div className="space-y-2.5">
        <span className="block text-xs font-medium text-zinc-200">Chọn màu son</span>
        <div className="grid grid-cols-2 gap-2">
          {LIP_COLOR_PALETTE.map((swatch) => {
            const isSelected = settings.colorId === swatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => handleSelectColor(swatch.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800/90 border-rose-500 text-zinc-100'
                    : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-xs font-medium truncate">{swatch.name}</span>
              </button>
            );
          })}

          {/* Custom Color Picker Tile */}
          <label
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
              settings.colorId === 'custom'
                ? 'bg-zinc-800/90 border-rose-500 text-zinc-100'
                : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                style={{ backgroundColor: settings.customHex || '#E11D48' }}
              />
              <span className="text-xs font-medium truncate">Màu tự chọn</span>
            </div>
            <Palette className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <input
              type="color"
              value={settings.customHex || '#E11D48'}
              onChange={(e) => handleCustomHexChange(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Lip Sliders */}
      <div className="space-y-4 pt-2 border-t border-zinc-800/60">
        {LIP_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`lip-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`lip-${item.key}`}
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => handleSliderChange(item.key, Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[11px] text-zinc-500">{item.hint}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
