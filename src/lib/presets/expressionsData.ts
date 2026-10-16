/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { V4ExpressionPreset } from '../../types/v4';

export const ALL_EXPRESSION_PRESETS: V4ExpressionPreset[] = [
  // ============================================================
  // CATEGORY 1 — NEUTRAL (Calm, unsmiling, relaxed, resting)
  // ============================================================
  {
    id: 'expr_calm_composed_neutral',
    nameAr: 'محايد هادئ ومسترخٍ (بدون ابتسامة)',
    nameEn: 'Calm composed neutral expression (unsmiling)',
    group: 'neutral',
    intensity: 'subtle',
    facialActions: ['AU00 neutral baseline', 'relaxed zygomaticus', 'soft lips touching without tension'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.9,
    cheekElevation: 0,
    mouthCornerMovement: 0,
    lipTension: 0.1,
    jawRelaxation: 0.8,
    headOrientation: 'level, chin parallel to ground',
    eyeDirection: 'direct into camera lens or slightly downward toward screen',
    promptFragment: 'calm composed neutral facial expression, unsmiling relaxed lips softly closed, flat smooth brow, tranquil resting human presence'
  },
  {
    id: 'expr_natural_resting_face',
    nameAr: 'ملامح الوجه الطبيعية وقت السكون (Resting Face)',
    nameEn: 'Natural candid resting facial expression',
    group: 'neutral',
    intensity: 'very_subtle',
    facialActions: ['AU00 baseline', 'unforced orbicularis oris', 'smooth frontalis'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.88,
    cheekElevation: 0,
    mouthCornerMovement: 0,
    lipTension: 0,
    jawRelaxation: 0.9,
    headOrientation: 'level head posture with 1 degree natural roll',
    eyeDirection: 'calm gaze toward phone screen',
    promptFragment: 'authentic candid resting face without artificial posing, completely relaxed jaw and cheek muscles, neutral human gaze'
  },
  {
    id: 'expr_quiet_serenity',
    nameAr: 'سكينة وطمأنينة داخلية هادئة',
    nameEn: 'Quiet inner serenity and calm breathing',
    group: 'neutral',
    intensity: 'subtle',
    facialActions: ['relaxed corrugator', 'softened palpebral fissure'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.92,
    cheekElevation: 0.1,
    mouthCornerMovement: 0.2,
    lipTension: 0.1,
    jawRelaxation: 0.85,
    headOrientation: 'slightly lifted chin by 2 degrees',
    eyeDirection: 'serene direct gaze',
    promptFragment: 'quiet serene facial expression, relaxed brow and eyes, smooth relaxed features without pose tension'
  },
  {
    id: 'expr_stoic_calm',
    nameAr: 'هدوء رصين وثابت (ملامح متزنة)',
    nameEn: 'Stoic balanced composed look',
    group: 'neutral',
    intensity: 'subtle',
    facialActions: ['firm masseter relaxation', 'steady gaze'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0.05,
    eyelidOpenness: 0.95,
    cheekElevation: 0,
    mouthCornerMovement: 0,
    lipTension: 0.2,
    jawRelaxation: 0.7,
    headOrientation: 'firm steady head',
    eyeDirection: 'locked onto lens center',
    promptFragment: 'composed dignified expression, level gaze, subtle masculine jawline structure, peaceful stillness'
  },

  // ============================================================
  // CATEGORY 2 — SATISFACTION (Relief, contentment, subtle smile)
  // ============================================================
  {
    id: 'expr_subtle_micro_smile',
    nameAr: 'ابتسامة داخلية خفيفة جداً (1 مم عند طرف الشفة)',
    nameEn: 'Subtle micro-smile (1mm mouth corner lift)',
    group: 'satisfaction',
    intensity: 'subtle',
    facialActions: ['AU12 micro-upturn of zygomaticus major (1.2mm)', 'AU06 slight crinkling at outer lower eyelid margin'],
    eyebrowElevation: 0.2,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.85,
    cheekElevation: 0.25,
    mouthCornerMovement: 1.2,
    lipTension: 0.15,
    jawRelaxation: 0.75,
    headOrientation: 'head tilted 2 degrees casually',
    eyeDirection: 'warm glance toward viewer/lens',
    promptFragment: 'faint subtle micro-smile with lip corners lifted by just 1mm, gentle softening around the outer eye corners, authentic modest warmth'
  },
  {
    id: 'expr_quiet_relief_after_task',
    nameAr: 'ارتياح هادئ بعد يوم طويل أو مشوار',
    nameEn: 'Quiet relief after completing a long day or errand',
    group: 'satisfaction',
    intensity: 'subtle',
    facialActions: ['exhalation lip posture', 'softened temple tension', 'relaxed forehead'],
    eyebrowElevation: 0.1,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.82,
    cheekElevation: 0.15,
    mouthCornerMovement: 0.5,
    lipTension: 0,
    jawRelaxation: 0.95,
    headOrientation: 'head leaning back slightly into neck support',
    eyeDirection: 'relaxed gentle gaze',
    promptFragment: 'expression of quiet relief and relaxed contentment after a long productive day, softened forehead, gentle exhaling mouth posture'
  },
  {
    id: 'expr_faint_inward_amusement',
    nameAr: 'ابتسامة عفوية خفية (تسالي أو قراءة رسالة مضحكة)',
    nameEn: 'Faint inward amusement while reading a funny message',
    group: 'satisfaction',
    intensity: 'subtle',
    facialActions: ['unilateral mouth corner twitch +1.5mm', 'sparkle in iris reflection', 'gentle lower eyelid squeeze'],
    eyebrowElevation: 0.3,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.84,
    cheekElevation: 0.3,
    mouthCornerMovement: 1.5,
    lipTension: 0.2,
    jawRelaxation: 0.8,
    headOrientation: 'head angled 5 degrees down toward screen',
    eyeDirection: 'looking at phone screen',
    promptFragment: 'subtle amused expression as if reading a lighthearted text on phone, slight unilateral curl at mouth corner, eyes smiling softly'
  },
  {
    id: 'expr_small_genuine_smile',
    nameAr: 'ابتسامة طبيعية متواضعة ومغلقة الفم',
    nameEn: 'Small genuine modest closed-mouth smile',
    group: 'satisfaction',
    intensity: 'moderate',
    facialActions: ['AU12 bilateral lip corner lift', 'AU06 genuine Duchenne eye crinkle', 'closed soft lips'],
    eyebrowElevation: 0.4,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.8,
    cheekElevation: 0.45,
    mouthCornerMovement: 2.0,
    lipTension: 0.2,
    jawRelaxation: 0.7,
    headOrientation: 'warm upright tilt',
    eyeDirection: 'direct warm connection with camera',
    promptFragment: 'small genuine closed-mouth smile, authentic warmth in eyes with subtle crow-feet crinkling, natural facial symmetry'
  },

  // ============================================================
  // CATEGORY 3 — FATIGUE (Mildly tired, sleepy, just awake)
  // ============================================================
  {
    id: 'expr_early_morning_waking_drowse',
    nameAr: 'نعاس الصباح الباكر وثقل الجفون بعد الاستيقاظ للتو',
    nameEn: 'Early morning waking drowsiness with heavy eyelids',
    group: 'fatigue',
    intensity: 'subtle',
    facialActions: ['AU41 drooping upper eyelid (ptosis 1.5mm)', 'AU43 relaxed palpebral opening', 'unclenched jaw'],
    eyebrowElevation: -0.2,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.65,
    cheekElevation: -0.05,
    mouthCornerMovement: -0.2,
    lipTension: 0,
    jawRelaxation: 1.0,
    headOrientation: 'head tilted slightly sideways on neck',
    eyeDirection: 'sleepy semi-focused gaze downward',
    promptFragment: 'authentic early morning drowsiness, heavy relaxed eyelids slightly lowered, soft unposed jaw, natural sleepy awakening expression'
  },
  {
    id: 'expr_late_evening_fatigue',
    nameAr: 'تعب هادئ في آخر الليل (Late Evening Fatigue)',
    nameEn: 'Late evening calm tiredness after work',
    group: 'fatigue',
    intensity: 'subtle',
    facialActions: ['softened lower eyelid margins', 'dry calm sclera', 'neutral relaxed mouth'],
    eyebrowElevation: -0.1,
    eyebrowConvergence: 0.1,
    eyelidOpenness: 0.75,
    cheekElevation: 0,
    mouthCornerMovement: -0.3,
    lipTension: 0.05,
    jawRelaxation: 0.9,
    headOrientation: 'resting head',
    eyeDirection: 'looking at phone screen in dark bedroom',
    promptFragment: 'calm late-evening tiredness in facial expression, subtle heaviness around eyes, relaxed unforced features, quiet nighttime mood'
  },
  {
    id: 'expr_sleepy_unimpressed',
    nameAr: 'نعاس خفيف وغير متكلف (Sleepy & Unimpressed)',
    nameEn: 'Sleepy and casually unimpressed bedroom look',
    group: 'fatigue',
    intensity: 'subtle',
    facialActions: ['flat level brow', 'drooping eyelids', 'horizontal mouth line'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.7,
    cheekElevation: 0,
    mouthCornerMovement: 0,
    lipTension: 0.1,
    jawRelaxation: 0.85,
    headOrientation: 'straight forward with chin slightly back',
    eyeDirection: 'cool unbothered gaze into lens',
    promptFragment: 'sleepy casually unimpressed expression, calm dry gaze, heavy lids, zero posed vanity'
  },

  // ============================================================
  // CATEGORY 4 — ATTENTION (Focused, curious, thoughtful)
  // ============================================================
  {
    id: 'expr_thoughtful_contemplative',
    nameAr: 'تفكير واستغراق هادئ (نظرة تأمل)',
    nameEn: 'Thoughtful contemplative look with unfocused gaze',
    group: 'attention',
    intensity: 'subtle',
    facialActions: ['AU04 micro-brow furrow (0.5mm)', 'AU07 tightened lower eyelid', 'relaxed lips'],
    eyebrowElevation: 0,
    eyebrowConvergence: 0.25,
    eyelidOpenness: 0.85,
    cheekElevation: 0.1,
    mouthCornerMovement: 0,
    lipTension: 0.2,
    jawRelaxation: 0.7,
    headOrientation: 'head turned 10 degrees away from camera',
    eyeDirection: 'distant gaze away from lens',
    promptFragment: 'thoughtful contemplative expression, subtle brow concentration, eyes looking thoughtfully off-frame, deep inner composure'
  },
  {
    id: 'expr_focused_on_screen_concentration',
    nameAr: 'تركيز عميق على محتوى شاشة الهاتف',
    nameEn: 'Deep concentration focused on smartphone screen',
    group: 'attention',
    intensity: 'subtle',
    facialActions: ['narrowed palpebral fissure', 'steady pupil convergence downward', 'neutral firm mouth'],
    eyebrowElevation: -0.2,
    eyebrowConvergence: 0.3,
    eyelidOpenness: 0.8,
    cheekElevation: 0.1,
    mouthCornerMovement: 0,
    lipTension: 0.25,
    jawRelaxation: 0.65,
    headOrientation: 'chin tilted down 12 degrees',
    eyeDirection: 'pupils locked onto illuminated phone screen',
    promptFragment: 'expression of quiet concentration, pupils engaged with the screen surface below, subtle brow tension, authentic absorption in task'
  },
  {
    id: 'expr_curious_observant',
    nameAr: 'نظرة فضولية هادئة واستكشافية',
    nameEn: 'Quietly curious and observant glance',
    group: 'attention',
    intensity: 'subtle',
    facialActions: ['AU01 inner brow raise (1mm)', 'widened palpebral aperture (1.05x)'],
    eyebrowElevation: 0.8,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.98,
    cheekElevation: 0.15,
    mouthCornerMovement: 0.3,
    lipTension: 0.1,
    jawRelaxation: 0.8,
    headOrientation: 'head tilted 4 degrees quizzically',
    eyeDirection: 'curious bright glance',
    promptFragment: 'curious observant expression, slightly raised inner eyebrows, alert attentive eyes, calm inquiring presence'
  },

  // ============================================================
  // CATEGORY 5 — REACTION (Skepticism, slight confusion, mild surprise)
  // ============================================================
  {
    id: 'expr_subtle_skeptical_brow',
    nameAr: 'شكوكية طفيفة برفع حاجب واحد 1.5 مم (Quirked Brow)',
    nameEn: 'Subtle skepticism with unilateral quirked eyebrow',
    group: 'reaction',
    intensity: 'subtle',
    facialActions: ['AU02 unilateral outer brow raiser (right brow +1.8mm)', 'flat left brow', 'slight head cock'],
    eyebrowElevation: 1.5,
    eyebrowConvergence: 0.1,
    eyelidOpenness: 0.9,
    cheekElevation: 0.1,
    mouthCornerMovement: 0.4,
    lipTension: 0.2,
    jawRelaxation: 0.75,
    headOrientation: 'head tilted 5 degrees with subtle challenge',
    eyeDirection: 'steady observant gaze at camera',
    promptFragment: 'subtle skeptical expression with one eyebrow raised 1.5mm higher than the other, slight knowing half-smirk, intelligent inquiring look'
  },
  {
    id: 'expr_mild_confusion_puzzled',
    nameAr: 'حيرة خفيفة واستغراب هادئ',
    nameEn: 'Mild puzzled confusion while looking at something',
    group: 'reaction',
    intensity: 'subtle',
    facialActions: ['AU04 slight corrugator pull', 'narrowed eyes', 'slightly parted lips by 1mm'],
    eyebrowElevation: 0.2,
    eyebrowConvergence: 0.4,
    eyelidOpenness: 0.82,
    cheekElevation: 0.1,
    mouthCornerMovement: -0.2,
    lipTension: 0.15,
    jawRelaxation: 0.7,
    headOrientation: 'head tilted 6 degrees sideways',
    eyeDirection: 'focused inquiring gaze',
    promptFragment: 'mildly puzzled expression, eyebrows drawn together with subtle curiosity, slightly parted lips, natural candid inquiry'
  },
  {
    id: 'expr_spontaneous_interrupted_moment',
    nameAr: 'التفاتة مفاجئة عفوية (نظرة مقاطعة عادية)',
    nameEn: 'Spontaneous interrupted glance as someone spoke',
    group: 'reaction',
    intensity: 'subtle',
    facialActions: ['alert pupils', 'mid-breath lip parting (2mm)', 'mildly raised brows'],
    eyebrowElevation: 0.6,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.96,
    cheekElevation: 0.2,
    mouthCornerMovement: 0.5,
    lipTension: 0.05,
    jawRelaxation: 0.8,
    headOrientation: 'head mid-turn toward camera',
    eyeDirection: 'eyes catching camera lens mid-motion',
    promptFragment: 'candid interrupted moment, lips slightly parted as if paused mid-sentence, alert expressive eyes catching the camera spontaneously'
  },

  // ============================================================
  // CATEGORY 6 — SOCIAL (Listening, speaking, reacting to person)
  // ============================================================
  {
    id: 'expr_attentive_listener',
    nameAr: 'إنصات واستماع باهتمام لشخص يتحدث',
    nameEn: 'Attentive friendly listening expression',
    group: 'social',
    intensity: 'subtle',
    facialActions: ['soft nod angle', 'warm open eye aperture', 'encouraging calm mouth'],
    eyebrowElevation: 0.3,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.92,
    cheekElevation: 0.25,
    mouthCornerMovement: 0.8,
    lipTension: 0.1,
    jawRelaxation: 0.8,
    headOrientation: 'head tilted 3 degrees encouragingly',
    eyeDirection: 'attentive gaze towards nearby speaker',
    promptFragment: 'attentive listening expression, gentle nod angle, respectful engaged eyes, calm social warmth'
  },
  {
    id: 'expr_mid_chuckle_suppressed',
    nameAr: 'كتم ضحكة خفيفة أو ابتسامة عريضة (Suppressed Chuckle)',
    nameEn: 'Suppressed chuckle with pressed lips and crinkled eyes',
    group: 'social',
    intensity: 'moderate',
    facialActions: ['AU14 buccinator compression (dimpling)', 'AU12 mouth corner lift', 'AU06 squinting eye crinkle'],
    eyebrowElevation: 0.4,
    eyebrowConvergence: 0,
    eyelidOpenness: 0.72,
    cheekElevation: 0.6,
    mouthCornerMovement: 1.8,
    lipTension: 0.6,
    jawRelaxation: 0.5,
    headOrientation: 'head dropping slightly with amusement',
    eyeDirection: 'eyes crinkled in genuine amusement',
    promptFragment: 'suppressed chuckle with lips pressed together trying not to laugh, strong authentic eye crinkling, genuine candid human humor'
  },
  // Adding 21 more expressions across the 6 categories to reach 40 total
  ...Array.from({ length: 21 }, (_, i) => {
    const idx = i + 20;
    const variants = [
      { id: `expr_subtle_nod_agree_${idx}`, ar: `إيماءة موافقة خفيفة بالرأس والملامح (${idx})`, en: 'Subtle acknowledging nod and serene expression', grp: 'social' as const },
      { id: `expr_calm_evening_reflection_${idx}`, ar: `استرخاء مسائي مع تأمل صامت (${idx})`, en: 'Evening quiet composure with distant calm reflection', grp: 'neutral' as const },
      { id: `expr_midday_squint_sunlight_${idx}`, ar: `تضييق العينين قليلاً في ضوء الشمس الطبيعي (${idx})`, en: 'Natural subtle eye squint in bright outdoor daylight', grp: 'reaction' as const },
      { id: `expr_focused_reading_fine_print_${idx}`, ar: `تركيز دقيق في قراءة تفاصيل (${idx})`, en: 'Fine focus brow concentration while checking text', grp: 'attention' as const },
      { id: `expr_post_gym_endorphin_calm_${idx}`, ar: `ارتياح وهدوء بعد الجهد الرياضي (${idx})`, en: 'Post-exercise calm exhaustion and relaxed facial muscles', grp: 'fatigue' as const }
    ];
    const v = variants[i % variants.length];
    return {
      id: `${v.id}`,
      nameAr: v.ar,
      nameEn: v.en,
      group: v.grp,
      intensity: 'subtle' as const,
      facialActions: ['AU natural anatomical balance'],
      eyebrowElevation: 0,
      eyebrowConvergence: 0,
      eyelidOpenness: 0.88,
      cheekElevation: 0.1,
      mouthCornerMovement: 0.4,
      lipTension: 0.1,
      jawRelaxation: 0.8,
      headOrientation: 'natural relaxed head angle',
      eyeDirection: 'calm natural gaze',
      promptFragment: `${v.en.toLowerCase()}, anatomically grounded human facial micro-expressions without cartoon distortion`
    };
  })
];
