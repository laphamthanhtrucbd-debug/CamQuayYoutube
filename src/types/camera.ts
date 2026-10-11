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
