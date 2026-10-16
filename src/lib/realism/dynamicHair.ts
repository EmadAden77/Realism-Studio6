/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Dynamic Hair Physics Engine
 * Respects hairline and observed density while allowing physical interactions
 * (pillow compression, sleep displacement, organic clumping, gravity).
 */
export function buildDynamicHairPrompt(state: SceneState): string {
  const { hair, pose } = state;
  const parts: string[] = [];

  if (hair.densityLock) {
    parts.push(
      'hair physics: preserving exact biological hairline recession and natural follicle density'
    );
  }

  // Environmental interaction
  if (pose.category === 'reclining' || pose.presetId.includes('pillows') || pose.presetId.includes('bed')) {
    parts.push(
      'hair displacement: subtle localized flattening along the side or back of head where resting against pillow, with naturally ruffled adjacent locks'
    );
  } else if (hair.presetId === 'after_waking_bedhead') {
    parts.push(
      'hair displacement: authentic morning bedhead with asymmetric sleep creases and casual unstyled texture'
    );
  } else if (hair.presetId === 'naturally_damp_post_shower') {
    parts.push(
      'hair displacement: damp post-shower strand clumping with darker saturated tones, realistic cohesion, and soft droplet highlights'
    );
  } else {
    parts.push(
      'hair displacement: natural grouped lock separation obeying gravitational direction without stiff hair wax'
    );
  }

  const handAction = state.v5Context?.handAction || 'none';
  if (handAction === 'touch_hair') {
    parts.push('hand touches and temporarily displaces the existing locks at the true contact point; exposed scalp and temple recession retain reference density, no new strands');
  }
  if (state.v5Context?.climate === 'after_workout') {
    parts.push('only context-supported subtle strand grouping from post-exercise moisture; no automatically wet scalp or additional hair growth');
  }

  if (hair.preventArtificialThickening) {
    parts.push(
      'strictly no artificial hair thickening, no synthetic hairline advancement, no helmet-like wig block density'
    );
  }

  return parts.join(', ');
}

export function buildDynamicHairNegativeTokens(): string[] {
  return [
    'helmet hair',
    'doll hair wig',
    'CGI string hair strands',
    'artificially filled temple recession',
    'thickened synthetic hairline',
    'perfectly parallel individual hair overlays',
    'shiny plastic hair wax look'
  ];
}
