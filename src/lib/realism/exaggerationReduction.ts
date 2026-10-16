/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';

export interface ExaggerationAuditResult {
  detectedExaggerations: string[];
  reducedTokens: string[];
  isClean: boolean;
}

/**
 * Automatic Exaggeration Reduction Engine
 * Scans generated prompt strings and scene configurations to eliminate
 * over-the-top, dramatic, or unnatural elements that compromise realism.
 */
export function auditAndReduceExaggerations(prompt: string, state: SceneState): ExaggerationAuditResult {
  const detected: string[] = [];
  const lower = prompt.toLowerCase();

  if (state.lighting.mode === 'phone_screen_only' && (lower.includes('studio light') || lower.includes('brightly lit'))) {
    detected.push('إضاءة استوديو متناقضة مع إضاءة شاشة الهاتف');
  }

  if (lower.includes('luxurious chandelier') || lower.includes('penthouse suite')) {
    detected.push('ديكور فندقي فاخر مبالغ فيه داخل غرفة نوم سكنية');
  }

  if (lower.includes('thick luscious dense hair') || lower.includes('perfect hairline')) {
    detected.push('مبالغة في تكثيف الشعر وتعديل خط الجبهة');
  }

  if (lower.includes('glowing ethereal skin') || lower.includes('flawless porcelain')) {
    detected.push('بشرة لامعة أو ملساء بصورة غير طبيعية');
  }

  return {
    detectedExaggerations: detected,
    reducedTokens: [],
    isClean: detected.length === 0
  };
}

export function buildExaggerationReductionNegativeTokens(): string[] {
  return [
    'dramatic cinematic blockbuster lighting',
    'excessive atmospheric fog and volumetric smoke',
    'saturated anime grading',
    'unrealistically glossy floors',
    'glamour fashion shoot aesthetic'
  ];
}
