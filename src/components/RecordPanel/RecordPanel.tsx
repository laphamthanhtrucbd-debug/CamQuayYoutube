import React from 'react';
import { Camera, Video, Square, Eye, Sparkles } from 'lucide-react';
import { formatDuration } from '../../utils/browserUtils';

interface RecordPanelProps {
  isRecording: boolean;
  recordingSeconds: number;
  compareOriginal: boolean;
  showLandmarks: boolean;
  onCapturePhoto: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleCompare: (active: boolean) => void;
  onToggleLandmarks: () => void;
}

export const RecordPanel: React.FC<RecordPanelProps> = ({
  isRecording,
  recordingSeconds,
  compareOriginal,
  showLandmarks,
  onCapturePhoto,
  onStartRecording,
  onStopRecording,
  onToggleCompare,
  onToggleLandmarks,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl">
      {/* Left: Landmark & Compare Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onMouseDown={() => onToggleCompare(true)}
          onMouseUp={() => onToggleCompare(false)}
          onMouseLeave={() => onToggleCompare(false)}
          onTouchStart={() => onToggleCompare(true)}
          onTouchEnd={() => onToggleCompare(false)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap select-none cursor-pointer ${
            compareOriginal
              ? 'bg-rose-500 text-white border-rose-400'
              : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Giữ để xem gốc</span>
        </button>

        <button
          type="button"
          onClick={onToggleLandmarks}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
            showLandmarks
              ? 'bg-zinc-800 text-rose-300 border-rose-500/50'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lưới Landmark</span>
        </button>
      </div>

      {/* Center: Primary Capture & Record Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCapturePhoto}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white rounded-xl transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Chụp ảnh</span>
        </button>

        {!isRecording ? (
          <button
            type="button"
            onClick={onStartRecording}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Bắt đầu quay</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStopRecording}
            className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Dừng quay ({formatDuration(recordingSeconds)})</span>
          </button>
        )}
      </div>

      {/* Right: Privacy & Local Processing Note */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-400">
        <span>Xử lý 100% cục bộ trên PC</span>
        <span aria-hidden="true">·</span>
        <span>Lưu kèm toàn bộ hiệu ứng</span>
      </div>
    </div>
  );
};
