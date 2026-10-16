/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

/**
 * Material Reflection and Surface Engine
 * Physically differentiates materials across the scene (subsurface skin, matte plaster,
 * satin ceramic, coarse asphalt, natural cotton).
 */
export function buildMaterialResponsePrompt(state: SceneState): string {
  const { environmentCategory, realismIntelligence } = state;
  if (!realismIntelligence.materialPhysicsEnforcement) return '';

  const parts: string[] = [
    'material optical response: anatomically authentic human skin showing subtle subsurface light scattering, microscopic pore texture, natural sebaceous highlights on nose bridge without waxy glaze'
  ];

  if (environmentCategory === 'bedroom' || environmentCategory === 'home_general') {
    parts.push(
      'matte architectural plaster walls with diffuse micro-texture absorbing direct light, unpolished dark wood furniture with low-gloss satin sheen, cool non-reflective ceramic tile floor'
    );
  } else if (environmentCategory === 'saudi_street') {
    parts.push(
      'granular weathered asphalt surface with realistic dry mineral aggregate texture, matte pigmented concrete curb paint, non-glossy exterior masonry'
    );
  } else if (environmentCategory === 'cafe') {
    parts.push(
      'matte ceramic glaze on coffee mug with specular liquid reflections, natural open-grain oak table surface with micro-roughness'
    );
  } else if (environmentCategory === 'vehicle') {
    parts.push(
      'automotive interior: textured pebbled leather steering wheel, matte dashboard polymers with anti-reflective coating, realistic clear window glass refraction'
    );
  }

  return parts.join(', ');
}

export function buildMaterialResponseNegativeTokens(): string[] {
  return [
    'waxy plastic skin',
    'porcelain mannequin finish',
    'glossy matte walls',
    'wet-looking dry asphalt',
    'mirror-polished unfinished wood',
    'synthetic silicone skin texture',
    'uniform plastic material shader'
  ];
}
