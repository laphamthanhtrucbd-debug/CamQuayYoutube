import React, { useState } from 'react';
import { AREffectId, AREffectSettings } from '../../types/effects';
import { AR_EFFECT_OPTIONS, updateBunnyAssetImage } from '../../effects/arEffect';
import { RotateCcw, FolderOpen, Upload } from 'lucide-react';

interface ARPanelProps {
  settings: AREffectSettings;
  onChange: (updated: AREffectSettings) => void;
  onReset: () => void;
}

export const ARPanel: React.FC<ARPanelProps> = ({ settings, onChange, onReset }) => {
  const [customStatus, setCustomStatus] = useState<string | null>(null);

  const handleSelectEffect = (activeEffect: AREffectId) => {
    onChange({
      ...settings,
      activeEffect,
    });
  };

  const handleUploadAsset = (
    key: 'taitho' | 'muitho' | 'rautho',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateBunnyAssetImage(key, url);
    setCustomStatus(`Đã cập nhật ${key}.png`);
    setTimeout(() => setCustomStatus(null), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Thư mục Hiệu ứng AR</h2>
          <p className="text-xs text-zinc-400">
            Tự động nhận diện đỉnh đầu, mũi và hai má theo thời gian thực
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Tắt AR</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {AR_EFFECT_OPTIONS.map((item) => {
          const isSelected = settings.activeEffect === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectEffect(item.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500 text-zinc-100'
                  : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold truncate">{item.name}</span>
                {item.folderPath && (
                  <FolderOpen className="w-3 h-3 text-rose-400 shrink-0" />
                )}
              </div>
              {item.folderPath && (
                <div className="text-[10px] font-mono-num text-zinc-500 truncate mt-0.5">
                  /{item.folderPath}
                </div>
              )}
              <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                {item.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Show asset details when "Tai thỏ" is selected */}
      {settings.activeEffect === 'bunny-ears' && (
        <div className="p-3.5 bg-zinc-950/90 border border-zinc-800/90 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-200">
              Tệp trong thư mục: /hiệu ứng/tai thỏ/
            </span>
            {customStatus && (
              <span className="text-emerald-400 text-[11px]">{customStatus}</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: 'taitho', file: 'taitho.png', pos: 'Đỉnh đầu', src: '/hieu-ung/tai-tho/taitho.png' },
                { key: 'muitho', file: 'muitho.png', pos: 'Đầu mũi', src: '/hieu-ung/tai-tho/muitho.png' },
                { key: 'rautho', file: 'rautho.png', pos: 'Hai bên má', src: '/hieu-ung/tai-tho/rautho.png' },
              ] as const
            ).map((asset) => (
              <div
                key={asset.key}
                className="flex flex-col items-center p-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-center space-y-1.5"
              >
                <div className="w-full h-11 bg-zinc-950 rounded flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={asset.src}
                    alt={asset.file}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-mono-num text-zinc-200 truncate w-full">
                  {asset.file}
                </span>
                <span className="text-[10px] text-rose-300">{asset.pos}</span>
                <label className="w-full flex items-center justify-center gap-1 py-1 px-1.5 text-[10px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded cursor-pointer transition-colors">
                  <Upload className="w-2.5 h-2.5" />
                  <span>Đổi ảnh</span>
                  <input
                    type="file"
                    accept="image/png,image/webp"
                    onChange={(e) => handleUploadAsset(asset.key, e)}
                    className="sr-only"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {settings.activeEffect !== 'none' && (
        <div className="space-y-4 pt-3 border-t border-zinc-800/80">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="ar-intensity" className="font-medium text-zinc-200">
                Độ rõ hiệu ứng AR
              </label>
              <span className="font-mono-num text-zinc-400">{settings.intensity}%</span>
            </div>
            <input
              id="ar-intensity"
              type="range"
              min={10}
              max={100}
              value={settings.intensity}
              onChange={(e) =>
                onChange({ ...settings, intensity: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="ar-scale" className="font-medium text-zinc-200">
                Kích thước phụ kiện
              </label>
              <span className="font-mono-num text-zinc-400">{settings.scale}%</span>
            </div>
            <input
              id="ar-scale"
              type="range"
              min={70}
              max={135}
              value={settings.scale}
              onChange={(e) =>
                onChange({ ...settings, scale: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
