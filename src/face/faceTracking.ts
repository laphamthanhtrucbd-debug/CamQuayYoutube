import { FaceRegions, NormalizedLandmark, Point2D } from '../types/face';
import { extractFaceRegions } from './faceGeometry';

/**
 * Temporal landmark smoother using Exponential Moving Average (EMA)
 * to eliminate micro-jitter while keeping fast facial movement responsive.
 */
export class FaceTracker {
  private smoothedLandmarks: NormalizedLandmark[] | null = null;
  private lastValidRegions: FaceRegions | null = null;
  private missedFrames = 0;

  public update(
    rawLandmarks: NormalizedLandmark[] | null,
    width: number,
    height: number,
    isMirrored: boolean
  ): FaceRegions | null {
    if (!rawLandmarks || rawLandmarks.length === 0) {
      this.missedFrames++;
      if (this.missedFrames > 8) {
        this.smoothedLandmarks = null;
        this.lastValidRegions = null;
      }
      return this.lastValidRegions;
    }

    this.missedFrames = 0;

    if (!this.smoothedLandmarks || this.smoothedLandmarks.length !== rawLandmarks.length) {
      this.smoothedLandmarks = rawLandmarks.map((lm) => ({ ...lm }));
    } else {
      const alpha = 0.62; // Responsive yet jitter-free smoothing factor
      for (let i = 0; i < rawLandmarks.length; i++) {
        const prev = this.smoothedLandmarks[i];
        const curr = rawLandmarks[i];
        prev.x = prev.x * (1 - alpha) + curr.x * alpha;
        prev.y = prev.y * (1 - alpha) + curr.y * alpha;
        prev.z = prev.z * (1 - alpha) + curr.z * alpha;
      }
    }

    const regions = extractFaceRegions(this.smoothedLandmarks, width, height, isMirrored);
    this.lastValidRegions = regions;
    return regions;
  }

  public drawDebugLandmarks(ctx: CanvasRenderingContext2D, regions: FaceRegions): void {
    ctx.save();
    const drawLoop = (pts: Point2D[], color: string, closed = true) => {
      if (pts.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      if (closed) ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    };

    drawLoop(regions.faceOval, 'rgba(244, 63, 94, 0.55)', true);
    drawLoop(regions.leftEye, 'rgba(56, 189, 248, 0.75)', true);
    drawLoop(regions.rightEye, 'rgba(56, 189, 248, 0.75)', true);
    drawLoop(regions.leftEyebrow, 'rgba(251, 191, 36, 0.75)', true);
    drawLoop(regions.rightEyebrow, 'rgba(251, 191, 36, 0.75)', true);
    drawLoop(regions.upperLipOuter, 'rgba(236, 72, 153, 0.8)', false);
    drawLoop(regions.lowerLipOuter, 'rgba(236, 72, 153, 0.8)', false);
    drawLoop(regions.noseBridge, 'rgba(167, 139, 250, 0.75)', false);

    // Key points
    const keyPoints = [
      regions.leftIrisCenter,
      regions.rightIrisCenter,
      regions.noseTip,
      regions.leftCheekCenter,
      regions.rightCheekCenter,
      regions.chinCenter,
    ];
    ctx.fillStyle = '#38bdf8';
    for (const p of keyPoints) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export const faceTracker = new FaceTracker();
