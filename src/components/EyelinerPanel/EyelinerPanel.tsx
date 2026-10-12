import React, { useState } from 'react';
import {
  EyelinerColorId,
  EyelinerEffectSettings,
  EyelinerStyleId,
} from '../../types/effects';
import { EYELINER_COLORS, EYELINER_STYLES } from '../../effects/eyelinerEffect';
import { RotateCcw } from 'lucide-react';

interface EyelinerPanelProps {
  settings: EyelinerEffectSettings;
  onChange: (updated: EyelinerEffectSettings) => void;
  onReset: () => void;
}

type RegionFilter = 'Tất cả' | 'Hàn Quốc' | 'Châu Á' | 'Âu Mỹ' | 'Châu Phi';

export const EyelinerPanel: React.FC<EyelinerPanelProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('Tất cả');

  const filteredStyles = EYELINER_STYLES.filter((s) => {
    if (regionFilter === 'Tất cả') return true;
    return s.regionTag === regionFilter || s.id === 'none';
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Kẻ mắt (Eyeliner)</h2>
          <p className="text-xs text-zinc-400">
            16 kiểu kẻ mắt thông dụng Hàn, Á, Âu Mỹ &amp; Phi Châu bám sát đường chân mi
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

      {/* Region Filter */}
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

      {/* 16 Eyeliner Styles Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[210px] overflow-y-auto pr-1">
        {filteredStyles.map((style) => {
          const isSelected = settings.styleId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() =>
                onChange({
                  ...settings,
                  styleId: style.id as EyelinerStyleId,
                })
              }
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500/70 text-zinc-100'
                  : 'bg-zinc-950/75 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold truncate">{style.name}</span>
                {style.id !== 'none' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                    {style.regionTag}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">{style.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Eyeliner Color Swatches + Custom Picker */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
        <span className="text-xs font-medium text-zinc-200">Màu mực kẻ mắt</span>
        <div className="flex items-center gap-2 flex-wrap">
          {EYELINER_COLORS.map((c) => {
            const active = settings.colorId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...settings,
                    colorId: c.id as EyelinerColorId,
                  })
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                  active
                    ? 'bg-rose-500/20 border-rose-500 text-zinc-100'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/25"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}

          <label
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
              settings.colorId === 'custom'
                ? 'bg-rose-500/20 border-rose-500 text-zinc-100'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <input
              type="color"
              value={settings.customHex || '#141416'}
              onChange={(e) =>
                onChange({
                  ...settings,
                  colorId: 'custom',
                  customHex: e.target.value,
                })
              }
              className="w-4 h-4 rounded-full border-0 bg-transparent cursor-pointer"
            />
            <span>Tự chọn</span>
          </label>
        </div>
      </div>

      {/* Sliders for Intensity, Thickness & Wing Length */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="eyeliner-intensity" className="font-medium text-zinc-200">
              Độ đậm đường kẻ
            </label>
            <span className="font-mono-num text-zinc-400">{settings.intensity}%</span>
          </div>
          <input
            id="eyeliner-intensity"
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
            <label htmlFor="eyeliner-thickness" className="font-medium text-zinc-200">
              Độ mảnh / dày nét vẽ
            </label>
            <span className="font-mono-num text-zinc-400">{settings.thickness}%</span>
          </div>
          <input
            id="eyeliner-thickness"
            type="range"
            min={20}
            max={100}
            value={settings.thickness}
            onChange={(e) =>
              onChange({
                ...settings,
                thickness: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="eyeliner-wing" className="font-medium text-zinc-200">
              Độ dài đuôi mắt (Wing)
            </label>
            <span className="font-mono-num text-zinc-400">{settings.wingLength}%</span>
          </div>
          <input
            id="eyeliner-wing"
            type="range"
            min={20}
            max={100}
            value={settings.wingLength}
            onChange={(e) =>
              onChange({
                ...settings,
                wingLength: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
