import React from 'react';
import { ColorFilterId, ColorFilterSettings } from '../../types/effects';
import { COLOR_FILTERS } from '../../effects/colorFilter';
import { RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  settings: ColorFilterSettings;
  onChange: (updated: ColorFilterSettings) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ settings, onChange, onReset }) => {
  const handleSelectFilter = (filterId: ColorFilterId) => {
    onChange({
      ...settings,
      filterId,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Bộ lọc màu YouTube</h2>
          <p className="text-xs text-zinc-400">
            Màu sắc trong trẻo, nhẹ nhàng phù hợp quay Vlog & Livestream PC
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Gốc</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {COLOR_FILTERS.map((f) => {
          const isSelected = settings.filterId === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelectFilter(f.id)}
              className={`group flex flex-col items-start p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800 border-rose-500 text-zinc-100'
                  : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <div
                className={`w-full h-10 rounded-lg mb-2 bg-gradient-to-br ${f.previewGradient} border border-white/10`}
              />
              <span className="text-xs font-semibold truncate w-full">{f.name}</span>
              <span className="text-[10px] text-zinc-400 truncate w-full">{f.subtitle}</span>
            </button>
          );
        })}
      </div>

      {settings.filterId !== 'natural' && (
        <div className="space-y-1.5 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="filter-intensity" className="font-medium text-zinc-200">
              Cường độ bộ lọc màu
            </label>
            <span className="font-mono-num text-zinc-400">{settings.intensity}%</span>
          </div>
          <input
            id="filter-intensity"
            type="range"
            min={0}
            max={100}
            value={settings.intensity}
            onChange={(e) =>
              onChange({ ...settings, intensity: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      )}
    </div>
  );
};
