export interface CameraDevice {
  deviceId: string;
  label: string;
  isUSB: boolean;
  index: number;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
  isUSB: boolean;
  index: number;
}

export interface CameraStreamState {
  stream: MediaStream | null;
  audioStream: MediaStream | null;
  activeDeviceId: string;
  activeMicId: string;
  resolution: { width: number; height: number };
  fps: number;
  error: string | null;
  isLoading: boolean;
  isMirrored: boolean;
}

export type ResolutionPresetId = '720p' | '1080p' | '2k' | '4k' | '8k';

export interface ResolutionPreset {
  id: ResolutionPresetId;
  label: string;
  shortLabel: string;
  width: number;
  height: number;
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  { id: '720p', label: '720p HD (1280×720)', shortLabel: '720p', width: 1280, height: 720 },
  { id: '1080p', label: '1080p Full HD (1920×1080)', shortLabel: '1080p', width: 1920, height: 1080 },
  { id: '2k', label: '2K QHD (2560×1440)', shortLabel: '2K', width: 2560, height: 1440 },
  { id: '4k', label: '4K UHD (3840×2160)', shortLabel: '4K', width: 3840, height: 2160 },
  { id: '8k', label: '8K UHD (7680×4320)', shortLabel: '8K', width: 7680, height: 4320 },
];
