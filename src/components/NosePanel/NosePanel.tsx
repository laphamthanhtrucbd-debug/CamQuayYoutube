import React from 'react';
import { NoseEffectSettings } from '../../types/effects';
import { RotateCcw } from 'lucide-react';

interface NosePanelProps {
  settings: NoseEffectSettings;
  onChange: (updated: NoseEffectSettings) => void;
  onReset: () => void;
}

const NOSE_SLIDERS: { key: keyof NoseEffectSettings; label: string; hint: string }[] = [
  { key: 'slim', label: 'Thu gọn mũi', hint: 'Thu gọn rất nhẹ hai bên cánh mũi, không gây méo nền' },
  { key: 'tipRefine', label: 'Điều chỉnh đầu mũi', hint: 'Tinh chỉnh chóp mũi gọn gàng thanh thoát' },
  { key: 'balance', label: 'Làm mũi cân đối hơn', hint: 'Tạo khối sáng nhẹ dọc sống mũi giúp mũi cao tự nhiên' },
];

export const NosePanel: React.FC<NosePanelProps> = ({ settings, onChange, onReset }) => {
  const handleChange = (key: keyof NoseEffectSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Tinh chỉnh dáng mũi</h2>
          <p className="text-xs text-zinc-400">
            Điều chỉnh tinh tế theo sống mũi và cánh mũi thật
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
        {NOSE_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`nose-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`nose-${item.key}`}
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
