/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';
import type { SceneState } from '../../types/scene.ts';
import { assembleMasterPrompt } from '../prompt/promptBuilder.ts';
import { validateScene, autoCorrectScene } from '../validation/rules.ts';
import { evaluateGeneratedImageLocally } from './imageReview.ts';
import { auditAndReduceExaggerations } from './exaggerationReduction.ts';

test('V2 Realism: Bedroom front-camera selfie with phone-screen-only lighting', () => {
  const { englishPrompt, negativePrompt } = assembleMasterPrompt(INITIAL_SCENE_STATE);

  // Optical geometry
  assert.ok(englishPrompt.includes('21mm equivalent ultra-wide'), 'Prompt must specify 21mm wide lens');
  assert.ok(englishPrompt.includes('f/2.0 aperture'), 'Prompt must specify f/2.0 aperture');

  // Screen-only illumination geometry
  assert.ok(englishPrompt.includes('single localized planar emitter'), 'Must identify phone screen geometry');
  assert.ok(englishPrompt.includes('inverse-square geometric light attenuation'), 'Must enforce physical light falloff');

  // Contact physics
  assert.ok(englishPrompt.includes('mattress surface under pelvis and thighs'), 'Must model mattress compression');

  // Negative tokens
  assert.ok(negativePrompt.includes('invisible studio fill reflector'), 'Must forbid invisible fill lights');
  assert.ok(negativePrompt.includes('85mm telephoto compressed portrait'), 'Must forbid 85mm studio compression');
});

test('V2 Realism: Side-lying subject causing realistic pillow compression', () => {
  const recliningState: SceneState = {
    ...INITIAL_SCENE_STATE,
    pose: {
      ...INITIAL_SCENE_STATE.pose,
      category: 'reclining',
      presetId: 'reclining_pillows_casual'
    }
  };

  const { englishPrompt } = assembleMasterPrompt(recliningState);
  assert.ok(englishPrompt.includes('resting naturally on supportive bed pillows'), 'Must describe head indentation on pillows');
  assert.ok(englishPrompt.includes('hair displacement: subtle localized flattening'), 'Must describe natural hair flattening against pillow');
});

test('V2 Realism: Adjusting cotton shirt creates tension radiating from grip point', () => {
  const adjustingState: SceneState = {
    ...INITIAL_SCENE_STATE,
    pose: {
      ...INITIAL_SCENE_STATE.pose,
      category: 'interaction',
      presetId: 'candid_adjusting_collar',
      candidAction: 'Fingers pinch shirt collar rim'
    }
  };

  const { englishPrompt } = assembleMasterPrompt(adjustingState);
  assert.ok(englishPrompt.includes('strictly from the physical pinch/grip point'), 'Tension must originate at grip point');
});

test('V2 Realism: Nighttime Saudi residential street lit by municipal LED', () => {
  const streetState: SceneState = {
    ...INITIAL_SCENE_STATE,
    environmentCategory: 'saudi_street',
    locationPresetId: 'saudi_villa_street_night',
    lighting: {
      ...INITIAL_SCENE_STATE.lighting,
      mode: 'street_led',
      timeOfDay: 'night'
    },
    camera: {
      ...INITIAL_SCENE_STATE.camera,
      mode: 'rear_main_self_capture',
      focalLengthEquivMm: 23,
      aperture: 'f/1.63'
    }
  };

  const { englishPrompt, negativePrompt } = assembleMasterPrompt(streetState);
  assert.ok(englishPrompt.includes('elevated municipal overhead LED luminaire'), 'Must model street LED lighting');
  assert.ok(englishPrompt.includes('weathered asphalt surface'), 'Must model asphalt texture');
  assert.ok(negativePrompt.includes('orientalist fantasy bazaar'), 'Must forbid orientalist cliches');
});

test('V2 Realism: Cross-Engine Validator detects sitting without mattress compression and auto-corrects', () => {
  const invalidState: SceneState = {
    ...INITIAL_SCENE_STATE,
    pose: {
      ...INITIAL_SCENE_STATE.pose,
      category: 'sitting',
      supportSurface: 'bed_mattress'
    },
    realismIntelligence: {
      ...INITIAL_SCENE_STATE.realismIntelligence,
      contactPhysics: {
        ...INITIAL_SCENE_STATE.realismIntelligence.contactPhysics,
        mattressPelvisCompression: false // Disabling creates conflict!
      }
    }
  };

  const issues = validateScene(invalidState);
  const sittingIssue = issues.find((i) => i.id === 'SITTING_UNCOMPRESSED_BED');
  assert.ok(sittingIssue, 'Must detect uncompressed bed conflict');

  const { correctedState } = autoCorrectScene(invalidState);
  assert.equal(correctedState.realismIntelligence.contactPhysics.mattressPelvisCompression, true, 'Auto-correct must re-enable mattress compression');
});

test('V2 Realism: Exaggeration Reduction catches dramatic Hollywood lighting in bedroom', () => {
  const badPrompt = 'Ultra cinematic dramatic studio light with luxurious chandelier and glowing ethereal skin.';
  const audit = auditAndReduceExaggerations(badPrompt, INITIAL_SCENE_STATE);
  assert.equal(audit.isClean, false);
  assert.ok(audit.detectedExaggerations.length >= 2, 'Should flag multiple exaggerations');
});

test('V2 Realism: Image Review Module generates targeted physical inspection checklist', () => {
  const review = evaluateGeneratedImageLocally('data:image/png;base64,sample', INITIAL_SCENE_STATE);
  assert.ok(review.analysisCompleted);
  assert.ok(review.reviewItems.length >= 3, 'Must include arm reach, hair density, and lighting reviews');
});
