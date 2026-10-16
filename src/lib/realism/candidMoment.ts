/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Candid Capture Moment Engine
 * Models a believable instantaneous slice-of-life moment rather than a static staged mannequin pose.
 */
export function buildCandidMomentPrompt(state: SceneState): string {
  const { realismIntelligence, pose } = state;
  const level = realismIntelligence.candidMotionIntensity;
  const parts: string[] = [];

  if (level === 'still_natural') {
    parts.push(
      'candid timing: calm unhurried resting moment, body settled into resting equilibrium with quiet stillness'
    );
  } else if (level === 'slightly_spontaneous') {
    parts.push(
      'candid timing: spontaneous brief pause, shoulders relaxed downward, subtle micro-turn of the head'
    );
  } else if (level === 'everyday_candid') {
    parts.push(
      'candid timing: authentic everyday slice-of-life snapshot caught between natural micro-motions',
      'relaxed facial muscles mid-breath, unforced posture with subtle natural asymmetry in shoulder height and hand relaxation'
    );
  } else if (level === 'active_moment') {
    parts.push(
      'candid timing: mid-action snapshot capturing brief spontaneous micro-gesture or momentary casual adjustment without artificial blur'
    );
  }

  if (pose.candidAction) {
    parts.push(`micro-action context: ${pose.candidAction}`);
  }

  return parts.join(', ');
}

export function buildCandidMomentNegativeTokens(): string[] {
  return [
    'stiff catalog mannequin pose',
    'frozen forced smile for camera',
    'rigid military posture',
    'staged commercial billboard look',
    'overacted facial emotion',
    'exaggerated dramatic movement blur'
  ];
}
