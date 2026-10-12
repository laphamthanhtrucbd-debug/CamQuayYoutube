import React, { useState } from 'react';
import { EyeMakeupEffectSettings, EyeMakeupStyleId } from '../../types/effects';
import { EYE_MAKEUP_STYLES } from '../../effects/eyeMakeupEffect';
import { RotateCcw } from 'lucide-react';

interface EyeMakeupPanelProps {
  settings: EyeMakeupEffectSettings;
  onChange: (updated: EyeMakeupEffectSettings) => void;
  onReset: () => void;
}

type RegionFilter = 'Tất cả' | 'Hàn Quốc' | 'Châu Á' | 'Âu Mỹ' | 'Châu Phi';

export const EyeMakeupPanel: React.FC<EyeMakeupPanelProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('Tất cả');

  const filteredStyles = EYE_MAKEUP_STYLES.filter((s) => {
    if (regionFilter === 'Tất cả') return true;
    return s.regionTag === regionFilter || s.id === 'none';
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Phấn mắt (Màu bầu mắt)</h2>
          <p className="text-xs text-zinc-400">
            16 bảng phấn tán trên bầu mí mắt trên Hàn, Á, Âu Mỹ &amp; Châu Phi — không chạm vào con mắt
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

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['Tất cả', 'Hàn Quốc', 'Châu Á', 'Âu Mỹ', 'Châu Phi'] as RegionFilter[]).map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setRegionFilter(reg)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              regionFilter === reg
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* 16 Eye Makeup Styles Grid + Custom Color Picker */}
      <div className="grid grid-cols-2 gap-2 max-h-[245px] overflow-y-auto pr-1">
        {filteredStyles.map((style) => {
          const isSelected = settings.styleId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() =>
                onChange({
                  ...settings,
                  styleId: style.id as EyeMakeupStyleId,
                })
              }
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500/70 text-zinc-100'
                  : 'bg-zinc-950/75 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <span
                className="w-7 h-7 rounded-full border border-white/20 shrink-0"
                style={{ background: style.previewGradient }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold truncate">{style.name}</span>
                  {style.id !== 'none' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                      {style.regionTag}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 truncate">{style.subtitle}</p>
              </div>
            </button>
          );
        })}

        {/* Custom Eyeshadow Color Picker */}
        <label
          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
            settings.styleId === 'custom'
              ? 'bg-rose-500/15 border-rose-500/70 text-zinc-100'
              : 'bg-zinc-950/75 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
          }`}
        >
          <input
            type="color"
            value={settings.customHex || '#E11D48'}
            onChange={(e) =>
              onChange({
                ...settings,
                styleId: 'custom',
                customHex: e.target.value,
              })
            }
            className="w-7 h-7 rounded-full border-0 bg-transparent cursor-pointer shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Màu tự chọn</div>
            <div className="text-[10px] text-zinc-400 font-mono-num uppercase">
              {settings.customHex || '#E11D48'}
            </div>
          </div>
        </label>
      </div>

      {/* Sliders for Eyeshadow Intensity & Shimmer */}
      <div className="space-y-3.5 pt-2 border-t border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="eye-makeup-intensity" className="font-medium text-zinc-200">
              Độ đậm phấn bầu mắt trên
            </label>
            <span className="font-mono-num text-zinc-400">{settings.intensity}%</span>
          </div>
          <input
            id="eye-makeup-intensity"
            type="range"
            min={0}
            max={100}
            value={settings.intensity}
            onChange={(e) =>
              onChange({
                ...settings,
                intensity: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="eye-makeup-shimmer" className="font-medium text-zinc-200">
              Độ sáng nhũ bầu mắt trên
            </label>
            <span className="font-mono-num text-zinc-400">{settings.shimmer}%</span>
          </div>
          <input
            id="eye-makeup-shimmer"
            type="range"
            min={0}
            max={100}
            value={settings.shimmer}
            onChange={(e) =>
              onChange({
                ...settings,
                shimmer: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
