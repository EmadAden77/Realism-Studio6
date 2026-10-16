/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Dynamic Fabric Physics Engine
 * Models realistic textile drape, thickness, seam tension, and posture-induced folds.
 */
export function buildDynamicFabricPrompt(state: SceneState): string {
  const { clothing, fabric, pose } = state;
  if (!fabric.enabled) return '';

  const parts: string[] = [];
  const upperMat = clothing.upper.material;
  const lowerMat = clothing.lower.material;

  // Material specific behavior
  if (upperMat === 'lightweight_cotton' || upperMat === 'medium_cotton') {
    parts.push(
      'textile behavior: breathable natural cotton jersey with organic micro-creases, soft matte drape anchored at collar and shoulder seams'
    );
  } else if (upperMat === 'woven_thobe_fabric') {
    parts.push(
      'textile behavior: tailored high-thread-count Saudi thobe fabric with crisp vertical drape, clean shoulder line, and gentle rolling hem folds'
    );
  } else if (upperMat === 'athletic_polyester') {
    parts.push(
      'textile behavior: lightweight technical athletic weave with matte non-shiny micro-perforations and supple stretch response'
    );
  }

  // Lower garment
  if (lowerMat === 'medium_cotton' || lowerMat === 'lightweight_cotton') {
    parts.push('lower garment cotton weave showing natural wear creases around pocket openings and waistband');
  } else if (lowerMat === 'denim') {
    parts.push('heavyweight twill denim with structural stiffness, distinct whiskering folds at hip flexure, and sturdy double-stitched seams');
  }

  // Localized force transfer from an explicitly chosen free-hand action.
  const handAction = state.v5Context?.handAction || 'none';
  if (handAction === 'pinch_sleeve') {
    parts.push('localized finger pinch at the existing sleeve hem creates radial tension folds and minute contact shadow; fabric outside the grip follows gravity');
  } else if (handAction === 'lift_duvet' && (state.environmentCategory === 'bedroom' || state.environmentCategory === 'home_general')) {
    parts.push('duvet edge lifted from an actual grip point, with material thickness, downward sag and believable occlusion of the fingers');
  }
  if (clothing.outer) {
    parts.push('separate inner and outer fabric layers with non-intersecting hems, independent folds and contact shadows where they overlap');
  }

  // Posture specific fold geometry
  if (pose.category === 'sitting') {
    parts.push(
      'posture response: realistic horizontal compression folds bunched along hip crease, fabric slack resting over thighs conforming to gravity'
    );
  } else if (pose.category === 'reclining') {
    parts.push(
      'posture response: upper back and shoulder blade fabric pressed flat against bedding, loose torso material pooling naturally toward sides'
    );
  } else if (pose.category === 'standing') {
    parts.push(
      'posture response: vertical gravitational drape hanging cleanly with diagonal tension slanting toward weighted hip'
    );
  }

  if (fabric.preventPlasticGarments) {
    parts.push(
      'strictly natural textile surface roughness with zero latex or rubber sheen, no painted-on vacuum seal effect'
    );
  }

  return parts.join(', ');
}

export function buildDynamicFabricNegativeTokens(): string[] {
  return [
    'plastic clothing',
    'rubber cotton shirt',
    'vacuum sealed clothes',
    'painted-on clothing',
    'shiny latex reflection on t-shirt',
    'weightless floating cloth',
    'unmotivated random geometric wrinkles'
  ];
}
