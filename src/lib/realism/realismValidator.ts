/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState, ValidationIssue } from '../../types/scene.ts';

export interface CrossEngineRule {
  id: string;
  severity: 'error' | 'warning' | 'info';
  titleAr: string;
  messageAr: string;
  explanationEn: string;
  conflictingFields: string[];
  canAutoCorrect: boolean;
  evaluate: (state: SceneState) => boolean;
  autoCorrect?: (state: SceneState) => SceneState;
}

export const CROSS_ENGINE_RULES: CrossEngineRule[] = [
  // 1. SITTING_UNCOMPRESSED_BED
  {
    id: 'SITTING_UNCOMPRESSED_BED',
    severity: 'warning',
    titleAr: 'جلوس على السرير دون انضغاط فيزيائي للمرتبة',
    messageAr: 'الوضعية جلوس على طرف السرير، ويجب تفعيل انضغاط المرتبة تحت الحوض لتجنب مظهر الطفو غير الواقعي.',
    explanationEn: 'Seated body weight on a mattress physically compresses the foam or spring core beneath the pelvis and thighs.',
    conflictingFields: ['pose.category', 'pose.supportSurface', 'realismIntelligence.contactPhysics.mattressPelvisCompression'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return (
        state.pose.category === 'sitting' &&
        state.pose.supportSurface === 'bed_mattress' &&
        !state.realismIntelligence.contactPhysics.mattressPelvisCompression
      );
    },
    autoCorrect: (state) => ({
      ...state,
      realismIntelligence: {
        ...state.realismIntelligence,
        contactPhysics: {
          ...state.realismIntelligence.contactPhysics,
          mattressPelvisCompression: true
        }
      }
    })
  },

  // 2. SIDE_LYING_FLAT_PILLOW
  {
    id: 'SIDE_LYING_FLAT_PILLOW',
    severity: 'warning',
    titleAr: 'استلقاء على الوسادة دون انبعاج قماشي طبيعي',
    messageAr: 'الوضعية استلقاء أو اتكاء على الوسائد، ويجب تفعيل انبعاج الوسادة تحت الرأس.',
    explanationEn: 'Resting the head against bed pillows compresses the cushion stuffing and produces realistic textile bunching.',
    conflictingFields: ['pose.category', 'realismIntelligence.contactPhysics.pillowHeadDeformation'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return (
        state.pose.category === 'reclining' &&
        !state.realismIntelligence.contactPhysics.pillowHeadDeformation
      );
    },
    autoCorrect: (state) => ({
      ...state,
      realismIntelligence: {
        ...state.realismIntelligence,
        contactPhysics: {
          ...state.realismIntelligence.contactPhysics,
          pillowHeadDeformation: true
        }
      }
    })
  },

  // 3. RAISED_ARM_SHIRT_FOLDS
  {
    id: 'RAISED_ARM_SHIRT_FOLDS',
    severity: 'info',
    titleAr: 'رفع ذراع السيلفي يتطلب سحب قماش فتحة الكم',
    messageAr: 'رفع الذراع لحمل الهاتف يشد فتحة الكم باتجاه الكتف والصدر، مما يستدعي تفعيل طيات حركة الذراع.',
    explanationEn: 'Elevating the arm to hold a phone creates tension radiating from the armhole seam toward the pectoral region.',
    conflictingFields: ['pose.freeHand', 'fabric.postureFolds.armLiftTension'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return (
        (state.pose.freeHand === 'right_holding_phone' || state.pose.freeHand === 'left_holding_phone') &&
        !state.fabric.postureFolds.armLiftTension
      );
    },
    autoCorrect: (state) => ({
      ...state,
      fabric: {
        ...state.fabric,
        postureFolds: {
          ...state.fabric.postureFolds,
          armLiftTension: true
        }
      }
    })
  },

  // 4. WET_HAIR_UNCHANGED
  {
    id: 'WET_HAIR_UNCHANGED',
    severity: 'warning',
    titleAr: 'الشعر المبلل يتطلب تكتل الخصلات وتغميق اللون',
    messageAr: 'تسريحة الشعر الرطب أو بعد الاستحمام تفرض تكتل الخصلات وتشبعًا لونيًا داكنًا تحت الإضاءة.',
    explanationEn: 'Damp hair physically clumps into cohesive locks due to water surface tension, exhibiting darker albedo and subtle specular droplets.',
    conflictingFields: ['hair.presetId', 'hair.physicsMode'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.hair.presetId === 'naturally_damp_post_shower' && state.hair.physicsMode !== 'natural_clumps';
    },
    autoCorrect: (state) => ({
      ...state,
      hair: {
        ...state.hair,
        physicsMode: 'natural_clumps'
      }
    })
  },

  // 5. COTTON_SHIRT_PLASTIC_SHINE
  {
    id: 'COTTON_SHIRT_PLASTIC_SHINE',
    severity: 'error',
    titleAr: 'تعارض لمعان الأقمشة مع القطن الطبيعي',
    messageAr: 'الملابس قطنية، لذا يُمنع أي انعكاس بلاستيكي أو لمعان مطاطي.',
    explanationEn: 'Natural cotton has a high diffuse scattering and low specular reflectance. Plastic or rubber shine is physically impossible.',
    conflictingFields: ['clothing.upper.material', 'fabric.preventPlasticGarments'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return (
        (state.clothing.upper.material === 'lightweight_cotton' || state.clothing.upper.material === 'medium_cotton') &&
        !state.fabric.preventPlasticGarments
      );
    },
    autoCorrect: (state) => ({
      ...state,
      fabric: {
        ...state.fabric,
        preventPlasticGarments: true,
        reflectance: 'matte_textile'
      }
    })
  },

  // 6. DARK_ENV_PERFECT_FACE
  {
    id: 'DARK_ENV_PERFECT_FACE',
    severity: 'warning',
    titleAr: 'البيئة المظلمة تتطلب تحبب المستشعر الطبيعي',
    messageAr: 'في الإضاءة الليلية أو إضاءة الشاشة، يظهر تحبب المستشعر الطبيعي (Sensor Noise) في مناطق الظلال المحيطة.',
    explanationEn: 'Compact smartphone sensors under low light naturally produce luminance grain and slight edge softening in shadow regions.',
    conflictingFields: ['lighting.mode', 'realismIntelligence.controlledImperfections.sensorLuminanceNoise'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return (
        (state.lighting.mode === 'phone_screen_only' || state.lighting.timeOfDay === 'night') &&
        !state.realismIntelligence.controlledImperfections.sensorLuminanceNoise
      );
    },
    autoCorrect: (state) => ({
      ...state,
      realismIntelligence: {
        ...state.realismIntelligence,
        controlledImperfections: {
          ...state.realismIntelligence.controlledImperfections,
          sensorLuminanceNoise: true
        }
      }
    })
  }
];

export function validateCrossEngineRealism(state: SceneState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const rule of CROSS_ENGINE_RULES) {
    if (rule.evaluate(state)) {
      issues.push({
        id: rule.id,
        severity: rule.severity,
        titleAr: rule.titleAr,
        messageAr: rule.messageAr,
        explanationEn: rule.explanationEn,
        conflictingFields: rule.conflictingFields,
        suggestedResolutionAr: rule.messageAr,
        canAutoCorrect: rule.canAutoCorrect
      });
    }
  }

  return issues;
}

export function autoCorrectCrossEngineRealism(state: SceneState): { correctedState: SceneState; appliedCorrections: string[] } {
  let current = { ...state };
  const applied: string[] = [];

  for (const rule of CROSS_ENGINE_RULES) {
    if (rule.canAutoCorrect && rule.autoCorrect && rule.evaluate(current)) {
      current = rule.autoCorrect(current);
      applied.push(rule.titleAr);
    }
  }

  return { correctedState: current, appliedCorrections: applied };
}
