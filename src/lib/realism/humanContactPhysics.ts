/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Human Weight, Pressure and Contact Engine
 * Models realistic body-support surfaces, center of gravity, compression of
 * mattresses and pillows, and anatomical mechanics.
 */
export function buildHumanContactPhysicsPrompt(state: SceneState): string {
  const { pose, realismIntelligence } = state;
  const contact = realismIntelligence.contactPhysics;
  const parts: string[] = [];

  if (pose.category === 'sitting') {
    if (contact.mattressPelvisCompression && pose.supportSurface === 'bed_mattress') {
      parts.push(
        'contact mechanics: realistic downward bodyweight compression depressing the mattress surface under pelvis and thighs with radial creasing on bedsheet'
      );
    } else if (pose.supportSurface === 'chair' || pose.supportSurface === 'car_seat') {
      parts.push(
        'contact mechanics: anatomically supported lumbar posture and firm seat cushion compression under hips'
      );
    }
  } else if (pose.category === 'reclining') {
    if (contact.pillowHeadDeformation) {
      parts.push(
        'contact mechanics: head resting naturally on supportive bed pillows causing soft physical indentation and realistic pillow fabric bunching'
      );
    }
    parts.push(
      'upper torso and shoulder blades resting firmly with physical contact against headboard and bed sheets without floating'
    );
  } else if (pose.category === 'standing') {
    parts.push(
      'contact mechanics: natural bipedal weight distribution with grounded foot placement adhering to gravitational floor plane'
    );
  }

  if (contact.armReachAnatomicalAnchor) {
    parts.push(
      `arm biomechanics: forearm and wrist positioned at natural ${pose.selfieArmDistanceCm}cm distance, anchored through anatomically relaxed shoulder and clavicle girdle`
    );
  }

  if (contact.gripPointTensionOrigination && pose.category === 'interaction') {
    parts.push(
      'clothing interaction: localized tension lines radiating outward strictly from the physical pinch/grip point of fingers'
    );
  }

  return parts.join(', ');
}

export function buildHumanContactNegativeTokens(): string[] {
  return [
    'floating body above bed',
    'uncompressed rigid pillow under head',
    'flat unyielding mattress under sitting subject',
    'impossible shoulder dislocation',
    'elongated rubbery selfie arm',
    'floating torso without back support',
    'disconnected fingers',
    'weightless levitation posture'
  ];
}
