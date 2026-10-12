import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { AudioDevice, CameraDevice } from './types/camera';
import {
  AccessoryEffectSettings,
  AllEffectsState,
  AREffectSettings,
  BackgroundEffectSettings,
  CapturedMediaItem,
  ColorFilterSettings,
  EyebrowEffectSettings,
  EyeEffectSettings,
  EyelinerEffectSettings,
  EyeMakeupEffectSettings,
  FaceShapeSettings,
  LipEffectSettings,
  NoseEffectSettings,
  SkinEffectSettings,
  OutfitEffectSettings,
} from './types/effects';
import { cameraManager } from './camera/cameraManager';
import { enumerateAudioDevices, enumerateCameraDevices } from './camera/cameraDevices';
import { captureProcessedPhoto } from './recording/photoCapture';
import { processedVideoRecorder } from './recording/videoRecorder';
import { CameraSelector } from './components/CameraSelector/CameraSelector';
import { CameraPreview } from './components/CameraPreview/CameraPreview';
import { BeautyPanel } from './components/BeautyPanel/BeautyPanel';
import { FacePanel } from './components/FacePanel/FacePanel';
import { EyePanel } from './components/EyePanel/EyePanel';
import { NosePanel } from './components/NosePanel/NosePanel';
import { LipPanel } from './components/LipPanel/LipPanel';
import { EyebrowPanel } from './components/EyebrowPanel/EyebrowPanel';
import { EyeMakeupPanel } from './components/EyeMakeupPanel/EyeMakeupPanel';
import { EyelinerPanel } from './components/EyelinerPanel/EyelinerPanel';
import { ARPanel } from './components/ARPanel/ARPanel';
import { AccessoryPanel } from './components/AccessoryPanel/AccessoryPanel';
import { OutfitPanel } from './components/OutfitPanel/OutfitPanel';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { BackgroundPanel } from './components/BackgroundPanel/BackgroundPanel';
import { RecordPanel } from './components/RecordPanel/RecordPanel';
import { Gallery } from './components/Gallery/Gallery';

const STORAGE_KEY_EFFECTS = 'lumina_studio_saved_effects_v8';

const DEFAULT_OUTFIT_SETTINGS: OutfitEffectSettings = {
  styleId: 'none',
  colorHex: '#DC2626',
  secondaryColorHex: '#F59E0B',
  patternId: 'solid',
  patternIntensity: 60,
  opacity: 100,
  necklineDepth: 0,
  shoulderWidth: 100,
  verticalOffset: 0,
  autoSyncNecklace: true,
};

// Chỉ xóa mụn, xóa khuyết điểm/quầng thâm và tàn nhang mặc định 100%, giữ nguyên 100% khuôn mặt và nền da thật (không làm biến dạng hay bôi bệt mặt)
const DEFAULT_SKIN_SETTINGS: SkinEffectSettings = {
  smooth: 0,
  brighten: 0,
  evenTone: 0,
  acneRemove: 100,
  blemishReduce: 100,
  freckleRemove: 100,
  antiShine: 0,
  soften: 0,
};

// Giữ nguyên 100% hình dáng mắt gốc (enlarge = 0 mặc định)
const DEFAULT_EYE_SETTINGS: EyeEffectSettings = {
  brighten: 10,
  sparkle: 15,
  enlarge: 0,
  underEyeBright: 15,
  clarity: 10,
};

// Giữ nguyên 100% hình dáng mũi gốc (slim = 0, tipRefine = 0, balance = 0 mặc định)
const DEFAULT_NOSE_SETTINGS: NoseEffectSettings = {
  slim: 0,
  tipRefine: 0,
  balance: 0,
};

// Trang điểm môi: độ đậm vừa phải tự nhiên, giữ nguyên 100% dáng môi gốc (plump = 0)
const DEFAULT_LIP_SETTINGS: LipEffectSettings = {
  colorId: 'peach-pink',
  customHex: '#E11D48',
  intensity: 45,
  gloss: 15,
  plump: 0,
  naturalBlend: 60,
};

// Giữ nguyên dáng lông mày gốc (archLift = 0)
const DEFAULT_EYEBROW_SETTINGS: EyebrowEffectSettings = {
  intensity: 0,
  definition: 0,
  colorId: 'dark-brown',
  customHex: '#4A3728',
  archLift: 0,
};

const DEFAULT_EYE_MAKEUP_SETTINGS: EyeMakeupEffectSettings = {
  styleId: 'none',
  customHex: '#F472B6',
  intensity: 65,
  shimmer: 50,
  lensIntensity: 0,
};

const DEFAULT_EYELINER_SETTINGS: EyelinerEffectSettings = {
  styleId: 'none',
  colorId: 'jet-black',
  customHex: '#141416',
  intensity: 80,
  thickness: 55,
  wingLength: 60,
};

// Giữ nguyên 100% cấu trúc khuôn mặt gốc, không tự ý bóp méo mặt!
const DEFAULT_FACE_SHAPE_SETTINGS: FaceShapeSettings = {
  slimFace: 0,
  jawline: 0,
  chin: 0,
  cheekbone: 0,
  balance: 0,
};

const DEFAULT_AR_SETTINGS: AREffectSettings = {
  activeEffect: 'none',
  intensity: 100,
  scale: 100,
};

const DEFAULT_ACCESSORY_SETTINGS: AccessoryEffectSettings = {
  crown: false,
  crownStyle: 'gold-royal',
  earrings: false,
  earringStyle: 'pearl-drop',
  necklace: false,
  necklaceStyle: 'diamond-royal',
  cinnabarMark: false,
  cinnabarStyle: 'lotus-huadian',
  opacity: 100,
  scale: 100,
};

const DEFAULT_FILTER_SETTINGS: ColorFilterSettings = {
  filterId: 'natural',
  intensity: 85,
};

const DEFAULT_BACKGROUND_SETTINGS: BackgroundEffectSettings = {
  mode: 'none',
  blurStrength: 65,
  customImageUrl: '',
};

const INITIAL_EFFECTS_STATE: AllEffectsState = {
  enabled: true,
  compareOriginal: false,
  showLandmarks: false,
  skin: DEFAULT_SKIN_SETTINGS,
  eye: DEFAULT_EYE_SETTINGS,
  nose: DEFAULT_NOSE_SETTINGS,
  lip: DEFAULT_LIP_SETTINGS,
  eyebrow: DEFAULT_EYEBROW_SETTINGS,
  eyeMakeup: DEFAULT_EYE_MAKEUP_SETTINGS,
  eyeliner: DEFAULT_EYELINER_SETTINGS,
  faceShape: DEFAULT_FACE_SHAPE_SETTINGS,
  ar: DEFAULT_AR_SETTINGS,
  accessory: DEFAULT_ACCESSORY_SETTINGS,
  outfit: DEFAULT_OUTFIT_SETTINGS,
  colorFilter: DEFAULT_FILTER_SETTINGS,
  background: DEFAULT_BACKGROUND_SETTINGS,
};

function loadSavedEffectsState(): AllEffectsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EFFECTS);
    if (!raw) return INITIAL_EFFECTS_STATE;
    const parsed = JSON.parse(raw) as Partial<AllEffectsState>;
    return {
      ...INITIAL_EFFECTS_STATE,
      ...parsed,
      compareOriginal: false,
      skin: { ...DEFAULT_SKIN_SETTINGS, ...(parsed.skin || {}) },
      eye: { ...DEFAULT_EYE_SETTINGS, ...(parsed.eye || {}) },
      nose: { ...DEFAULT_NOSE_SETTINGS, ...(parsed.nose || {}) },
      lip: { ...DEFAULT_LIP_SETTINGS, ...(parsed.lip || {}) },
      eyebrow: { ...DEFAULT_EYEBROW_SETTINGS, ...(parsed.eyebrow || {}) },
      eyeMakeup: { ...DEFAULT_EYE_MAKEUP_SETTINGS, ...(parsed.eyeMakeup || {}) },
      eyeliner: { ...DEFAULT_EYELINER_SETTINGS, ...(parsed.eyeliner || {}) },
      faceShape: { ...DEFAULT_FACE_SHAPE_SETTINGS, ...(parsed.faceShape || {}) },
      ar: { ...DEFAULT_AR_SETTINGS, ...(parsed.ar || {}) },
      accessory: { ...DEFAULT_ACCESSORY_SETTINGS, ...(parsed.accessory || {}) },
      outfit: { ...DEFAULT_OUTFIT_SETTINGS, ...(parsed.outfit || {}) },
      colorFilter: { ...DEFAULT_FILTER_SETTINGS, ...(parsed.colorFilter || {}) },
      background: { ...DEFAULT_BACKGROUND_SETTINGS, ...(parsed.background || {}) },
    };
  } catch {
    return INITIAL_EFFECTS_STATE;
  }
}

type MainCategoryTab =
  | 'beauty'
  | 'face'
  | 'makeup'
  | 'outfit'
  | 'accessory'
  | 'ar'
  | 'filter'
  | 'background';
type FaceSubTab = 'contour' | 'eye' | 'nose';
type MakeupSubTab = 'lip' | 'eye-makeup' | 'eyeliner' | 'eyebrow';

export default function App() {
  // Fullscreen Run Mode state (entered via "Chạy" button, exited via Spacebar)
  const [isRunMode, setIsRunMode] = useState<boolean>(false);

  // Camera & Real Hardware Microphone state
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [mics, setMics] = useState<AudioDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('');
  const [activeMicId, setActiveMicId] = useState<string>('');
  const [activeMicLabel, setActiveMicLabel] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Navigation state
  const [activeCategory, setActiveCategory] = useState<MainCategoryTab>('beauty');
  const [faceSubTab, setFaceSubTab] = useState<FaceSubTab>('contour');
  const [makeupSubTab, setMakeupSubTab] = useState<MakeupSubTab>('lip');

  // Effects state — persisted to localStorage and never wipes previous progress!
  const [effects, setEffects] = useState<AllEffectsState>(() => loadSavedEffectsState());
  const previousEffectsSnapshotRef = useRef<AllEffectsState>(effects);

  // Automatically save every effect change to localStorage so progress is never lost
  useEffect(() => {
    previousEffectsSnapshotRef.current = effects;
    try {
      localStorage.setItem(STORAGE_KEY_EFFECTS, JSON.stringify(effects));
    } catch {
      // Ignore storage quota errors
    }
  }, [effects]);

  // Recording & Capture state
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [galleryItems, setGalleryItems] = useState<CapturedMediaItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  }, []);

  const initOrSwitchCamera = useCallback(
    async (preferredCameraId?: string, preferredMicId?: string) => {
      setIsLoadingCamera(true);
      setCameraError(null);
      try {
        const result = await cameraManager.startCamera(preferredCameraId, preferredMicId);
        setStream(result.videoStream);
        setAudioStream(result.audioStream);
        setActiveDeviceId(result.cameraId);
        setActiveMicId(result.micId);
        setActiveMicLabel(result.micLabel);
        setDevices(result.cameras);
        setMics(result.mics);
        setMicError(result.micError);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Không thể mở Camera. Hãy kiểm tra kết nối USB Camera và quyền truy cập trình duyệt.';
        setCameraError(
          `Không thể kết nối Camera thật (${message}). Hãy kiểm tra USB Camera đã cắm đúng và cấp quyền Camera cho trình duyệt.`
        );
      } finally {
        setIsLoadingCamera(false);
      }
    },
    []
  );

  const handleSelectMic = useCallback(
    async (newMicId: string) => {
      const res = await cameraManager.openVerifiedMicrophone(newMicId);
      if (res.stream) {
        res.stream.getAudioTracks().forEach((t) => {
          t.enabled = isMicEnabled;
        });
      }
      setAudioStream(res.stream);
      setActiveMicId(res.micId);
      setActiveMicLabel(res.micLabel);
      if (res.mics.length > 0) setMics(res.mics);
      setMicError(res.error);

      if (res.error) {
        showToast(res.error);
      } else {
        showToast(`Đang thu âm từ thiết bị thật: ${res.micLabel}`);
      }
    },
    [isMicEnabled, showToast]
  );

  const handleToggleMicMute = useCallback(async () => {
    const hasLiveTrack =
      audioStream && audioStream.getAudioTracks().some((t) => t.readyState === 'live');

    if (!hasLiveTrack) {
      const res = await cameraManager.openVerifiedMicrophone(activeMicId || undefined);
      setAudioStream(res.stream);
      setActiveMicId(res.micId);
      setActiveMicLabel(res.micLabel);
      if (res.mics.length > 0) setMics(res.mics);
      setMicError(res.error);

      if (res.error) {
        showToast(res.error);
      } else {
        setIsMicEnabled(true);
        showToast(`Đã kết nối Microphone thật: ${res.micLabel}`);
      }
      return;
    }

    setIsMicEnabled((prev) => {
      const next = !prev;
      if (audioStream) {
        audioStream.getAudioTracks().forEach((t) => {
          t.enabled = next;
        });
      }
      showToast(
        next
          ? `Đã bật thu âm từ: ${activeMicLabel}`
          : `Đã tạm tắt tiếng Microphone (${activeMicLabel}).`
      );
      return next;
    });
  }, [activeMicId, activeMicLabel, audioStream, showToast]);

  const handleRefreshDevices = useCallback(async () => {
    const hasLiveVideo =
      stream && stream.getVideoTracks().some((t) => t.readyState === 'live');

    if (!hasLiveVideo) {
      await initOrSwitchCamera(activeDeviceId || undefined, activeMicId || undefined);
      return;
    }

    const micRes = await cameraManager.openVerifiedMicrophone(activeMicId || undefined);
    const camList = await enumerateCameraDevices();

    setDevices(camList);
    setMics(micRes.mics);
    setAudioStream(micRes.stream);
    setActiveMicId(micRes.micId);
    setActiveMicLabel(micRes.micLabel);
    setMicError(micRes.error);

    if (micRes.error) {
      showToast(micRes.error);
    } else {
      showToast(
        `Đã nhận ${camList.length} Camera & ${micRes.mics.length} Mic thật (Đang dùng: ${micRes.micLabel}).`
      );
    }
  }, [activeDeviceId, activeMicId, initOrSwitchCamera, showToast, stream]);

  useEffect(() => {
    initOrSwitchCamera();

    const handleDeviceChange = () => {
      Promise.all([enumerateCameraDevices(), enumerateAudioDevices()]).then(
        ([camList, micList]) => {
          setDevices(camList);
          setMics(micList);
        }
      );
    };

    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    }

    return () => {
      if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      }
      cameraManager.stopCamera();
    };
  }, [initOrSwitchCamera]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCapturePhoto = async () => {
    if (!processedCanvasRef.current) return;
    try {
      const item = await captureProcessedPhoto(processedCanvasRef.current);
      setGalleryItems((prev) => [item, ...prev]);
      showToast(`Đã chụp ảnh kèm hiệu ứng: ${item.filename}`);
    } catch {
      showToast('Không thể chụp ảnh từ khung hình hiện tại.');
    }
  };

  const handleStartRecording = () => {
    if (!processedCanvasRef.current) return;
    try {
      const activeAudio = isMicEnabled ? audioStream : null;
      const { hasAudio } = processedVideoRecorder.startRecording(
        processedCanvasRef.current,
        activeAudio
      );
      setIsRecording(true);
      if (hasAudio) {
        showToast(`Đang quay video kèm thu âm từ Mic thật: ${activeMicLabel}`);
      } else {
        showToast(
          micError
            ? `Cảnh báo: Đang quay video KHÔNG CÓ TIẾNG vì lỗi Mic (${micError})`
            : 'Đang quay video (Mic đang tắt tiếng).'
        );
      }
    } catch {
      showToast('Trình duyệt không hỗ trợ ghi video từ Canvas.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const item = await processedVideoRecorder.stopRecording();
      setIsRecording(false);
      setGalleryItems((prev) => [item, ...prev]);
      showToast(`Đã lưu video vào thư viện: ${item.filename}`);
    } catch {
      setIsRecording(false);
    }
  };

  // Preserves all previous progress even when "Mặc định / Giữ tiến trình" is clicked!
  const handlePreserveProgressNotice = (sectionName: string) => {
    setEffects((prev) => ({ ...prev }));
    showToast(`Đã giữ nguyên tiến trình đã thiết lập của mục ${sectionName}.`);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Listen for Spacebar (`Space`) to exit Fullscreen Run Mode and restore all toolbars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isRunMode) {
        e.preventDefault();
        setIsRunMode(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunMode]);

  const handleEnterRunMode = useCallback(() => {
    setIsRunMode(true);
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
      {/* 3-Zone Top Bar Contract (Hidden when in Fullscreen Run Mode) */}
      {!isRunMode && (
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/90 bg-zinc-950/90 sticky top-0 z-30">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => e.preventDefault()}
            className="text-xl font-semibold tracking-tight text-zinc-100 font-display whitespace-nowrap"
          >
            Lumina Studio
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => setActiveCategory('beauty')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'beauty' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Làm đẹp
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('face')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'face' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Khuôn mặt
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('makeup')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'makeup' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Trang điểm
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('ar')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'ar' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Hiệu ứng
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('accessory')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'accessory' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Phụ kiện
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('filter')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'filter' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Bộ lọc
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('background')}
              className={`hover:text-zinc-100 transition-colors pb-0.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'background' ? 'text-zinc-100 border-b-2 border-rose-500' : ''
              }`}
            >
              Phông nền
            </button>
          </nav>

          {/* Zone 3: Primary actions including "Chạy" (Full-screen Camera Run Mode) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleEnterRunMode}
              title="Ẩn toàn bộ thanh công cụ và phóng to Camera toàn màn hình (Nhấn Phím Cách / Space để hiện lại)"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Chạy</span>
            </button>
            <button
              type="button"
              onClick={() => setEffects((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                effects.enabled
                  ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-500'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {effects.enabled ? 'Đang bật Beauty' : 'Đã tắt Beauty'}
            </button>
            <button
              type="button"
              onClick={() => handlePreserveProgressNotice('toàn bộ ứng dụng')}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Lưu tiến trình
            </button>
          </div>
        </header>
      )}

      {/* Main Studio Workspace */}
      <main
        className={
          isRunMode
            ? 'fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden'
            : 'flex-1 max-w-[1440px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'
        }
      >
        {/* Left/Center Viewport Column (8 cols on desktop, or full screen in Run Mode) */}
        <div className={isRunMode ? 'w-screen h-screen' : 'lg:col-span-8 space-y-4'}>
          {/* Camera & Microphone Selector Bar (Hidden in Run Mode) */}
          {!isRunMode && (
            <div className="px-4 py-2.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl">
              <CameraSelector
                devices={devices}
                mics={mics}
                activeDeviceId={activeDeviceId}
                activeMicId={activeMicId}
                activeMicLabel={activeMicLabel}
                micError={micError}
                audioStream={audioStream}
                isMicEnabled={isMicEnabled}
                isMirrored={isMirrored}
                isLoading={isLoadingCamera}
                onSelectDevice={(id) => initOrSwitchCamera(id, activeMicId || undefined)}
                onSelectMic={handleSelectMic}
                onToggleMicMute={handleToggleMicMute}
                onRefreshDevices={handleRefreshDevices}
                onToggleMirror={() => setIsMirrored((m) => !m)}
              />
            </div>
          )}

          {/* Real-time Processed Camera Canvas (Always mounted so stream never interrupts!) */}
          <CameraPreview
            stream={stream}
            isMirrored={isMirrored}
            effects={effects}
            cameraError={cameraError}
            isLoadingCamera={isLoadingCamera}
            isRunMode={isRunMode}
            onCanvasReady={(canvas) => {
              processedCanvasRef.current = canvas;
            }}
            onRetryCamera={() => initOrSwitchCamera(activeDeviceId || undefined, activeMicId || undefined)}
          />

          {/* Recording & Photo Capture Dock (Hidden in Run Mode) */}
          {!isRunMode && (
            <RecordPanel
              isRecording={isRecording}
              recordingSeconds={recordingSeconds}
              compareOriginal={effects.compareOriginal}
              showLandmarks={effects.showLandmarks}
              onCapturePhoto={handleCapturePhoto}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onToggleCompare={(active) =>
                setEffects((prev) => ({ ...prev, compareOriginal: active }))
              }
              onToggleLandmarks={() =>
                setEffects((prev) => ({ ...prev, showLandmarks: !prev.showLandmarks }))
              }
            />
          )}

          {/* Captured Photos & Videos Gallery (Hidden in Run Mode) */}
          {!isRunMode && <Gallery items={galleryItems} onDelete={handleDeleteGalleryItem} />}
        </div>

        {/* Right Inspector Sidebar (Hidden in Run Mode) */}
        {!isRunMode && (
          <aside className="lg:col-span-4 bg-zinc-900/75 border border-zinc-800/90 rounded-2xl p-5 space-y-5 lg:sticky lg:top-20">
            {/* Segmented Category Selector (8 tabs) */}
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80">
              {(
                [
                  { id: 'beauty', label: 'Làm đẹp' },
                  { id: 'face', label: 'Khuôn mặt' },
                  { id: 'makeup', label: 'Trang điểm' },
                  { id: 'outfit', label: 'Trang phục' },
                  { id: 'accessory', label: 'Phụ kiện' },
                  { id: 'ar', label: 'Hiệu ứng' },
                  { id: 'filter', label: 'Bộ lọc' },
                  { id: 'background', label: 'Phông nền' },
                ] as { id: MainCategoryTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-colors truncate cursor-pointer text-center ${
                    activeCategory === tab.id
                      ? 'bg-zinc-800 text-rose-300 shadow-xs border border-zinc-700 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-navigation for "Khuôn mặt" */}
            {activeCategory === 'face' && (
              <div className="flex items-center gap-1 p-1 bg-zinc-950/80 rounded-lg border border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setFaceSubTab('contour')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    faceSubTab === 'contour'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Thon mặt & Hàm
                </button>
                <button
                  type="button"
                  onClick={() => setFaceSubTab('eye')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    faceSubTab === 'eye'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Đôi mắt
                </button>
                <button
                  type="button"
                  onClick={() => setFaceSubTab('nose')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    faceSubTab === 'nose'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Dáng mũi
                </button>
              </div>
            )}

            {/* Sub-navigation for "Trang điểm" (Son môi | Màu mắt | Eyeliner | Lông mày) */}
            {activeCategory === 'makeup' && (
              <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950/80 rounded-lg border border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setMakeupSubTab('lip')}
                  className={`py-1.5 px-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    makeupSubTab === 'lip'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Son môi
                </button>
                <button
                  type="button"
                  onClick={() => setMakeupSubTab('eye-makeup')}
                  className={`py-1.5 px-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    makeupSubTab === 'eye-makeup'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Màu mắt
                </button>
                <button
                  type="button"
                  onClick={() => setMakeupSubTab('eyeliner')}
                  className={`py-1.5 px-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    makeupSubTab === 'eyeliner'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Eyeliner
                </button>
                <button
                  type="button"
                  onClick={() => setMakeupSubTab('eyebrow')}
                  className={`py-1.5 px-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    makeupSubTab === 'eyebrow'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Lông mày
                </button>
              </div>
            )}

            {/* Active Control Panel Content — all reset buttons preserve previous progress */}
            <div className="min-h-[380px]">
              {activeCategory === 'beauty' && (
                <BeautyPanel
                  settings={effects.skin}
                  onChange={(skin) => setEffects((prev) => ({ ...prev, skin }))}
                  onReset={() => handlePreserveProgressNotice('Làm đẹp da')}
                />
              )}

              {activeCategory === 'face' && faceSubTab === 'contour' && (
                <FacePanel
                  settings={effects.faceShape}
                  onChange={(faceShape) =>
                    setEffects((prev) => ({ ...prev, faceShape }))
                  }
                  onReset={() => handlePreserveProgressNotice('Khuôn mặt')}
                />
              )}

              {activeCategory === 'face' && faceSubTab === 'eye' && (
                <EyePanel
                  settings={effects.eye}
                  onChange={(eye) => setEffects((prev) => ({ ...prev, eye }))}
                  onReset={() => handlePreserveProgressNotice('Đôi mắt')}
                />
              )}

              {activeCategory === 'face' && faceSubTab === 'nose' && (
                <NosePanel
                  settings={effects.nose}
                  onChange={(nose) => setEffects((prev) => ({ ...prev, nose }))}
                  onReset={() => handlePreserveProgressNotice('Dáng mũi')}
                />
              )}

              {activeCategory === 'makeup' && makeupSubTab === 'lip' && (
                <LipPanel
                  settings={effects.lip}
                  onChange={(lip) => setEffects((prev) => ({ ...prev, lip }))}
                  onReset={() => handlePreserveProgressNotice('Trang điểm môi')}
                />
              )}

              {activeCategory === 'makeup' && makeupSubTab === 'eye-makeup' && (
                <EyeMakeupPanel
                  settings={effects.eyeMakeup}
                  onChange={(eyeMakeup) =>
                    setEffects((prev) => ({ ...prev, eyeMakeup }))
                  }
                  onReset={() => handlePreserveProgressNotice('Trang điểm màu mắt')}
                />
              )}

              {activeCategory === 'makeup' && makeupSubTab === 'eyeliner' && (
                <EyelinerPanel
                  settings={effects.eyeliner}
                  onChange={(eyeliner) =>
                    setEffects((prev) => ({ ...prev, eyeliner }))
                  }
                  onReset={() => handlePreserveProgressNotice('Kẻ mắt Eyeliner')}
                />
              )}

              {activeCategory === 'makeup' && makeupSubTab === 'eyebrow' && (
                <EyebrowPanel
                  settings={effects.eyebrow}
                  onChange={(eyebrow) =>
                    setEffects((prev) => ({ ...prev, eyebrow }))
                  }
                  onReset={() => handlePreserveProgressNotice('Lông mày')}
                />
              )}

              {activeCategory === 'ar' && (
                <ARPanel
                  settings={effects.ar}
                  onChange={(ar) => setEffects((prev) => ({ ...prev, ar }))}
                  onReset={() => handlePreserveProgressNotice('Hiệu ứng AR')}
                />
              )}

              {activeCategory === 'outfit' && (
                <OutfitPanel
                  settings={effects.outfit}
                  onChange={(outfit) => {
                    setEffects((prev) => {
                      const next = { ...prev, outfit };
                      // If autoSyncNecklace is true and outfit has a recommended necklace, auto-suggest or sync
                      if (outfit.styleId === 'ao-dai-gam' && outfit.autoSyncNecklace) {
                        next.accessory = {
                          ...next.accessory,
                          necklace: true,
                          necklaceStyle: 'ao-dai-kieng',
                        };
                      } else if (outfit.styleId === 'dam-da-hoi-offshoulder' && outfit.autoSyncNecklace) {
                        next.accessory = {
                          ...next.accessory,
                          necklace: true,
                          necklaceStyle: 'diamond-royal',
                        };
                      } else if (outfit.styleId === 'dam-co-vuong-vintage' && outfit.autoSyncNecklace) {
                        next.accessory = {
                          ...next.accessory,
                          necklace: true,
                          necklaceStyle: 'ruby-heart-collier',
                        };
                      }
                      return next;
                    });
                  }}
                  onReset={() => handlePreserveProgressNotice('Trang phục')}
                />
              )}

              {activeCategory === 'accessory' && (
                <AccessoryPanel
                  settings={effects.accessory}
                  onChange={(accessory) =>
                    setEffects((prev) => ({ ...prev, accessory }))
                  }
                />
              )}

              {activeCategory === 'filter' && (
                <FilterPanel
                  settings={effects.colorFilter}
                  onChange={(colorFilter) =>
                    setEffects((prev) => ({ ...prev, colorFilter }))
                  }
                  onReset={() => handlePreserveProgressNotice('Bộ lọc màu')}
                />
              )}

              {activeCategory === 'background' && (
                <BackgroundPanel
                  settings={effects.background}
                  onChange={(background) =>
                    setEffects((prev) => ({ ...prev, background }))
                  }
                  onReset={() => handlePreserveProgressNotice('Phông nền')}
                />
              )}
            </div>
          </aside>
        )}
      </main>

      {/* Toast Notification (Hidden in Run Mode) */}
      {!isRunMode && toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-100 rounded-xl shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
