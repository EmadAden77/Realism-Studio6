/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { V4GazePreset } from '../../types/v4';

export const ALL_GAZE_PRESETS: V4GazePreset[] = [
  {
    id: 'gaze_direct_lens',
    nameAr: 'مباشرة نحو عدسة الكاميرا (Eye-Contact)',
    nameEn: 'Directly into camera lens optical center',
    targetDescription: 'Pupils locked dead-center onto camera lens pupil',
    horizontalAngleDeg: 0,
    verticalAngleDeg: 0,
    compatiblePoses: ['standing_relaxed_weight_shift', 'sitting_cafe_table_holding_cup'],
    promptFragment: 'eyes directed dead-center into the smartphone camera lens, authentic direct eye contact with viewer'
  },
  {
    id: 'gaze_phone_screen',
    nameAr: 'نحو شاشة الهاتف (أسفل العدسة بـ 10-15 درجة)',
    nameEn: 'Toward smartphone screen surface (natural selfie gaze)',
    targetDescription: 'Eyes angled 12 degrees downward checking self-preview on glass screen',
    horizontalAngleDeg: 0,
    verticalAngleDeg: -12,
    compatiblePoses: ['sitting_bed_edge_phone_held', 'reclining_pillows_diagonal', 'sitting_car_driver_seatbelt_on'],
    promptFragment: 'eyes angled 12 degrees downward looking directly at the phone screen surface, characteristic authentic smartphone selfie glance'
  },
  {
    id: 'gaze_slightly_below_lens',
    nameAr: 'أسفل العدسة بمسافة قصيرة (إطار الهاتف العلوي)',
    nameEn: 'Subtly below camera lens at top bezel',
    targetDescription: 'Pupils angled 4 degrees down from lens center',
    horizontalAngleDeg: 0,
    verticalAngleDeg: -4,
    compatiblePoses: ['standing_hand_in_pocket', 'sitting_sofa_relaxed_lean'],
    promptFragment: 'eyes aimed subtly below the camera lens at the top bezel of the phone, natural relaxed smartphone gaze'
  },
  {
    id: 'gaze_slightly_above_lens',
    nameAr: 'أعلى العدسة بقليل نحو الأفق',
    nameEn: 'Slightly above camera lens toward horizon',
    targetDescription: 'Eyes elevated 5 degrees above camera level',
    horizontalAngleDeg: 0,
    verticalAngleDeg: 5,
    compatiblePoses: ['standing_relaxed_street', 'standing_balcony_fresh_air'],
    promptFragment: 'eyes directed slightly above the camera lens toward the distant room horizon, contemplative clear gaze'
  },
  {
    id: 'gaze_lateral_left_distracted',
    nameAr: 'نظرة جانبية نحو اليسار (خارج الإطار)',
    nameEn: 'Glance toward the left side off-camera',
    targetDescription: 'Pupils shifted 25 degrees leftward',
    horizontalAngleDeg: -25,
    verticalAngleDeg: -2,
    compatiblePoses: ['sitting_cafe_table_holding_cup', 'walking_looking_sideways_curious'],
    promptFragment: 'gaze directed off-camera to the left as if noticing someone entering the room or passing by outside'
  },
  {
    id: 'gaze_lateral_right_observant',
    nameAr: 'نظرة جانبية نحو اليمين (خارج الإطار)',
    nameEn: 'Glance toward the right side off-camera',
    targetDescription: 'Pupils shifted 25 degrees rightward',
    horizontalAngleDeg: 25,
    verticalAngleDeg: -2,
    compatiblePoses: ['sitting_sofa_relaxed_lean', 'standing_leaning_wall_shoulder'],
    promptFragment: 'eyes turned 25 degrees to the right looking casually off-frame, observant candid presence'
  },
  {
    id: 'gaze_downward_at_hands',
    nameAr: 'نحو اليدين أو الهاتف أثناء التعديل',
    nameEn: 'Looking downward toward hands or lap',
    targetDescription: 'Head and eyes oriented down 20 degrees',
    horizontalAngleDeg: 0,
    verticalAngleDeg: -20,
    compatiblePoses: ['pose_adjusting_tshirt_sleeve_tension', 'pose_checking_wristwatch_time'],
    promptFragment: 'eyes cast downward toward hands, concentrating on adjusting clothing cuff, candid unposed focus'
  },
  {
    id: 'gaze_upward_overhead',
    nameAr: 'نحو الأعلى أثناء الاستلقاء على الظهر',
    nameEn: 'Looking upward directly at overhead camera',
    targetDescription: 'Eyes oriented perpendicular to mattress toward held phone',
    horizontalAngleDeg: 0,
    verticalAngleDeg: 0,
    compatiblePoses: ['lying_back_arms_up'],
    promptFragment: 'eyes looking upward at the phone held overhead while lying back, pupils centered calmly'
  },
  {
    id: 'gaze_toward_sleeve_adjustment',
    nameAr: 'نحو كم القميص أثناء ترتيبه',
    nameEn: 'Gazing directly at shirt sleeve or watch',
    targetDescription: 'Eyes focused 25cm away on forearm sleeve cuff',
    horizontalAngleDeg: -15,
    verticalAngleDeg: -18,
    compatiblePoses: ['pose_adjusting_tshirt_sleeve_tension'],
    promptFragment: 'gaze focused intently on the shirt sleeve being adjusted by fingers, authentic candid attention'
  },
  {
    id: 'gaze_toward_nearby_person',
    nameAr: 'نحو شخص جالس بجانبه أثناء التحدث',
    nameEn: 'Looking toward companion seated nearby while speaking',
    targetDescription: 'Eyes angled 30 degrees toward side companion',
    horizontalAngleDeg: 30,
    verticalAngleDeg: 0,
    compatiblePoses: ['expr_attentive_listener', 'sitting_cafe_table_holding_cup'],
    promptFragment: 'eyes directed toward an off-camera companion, engaged attentive expression, mid-conversation glance'
  },
  {
    id: 'gaze_toward_mirror_reflection',
    nameAr: 'نحو انعكاس الوجه في المرآة مباشرة',
    nameEn: 'Looking at self-reflection in the mirror',
    targetDescription: 'Eyes focused on mirror plane reflection',
    horizontalAngleDeg: 0,
    verticalAngleDeg: 0,
    compatiblePoses: ['standing_mirror_selfie', 'sitting_barber_chair_mirror'],
    promptFragment: 'eyes focused directly on own reflection in the mirror surface, checking appearance and hair'
  },
  {
    id: 'gaze_toward_window_daylight',
    nameAr: 'نحو نافذة الغرفة ونور النهار الطبيعي',
    nameEn: 'Gazing out toward ambient window daylight',
    targetDescription: 'Eyes turned 35 degrees toward window light source',
    horizontalAngleDeg: 35,
    verticalAngleDeg: 2,
    compatiblePoses: ['sitting_armchair_looking_window', 'standing_looking_window'],
    promptFragment: 'eyes turned toward the soft natural daylight streaming through the window, gentle iris catchlight'
  },
  {
    id: 'gaze_toward_vehicle_dashboard',
    nameAr: 'نحو طبلون وعدادات السيارة في المقعد',
    nameEn: 'Looking down toward car dashboard instruments',
    targetDescription: 'Eyes angled downward toward instrument cluster',
    horizontalAngleDeg: 0,
    verticalAngleDeg: -15,
    compatiblePoses: ['sitting_car_driver_seatbelt_on'],
    promptFragment: 'eyes looking down toward the car center console and gauges, calm parked vehicle ambiance'
  },
  {
    id: 'gaze_toward_street_activity',
    nameAr: 'نحو حركة المارة أو السيارات في الشارع',
    nameEn: 'Observing street movement or passing traffic',
    targetDescription: 'Eyes surveying distant street scene',
    horizontalAngleDeg: 20,
    verticalAngleDeg: 0,
    compatiblePoses: ['standing_relaxed_street', 'sitting_patio_coffee'],
    promptFragment: 'eyes surveying the street activity in the distance, natural casual observant curiosity'
  },
  {
    id: 'gaze_talking_while_looking',
    nameAr: 'نظرة تفاعلية حية أثناء الحديث والكلام',
    nameEn: 'Speaking and animatedly glancing at viewer',
    targetDescription: 'Expressive eye contact paired with mid-speech lips',
    horizontalAngleDeg: 2,
    verticalAngleDeg: -2,
    compatiblePoses: ['expr_spontaneous_interrupted_moment'],
    promptFragment: 'animated expressive eye contact as if speaking mid-sentence to the camera, lively candid interaction'
  },
  {
    id: 'gaze_brief_distracted_moment',
    nameAr: 'تشتت انتباه عفوي للحظة (نظرة خاطفة)',
    nameEn: 'Brief momentary distracted glance away',
    targetDescription: 'Eyes caught mid-saccade looking off-target',
    horizontalAngleDeg: -18,
    verticalAngleDeg: 5,
    compatiblePoses: ['standing_walking_hallway'],
    promptFragment: 'momentary distracted glance, eyes caught mid-motion looking away from the camera in candid thought'
  },
  {
    id: 'gaze_looking_away_after_action',
    nameAr: 'النظر بعيداً بعد الانتهاء من حركة معينة',
    nameEn: 'Looking away casually right after completing an action',
    targetDescription: 'Relaxed unhurried off-camera gaze',
    horizontalAngleDeg: 15,
    verticalAngleDeg: -6,
    compatiblePoses: ['pose_sipping_coffee_cup', 'sitting_bed_edge_phone_held'],
    promptFragment: 'eyes looking calmly away right after taking a sip or setting phone down, peaceful authentic pause'
  },
  {
    id: 'gaze_natural_neutral_resting',
    nameAr: 'نظرة سكون واسترخاء طبيعية (Resting Gaze)',
    nameEn: 'Natural soft resting gaze without intense focus',
    targetDescription: 'Soft unfocused pupils resting at comfortable focal distance',
    horizontalAngleDeg: 0,
    verticalAngleDeg: -3,
    compatiblePoses: ['expr_natural_resting_face', 'sitting_sofa_relaxed_lean'],
    promptFragment: 'soft resting gaze with gentle eye relaxation, no artificial camera staring, effortless natural presence'
  },
  {
    id: 'gaze_coffee_cup_check',
    nameAr: 'النظر إلى فنجان القهوة أو كوب الشاي',
    nameEn: 'Looking down at the warm coffee cup in hand',
    targetDescription: 'Eyes focused 35cm down on coffee rim',
    horizontalAngleDeg: -10,
    verticalAngleDeg: -16,
    compatiblePoses: ['sitting_cafe_table_holding_cup', 'pose_holding_coffee_cup_waist_level'],
    promptFragment: 'gaze directed downward checking the warm coffee cup in hand, calm cafe contemplation'
  },
  {
    id: 'gaze_custom_target',
    nameAr: 'هدف نظرة مخصص حسب سياق المشهد',
    nameEn: 'Custom scene-dependent contextual gaze target',
    targetDescription: 'Aligned with specific environment object or activity',
    horizontalAngleDeg: 5,
    verticalAngleDeg: -5,
    compatiblePoses: ['standing_relaxed_weight_shift'],
    promptFragment: 'eyes naturally aligned with the ongoing candid activity in the scene, coherent focus and head posture'
  }
];
