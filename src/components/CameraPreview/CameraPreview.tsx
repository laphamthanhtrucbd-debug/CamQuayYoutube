import React, { useEffect, useRef, useState } from 'react';
import { AllEffectsState } from '../../types/effects';
import { NormalizedLandmark } from '../../types/face';
import { faceLandmarkerService } from '../../face/faceLandmarker';
import { faceTracker } from '../../face/faceTracking';
import { applySkinEffect } from '../../effects/skinEffect';
import { applyFaceShapeEffect } from '../../effects/faceShapeEffect';
import { applyNoseEffect } from '../../effects/noseEffect';
import { applyEyeEffect } from '../../effects/eyeEffect';
import { applyLipEffect } from '../../effects/lipEffect';
import { applyEyebrowEffect } from '../../effects/eyebrowEffect';
import { applyEyeMakeupEffect } from '../../effects/eyeMakeupEffect';
import { applyEyelinerEffect } from '../../effects/eyelinerEffect';
import { applyAREffect } from '../../effects/arEffect';
import { applyAccessoryEffect } from '../../effects/accessoryEffect';
import { applyOutfitEffect } from '../../effects/outfitEffect';
import { applyBackgroundEffect } from '../../effects/backgroundEffect';
import { applyColorFilterOverlay, getCanvasFilterString } from '../../effects/colorFilter';
import { isVideoReady } from '../../utils/videoUtils';
import { AlertCircle, Camera } from 'lucide-react';

interface CameraPreviewProps {
  stream: MediaStream | null;
  isMirrored: boolean;
  effects: AllEffectsState;
  cameraError: string | null;
  isLoadingCamera: boolean;
  isRunMode?: boolean;
  activeHardwareResolution?: { width: number; height: number };
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onRetryCamera: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  stream,
  isMirrored,
  effects,
  cameraError,
  isLoadingCamera,
  isRunMode = false,
  activeHardwareResolution,
  onCanvasReady,
  onRetryCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const workCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const effectsRef = useRef<AllEffectsState>(effects);
  effectsRef.current = effects;

  const mirroredRef = useRef<boolean>(isMirrored);
  mirroredRef.current = isMirrored;

  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [landmarkerReady, setLandmarkerReady] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(30);

  // Initialize MediaPipe FaceLandmarker once on mount
  useEffect(() => {
    let mounted = true;
    faceLandmarkerService
      .initialize()
      .then(() => {
        if (mounted) setLandmarkerReady(true);
      })
      .catch(() => {
        if (mounted) setLandmarkerReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Bind incoming real MediaStream to hidden video element
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (stream) {
      videoEl.srcObject = stream;
      const playVideo = () => {
        videoEl.play().catch(() => {
          // Retry on next animation frame if needed
        });
      };
      videoEl.onloadedmetadata = playVideo;
      videoEl.onloadeddata = playVideo;
      playVideo();
    } else {
      videoEl.onloadedmetadata = null;
      videoEl.onloadeddata = null;
      videoEl.srcObject = null;
    }
  }, [stream]);

  // Expose output canvas ref to parent for photo capture & video recording
  useEffect(() => {
    if (outputCanvasRef.current) {
      onCanvasReady(outputCanvasRef.current);
    }
  }, [onCanvasReady]);

  // Main real-time processing loop
  useEffect(() => {
    let animationFrameId: number;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let lastFaceStatus = false;

    let lastDetectionTime = 0;
    let cachedLandmarks: NormalizedLandmark[] | null = null;

    const renderLoop = (now: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const video = videoRef.current;
      const outCanvas = outputCanvasRef.current;
      if (!video || !outCanvas) {
        return;
      }

      if (video.paused && video.srcObject) {
        video.play().catch(() => {});
      }

      if (!isVideoReady(video)) {
        return;
      }

      const trackSettings = stream?.getVideoTracks()[0]?.getSettings() || {};
      const rawW = activeHardwareResolution?.width || trackSettings.width || video.videoWidth || 1280;
      const rawH = activeHardwareResolution?.height || trackSettings.height || video.videoHeight || 720;

      // Cap processing working canvas at Full HD for ultra-smooth 60 FPS zero-lag performance during fast motion,
      // while displaying pristine high-resolution output on the screen.
      const maxProcW = 1920;
      const scaleDown = rawW > maxProcW ? maxProcW / rawW : 1.0;
      const width = Math.round(rawW * scaleDown);
      const height = Math.round(rawH * scaleDown);

      if (outCanvas.width !== rawW || outCanvas.height !== rawH) {
        outCanvas.width = rawW;
        outCanvas.height = rawH;
      }

      if (!workCanvasRef.current) {
        workCanvasRef.current = document.createElement('canvas');
      }
      const workCanvas = workCanvasRef.current;
      if (workCanvas.width !== width || workCanvas.height !== height) {
        workCanvas.width = width;
        workCanvas.height = height;
      }

      const outCtx = outCanvas.getContext('2d');
      const workCtx = workCanvas.getContext('2d');
      if (!outCtx || !workCtx) return;

      const currentEffects = effectsRef.current;
      const mirrored = mirroredRef.current;

      // Step 1: Draw base camera frame onto workCanvas (mirrored if enabled)
      workCtx.save();
      if (mirrored) {
        workCtx.translate(width, 0);
        workCtx.scale(-1, 1);
      }
      if (currentEffects.enabled && !currentEffects.compareOriginal) {
        workCtx.filter = getCanvasFilterString(currentEffects.colorFilter);
      } else {
        workCtx.filter = 'none';
      }
      workCtx.drawImage(video, 0, 0, width, height);
      workCtx.restore();

      // Draw processed workCanvas smoothly to high-res output canvas
      outCtx.save();
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = 'high';
      outCtx.drawImage(workCanvas, 0, 0, width, height, 0, 0, rawW, rawH);
      outCtx.restore();

      // Step 2: Detect real face landmarks throttled to 30 FPS (every 32ms) to guarantee 60 FPS buttery-smooth canvas rendering without any micro-stutters
      let rawLandmarks = cachedLandmarks;
      if (now - lastDetectionTime >= 32) {
        lastDetectionTime = now;
        rawLandmarks = faceLandmarkerService.detect(video, now);
        cachedLandmarks = rawLandmarks;
      }
      const regions = faceTracker.update(rawLandmarks, width, height, mirrored);

      const hasFace = !!regions;
      if (hasFace !== lastFaceStatus) {
        lastFaceStatus = hasFace;
        setFaceDetected(hasFace);
      }

      // Step 3: Apply all modular beauty & AR effects when enabled and not holding "Compare Original"
      if (currentEffects.enabled && !currentEffects.compareOriginal) {
        // 3.0 Virtual Background / Portrait Bokeh Replacement (keeps person, neck & arms sharp)
        if (currentEffects.background && currentEffects.background.mode !== 'none') {
          applyBackgroundEffect(outCtx, workCanvas, regions, currentEffects.background, now);
        }

        if (regions) {
          // 3.1 Skin beauty across Face + Neck + Chest + Shoulders + Arms
          applySkinEffect(outCtx, workCanvas, regions, currentEffects.skin);

          // 3.2 Face shape (slim face, jawline, chin, cheekbone, balance - reads local ROI directly from outCtx)
          applyFaceShapeEffect(outCtx, outCanvas, regions, currentEffects.faceShape);

          // 3.3 Nose refinement (slim, tip refine, bridge balance)
          applyNoseEffect(outCtx, outCanvas, regions, currentEffects.nose);

          // 3.4 Eye beauty (enlarge, under-eye bright, brighten, clarity, catchlight sparkle)
          applyEyeEffect(outCtx, outCanvas, regions, currentEffects.eye);

          // 3.5 Eye Makeup (16 global eyeshadow styles strictly on the upper eyelid — 100% iris protected)
          if (currentEffects.eyeMakeup) {
            applyEyeMakeupEffect(outCtx, regions, currentEffects.eyeMakeup);
          }

          // 3.6 Eyeliner (16 global eyeliner styles anchored to upper lashline)
          if (currentEffects.eyeliner) {
            applyEyelinerEffect(outCtx, regions, currentEffects.eyeliner);
          }

          // 3.7 Lip makeup (plump, lipstick color, gloss, natural blend)
          applyLipEffect(outCtx, outCanvas, regions, currentEffects.lip);

          // 3.8 Eyebrow grooming (intensity, definition, color, arch lift)
          applyEyebrowEffect(outCtx, outCanvas, regions, currentEffects.eyebrow);

          // 3.9 AR Filter accessories (bunny ears, cat ears, flowers, hearts, stars, sparkle, soft light)
          applyAREffect(outCtx, regions, currentEffects.ar, now);

          // 3.10 Realistic Outfits & Wardrobe (Áo dài, đầm dạ hội, sơ mi, blazer, áo thun, hoodie...)
          if (currentEffects.outfit) {
            applyOutfitEffect(outCtx, regions, currentEffects.outfit);
          }

          // 3.11 Jewelry & Royal Accessories (Crown, Earrings, Necklace, Cinnabar Glabella Mark)
          applyAccessoryEffect(outCtx, regions, currentEffects.accessory);
        }

        // 3.11 Color grading filter overlay (including Vibrant Oil Painting & Black-and-White)
        applyColorFilterOverlay(outCtx, width, height, currentEffects.colorFilter);
      }

      // Step 4: Optional landmark mesh visualization
      if (currentEffects.showLandmarks && regions) {
        faceTracker.drawDebugLandmarks(outCtx, regions);
      }

      // Update FPS counter smoothly
      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastFpsUpdate))));
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={
        isRunMode
          ? 'fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden flex items-center justify-center'
          : 'relative w-full aspect-video bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl'
      }
    >
      {/* Offscreen active video element (kept 1x1px opacity-0 instead of display:none so browsers never suspend USB hardware decoding) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute w-px h-px opacity-0 pointer-events-none -z-10"
      />

      {/* Processed Real-time Output Canvas */}
      <canvas
        ref={outputCanvasRef}
        className={
          isRunMode
            ? 'w-screen h-screen object-cover bg-black'
            : 'w-full h-full object-contain bg-black'
        }
      />

      {/* Subtle Top-Left Live Status Overlay (Hidden when in Fullscreen Run Mode!) */}
      {!isRunMode && stream && !cameraError && (
        <div className="absolute top-3.5 left-4 px-3 py-1.5 rounded-lg bg-gradient-to-r from-black/75 via-black/60 to-transparent flex items-center gap-2 text-xs text-zinc-200 pointer-events-none">
          <span
            className={`w-2 h-2 rounded-full ${
              faceDetected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span>{faceDetected ? 'Đã nhận diện khuôn mặt' : 'Đang tìm khuôn mặt...'}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num text-zinc-300">{fps} FPS</span>
          {!landmarkerReady && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300">Đang tải bộ nhận diện MediaPipe...</span>
            </>
          )}
        </div>
      )}

      {/* Compare Original Indicator */}
      {effects.compareOriginal && (
        <div className="absolute top-3.5 right-4 px-3 py-1.5 rounded-lg bg-black/75 text-xs font-medium text-rose-300 pointer-events-none">
          Đang hiển thị Camera gốc
        </div>
      )}

      {/* Loading or Error States */}
      {isLoadingCamera && (
        <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <Camera className="w-8 h-8 text-rose-400 animate-pulse" />
          <p className="text-sm font-medium text-zinc-200">
            Đang kết nối với Camera thật của máy tính...
          </p>
          <p className="text-xs text-zinc-400 max-w-md">
            Vui lòng nhấn &ldquo;Cho phép&rdquo; (Allow) nếu trình duyệt yêu cầu quyền truy cập USB Camera hoặc Webcam.
          </p>
        </div>
      )}

      {cameraError && !isLoadingCamera && (
        <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertCircle className="w-9 h-9 text-rose-500" />
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-semibold text-zinc-100">
              Không thể truy cập Camera
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{cameraError}</p>
          </div>
          <button
            type="button"
            onClick={onRetryCamera}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
          >
            Thử kết nối lại Camera
          </button>
        </div>
      )}
    </div>
  );
};
