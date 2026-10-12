import { FaceRegions, NormalizedLandmark, Point2D } from '../types/face';
import { computeBoundingBox } from '../utils/imageUtils';

// Official MediaPipe Face Mesh 478 landmark indices for facial contours and regions
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

const LEFT_EYE_INDICES = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
const RIGHT_EYE_INDICES = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382];

const LEFT_UNDER_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 243, 112, 26, 22, 23, 24, 110, 25];
const RIGHT_UNDER_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 463, 341, 256, 252, 253, 254, 339, 255];

const LEFT_EYEBROW_INDICES = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
const RIGHT_EYEBROW_INDICES = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276];

const UPPER_LIP_OUTER_INDICES = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
const UPPER_LIP_INNER_INDICES = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];

const LOWER_LIP_OUTER_INDICES = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const LOWER_LIP_INNER_INDICES = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];

const NOSE_BRIDGE_INDICES = [168, 6, 197, 195, 5, 4];

const LEFT_JAWLINE_INDICES = [234, 93, 132, 58, 172, 136, 150, 149, 176, 148];
const RIGHT_JAWLINE_INDICES = [454, 323, 361, 288, 397, 365, 379, 378, 400, 377];

function toPixelPoint(
  landmark: NormalizedLandmark,
  width: number,
  height: number,
  isMirrored: boolean
): Point2D {
  const x = isMirrored ? (1 - landmark.x) * width : landmark.x * width;
  const y = landmark.y * height;
  return { x, y };
}

function mapIndicesToPoints(
  landmarks: NormalizedLandmark[],
  indices: number[],
  width: number,
  height: number,
  isMirrored: boolean
): Point2D[] {
  return indices
    .filter((idx) => idx < landmarks.length)
    .map((idx) => toPixelPoint(landmarks[idx], width, height, isMirrored));
}

export function extractFaceRegions(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  isMirrored: boolean
): FaceRegions | null {
  if (!landmarks || landmarks.length < 468) return null;

  const pt = (idx: number) => toPixelPoint(landmarks[idx], width, height, isMirrored);

  const faceOval = mapIndicesToPoints(landmarks, FACE_OVAL_INDICES, width, height, isMirrored);
  const faceBox = computeBoundingBox(faceOval);

  const leftEye = mapIndicesToPoints(landmarks, LEFT_EYE_INDICES, width, height, isMirrored);
  const rightEye = mapIndicesToPoints(landmarks, RIGHT_EYE_INDICES, width, height, isMirrored);

  const leftIrisCenter =
    landmarks.length > 468
      ? pt(468)
      : computeBoundingBox(leftEye);
  const rightIrisCenter =
    landmarks.length > 473
      ? pt(473)
      : computeBoundingBox(rightEye);

  const resolvedLeftIris: Point2D =
    'x' in leftIrisCenter
      ? leftIrisCenter
      : { x: leftIrisCenter.centerX, y: leftIrisCenter.centerY };
  const resolvedRightIris: Point2D =
    'x' in rightIrisCenter
      ? rightIrisCenter
      : { x: rightIrisCenter.centerX, y: rightIrisCenter.centerY };

  // CRITICAL FIX: Always compute rollAngle from the screen-left eye to the screen-right eye!
  // When `isMirrored = true`, `resolvedLeftIris` is on the right side of the canvas and `resolvedRightIris` is on the left,
  // which previously made `dx < 0` and flipped `atan2` by 180 degrees (upside down!).
  const screenLeftEye =
    resolvedLeftIris.x <= resolvedRightIris.x ? resolvedLeftIris : resolvedRightIris;
  const screenRightEye =
    resolvedLeftIris.x <= resolvedRightIris.x ? resolvedRightIris : resolvedLeftIris;

  const dx = screenRightEye.x - screenLeftEye.x;
  const dy = screenRightEye.y - screenLeftEye.y;
  const rollAngle = Math.atan2(dy, Math.max(1, dx)); // Guaranteed upright angle in [-PI/2, PI/2]

  const foreheadCenter = pt(10); // Landmark #10: Upper-mid forehead
  const chinCenter = pt(152);    // Landmark #152: Bottom of chin

  // Glabella / Chu sa between the inner heads of the two eyebrows (landmarks 107, 336, 9, 168)
  const browInnerL = pt(107);
  const browInnerR = pt(336);
  const glabellaBridge = pt(9);
  const glabellaCenter: Point2D = {
    x: (browInnerL.x + browInnerR.x + glabellaBridge.x) / 3,
    y: (browInnerL.y + browInnerR.y + glabellaBridge.y) / 3 - faceBox.height * 0.012,
  };

  // True upward cranial vector along the forehead (from glabella #9 -> forehead #10)
  // AND 3D pitch compensation using MediaPipe Z-coordinates (landmark.z is negative when closer to camera).
  // When tilting head DOWN (cúi xuống), forehead (10) comes closer to camera than chin (152),
  // so (chin.z - forehead.z) increases and forehead->glabella 2D distance foreshortens.
  const cosR = Math.cos(rollAngle);
  const sinR = Math.sin(rollAngle);
  const upUnitX = sinR;
  const upUnitY = -cosR;

  const pitchDeltaZ = (landmarks[152]?.z ?? 0) - (landmarks[10]?.z ?? 0);
  // Extra upward offset when tilting head down so ears stay at the top edge of the forehead/hairline
  const pitchDownBoost = Math.max(0, pitchDeltaZ) * 0.85;
  const upperForeheadOffset = faceBox.width * (0.20 + pitchDownBoost);

  // Upper forehead / hairline anchor (sits at the top of the forehead, not the middle, and shifts up when nodding down)
  const upperForeheadCenter: Point2D = {
    x: foreheadCenter.x + upUnitX * upperForeheadOffset,
    y: foreheadCenter.y + upUnitY * upperForeheadOffset,
  };

  const headCrownCenter: Point2D = {
    x: foreheadCenter.x + upUnitX * (faceBox.width * (0.30 + pitchDownBoost)),
    y: foreheadCenter.y + upUnitY * (faceBox.width * (0.30 + pitchDownBoost)),
  };

  const earSpan = faceBox.width * 0.34;

  const leftHeadTemple: Point2D = {
    x: headCrownCenter.x - cosR * earSpan,
    y: headCrownCenter.y - sinR * earSpan,
  };

  const rightHeadTemple: Point2D = {
    x: headCrownCenter.x + cosR * earSpan,
    y: headCrownCenter.y + sinR * earSpan,
  };

  // -------------------------------------------------------------------------
  // EAR LOBES FOR EARRINGS (Định vị chuẩn xác dái tai thật - Không bị lệch vào má hay bay ra ngoài):
  // MediaPipe FaceMesh ear landmarks:
  // Landmark #234 (Left) and #454 (Right): Tragus (mốc sụn trước lỗ tai thật).
  // Landmark #93 (Left) and #323 (Right): Góc xương hàm ngay dưới tai.
  //
  // Dái tai thật nằm ở phần đáy tai ngoài:
  // - Về chiều dọc: nằm thấp hơn lỗ tai/tragus (ngang tầm cánh mũi/nhân trung)
  // - Về chiều ngang: nằm chếch ra ngoài rìa tai (outward) so với mốc tragus
  // -------------------------------------------------------------------------
  const tragusA = pt(234);
  const tragusB = pt(454);
  const baseA = pt(93);
  const baseB = pt(323);

  // Identify screen-left vs screen-right ear
  const isTragusALeft = tragusA.x <= tragusB.x;
  const screenLeftTragus = isTragusALeft ? tragusA : tragusB;
  const screenRightTragus = isTragusALeft ? tragusB : tragusA;

  const screenLeftBase = isTragusALeft ? baseA : baseB;
  const screenRightBase = isTragusALeft ? baseB : baseA;

  // Downward unit vector along head axis
  const downUnitX = sinR;
  const downUnitY = cosR;

  // The anatomical earlobe sits right at the lower junction of the tragus (#234/#454) and jaw ramus (#93/#323)
  // We use 0.70 tragus + 0.30 base to stick directly to the real earlobe flesh
  const midLeftEarBase = {
    x: (screenLeftTragus.x * 0.70 + screenLeftBase.x * 0.30),
    y: (screenLeftTragus.y * 0.70 + screenLeftBase.y * 0.30),
  };
  const midRightEarBase = {
    x: (screenRightTragus.x * 0.70 + screenRightBase.x * 0.30),
    y: (screenRightTragus.y * 0.70 + screenRightBase.y * 0.30),
  };

  // Lateral outward shift from face center to outside ear (tightened to 0.015 face width so it sits ON earlobe)
  const earOutwardDist = faceBox.width * 0.015;
  const earDownwardDist = faceBox.height * 0.022;

  // Screen Left earlobe (ôm sát dái tai trái thật):
  const leftEarLobe: Point2D = {
    x: midLeftEarBase.x - cosR * earOutwardDist + downUnitX * earDownwardDist,
    y: midLeftEarBase.y - sinR * earOutwardDist + downUnitY * earDownwardDist,
  };

  // Screen Right earlobe (ôm sát dái tai phải thật):
  const rightEarLobe: Point2D = {
    x: midRightEarBase.x + cosR * earOutwardDist + downUnitX * earDownwardDist,
    y: midRightEarBase.y + sinR * earOutwardDist + downUnitY * earDownwardDist,
  };

  // -------------------------------------------------------------------------
  // NECK CENTER FOR NECKLACE (Định vị hõm cổ / xương quai xanh bám sát chuyển động):
  // Trục cổ dọc tự nhiên nối từ sống mũi (#168) qua cằm (#152) rủ xuống ngực
  // -------------------------------------------------------------------------
  const noseBridgeTop = pt(168);
  const neckDx = chinCenter.x - noseBridgeTop.x;
  const neckDy = chinCenter.y - noseBridgeTop.y;
  const neckDist = Math.hypot(neckDx, neckDy) || 1;
  const neckAxisX = neckDx / neckDist;
  const neckAxisY = neckDy / neckDist;

  // Khoảng cách từ cằm xuống hõm ức / xương quai xanh (tự động co giãn theo độ cúi/ngửa đầu pitchDeltaZ)
  const neckPitchFactor = Math.max(0.24, 0.42 - pitchDeltaZ * 0.42);
  const neckLength = faceBox.height * neckPitchFactor;

  const neckCenter: Point2D = {
    x: chinCenter.x + neckAxisX * neckLength,
    y: chinCenter.y + neckAxisY * neckLength,
  };

  return {
    faceOval,
    foreheadCenter: upperForeheadCenter,
    glabellaCenter,
    headCrownCenter,
    leftHeadTemple,
    rightHeadTemple,
    leftEarLobe,
    rightEarLobe,
    neckCenter,
    leftEye,
    rightEye,
    leftIrisCenter: resolvedLeftIris,
    rightIrisCenter: resolvedRightIris,
    leftUnderEye: mapIndicesToPoints(landmarks, LEFT_UNDER_EYE_INDICES, width, height, isMirrored),
    rightUnderEye: mapIndicesToPoints(landmarks, RIGHT_UNDER_EYE_INDICES, width, height, isMirrored),
    leftEyebrow: mapIndicesToPoints(landmarks, LEFT_EYEBROW_INDICES, width, height, isMirrored),
    rightEyebrow: mapIndicesToPoints(landmarks, RIGHT_EYEBROW_INDICES, width, height, isMirrored),
    noseBridge: mapIndicesToPoints(landmarks, NOSE_BRIDGE_INDICES, width, height, isMirrored),
    noseTip: pt(1),
    leftNostril: pt(102),
    rightNostril: pt(331),
    upperLipOuter: mapIndicesToPoints(landmarks, UPPER_LIP_OUTER_INDICES, width, height, isMirrored),
    upperLipInner: mapIndicesToPoints(landmarks, UPPER_LIP_INNER_INDICES, width, height, isMirrored),
    lowerLipOuter: mapIndicesToPoints(landmarks, LOWER_LIP_OUTER_INDICES, width, height, isMirrored),
    lowerLipInner: mapIndicesToPoints(landmarks, LOWER_LIP_INNER_INDICES, width, height, isMirrored),
    leftCheekCenter: pt(116),
    rightCheekCenter: pt(345),
    leftJawline: mapIndicesToPoints(landmarks, LEFT_JAWLINE_INDICES, width, height, isMirrored),
    rightJawline: mapIndicesToPoints(landmarks, RIGHT_JAWLINE_INDICES, width, height, isMirrored),
    chinCenter,
    faceBox,
    rollAngle,
    faceScale: faceBox.width,
  };
}
