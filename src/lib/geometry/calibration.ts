/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GeometryCalibrationState, SceneState } from '../../types/scene.ts';

export interface GeometryValidationResult {
  isValid: boolean;
  canArmReach: boolean;
  maxAnatomicalReachCm: number;
  currentDistanceCm: number;
  warningsAr: string[];
  warningsEn: string[];
  clearancePlausible: boolean;
  supportPlausible: boolean;
}

/**
 * Calculates plausible anatomical reach of an adult human arm holding a smartphone.
 * Standard functional reach = approx. 35% to 39% of body height, capped at ~75 cm for handheld single arm.
 */
export function calculateMaxSelfieReachCm(heightCm: number): number {
  const calculated = Math.round(heightCm * 0.38);
  // An arm holding a phone cannot realistically exceed 75cm without an external selfie stick or robotic arm
  return Math.min(75, Math.max(50, calculated));
}

/**
 * Comprehensive geometric validation of human biomechanics, camera position, and room environment
 */
export function validateGeometryCalibration(
  calibration: GeometryCalibrationState,
  cameraMode: string,
  poseCategory: string,
  supportSurface: string
): GeometryValidationResult {
  const warningsAr: string[] = [];
  const warningsEn: string[] = [];

  const height = calibration.subject.heightCm || 193;
  const maxReachCm = calculateMaxSelfieReachCm(height);
  const currentDistance = calibration.camera.lensToFaceDistanceCm;
  const holdingArm = calibration.subject.cameraHoldingArm;

  let canArmReach = true;

  // Handheld selfie check
  if (cameraMode === 'front_selfie' || cameraMode === 'rear_main_self_capture') {
    if (holdingArm !== 'none') {
      if (currentDistance > maxReachCm) {
        canArmReach = false;
        warningsAr.push(
          `تحذير هندسي حرج: مسافة الكاميرا المحددة (${currentDistance} سم) تتجاوز أقصى مدى تشريحي ممكن للذراع البشرية (${maxReachCm} سم) للشخص بطول ${height} سم. هذا يسبب "ذراعًا طافية" أو سيلفي غير واقعية.`
        );
        warningsEn.push(
          `Critical geometry warning: Camera distance (${currentDistance}cm) exceeds maximum anatomical arm reach (${maxReachCm}cm) for subject height ${height}cm.`
        );
      } else if (currentDistance < 30) {
        warningsAr.push(
          `تحذير زاوية قريبة جدًا: مسافة (${currentDistance} سم) ستسبب تشوهًا بصريًا مفرطًا للأنف والملامح (Fish-eye distortion). المسافة الطبيعية هي 45-65 سم.`
        );
        warningsEn.push(
          `Extreme close-up warning: Distance (${currentDistance}cm) causes excessive facial distortion. Recommended 45-65cm.`
        );
      }
    }
  }

  // Physical support check
  let supportPlausible = true;
  if (poseCategory === 'sitting' && supportSurface === 'unsupported') {
    supportPlausible = false;
    warningsAr.push('تحذير دعم فيزيائي: الشخص في وضعية جلوس دون تحديد سطح دعم (كرسي أو مرتبة).');
    warningsEn.push('Physical support warning: Seated posture without supporting surface.');
  }

  if (poseCategory === 'reclining' && supportSurface !== 'bed_mattress' && supportSurface !== 'pillows') {
    warningsAr.push('تحذير استلقاء: الاستلقاء يتطلب دعمًا أرضيًا أو سريريًا لتفادي الجسد الطافي.');
    warningsEn.push('Reclining warning: Reclining posture requires bed mattress or pillow support.');
  }

  // Room clearance check
  let clearancePlausible = true;
  if (calibration.environment.walkingClearanceM < 0.5) {
    clearancePlausible = false;
    warningsAr.push('تحذير المساحة: ممر الحركة في الغرفة ضيق جدًا (أقل من 50 سم) مما يخالف المعايير المعمارية.');
    warningsEn.push('Room clearance warning: Walking corridor under 0.5m is architecturally cramped.');
  }

  const isValid = canArmReach && supportPlausible && clearancePlausible && warningsAr.length === 0;

  return {
    isValid,
    canArmReach,
    maxAnatomicalReachCm: maxReachCm,
    currentDistanceCm: currentDistance,
    warningsAr,
    warningsEn,
    clearancePlausible,
    supportPlausible
  };
}

/**
 * Synchronizes geometry calibration state when camera or pose changes in scene
 */
export function updateGeometryFromScene(state: SceneState): GeometryCalibrationState {
  const height = state.identity.heightCm || 193;
  const maxReach = calculateMaxSelfieReachCm(height);
  const armDist = state.pose.selfieArmDistanceCm || 56;
  const canReach = armDist <= maxReach;

  return {
    subject: {
      heightCm: height,
      proportions: state.identity.bodyType === 'tall_lean_athletic' ? 'tall_lean' : 'average',
      shoulderWidthCm: Math.round(height * 0.25),
      cameraHoldingArm: state.pose.freeHand === 'left_holding_phone' ? 'left' : 'right',
      armReachCm: armDist,
      headPitchDeg: state.camera.angle === 'elevated' ? -8 : state.camera.angle === 'low_angle' ? 10 : 0,
      headYawDeg: state.camera.angle === 'lateral_left' ? -12 : state.camera.angle === 'lateral_right' ? 12 : 2,
      torsoOrientationDeg: 0,
      posture: state.pose.category === 'standing' ? 'standing' : state.pose.category === 'sitting' ? 'sitting' : state.pose.category === 'reclining' ? 'reclining' : 'walking'
    },
    camera: {
      lensToFaceDistanceCm: armDist,
      cameraHeightCm: state.pose.category === 'standing' ? height - 12 : 105,
      horizontalOffsetCm: state.camera.faceFraming === 'rule_of_thirds' ? 8 : 0,
      cameraPitchDeg: state.camera.angle === 'elevated' ? 12 : state.camera.angle === 'slightly_elevated' ? 6 : state.camera.angle === 'low_angle' ? -10 : 0,
      cameraYawDeg: state.camera.angle === 'lateral_right' ? 15 : state.camera.angle === 'lateral_left' ? -15 : 0,
      cameraRollDeg: state.camera.naturalHandheldRollDeg || -1.5,
      fovHorizontalDeg: state.camera.focalLengthEquivMm <= 21 ? 84 : 73
    },
    environment: {
      roomWidthM: state.bedroomGeometry.roomDimensionsM.width,
      roomLengthM: state.bedroomGeometry.roomDimensionsM.length,
      ceilingHeightM: state.bedroomGeometry.roomDimensionsM.height,
      bedWidthCm: state.bedroomGeometry.bedDimensionsCm.width,
      bedLengthCm: state.bedroomGeometry.bedDimensionsCm.length,
      bedHeightCm: state.bedroomGeometry.bedDimensionsCm.height,
      walkingClearanceM: 1.1,
      supportSurfaceHeightCm: state.bedroomGeometry.bedDimensionsCm.height,
      isPhysicalSupportValid: true
    },
    reachStatus: {
      canReach,
      maxReachCm: maxReach,
      currentReachCm: armDist,
      messageAr: canReach
        ? `المسافة (${armDist} سم) متوافقة تمامًا مع المدى الطبيعي للذراع (${maxReach} سم).`
        : `المسافة (${armDist} سم) غير ممكنة تشريحيًا لذراع بطول أقصى (${maxReach} سم).`
    },
    clearanceWarnings: []
  };
}
