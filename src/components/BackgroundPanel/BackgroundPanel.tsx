import React, { useRef } from 'react';
import { BackgroundEffectSettings, BackgroundModeId } from '../../types/effects';
import { BACKGROUND_OPTIONS } from '../../effects/backgroundEffect';
import { ImagePlus, RotateCcw } from 'lucide-react';

interface BackgroundPanelProps {
  settings: BackgroundEffectSettings;
  onChange: (updated: BackgroundEffectSettings) => void;
  onReset: () => void;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectMode = (mode: BackgroundModeId) => {
    onChange({
      ...settings,
      mode,
    });
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({
      ...settings,
      mode: 'custom-image',
      customImageUrl: url,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Phông nền (Background)</h2>
          <p className="text-xs text-zinc-400">
            Xóa phông chân dung, đổi phông Studio hoặc tải ảnh nền từ máy tính
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

      {/* Custom Background Upload Button */}
      <div className="p-3 bg-zinc-950/90 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-zinc-200">Tải ảnh nền riêng từ máy tính</p>
          <p className="text-[11px] text-zinc-400">
            Hỗ trợ PNG, JPG, WEBP làm phông nền trực tiếp phía sau bạn
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>Chọn ảnh nền</span>
        </button>
      </div>

      {/* Background Presets Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {BACKGROUND_OPTIONS.map((item) => {
          const isSelected = settings.mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectMode(item.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500/70 text-zinc-100'
                  : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <span
                className="w-8 h-8 rounded-lg border border-white/15 shrink-0"
                style={{ background: item.previewCss }}
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{item.name}</div>
                <div className="text-[10px] text-zinc-400 truncate">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Blur Strength Slider */}
      {settings.mode !== 'none' && (
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="bg-blur-slider" className="font-medium text-zinc-200">
              Độ mờ hậu cảnh (Blur)
            </label>
            <span className="font-mono-num text-zinc-400">{settings.blurStrength}%</span>
          </div>
          <input
            id="bg-blur-slider"
            type="range"
            min={0}
            max={100}
            value={settings.blurStrength}
            onChange={(e) =>
              onChange({
                ...settings,
                blurStrength: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      )}
    </div>
  );
};
