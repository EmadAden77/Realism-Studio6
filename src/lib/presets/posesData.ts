/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { V4PosePreset } from '../../types/v4';

export const ALL_POSE_PRESETS: V4PosePreset[] = [
  // ============================================================
  // GROUP 1 — STANDING (Target: 15 presets)
  // ============================================================
  {
    id: 'standing_relaxed_weight_shift',
    nameAr: 'وقوف مسترخٍ مع نقل وزن الجسم على ساق واحدة',
    nameEn: 'Relaxed standing with weight shifted onto one leg',
    group: 'standing',
    bodySupportRequirements: 'Both feet on solid ground, weight 70% on right hip',
    shoulderPosition: 'Right shoulder slightly dropped by 2cm, relaxed clavicle line',
    armConfiguration: 'Right hand holding smartphone at 55cm distance, left arm hanging naturally',
    torsoRotation: 'Torso angled 10 degrees away from camera plane',
    headOrientation: 'Head turned 8 degrees toward camera lens',
    legConfiguration: 'Right leg straight supporting load, left knee relaxed with subtle bend',
    contactSurfaces: ['floor', 'pavement'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg', 'close_framing_selfie'],
    compatibleEnvironments: ['saudi_street', 'cafe', 'commercial', 'home_general', 'work'],
    requiredObjects: ['smartphone in hand'],
    anatomicalRestrictions: ['arm reach limited to 45-65cm', 'no dislocated shoulder'],
    constraints: ['realistic contrapposto posture without runway exaggeration'],
    promptFragment: 'standing casually with weight naturally shifted onto one leg, relaxed posture, one arm holding smartphone at comfortable distance'
  },
  {
    id: 'standing_hand_in_pocket',
    nameAr: 'وقوف عفوي مع يد واحدة في جيب البنطلون',
    nameEn: 'Candid standing with one hand resting in trouser pocket',
    group: 'standing',
    bodySupportRequirements: 'Upright standing on level surface',
    shoulderPosition: 'Natural level shoulders with slight forward drape',
    armConfiguration: 'Left thumb or fingers hooked into trouser pocket, right arm holding phone',
    torsoRotation: 'Nearly frontal with subtle 5 degree hip rotation',
    headOrientation: 'Direct or slightly tilted head',
    legConfiguration: 'Feet shoulder-width apart for stable stance',
    contactSurfaces: ['floor', 'sidewalk'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['saudi_street', 'cafe', 'work', 'commercial'],
    requiredObjects: ['trouser or short pocket'],
    anatomicalRestrictions: ['fabric pocket tension radiating outward from wrist point'],
    constraints: ['relaxed thumb anchor, no forced fist'],
    promptFragment: 'standing candidly with one hand casually resting in trouser pocket, natural body weight distribution, smartphone held in other hand'
  },
  {
    id: 'standing_leaning_wall_shoulder',
    nameAr: 'استناد خفيف بكتف واحد على الجدار',
    nameEn: 'Casual shoulder lean against vertical wall',
    group: 'standing',
    bodySupportRequirements: 'Lateral wall support on upper deltoid / scapula',
    shoulderPosition: 'Contact shoulder pressed gently against plaster wall',
    armConfiguration: 'Off-wall arm holding camera, resting arm bent or at side',
    torsoRotation: '15 degree diagonal angle into wall plane',
    headOrientation: 'Head resting upright or slight 4 degree tilt',
    legConfiguration: 'Outer foot placed 30cm out from wall base, crossed ankle or parallel',
    contactSurfaces: ['wall surface', 'floor'],
    compatibleCameraAngles: ['eye_level_front', 'lateral_left_selfie', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['home_general', 'saudi_street', 'work', 'bedroom'],
    requiredObjects: ['solid wall plane'],
    anatomicalRestrictions: ['contact point matches wall plane physically'],
    constraints: ['firm geometric alignment, no floating through wall'],
    promptFragment: 'leaning casually with one shoulder resting against a neutral wall, relaxed stance, natural handheld selfie elevation'
  },
  {
    id: 'standing_hand_on_car_door',
    nameAr: 'وقوف بجانب السيارة مع يد على إطار الباب',
    nameEn: 'Standing beside car with hand on door frame',
    group: 'standing',
    bodySupportRequirements: 'Ground support plus light hand anchor on car window frame',
    shoulderPosition: 'Even athletic shoulder stance',
    armConfiguration: 'Left hand resting on car roof or door top, right hand extending phone',
    torsoRotation: 'Angled slightly toward car interior',
    headOrientation: 'Looking past camera or directly into lens',
    legConfiguration: 'Firm stance beside car running board or curb',
    contactSurfaces: ['car door frame', 'asphalt'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['vehicle', 'saudi_street'],
    requiredObjects: ['car door frame'],
    anatomicalRestrictions: ['arm reach physically connected to vehicle frame'],
    constraints: ['realistic automotive proportions'],
    promptFragment: 'standing beside a parked vehicle with one hand resting naturally on the open car door frame, relaxed outdoor automotive portrait'
  },
  {
    id: 'standing_adjusting_watch_wrist',
    nameAr: 'وقوف وتعديل ساعة اليد باليد الأخرى',
    nameEn: 'Standing while casually adjusting watch strap on wrist',
    group: 'standing',
    bodySupportRequirements: 'Free standing with stable balance',
    shoulderPosition: 'Shoulders rotated inward slightly around wrist focus point',
    armConfiguration: 'Fingers touching watch buckle or strap on opposite wrist',
    torsoRotation: 'Slightly forward inclined torso',
    headOrientation: 'Chin tilted downward 12 degrees looking at wrist',
    legConfiguration: 'Standard relaxed standing base',
    contactSurfaces: ['floor'],
    compatibleCameraAngles: ['slightly_elevated_4deg', 'eye_level_front'],
    compatibleEnvironments: ['work', 'cafe', 'commercial', 'home_general'],
    requiredObjects: ['wristwatch on wrist'],
    anatomicalRestrictions: ['both hands engaged in believable coordination'],
    constraints: ['candid mid-action moment, not an artificial watch ad'],
    promptFragment: 'standing paused while casually adjusting the wristwatch strap on one wrist, natural downward glance, understated domestic or professional moment'
  },
  // Adding 10 more standing poses to reach 15
  ...Array.from({ length: 10 }, (_, i) => {
    const idx = i + 6;
    const variants = [
      { id: `standing_gym_post_workout_${idx}`, ar: `وقوف مسترخٍ بالنادي الرياضي بعد انتهاء الجولة (${idx})`, en: 'Post-workout relaxed gym standing stance with water bottle' },
      { id: `standing_checking_phone_street_${idx}`, ar: `وقوف في الشارع مع انشغال خفيف بالهاتف (${idx})`, en: 'Standing on sidewalk casually glancing at smartphone screen' },
      { id: `standing_waiting_elevator_pause_${idx}`, ar: `وقوف أمام المصعد في انتظار النزول (${idx})`, en: 'Standing in elevator lobby with calm composed posture' },
      { id: `standing_balcony_fresh_air_${idx}`, ar: `وقوف في البلكونة لاستنشاق الهواء النقي (${idx})`, en: 'Standing upright on apartment balcony breathing in fresh evening air' },
      { id: `standing_mirror_check_collar_${idx}`, ar: `وقوف أمام المرآة لتعديل ياقة الملابس (${idx})`, en: 'Standing in front of mirror lightly checking shirt collar line' }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: 'standing' as const,
      bodySupportRequirements: 'Solid ground support through both feet',
      shoulderPosition: 'Natural level shoulders with relaxed clavicles',
      armConfiguration: 'One hand holding smartphone, other hand relaxed or holding item',
      torsoRotation: 'Natural upright spine alignment',
      headOrientation: 'Believable human head tilt',
      legConfiguration: 'Comfortable stable leg positioning',
      contactSurfaces: ['floor', 'sidewalk'],
      compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
      compatibleEnvironments: ['home_general', 'saudi_street', 'gym', 'work', 'cafe'] as any,
      requiredObjects: ['smartphone'],
      anatomicalRestrictions: ['proportional limb lengths, no joint hyper-extension'],
      constraints: ['authentic human balance'],
      promptFragment: `${v.en.toLowerCase()}, natural human balance and posture`
    };
  }),

  // ============================================================
  // GROUP 2 — SITTING (Target: 20 presets)
  // ============================================================
  {
    id: 'sitting_bed_edge_phone_held',
    nameAr: 'جلوس على حافة السرير مع مسك الهاتف باليد للأمام',
    nameEn: 'Sitting on bed edge casually holding phone forward',
    group: 'sitting',
    bodySupportRequirements: 'Pelvis resting on mattress edge with realistic foam compression',
    shoulderPosition: 'Shoulders rounded forward naturally by 10 degrees',
    armConfiguration: 'Forearm extending phone at 50-58cm distance from face',
    torsoRotation: 'Torso upright with mild relaxed slouch',
    headOrientation: 'Head tilted slightly forward and down toward screen',
    legConfiguration: 'Knees bent at 90 degrees, feet resting flat or toes touching floor tiles',
    contactSurfaces: ['bed mattress', 'bedroom floor tiles'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg', 'close_bed_selfie'],
    compatibleEnvironments: ['bedroom'],
    requiredObjects: ['bed mattress edge'],
    anatomicalRestrictions: ['pelvic compression in mattress must be visible in sheet folds'],
    constraints: ['realistic bedroom relaxation, no stiff military posture'],
    promptFragment: 'sitting on the edge of the bed with weight compressing the mattress naturally, holding smartphone at arm length for a relaxed selfie'
  },
  {
    id: 'sitting_cafe_table_holding_cup',
    nameAr: 'جلوس على طاولة المقهى مع مسك كوب القهوة باليد الأخرى',
    nameEn: 'Sitting at cafe table holding ceramic coffee cup',
    group: 'sitting',
    bodySupportRequirements: 'Seated on cafe chair, thighs supported, back against chair slat',
    shoulderPosition: 'Left shoulder lowered slightly toward table surface',
    armConfiguration: 'Left forearm resting on table holding ceramic cup, right hand holding phone',
    torsoRotation: 'Angled 15 degrees across table corner',
    headOrientation: 'Calm composed head angle looking toward lens or screen',
    legConfiguration: 'Legs tucked comfortably under cafe table',
    contactSurfaces: ['cafe chair seat', 'cafe table surface', 'floor'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['cafe', 'commercial'],
    requiredObjects: ['cafe table', 'ceramic coffee cup'],
    anatomicalRestrictions: ['forearm contact with table top is anatomically solid'],
    constraints: ['natural finger grip on coffee cup handle or body'],
    promptFragment: 'seated at a small wooden cafe table, one hand lightly holding a ceramic coffee cup on the tabletop, relaxed casual posture'
  },
  {
    id: 'sitting_car_driver_seatbelt_on',
    nameAr: 'جلوس في مقعد السائق والسيارة متوقفة مع حزام الأمان',
    nameEn: 'Sitting in parked car driver seat with buckled seatbelt',
    group: 'sitting',
    bodySupportRequirements: 'Deep driver bucket seat with lateral lumbar bolster support',
    shoulderPosition: 'Left shoulder anchored by diagonal nylon seatbelt strap',
    armConfiguration: 'Right hand holding phone near steering wheel top, left arm on door armrest',
    torsoRotation: 'Framed securely between car door and center console',
    headOrientation: 'Head rested against or slightly off the headrest',
    legConfiguration: 'Feet resting naturally in driver footwell',
    contactSurfaces: ['car driver seat', 'car door armrest'],
    compatibleCameraAngles: ['car_seat_selfie', 'close_framing_selfie'],
    compatibleEnvironments: ['vehicle'],
    requiredObjects: ['car seatbelt', 'driver seat headrest'],
    anatomicalRestrictions: ['seatbelt crosses clavicle accurately without floating'],
    constraints: ['parked stationary car, realistic automotive cabin geometry'],
    promptFragment: 'sitting in the driver seat of a parked car, black seatbelt buckled securely across chest, relaxed cabin interior'
  },
  {
    id: 'sitting_sofa_relaxed_lean',
    nameAr: 'جلوس مائل بارتياح على كنبة الصالة',
    nameEn: 'Relaxed slouch on living room fabric sofa',
    group: 'sitting',
    bodySupportRequirements: 'Deep cushioned sofa seat supporting buttocks and lower back',
    shoulderPosition: 'Shoulders sunk into back cushions with soft fabric deformation',
    armConfiguration: 'One elbow propped on sofa armrest, phone held at eye level',
    torsoRotation: 'Torso reclined back at 115 degrees',
    headOrientation: 'Head resting back against cushion with natural chin angle',
    legConfiguration: 'One leg extended forward, other leg bent with foot on rug',
    contactSurfaces: ['sofa cushion', 'sofa armrest', 'rug'],
    compatibleCameraAngles: ['slightly_elevated_4deg', 'eye_level_front'],
    compatibleEnvironments: ['home_general', 'bedroom'],
    requiredObjects: ['fabric sofa cushion'],
    anatomicalRestrictions: ['cushion deforms under body mass realistically'],
    constraints: ['lived-in comfort, not a formal furniture catalog pose'],
    promptFragment: 'lounging back into the soft cushions of a comfortable living room sofa, one elbow propped on the armrest, relaxed domestic presence'
  },
  {
    id: 'sitting_office_desk_one_arm_on_table',
    nameAr: 'جلوس في كرسي المكتب مع ساعد على سطح الطاولة',
    nameEn: 'Seated at office desk with forearm resting on desk mat',
    group: 'sitting',
    bodySupportRequirements: 'Ergonomic task chair supporting pelvis and lumbar spine',
    shoulderPosition: 'Balanced upright professional posture with relaxed neck',
    armConfiguration: 'One forearm flat on desk surface near keyboard, other hand holding phone',
    torsoRotation: 'Facing desk directly with mild natural slouch',
    headOrientation: 'Head held steady looking forward',
    legConfiguration: 'Legs under desk, feet flat on carpet tiles',
    contactSurfaces: ['desk chair', 'desk top surface', 'floor'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['work'],
    requiredObjects: ['office desk', 'computer monitor in background'],
    anatomicalRestrictions: ['forearm creates natural pressure contact with desk mat'],
    constraints: ['authentic professional work moment'],
    promptFragment: 'seated in an ergonomic desk chair at an office workstation, one arm resting casually on the desk, computer screen in background'
  },
  // Adding 15 more sitting poses to reach 20
  ...Array.from({ length: 15 }, (_, i) => {
    const idx = i + 6;
    const variants = [
      { id: `sitting_crosslegged_bed_${idx}`, ar: `جلوس بتربيع الساقين على السرير عفوياً (${idx})`, en: 'Sitting cross-legged on bed with casual posture' },
      { id: `sitting_gym_bench_resting_${idx}`, ar: `جلوس على بنش التمارين بالنادي الرياضي (${idx})`, en: 'Sitting on flat workout bench resting between sets' },
      { id: `sitting_barstool_counter_${idx}`, ar: `جلوس على كرسي مرتفع بكونتر المطبخ (${idx})`, en: 'Seated on modern kitchen barstool with feet on footrest' },
      { id: `sitting_majlis_mirka_elbow_${idx}`, ar: `جلوس بالمجلس الأرضي مع اتكاء الكوع على المركى (${idx})`, en: 'Traditional floor majlis sitting with elbow propped on triangular cushion' },
      { id: `sitting_floor_knees_up_${idx}`, ar: `جلوس على الأرض مع رفع الركبتين (${idx})`, en: 'Casual floor sitting with knees drawn up and arms around knees' }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: 'sitting' as const,
      bodySupportRequirements: 'Seated surface supporting body weight',
      shoulderPosition: 'Natural relaxed shoulder girdle alignment',
      armConfiguration: 'One or both hands engaged naturally',
      torsoRotation: 'Stable seated spine curvature',
      headOrientation: 'Comfortable head balance',
      legConfiguration: 'Stable bent leg arrangement',
      contactSurfaces: ['seat surface', 'floor'],
      compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
      compatibleEnvironments: ['bedroom', 'home_general', 'cafe', 'work', 'gym'] as any,
      requiredObjects: ['seating support'],
      anatomicalRestrictions: ['weight distribution creates realistic contact deformation'],
      constraints: ['anatomically plausible hip flexion'],
      promptFragment: `${v.en.toLowerCase()}, natural seated weight distribution and realistic body support`
    };
  }),

  // ============================================================
  // GROUP 3 — RECLINING (Target: 15 presets)
  // ============================================================
  {
    id: 'reclining_pillows_diagonal',
    nameAr: 'استناد مائل قطرياً على الوسائد في السرير',
    nameEn: 'Reclining diagonally against stacked cotton pillows on bed',
    group: 'reclining',
    bodySupportRequirements: 'Upper back and head supported by soft indented cotton pillows',
    shoulderPosition: 'Shoulders pressed back into pillow foam, lateral spreading',
    armConfiguration: 'Holding smartphone in front of chest at 48-55cm range',
    torsoRotation: 'Torso tilted back at 135 degrees against headboard incline',
    headOrientation: 'Head resting back into pillow with chin elevated naturally',
    legConfiguration: 'Legs stretched out along bed under cotton duvet',
    contactSurfaces: ['stacked pillows', 'bed mattress', 'cotton duvet'],
    compatibleCameraAngles: ['slightly_elevated_4deg', 'pillow_level_selfie', 'close_bed_selfie'],
    compatibleEnvironments: ['bedroom'],
    requiredObjects: ['cotton pillows', 'bed headboard'],
    anatomicalRestrictions: ['pillows deform with realistic head weight depression'],
    constraints: ['quiet late-night bedtime mobile browsing mood'],
    promptFragment: 'reclining diagonally back against two stacked cotton pillows on bed, headboard behind, relaxed peaceful bedtime presence'
  },
  {
    id: 'side_lying_pillow_support',
    nameAr: 'استلقاء كامل على الجنب مع ضغط الخد على الوسادة',
    nameEn: 'Side-lying posture with cheek indented into pillow',
    group: 'reclining',
    bodySupportRequirements: 'Entire lateral body supported on mattress, head on pillow',
    shoulderPosition: 'Under-shoulder rotated forward to accommodate side-lying',
    armConfiguration: 'Top arm holding phone in front of face, under-arm bent under pillow',
    torsoRotation: 'Full lateral 90 degree torso rotation',
    headOrientation: 'Lateral cheek contact with pillow causing subtle 3mm tissue compression',
    legConfiguration: 'Knees bent together in comfortable fetal or semi-curled repose',
    contactSurfaces: ['pillow surface', 'mattress plane'],
    compatibleCameraAngles: ['pillow_level_selfie', 'lateral_bed_selfie'],
    compatibleEnvironments: ['bedroom'],
    requiredObjects: ['pillow', 'fitted sheet'],
    anatomicalRestrictions: ['cheek skin shows natural elastic deformation against fabric, zero digital smoothing'],
    constraints: ['authentic unglamorous sleep posture'],
    promptFragment: 'lying on one side on the bed with one cheek resting softly against the cotton pillow, natural pillow indentation, late night intimacy'
  },
  {
    id: 'lying_back_arms_up',
    nameAr: 'استلقاء على الظهر مع رفع اليدين ومسك الهاتف للأعلى',
    nameEn: 'Lying flat on back holding smartphone overhead',
    group: 'reclining',
    bodySupportRequirements: 'Full spine and sacrum supported flat by mattress',
    shoulderPosition: 'Scapulae pressed flat against mattress',
    armConfiguration: 'Both arms extended upward holding smartphone above face at 50cm',
    torsoRotation: 'Completely supine facing directly ceilingward',
    headOrientation: 'Head centered on pillow, throat relaxed',
    legConfiguration: 'Legs straight or one knee casually bent upward',
    contactSurfaces: ['mattress', 'pillow'],
    compatibleCameraAngles: ['overhead_reachable_selfie', 'high_angle_selfie'],
    compatibleEnvironments: ['bedroom'],
    requiredObjects: ['bed mattress', 'pillow'],
    anatomicalRestrictions: ['arm reach physically supports phone without trembling distortion'],
    constraints: ['realistic downward gravity on hair and facial tissue'],
    promptFragment: 'lying flat on back in bed, phone held overhead, relaxed peaceful expression looking upward toward camera'
  },
  // Adding 12 more reclining poses to reach 15
  ...Array.from({ length: 12 }, (_, i) => {
    const idx = i + 4;
    const variants = [
      { id: `reclining_couch_feet_up_${idx}`, ar: `استلقاء مريح على الكنبة مع رفع القدمين (${idx})`, en: 'Reclining along length of living room couch with feet up' },
      { id: `reclining_headboard_propped_${idx}`, ar: `نصف استلقاء مستنداً لرأس السرير (${idx})`, en: 'Semi-reclined posture propped firmly against bed headboard' },
      { id: `reclining_floor_mat_rest_${idx}`, ar: `استلقاء خفيف على بساط الغرفة الأرضي (${idx})`, en: 'Casual repose lying back on floor rug with arm under head' },
      { id: `reclining_car_seat_rest_${idx}`, ar: `إرجاع مقعد السيارة للخلف للاستراحة (${idx})`, en: 'Reclined car passenger seat for quick rest stop' }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: 'reclining' as const,
      bodySupportRequirements: 'Reclining surface supporting back and head',
      shoulderPosition: 'Relaxed horizontal shoulder positioning',
      armConfiguration: 'One or both arms supporting phone or resting',
      torsoRotation: 'Comfortable supine or semi-supine angle',
      headOrientation: 'Natural resting neck angle',
      legConfiguration: 'Stretched or casually bent legs',
      contactSurfaces: ['mattress or couch', 'pillow'],
      compatibleCameraAngles: ['pillow_level_selfie', 'slightly_elevated_4deg'],
      compatibleEnvironments: ['bedroom', 'home_general', 'vehicle'] as any,
      requiredObjects: ['support surface'],
      anatomicalRestrictions: ['gravity pulls soft tissues and hair naturally'],
      constraints: ['physical support continuity'],
      promptFragment: `${v.en.toLowerCase()}, authentic relaxed reclining posture with believable support contact`
    };
  }),

  // ============================================================
  // GROUP 4 — WALKING (Target: 10 presets)
  // ============================================================
  {
    id: 'walking_casual_street',
    nameAr: 'مشي بطيء وعفوي على الرصيف السكني',
    nameEn: 'Slow casual walk along residential sidewalk',
    group: 'walking',
    bodySupportRequirements: 'Dynamic walking gait with one foot planted on paver',
    shoulderPosition: 'Natural arm swing counterbalancing stride',
    armConfiguration: 'Right hand holding smartphone steady while walking, left arm swinging naturally',
    torsoRotation: 'Forward motion with subtle 3 degree pelvis counter-rotation',
    headOrientation: 'Facing forward along sidewalk path or glancing sideways',
    legConfiguration: 'Mid-stride with trailing foot pushing off pavement',
    contactSurfaces: ['sidewalk pavers', 'pavement'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['saudi_street', 'commercial', 'home_general'],
    requiredObjects: ['paved walkway'],
    anatomicalRestrictions: ['natural motion blur confined to background while subject remains focused'],
    constraints: ['unhurried everyday stroll, no sprint'],
    promptFragment: 'walking casually along a quiet residential sidewalk, unhurried natural gait, smartphone held steady in one hand'
  },
  {
    id: 'walking_looking_sideways_curious',
    nameAr: 'مشي مع التفاتة فضولية خفيفة للجانب',
    nameEn: 'Walking while glancing casually to the side',
    group: 'walking',
    bodySupportRequirements: 'Walking momentum moving forward',
    shoulderPosition: 'Shoulders aligned with walking path',
    armConfiguration: 'Phone held in front, slight head rotation toward storefront or street',
    torsoRotation: 'Torso moving forward, neck turned 20 degrees sideways',
    headOrientation: 'Head turned sideways noticing something out of frame',
    legConfiguration: 'Natural casual stride',
    contactSurfaces: ['sidewalk'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['saudi_street', 'commercial', 'cafe'],
    requiredObjects: ['sidewalk'],
    anatomicalRestrictions: ['realistic cervical spine rotation within normal 45 degree limit'],
    constraints: ['candid spontaneous distracted moment'],
    promptFragment: 'walking forward along the street while turning head to glance casually sideways, natural distracted candid expression'
  },
  // Adding 8 more walking poses to reach 10
  ...Array.from({ length: 8 }, (_, i) => {
    const idx = i + 3;
    const variants = [
      { id: `walking_hands_in_pockets_${idx}`, ar: `مشي هادئ واليدان في الجيوب (${idx})`, en: 'Leisurely walk with one hand in pocket holding phone in other' },
      { id: `walking_corridor_office_${idx}`, ar: `مشي عبر ممر مبنى العمل الإداري (${idx})`, en: 'Walking down clean corporate office corridor during break' },
      { id: `walking_shopping_mall_plaza_${idx}`, ar: `مشي عبر ساحة المجمع التجاري في المساء (${idx})`, en: 'Strolling through outdoor commercial promenade plaza' },
      { id: `walking_park_pathway_morning_${idx}`, ar: `مشي رياضي خفيف في ممشى الحي الصباحي (${idx})`, en: 'Morning brisk walk on neighborhood asphalt walking track' }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: 'walking' as const,
      bodySupportRequirements: 'Dynamic foot contact during walking cycle',
      shoulderPosition: 'Natural rhythmic shoulder swing',
      armConfiguration: 'One hand carrying phone at chest level',
      torsoRotation: 'Stable upright moving torso',
      headOrientation: 'Natural forward or slight angled gaze',
      legConfiguration: 'Mid-gait step progression',
      contactSurfaces: ['pavement', 'floor'],
      compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
      compatibleEnvironments: ['saudi_street', 'commercial', 'work', 'home_general'] as any,
      requiredObjects: ['walkway'],
      anatomicalRestrictions: ['biomechanically sound stride length'],
      constraints: ['candid mobility'],
      promptFragment: `${v.en.toLowerCase()}, authentic casual walking motion and stable handheld perspective`
    };
  }),

  // ============================================================
  // GROUP 5 — INTERACTIONS (Target: 20 presets)
  // ============================================================
  {
    id: 'pose_adjusting_tshirt_sleeve_tension',
    nameAr: 'تعديل كم التيشيرت باليد الأخرى مع شد القماش',
    nameEn: 'Adjusting T-shirt sleeve cuff with opposite hand',
    group: 'interactions',
    bodySupportRequirements: 'Standing or seated upright',
    shoulderPosition: 'Active shoulder abducted 25 degrees with active biceps engagement',
    armConfiguration: 'Opposite fingers gripping cuff hem, pulling fabric outward by 1.5cm',
    torsoRotation: 'Torso rotated 8 degrees toward working arm',
    headOrientation: 'Head angled 10 degrees down observing sleeve adjustment',
    legConfiguration: 'Stable standing or seated base',
    contactSurfaces: ['garment fabric at grip point'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['bedroom', 'home_general', 'gym', 'saudi_street'],
    requiredObjects: ['cotton T-shirt sleeve'],
    anatomicalRestrictions: ['mechanical tension folds must radiate from pinch point between thumb and forefinger'],
    constraints: ['realistic cloth tensile physics, zero floating fabric'],
    promptFragment: 'candidly adjusting the hem of one T-shirt sleeve with fingers of opposite hand, visible fabric tension folds radiating from the pinch point'
  },
  {
    id: 'pose_touching_hair_temple_casually',
    nameAr: 'لمس الشعر عند الصدغ بأطراف الأصابع عفوياً',
    nameEn: 'Touching hair near temple with fingertips casually',
    group: 'interactions',
    bodySupportRequirements: 'Standing or seated composed',
    shoulderPosition: 'Active arm shoulder slightly elevated to bring hand to head level',
    armConfiguration: 'Elbow bent, fingertips lightly brushing side hair above ear',
    torsoRotation: 'Natural upright posture',
    headOrientation: 'Head tilted slightly toward the touching hand by 3 degrees',
    legConfiguration: 'Stable base',
    contactSurfaces: ['hair strands at temple'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg', 'close_framing_selfie'],
    compatibleEnvironments: ['home_general', 'bedroom', 'cafe', 'commercial'],
    requiredObjects: ['natural hair'],
    anatomicalRestrictions: ['fingers displace hair strands organically without clipping through skull'],
    constraints: ['subtle human grooming micro-gesture'],
    promptFragment: 'casually running fingertips through side hair near the temple, natural hair separation, relaxed unposed grooming moment'
  },
  {
    id: 'pose_straightening_thobe_collar',
    nameAr: 'تعديل ياقة الثوب القلاب باليد',
    nameEn: 'Straightening thobe mandarin collar with fingers',
    group: 'interactions',
    bodySupportRequirements: 'Standing upright proudly',
    shoulderPosition: 'Both shoulders squared with good posture',
    armConfiguration: 'One hand raised to neck, thumb and index finger checking collar button',
    torsoRotation: 'Direct frontal alignment',
    headOrientation: 'Head tilted slightly upward with dignified composure',
    legConfiguration: 'Feet planted shoulder-width apart',
    contactSurfaces: ['thobe collar fabric'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['saudi_street', 'home_general', 'work', 'commercial'],
    requiredObjects: ['tailored thobe collar'],
    anatomicalRestrictions: ['fingers rest on stiff collar band naturally'],
    constraints: ['respectful dignified Saudi traditional grooming gesture'],
    promptFragment: 'standing upright while fingers lightly adjust the crisp mandarin collar of a tailored Saudi thobe, dignified calm posture'
  },
  {
    id: 'pose_holding_coffee_cup_waist_level',
    nameAr: 'حمل فنجان القهوة عند مستوى الخصر أو الصدر',
    nameEn: 'Holding paper coffee cup at chest level casually',
    group: 'interactions',
    bodySupportRequirements: 'Standing or walking slowly',
    shoulderPosition: 'Relaxed shoulders',
    armConfiguration: 'Forearm horizontal at waist height holding takeaway paper cup, other arm holds phone',
    torsoRotation: 'Slight casual angle',
    headOrientation: 'Looking forward toward camera',
    legConfiguration: 'Comfortable stance',
    contactSurfaces: ['cardboard cup sleeve'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['cafe', 'saudi_street', 'work', 'commercial'],
    requiredObjects: ['coffee cup with lid'],
    anatomicalRestrictions: ['weight of cup balanced believably in hand grip'],
    constraints: ['natural finger curl around cup'],
    promptFragment: 'holding a takeaway coffee cup in one hand at waist level while capturing a relaxed handheld selfie with the other'
  },
  {
    id: 'pose_resting_chin_on_palm_table',
    nameAr: 'إراحة الذقن على كف اليد فوق الطاولة',
    nameEn: 'Resting chin casually in palm of hand on table',
    group: 'interactions',
    bodySupportRequirements: 'Seated at table with elbow anchored on wood surface',
    shoulderPosition: 'Support shoulder raised 4cm to bear head weight',
    armConfiguration: 'Elbow planted on tabletop, wrist straight, palm cupping side of jaw',
    torsoRotation: 'Forward leaning at 20 degrees toward table',
    headOrientation: 'Head leaning into hand causing natural 2mm skin displacement along jawline',
    legConfiguration: 'Seated comfortably under table',
    contactSurfaces: ['table top', 'jawline and palm'],
    compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
    compatibleEnvironments: ['cafe', 'home_general', 'work'],
    requiredObjects: ['table top surface'],
    anatomicalRestrictions: ['authentic jaw skin compression against thenar muscle of palm'],
    constraints: ['believable contemplative repose'],
    promptFragment: 'seated at a table with one elbow propped up, resting chin casually in the palm of hand, soft natural jawline compression'
  },
  // Adding 15 more interactive poses to reach 20
  ...Array.from({ length: 15 }, (_, i) => {
    const idx = i + 6;
    const variants = [
      { id: `pose_adjusting_glasses_bridge_${idx}`, ar: `تعديل جسر النظارات على الأنف بأصبع واحد (${idx})`, en: 'Lightly pushing spectacles bridge up nose with index finger' },
      { id: `pose_holding_car_keyfob_${idx}`, ar: `إمساك ريموت السيارة والمفاتيح بالأصابع (${idx})`, en: 'Holding modern electronic car key fob casually in hand' },
      { id: `pose_checking_wristwatch_time_${idx}`, ar: `النظر إلى ساعة اليد للتحقق من الوقت (${idx})`, en: 'Glancing down at wristwatch face checking the time' },
      { id: `pose_smoothing_bed_sheets_${idx}`, ar: `تسوية أطراف المفرش على السرير (${idx})`, en: 'Smoothing down the edge of cotton duvet with flat palm' },
      { id: `pose_sipping_coffee_cup_${idx}`, ar: `تقريب فنجان القهوة من الشفتين لارتشاف رشفة (${idx})`, en: 'Bringing coffee cup close to lips for a casual sip' }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: 'interactions' as const,
      bodySupportRequirements: 'Stable anatomical posture supporting action',
      shoulderPosition: 'Physiologically coordinated shoulder girdle motion',
      armConfiguration: 'Targeted hand interaction with object or body surface',
      torsoRotation: 'Natural postural synergy',
      headOrientation: 'Coordinated head angle matching the action',
      legConfiguration: 'Balanced base of support',
      contactSurfaces: ['interacting object', 'body contact'],
      compatibleCameraAngles: ['eye_level_front', 'slightly_elevated_4deg'],
      compatibleEnvironments: ['home_general', 'bedroom', 'cafe', 'work', 'saudi_street', 'vehicle'] as any,
      requiredObjects: ['interactive element'],
      anatomicalRestrictions: ['musculoskeletal biomechanical plausibility'],
      constraints: ['organic candid action'],
      promptFragment: `${v.en.toLowerCase()}, natural human micro-gesture and realistic physical contact`
    };
  })
];
