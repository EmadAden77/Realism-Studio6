/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateScene, autoCorrectScene } from './rules.ts';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';
import type { SceneState } from '../../types/scene.ts';

test('Physics Validation: Clean default scene has 0 validation errors', () => {
  const issues = validateScene(INITIAL_SCENE_STATE);
  const errors = issues.filter((i) => i.severity === 'error');
  assert.equal(errors.length, 0, 'Default preset should not have any contradiction errors');
});

test('Physics Validation: FRONT_CAMERA_REAR_OPTICS flags rear optics on front selfie camera', () => {
  const testState: SceneState = {
    ...INITIAL_SCENE_STATE,
    camera: {
      ...INITIAL_SCENE_STATE.camera,
      mode: 'front_selfie',
      focalLengthEquivMm: 23, // Rear focal length!
      aperture: 'f/1.63' // Rear aperture!
    }
  };

  const issues = validateScene(testState);
  const conflict = issues.find((i) => i.id === 'FRONT_CAMERA_REAR_OPTICS');
  assert.ok(conflict, 'Should detect FRONT_CAMERA_REAR_OPTICS conflict');
  assert.equal(conflict?.severity, 'error');

  // Verify autoCorrectScene fixes it
  const { correctedState, appliedCorrections } = autoCorrectScene(testState);
  assert.equal(correctedState.camera.focalLengthEquivMm, 21);
  assert.equal(correctedState.camera.aperture, 'f/2.0');
  assert.ok(appliedCorrections.length > 0);
});

test('Physics Validation: SCREEN_ONLY_EXTRA_LIGHT flags secondary lamps or daytime in screen-only mode', () => {
  const testState: SceneState = {
    ...INITIAL_SCENE_STATE,
    lighting: {
      ...INITIAL_SCENE_STATE.lighting,
      mode: 'phone_screen_only',
      timeOfDay: 'day', // Daylight contradiction!
      secondarySourceEnabled: true // Active ceiling bulb contradiction!
    }
  };

  const issues = validateScene(testState);
  const conflict = issues.find((i) => i.id === 'SCREEN_ONLY_EXTRA_LIGHT');
  assert.ok(conflict, 'Should detect SCREEN_ONLY_EXTRA_LIGHT conflict');

  const { correctedState } = autoCorrectScene(testState);
  assert.equal(correctedState.lighting.timeOfDay, 'night');
  assert.equal(correctedState.lighting.secondarySourceEnabled, false);
});

test('Physics Validation: CAMERA_REACH_INVALID detects impossible arm reach (>75cm)', () => {
  const testState: SceneState = {
    ...INITIAL_SCENE_STATE,
    camera: {
      ...INITIAL_SCENE_STATE.camera,
      mode: 'front_selfie'
    },
    pose: {
      ...INITIAL_SCENE_STATE.pose,
      selfieArmDistanceCm: 90 // Human arm is not 90cm!
    }
  };

  const issues = validateScene(testState);
  const conflict = issues.find((i) => i.id === 'CAMERA_REACH_INVALID');
  assert.ok(conflict, 'Should detect impossible arm reach');

  const { correctedState } = autoCorrectScene(testState);
  assert.equal(correctedState.pose.selfieArmDistanceCm, 55);
});
