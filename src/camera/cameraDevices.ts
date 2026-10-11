import { AudioDevice, CameraDevice } from '../types/camera';

function isExternalOrUSBLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return (
    lower.includes('usb') ||
    lower.includes('uvc') ||
    lower.includes('webcam') ||
    lower.includes('logitech') ||
    lower.includes('elgato') ||
    lower.includes('razer') ||
    lower.includes('sony') ||
    lower.includes('canon') ||
    lower.includes('cam link') ||
    lower.includes('blue') ||
    lower.includes('hyperx') ||
    lower.includes('rode') ||
    lower.includes('shure') ||
    lower.includes('fifine') ||
    lower.includes('maono') ||
    lower.includes('external')
  );
}

export async function enumerateCameraDevices(): Promise<CameraDevice[]> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');

  return videoInputs
    .filter((d) => d.deviceId)
    .map((device, idx) => {
      const rawLabel = device.label.trim();
      return {
        deviceId: device.deviceId,
        label: rawLabel || `Thiết bị Camera (${device.deviceId.slice(0, 6)})`,
        isUSB: isExternalOrUSBLabel(rawLabel),
        index: idx + 1,
      };
    });
}

/**
 * Only returns real hardware audioinput devices that have a valid deviceId and hardware label
 * provided by the operating system. Never invents fake "Microphone #1" names.
 */
export async function enumerateAudioDevices(): Promise<AudioDevice[]> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  const audioInputs = allDevices.filter((d) => d.kind === 'audioinput');

  return audioInputs
    .filter((device) => device.deviceId && device.label.trim().length > 0)
    .map((device, idx) => {
      const rawLabel = device.label.trim();
      return {
        deviceId: device.deviceId,
        label: rawLabel,
        isUSB: isExternalOrUSBLabel(rawLabel),
        index: idx + 1,
      };
    });
}

function isVirtualCameraLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return (
    lower.includes('virtual') ||
    lower.includes('obs') ||
    lower.includes('manycam') ||
    lower.includes('snap camera') ||
    lower.includes('xsplit') ||
    lower.includes('droidcam') ||
    lower.includes('iriun') ||
    lower.includes('epoccam') ||
    lower.includes('vcam') ||
    lower.includes('SplitCam'.toLowerCase()) ||
    lower.includes('cyberlink') ||
    lower.includes('nvidia broadcast')
  );
}

export function selectPreferredDefaultCamera(devices: CameraDevice[]): CameraDevice | undefined {
  if (devices.length === 0) return undefined;
  // 1. Prefer real USB / external hardware camera that is NOT a virtual camera
  const realUsbCam = devices.find((d) => d.isUSB && !isVirtualCameraLabel(d.label));
  if (realUsbCam) return realUsbCam;

  // 2. Next prefer any physical camera that is NOT a virtual camera
  const physicalCam = devices.find((d) => !isVirtualCameraLabel(d.label));
  if (physicalCam) return physicalCam;

  // 3. Fallback to first available camera
  return devices[0];
}

export function selectPreferredDefaultMic(devices: AudioDevice[]): AudioDevice | undefined {
  if (devices.length === 0) return undefined;
  const usbMic = devices.find((d) => d.isUSB);
  return usbMic || devices[0];
}
