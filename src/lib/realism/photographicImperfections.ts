/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Controlled Photographic Imperfection Engine
 * Models subtle, physically motivated smartphone camera nuances rather than
 * artificial digital damage.
 */
export function buildPhotographicImperfectionsPrompt(state: SceneState): string {
  const { lighting, realismIntelligence } = state;
  const config = realismIntelligence.controlledImperfections;
  const parts: string[] = [];

  if (lighting.timeOfDay === 'night' || lighting.mode === 'phone_screen_only') {
    if (config.sensorLuminanceNoise) {
      parts.push(
        'optical imperfection: realistic smartphone CMOS low-light luminance noise fine grain in shadow regions, subtle natural detail softness in dark perimeter'
      );
    }
    if (config.highlightClippingNearSource) {
      parts.push(
        'modest highlight clipping on near skin surfaces directly facing the phone screen glow'
      );
    }
  } else {
    parts.push(
      'subtle handheld camera capture nuance: sharp primary focus plane with authentic smartphone lens MTF micro-contrast'
    );
  }

  if (config.slightOpticalAberration) {
    parts.push(
      'mild wide-angle edge chromatic dispersion and subtle corner falloff characteristic of compact smartphone optics'
    );
  }

  return parts.join(', ');
}

export function buildPhotographicImperfectionsNegativeTokens(): string[] {
  return [
    'heavy artificial film grain overlay',
    'manufactured fake facial acne',
    'invented artificial scars',
    'heavy camera shake blur',
    'glitch artifacts',
    'JPEG compression blocks',
    'dust and scratch overlays'
  ];
}
