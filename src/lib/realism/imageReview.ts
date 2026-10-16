/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ImageReviewItem, ImageReviewState, SceneState } from '../../types/scene.ts';

/**
 * Generated Image Realism Review Engine
 * Local scene-rule checklist. It does NOT inspect image pixels or verify identity.
 */
export function evaluateGeneratedImageLocally(
  imageUrl: string,
  state: SceneState
): ImageReviewState {
  // Deterministic local rule-based review baseline
  const items: ImageReviewItem[] = [];

  // Check 1: Selfie Arm Plausibility
  if (state.camera.mode === 'front_selfie') {
    items.push({
      id: 'review_arm_check',
      category: 'anatomy',
      severity: 'info',
      issueAr: 'فحص استقامة ومدى ذراع السيلفي',
      evidenceEn: `Expected handheld selfie arm distance ~${state.pose.selfieArmDistanceCm}cm. Verify elbow joint is anatomically connected to shoulder.`,
      confidence: 0,
      suggestedPromptCorrectionEn: 'Ensure right forearm enters lower frame at realistic angle anchored to shoulder girdle without elongation.',
      elementsToPreserveEn: 'Facial bone structure and natural hairline.'
    });
  }

  // Check 2: Hair Density Preservation
  if (state.hair.densityLock) {
    items.push({
      id: 'review_hair_density',
      category: 'hair',
      severity: 'info',
      issueAr: 'فحص كثافة الشعر وعدم طمس خط الجبهة',
      evidenceEn: 'Observed natural hair density must preserve authentic temple recession and strand separation.',
      confidence: 0,
      suggestedPromptCorrectionEn: 'Maintain biological hairline contours without artificial density thickening at temples.',
      elementsToPreserveEn: 'Hair length and natural growth direction.'
    });
  }

  // Check 3: Lighting Direction & Shadow Consistency
  if (state.lighting.mode === 'phone_screen_only') {
    items.push({
      id: 'review_lighting_falloff',
      category: 'lighting',
      severity: 'info',
      issueAr: 'فحص انعدام إضاءة الغرفة في وضع الشاشة فقط',
      evidenceEn: 'Screen-only lighting must show steep light falloff into dark bedroom background without ambient rim light.',
      confidence: 0,
      suggestedPromptCorrectionEn: 'Keep background bedroom in genuine shadow; illuminate only anterior facial planes directly facing phone display.',
      elementsToPreserveEn: 'Dark wood headboard and mattress position.'
    });
  }

  // Check 4: Fabric Contact Folds
  if (state.pose.category === 'sitting' || state.pose.category === 'reclining') {
    items.push({
      id: 'review_fabric_compression',
      category: 'fabric',
      severity: 'info',
      issueAr: 'فحص طيات انضغاط الملابس عند الجلوس أو الاستلقاء',
      evidenceEn: 'Natural textile creases must appear radiating along hips and body-support contact planes.',
      confidence: 0,
      suggestedPromptCorrectionEn: 'Add horizontal tension folds along shorts thighs and compress shirt fabric where pressed against bedding.',
      elementsToPreserveEn: 'Garment colors and cotton material texture.'
    });
  }

  return {
    uploadedImageUrl: imageUrl,
    uploadedImageName: 'generated_image_review.png',
    isAnalyzing: false,
    analysisCompleted: true,
    reviewItems: items,
    overallRealismAssessmentAr:
      'هذه قائمة مراجعة إرشادية مستخرجة من إعدادات المشهد، وليست نتيجة فحص بصري للصورة أو قياسًا لدقة الهوية. راجع الصورة بنفسك وحدد الأخطاء الفعلية.',
    targetedEditInstructionsEn:
      'Checklist only: visually verify anatomy, light direction, fabric contact and reference identity before applying edits. Keep the original identity and scene locks.'
  };
}
