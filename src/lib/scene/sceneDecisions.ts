/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneDecision, SceneState } from '../../types/scene.ts';

/**
 * Generates transparent explanations for automatic scene choices.
 * Never claims an AI inference has been physically verified when it was only derived from user inputs.
 */
export function generateExplainableDecisions(state: SceneState): SceneDecision[] {
  const decisions: SceneDecision[] = [];

  // 1. Camera Decision Explanation
  if (state.camera.mode === 'front_selfie') {
    decisions.push({
      id: 'dec_cam_focal',
      property: 'camera.focalLengthEquivMm',
      propertyLabelAr: 'البعد البؤري للعدسة الأمامية (21mm)',
      selectedValue: '21mm f/2.0 ultra-wide',
      reasonAr: 'تم اعتماد بعد بؤري مكافئ 21 مم كمعيار للعدسة الأمامية لهاتف شاومي 15 ألترا، لفرض زاوية سيلفي واسعة وحظر تقريب 85 مم المضغوط صناعيًا.',
      ruleId: 'XIAOMI_15_ULTRA_FRONT_OPTICS',
      assumptionsAr: ['استخدام الكاميرا الأمامية للهاتف باليد', 'مسافة التقاط تتراوح بين 45 و 65 سم'],
      confidence: 'high',
      relatedFields: ['camera.mode', 'pose.selfieArmDistanceCm'],
      alternativesAr: ['الكاميرا الخلفية 23mm بحساس 1 إنش f/1.63']
    });
  }

  // 2. Lighting Decision Explanation
  if (state.lighting.mode === 'phone_screen_only') {
    decisions.push({
      id: 'dec_light_screen',
      property: 'lighting.primarySource',
      propertyLabelAr: 'إضاءة شاشة الهاتف المنفردة',
      selectedValue: 'Planar screen glow with inverse-square falloff',
      reasonAr: 'تم قفل الإضاءة على وهج شاشة الهاتف فقط في الظلام التام، وإخماد جميع أضواء الاستوديو وحواف الضوء الخفية (Invisible Fill Lights) لضمان ظلمة الغرفة المحيطة وتلاشي التفاصيل الطبيعي.',
      ruleId: 'STRICT_PHONE_SCREEN_LIGHT',
      assumptionsAr: ['الغرفة مظلمة ليلاً', 'الشخص يمسك الهاتف أمام وجهه مباشرة'],
      confidence: 'high',
      relatedFields: ['lighting.mode', 'lighting.strictRealismLock'],
      alternativesAr: ['إضاءة مصباح السرير الجانبي', 'إضاءة السقف العلوية']
    });
  }

  // 3. Contact Physics Decision Explanation
  if (state.pose.category === 'sitting' && state.pose.supportSurface === 'bed_mattress') {
    decisions.push({
      id: 'dec_contact_bed',
      property: 'contactPhysics.mattressPelvisCompression',
      propertyLabelAr: 'انضغاط المرتبة تحت الحوض والفخذين',
      selectedValue: true,
      reasonAr: 'تم تفعيل انخفاض وانضغاط المرتبة تحت ثقل الحوض (83 كجم) لأن الشخص في وضعية جلوس حقيقية على حافة السرير لمنع ظهور أجساد طافية.',
      ruleId: 'HUMAN_WEIGHT_BED_DEFORMATION',
      assumptionsAr: ['وزن الجسم 83 كجم وطوله 193 سم', 'المرتبة إسفنجية قياسية تنضغط تحت الضغط الميكانيكي'],
      confidence: 'high',
      relatedFields: ['pose.category', 'pose.supportSurface', 'identity.weightKg']
    });
  }

  // 4. Fabric Physics Explanation
  if (state.fabric.postureFolds.sittingHipFolds) {
    decisions.push({
      id: 'dec_fabric_sitting',
      property: 'fabric.postureFolds.sittingHipFolds',
      propertyLabelAr: 'طيات انضغاط أقمشة الجلوس',
      selectedValue: true,
      reasonAr: 'تم توليد طيات انضغاطية عرضية عند خط الوركين وأسفل الفانيلة كأثر ميكانيكي حتمي لزاوية الجلوس بـ 90 درجة.',
      ruleId: 'FABRIC_MECHANICAL_SITTING_FOLDS',
      assumptionsAr: ['الملابس مصنوعة من القطن الطبيعي القابل للتشكل والطوي'],
      confidence: 'high',
      relatedFields: ['clothing.upper.material', 'pose.category']
    });
  }

  // 5. Hair Reference Lock Explanation
  if (state.identity.locks.hairDensity) {
    decisions.push({
      id: 'dec_hair_lock',
      property: 'hair.densityLock',
      propertyLabelAr: 'قفل كثافة الشعر الأصلي',
      selectedValue: true,
      reasonAr: 'تم الحفاظ على كثافة الشعر المرجعية ومنع أي حشو أو تكثيف رقمي مصطنع لحماية ملامح الهوية الحقيقية.',
      ruleId: 'REFERENCE_HAIR_DENSITY_PROTECTION',
      assumptionsAr: ['الصورة المرجعية تمثل الكثافة الطبيعية المستهدفة للشخصية'],
      confidence: 'high',
      relatedFields: ['identity.locks.hairDensity', 'hair.preventArtificialThickening']
    });
  }

  return decisions;
}
