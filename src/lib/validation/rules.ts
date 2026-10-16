/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState, ValidationIssue } from '../../types/scene.ts';
import { CROSS_ENGINE_RULES } from '../realism/realismValidator.ts';

export interface ContradictionRule {
  id: string;
  severity: 'error' | 'warning' | 'info';
  titleAr: string;
  messageAr: string;
  explanationEn: string;
  conflictingFields: string[];
  canAutoCorrect: boolean;
  evaluate: (state: SceneState) => boolean; // returns true if contradiction exists
  autoCorrect?: (state: SceneState) => SceneState;
}

export const CONTRADICTION_RULES: ContradictionRule[] = [
  // 1. FRONT_CAMERA_REAR_OPTICS
  {
    id: 'FRONT_CAMERA_REAR_OPTICS',
    severity: 'error',
    titleAr: 'تعارض بصريات الكاميرا الأمامية والخلفية',
    messageAr: 'تم اختيار وضع السيلفي بالكاميرا الأمامية لكن مواصفات المستشعر أو العدسة مأخوذة من الكاميرا الخلفية (f/1.63 أو 23mm).',
    explanationEn: 'Front-facing selfie camera uses 21mm f/2.0 wide angle optics, whereas rear main camera uses 23mm f/1.63 1-inch sensor. They cannot physically mix.',
    conflictingFields: ['camera.mode', 'camera.focalLengthEquivMm', 'camera.aperture'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if (state.camera.mode === 'front_selfie') {
        return state.camera.focalLengthEquivMm !== 21 || state.camera.aperture !== 'f/2.0';
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      camera: {
        ...state.camera,
        focalLengthEquivMm: 21,
        aperture: 'f/2.0',
        sensorSize: '1/2.74-inch'
      }
    })
  },

  // 2. SCREEN_ONLY_EXTRA_LIGHT
  {
    id: 'SCREEN_ONLY_EXTRA_LIGHT',
    severity: 'error',
    titleAr: 'إضاءة إضافية متناقضة مع وضع إضاءة الشاشة فقط',
    messageAr: 'تم تفعيل وضع إضاءة شاشة الهاتف فقط، ولكن هناك مصادر إضاءة ثانوية مفعلة أو وقت نهار، مما يناقض الفيزياء الضوئية.',
    explanationEn: 'Phone-screen-only illumination physically mandates complete darkness in the ambient environment with zero secondary light fixtures or daylight.',
    conflictingFields: ['lighting.mode', 'lighting.secondarySourceEnabled', 'lighting.timeOfDay'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if (state.lighting.mode === 'phone_screen_only') {
        return state.lighting.secondarySourceEnabled || state.lighting.timeOfDay !== 'night';
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      lighting: {
        ...state.lighting,
        timeOfDay: 'night',
        secondarySourceEnabled: false,
        secondarySourceType: 'None (Room fixtures strictly off)'
      }
    })
  },

  // 3. BEDROOM_LUXURY_CONFLICT
  {
    id: 'BEDROOM_LUXURY_CONFLICT',
    severity: 'warning',
    titleAr: 'تفاصيل ديكور فاخر تناقض واقعية الغرفة السكنية',
    messageAr: 'قفل واقعية غرفة النوم السكنية مفعل، مما يمنع ثريات الفنادق الضخمة وأشرطة الليد النيون الساطعة والأسقف المعلقة المعقدة.',
    explanationEn: 'Strict bedroom realism lock rejects luxury penthouse decor, showroom symmetry, or neon party strips in an ordinary Saudi residential home.',
    conflictingFields: ['bedroomGeometry.forbiddenLuxuryDetails', 'environmentCategory'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if (state.environmentCategory === 'bedroom' && !state.bedroomGeometry.forbiddenLuxuryDetails) {
        return true;
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      bedroomGeometry: {
        ...state.bedroomGeometry,
        forbiddenLuxuryDetails: true
      }
    })
  },

  // 4. CAMERA_REACH_INVALID
  {
    id: 'CAMERA_REACH_INVALID',
    severity: 'warning',
    titleAr: 'مسافة وصول ذراع السيلفي غير منطقية تشريحيًا',
    messageAr: 'المسافة المحددة للذراع أطول من المدى الطبيعي لذراع الإنسان البالغ (~45-65 سم) في لقطة سيلفي محمولة بدون عصا تصوير.',
    explanationEn: 'Selfie arm reach cannot exceed physical human arm span (~45-65cm) without an external tripod or third-person photographer.',
    conflictingFields: ['camera.mode', 'pose.selfieArmDistanceCm'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if (state.camera.mode === 'front_selfie') {
        return state.pose.selfieArmDistanceCm > 75 || state.pose.selfieArmDistanceCm < 35;
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      pose: {
        ...state.pose,
        selfieArmDistanceCm: 55
      }
    })
  },

  // 5. HAIR_DENSITY_VIOLATION
  {
    id: 'HAIR_DENSITY_VIOLATION',
    severity: 'error',
    titleAr: 'انتهاك قفل كثافة الشعر الطبيعية',
    messageAr: 'قفل كثافة الشعر مفعل، وتكثيف الشعر الاصطناعي أو طمس التراجع الطبيعي للصدغين محظور لتجنب مظهر الشعر المستعار (CGI Helmet).',
    explanationEn: 'Hair density lock prohibits artificial density inflation, synthetic hairline advance, or plastic uniform filling of natural scalp contours.',
    conflictingFields: ['hair.densityLock', 'hair.preventArtificialThickening'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.hair.densityLock && !state.hair.preventArtificialThickening;
    },
    autoCorrect: (state) => ({
      ...state,
      hair: {
        ...state.hair,
        preventArtificialThickening: true
      }
    })
  },

  // 6. FABRIC_PHYSICS_INVALID
  {
    id: 'FABRIC_PHYSICS_INVALID',
    severity: 'warning',
    titleAr: 'محاكاة فيزياء القماش معطلة في وضعية جلوس/استلقاء',
    messageAr: 'الوضعية تتطلب طيات انضغاطية حقيقية عند الفخذين والخصر، يجب تفعيل محرك فيزياء الأقمشة لتفادي مظهر الملابس البلاستيكية المطلية.',
    explanationEn: 'Sitting or reclining postures physically induce compression wrinkles and tension folds across seams and body contact surfaces.',
    conflictingFields: ['fabric.enabled', 'pose.category'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if ((state.pose.category === 'sitting' || state.pose.category === 'reclining') && !state.fabric.enabled) {
        return true;
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      fabric: {
        ...state.fabric,
        enabled: true,
        preventPlasticGarments: true
      }
    })
  },

  // 7. NIGHT_EXPOSURE_INVALID
  {
    id: 'NIGHT_EXPOSURE_INVALID',
    severity: 'warning',
    titleAr: 'تعريض ضوئي غير مبرر في مشهد ليلي',
    messageAr: 'المشهد ليلي لكن إضاءة الوجه تفتقر للمصدر الفيزيائي، مما يعطي إضاءة استوديو مصطنعة ومستحيلة واقعيًا في كاميرات الهواتف.',
    explanationEn: 'Outdoor night or dark rooms must respect inverse-square light falloff and natural shadows without ghost studio fill.',
    conflictingFields: ['lighting.timeOfDay', 'lighting.strictRealismLock'],
    canAutoCorrect: true,
    evaluate: (state) => {
      if (state.lighting.timeOfDay === 'night' && !state.lighting.strictRealismLock) {
        return true;
      }
      return false;
    },
    autoCorrect: (state) => ({
      ...state,
      lighting: {
        ...state.lighting,
        strictRealismLock: true
      }
    })
  },

  // 8. NO_LANDMARKS_RULE
  {
    id: 'NO_LANDMARKS_RULE',
    severity: 'info',
    titleAr: 'منع كليشيهات المعالم الاستشراقية غير المبررة',
    messageAr: 'تم تفعيل فلتر منع المعالم السياحية الاستشراقية في الأحياء السكنية السعودية العادية (مثل كثبان الرمل في الشارع أو القوافل).',
    explanationEn: 'Everyday Saudi residential streets feature modern curbs, asphalt, and clean villa walls rather than orientalist desert dunes.',
    conflictingFields: ['saudiEnvironment.preventOrientalistCliches'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.environmentCategory === 'saudi_street' && !state.saudiEnvironment.preventOrientalistCliches;
    },
    autoCorrect: (state) => ({
      ...state,
      saudiEnvironment: {
        ...state.saudiEnvironment,
        preventOrientalistCliches: true
      }
    })
  },

  // 9. VEHICLE_IN_BEDROOM_CONFLICT
  {
    id: 'VEHICLE_IN_BEDROOM_CONFLICT',
    severity: 'error',
    titleAr: 'تعارض موقع: وجود سيارة داخل غرفة النوم',
    messageAr: 'تم تفعيل وحدة السيارة بينما بيئة المشهد الحالية هي غرفة نوم داخلية!',
    explanationEn: 'A motor vehicle cannot physically exist inside an indoor residential bedroom.',
    conflictingFields: ['vehicle.enabled', 'environmentCategory'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.environmentCategory === 'bedroom' && state.vehicle.enabled;
    },
    autoCorrect: (state) => ({
      ...state,
      vehicle: {
        ...state.vehicle,
        enabled: false
      }
    })
  },

  // 10. BACKGROUND_PEOPLE_IN_PRIVATE_ROOM
  {
    id: 'BACKGROUND_PEOPLE_IN_PRIVATE_ROOM',
    severity: 'warning',
    titleAr: 'وجود أشخاص غرباء في خلفية غرفة النوم الخاصة',
    messageAr: 'تم تحديد عدد من الأشخاص في الخلفية بينما المشهد سيلفي شخصي داخل غرفة نوم خاصة.',
    explanationEn: 'Private residential bedrooms should not feature background pedestrian crowds.',
    conflictingFields: ['backgroundPeople.count', 'environmentCategory'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.environmentCategory === 'bedroom' && state.backgroundPeople.count > 0;
    },
    autoCorrect: (state) => ({
      ...state,
      backgroundPeople: {
        ...state.backgroundPeople,
        count: 0
      }
    })
  },

  // 11. CLUTTER_OVERLOAD
  {
    id: 'CLUTTER_OVERLOAD',
    severity: 'info',
    titleAr: 'مستوى الفوضى البيئية مرتفع قليلًا',
    messageAr: 'مستوى الفوضى الحالية أعلى من المستوى الطبيعي اليومي (المستوى 2)، مما قد يشتت التركيز عن تكوين المشهد.',
    explanationEn: 'Disorder level above 2 may introduce excess visual clutter; level 2 represents optimal lived-in realism.',
    conflictingFields: ['disorder.level'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.disorder.level > 3;
    },
    autoCorrect: (state) => ({
      ...state,
      disorder: {
        ...state.disorder,
        level: 2
      }
    })
  },

  // 12. ASPECT_RATIO_MOBILE_SELFIE
  {
    id: 'ASPECT_RATIO_MOBILE_SELFIE',
    severity: 'info',
    titleAr: 'تناسق أبعاد الصورة مع السيلفي الرأسي',
    messageAr: 'النسبة الافتراضية الأنسب لتصوير السيلفي بالهاتف المحمول هي 9:16 (عمودي كامل).',
    explanationEn: 'Smartphone front camera selfies naturally use a vertical 9:16 portrait aspect ratio.',
    conflictingFields: ['camera.aspectRatio', 'camera.mode'],
    canAutoCorrect: true,
    evaluate: (state) => {
      return state.camera.mode === 'front_selfie' && state.camera.aspectRatio === '16:9';
    },
    autoCorrect: (state) => ({
      ...state,
      camera: {
        ...state.camera,
        aspectRatio: '9:16'
      }
    })
  }
];

export function validateScene(state: SceneState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const allRules = [...CONTRADICTION_RULES, ...CROSS_ENGINE_RULES];

  for (const rule of allRules) {
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

export function autoCorrectScene(state: SceneState): { correctedState: SceneState; appliedCorrections: string[] } {
  let currentState = { ...state };
  const appliedCorrections: string[] = [];
  const allRules = [...CONTRADICTION_RULES, ...CROSS_ENGINE_RULES];

  for (const rule of allRules) {
    if (rule.canAutoCorrect && rule.autoCorrect && rule.evaluate(currentState)) {
      currentState = rule.autoCorrect(currentState);
      appliedCorrections.push(rule.titleAr);
    }
  }

  // Recalculate validation issues after corrections
  currentState.validationIssues = validateScene(currentState);
  currentState.output.appliedCorrections = appliedCorrections;

  return {
    correctedState: currentState,
    appliedCorrections
  };
}
