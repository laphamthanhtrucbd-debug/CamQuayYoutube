import React, { useEffect, useState } from 'react';
import { Camera, Mic, MicOff, RefreshCw, FlipHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AudioDevice, CameraDevice } from '../../types/camera';

interface CameraSelectorProps {
  devices: CameraDevice[];
  mics: AudioDevice[];
  activeDeviceId: string;
  activeMicId: string;
  activeMicLabel: string;
  micError: string | null;
  audioStream: MediaStream | null;
  isMicEnabled: boolean;
  isMirrored: boolean;
  isLoading: boolean;
  onSelectDevice: (deviceId: string) => void;
  onSelectMic: (micId: string) => void;
  onToggleMicMute: () => void;
  onRefreshDevices: () => void;
  onToggleMirror: () => void;
}

export const CameraSelector: React.FC<CameraSelectorProps> = ({
  devices,
  mics,
  activeDeviceId,
  activeMicId,
  activeMicLabel,
  micError,
  audioStream,
  isMicEnabled,
  isMirrored,
  isLoading,
  onSelectDevice,
  onSelectMic,
  onToggleMicMute,
  onRefreshDevices,
  onToggleMirror,
}) => {
  const [micLevel, setMicLevel] = useState<number>(0);

  useEffect(() => {
    if (!audioStream || !isMicEnabled) {
      setMicLevel(0);
      return;
    }

    const audioTracks = audioStream.getAudioTracks();
    if (audioTracks.length === 0 || audioTracks[0].readyState !== 'live') {
      setMicLevel(0);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let animId: number;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 90) * 100));
        setMicLevel(normalized);
        animId = requestAnimationFrame(updateMeter);
      };

      animId = requestAnimationFrame(updateMeter);
    } catch {
      setMicLevel(0);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, [audioStream, isMicEnabled]);

  const hasLiveMic =
    !!audioStream &&
    !micError &&
    audioStream.getAudioTracks().some((t) => t.readyState === 'live');

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Real Hardware Status Summary */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 min-w-0">
          <span className="font-semibold text-zinc-100 shrink-0">Thiết bị thật:</span>
          {hasLiveMic ? (
            <span className="text-emerald-400 truncate max-w-[260px]" title={activeMicLabel}>
              Mic: {activeMicLabel}
            </span>
          ) : (
            <span className="text-rose-400 font-medium">
              Chưa kết nối được Microphone thật
            </span>
          )}
        </div>

        {/* Right: Hardware Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Hardware Camera Select */}
          <div className="relative flex items-center">
            <Camera className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Chọn thiết bị Camera thật"
              value={activeDeviceId}
              disabled={isLoading || devices.length === 0}
              onChange={(e) => onSelectDevice(e.target.value)}
              className="pl-8 pr-6 py-1.5 text-xs font-medium bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none focus:border-rose-500 transition-colors max-w-[210px] truncate cursor-pointer disabled:opacity-50"
            >
              {devices.length === 0 ? (
                <option value="">Không tìm thấy Camera thật</option>
              ) : (
                devices.map((dev) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.isUSB ? `[USB] ${dev.label}` : dev.label}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Real Hardware Microphone Select + Live Audio Level Meter */}
          <div
            className={`flex items-center bg-zinc-900/90 border rounded-lg overflow-hidden ${
              micError ? 'border-rose-500/70' : 'border-zinc-800'
            }`}
          >
            <button
              type="button"
              onClick={onToggleMicMute}
              title={
                !hasLiveMic
                  ? 'Nhấn để thử kết nối lại Microphone thật'
                  : isMicEnabled
                  ? `Đang thu âm từ: ${activeMicLabel} (Nhấn để tắt tiếng)`
                  : 'Mic đang tắt tiếng (Nhấn để bật lại)'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border-r border-zinc-800 transition-colors cursor-pointer ${
                hasLiveMic && isMicEnabled
                  ? 'text-emerald-400 hover:bg-zinc-800'
                  : 'text-rose-400 hover:text-zinc-200'
              }`}
            >
              {hasLiveMic && isMicEnabled ? (
                <Mic className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <MicOff className="w-3.5 h-3.5 shrink-0" />
              )}
              <div className="flex items-end gap-0.5 h-3" title="Tín hiệu âm thanh thực tế từ Mic">
                {[10, 26, 46, 68].map((threshold, idx) => {
                  const active = hasLiveMic && isMicEnabled && micLevel >= threshold;
                  const heights = ['h-1.5', 'h-2', 'h-2.5', 'h-3'];
                  return (
                    <span
                      key={idx}
                      className={`w-0.5 rounded-full transition-colors ${heights[idx]} ${
                        active ? 'bg-emerald-400' : 'bg-zinc-700'
                      }`}
                    />
                  );
                })}
              </div>
            </button>

            <select
              aria-label="Chọn thiết bị Microphone thật"
              value={activeMicId}
              disabled={isLoading || mics.length === 0}
              onChange={(e) => onSelectMic(e.target.value)}
              className="pl-2 pr-6 py-1.5 text-xs font-medium bg-transparent text-zinc-100 focus:outline-none max-w-[215px] truncate cursor-pointer disabled:opacity-60"
            >
              {mics.length === 0 ? (
                <option value="" className="bg-zinc-900 text-rose-400">
                  Lỗi: Không đọc được thiết bị Mic thật
                </option>
              ) : (
                mics.map((mic) => (
                  <option
                    key={mic.deviceId}
                    value={mic.deviceId}
                    className="bg-zinc-900 text-zinc-100"
                  >
                    {mic.isUSB ? `[USB] ${mic.label}` : mic.label}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Hardware Noise Suppression Active Indicator */}
          <div
            title="Đang bật tính năng Lọc tiếng ồn phần cứng (Hardware Noise Suppression & Echo Cancellation) mượt mà, không gây giật âm thanh."
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border bg-emerald-950/40 text-emerald-300 border-emerald-600/50 select-none cursor-default"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Lọc ồn chuẩn</span>
          </div>

          {/* Refresh hardware list */}
          <button
            type="button"
            onClick={onRefreshDevices}
            title="Quét lại thiết bị Camera & Microphone thật trên máy tính"
            className="p-1.5 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
          </button>

          {/* Mirror toggle */}
          <button
            type="button"
            onClick={onToggleMirror}
            title="Lật gương khung hình ngang"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              isMirrored
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Lật gương</span>
          </button>
        </div>
      </div>

      {/* Explicit Hardware Microphone Error Banner if Mic cannot be read */}
      {micError && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-rose-950/60 border border-rose-500/50 rounded-lg text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{micError}</span>
          </div>
          <button
            type="button"
            onClick={onRefreshDevices}
            className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-md shrink-0 cursor-pointer"
          >
            Cấp quyền & Thử lại Mic
          </button>
        </div>
      )}
    </div>
  );
};
