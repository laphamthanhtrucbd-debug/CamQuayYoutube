import React from 'react';
import { EyebrowColorId, EyebrowEffectSettings } from '../../types/effects';
import { EYEBROW_COLORS } from '../../effects/eyebrowEffect';
import { RotateCcw, Palette } from 'lucide-react';

interface EyebrowPanelProps {
  settings: EyebrowEffectSettings;
  onChange: (updated: EyebrowEffectSettings) => void;
  onReset: () => void;
}

const BROW_SLIDERS: {
  key: Exclude<keyof EyebrowEffectSettings, 'colorId' | 'customHex'>;
  label: string;
  hint: string;
}[] = [
  { key: 'intensity', label: 'Làm đậm', hint: 'Tăng độ dày và sắc nét cho hàng chân mày thật' },
  { key: 'definition', label: 'Làm rõ', hint: 'Định hình đường khuôn chân mày rõ ràng hơn' },
  { key: 'archLift', label: 'Tạo dáng nhẹ', hint: 'Nâng nhẹ phần đỉnh lông mày thanh thoát' },
];

export const EyebrowPanel: React.FC<EyebrowPanelProps> = ({ settings, onChange, onReset }) => {
  const handleSelectColor = (colorId: EyebrowColorId) => {
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
    key: Exclude<keyof EyebrowEffectSettings, 'colorId' | 'customHex'>,
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
          <h2 className="text-lg font-semibold text-zinc-100">Chân mày tự nhiên</h2>
          <p className="text-xs text-zinc-400">
            Bám theo vị trí lông mày trái và phải thực tế của người dùng
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

      {/* Brow Color Selection + Custom Color Picker */}
      <div className="space-y-2.5">
        <span className="block text-xs font-medium text-zinc-200">Điều chỉnh màu lông mày</span>
        <div className="grid grid-cols-2 gap-2">
          {EYEBROW_COLORS.map((c) => {
            const isSelected = settings.colorId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectColor(c.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800/90 border-rose-500 text-zinc-100'
                    : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-medium truncate">{c.name}</span>
              </button>
            );
          })}

          {/* Custom Brow Color Picker Tile */}
          <label
            className={`col-span-2 flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
              settings.colorId === 'custom'
                ? 'bg-zinc-800/90 border-rose-500 text-zinc-100'
                : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                style={{ backgroundColor: settings.customHex || '#4A3728' }}
              />
              <span className="text-xs font-medium truncate">
                Màu lông mày tự chọn ({settings.customHex || '#4A3728'})
              </span>
            </div>
            <Palette className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <input
              type="color"
              value={settings.customHex || '#4A3728'}
              onChange={(e) => handleCustomHexChange(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Brow Sliders */}
      <div className="space-y-4 pt-2 border-t border-zinc-800/60">
        {BROW_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`brow-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`brow-${item.key}`}
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
