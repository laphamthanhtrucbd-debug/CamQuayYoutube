import React from 'react';
import { SkinEffectSettings } from '../../types/effects';
import { RotateCcw } from 'lucide-react';

interface BeautyPanelProps {
  settings: SkinEffectSettings;
  onChange: (updated: SkinEffectSettings) => void;
  onReset: () => void;
}

interface SliderItem {
  key: keyof SkinEffectSettings;
  label: string;
  hint: string;
}

const SKIN_SLIDERS: SliderItem[] = [
  { key: 'smooth', label: 'Mịn da', hint: 'Làm mịn bề mặt da tự nhiên, giữ nguyên chi tiết mắt và môi' },
  { key: 'brighten', label: 'Làm sáng da', hint: 'Nâng tông da hồng hào rạng rỡ' },
  { key: 'evenTone', label: 'Làm đều màu da', hint: 'Cân bằng sắc tố giữa các vùng trên gương mặt' },
  { key: 'blemishReduce', label: 'Giảm khuyết điểm', hint: 'Làm mờ nhẹ vết thâm và vùng da không đều' },
  { key: 'antiShine', label: 'Giảm bóng dầu', hint: 'Kiểm soát độ bóng vùng chữ T, trán và hai bên má' },
  { key: 'soften', label: 'Làm mềm da', hint: 'Tạo độ mượt dịu nhẹ dưới ánh sáng gắt' },
];

export const BeautyPanel: React.FC<BeautyPanelProps> = ({ settings, onChange, onReset }) => {
  const handleSliderChange = (key: keyof SkinEffectSettings, val: number) => {
    onChange({
      ...settings,
      [key]: val,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Làm đẹp da tự nhiên</h2>
          <p className="text-xs text-zinc-400">
            Xử lý riêng vùng da thật theo landmark, không làm mờ mắt hay môi
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
        {SKIN_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`skin-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`skin-${item.key}`}
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
