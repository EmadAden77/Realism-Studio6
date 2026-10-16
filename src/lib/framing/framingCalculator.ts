/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AspectRatio, FramingPreviewState, SceneState } from '../../types/scene.ts';

export interface BoundingBox2D {
  x: number; // 0..100%
  y: number; // 0..100%
  width: number;
  height: number;
}

export interface FramingCalculationResult {
  previewState: FramingPreviewState;
  headBox: BoundingBox2D;
  shoulderBox: BoundingBox2D;
  torsoBox: BoundingBox2D;
  armVector: { startX: number; startY: number; endX: number; endY: number };
  backgroundCoveragePercent: number;
  verticalAngleLabelAr: string;
  horizontalAngleLabelAr: string;
  distanceEffectAr: string;
}

/**
 * Calculates geometric projection coordinates for the 9:16 selfie framing simulator.
 * Uses realistic projection assumptions based on 21mm ultra-wide lens, distance (cm), pitch, yaw, and roll.
 */
export function calculateFramingPreview(
  distanceCm: number,
  pitchDeg: number, // positive = tilted down (elevated camera looking down), negative = low angle looking up
  yawDeg: number, // horizontal pan
  rollDeg: number, // handheld tilt
  posture: 'standing' | 'sitting' | 'reclining' | 'walking',
  aspectRatio: AspectRatio = '9:16',
  framingTightness: FramingPreviewState['framingTightness'] = 'medium_close_up'
): FramingCalculationResult {
  // Clamp distance between 30 and 90 cm
  const dist = Math.max(30, Math.min(90, distanceCm));

  // Base scale is inversely proportional to distance (closer = larger head)
  // At 55cm (reference standard), scale = 1.0
  const scale = 55 / dist;

  // Pitch shifts vertical position of head and changes shoulder/torso perspective
  // Pitch > 0 (camera high, pointing down) -> head shifts down in frame or appears higher with foreshortened torso
  const pitchOffset = pitchDeg * 0.8;
  const yawOffset = yawDeg * 0.7;

  // Base head dimensions at 55cm in 9:16 frame: width ~34%, height ~26%
  const headW = Math.min(60, Math.max(20, 34 * scale));
  const headH = Math.min(50, Math.max(16, 26 * scale));

  // Head center position
  const headCenterX = 50 + yawOffset;
  const headCenterY = 28 + pitchOffset;

  const headBox: BoundingBox2D = {
    x: Math.max(5, Math.min(95 - headW, headCenterX - headW / 2)),
    y: Math.max(4, Math.min(80 - headH, headCenterY - headH / 2)),
    width: headW,
    height: headH
  };

  // Shoulder dimensions
  const shoulderW = Math.min(92, Math.max(40, 62 * scale));
  const shoulderH = Math.min(36, Math.max(15, 24 * scale));
  const shoulderY = headBox.y + headH * 0.95;

  const shoulderBox: BoundingBox2D = {
    x: Math.max(4, Math.min(96 - shoulderW, 50 + yawOffset * 0.5 - shoulderW / 2)),
    y: Math.min(90, shoulderY),
    width: shoulderW,
    height: shoulderH
  };

  // Torso dimensions
  const torsoW = Math.min(96, Math.max(45, 68 * scale));
  const torsoH = Math.max(20, 45 * scale);
  const torsoY = shoulderBox.y + shoulderH * 0.6;

  const torsoBox: BoundingBox2D = {
    x: Math.max(2, Math.min(98 - torsoW, 50 + yawOffset * 0.3 - torsoW / 2)),
    y: Math.min(96, torsoY),
    width: torsoW,
    height: torsoH
  };

  // Arm vector (pointing towards camera from bottom-right or bottom-left)
  const armStartX = shoulderBox.x + shoulderBox.width * 0.85;
  const armStartY = shoulderBox.y + shoulderBox.height * 0.6;
  const armEndX = 95;
  const armEndY = 100;

  // Background coverage = percentage of frame not occluded by subject
  const subjectAreaApprox = (headBox.width * headBox.height + shoulderBox.width * shoulderBox.height + torsoBox.width * Math.min(torsoBox.height, 100 - torsoY)) / 100;
  const backgroundCoveragePercent = Math.max(20, Math.min(80, Math.round(100 - subjectAreaApprox * 0.65)));

  let verticalAngleLabelAr = 'مستوى العين (Eye-Level)';
  if (pitchDeg > 8) verticalAngleLabelAr = 'زاوية علوية مرتفعة (Elevated Angle)';
  else if (pitchDeg > 2) verticalAngleLabelAr = 'زاوية مرتفعة قليلاً (Slightly Elevated)';
  else if (pitchDeg < -4) verticalAngleLabelAr = 'زاوية منخفضة (Low Angle)';

  let horizontalAngleLabelAr = 'مواجه مباشر (Center)';
  if (yawDeg > 5) horizontalAngleLabelAr = 'مائل لليمين (Lateral Right)';
  else if (yawDeg < -5) horizontalAngleLabelAr = 'مائل لليسار (Lateral Left)';

  let distanceEffectAr = 'تأطير قياسي متوازن 45-65 سم';
  if (dist < 45) distanceEffectAr = 'تأطير مقرب (Close-up) مع اتساع المنظور';
  else if (dist > 65) distanceEffectAr = 'تأطير واسع (Bust / Upper Body) يظهر مساحة أكبر من الغرفة';

  const previewState: FramingPreviewState = {
    aspectRatio,
    facePositionX: Math.round(yawOffset),
    facePositionY: Math.round(pitchOffset),
    framingTightness,
    headBoundingBox: headBox,
    shoulderBoundingBox: shoulderBox,
    torsoBoundingBox: torsoBox,
    armDirection: 'right_bottom',
    backgroundCoveragePercent,
    isApproximatePreviewNoticeAcknowledged: true
  };

  return {
    previewState,
    headBox,
    shoulderBox,
    torsoBox,
    armVector: { startX: armStartX, startY: armStartY, endX: armEndX, endY: armEndY },
    backgroundCoveragePercent,
    verticalAngleLabelAr,
    horizontalAngleLabelAr,
    distanceEffectAr
  };
}

/**
 * Recalculate framing preview based on complete scene state
 */
export function syncFramingFromScene(state: SceneState): FramingPreviewState {
  const dist = state.geometryCalibration.camera.lensToFaceDistanceCm || state.pose.selfieArmDistanceCm || 56;
  const pitch = state.geometryCalibration.camera.cameraPitchDeg || (state.camera.angle === 'elevated' ? 12 : state.camera.angle === 'slightly_elevated' ? 6 : state.camera.angle === 'low_angle' ? -8 : 0);
  const yaw = state.geometryCalibration.camera.cameraYawDeg || 0;
  const roll = state.camera.naturalHandheldRollDeg || -1.5;
  const posture = state.pose.category === 'standing' ? 'standing' : state.pose.category === 'sitting' ? 'sitting' : state.pose.category === 'reclining' ? 'reclining' : 'walking';

  const result = calculateFramingPreview(dist, pitch, yaw, roll, posture, state.camera.aspectRatio);
  return result.previewState;
}
