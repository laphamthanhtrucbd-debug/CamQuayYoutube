import { AudioDevice, CameraDevice } from '../types/camera';
import {
  enumerateAudioDevices,
  enumerateCameraDevices,
  selectPreferredDefaultCamera,
  selectPreferredDefaultMic,
} from './cameraDevices';
import { cleanAudioStream } from '../utils/audioCleaner';

export class CameraManager {
  private currentVideoStream: MediaStream | null = null;
  private currentAudioStream: MediaStream | null = null;
  private activeCameraId: string = '';
  private activeMicId: string = '';
  private activeMicLabel: string = '';

  public async startCamera(
    cameraDeviceId?: string,
    micDeviceId?: string
  ): Promise<{
    videoStream: MediaStream;
    audioStream: MediaStream | null;
    cameraId: string;
    micId: string;
    micLabel: string;
    cameras: CameraDevice[];
    mics: AudioDevice[];
    width: number;
    height: number;
    micError: string | null;
  }> {
    this.stopVideoStream();
    // Small hardware release delay for Windows USB UVC drivers when switching cameras
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Helper to try opening a specific camera (or default) with progressive resolution fallbacks
    const tryOpenVideoDevice = async (deviceId?: string): Promise<MediaStream> => {
      const constraintAttempts: MediaStreamConstraints[] = deviceId
        ? [
            // Attempt 1: HD 720p with exact deviceId
            {
              video: {
                deviceId: { exact: deviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            },
            // Attempt 2: Standard VGA 480p with exact deviceId (many USB webcams require 640x480)
            {
              video: {
                deviceId: { exact: deviceId },
                width: { ideal: 640 },
                height: { ideal: 480 },
              },
              audio: false,
            },
            // Attempt 3: Pure native hardware mode with exact deviceId (no width/height/fps limits)
            {
              video: {
                deviceId: { exact: deviceId },
              },
              audio: false,
            },
          ]
        : [
            {
              video: { width: { ideal: 1280 }, height: { ideal: 720 } },
              audio: false,
            },
            {
              video: true,
              audio: false,
            },
          ];

      let lastErr: unknown = null;
      for (const constraints of constraintAttempts) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack && videoTrack.readyState === 'live') {
            return stream;
          }
          stream.getTracks().forEach((t) => t.stop());
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr || new Error('Không thể khởi tạo luồng hình ảnh từ Camera.');
    };

    // 1. Enumerate known cameras first
    let cameras = await enumerateCameraDevices();
    let targetCameraId = cameraDeviceId;

    if (!targetCameraId && cameras.length > 0 && cameras[0].label) {
      const preferredCam = selectPreferredDefaultCamera(cameras);
      targetCameraId = preferredCam?.deviceId || cameras[0].deviceId;
    }

    let videoStream: MediaStream | null = null;
    let lastOpenError: unknown = null;

    // 2. Try opening the target camera
    try {
      videoStream = await tryOpenVideoDevice(targetCameraId);
    } catch (err) {
      lastOpenError = err;
    }

    // 3. If target camera failed, try other available physical cameras as robust fallback
    cameras = await enumerateCameraDevices();

    if (!videoStream) {
      const orderedCandidates = [...cameras].sort((a, b) => {
        if (a.isUSB !== b.isUSB) return a.isUSB ? -1 : 1;
        return a.index - b.index;
      });

      for (const cam of orderedCandidates) {
        if (cam.deviceId === targetCameraId) continue;
        try {
          videoStream = await tryOpenVideoDevice(cam.deviceId);
          targetCameraId = cam.deviceId;
          break;
        } catch (err) {
          lastOpenError = err;
        }
      }
    }

    // 4. Final fallback: bare `{ video: true }`
    if (!videoStream) {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (err) {
        lastOpenError = err;
      }
    }

    if (!videoStream) {
      if (lastOpenError instanceof DOMException) {
        if (lastOpenError.name === 'NotReadableError' || lastOpenError.name === 'TrackStartError') {
          throw new Error(
            'Camera đang bị phần mềm khác chiếm giữ độc quyền (NotReadableError). Hãy ĐÓNG ứng dụng khác đang dùng Camera rồi thử lại.'
          );
        }
        if (lastOpenError.name === 'NotAllowedError' || lastOpenError.name === 'PermissionDeniedError') {
          throw new Error(
            'Trình duyệt đang chặn quyền truy cập Camera. Hãy cấp quyền Camera trên thanh địa chỉ.'
          );
        }
      }
      throw lastOpenError instanceof Error
        ? lastOpenError
        : new Error('Không thể mở thiết bị Camera đã chọn.');
    }

    // If no specific camera was requested and a non-preferred camera was opened initially,
    // check if a better real USB camera is now visible and switch to it cleanly.
    const initialTrack = videoStream.getVideoTracks()[0];
    const initialSettings = initialTrack ? initialTrack.getSettings() : {};
    const openedId = initialSettings.deviceId || targetCameraId || '';

    if (!cameraDeviceId && cameras.length > 1) {
      const preferred = selectPreferredDefaultCamera(cameras);
      if (preferred && preferred.deviceId !== openedId) {
        try {
          videoStream.getTracks().forEach((t) => t.stop());
          await new Promise((r) => setTimeout(r, 60));
          videoStream = await tryOpenVideoDevice(preferred.deviceId);
        } catch {
          // Reopen previous working camera if preferred USB camera is busy
          videoStream = await tryOpenVideoDevice(openedId || undefined);
        }
      }
    }

    this.currentVideoStream = videoStream;
    const videoTrack = videoStream.getVideoTracks()[0];
    const videoSettings = videoTrack ? videoTrack.getSettings() : {};
    const resolvedCameraId =
      videoSettings.deviceId ||
      cameras.find((c) => c.label === videoTrack?.label)?.deviceId ||
      targetCameraId ||
      cameras[0]?.deviceId ||
      '';
    this.activeCameraId = resolvedCameraId;

    // 5. Open Real Hardware Microphone and verify true hardware track label
    const micResult = await this.openVerifiedMicrophone(micDeviceId || this.activeMicId);

    const [refreshedCameras, refreshedMics] = await Promise.all([
      enumerateCameraDevices(),
      enumerateAudioDevices(),
    ]);

    return {
      videoStream,
      audioStream: micResult.stream,
      cameraId: resolvedCameraId,
      micId: this.activeMicId,
      micLabel: this.activeMicLabel,
      cameras: refreshedCameras,
      mics: refreshedMics,
      width: videoSettings.width || 1280,
      height: videoSettings.height || 720,
      micError: micResult.error,
    };
  }

  /**
   * Opens a real hardware microphone stream and verifies that the browser/OS
   * actually granted access and exposed the real hardware device name.
   * Never returns a fake or silent placeholder!
   */
  public async openVerifiedMicrophone(requestedMicId?: string): Promise<{
    stream: MediaStream | null;
    micId: string;
    micLabel: string;
    mics: AudioDevice[];
    error: string | null;
  }> {
    this.stopAudioStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        stream: null,
        micId: '',
        micLabel: '',
        mics: [],
        error: 'Trình duyệt này không hỗ trợ truy cập phần cứng Microphone (MediaDevices API).',
      };
    }

    try {
      // 1. Enumerate available audioinput devices
      let mics = await enumerateAudioDevices();

      // If user requested a specific micId, use it. If not, pick preferred default mic.
      let targetId = requestedMicId;
      if (!targetId && mics.length > 0 && mics[0].label) {
        targetId = selectPreferredDefaultMic(mics)?.deviceId || mics[0].deviceId;
      }

      let rawStream: MediaStream | null = null;
      let micError: unknown = null;

      if (targetId) {
        try {
          rawStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              deviceId: { exact: targetId },
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
              channelCount: 1,
            },
          });
        } catch (err) {
          micError = err;
        }
      }

      if (!rawStream) {
        try {
          rawStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
        } catch (err) {
          micError = err;
        }
      }

      if (!rawStream) {
        throw micError || new Error('Không thể mở thiết bị Microphone.');
      }

      // Check live track on raw stream
      const rawAudioTracks = rawStream.getAudioTracks();
      if (rawAudioTracks.length === 0 || rawAudioTracks[0].readyState !== 'live') {
        rawStream.getTracks().forEach((t) => t.stop());
        return {
          stream: null,
          micId: '',
          micLabel: '',
          mics: [],
          error: 'Không đọc được tín hiệu từ thiết bị Microphone (Track âm thanh không hoạt động).',
        };
      }

      const rawTrack = rawAudioTracks[0];
      const settings = rawTrack.getSettings();

      // Re-enumerate devices now that getUserMedia has unlocked true OS hardware labels
      mics = await enumerateAudioDevices();
      const realHardwareMics = mics.filter((m) => m.deviceId && m.label);

      // Determine true resolved ID and Label
      const resolvedId =
        (targetId && realHardwareMics.some((m) => m.deviceId === targetId) ? targetId : null) ||
        settings.deviceId ||
        realHardwareMics.find((m) => m.label === rawTrack.label)?.deviceId ||
        realHardwareMics[0]?.deviceId ||
        '';

      const matchedDevice = realHardwareMics.find((m) => m.deviceId === resolvedId);
      const resolvedLabel =
        matchedDevice?.label ||
        rawTrack.label ||
        realHardwareMics[0]?.label ||
        '';

      if (!resolvedLabel) {
        rawStream.getTracks().forEach((t) => t.stop());
        return {
          stream: null,
          micId: '',
          micLabel: '',
          mics: [],
          error: 'Trình duyệt không trả về tên thiết bị Microphone thật. Hãy kiểm tra quyền Microphone trong cài đặt trình duyệt.',
        };
      }

      // Clean audio stream: removes static, crackling ("rè rè"), and rumble without distortion or clipping
      const cleanedStream = cleanAudioStream(rawStream);

      this.currentAudioStream = cleanedStream;
      this.activeMicId = resolvedId;
      this.activeMicLabel = resolvedLabel;

      return {
        stream: cleanedStream,
        micId: resolvedId,
        micLabel: resolvedLabel,
        mics: realHardwareMics,
        error: null,
      };
    } catch (err: unknown) {
      this.currentAudioStream = null;
      this.activeMicId = '';
      this.activeMicLabel = '';

      let errorReason = 'Không thể đọc thiết bị Microphone thật trên máy tính.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorReason =
            'Lỗi Microphone: Quyền truy cập Microphone bị từ chối (NotAllowedError). Vui lòng cấp quyền Microphone trên thanh địa chỉ trình duyệt.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorReason =
            'Lỗi Microphone: Không tìm thấy bất kỳ thiết bị Microphone phần cứng nào đang cắm trên máy tính (NotFoundError).';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorReason =
            'Lỗi Microphone: Thiết bị Microphone đang bị phần mềm khác chiếm quyền sử dụng hoặc lỗi phần cứng (NotReadableError).';
        } else {
          errorReason = `Lỗi Microphone (${err.name}): ${err.message}`;
        }
      }

      return {
        stream: null,
        micId: '',
        micLabel: '',
        mics: [],
        error: errorReason,
      };
    }
  }

  public stopVideoStream(): void {
    if (this.currentVideoStream) {
      this.currentVideoStream.getTracks().forEach((track) => track.stop());
      this.currentVideoStream = null;
    }
  }

  public stopAudioStream(): void {
    if (this.currentAudioStream) {
      this.currentAudioStream.getTracks().forEach((track) => track.stop());
      this.currentAudioStream = null;
    }
  }

  public stopCamera(): void {
    this.stopVideoStream();
    this.stopAudioStream();
  }

  public getStream(): MediaStream | null {
    return this.currentVideoStream;
  }

  public getAudioStream(): MediaStream | null {
    return this.currentAudioStream;
  }

  public getActiveDeviceId(): string {
    return this.activeCameraId;
  }

  public getActiveMicId(): string {
    return this.activeMicId;
  }

  public getActiveMicLabel(): string {
    return this.activeMicLabel;
  }
}

export const cameraManager = new CameraManager();
