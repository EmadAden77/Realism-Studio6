import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_SCENE_STATE } from '../presets/data';
import { buildV5Prompt, buildV5Negative, validateV5, getV5 } from './contextualPhysics';
import type { SceneState } from '../../types/scene';

const withV5 = (v5Context: SceneState['v5Context']): SceneState => ({
  ...INITIAL_SCENE_STATE,
  v5Context
});

describe('V5 contextual physics', () => {
  it('uses safe defaults with existing scenes', () => {
    assert.equal(getV5(INITIAL_SCENE_STATE).relationLock, true);
  });
  it('creates causal grip instructions only when requested', () => {
    const state = withV5({ ...getV5(INITIAL_SCENE_STATE), handAction: 'pinch_sleeve' });
    assert.match(buildV5Prompt(state), /actual grip/);
    assert.match(buildV5Negative(state), /extra fingers/);
  });
  it('keeps optional moisture out of neutral context', () => {
    assert.doesNotMatch(buildV5Prompt(INITIAL_SCENE_STATE), /perspiration/);
  });
  it('warns when a mirror reflection conflicts with camera mode', () => {
    const state = withV5({ ...getV5(INITIAL_SCENE_STATE), reflection: 'mirror' });
    assert.ok(validateV5(state).some(issue => issue.id === 'V5_REFLECTION_MODE'));
  });
  it('changes the instruction for prompt length', () => {
    const base = getV5(INITIAL_SCENE_STATE);
    assert.notEqual(buildV5Prompt(withV5({...base,promptLength:'concise'})), buildV5Prompt(withV5({...base,promptLength:'detailed'})));
  });
});
