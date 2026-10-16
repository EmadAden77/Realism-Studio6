/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState, SpatialObject3D } from '../../types/scene.ts';

export const DEFAULT_BEDROOM_SPATIAL_OBJECTS: SpatialObject3D[] = [
  { id: 'queen_bed', name: 'Queen Bed', x: 0, y: -0.8, z: 0.28, widthM: 1.6, depthM: 2.0, heightM: 0.55, isFixed: true },
  { id: 'dark_headboard', name: 'Dark Wood Headboard', x: 0, y: -1.8, z: 0.6, widthM: 1.75, depthM: 0.1, heightM: 1.1, isFixed: true },
  { id: 'nightstand_right', name: 'Bedside Nightstand', x: 1.1, y: -1.75, z: 0.25, widthM: 0.5, depthM: 0.45, heightM: 0.5, isFixed: true },
  { id: 'bedroom_window', name: 'Curtained Window', x: -2.5, y: 0.2, z: 1.4, widthM: 1.4, depthM: 0.1, heightM: 1.6, isFixed: true },
  { id: 'wardrobe_closet', name: 'Dark Wardrobe', x: 2.2, y: 0.8, z: 1.1, widthM: 1.8, depthM: 0.65, heightM: 2.2, isFixed: true },
  { id: 'entry_door', name: 'Bedroom Door', x: -1.8, y: 2.8, z: 1.0, widthM: 0.95, depthM: 0.08, heightM: 2.1, isFixed: true }
];

/**
 * Persistent 3D Scene Memory Engine
 * Computes visible objects and spatial perspective consistency based on camera mode and angle.
 */
export function buildSceneContinuityPrompt(state: SceneState): string {
  const { environmentCategory, bedroomGeometry, camera, realismIntelligence } = state;
  if (!realismIntelligence.sceneContinuityLock) return '';

  if (environmentCategory === 'bedroom') {
    const parts: string[] = [
      `persistent 3D room memory: residential room coordinates (6.2m length x 5.2m width x 2.9m ceiling height)`,
      'bed positioned securely along central wall with dark headboard directly anchored behind head'
    ];

    if (camera.angle === 'eye_level' || camera.angle === 'slightly_elevated') {
      parts.push('view reveals upper headboard wood grain, corner of bedside nightstand, and matte cream wall surface in background');
    } else if (camera.angle === 'reclining_angle') {
      parts.push('low angle perspective showing headboard expanse and neutral ceiling expanse above, nightstand partially occluded');
    }

    parts.push('fixed architectural layout preserving spatial continuity across viewpoint changes without warping or furniture repositioning');
    return parts.join(', ');
  }

  return 'persistent spatial continuity preserving background architectural boundaries';
}

export function buildSceneContinuityNegativeTokens(): string[] {
  return [
    'teleporting furniture',
    'inconsistent room layout',
    'shifting bedroom headboard position',
    'vanishing bedside table',
    'morphing room architecture'
  ];
}
