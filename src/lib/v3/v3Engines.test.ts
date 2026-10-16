/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';
import type { SceneState } from '../../types/scene.ts';
import { analyzeReferenceFidelity } from '../reference/referenceAnalyzer.ts';
import { validateHairstyleCompatibility } from '../reference/hairstyleCompatibility.ts';
import { validateGeometryCalibration } from '../geometry/calibration.ts';
import { calculateFramingPreview } from '../framing/framingCalculator.ts';
import { applyPreCaptureActivity } from '../timeline/preCaptureContext.ts';
import { applySinglePropertyEdit } from '../scene/sceneDiff.ts';
import { createSceneSnapshot, restoreSnapshot, migrateSceneSchema } from '../scene/sceneSnapshots.ts';
import { comparePrompts } from '../prompt/promptComparison.ts';
import { parseSceneDescription } from '../ai/deterministicInterpreter.ts';

// TEST 01: Reference contains partially hidden hairline.
// Expected: Do not infer invisible hairline structure as certain.
test('TEST 01: Reference contains partially hidden hairline does not infer invisible structure as certain', () => {
  const analysis = analyzeReferenceFidelity('https://example.com/test_face.jpg', 'test_face.jpg', {
    isPartialHairlineOccluded: true,
    hasShadows: true
  });

  const hairlineObs = analysis.observations.find((o) => o.property === 'hairline');
  assert.ok(hairlineObs, 'Hairline observation must be present');
  assert.notEqual(hairlineObs.visibility, 'clearly_visible', 'Partially occluded hairline must not be marked clearly_visible');
  assert.equal(hairlineObs.confidence, 'uncertain', 'Confidence must be uncertain when occluded');
  assert.ok(hairlineObs.value?.includes('partially occluded'), 'Value must explicitly state occlusion');
});

// TEST 02: User selects hairstyle requiring additional density.
// Expected: Compatibility warning.
test('TEST 02: Hairstyle requiring additional density triggers compatibility warning', () => {
  const modifiedHair = {
    ...INITIAL_SCENE_STATE.hair,
    presetId: 'fluffy_voluminous_pompadour' // style requiring high density
  };

  const report = validateHairstyleCompatibility(modifiedHair, INITIAL_SCENE_STATE.referenceAnalysis, true);
  assert.equal(report.isCompatible, false, 'Must flag density incompatibility');
  assert.equal(report.densityConflict, true, 'Density conflict must be true');
  assert.ok(report.warningsAr.length > 0, 'Must produce Arabic warning for user');
  assert.ok(report.warningsAr[0].includes('كثافة'), 'Warning must mention density');
});

// TEST 03: User selects physically impossible selfie distance.
// Expected: Geometry validation warning.
test('TEST 03: Physically impossible selfie distance (>75cm or excessive) triggers geometry warning', () => {
  const invalidCalibration = {
    ...INITIAL_SCENE_STATE.geometryCalibration,
    camera: {
      ...INITIAL_SCENE_STATE.geometryCalibration.camera,
      lensToFaceDistanceCm: 95 // 95cm is anatomically impossible for handheld selfie
    }
  };

  const result = validateGeometryCalibration(
    invalidCalibration,
    'front_selfie',
    'standing',
    'unsupported'
  );

  assert.equal(result.canArmReach, false, 'Arm reach must be false');
  assert.ok(result.warningsAr.length > 0, 'Must produce geometry warning');
  assert.ok(result.warningsAr.some((w) => w.includes('تتجاوز أقصى مدى تشريحي') || w.includes('95')), 'Warning must detail distance');
});

// TEST 04: Camera elevation changes.
// Expected: Framing preview updates.
test('TEST 04: Camera elevation changes update framing preview coordinates', () => {
  // Eye-level (pitch 0)
  const eyeLevel = calculateFramingPreview(55, 0, 0, 0, 'sitting');

  // Elevated camera (pitch 15)
  const elevated = calculateFramingPreview(55, 15, 0, 0, 'sitting');

  assert.notEqual(
    eyeLevel.headBox.y,
    elevated.headBox.y,
    'Head bounding box Y coordinate must update when pitch changes'
  );
  assert.notEqual(
    eyeLevel.previewState.facePositionY,
    elevated.previewState.facePositionY,
    'Face position Y offset must update'
  );
});

// TEST 05: Subject recently reclined on bed.
// Expected: Optional appropriate pillow and bedding effects.
test('TEST 05: Subject recently reclined on bed applies pillow and bedding effects', () => {
  const reclinedState = applyPreCaptureActivity(INITIAL_SCENE_STATE, 'recently_reclined', 2);

  assert.equal(reclinedState.preCaptureContext.recentActivity, 'recently_reclined');
  assert.ok(reclinedState.realismIntelligence.contactPhysics.pillowHeadDeformation, 'Must enable pillow deformation');
  assert.ok(
    reclinedState.preCaptureContext.naturalConsequences.beddingDeformationEffect?.toLowerCase().includes('pillow'),
    'Bedding consequence must mention pillow indentation'
  );
});

// TEST 06: User changes expression only.
// Expected: Clothing, room, camera and lighting remain unchanged.
test('TEST 06: User changes expression only, preserving clothing, room, camera and lighting', () => {
  const initial = INITIAL_SCENE_STATE;
  const { nextState } = applySinglePropertyEdit(
    initial,
    'expression.presetId',
    'تعبير الوجه',
    'focused_reading',
    'تعديل التعبير إلى تركيز هادئ',
    (s) => ({
      ...s,
      expression: {
        ...s.expression,
        presetId: 'focused_reading'
      }
    })
  );

  // Expression updated
  assert.equal(nextState.expression.presetId, 'focused_reading');

  // Unrelated properties strictly unchanged
  assert.deepEqual(nextState.clothing, initial.clothing, 'Clothing must be unchanged');
  assert.deepEqual(nextState.bedroomGeometry, initial.bedroomGeometry, 'Room geometry must be unchanged');
  assert.deepEqual(nextState.camera, initial.camera, 'Camera must be unchanged');
  assert.deepEqual(nextState.lighting, initial.lighting, 'Lighting must be unchanged');
  assert.deepEqual(nextState.identity.locks, initial.identity.locks, 'Identity locks must be unchanged');
});

// TEST 07: User changes lighting only.
// Expected: Identity and geometry remain unchanged.
test('TEST 07: User changes lighting only, preserving identity and geometry', () => {
  const initial = INITIAL_SCENE_STATE;
  const { nextState } = applySinglePropertyEdit(
    initial,
    'lighting.mode',
    'نمط الإضاءة',
    'bedside_lamp_only',
    'تغيير الإضاءة إلى مصباح السرير',
    (s) => ({
      ...s,
      lighting: {
        ...s.lighting,
        mode: 'bedside_lamp_only'
      }
    })
  );

  assert.equal(nextState.lighting.mode, 'bedside_lamp_only');
  assert.deepEqual(nextState.identity, initial.identity, 'Identity must be unchanged');
  assert.deepEqual(nextState.geometryCalibration, initial.geometryCalibration, 'Geometry must be unchanged');
  assert.deepEqual(nextState.hair, initial.hair, 'Hair must be unchanged');
});

// TEST 08: User restores previous scene.
// Expected: All scene values and locks restored correctly.
test('TEST 08: Restoring previous snapshot restores all scene values and locks correctly', () => {
  const snapshot = createSceneSnapshot(INITIAL_SCENE_STATE, 'Baseline Snapshot');

  // Mutate live scene
  const mutated: SceneState = {
    ...INITIAL_SCENE_STATE,
    title: 'Mutated Scene',
    camera: {
      ...INITIAL_SCENE_STATE.camera,
      angle: 'low_angle'
    },
    lighting: {
      ...INITIAL_SCENE_STATE.lighting,
      mode: 'sunset'
    }
  };

  const restored = restoreSnapshot(snapshot, mutated);

  assert.equal(restored.camera.angle, INITIAL_SCENE_STATE.camera.angle, 'Camera angle restored');
  assert.equal(restored.lighting.mode, INITIAL_SCENE_STATE.lighting.mode, 'Lighting mode restored');
  assert.equal(restored.identity.locks.hairDensity, true, 'Hair density lock preserved');
  assert.equal(restored.identity.locks.faceAndSkull, true, 'Face and skull lock preserved');
});

// TEST 09: AI provider unavailable.
// Expected: Deterministic scene processing remains functional.
test('TEST 09: When AI provider is offline/unavailable, deterministic scene processing remains functional', () => {
  const arabicQuery = 'سيلفي داخل غرفة النوم بالليل بالفانيلة البيضاء والشورت الكحلي والإضاءة من الشاشة فقط';
  const result = parseSceneDescription(arabicQuery, INITIAL_SCENE_STATE);

  assert.ok(Object.keys(result.extractedTokens).length > 0, 'Deterministic interpreter must extract tokens');
  assert.equal(result.updatedState.camera.mode, 'front_selfie', 'Identifies front selfie');
  assert.equal(result.updatedState.lighting.mode, 'phone_screen_only', 'Identifies screen-only lighting');
  assert.ok(result.updatedState.clothing.upper.colorAr.includes('أبيض'), 'Identifies white shirt');
});

// TEST 10: Prompt comparison.
// Expected: Accurate added, removed and modified sections.
test('TEST 10: Prompt comparison identifies accurate added, removed and modified sections', () => {
  const promptA = 'Authentic portrait of a young man. pose: sitting on bed. lighting: daytime sunlight.';
  const promptB = 'Authentic portrait of a young man. pose: sitting on bed. lighting: phone screen only. shot on Xiaomi 15 Ultra.';

  const comparison = comparePrompts(promptA, promptB);

  assert.ok(comparison.addedInstructions.some((a) => a.includes('Xiaomi 15 Ultra')), 'Detects added instructions');
  assert.ok(comparison.modifiedProperties.some((m) => m.includes('lighting')), 'Detects modified lighting property');
});

// TEST 11: Saved reference unavailable.
// Expected: Application reports missing reference rather than claiming identity verification.
test('TEST 11: When saved reference is unavailable, reports missing reference without claiming identity verification', () => {
  const analysis = analyzeReferenceFidelity(null, null);

  assert.equal(analysis.hasReferenceImage, false, 'Must flag that reference image is missing');
  assert.equal(analysis.isAnalyzed, false, 'Must not claim analysis was performed');
  assert.ok(
    analysis.uncertaintyNotesAr.includes('لم يتم تزويد صورة مرجعية') ||
    analysis.uncertaintyNotesAr.includes('يمتنع النظام تمامًا عن ادعاء التحقق'),
    'Must report missing reference clearly'
  );
  assert.equal(analysis.observations.length, 0, 'Observations must be empty');
});

// TEST 12: User imports an older scene file.
// Expected: Supported schema migration and validation.
test('TEST 12: Importing an older scene file executes successful schema migration and validation', () => {
  // Legacy V1/V2 partial schema without V3 fields
  const legacyScene = {
    version: 1,
    id: 'legacy_001',
    title: 'Older Version 1 Scene',
    descriptionInput: 'Older scene without V3 fields',
    environmentCategory: 'bedroom',
    locationPresetId: 'bedroom_casual_night',
    identity: {
      heightCm: 190,
      weightKg: 80,
      bodyType: 'average',
      apparentAge: 25,
      skinTone: 'wheat-tan',
      headShape: 'oval',
      facialAsymmetry: 'natural subtle',
      locks: {
        faceAndSkull: true,
        hairDensity: true
      }
    },
    lighting: {
      mode: 'phone_screen_only',
      strictRealismLock: true
    }
  };

  const migrated = migrateSceneSchema(legacyScene);

  assert.equal(migrated.version, 3, 'Must migrate to version 3');
  assert.equal(migrated.identity.heightCm, 190, 'Preserves legacy height');
  assert.ok(migrated.referenceAnalysis, 'Adds default referenceAnalysis');
  assert.ok(migrated.geometryCalibration, 'Adds default geometryCalibration');
  assert.ok(migrated.framingPreview, 'Adds default framingPreview');
  assert.ok(migrated.preCaptureContext, 'Adds default preCaptureContext');
  assert.ok(migrated.readinessStatus, 'Adds default readinessStatus');
});
