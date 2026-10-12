import React from 'react';
import {
  AccessoryEffectSettings,
  CrownStyleId,
  EarringStyleId,
  NecklaceStyleId,
  typeBinduStyleId,
} from '../../types/effects';
import {
  CINNABAR_STYLES,
  CROWN_STYLES,
  EARRING_STYLES,
  NECKLACE_STYLES,
} from '../../effects/accessoryEffect';
import { Crown, Sparkles, Gem, Flame } from 'lucide-react';

interface AccessoryPanelProps {
  settings: AccessoryEffectSettings;
  onChange: (updated: AccessoryEffectSettings) => void;
}

export const AccessoryPanel: React.FC<AccessoryPanelProps> = ({ settings, onChange }) => {
  const toggleItem = (key: 'crown' | 'earrings' | 'necklace' | 'cinnabarMark') => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-zinc-800/80 pb-3">
        <h2 className="text-lg font-semibold text-zinc-100">Phụ kiện & Trang sức</h2>
        <p className="text-xs text-zinc-400">
          Có thể bật kết hợp nhiều phụ kiện cùng lúc (Vương miện, Bông tai, Vòng cổ, Chu sa)
        </p>
      </div>

      {/* 1. Vương miện (Crown) */}
      <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-100">Vương miện (Đỉnh đầu)</span>
          </div>
          <button
            type="button"
            onClick={() => toggleItem('crown')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              settings.crown
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {settings.crown ? 'Đang đeo' : 'Bật'}
          </button>
        </div>
        {settings.crown && (
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {CROWN_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() =>
                  onChange({ ...settings, crownStyle: st.id as CrownStyleId })
                }
                className={`px-3 py-1.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                  settings.crownStyle === st.id
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-medium'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Chu sa giữa 2 đầu lông mày (Cinnabar / Huadian) */}
      <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-zinc-100">
              Chu sa giữa 2 đầu lông mày
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleItem('cinnabarMark')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              settings.cinnabarMark
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {settings.cinnabarMark ? 'Đang bật' : 'Bật'}
          </button>
        </div>
        {settings.cinnabarMark && (
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {CINNABAR_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() =>
                  onChange({ ...settings, cinnabarStyle: st.id as typeBinduStyleId })
                }
                className={`px-3 py-1.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                  settings.cinnabarStyle === st.id
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-medium'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Bông tai (Earrings) */}
      <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-zinc-100">Bông tai (Hai bên tai)</span>
          </div>
          <button
            type="button"
            onClick={() => toggleItem('earrings')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              settings.earrings
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {settings.earrings ? 'Đang đeo' : 'Bật'}
          </button>
        </div>
        {settings.earrings && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 gap-1.5">
              {EARRING_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...settings, earringStyle: st.id as EarringStyleId })
                  }
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors cursor-pointer flex flex-col gap-0.5 ${
                    settings.earringStyle === st.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-medium'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-zinc-100">{st.name}</span>
                  <span className="text-[11px] text-zinc-400">{st.desc}</span>
                </button>
              ))}
            </div>

            {/* Fine tuning controls for earrings */}
            <div className="pt-2 border-t border-zinc-800/60 space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Kích thước bông tai</span>
                  <span className="font-mono-num text-zinc-400">{settings.earringScale ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={180}
                  value={settings.earringScale ?? 100}
                  onChange={(e) =>
                    onChange({ ...settings, earringScale: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Vị trí lên / xuống (Dái tai)</span>
                  <span className="font-mono-num text-zinc-400">
                    {(settings.earringOffsetY ?? 0) > 0 ? `+${settings.earringOffsetY}` : settings.earringOffsetY ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={settings.earringOffsetY ?? 0}
                  onChange={(e) =>
                    onChange({ ...settings, earringOffsetY: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Vị trí trong / ngoài</span>
                  <span className="font-mono-num text-zinc-400">
                    {(settings.earringOffsetX ?? 0) > 0 ? `+${settings.earringOffsetX}` : settings.earringOffsetX ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={settings.earringOffsetX ?? 0}
                  onChange={(e) =>
                    onChange({ ...settings, earringOffsetX: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Vòng cổ (Necklace) */}
      <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-100">Vòng cổ (Dưới cằm)</span>
          </div>
          <button
            type="button"
            onClick={() => toggleItem('necklace')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              settings.necklace
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {settings.necklace ? 'Đang đeo' : 'Bật'}
          </button>
        </div>
        {settings.necklace && (
          <div className="space-y-3 pt-1">
            <div className="text-[11px] font-medium text-amber-400/90 flex items-center gap-1.5 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-800/30">
              <span>✨</span>
              <span>Chọn vòng cổ tương thích theo cổ áo & trang phục đang mặc:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {NECKLACE_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...settings, necklaceStyle: st.id as NecklaceStyleId })
                  }
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors cursor-pointer flex flex-col gap-0.5 ${
                    settings.necklaceStyle === st.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-medium'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100">{st.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-amber-300 font-medium border border-zinc-700/60">
                      {st.outfit}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">{st.desc}</span>
                </button>
              ))}
            </div>

            {/* Fine tuning controls for necklace to match user's real clothing neckline */}
            <div className="pt-2 border-t border-zinc-800/60 space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Độ dài rủ dây chuyền (Khớp cổ áo)</span>
                  <span className="font-mono-num text-zinc-400">{settings.necklaceLength ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={160}
                  value={settings.necklaceLength ?? 100}
                  onChange={(e) =>
                    onChange({ ...settings, necklaceLength: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Độ rộng vòm vòng cổ</span>
                  <span className="font-mono-num text-zinc-400">{settings.necklaceWidth ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={150}
                  value={settings.necklaceWidth ?? 100}
                  onChange={(e) =>
                    onChange({ ...settings, necklaceWidth: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Vị trí nâng lên / hạ xuống</span>
                  <span className="font-mono-num text-zinc-400">
                    {(settings.necklaceOffsetY ?? 0) > 0 ? `+${settings.necklaceOffsetY}` : settings.necklaceOffsetY ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min={-35}
                  max={35}
                  value={settings.necklaceOffsetY ?? 0}
                  onChange={(e) =>
                    onChange({ ...settings, necklaceOffsetY: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size & Opacity Adjustments */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="acc-scale" className="font-medium text-zinc-200">
              Kích thước phụ kiện
            </label>
            <span className="font-mono-num text-zinc-400">{settings.scale}%</span>
          </div>
          <input
            id="acc-scale"
            type="range"
            min={70}
            max={135}
            value={settings.scale}
            onChange={(e) => onChange({ ...settings, scale: Number(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
