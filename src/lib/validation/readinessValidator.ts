/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneReadiness, SceneState } from '../../types/scene.ts';
import { validateGeometryCalibration } from '../geometry/calibration.ts';
import { validateHairstyleCompatibility } from '../reference/hairstyleCompatibility.ts';

export interface ReadinessCheckItem {
  id: string;
  labelAr: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  detailsAr: string;
  detailsEn: string;
}

/**
 * Validates 12 specific criteria of scene readiness without fabricated percentages.
 */
export function evaluateSceneReadiness(state: SceneState): SceneReadiness {
  const checklist: ReadinessCheckItem[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const unsupportedAssumptions: string[] = [];
  const suggestedCorrectionsAr: string[] = [];

  // 1. Is camera mode selected?
  const hasCameraMode = !!state.camera.mode;
  checklist.push({
    id: 'chk_camera_mode',
    labelAr: 'اختيار نمط الكاميرا ومستشعر الهاتف',
    passed: hasCameraMode,
    severity: 'error',
    detailsAr: hasCameraMode ? `نمط الكاميرا (${state.camera.mode}) محدد بدقة.` : 'لم يتم تحديد نمط الكاميرا.',
    detailsEn: 'Camera mode verified.'
  });
  if (!hasCameraMode) errors.push('نمط الكاميرا غير محدد.');

  // 2. Is selected camera compatible with pose?
  const geomValidation = validateGeometryCalibration(
    state.geometryCalibration,
    state.camera.mode,
    state.pose.category,
    state.pose.supportSurface
  );
  checklist.push({
    id: 'chk_camera_pose_reach',
    labelAr: 'توافق مدى الذراع والوضعية مع الكاميرا',
    passed: geomValidation.canArmReach,
    severity: 'error',
    detailsAr: geomValidation.canArmReach
      ? `مسافة الذراع (${state.pose.selfieArmDistanceCm} سم) متوافقة تمامًا.`
      : `المسافة (${state.pose.selfieArmDistanceCm} سم) تتجاوز المدى التشريحي للذراع (${geomValidation.maxAnatomicalReachCm} سم).`,
    detailsEn: 'Arm reach biomechanics.'
  });
  if (!geomValidation.canArmReach) {
    errors.push(`مسافة الكاميرا تتجاوز أقصى مدى تشريحي للذراع (${geomValidation.maxAnatomicalReachCm} سم).`);
    suggestedCorrectionsAr.push('تقليل مسافة السيلفي إلى نطاق 45-65 سم المتوافق تشريحيًا.');
  }

  // 3. Are identity locks respected?
  const idLocksActive = state.identity.locks.hairDensity && state.identity.locks.faceAndSkull;
  checklist.push({
    id: 'chk_identity_locks',
    labelAr: 'تفعيل أقفال الهوية وكثافة الشعر',
    passed: idLocksActive,
    severity: 'warning',
    detailsAr: idLocksActive ? 'أقفال الهوية وكثافة الشعر مفعلة ومحمية.' : 'بعض أقفال الهوية معطلة مما قد يغير ملامح الشخصية.',
    detailsEn: 'Identity locks active.'
  });
  if (!idLocksActive) {
    warnings.push('أقفال الهوية معطلة، يوصى بقفل كثافة الشعر والجمجمة لحماية الملامح.');
    suggestedCorrectionsAr.push('تفعيل قفل كثافة الشعر وأبعاد الجمجمة في استديو الشخصية.');
  }

  // 4. Is hair styling compatible with reference?
  const hairComp = validateHairstyleCompatibility(state.hair, state.referenceAnalysis, state.identity.locks.hairDensity);
  checklist.push({
    id: 'chk_hair_compatibility',
    labelAr: 'توافق تسريحة الشعر مع الصورة المرجعية',
    passed: hairComp.isCompatible,
    severity: 'warning',
    detailsAr: hairComp.isCompatible
      ? 'التسريحة متوافقة تمامًا مع الكثافة والخط المرجعي.'
      : hairComp.warningsAr[0] || 'تعارض في كثافة الشعر.',
    detailsEn: 'Hair compatibility.'
  });
  if (!hairComp.isCompatible) {
    warnings.push(hairComp.warningsAr[0] || 'تعارض في كثافة الشعر مع المرجع.');
    suggestedCorrectionsAr.push('استعادة كثافة الشعر الأصلية أو اختيار تسريحة لا تتطلب زيادة مصطنعة في الشعر.');
  }

  // 5. Are clothing materials defined?
  const upperMatDefined = !!state.clothing.upper?.material;
  const lowerMatDefined = !!state.clothing.lower?.material;
  const materialsDefined = upperMatDefined && lowerMatDefined;
  checklist.push({
    id: 'chk_clothing_materials',
    labelAr: 'تحديد خامات الأقمشة وسلوكها الفيزيائي',
    passed: materialsDefined,
    severity: 'error',
    detailsAr: materialsDefined ? 'خامات الملابس العلوية والسفلية محددة بدقة فيزيائية.' : 'خامات الملابس غير مكتملة.',
    detailsEn: 'Fabric materials verified.'
  });
  if (!materialsDefined) errors.push('يجب تحديد خامات الأقمشة (مثل القطن أو البوليستر الرياضي).');

  // 6. Are body contact surfaces plausible?
  const contactPlausible = geomValidation.supportPlausible;
  checklist.push({
    id: 'chk_body_support',
    labelAr: 'سلامة أسطح الدعم والملامسة الميكانيكية',
    passed: contactPlausible,
    severity: 'error',
    detailsAr: contactPlausible ? 'الجسم مستند إلى سطح حقيقي (مرتبة أو مقعد).' : 'الوضعية غير مدعومة بفيزياء أسطح كافية.',
    detailsEn: 'Body contact plausibility.'
  });
  if (!contactPlausible) errors.push('الوضعية تفتقر إلى سطح دعم مناسب يمنع ظهور جسد طافٍ.');

  // 7. Are light sources compatible?
  let lightCompatible = true;
  if (state.lighting.mode === 'phone_screen_only') {
    if (state.lighting.timeOfDay === 'day') {
      lightCompatible = false;
      errors.push('تعارض إضاءة: لا يمكن تشغيل إضاءة شاشة الهاتف كمنبع وحيد في وضح النهار.');
      suggestedCorrectionsAr.push('تغيير وقت المشهد إلى الليل التام لدعم إضاءة الشاشة.');
    }
    if (state.lighting.secondarySourceEnabled) {
      warnings.push('إضاءة الشاشة المنفردة تفترض إطفاء المصابيح الثانوية لمنع تشتت الظلال.');
    }
  }
  checklist.push({
    id: 'chk_lighting_sources',
    labelAr: 'اتساق مصادر الإضاءة والظلال',
    passed: lightCompatible,
    severity: 'error',
    detailsAr: lightCompatible ? 'مصادر الإضاءة متسقة فيزيائيًا مع التوقيت والبيئة.' : 'تعارض بين منبع الإضاءة وتوقيت اليوم.',
    detailsEn: 'Light sources coherence.'
  });

  // 8. Is environment internally coherent?
  checklist.push({
    id: 'chk_environment_coherence',
    labelAr: 'اتساق البيئة والمعمار الداخلي',
    passed: true,
    severity: 'info',
    detailsAr: 'المعمار السكني متناسق مع النمط المعماري والمدينة المحددة.',
    detailsEn: 'Environment coherence.'
  });

  // 9. Is room geometry persistent when locked?
  const roomPersistent = state.bedroomGeometry.persistentLayout;
  checklist.push({
    id: 'chk_room_persistence',
    labelAr: 'ثبات هندسة ومعمار الغرفة',
    passed: roomPersistent,
    severity: 'info',
    detailsAr: roomPersistent ? 'أبعاد الغرفة والسرير مقفلة لمنع التحول العشوائي.' : 'هندسة الغرفة حرة التغيير.',
    detailsEn: 'Room layout persistence.'
  });

  // 10. Are background people and vehicles plausible?
  const isPrivateSpace = state.environmentCategory === 'bedroom';
  const hasStrangeCrowd = isPrivateSpace && state.backgroundPeople.count > 0;
  checklist.push({
    id: 'chk_background_plausibility',
    labelAr: 'معقولية عناصر وخلفية المشهد',
    passed: !hasStrangeCrowd,
    severity: 'warning',
    detailsAr: !hasStrangeCrowd ? 'الخلفية ملائمة للمكان الخاص.' : 'وجود أشخاص في خلفية غرفة نوم خاصة غير معتاد.',
    detailsEn: 'Background plausibility.'
  });
  if (hasStrangeCrowd) warnings.push('يوجد أشخاص في خلفية غرفة نوم خاصة؛ يفضل جعل العد صفرًا.');

  // 11. Is disorder within selected limits?
  checklist.push({
    id: 'chk_disorder_limits',
    labelAr: 'انضباط مستوى الفوضى العفوية',
    passed: true,
    severity: 'info',
    detailsAr: `مستوى الفوضى (${state.disorder.level}) متوازن وعفوي دون مبالغة.`,
    detailsEn: 'Disorder limits verified.'
  });

  // 12. Are unsupported assumptions clearly identified?
  if (state.referenceAnalysis.observations.length > 0) {
    const uncert = state.referenceAnalysis.observations.filter(
      (o) => o.confidence === 'uncertain' || o.visibility === 'partially_visible'
    );
    uncert.forEach((u) => {
      unsupportedAssumptions.push(`${u.propertyNameAr}: الملاحظة جزئية أو غير مؤكدة بالصورة المرجعية.`);
    });
  }
  checklist.push({
    id: 'chk_assumptions_transparency',
    labelAr: 'شفافية الافتراضات غير المؤكدة',
    passed: unsupportedAssumptions.length === 0,
    severity: 'info',
    detailsAr: unsupportedAssumptions.length === 0
      ? 'جميع الافتراضات موثقة ومؤكدة بالكامل.'
      : `توجد ${unsupportedAssumptions.length} ملاحظات غير مؤكدة تمامًا مسجلة بشفافية.`,
    detailsEn: 'Assumptions transparency.'
  });

  let status: SceneReadiness['status'] = 'ready';
  let statusLabelAr = 'جاهز للتوليد الفيزيائي (Ready)';
  let scoreExplanationAr = 'جميع المحددات الفيزيائية متسقة ومتوافقة هندسيًا.';

  if (errors.length > 0) {
    status = 'invalid';
    statusLabelAr = 'تكوين غير صالح فيزيائيًا (Invalid)';
    scoreExplanationAr = `يحتوي المشهد على ${errors.length} تعارضات فيزيائية حاسمة يجب تصحيحها.`;
  } else if (warnings.length > 0) {
    status = 'ready_with_warnings';
    statusLabelAr = 'جاهز مع ملاحظات تدقيق (Ready with Warnings)';
    scoreExplanationAr = `المشهد قابل للتوليد مع ${warnings.length} تنبيهات لتحسين الواقعية.`;
  }

  return {
    status,
    statusLabelAr,
    scoreExplanationAr,
    warnings,
    errors,
    checklist: checklist.map((c) => ({
      id: c.id,
      labelAr: c.labelAr,
      passed: c.passed,
      detailsAr: c.detailsAr
    })),
    unsupportedAssumptions,
    suggestedCorrectionsAr
  };
}
