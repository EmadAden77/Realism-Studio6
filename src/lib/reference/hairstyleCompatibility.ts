/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HairState, ReferenceAnalysisState, SceneState } from '../../types/scene.ts';

export interface HairstyleCompatibilityReport {
  isCompatible: boolean;
  densityConflict: boolean;
  hairlineConflict: boolean;
  lengthConflict: boolean;
  warningsAr: string[];
  warningsEn: string[];
  suggestionsAr: string[];
  suggestedAction: 'preserve_reference' | 'adapt_density' | 'restore_original';
}

export function validateHairstyleCompatibility(
  hair: HairState,
  referenceAnalysis?: ReferenceAnalysisState,
  identityHairDensityLock: boolean = true
): HairstyleCompatibilityReport {
  const warningsAr: string[] = [];
  const warningsEn: string[] = [];
  const suggestionsAr: string[] = [];

  let densityConflict = false;
  let hairlineConflict = false;
  let lengthConflict = false;

  // Check if hairstyle preset requests synthetic thickening
  const highDensityStyles = ['fluffy_voluminous_pompadour', 'ultra_thick_taper', 'afro_textured_heavy_fade', 'voluminous_wave'];
  const isHighDensityRequested = highDensityStyles.includes(hair.presetId);

  // If density lock is active and a high density style is requested
  if (identityHairDensityLock && isHighDensityRequested) {
    densityConflict = true;
    warningsAr.push(
      'تحذير تعارض كثافة الشعر: التسريحة المختارة تتطلب كثافة شعر أعلى من كثافة المرجع الطبيعية المحفوظة بقفل الكثافة.'
    );
    warningsEn.push(
      'Hairstyle density conflict: Selected style requires artificial hair density exceeding the locked reference baseline.'
    );
    suggestionsAr.push('الحفاظ على كثافة المرجع وتطبيق التسريحة بنفس سمك الشعر الطبيعي دون نفخ أو حشو رقمي.');
    suggestionsAr.push('العودة إلى تسريحة طبيعية متوافقة مع خط الشعر الأصلي.');
  }

  // Check hairline alteration
  if (hair.length === 'custom' && hair.customNotes.includes('lower hairline')) {
    hairlineConflict = true;
    warningsAr.push('تحذير خط الشعر: محاولة تقديم خط الشعر للأمام تخالف خط الجبهة الطبيعي للشخصية.');
    warningsEn.push('Hairline conflict: Attempting to advance frontal hairline violates authentic anatomy.');
  }

  // Check length conflict with reference
  if (hair.length === 'medium' && hair.presetId === 'buzz_cut') {
    lengthConflict = true;
    warningsAr.push('تعارض في الطول: تم اختيار حلاقة قصيرة جدًا (Buzz Cut) مع ضبط الطول على متوسط.');
    warningsEn.push('Length conflict: Buzz cut selected while hair length is set to medium.');
  }

  const isCompatible = !densityConflict && !hairlineConflict && !lengthConflict;

  return {
    isCompatible,
    densityConflict,
    hairlineConflict,
    lengthConflict,
    warningsAr,
    warningsEn,
    suggestionsAr,
    suggestedAction: densityConflict ? 'preserve_reference' : 'restore_original'
  };
}

/**
 * Auto-corrects hairstyle settings to ensure physical reference compatibility
 */
export function enforceCompatibleHairstyle(state: SceneState): SceneState {
  return {
    ...state,
    hair: {
      ...state.hair,
      densityLock: true,
      preventArtificialThickening: true,
      direction: 'original',
      length: 'original'
    },
    referenceAnalysis: {
      ...state.referenceAnalysis,
      hairCompatibility: {
        isCompatible: true,
        hairlinePreserved: true,
        densityPreserved: true,
        warnings: [],
        suggestions: ['تمت استعادة كثافة الشعر الأصلية وتوافق خط النمو مع المرجع بنجاح.']
      }
    }
  };
}
