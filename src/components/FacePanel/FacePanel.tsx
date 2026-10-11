import React from 'react';
import { FaceShapeSettings } from '../../types/effects';
import { RotateCcw } from 'lucide-react';

interface FacePanelProps {
  settings: FaceShapeSettings;
  onChange: (updated: FaceShapeSettings) => void;
  onReset: () => void;
}

const FACE_SLIDERS: { key: keyof FaceShapeSettings; label: string; hint: string }[] = [
  { key: 'slimFace', label: 'Thon mặt', hint: 'Thu gọn nhẹ hai bên má dưới theo đường viền mặt thật' },
  { key: 'jawline', label: 'Gọn hàm', hint: 'Tạo đường viền hàm V-line thanh thoát tự nhiên' },
  { key: 'chin', label: 'Thon cằm', hint: 'Tinh chỉnh vùng đỉnh cằm cân đối nhẹ nhàng' },
  { key: 'cheekbone', label: 'Điều chỉnh má', hint: 'Nâng nhẹ khối gò má và tạo sắc hồng tự nhiên' },
  { key: 'balance', label: 'Làm mặt cân đối hơn', hint: 'Tạo khối sáng tối 3D dịu nhẹ cho vùng trán và cằm' },
];

export const FacePanel: React.FC<FacePanelProps> = ({ settings, onChange, onReset }) => {
  const handleChange = (key: keyof FaceShapeSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Định hình khuôn mặt</h2>
          <p className="text-xs text-zinc-400">
            Tinh chỉnh đường nét nhẹ nhàng bám theo chuyển động hàm và cằm
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
        {FACE_SLIDERS.map((item) => {
          const val = settings[item.key];
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={`face-${item.key}`} className="font-medium text-zinc-200">
                  {item.label}
                </label>
                <span className="font-mono-num text-zinc-400">{val}%</span>
              </div>
              <input
                id={`face-${item.key}`}
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
