/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Geometry-Dependent Lighting Engine
 * Every significant illumination effect has a physically plausible source with
 * geometric distance attenuation, shadow direction, and physical falloff.
 */
export function buildGeometricLightingPrompt(state: SceneState): string {
  const { lighting, realismIntelligence } = state;
  const strictness = realismIntelligence.lightingPhysicsStrictness;
  const parts: string[] = [];

  if (lighting.mode === 'phone_screen_only') {
    parts.push(
      'illumination geometry: single localized planar emitter (smartphone AMOLED screen held at ~50cm distance)',
      'directional light cast upward-forward onto bridge of nose, lips, chin, and knuckles',
      'steep inverse-square geometric light attenuation with high shadow contrast and dark unilluminated background',
      'strictly zero secondary room lamps or ambient daylight bounce'
    );
  } else if (lighting.mode === 'street_led') {
    parts.push(
      'illumination geometry: elevated municipal overhead LED luminaire at ~6m height casting crisp downward directional shadows',
      'cool-warm LED beam footprint tapering naturally along road asphalt and concrete curb bevels'
    );
  } else if (lighting.mode === 'vehicle_dashboard') {
    parts.push(
      'illumination geometry: soft ambient vehicle cabin dashboard displays casting subtle localized cool/amber glow across right cheek and steering wheel rim',
      'dim nocturnal exterior visible through tinted automotive window glass'
    );
  } else if (lighting.mode === 'natural_daylight' || lighting.mode === 'morning_daylight') {
    parts.push(
      'illumination geometry: broad architectural window opening acting as extended soft diffuse light source with realistic cosine falloff',
      'gentle directional gradient with natural interior wall bounce'
    );
  } else if (lighting.mode === 'late_afternoon') {
    parts.push(
      'illumination geometry: low-angle golden hour solar rays (~15° above horizon) casting long directional shadows and warm ambient soil/stone bounce'
    );
  } else {
    parts.push(
      `illumination geometry: physically justified ${lighting.mode.replace(/_/g, ' ')} with directional shadows matching visible light emitters`
    );
  }

  if (strictness === 'very_high') {
    parts.push(
      'physically grounded light physics strictly prohibiting unmotivated rim lights, invisible fill reflectors, or unnatural face glow'
    );
  }

  return parts.join(', ');
}

export function buildGeometricLightingNegativeTokens(state: SceneState): string[] {
  const tokens = [
    'invisible studio fill reflector',
    'decorative neon rim light',
    'unmotivated face highlights',
    'shadowless digital lighting',
    'cinematic dual-color teal and orange studio gels'
  ];

  if (state.lighting.mode === 'phone_screen_only') {
    tokens.push(
      'bright sunlit room in background',
      'glowing bedroom furniture',
      'even overhead bedroom light',
      'daylight outside window'
    );
  }

  return tokens;
}
