/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { assembleMasterPrompt } from './promptBuilder.ts';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';

test('Prompt Builder: Assembles physically grounded English prompt', () => {
  const { englishPrompt, negativePrompt } = assembleMasterPrompt(INITIAL_SCENE_STATE);

  // Assert essential physical optical tokens
  assert.ok(englishPrompt.includes('Xiaomi 15 Ultra'), 'Must mention device Xiaomi 15 Ultra');
  assert.ok(englishPrompt.includes('21mm'), 'Must include 21mm front selfie focal length');
  assert.ok(englishPrompt.includes('f/2.0'), 'Must include f/2.0 aperture');
  assert.ok(englishPrompt.includes('phone screen'), 'Must include phone screen illumination');
  assert.ok(englishPrompt.includes('Saudi Arabian'), 'Must include Saudi identity');
  assert.ok(englishPrompt.includes('193cm tall'), 'Must include height 193cm');
  assert.ok(englishPrompt.includes('83kg'), 'Must include weight 83kg');
  assert.ok(englishPrompt.includes('White ribbed-cotton'), 'Must include upper garment');
  assert.ok(englishPrompt.includes('Navy-blue'), 'Must include lower garment');

  // Assert negative prompt anti-CGI slop tokens
  assert.ok(negativePrompt.includes('plastic skin'), 'Negative prompt must forbid plastic skin');
  assert.ok(negativePrompt.includes('unmotivated rim light'), 'Negative prompt must forbid fake rim light');
  assert.ok(negativePrompt.includes('ceiling room lights'), 'Negative prompt in screen-only mode must forbid ceiling room lights');
});
