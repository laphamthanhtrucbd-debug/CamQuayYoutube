export function getVideoDimensions(video: HTMLVideoElement): { width: number; height: number } {
  return {
    width: video.videoWidth || 1280,
    height: video.videoHeight || 720,
  };
}

export function isVideoReady(video: HTMLVideoElement | null): boolean {
  if (!video) return false;
  return video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
}
