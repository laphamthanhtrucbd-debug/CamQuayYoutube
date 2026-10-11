export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface FaceRegions {
  faceOval: Point2D[];
  foreheadCenter: Point2D;
  glabellaCenter: Point2D;      // Điểm giữa 2 đầu lông mày (Ấn đường / Chu sa)
  headCrownCenter: Point2D;     // Đỉnh đầu thật (phía trên tóc)
  leftHeadTemple: Point2D;      // Đỉnh thái dương trái
  rightHeadTemple: Point2D;     // Đỉnh thái dương phải
  leftEarLobe: Point2D;         // Dái tai trái (gắn bông tai trái)
  rightEarLobe: Point2D;        // Dái tai phải (gắn bông tai phải)
  neckCenter: Point2D;          // Vùng cổ dưới cằm (gắn vòng cổ)
  leftEye: Point2D[];
  rightEye: Point2D[];
  leftIrisCenter: Point2D;
  rightIrisCenter: Point2D;
  leftUnderEye: Point2D[];
  rightUnderEye: Point2D[];
  leftEyebrow: Point2D[];
  rightEyebrow: Point2D[];
  noseBridge: Point2D[];
  noseTip: Point2D;
  leftNostril: Point2D;
  rightNostril: Point2D;
  upperLipOuter: Point2D[];
  upperLipInner: Point2D[];
  lowerLipOuter: Point2D[];
  lowerLipInner: Point2D[];
  leftCheekCenter: Point2D;
  rightCheekCenter: Point2D;
  leftJawline: Point2D[];
  rightJawline: Point2D[];
  chinCenter: Point2D;
  faceBox: BoundingBox;
  rollAngle: number; // upright head tilt in radians (-PI/2 to PI/2, NEVER inverted 180 deg)
  faceScale: number; // pixel width of face
}
