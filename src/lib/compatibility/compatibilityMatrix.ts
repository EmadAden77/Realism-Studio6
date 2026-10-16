/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompatibilityConflict, CompatibilityValidationReport } from '../../types/v4';
import { SceneState } from '../../types/scene';
import { ALL_LOCATION_PRESETS } from '../presets/locationsData';
import { ALL_POSE_PRESETS } from '../presets/posesData';
import { ALL_HAIRSTYLE_PRESETS } from '../presets/hairstylesData';

/**
 * Validates cross-category relationships across all physical and photographic dimensions.
 */
export function validateCrossCategoryCompatibility(state: SceneState): CompatibilityValidationReport {
  const conflicts: CompatibilityConflict[] = [];
  const appliedPhysicalEnforcements: string[] = [];

  const locPreset = ALL_LOCATION_PRESETS.find((l) => l.id === state.locationPresetId) || ALL_LOCATION_PRESETS[0];
  const posePreset = ALL_POSE_PRESETS.find((p) => p.id === state.pose.presetId) || ALL_POSE_PRESETS[0];
  const hairPreset = ALL_HAIRSTYLE_PRESETS.find((h) => h.id === state.hair.presetId);

  // RULE 1: Side-Lying or Bed Reclining requires appropriate support surface (Mattress / Pillows)
  if (posePreset.group === 'reclining' || posePreset.id.includes('side_lying') || posePreset.id.includes('pillows')) {
    if (state.environmentCategory !== 'bedroom' && !locPreset.availableSurfaces.some(s => s.includes('mattress') || s.includes('bed') || s.includes('pillow') || s.includes('couch') || s.includes('sofa'))) {
      conflicts.push({
        id: 'CONFLICT_RECLINING_NO_BED',
        severity: 'error',
        titleAr: 'تعارض: وضعية استلقاء بدون سطح سرير أو وسائد داعمة',
        messageAr: `وضعية "${posePreset.nameAr}" تتطلب وجود سرير أو وسائد داعمة تحت الرأس والجسد، بينما المكان الحالي هو "${locPreset.nameAr}".`,
        explanationEn: `Reclining pose ${posePreset.nameEn} requires mattress or pillow support, but current location ${locPreset.nameEn} lacks horizontal bedding surfaces.`,
        conflictingElements: ['pose.presetId', 'locationPresetId', 'environmentCategory'],
        autoResolutionSuggestionAr: 'تحويل البيئة إلى غرفة النوم (حافة السرير أو الوسائد) أو تعديل الوضعية لوضعية جلوس متوافقة.',
        canAutoResolve: true
      });
    } else {
      appliedPhysicalEnforcements.push('انضغاط الوسادة وتشوه نسيج المرتبة تحت ثقل الرأس والجسد (Pillow/Mattress Deformation)');
    }
  }

  // RULE 2: Seated + Cotton T-shirt / Outfit fabric folds
  if (posePreset.group === 'sitting' || posePreset.id.includes('sitting')) {
    appliedPhysicalEnforcements.push('ثنيات الخصر والبطن الحتمية في نسيج التيشيرت عند الجلوس (Sitting Hip & Abdominal Creases)');
  }

  // RULE 3: Phone-screen-only in bedroom requires complete darkness and prevents extra lights
  if (state.lighting.mode === 'phone_screen_only') {
    if (state.lighting.secondarySourceEnabled) {
      conflicts.push({
        id: 'CONFLICT_SCREEN_ONLY_SECONDARY_LIGHT',
        severity: 'error',
        titleAr: 'تعارض: إضاءة الشاشة فقط مع مصدر ضوء إضافي مفعل',
        messageAr: 'نمط إضاءة شاشة الهاتف يقتضي أن تكون الغرفة مظلمة تمامًا مع إخماد أي مصابيح إضافية.',
        explanationEn: 'Phone-screen-only illumination requires pitch-dark ambient surroundings with zero secondary lamps.',
        conflictingElements: ['lighting.mode', 'lighting.secondarySourceEnabled'],
        autoResolutionSuggestionAr: 'إلغاء تفعيل المصدر الثانوي للإضاءة لإبقاء إضاءة الشاشة منفردة.',
        canAutoResolve: true
      });
    }
    if (state.lighting.timeOfDay === 'day') {
      conflicts.push({
        id: 'CONFLICT_SCREEN_ONLY_DAYLIGHT',
        severity: 'warning',
        titleAr: 'تعارض: إضاءة الشاشة فقط أثناء وقت النهار',
        messageAr: 'إضاءة الشاشة الخافتة لا يمكن أن تكون المصدر الوحيد في وضح النهار مع وجود نوافذ.',
        explanationEn: 'Phone screen cannot be the sole light source during daytime daylight.',
        conflictingElements: ['lighting.mode', 'lighting.timeOfDay'],
        autoResolutionSuggestionAr: 'تحويل وقت المشهد إلى الليل (Night) أو إغلاق ستائر التعتيم بالكامل.',
        canAutoResolve: true
      });
    }
    appliedPhysicalEnforcements.push('تلاشي الضوء الهندسي الحقيقي (Inverse-Square Law) وظلام حقيقي في زوايا الغرفة البعيدة');
  }

  // RULE 4: Hairstyle selection vs Hair Density Lock
  if (hairPreset && hairPreset.densityRequirement === 'thick_required') {
    if (state.identity.locks.hairDensity) {
      conflicts.push({
        id: 'CONFLICT_HAIR_DENSITY_EXCESSIVE',
        severity: 'warning',
        titleAr: 'تحذير: تسريحة تتطلب كثافة شعر تفوق المرجع الأصلي',
        messageAr: `تسريحة "${hairPreset.nameAr}" تتطلب شعرًا كثيفًا جدًا يغطي تراجع الصدغين الطبيعي، وهو ما يتعارض مع قفل كثافة شعر المرجع.`,
        explanationEn: `Selected hairstyle requires dense hair that would hide natural observed temple recession, violating hair density lock.`,
        conflictingElements: ['hair.presetId', 'identity.locks.hairDensity'],
        autoResolutionSuggestionAr: 'الالتزام بكثافة المرجع الأصلية وتطبيق تسريحة متوافقة طبيعياً دون تكثيف مصطنع.',
        canAutoResolve: true
      });
    }
  }

  // RULE 5: Cafe + Holding coffee cup requires realistic hand coordination
  if (posePreset.id.includes('holding_cup') || state.disorder.activeItems.includes('ceramic_coffee_mug')) {
    if (state.camera.mode === 'front_selfie') {
      // Must ensure one arm holds phone (45-65cm) and other holds cup
      appliedPhysicalEnforcements.push('تنسيق حركي ثنائي: يد واحدة تحمل فنجان القهوة والأخرى تحمل الهاتف على مسافة سيلفي متزنة');
    }
  }

  // RULE 6: Car Selfie + Driver seat requires cabin geometry
  if (state.environmentCategory === 'vehicle' || state.locationPresetId?.includes('vehicle')) {
    if (state.camera.mode === 'front_selfie' && state.pose.selfieArmDistanceCm > 65) {
      conflicts.push({
        id: 'CONFLICT_CAR_CABIN_ARM_REACH',
        severity: 'error',
        titleAr: 'تعارض: مسافة سيلفي تتجاوز أبعاد قمرة السيارة (أقصى مدى 65 سم)',
        messageAr: `المسافة المحددة (${state.pose.selfieArmDistanceCm} سم) تتجاوز الزجاج الأمامي أو باب السيارة داخل القمرة المغلقة.`,
        explanationEn: `Selfie distance ${state.pose.selfieArmDistanceCm}cm exceeds physical dimensions of the car windshield and door cabin.`,
        conflictingElements: ['pose.selfieArmDistanceCm', 'environmentCategory'],
        autoResolutionSuggestionAr: 'تقليص مسافة السيلفي إلى 50-55 سم لتناسب قمرة السيارة بدقة.',
        canAutoResolve: true
      });
    }
    appliedPhysicalEnforcements.push('حزام أمان مثبت قطرياً على الترقوة، مسند رأس، وانعكاس زجاج السيارة الجانبي المظلل');
  }

  // RULE 7: Biomechanical arm reach maximum 75cm
  if (state.camera.mode === 'front_selfie' && state.pose.selfieArmDistanceCm > 72) {
    conflicts.push({
      id: 'CONFLICT_ARM_REACH_EXCEEDED',
      severity: 'error',
      titleAr: 'تعارض: مسافة الكاميرا تتجاوز أقصى مدى وصول تشريحي لذراع الإنسان (72 سم)',
      messageAr: `طول الذراع البشري للبالغين يتراوح بين 45 و 68 سم. مسافة ${state.pose.selfieArmDistanceCm} سم مستحيلة فيزيائياً بدون عصا سيلفي مصطنعة.`,
      explanationEn: `Distance ${state.pose.selfieArmDistanceCm}cm exceeds human anatomical reach limits without a selfie stick.`,
      conflictingElements: ['pose.selfieArmDistanceCm'],
      autoResolutionSuggestionAr: 'ضبط مسافة السيلفي في النطاق الطبيعي (48-62 سم).',
      canAutoResolve: true
    });
  }

  const isPlausible = conflicts.filter(c => c.severity === 'error').length === 0;
  const score = Math.max(10, 100 - (conflicts.length * 18));

  return {
    isPlausible,
    score,
    conflicts,
    appliedPhysicalEnforcements
  };
}

/**
 * Automatically applies physical enforcements and resolves resolvable conflicts.
 */
export function autoResolveConflicts(state: SceneState): SceneState {
  let next = { ...state };
  const report = validateCrossCategoryCompatibility(next);

  for (const conflict of report.conflicts) {
    if (!conflict.canAutoResolve) continue;

    if (conflict.id === 'CONFLICT_RECLINING_NO_BED') {
      next.environmentCategory = 'bedroom';
      next.locationPresetId = 'home_bed_pillows_reclining';
    }

    if (conflict.id === 'CONFLICT_SCREEN_ONLY_SECONDARY_LIGHT') {
      next.lighting = {
        ...next.lighting,
        secondarySourceEnabled: false
      };
    }

    if (conflict.id === 'CONFLICT_SCREEN_ONLY_DAYLIGHT') {
      next.lighting = {
        ...next.lighting,
        timeOfDay: 'night'
      };
    }

    if (conflict.id === 'CONFLICT_HAIR_DENSITY_EXCESSIVE') {
      next.hair = {
        ...next.hair,
        presetId: 'hair_reference_exact',
        densityLock: true
      };
    }

    if (conflict.id === 'CONFLICT_CAR_CABIN_ARM_REACH' || conflict.id === 'CONFLICT_ARM_REACH_EXCEEDED') {
      next.pose = {
        ...next.pose,
        selfieArmDistanceCm: 55
      };
    }
  }

  return next;
}
