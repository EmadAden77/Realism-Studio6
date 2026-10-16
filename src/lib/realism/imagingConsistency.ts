/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Unified Smartphone Imaging Consistency Engine
 * Ensures face, skin, hair, beard, clothing, body, and background behave as if
 * processed through one coherent smartphone imaging pipeline.
 */
export function buildUnifiedImagingPrompt(state: SceneState): string {
  const { realismIntelligence, camera } = state;
  const config = realismIntelligence.unifiedSmartphoneImaging;

  if (!config.enabled) return '';

  const tokens: string[] = [
    'unified smartphone camera image processing pipeline across subject, face, attire, and background'
  ];

  if (config.prohibitFaceOnlyBeautyDenoise) {
    tokens.push(
      'strictly no selective facial skin beautification or isolated facial denoising',
      'consistent optical noise floor and natural sensor grain matching local illumination across entire frame'
    );
  }

  if (config.coherentToneMapping) {
    tokens.push(
      'restrained computational HDR tone mapping preserving natural shadow falloff and realistic highlight rolloff near light sources'
    );
  }

  if (config.prohibitArtificialPortraitBlur) {
    tokens.push(
      'no artificial software depth-map segmentation blur or synthetic cutout edges around hair'
    );
  }

  return tokens.join(', ');
}

export function buildUnifiedImagingNegativeTokens(state: SceneState): string[] {
  return [
    'face-only beauty smoothing',
    'selective facial airbrushing',
    'isolated sharp face against blurry low-res body',
    'split processing style',
    'uniform artificial grain filter overlay',
    'halo glowing skin against dark room',
    'digital cutout portrait mask',
    'computational HDR halo artifacts'
  ];
}
