/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Close-Range Optical Geometry Engine
 * Models authentic handheld smartphone perspective for Xiaomi 15 Ultra
 * (21mm equivalent front lens or 23mm rear lens) at realistic 45-65cm reach.
 */
export function buildCloseRangeOpticsPrompt(state: SceneState): string {
  const { camera, pose, realismIntelligence } = state;
  const strictness = realismIntelligence.opticalGeometryStrictness;
  const parts: string[] = [];

  if (camera.mode === 'front_selfie') {
    parts.push(
      'close-range optical geometry: authentic 21mm equivalent ultra-wide smartphone selfie perspective captured at handheld arm reach (~50-55cm)'
    );
    parts.push(
      'subtle natural perspective foreshortening characteristic of wide front optics, slightly larger near forearm and shoulder in lower periphery without cartoonish distortion'
    );
    parts.push(
      'broad spatial depth showing background geometry with authentic rectilinear perspective convergence'
    );
  } else if (camera.mode === 'rear_main_self_capture') {
    parts.push(
      'optical geometry: 23mm equivalent primary lens with large 1-inch sensor, mild natural optical focus falloff in far background'
    );
  } else if (camera.mode === 'mirror_selfie') {
    parts.push(
      'mirror optical geometry: planar reflective perspective with phone body visible at chest height, double virtual distance showing crisp reflection'
    );
  }

  if (camera.naturalHandheldRollDeg !== 0) {
    parts.push(
      `subtle organic handheld camera roll angle of ${camera.naturalHandheldRollDeg > 0 ? '+' : ''}${camera.naturalHandheldRollDeg}° from absolute horizontal`
    );
  }

  if (strictness === 'high') {
    parts.push(
      'strictly avoid compressed telephoto 85mm portrait studio look, preserve true wide-angle smartphone optical intimacy'
    );
  }

  return parts.join(', ');
}

export function buildCloseRangeOpticsNegativeTokens(): string[] {
  return [
    '85mm telephoto compressed portrait',
    'studio portrait lens compression',
    'exaggerated fisheye barrel warping',
    'impossible floating camera vantage',
    'two-meter selfie arm reach'
  ];
}
