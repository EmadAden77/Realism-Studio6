/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SmartSceneBuilderInput, SmartSceneSuggestion } from '../../types/v4';
import { LightingMode, SceneState } from '../../types/scene';
import { ALL_LOCATION_PRESETS } from '../presets/locationsData';
import { ALL_POSE_PRESETS } from '../presets/posesData';
import { ALL_CAMERA_ANGLE_PRESETS } from '../presets/cameraAnglesData';
import { ALL_GAZE_PRESETS } from '../presets/gazeData';

/**
 * Intelligent Smart Scene Builder proposing physically coherent matching parameters.
 */
export function buildCompatibleSceneSuggestion(
  input: SmartSceneBuilderInput,
  currentState: SceneState
): SmartSceneSuggestion {
  const reasoningAr: string[] = [];

  // 1. Resolve Location
  const locId = input.locationId || currentState.locationPresetId || 'home_bed_edge';
  const location = ALL_LOCATION_PRESETS.find(l => l.id === locId) || ALL_LOCATION_PRESETS[0];

  // 2. Propose compatible pose
  let pose = ALL_POSE_PRESETS.find(p => p.id === input.poseId);
  if (!pose) {
    if (location.category === 'bedroom') {
      pose = ALL_POSE_PRESETS.find(p => p.id === 'sitting_bed_edge_phone_held') || ALL_POSE_PRESETS[0];
      reasoningAr.push('غرفة النوم: تم اقتراح وضعية الجلوس على حافة السرير لكونها الوضعية الأكثر عفوية وطبيعية لتصوير السيلفي المنزلي.');
    } else if (location.category === 'vehicle') {
      pose = ALL_POSE_PRESETS.find(p => p.id === 'sitting_car_driver_seatbelt_on') || ALL_POSE_PRESETS[0];
      reasoningAr.push('السيارة: تم اقتراح وضعية مقعد السائق مع حزام الأمان لتطابق مقاييس القمرة بدقة.');
    } else if (location.category === 'cafe') {
      pose = ALL_POSE_PRESETS.find(p => p.id === 'sitting_cafe_table_holding_cup') || ALL_POSE_PRESETS[0];
      reasoningAr.push('المقهى: تم اقتراح الجلوس إلى الطاولة مع حمل فنجان القهوة كنشاط إنساني طبيعي.');
    } else if (location.category === 'gym') {
      pose = ALL_POSE_PRESETS.find(p => p.id === 'standing_gym_post_workout_6') || ALL_POSE_PRESETS[0];
      reasoningAr.push('النادي الرياضي: تم اقتراح وقفة رياضية مسترخية بعد أداء التمارين.');
    } else {
      pose = ALL_POSE_PRESETS.find(p => p.id === 'standing_relaxed_weight_shift') || ALL_POSE_PRESETS[0];
      reasoningAr.push('الشارع والبيئات العامة: تم اقتراح وقوف متزن مع نقل الوزن لإظهار التناسق الجسدي.');
    }
  }

  // 3. Propose compatible camera angle
  let cameraAngle = ALL_CAMERA_ANGLE_PRESETS.find(a => a.id === input.cameraAngleId);
  if (!cameraAngle) {
    if (location.category === 'vehicle') {
      cameraAngle = ALL_CAMERA_ANGLE_PRESETS.find(a => a.id === 'car_seat_selfie') || ALL_CAMERA_ANGLE_PRESETS[1];
      reasoningAr.push('زاوية الكاميرا: تم اختيار زاوية مقعد السيارة بميلان طفيف لليد لتناسب زجاج السيارة.');
    } else if (pose.group === 'reclining') {
      cameraAngle = ALL_CAMERA_ANGLE_PRESETS.find(a => a.id === 'pillow_level_selfie') || ALL_CAMERA_ANGLE_PRESETS[1];
      reasoningAr.push('زاوية الكاميرا: تم اختيار زاوية مستوى الوسادة لتلائم وضعية الاستلقاء.');
    } else {
      cameraAngle = ALL_CAMERA_ANGLE_PRESETS.find(a => a.id === 'slightly_elevated_4deg') || ALL_CAMERA_ANGLE_PRESETS[1];
      reasoningAr.push('زاوية الكاميرا: تم اختيار الزاوية المرتفعة قليلاً (+4 درجات) ببعد 56 سم، وهي الزاوية المثالية لعدسة شاومي 21mm لمنع تشوه الأنف.');
    }
  }

  // 4. Propose compatible Gaze
  let gaze = ALL_GAZE_PRESETS.find(g => g.id === input.gazeId);
  if (!gaze) {
    if (pose.id.includes('holding_cup')) {
      gaze = ALL_GAZE_PRESETS.find(g => g.id === 'gaze_coffee_cup_check') || ALL_GAZE_PRESETS[1];
      reasoningAr.push('اتجاه النظر: نظر موجه نحو فنجان القهوة بتأمل عفوي.');
    } else if (location.category === 'bedroom') {
      gaze = ALL_GAZE_PRESETS.find(g => g.id === 'gaze_phone_screen') || ALL_GAZE_PRESETS[1];
      reasoningAr.push('اتجاه النظر: نحو شاشة الهاتف (أسفل العدسة بـ 12 درجة) لمحاكاة النظر الطبيعي للشاشة أثناء السيلفي.');
    } else {
      gaze = ALL_GAZE_PRESETS.find(g => g.id === 'gaze_direct_lens') || ALL_GAZE_PRESETS[0];
      reasoningAr.push('اتجاه النظر: مباشر نحو مركز العدسة لإنشاء اتصال بصري صادق.');
    }
  }

  // 5. Propose Lighting Mode
  let lightingMode: LightingMode = input.lightingMode || location.defaultLighting;
  if (!input.lightingMode && location.category === 'bedroom' && input.timeOfDay === 'night') {
    lightingMode = 'phone_screen_only';
    reasoningAr.push('الإضاءة: إضاءة شاشة الهاتف فقط (~6500K) للقطة ليلية داخل غرفة النوم مع إخماد كافة المصابيح المحيطة.');
  } else if (!input.lightingMode && location.category === 'saudi_street' && input.timeOfDay === 'night') {
    lightingMode = 'street_led';
    reasoningAr.push('الإضاءة: أعمدة إنارة الشارع البلدية LED (4000K) لواقعية شوارع الرياض وجدة ليلاً.');
  }

  // 6. Fabric & Hair behavior
  const fabricBehavior = pose.group === 'sitting'
    ? 'انثناءات حتمية حول الخصر وأسفل الظهر وتوتر نسيجي مسترخٍ عند الكتفين'
    : 'انسدال رأسي مستقيم تحت تأثير الجاذبية الأرضية مع تفاعل خفيف مع نسيم الهواء';

  const hairBehavior = pose.group === 'reclining'
    ? 'انضغاط خصلات الشعر على وسادة السرير مع بعثرة خفيفة طبيعية'
    : 'شعر ذو ملمس طبيعي مطفي مع انسياب حر غير مقيد بالجل أو الشمع';

  const environmentalDetails = location.requiredObjects.concat(location.optionalObjects.slice(0, 2));

  return {
    cameraAngle,
    gaze,
    pose,
    lightingMode,
    fabricBehavior,
    hairBehavior,
    environmentalDetails,
    naturalSceneActivity: location.backgroundActivityCompatibility,
    reasoningAr
  };
}

/**
 * Applies the generated suggestions to the scene state without touching locked fields.
 */
export function applySmartSceneSuggestion(
  currentState: SceneState,
  suggestion: SmartSceneSuggestion
): SceneState {
  return {
    ...currentState,
    locationPresetId: currentState.locationPresetId,
    pose: {
      ...currentState.pose,
      presetId: suggestion.pose.id,
      selfieArmDistanceCm: suggestion.cameraAngle.distanceCm
    },
    camera: {
      ...currentState.camera,
      angle: suggestion.cameraAngle.id === 'slightly_elevated_4deg' ? 'slightly_elevated' : 'eye_level',
      naturalHandheldRollDeg: suggestion.cameraAngle.rollDegrees
    },
    gaze: {
      ...currentState.gaze,
      targetId: suggestion.gaze.id as any
    },
    lighting: {
      ...currentState.lighting,
      mode: suggestion.lightingMode,
      secondarySourceEnabled: suggestion.lightingMode === 'phone_screen_only' ? false : currentState.lighting.secondarySourceEnabled
    }
  };
}
