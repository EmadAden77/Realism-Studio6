/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';
import {
  EXPRESSION_PRESETS,
  GAZE_PRESETS,
  HAIR_PRESETS,
  LOCATION_PRESETS,
  POSE_PRESETS,
  ALL_HAIRSTYLE_PRESETS,
  ALL_EXPRESSION_PRESETS,
  ALL_GAZE_PRESETS,
  ALL_POSE_PRESETS,
  ALL_LOCATION_PRESETS,
  ALL_CAMERA_ANGLE_PRESETS,
  ALL_CLOTHING_PRESETS
} from '../presets/data.ts';
import { buildUnifiedImagingPrompt, buildUnifiedImagingNegativeTokens } from '../realism/imagingConsistency.ts';
import { buildGeometricLightingPrompt, buildGeometricLightingNegativeTokens } from '../realism/geometricLighting.ts';
import { buildHumanContactPhysicsPrompt, buildHumanContactNegativeTokens } from '../realism/humanContactPhysics.ts';
import { buildCloseRangeOpticsPrompt, buildCloseRangeOpticsNegativeTokens } from '../realism/closeRangeOptics.ts';
import { buildCandidMomentPrompt, buildCandidMomentNegativeTokens } from '../realism/candidMoment.ts';
import { buildDynamicFabricPrompt, buildDynamicFabricNegativeTokens } from '../realism/dynamicFabric.ts';
import { buildDynamicHairPrompt, buildDynamicHairNegativeTokens } from '../realism/dynamicHair.ts';
import { buildMaterialResponsePrompt, buildMaterialResponseNegativeTokens } from '../realism/materialResponse.ts';
import { buildSceneContinuityPrompt, buildSceneContinuityNegativeTokens } from '../realism/sceneContinuity.ts';
import { buildPhotographicImperfectionsPrompt, buildPhotographicImperfectionsNegativeTokens } from '../realism/photographicImperfections.ts';
import { buildExaggerationReductionNegativeTokens } from '../realism/exaggerationReduction.ts';

// 1. Identity & Physical Proportions Builder
export function buildIdentityPrompt(state: SceneState): string {
  const { identity } = state;
  const parts: string[] = [];

  parts.push(
    `Authentic photographic portrait of a ${identity.apparentAge}-year-old Saudi Arabian young man (${identity.heightCm}cm tall, ${identity.weightKg}kg, ${identity.bodyType.replace(/_/g, ' ')} build)`
  );
  parts.push(
    `natural ${identity.skinTone}, ${identity.headShape}, anatomically grounded facial bone structure with ${identity.facialAsymmetry}`
  );

  if (identity.customDescription) {
    parts.push(identity.customDescription);
  }

  return parts.join(', ');
}

// 2. Hair Studio Builder
export function buildHairPrompt(state: SceneState): string {
  const { hair } = state;
  const v4Hair = ALL_HAIRSTYLE_PRESETS.find((p) => p.id === hair.presetId);
  const preset = HAIR_PRESETS.find((p) => p.id === hair.presetId);
  const parts: string[] = [];

  const hairDesc = v4Hair
    ? v4Hair.promptFragment
    : preset
    ? preset.descriptionEn
    : `${hair.length} dark hair, styled in ${hair.direction} direction`;

  parts.push(`hair: ${hairDesc}`);

  if (hair.densityLock) {
    parts.push(
      'preserving exact observed natural hair density and realistic hairline recession with organic clumping'
    );
  }
  if (hair.preventArtificialThickening) {
    parts.push('strictly no artificial CGI hair thickening, no helmet-like wig density, no painted-on edges');
  }

  return parts.join(', ');
}

// 3. Facial Hair Builder
export function buildFacialHairPrompt(state: SceneState): string {
  const { facialHair } = state;
  const parts: string[] = [];

  if (facialHair.growthTexture === 'clean_shaven') {
    parts.push('clean-shaven jawline with natural skin pores');
  } else {
    parts.push(`facial hair: ${facialHair.growthTexture.replace(/_/g, ' ')}`);
    if (facialHair.densityLock && facialHair.naturalBoundaries) {
      parts.push('natural beard density preserving authentic subtle follicle irregularities, no razor-drawn artificial edges');
    }
  }

  return parts.join(', ');
}

// 4. Expression & Gaze Builder
export function buildExpressionAndGazePrompt(state: SceneState): string {
  const { expression, gaze, eyewear } = state;
  const v4Expr = ALL_EXPRESSION_PRESETS.find((e) => e.id === expression.presetId);
  const exprPreset = EXPRESSION_PRESETS.find((e) => e.id === expression.presetId);
  const v4Gaze = ALL_GAZE_PRESETS.find((g) => g.id === gaze.targetId);
  const gazePreset = GAZE_PRESETS.find((g) => g.id === gaze.targetId);
  const parts: string[] = [];

  if (v4Expr) {
    parts.push(`facial expression: ${expression.intensity} ${v4Expr.nameEn} (${v4Expr.promptFragment})`);
  } else if (exprPreset) {
    parts.push(
      `facial expression: ${expression.intensity} ${exprPreset.nameEn} (${exprPreset.muscleNotesEn})`
    );
  } else {
    parts.push(`facial expression: ${expression.customDescription}`);
  }

  if (v4Gaze) {
    parts.push(`gaze: ${v4Gaze.promptFragment}`);
  } else if (gazePreset) {
    parts.push(`gaze: ${gazePreset.descriptionEn}`);
  }

  if (eyewear.mode === 'no_glasses') {
    parts.push('no glasses or eyewear, completely natural eye orbital structure');
  } else if (eyewear.mode === 'prescription_glasses') {
    parts.push(`wearing subtle prescription eyeglasses (${eyewear.styleDescription || 'slim matte frame'}), eyes visible through clear lenses without glare distortion`);
  } else if (eyewear.mode === 'sunglasses') {
    parts.push('wearing modern sunglasses with realistic environmental sky reflections');
  }

  return parts.join(', ');
}

// 5. Clothing & Strict Fabric Physics Builder
export function buildClothingAndFabricPrompt(state: SceneState): string {
  const { clothing } = state;
  const parts: string[] = [];

  const upperDesc = clothing.upper.nameEn;
  const lowerDesc = clothing.lower.nameEn;
  parts.push(`attire: ${upperDesc} in ${clothing.upper.colorEn} and ${lowerDesc} in ${clothing.lower.colorEn}`);

  if (clothing.footwear && clothing.footwear.id !== 'footwear_barefoot') {
    parts.push(`footwear: ${clothing.footwear.nameEn}`);
  } else if (clothing.footwear?.id === 'footwear_barefoot') {
    parts.push('barefoot');
  }

  return parts.join(', ');
}

// 6. Pose & Biomechanics Builder
export function buildPosePrompt(state: SceneState): string {
  const { pose } = state;
  const v4Pose = ALL_POSE_PRESETS.find((p) => p.id === pose.presetId);
  const preset = POSE_PRESETS.find((p) => p.id === pose.presetId);
  const parts: string[] = [];

  if (v4Pose) {
    parts.push(`pose: ${v4Pose.promptFragment}`);
    parts.push(`anatomical support: ${v4Pose.bodySupportRequirements}, ${v4Pose.shoulderPosition}`);
  } else if (preset) {
    parts.push(`pose: ${preset.descriptionEn}`);
    parts.push(`posture physics: ${preset.fabricTensionEn}`);
  }

  if (pose.category === 'sitting' || pose.category === 'reclining') {
    parts.push(`resting naturally on ${pose.supportSurface.replace(/_/g, ' ')} with anatomically correct weight distribution`);
  }

  parts.push(`free hand: ${pose.freeHand.replace(/_/g, ' ')}`);
  parts.push(`handheld selfie arm distance approx ${pose.selfieArmDistanceCm}cm, natural clavicle and shoulder biomechanics`);

  return parts.join(', ');
}

// 7. Camera & Smartphone Optics Builder
export function buildCameraPrompt(state: SceneState): string {
  const { camera } = state;
  const parts: string[] = [];

  parts.push(`shot on ${camera.device}`);

  if (camera.mode === 'front_selfie') {
    parts.push(
      'front-facing selfie camera, 21mm equivalent ultra-wide lens, f/2.0 aperture, genuine handheld smartphone perspective'
    );
    parts.push('subtle natural perspective expansion characteristic of 21mm focal length, wide ambient background depth');
  } else if (camera.mode === 'rear_main_self_capture') {
    parts.push(
      'rear primary camera self-capture, 23mm equivalent f/1.63 large 1-inch-type smartphone sensor with natural optical shallow depth of field'
    );
  } else if (camera.mode === 'mirror_selfie') {
    parts.push(
      'mirror selfie capture with phone visible in hand reflecting true mirror geometry and dual-angle spatial depth'
    );
  } else {
    parts.push('candid third-person smartphone snapshot at natural eye-level distance');
  }

  parts.push(`camera angle: ${camera.angle.replace(/_/g, ' ')}, handheld camera roll: ${camera.naturalHandheldRollDeg}°`);
  parts.push(`framing: ${camera.faceFraming.replace(/_/g, ' ')}`);

  return parts.join(', ');
}

// 8. Environment, Location & Saudi Regional Context Builder
export function buildEnvironmentPrompt(state: SceneState): string {
  const { environmentCategory, locationPresetId, bedroomGeometry, saudiEnvironment } = state;
  const v4Loc = ALL_LOCATION_PRESETS.find((l) => l.id === locationPresetId);
  const preset = LOCATION_PRESETS.find((l) => l.id === locationPresetId);
  const parts: string[] = [];

  if (v4Loc) {
    parts.push(`setting: ${v4Loc.promptFragment}`);
    if (v4Loc.requiredObjects.length > 0) {
      parts.push(`environment elements: ${v4Loc.requiredObjects.join(', ')}`);
    }
  } else if (preset) {
    parts.push(`setting: ${preset.nameEn}`);
    parts.push(`environment details: ${preset.physicalElementsEn.join(', ')}`);
  }

  if (environmentCategory === 'bedroom' && bedroomGeometry.persistentLayout) {
    parts.push(
      `bedroom geometry: ordinary Saudi residential room (~${bedroomGeometry.roomDimensionsM.length}m x ${bedroomGeometry.roomDimensionsM.width}m), matte cream plaster walls, grey cotton bedding on queen bed, dark wood bedside table, cool floor tiles`
    );
    if (bedroomGeometry.forbiddenLuxuryDetails) {
      parts.push('everyday domestic living space, not a five-star hotel suite, zero ornate chandeliers or gold trim');
    }
  } else if (environmentCategory === 'saudi_street') {
    parts.push(
      `Saudi urban context: ${saudiEnvironment.city} (${saudiEnvironment.neighborhoodType.replace(/_/g, ' ')}), ${saudiEnvironment.curbStyle.replace(/_/g, ' ')} curbs, ${saudiEnvironment.sidewalkMaterial.replace(/_/g, ' ')} sidewalks, realistic clean domestic residential streetscape`
    );
    if (saudiEnvironment.preventOrientalistCliches) {
      parts.push('strictly authentic contemporary Saudi infrastructure, no fantasy orientalist bazaar cliches, no desert dunes on residential roads');
    }
  }

  return parts.join(', ');
}

// 9. Lived-in Disorder Engine Builder
export function buildDisorderPrompt(state: SceneState): string {
  const { disorder } = state;
  const parts: string[] = [];

  if (disorder.level === 0) {
    parts.push('tidy environment with organized neat surfaces');
  } else if (disorder.level > 0) {
    const itemsFormatted = disorder.activeItems.map((item) => item.replace(/_/g, ' ')).join(', ');
    parts.push(
      `natural lived-in everyday environment (disorder level ${disorder.level}/4): ${itemsFormatted || 'subtly rumpled bedding, charging cable resting on nightstand'}`
    );
    parts.push('physically grounded everyday disorder matching recent natural living activity, not arbitrary chaos');
  }

  return parts.join(', ');
}

// Negative Prompt Builder
export function buildNegativePrompt(state: SceneState): string {
  const baseTokens: string[] = [
    'photoshop',
    'airbrushed skin',
    'waxy face',
    'plastic skin',
    'porcelain mannequin',
    'beauty filter',
    'CGI render',
    '3D cartoon',
    'anime',
    'exaggerated HDR',
    'unmotivated rim light',
    'deformed fingers',
    'extra limbs',
    'floating arms',
    'severed wrists',
    'impossible reach',
    'luxury penthouse gold chandeliers',
    'showroom staged bedroom',
    'orientalist fantasy bazaar',
    'camels in residential street',
    'desert sand dunes on paved urban highway'
  ];

  // Merge V2 modular negative tokens
  const v2NegativeTokens = [
    ...buildUnifiedImagingNegativeTokens(state),
    ...buildGeometricLightingNegativeTokens(state),
    ...buildHumanContactNegativeTokens(),
    ...buildCloseRangeOpticsNegativeTokens(),
    ...buildCandidMomentNegativeTokens(),
    ...buildDynamicFabricNegativeTokens(),
    ...buildDynamicHairNegativeTokens(),
    ...buildMaterialResponseNegativeTokens(),
    ...buildSceneContinuityNegativeTokens(),
    ...buildPhotographicImperfectionsNegativeTokens(),
    ...buildExaggerationReductionNegativeTokens()
  ];

  const combined = Array.from(new Set([...baseTokens, ...v2NegativeTokens]));

  if (state.lighting.mode === 'phone_screen_only') {
    combined.push(
      'ceiling room lights',
      'bright sunlit room',
      'ambient day window',
      'overexposed bedroom',
      'daylight background'
    );
  }

  if (state.eyewear.mode === 'no_glasses') {
    combined.push('eyeglasses', 'spectacles', 'sunglasses');
  }

  return combined.join(', ');
}

// 10. V3 Pre-Capture Context Builder
export function buildPreCaptureContextPrompt(state: SceneState): string {
  const { preCaptureContext } = state;
  if (!preCaptureContext || preCaptureContext.recentActivity === 'none') {
    return '';
  }

  const parts: string[] = [];
  const consequences = preCaptureContext.naturalConsequences;

  if (consequences.hairOrientationEffect) {
    parts.push(`hair behavioral state: ${consequences.hairOrientationEffect}`);
  }
  if (consequences.beddingDeformationEffect) {
    parts.push(`bedding contact effect: ${consequences.beddingDeformationEffect}`);
  }
  if (consequences.fabricTensionEffect) {
    parts.push(`garment dynamic drape: ${consequences.fabricTensionEffect}`);
  }
  if (consequences.nearbyObjectsEffect) {
    parts.push(`immediate contextual environment: ${consequences.nearbyObjectsEffect}`);
  }
  if (consequences.skinMoistureEffect) {
    parts.push(`dermal finish: ${consequences.skinMoistureEffect}`);
  }
  if (consequences.postureRelaxationEffect) {
    parts.push(`recent action relaxation: ${consequences.postureRelaxationEffect}`);
  }
  if (preCaptureContext.userCustomConsequences) {
    parts.push(preCaptureContext.userCustomConsequences);
  }

  return parts.length > 0 ? `pre-capture context: ${parts.join(', ')}` : '';
}

// 11. V3 Geometry Calibration Builder
export function buildGeometryCalibrationPrompt(state: SceneState): string {
  const { geometryCalibration } = state;
  if (!geometryCalibration) return '';

  const cam = geometryCalibration.camera;
  const subj = geometryCalibration.subject;
  const parts: string[] = [];

  parts.push(
    `exact geometric spatial calibration: subject height ${subj.heightCm}cm, camera distance ${cam.lensToFaceDistanceCm}cm, camera elevation pitch ${cam.cameraPitchDeg}°, horizontal yaw ${cam.cameraYawDeg}°, handheld roll ${cam.cameraRollDeg}°`
  );

  return parts.join(', ');
}

// 12. V3 Reference Fidelity Builder
export function buildReferenceFidelityPrompt(state: SceneState): string {
  const { referenceAnalysis } = state;
  if (!referenceAnalysis || !referenceAnalysis.isAnalyzed || referenceAnalysis.observations.length === 0) {
    return '';
  }

  const verifiedObs = referenceAnalysis.observations.filter(
    (obs) => (obs.confidence === 'clearly_visible' || obs.userVerified) && obs.value
  );

  if (verifiedObs.length === 0) return '';

  return 'reference fidelity locks: authentic cranial silhouette, exact natural follicle distribution and true facial asymmetries locked strictly to reference';
}

// Master English Prompt Assembler with V2 & V3 Scene Intelligence
export function assembleMasterPrompt(state: SceneState): { englishPrompt: string; negativePrompt: string } {
  const sections: string[] = [
    buildIdentityPrompt(state),
    buildReferenceFidelityPrompt(state),
    buildPosePrompt(state),
    buildHumanContactPhysicsPrompt(state),
    buildPreCaptureContextPrompt(state),
    buildCandidMomentPrompt(state),
    buildExpressionAndGazePrompt(state),
    buildHairPrompt(state),
    buildDynamicHairPrompt(state),
    buildFacialHairPrompt(state),
    buildClothingAndFabricPrompt(state),
    buildDynamicFabricPrompt(state),
    buildGeometricLightingPrompt(state),
    buildEnvironmentPrompt(state),
    buildSceneContinuityPrompt(state),
    buildDisorderPrompt(state),
    buildCameraPrompt(state),
    buildGeometryCalibrationPrompt(state),
    buildCloseRangeOpticsPrompt(state),
    buildMaterialResponsePrompt(state),
    buildPhotographicImperfectionsPrompt(state),
    buildUnifiedImagingPrompt(state)
  ];

  // Join sections cleanly with period separation for modern diffusion engines
  const englishPrompt = sections
    .filter((sec) => sec && sec.trim().length > 0)
    .join('. ') + '.';

  const negativePrompt = buildNegativePrompt(state);

  return { englishPrompt, negativePrompt };
}

