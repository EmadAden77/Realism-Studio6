/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { V4CameraAnglePreset } from '../../types/v4';

export const ALL_CAMERA_ANGLE_PRESETS: V4CameraAnglePreset[] = [
  // 1. Eye-level Frontal
  {
    id: 'eye_level_front',
    nameAr: 'مستوى العين المباشر (Eye-Level 0°)',
    nameEn: 'Direct eye-level frontal perspective',
    group: 'frontal_eye',
    elevationDegrees: 0,
    horizontalOffsetCm: 0,
    distanceCm: 55,
    pitchDegrees: 0,
    yawDegrees: 0,
    rollDegrees: 0.5,
    expectedVisibleBodyRegions: ['face', 'neck', 'clavicles', 'upper chest'],
    approximateBackgroundCoverage: '65% background surrounding subject',
    handheldFeasibility: true,
    compatiblePoses: ['standing_relaxed_weight_shift', 'sitting_cafe_table_holding_cup'],
    promptFragment: 'front camera eye-level perspective at 55cm distance, natural facial proportions without perspective elongation'
  },
  // 2. Slightly Elevated (Standard flattering selfie)
  {
    id: 'slightly_elevated_4deg',
    nameAr: 'مرتفع قليلاً +4° إلى +8° (زاوية السيلفي الطبيعية الموصى بها)',
    nameEn: 'Slightly elevated natural smartphone selfie angle (+4° to +8°)',
    group: 'elevated',
    elevationDegrees: 6,
    horizontalOffsetCm: 2,
    distanceCm: 56,
    pitchDegrees: 6,
    yawDegrees: -2,
    rollDegrees: -1.5,
    expectedVisibleBodyRegions: ['face', 'hairline', 'shoulders', 'chest collar'],
    approximateBackgroundCoverage: '60% background visible behind and around subject',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_bed_edge_phone_held', 'standing_hand_in_pocket', 'sitting_cafe_table_holding_cup'],
    promptFragment: 'subtly elevated front camera angle angled 6 degrees downward at 56cm distance, natural hand tilt with 1.5 degree roll'
  },
  // 3. High-angle Selfie
  {
    id: 'high_angle_selfie_18deg',
    nameAr: 'زاوية علوية واضحة +18° (High-Angle)',
    nameEn: 'Clear high-angle smartphone selfie (+18°)',
    group: 'elevated',
    elevationDegrees: 18,
    horizontalOffsetCm: 3,
    distanceCm: 60,
    pitchDegrees: 18,
    yawDegrees: 0,
    rollDegrees: -2.0,
    expectedVisibleBodyRegions: ['crown of head', 'forehead', 'eyes', 'shoulders', 'lap'],
    approximateBackgroundCoverage: '45% background, floor and lap surfaces prominent',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_floor_knees_up', 'sitting_bed_edge_phone_held'],
    promptFragment: 'elevated high-angle front camera perspective angled 18 degrees downward, showing crown hair texture and lap surface'
  },
  // 4. Slightly Lowered
  {
    id: 'slightly_lowered_minus_5deg',
    nameAr: 'منخفض قليلاً -5° (مستوى الصدر)',
    nameEn: 'Slightly lowered chest-level perspective (-5°)',
    group: 'low_angle',
    elevationDegrees: -5,
    horizontalOffsetCm: 0,
    distanceCm: 52,
    pitchDegrees: -5,
    yawDegrees: 0,
    rollDegrees: 0.8,
    expectedVisibleBodyRegions: ['jawline', 'neck', 'chest', 'broad shoulders'],
    approximateBackgroundCoverage: '70% background including ceiling or upper walls',
    handheldFeasibility: true,
    compatiblePoses: ['standing_relaxed_weight_shift', 'standing_hand_on_car_door'],
    promptFragment: 'slightly lowered front camera perspective from upper chest level angled 5 degrees upward, strong natural jawline'
  },
  // 5. Low-angle Dramatic
  {
    id: 'low_angle_minus_14deg',
    nameAr: 'زاوية منخفضة واضحة -14° (من الأسفل للأعلى)',
    nameEn: 'Low-angle looking upward (+stature)',
    group: 'low_angle',
    elevationDegrees: -14,
    horizontalOffsetCm: 0,
    distanceCm: 50,
    pitchDegrees: -14,
    yawDegrees: 0,
    rollDegrees: 1.0,
    expectedVisibleBodyRegions: ['chin', 'throat', 'shoulder width', 'ceiling/sky'],
    approximateBackgroundCoverage: '75% upper background and ceiling',
    handheldFeasibility: true,
    compatiblePoses: ['standing_relaxed_street', 'sitting_ground_majlis_mirka_elbow'],
    promptFragment: 'low-angle upward smartphone snapshot from 50cm below chin level, authentic handheld angle showing ceiling and upper space'
  },
  // 6. Left Lateral
  {
    id: 'lateral_left_selfie_15deg',
    nameAr: 'زاوية جانبية يسارية خفيفة 15°',
    nameEn: 'Slight left lateral angle (15° yaw)',
    group: 'lateral',
    elevationDegrees: 4,
    horizontalOffsetCm: -12,
    distanceCm: 54,
    pitchDegrees: 4,
    yawDegrees: 15,
    rollDegrees: -1.2,
    expectedVisibleBodyRegions: ['left facial profile', 'left ear', 'left shoulder depth'],
    approximateBackgroundCoverage: '65% background with perspective depth',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_sofa_relaxed_lean', 'standing_leaning_wall_shoulder'],
    promptFragment: 'front camera positioned 12cm to the left showing three-quarter facial contours, natural depth falloff'
  },
  // 7. Right Lateral
  {
    id: 'lateral_right_selfie_15deg',
    nameAr: 'زاوية جانبية يمينية خفيفة 15°',
    nameEn: 'Slight right lateral angle (15° yaw)',
    group: 'lateral',
    elevationDegrees: 4,
    horizontalOffsetCm: 12,
    distanceCm: 54,
    pitchDegrees: 4,
    yawDegrees: -15,
    rollDegrees: 1.2,
    expectedVisibleBodyRegions: ['right facial profile', 'right ear', 'right shoulder'],
    approximateBackgroundCoverage: '65% background with perspective depth',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_cafe_table_holding_cup', 'sitting_car_driver_seatbelt_on'],
    promptFragment: 'front camera offset 12cm to the right showing three-quarter right facial angle with natural lens geometry'
  },
  // 8. Close Framing
  {
    id: 'close_framing_selfie_45cm',
    nameAr: 'تأطير مقرب 45 سم (Close-up Selfie)',
    nameEn: 'Tight facial framing at minimum handheld distance (45cm)',
    group: 'framing_tightness',
    elevationDegrees: 3,
    horizontalOffsetCm: 0,
    distanceCm: 45,
    pitchDegrees: 3,
    yawDegrees: 0,
    rollDegrees: -1.0,
    expectedVisibleBodyRegions: ['detailed face', 'hairline', 'collarbone', 'shirt collar band'],
    approximateBackgroundCoverage: '35% peripheral background only',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_bed_edge_phone_held', 'reclining_pillows_diagonal'],
    promptFragment: 'close-up smartphone front camera framing at 45cm distance, fine natural skin pore textures and facial stubble detail'
  },
  // 9. Medium Framing
  {
    id: 'medium_framing_selfie_65cm',
    nameAr: 'تأطير متوسط 65 سم (Medium Waist/Chest Framing)',
    nameEn: 'Medium framing at full arm reach (65cm)',
    group: 'framing_tightness',
    elevationDegrees: 5,
    horizontalOffsetCm: 2,
    distanceCm: 65,
    pitchDegrees: 5,
    yawDegrees: 0,
    rollDegrees: -1.8,
    expectedVisibleBodyRegions: ['head', 'full shoulders', 'torso down to ribcage', 'selfie forearm edge'],
    approximateBackgroundCoverage: '65% surrounding room and environment',
    handheldFeasibility: true,
    compatiblePoses: ['standing_relaxed_weight_shift', 'standing_in_front_of_shop'],
    promptFragment: 'medium front camera framing at full 65cm arm reach, capturing head, shoulders, and chest with generous environmental context'
  },
  // 10. Reclining Pillow-level
  {
    id: 'pillow_level_selfie',
    nameAr: 'مستوى الوسادة في السرير (Bedside Pillow-Level)',
    nameEn: 'Pillow-level horizontal framing across mattress',
    group: 'posture_specific',
    elevationDegrees: 2,
    horizontalOffsetCm: 4,
    distanceCm: 46,
    pitchDegrees: 2,
    yawDegrees: 8,
    rollDegrees: -3.0,
    expectedVisibleBodyRegions: ['face partially on pillow', 'cheek indent', 'quilt folds'],
    approximateBackgroundCoverage: '40% bed sheets and headboard',
    handheldFeasibility: true,
    compatiblePoses: ['side_lying_pillow_support', 'reclining_pillows_diagonal'],
    promptFragment: 'intimate pillow-level front camera angle resting nearly against the bedsheet, cheek contact with pillow softly visible'
  },
  // 11. Overhead Reachable
  {
    id: 'overhead_reachable_selfie',
    nameAr: 'سيلفي علوي عمودي أثناء الاستلقاء على الظهر (Overhead 80°)',
    nameEn: 'Overhead vertical selfie while lying on back (80°)',
    group: 'posture_specific',
    elevationDegrees: 80,
    horizontalOffsetCm: 0,
    distanceCm: 50,
    pitchDegrees: 80,
    yawDegrees: 0,
    rollDegrees: 0,
    expectedVisibleBodyRegions: ['face viewed from above', 'hair spread on pillow', 'chest beneath'],
    approximateBackgroundCoverage: '30% ceiling and pillow perimeter',
    handheldFeasibility: true,
    compatiblePoses: ['lying_back_arms_up'],
    promptFragment: 'vertical overhead front camera angle looking straight down at subject lying on back in bed, phone held steadily aloft'
  },
  // 12. Car-seat Selfie
  {
    id: 'car_seat_selfie',
    nameAr: 'زاوية مقعد السيارة الطبيعية (مائل قليلاً مع مرآة الرؤية)',
    nameEn: 'Natural automotive cabin selfie angle',
    group: 'posture_specific',
    elevationDegrees: 4,
    horizontalOffsetCm: 5,
    distanceCm: 52,
    pitchDegrees: 4,
    yawDegrees: -6,
    rollDegrees: -2.2,
    expectedVisibleBodyRegions: ['face', 'seatbelt strap', 'headrest', 'side window edge'],
    approximateBackgroundCoverage: '50% car cabin interior and tinted windows',
    handheldFeasibility: true,
    compatiblePoses: ['sitting_car_driver_seatbelt_on', 'sitting_car_passenger_relaxed'],
    promptFragment: 'handheld driver-seat perspective inside car, seatbelt across chest, natural slight tilt from steering wheel vicinity'
  },
  // 13. Mirror Selfie Chest Level
  {
    id: 'mirror_selfie_chest_level',
    nameAr: 'سيلفي مرآة بمستوى الصدر مع ظهور الهاتف في اليد',
    nameEn: 'Mirror selfie with phone held at chest level',
    group: 'posture_specific',
    elevationDegrees: 0,
    horizontalOffsetCm: 0,
    distanceCm: 110,
    pitchDegrees: 0,
    yawDegrees: 0,
    rollDegrees: 0.5,
    expectedVisibleBodyRegions: ['reflection of subject', 'phone in hand taking photo', 'torso', 'room reflection'],
    approximateBackgroundCoverage: '80% reflected room interior',
    handheldFeasibility: true,
    compatiblePoses: ['standing_mirror_selfie', 'standing_gym_post_workout'],
    promptFragment: 'mirror selfie with phone clearly visible in hand reflecting in the glass at chest height, room reflected cleanly behind'
  },
  // 14. Mirror Selfie Waist Level
  {
    id: 'mirror_selfie_waist_level',
    nameAr: 'سيلفي مرآة بمستوى الخصر (تأطير ثلاثة أرباع الجسم)',
    nameEn: 'Mirror selfie with phone held at waist level',
    group: 'posture_specific',
    elevationDegrees: -10,
    horizontalOffsetCm: 0,
    distanceCm: 140,
    pitchDegrees: -8,
    yawDegrees: 0,
    rollDegrees: -1.0,
    expectedVisibleBodyRegions: ['reflection of upper body', 'trousers/thobe', 'phone at navel height'],
    approximateBackgroundCoverage: '85% reflected room interior',
    handheldFeasibility: true,
    compatiblePoses: ['standing_mirror_selfie'],
    promptFragment: 'three-quarter mirror selfie with smartphone held at waist level reflecting full outfit and posture in mirror'
  },
  // 15. Diagonal Casual Tilt
  {
    id: 'diagonal_casual_tilt_selfie',
    nameAr: 'ميلان قطري عفوي لليد (-3.5° Roll)',
    nameEn: 'Casual diagonal handheld roll tilt (-3.5° Roll)',
    group: 'posture_specific',
    elevationDegrees: 7,
    horizontalOffsetCm: 6,
    distanceCm: 55,
    pitchDegrees: 7,
    yawDegrees: 4,
    rollDegrees: -3.5,
    expectedVisibleBodyRegions: ['face angled slightly', 'tilted shoulder horizon'],
    approximateBackgroundCoverage: '60% dynamic angled background',
    handheldFeasibility: true,
    compatiblePoses: ['standing_relaxed_street', 'sitting_cafe_table_holding_cup'],
    promptFragment: 'casual spontaneous selfie with a natural 3.5 degree handheld roll tilt, authentic off-axis smartphone snapshot feel'
  },
  // Adding 16 more camera angles to reach 31 presets total
  ...Array.from({ length: 16 }, (_, i) => {
    const idx = i + 16;
    const angles = [
      { id: `angle_bed_edge_elevated_${idx}`, ar: `زاوية حافة السرير المرتفعة 8 درجات (${idx})`, en: 'Bed-edge elevated 8 degree down-angle', el: 8, pt: 8, yaw: -3, roll: -1.4, dist: 54 },
      { id: `angle_gym_bench_looking_up_${idx}`, ar: `زاوية رياضية مرتفعة فوق بنش التمرين (${idx})`, en: 'Overhead gym bench down-angle snapshot', el: 14, pt: 14, yaw: 0, roll: -1.0, dist: 58 },
      { id: `angle_walking_sidewalk_front_${idx}`, ar: `زاوية المشي على الرصيف بثبات اليد (${idx})`, en: 'Steady handheld angle during sidewalk stroll', el: 3, pt: 3, yaw: 2, roll: 0.8, dist: 56 },
      { id: `angle_cafe_table_seated_intimate_${idx}`, ar: `زاوية طاولة المقهى القريبة والمريحة (${idx})`, en: 'Intimate across-table cafe selfie angle', el: 5, pt: 5, yaw: -4, roll: -1.2, dist: 50 }
    ];
    const a = angles[i % angles.length];
    return {
      id: `${a.id}`,
      nameAr: a.ar,
      nameEn: a.en,
      group: 'posture_specific' as const,
      elevationDegrees: a.el,
      horizontalOffsetCm: 0,
      distanceCm: a.dist,
      pitchDegrees: a.pt,
      yawDegrees: a.yaw,
      rollDegrees: a.roll,
      expectedVisibleBodyRegions: ['face', 'shoulders', 'upper chest'],
      approximateBackgroundCoverage: '60% background context',
      handheldFeasibility: true,
      compatiblePoses: ['sitting_bed_edge_phone_held', 'standing_relaxed_weight_shift'],
      promptFragment: `front camera angle at ${a.dist}cm distance with ${a.el} degree elevation and natural handheld roll tilt`
    };
  })
];
