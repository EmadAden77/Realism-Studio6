/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSceneDescription } from './deterministicInterpreter.ts';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';

test('Deterministic Interpreter: Parses complex Arabic scene accurately', () => {
  const input = 'سيلفي داخل غرفة النوم بالليل بالفانيلة البيضاء والشورت الكحلي والإضاءة من الشاشة فقط.';
  const { updatedState, extractedTokens } = parseSceneDescription(input, INITIAL_SCENE_STATE);

  assert.equal(updatedState.environmentCategory, 'bedroom');
  assert.equal(updatedState.camera.mode, 'front_selfie');
  assert.equal(updatedState.lighting.mode, 'phone_screen_only');
  assert.equal(updatedState.lighting.timeOfDay, 'night');
  assert.ok(updatedState.clothing.upper.nameEn.toLowerCase().includes('tank top') || updatedState.clothing.upper.nameEn.toLowerCase().includes('white'));
  assert.ok(updatedState.clothing.lower.nameEn.toLowerCase().includes('navy'));
  assert.ok(Object.keys(extractedTokens).length >= 4, 'Should extract at least 4 key tokens');
});

test('Deterministic Interpreter: Identifies Saudi street and thobe', () => {
  const input = 'شارع سكني في الرياض ليلًا بالثوب الأبيض تحت إضاءة الشارع';
  const { updatedState } = parseSceneDescription(input, INITIAL_SCENE_STATE);

  assert.equal(updatedState.environmentCategory, 'saudi_street');
  assert.equal(updatedState.lighting.mode, 'street_led');
  assert.ok(updatedState.clothing.upper.nameEn.toLowerCase().includes('thobe'));
});
