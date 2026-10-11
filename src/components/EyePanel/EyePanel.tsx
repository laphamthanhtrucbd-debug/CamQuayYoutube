import React from 'react';
import { EyeEffectSettings } from '../../types/effects';
import { RotateCcw } from 'lucide-react';

interface EyePanelProps {
  settings: EyeEffectSettings;
  onChange: (updated: EyeEffectSettings) => void;
  onReset: () => void;
}

const EYE_SLIDERS: { key: keyof EyeEffectSettings; label: string; hint: string }[] = [
  { key: 'brighten', label: 'Làm mắt sáng hơn', hint: 'Tăng độ trong và sáng tự nhiên cho đôi mắt' },
  { key: 'sparkle', label: 'Làm mắt long lanh', hint: 'Thêm ánh sáng phản chiếu catchlight bám theo con ngươi' },
  { key: 'enlarge', label: 'Làm mắt to nhẹ', hint: 'Mở rộng nhẹ vùng mắt tự nhiên không gây biến dạng' },
  { key: 'underEyeBright', label: 'Làm sáng vùng dưới mắt', hint: 'Giảm quầng thâm và bọng mắt nhẹ nhàng' },
  { key: 'clarity', label: 'Điều chỉnh hiệu ứng mắt', hint: 'Làm rõ viền tròng mắt sắc nét và có chiều sâu' },
];

export const EyePanel: React.FC<EyePanelProps> = ({ settings, onChange, onReset }) => {
  const handleChange = (key: keyof EyeEffectSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Tinh chỉnh đôi mắt</h2>
          <p className="text-xs text-zinc-400">
            Nhận diện mắt trái, mắt phải và mống mắt theo thời gian thực
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

      <div className="space-y-4">
        {EYE_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`eye-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`eye-${item.key}`}
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => handleChange(item.key, Number(e.target.value))}
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
