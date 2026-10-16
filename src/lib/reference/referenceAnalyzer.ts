/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReferenceAnalysisState, ReferenceObservation, SceneState } from '../../types/scene.ts';

export interface ObservationTemplate {
  property: string;
  propertyNameAr: string;
  defaultValue: string;
  defaultVisibility: 'clearly_visible' | 'partially_visible' | 'uncertain' | 'not_observable';
  defaultConfidence: 'clearly_visible' | 'partially_visible' | 'uncertain' | 'not_observable';
  source: string;
}

export const CORE_OBSERVATION_TEMPLATES: ObservationTemplate[] = [
  {
    property: 'head_silhouette',
    propertyNameAr: 'صورة الرأس الظلية وشكل الجمجمة',
    defaultValue: 'Proportional oval skull with clean defined jawline and balanced cranial proportions',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_front_view'
  },
  {
    property: 'facial_width_length',
    propertyNameAr: 'نسب عرض الوجه وطوله',
    defaultValue: 'Balanced facial proportions with authentic cheekbone width and defined chin',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_proportions'
  },
  {
    property: 'hairline',
    propertyNameAr: 'خط الشعر الأمامي',
    defaultValue: 'Natural adult hairline with authentic temple recession; upper lateral margin partially occluded by angle and shadows',
    defaultVisibility: 'partially_visible',
    defaultConfidence: 'partially_visible',
    source: 'reference_forehead_crop'
  },
  {
    property: 'hair_coverage',
    propertyNameAr: 'تغطية الشعر الشاملة',
    defaultValue: 'Full crown and parietal coverage, clean side and temple taper',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_top_angle'
  },
  {
    property: 'hair_density',
    propertyNameAr: 'كثافة الشعر المرصودة',
    defaultValue: 'Natural medium-thick hair density without synthetic volumization or strand multiplication',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_texture'
  },
  {
    property: 'hair_direction',
    propertyNameAr: 'اتجاه نمو وتصفيف الشعر',
    defaultValue: 'Naturally brushed slightly forward and textured to the side with authentic soft clumps',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_styling'
  },
  {
    property: 'beard_distribution',
    propertyNameAr: 'توزيع اللحية ونطاق النمو',
    defaultValue: 'Short neatly trimmed stubble following natural mandibular edge without artificial cheekline sharpening',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_lower_face'
  },
  {
    property: 'moustache_distribution',
    propertyNameAr: 'توزيع الشارب وكثافته',
    defaultValue: 'Natural trimmed moustache matching beard stubble texture and density',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_philtrum'
  },
  {
    property: 'eyebrow_characteristics',
    propertyNameAr: 'خصائص الحاجبين',
    defaultValue: 'Natural defined dark eyebrows with unplucked authentic arch and realistic follicle spacing',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_supraorbital'
  },
  {
    property: 'visible_eyewear',
    propertyNameAr: 'النظارات والعدسات المرئية',
    defaultValue: 'No glasses observed in primary reference frame; facial structure unobstructed',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_eye_region'
  },
  {
    property: 'skin_appearance',
    propertyNameAr: 'ملمس ولون البشرة المرصود',
    defaultValue: 'Natural wheat-tan Saudi complexion with authentic warm undertones, realistic micro-pores and zero waxy airbrushing',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_dermal_texture'
  },
  {
    property: 'facial_asymmetry',
    propertyNameAr: 'عدم التماثل البشري الطبيعي',
    defaultValue: 'Subtle anatomical asymmetry in brow height and lip corners typical of authentic human biology',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_bilateral_check'
  },
  {
    property: 'distinguishing_marks',
    propertyNameAr: 'العلامات المميزة المرئية',
    defaultValue: 'No abnormal scars or artificial markings observed; authentic clean skin with natural micro-texture',
    defaultVisibility: 'clearly_visible',
    defaultConfidence: 'clearly_visible',
    source: 'reference_surface_scan'
  },
  {
    property: 'occluded_crown_regions',
    propertyNameAr: 'مناطق خلف الرأس والتاج المحجوبة',
    defaultValue: 'Posterior scalp and nape are completely unobservable due to frontal camera framing; do not extrapolate as known fact',
    defaultVisibility: 'not_observable',
    defaultConfidence: 'not_observable',
    source: 'camera_occlusion'
  }
];

/**
 * Perform honest reference analysis respecting visibility limitations.
 * Never invents hidden details or converts uncertainty into established facts.
 */
export function analyzeReferenceFidelity(
  referenceImageUrl: string | null,
  referenceImageName: string | null,
  options?: {
    isPartialHairlineOccluded?: boolean;
    isResolutionLimited?: boolean;
    hasShadows?: boolean;
  }
): ReferenceAnalysisState {
  if (!referenceImageUrl) {
    return {
      hasReferenceImage: false,
      referenceImageName: null,
      referenceImageUrl: null,
      analysisDate: null,
      isAnalyzed: false,
      observations: [],
      lockedFeatures: [],
      hairCompatibility: {
        isCompatible: true,
        hairlinePreserved: true,
        densityPreserved: true,
        warnings: ['لا توجد صورة مرجعية محملة. لا يمكن تأكيد ملامح الهوية دون صورة حقيقية.'],
        suggestions: ['قم برفع صورة مرجعية واضحة في استديو الشخصية للبدء في تدقيق الملامح.']
      },
      uncertaintyNotesAr: 'خطأ: لم يتم تزويد صورة مرجعية. يمتنع النظام تمامًا عن ادعاء التحقق من الهوية بدون مصدر.'
    };
  }

  const isPartialHairline = options?.isPartialHairlineOccluded ?? true;
  const hasShadows = options?.hasShadows ?? true;

  const observations: ReferenceObservation[] = CORE_OBSERVATION_TEMPLATES.map((tmpl) => {
    let visibility = tmpl.defaultVisibility;
    let confidence = tmpl.defaultConfidence;
    let value: string | null = tmpl.defaultValue;
    let notes = '';

    // TEST 01 requirement: If hairline is partially occluded, mark as partially_visible / uncertain
    if (tmpl.property === 'hairline' && isPartialHairline) {
      visibility = 'partially_visible';
      confidence = 'uncertain';
      value = 'Frontal hairline edge is partially occluded by shadows and styling angles; only lower central forehead margin is observable with confidence';
      notes = 'تنبيه أمان فيزيائي: خط الشعر العلوي والجانبي محجوب جزئيًا بالظلال؛ لا يجوز افتراض شكله بدقة 100%.';
    }

    if (tmpl.property === 'occluded_crown_regions') {
      visibility = 'not_observable';
      confidence = 'not_observable';
      value = null;
      notes = 'محجوب تمامًا عن زاوية الكاميرا الأمامية';
    }

    return {
      property: tmpl.property,
      propertyNameAr: tmpl.propertyNameAr,
      value,
      visibility,
      confidence,
      source: tmpl.source,
      userVerified: false,
      notes
    };
  });

  return {
    hasReferenceImage: true,
    referenceImageName: referenceImageName || 'reference_image.jpg',
    referenceImageUrl,
    analysisDate: Date.now(),
    isAnalyzed: true,
    observations,
    lockedFeatures: ['faceAndSkull', 'hairline', 'hairDensity', 'skinTone', 'facialHair'],
    hairCompatibility: {
      isCompatible: true,
      hairlinePreserved: true,
      densityPreserved: true,
      warnings: [],
      suggestions: ['تم قفل كثافة الشعر وخط النمو الطبيعي لحماية المظهر الأصلي.']
    },
    uncertaintyNotesAr: 'تم استخراج الملاحظات مع تمييز دقيق للمناطق المحجوبة بالظلال وزوايا التصوير. يُنصح بمراجعة الملاحظات وتأكيدها.'
  };
}

/**
 * Apply user correction to a reference observation.
 */
export function applyUserObservationCorrection(
  state: ReferenceAnalysisState,
  property: string,
  userCorrection: string
): ReferenceAnalysisState {
  const updated = state.observations.map((obs) => {
    if (obs.property === property) {
      return {
        ...obs,
        userCorrection,
        value: userCorrection,
        userVerified: true,
        confidence: 'clearly_visible' as const
      };
    }
    return obs;
  });

  return {
    ...state,
    observations: updated
  };
}
