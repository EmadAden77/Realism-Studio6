/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  CameraMode,
  EnvironmentCategory,
  FabricMaterial,
  LightingMode,
  RecentActivityType,
  SaudiCity,
  SceneState,
} from '../../types/scene.ts';

export interface LocationPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  category: EnvironmentCategory;
  cityApplicability?: SaudiCity[];
  defaultLighting: LightingMode;
  defaultCameraMode: CameraMode;
  descriptionAr: string;
  physicalElementsEn: string[];
  forbiddenElementsEn: string[];
}

export const LOCATION_PRESETS: LocationPreset[] = [
  // A. HOME
  {
    id: 'bedroom_bed_edge',
    nameAr: 'حافة السرير - غرفة نوم سعودية',
    nameEn: 'Bed edge, ordinary Saudi bedroom',
    category: 'bedroom',
    defaultLighting: 'phone_screen_only',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'غرفة نوم سكنية هادئة، أرضيات سيراميك بيج، جدران كريمية غير لامعة، أثاث خشب داكن.',
    physicalElementsEn: [
      'Queen bed with plain matte grey cotton duvet',
      'dark solid wood headboard behind',
      'practical minimalist nightstand with charging cable',
      'soft cream plaster wall',
      'cool neutral tiled bedroom floor'
    ],
    forbiddenElementsEn: [
      'luxury hotel chandelier',
      'oversized velvet headboard',
      'neon LED room contour strips',
      'mirrored ceiling or wall'
    ]
  },
  {
    id: 'bedroom_pillows_reclining',
    nameAr: 'مستند على الوسائد - غرفة النوم',
    nameEn: 'Reclining against pillows, bedroom headboard',
    category: 'bedroom',
    defaultLighting: 'phone_screen_only',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'اتكاء عفوي على وسادتين قطنيتين مع هاتف محمول مقرب للوجه وإضاءة الشاشة فقط.',
    physicalElementsEn: [
      'Two slightly compressed cotton-covered bed pillows',
      'simple dark veneer headboard',
      'creased grey duvet folded near waist',
      'subtle shadows under chin and mattress indent'
    ],
    forbiddenElementsEn: ['floating pillows', 'spotless showroom staging', 'unmotivated rim light']
  },
  {
    id: 'bedroom_standing_mirror',
    nameAr: 'أمام مرآة خزانة الملابس',
    nameEn: 'In front of wardrobe dressing mirror',
    category: 'bedroom',
    defaultLighting: 'ceiling_light_only',
    defaultCameraMode: 'mirror_selfie',
    descriptionAr: 'سيلفي مرآة خزانة غرفة النوم، الهاتف ظاهر باليد مع زوايا الانعكاس الفيزيائية.',
    physicalElementsEn: [
      'Clean flat dressing mirror reflection',
      'matte dark wood wardrobe frame',
      'phone held at mid-chest height reflecting screen',
      'natural bedroom room depth in background'
    ],
    forbiddenElementsEn: ['distorted mirror perspective', 'double subject anomalies']
  },
  {
    id: 'home_living_room_couch',
    nameAr: 'كنب الصالة العائلية',
    nameEn: 'Casual sofa, family living room',
    category: 'home_general',
    defaultLighting: 'mixed_practical',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'صالة منزلية سعودية معيارية، كنب رمادي قماشي وسائد مريحة وإضاءة سقف دافئة.',
    physicalElementsEn: [
      'Textured grey woven fabric couch',
      'plain throw pillow compressed under elbow',
      'matte wall with simple picture frame in distance',
      'ceramic tiled flooring with edge of patterned rug'
    ],
    forbiddenElementsEn: ['opulent royal majlis gold carvings', 'crystal chandeliers']
  },
  {
    id: 'home_kitchen_morning',
    nameAr: 'ركن المطبخ المنزلي',
    nameEn: 'Kitchen breakfast counter',
    category: 'home_general',
    defaultLighting: 'morning_daylight',
    defaultCameraMode: 'rear_main_self_capture',
    descriptionAr: 'صباح منزلي عفوي مع كوب شاي أو ماء على سطح رخام صناعي نظيف.',
    physicalElementsEn: [
      'Practical engineered quartz kitchen counter',
      'ceramic mug nearby',
      'plain neutral kitchen cabinets with sleek steel pulls',
      'diffused morning sun through frosted kitchen window'
    ],
    forbiddenElementsEn: ['industrial restaurant stainless steel kitchen']
  },

  // B. SAUDI RESIDENTIAL STREETS
  {
    id: 'saudi_villa_street_night',
    nameAr: 'شارع سكني هادئ ليلًا (فيلا)',
    nameEn: 'Quiet Saudi villa street at night',
    category: 'saudi_street',
    cityApplicability: ['riyadh', 'khobar', 'dammam', 'jeddah'],
    defaultLighting: 'street_led',
    defaultCameraMode: 'rear_main_self_capture',
    descriptionAr: 'شارع سكني هادئ، رصيف بلدورات أصفر وأسود أو إنترلوك، سور فيلا وباب كراج سيارة.',
    physicalElementsEn: [
      'Asphalt residential street with realistic aggregate texture',
      'yellow and black painted curb edges',
      'modern beige plaster villa boundary wall with clean aluminum gate',
      'overhead warm-white sodium/LED municipal streetlight casting realistic cast shadows',
      'sedan parked smoothly alongside curb'
    ],
    forbiddenElementsEn: [
      'orientalist bazaar stalls',
      'sand dunes spilling onto street',
      'palm trees every 2 meters',
      'ancient mud ruins in modern neighborhood'
    ]
  },
  {
    id: 'saudi_villa_gate_daylight',
    nameAr: 'أمام مدخل فيلا سكنية عصرًا',
    nameEn: 'Villa entrance gate, late afternoon',
    category: 'saudi_street',
    cityApplicability: ['riyadh', 'buraidah', 'hail'],
    defaultLighting: 'late_afternoon',
    defaultCameraMode: 'third_person_phone',
    descriptionAr: 'ضوء العصر الذهبي المنخفض، إنترلوك متداخل عند المدخل وسور حجري عصري.',
    physicalElementsEn: [
      'Interlocking concrete driveway pavers with natural surface settling',
      'limestone-clad residential villa gate pillar',
      'clear desert late-afternoon sky with low warm directional sun',
      'clean domestic exterior doorbell and mailbox fitting'
    ],
    forbiddenElementsEn: ['camel caravans', 'desert dirt roads']
  },
  {
    id: 'apartment_street_evening',
    nameAr: 'حي عمائر سكنية حديثة (المغرب)',
    nameEn: 'Modern residential apartment neighborhood, dusk',
    category: 'saudi_street',
    cityApplicability: ['jeddah', 'riyadh', 'khobar'],
    defaultLighting: 'twilight',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'أرصفة إنترلوك رمادي ومواقف سيارات منظمة أمام عمارة سكنية معاصرة.',
    physicalElementsEn: [
      'Contemporary 4-story residential building facade with tinted glass balconies',
      'paved pedestrian walkway',
      'soft twilight gradient sky',
      'parked white crossover vehicle in background'
    ],
    forbiddenElementsEn: ['futuristic sci-fi mega-towers']
  },

  // C. COMMERCIAL SERVICES
  {
    id: 'commercial_baqala_exterior',
    nameAr: 'أمام بقالة الحي (تموينات)',
    nameEn: 'Outside local neighbourhood grocery (Tamweenat)',
    category: 'commercial',
    defaultLighting: 'storefront_light',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'واجهة بقالة حي سعودي عادية مع لوحة مضيئة وزجاج شفاف يظهر رفوف المنتجات.',
    physicalElementsEn: [
      'Neighborhood mini-market storefront with illuminated signage fascia',
      'clear glass window showing organized snack racks and beverage fridges inside',
      'concrete ramp and tiled entry step',
      'cool fluorescent and warm street lighting mix'
    ],
    forbiddenElementsEn: ['exotic spice souk', 'open fruit carts with woven baskets']
  },
  {
    id: 'commercial_barber_chair',
    nameAr: 'صالون الحلاقة الرجالي',
    nameEn: 'Barber shop styling chair',
    category: 'commercial',
    defaultLighting: 'mixed_practical',
    defaultCameraMode: 'mirror_selfie',
    descriptionAr: 'مرآة صالون الحلاقة مع إضاءة محيطية منتظمة وكاب الحلاقة الأسود حول الرقبة.',
    physicalElementsEn: [
      'Clean professional barber chair with black leather upholstery',
      'wide mirror counter with neat barber tools and clipper caddy',
      'bright balanced salon ceiling light strips'
    ],
    forbiddenElementsEn: ['antique 19th century barbershop']
  },
  {
    id: 'commercial_fuel_station',
    nameAr: 'محطة وقود مضاءة ليلًا',
    nameEn: 'Modern service station canopy at night',
    category: 'commercial',
    defaultLighting: 'storefront_light',
    defaultCameraMode: 'rear_main_self_capture',
    descriptionAr: 'مظلة محطة حديثة بإضاءة بيضاء ساطعة من الأعلى وأرضية خرسانية ملساء وممشى المتجر.',
    physicalElementsEn: [
      'Overhead white LED canopy illumination casting sharp top-down shadows',
      'polished concrete forecourt ground',
      'adjacent convenience store glass entrance with subtle customer silhouettes'
    ],
    forbiddenElementsEn: ['abandoned rusty gas pumps']
  },

  // D. CAFÉS
  {
    id: 'cafe_interior_corner',
    nameAr: 'طاولة ركن بمقهى مختص',
    nameEn: 'Corner table, contemporary specialty coffee shop',
    category: 'cafe',
    cityApplicability: ['riyadh', 'jeddah', 'khobar'],
    defaultLighting: 'mixed_practical',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'مقهى بطراز أسمنتي هادئ، طاولة خشب طبيعي وكوب فلات وايت سيراميك مطفي.',
    physicalElementsEn: [
      'Matte oak or micro-cement coffee table surface',
      'matte handmade ceramic coffee cup with neat latte art',
      'shallow natural depth of field showing distant patrons softly blurred',
      'warm track spotlight combined with diffused daylight'
    ],
    forbiddenElementsEn: ['cluttered Starbucks logos', 'exaggerated bokeh bubbles']
  },
  {
    id: 'cafe_outdoor_terrace',
    nameAr: 'جلسة خارجية بمقهى - مساء شتوي',
    nameEn: 'Outdoor café terrace, winter evening',
    category: 'cafe',
    defaultLighting: 'twilight',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'جلسة خارجية مريحة مع مدفأة خارجية خفيفة وطاولة معدنية سوداء وأكواب ورقية.',
    physicalElementsEn: [
      'Dark metal outdoor café armchair',
      'round terrace bistro table',
      'subtle orange glow from distant patio heater',
      'twilight sky over modern urban boulevard'
    ],
    forbiddenElementsEn: ['tropical resort tiki lamps']
  },

  // E. VEHICLES
  {
    id: 'vehicle_parked_driver_seat',
    nameAr: 'مقعد السائق في سيارة متوقفة',
    nameEn: 'Driver seat, parked modern SUV',
    category: 'vehicle',
    defaultLighting: 'vehicle_dashboard',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'سيلفي مقعد السائق، مقود السيارة، حزام الأمان على الكتف، وإضاءة شاشة العدادات والشارع.',
    physicalElementsEn: [
      'Textured leather steering wheel edge in lower frame',
      'diagonal black seatbelt resting naturally across shoulder and chest',
      'perforated leather vehicle headrest behind head',
      'soft ambient blue/amber infotainment screen glow on side of face',
      'dim residential streetscape visible through driver side window'
    ],
    forbiddenElementsEn: [
      'racing car roll cage',
      'sports car steering wheel in standard family SUV',
      'airbags deploying'
    ]
  },
  {
    id: 'vehicle_passenger_seat_day',
    nameAr: 'مقعد الراكب الأمامي نهارًا',
    nameEn: 'Front passenger seat during day stop',
    category: 'vehicle',
    defaultLighting: 'natural_daylight',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'إضاءة طبيعية قادمة من الزجاج الأمامي، أقمشة المقعد وظلال فتحة السقف.',
    physicalElementsEn: [
      'Clean interior dashboard trim',
      'seatbelt angled comfortably across torso',
      'directional sun filtered through UV-tinted car window glass',
      'natural textile upholstery texture'
    ],
    forbiddenElementsEn: ['convertible roof open in summer heat']
  },

  // F. GYM & ATHLETICS
  {
    id: 'gym_training_bench',
    nameAr: 'مقعد تدريب بنادي رياضي',
    nameEn: 'Workout bench, modern fitness club',
    category: 'gym',
    defaultLighting: 'mixed_practical',
    defaultCameraMode: 'mirror_selfie',
    descriptionAr: 'مرآة أوزان الصالة الرياضية، أرضية مطاطية سوداء ومقعد تدريب نظيف بعد التمرين.',
    physicalElementsEn: [
      'Matte black rubber gym floor tiles',
      'sturdy adjustable workout bench with durable vinyl cover',
      'clean commercial dumbbell rack reflected in background mirror',
      'sweat towel on bench corner'
    ],
    forbiddenElementsEn: ['rusty 1970s iron dungeon gym']
  },

  // G. WORK & OFFICE
  {
    id: 'office_corridor_quiet',
    nameAr: 'ممر مكاتب هادئ',
    nameEn: 'Modern corporate office corridor',
    category: 'work',
    defaultLighting: 'mixed_practical',
    defaultCameraMode: 'front_selfie',
    descriptionAr: 'ممر مكتبي حديث بأرضية موكيت رمادي وجدران زجاجية عازلة وإضاءة سقف طولية.',
    physicalElementsEn: [
      'Linear acoustic ceiling panels with recessed diffuse LED lighting',
      'frameless frosted office glass partitions',
      'dark grey patterned commercial carpet tile'
    ],
    forbiddenElementsEn: ['cubicle maze from the 1990s']
  }
];

export interface PosePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'standing' | 'sitting' | 'reclining' | 'walking' | 'interaction' | 'candid_micro';
  freeHand: 'right_holding_phone' | 'left_holding_phone' | 'both_free' | 'resting_on_lap' | 'adjusting_item';
  supportSurface: 'bed_mattress' | 'pillows' | 'chair' | 'car_seat' | 'ground' | 'wall' | 'unsupported';
  descriptionAr: string;
  descriptionEn: string;
  fabricTensionEn: string;
}

export const POSE_PRESETS: PosePreset[] = [
  // SITTING
  {
    id: 'sitting_bed_edge_phone_held',
    nameAr: 'جلسة حافة السرير ماسكًا الهاتف بيد واحدة',
    nameEn: 'Seated on bed edge, single hand holding phone',
    category: 'sitting',
    freeHand: 'right_holding_phone',
    supportSurface: 'bed_mattress',
    descriptionAr: 'جالس على طرف المرتبة، القدمان على الأرض، يد تحمل الهاتف بزاوية سيلفي واليد الأخرى مستندة على الفخذ.',
    descriptionEn: 'Subject seated on mattress edge with knees at roughly 90 degrees, one hand extended holding phone at eye height, other hand resting casually on thigh',
    fabricTensionEn: 'Horizontal tension folds radiating across shorts thighs and compression creases at hip line'
  },
  {
    id: 'reclining_pillows_casual',
    nameAr: 'مستلقٍ على الظهر مستندًا إلى وسادتين',
    nameEn: 'Reclining against angled pillows on headboard',
    category: 'reclining',
    freeHand: 'right_holding_phone',
    supportSurface: 'pillows',
    descriptionAr: 'اتكاء مريح على الوسائد، الجذع مائل بنحو 35 درجة، الهاتف مرتفع قليلًا بزاوية تصوير منخفضة نسبيًا.',
    descriptionEn: 'Subject reclined back against stacked pillows, torso angled around 35 degrees, neck naturally supported without strain, phone held slightly elevated above chest',
    fabricTensionEn: 'Garment fabric compressed along upper back and shoulder blades, loose folds pooling naturally at stomach'
  },
  {
    id: 'reclining_side_arm_support',
    nameAr: 'مستلقٍ على الجانب مسندًا الرأس باليد',
    nameEn: 'Lying on side, head resting on forearm or pillow',
    category: 'reclining',
    freeHand: 'left_holding_phone',
    supportSurface: 'bed_mattress',
    descriptionAr: 'استلقاء جانبي عفوي، كتف واحد يستند إلى الفراش مع ميلان طفيف للرأس وثني الركبتين برفق.',
    descriptionEn: 'Subject resting on side on mattress, body curled naturally, one shoulder compressed against bed sheet, holding phone in opposite hand',
    fabricTensionEn: 'Lateral drag folds stretching across ribcage and bunched creases where arm presses into mattress'
  },
  {
    id: 'sitting_car_driver_wheel',
    nameAr: 'جلسة مقعد السائق واليد على المقود',
    nameEn: 'Driver seat posture, one hand lightly on wheel rim',
    category: 'sitting',
    freeHand: 'right_holding_phone',
    supportSurface: 'car_seat',
    descriptionAr: 'جالس في مقعد السائق، حزام الأمان يقطع الصدر، يد ترفع الهاتف والأخرى ملامسة لأسفل المقود.',
    descriptionEn: 'Seated upright in automotive bucket seat, seatbelt diagonally crossing chest, left wrist resting casually over bottom steering wheel spoke',
    fabricTensionEn: 'Distinct diagonal pressure indentation across shirt where seatbelt rests firmly against collarbone and chest'
  },
  {
    id: 'standing_casual_weight_shift',
    nameAr: 'وقوف عفوي مع نقل وزن الجسم على قدم واحدة',
    nameEn: 'Casual standing with weight shifted onto right leg',
    category: 'standing',
    freeHand: 'right_holding_phone',
    supportSurface: 'unsupported',
    descriptionAr: 'وقوف هادئ، ميلان خفيف في الحوض والكتفين بدون تصلب، يد تحمل الهاتف بارتفاع الصدر.',
    descriptionEn: 'Natural relaxed standing stance, pelvis tilted subtly with bodyweight supported on one leg, shoulders relaxed with organic asymmetry',
    fabricTensionEn: 'Vertical drape hanging freely from shoulders with natural diagonal slack pointing toward weighted hip'
  },
  {
    id: 'standing_against_wall_leaning',
    nameAr: 'استناد خفيف بالكتف على جدار أو سور',
    nameEn: 'Leaning shoulder lightly against villa wall',
    category: 'standing',
    freeHand: 'left_holding_phone',
    supportSurface: 'wall',
    descriptionAr: 'الكتف الأيسر يلامس الجدار بنعومة، القدم البعيدة متقدمة خطوة صغيرة، زاوية كاميرا جانبية خفيفة.',
    descriptionEn: 'Upper shoulder resting against vertical exterior wall surface, subtle torso angle with phone held in forward hand',
    fabricTensionEn: 'Slight flattening of sleeve fabric at wall contact point with natural fabric drape along torso'
  },
  {
    id: 'candid_touching_hair',
    nameAr: 'حركة عفوية: تعديل الشعر أو ملامسة الجبهة',
    nameEn: 'Candid micro-action: fingers lightly brushing hair',
    category: 'candid_micro',
    freeHand: 'left_holding_phone',
    supportSurface: 'bed_mattress',
    descriptionAr: 'لحظة طبيعية غير متكلفة، أصابع إحدى اليدين تلامس خصلة الشعر أو الصدغ أثناء التقاط السيلفي.',
    descriptionEn: 'One hand raised with loose fingers touching temple or lightly adjusting front fringe, phone captured at spontaneous angle',
    fabricTensionEn: 'Shoulder fabric pulling tight along deltoid and collarbone on the raised arm side'
  },
  {
    id: 'candid_adjusting_collar',
    nameAr: 'حركة عفوية: تعديل ياقة القميص أو التيشيرت',
    nameEn: 'Candid micro-action: straightening shirt neckline',
    category: 'candid_micro',
    freeHand: 'right_holding_phone',
    supportSurface: 'unsupported',
    descriptionAr: 'أصابع اليد اليسرى تسحب حافة فتحة العنق برفق بينما الكاميرا تلتقط لقطة غير مصطنعة.',
    descriptionEn: 'Fingers of off-hand lightly pinching shirt collar rim, eyes momentarily glancing toward chest or off-axis',
    fabricTensionEn: 'Sharp tension creases radiating symmetrically from the exact pinch point on the cotton neckline'
  },
  {
    id: 'sitting_cafe_table_coffee_cup',
    nameAr: 'جلسة مقهى مع كوب القهوة باليد الأخرى',
    nameEn: 'Café table seating holding ceramic coffee cup',
    category: 'sitting',
    freeHand: 'right_holding_phone',
    supportSurface: 'chair',
    descriptionAr: 'الجذع مائل قليلًا للأمام نحو الطاولة، يد تمسك الكوب الخزفي والأخرى ترفع الهاتف بزاوية طبيعية.',
    descriptionEn: 'Subject seated at small café bistro table, elbow resting on tabletop while holding ceramic cup, phone held in other hand',
    fabricTensionEn: 'Fabric bunching where forearm presses onto wooden table edge'
  },
  {
    id: 'candid_exhaling_relaxed',
    nameAr: 'زفير هادئ بعد يوم طويل (استرخاء عضلات الوجه)',
    nameEn: 'Relaxed exhale, decompressed facial posture',
    category: 'candid_micro',
    freeHand: 'right_holding_phone',
    supportSurface: 'bed_mattress',
    descriptionAr: 'ملامح مسترخية تمامًا بدون تصنع ابتسامة، الأكتاف منخفضة براحة والفك في حالة ارتخاء طبيعية.',
    descriptionEn: 'Subject caught in genuine quiet moment, shoulders visibly dropped down from tension, jaw soft and relaxed',
    fabricTensionEn: 'Smooth, natural drape with minimal tension folds'
  }
];

export interface ExpressionPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  muscleNotesEn: string;
  compatibleIntensities: ('very_subtle' | 'subtle' | 'moderate')[];
}

export const EXPRESSION_PRESETS: ExpressionPreset[] = [
  { id: 'neutral', nameAr: 'محايد هادئ (بدون ابتسامة)', nameEn: 'Calm neutral (no smile)', muscleNotesEn: 'Relaxed facial muscles, lips touching softly without press, flat brow', compatibleIntensities: ['subtle'] },
  { id: 'calm_presence', nameAr: 'حضور هادئ ومسترخٍ', nameEn: 'Quiet composure', muscleNotesEn: 'Smooth forehead, naturally open eyelids, relaxed jawline', compatibleIntensities: ['very_subtle', 'subtle'] },
  { id: 'slight_amusement', nameAr: 'ابتسامة داخلية خفيفة جدًا', nameEn: 'Faint inward amusement', muscleNotesEn: 'Micro-upturn of lip corners by 1mm, subtle softening of outer eye corners', compatibleIntensities: ['very_subtle', 'subtle'] },
  { id: 'small_genuine_smile', nameAr: 'ابتسامة طبيعية متواضعة', nameEn: 'Small genuine modest smile', muscleNotesEn: 'Mild zygomatic major activation, closed mouth, gentle crinkling at eyelid margins', compatibleIntensities: ['subtle', 'moderate'] },
  { id: 'tired_evening', nameAr: 'تعب مساء هادئ', nameEn: 'Late evening fatigue', muscleNotesEn: 'Slight eyelid heaviness, softer lower eyelids, neutral lips', compatibleIntensities: ['subtle', 'moderate'] },
  { id: 'sleepy_unimpressed', nameAr: 'نعاس خفيف وغير متكلف', nameEn: 'Mildly sleepy and unimpressed', muscleNotesEn: 'Heavy upper lids, relaxed lower jaw, dry calm gaze', compatibleIntensities: ['subtle', 'moderate'] },
  { id: 'thoughtful_distant', nameAr: 'تفكير واستغراق هادئ', nameEn: 'Thoughtful contemplative look', muscleNotesEn: 'Mild brow concentration, slightly unfocused gaze away from camera', compatibleIntensities: ['subtle'] },
  { id: 'mild_skeptical', nameAr: 'شكوكية طفيفة أو تساؤل', nameEn: 'Subtle skepticism / quirked brow', muscleNotesEn: 'Barely noticeable unilateral eyebrow elevation by 2mm, steady gaze', compatibleIntensities: ['very_subtle', 'subtle'] },
  { id: 'focused_on_screen', nameAr: 'تركيز على شاشة الهاتف', nameEn: 'Absorbed in phone screen', muscleNotesEn: 'Narrowed focal gaze downward, neutral mouth, engaged forehead', compatibleIntensities: ['subtle'] },
  { id: 'just_finished_task', nameAr: 'ارتياح بعد الانتهاء من عمل أو مشوار', nameEn: 'Relief after finishing a task', muscleNotesEn: 'Exhaling mouth posture, soft forehead, relieved temple tension', compatibleIntensities: ['subtle'] },
  { id: 'interrupted_moment', nameAr: 'التفاتة مفاجئة عفوية (نظرة استفسار)', nameEn: 'Spontaneous interrupted glance', muscleNotesEn: 'Eyes catching camera mid-breath, slightly parted lips, alert pupils', compatibleIntensities: ['subtle'] },
  { id: 'subtle_unilateral_smirk', nameAr: 'ابتسامة جانبية خفيفة للغاية', nameEn: 'Micro unilateral half-smirk', muscleNotesEn: 'One mouth corner lifted by 1.5mm, curious observant eye expression', compatibleIntensities: ['very_subtle', 'subtle'] },
  { id: 'resting_face', nameAr: 'ملامح راحة طبيعية (Resting Face)', nameEn: 'Natural candid resting face', muscleNotesEn: 'Zero pose strain, anatomically authentic resting mouth and jaw posture', compatibleIntensities: ['very_subtle'] }
];

export interface GazePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionEn: string;
}

export const GAZE_PRESETS: GazePreset[] = [
  { id: 'direct_lens', nameAr: 'مباشرة نحو عدسة الكاميرا', nameEn: 'Directly into camera lens', descriptionEn: 'Pupils centered directly locked onto camera optical center' },
  { id: 'phone_screen', nameAr: 'نحو شاشة الهاتف (أسفل العدسة بقليل)', nameEn: 'Toward phone screen surface', descriptionEn: 'Eyes angled 10-15 degrees downward checking self-image on screen' },
  { id: 'slightly_below_lens', nameAr: 'أسفل العدسة بمسافة قصيرة', nameEn: 'Subtly below camera lens', descriptionEn: 'Natural smartphone gaze looking at the top preview bezel' },
  { id: 'distracted_sideways', nameAr: 'نظرة جانبية عفوية (خارج الإطار)', nameEn: 'Momentary distracted glance off-frame', descriptionEn: 'Gaze diverted 30 degrees to the side as if noticing something in room' },
  { id: 'downward_at_hands', nameAr: 'نحو اليد أو الملابس التي يتم تعديلها', nameEn: 'Downward toward hands / clothing', descriptionEn: 'Head and eyes oriented down checking shirt hem or hands' },
  { id: 'toward_window', nameAr: 'نحو النافذة أو مصدر الضوء', nameEn: 'Gazing out toward window daylight', descriptionEn: 'Eyes turned toward ambient window light with subtle iris reflection' },
  { id: 'car_rearview_mirror', nameAr: 'نحو مرآة السيارة الجانبية', nameEn: 'Glancing toward vehicle side mirror', descriptionEn: 'Realistic driving posture check in left mirror' }
];

export interface LightingModePreset {
  id: LightingMode;
  nameAr: string;
  nameEn: string;
  descAr?: string;
}

export const LIGHTING_MODES: LightingModePreset[] = [
  { id: 'phone_screen_only', nameAr: 'إضاءة شاشة الهاتف فقط (~6500K)', nameEn: 'Phone Screen Only', descAr: 'غرفة مظلمة تمامًا، تلاشي الضوء السريع، ظلال عميقة واقعية' },
  { id: 'natural_daylight', nameAr: 'ضوء نهار طبيعي من النافذة', nameEn: 'Natural Daylight', descAr: 'ضوء ناعم متوازن غير مباشر مع ارتداد طبيعي' },
  { id: 'morning_daylight', nameAr: 'ضوء الصباح الباكر', nameEn: 'Early Morning Sun', descAr: 'ضوء ناعم زاوي بارد قليلًا' },
  { id: 'late_afternoon', nameAr: 'عصر متأخر مائل للدفء', nameEn: 'Late Afternoon Warmth', descAr: 'ظلال ممدودة دافئة وتباين غني' },
  { id: 'sunset', nameAr: 'وقت الغروب الذهبي', nameEn: 'Golden Hour Sunset', descAr: 'ضوء أفقي دافئ شديد التشبع' },
  { id: 'deep_night', nameAr: 'ليل حالك بدون إضاءة صناعية', nameEn: 'Deep Night Pitch Dark', descAr: 'ظلام حقيقي مع انعدام تفاصيل الظلال البعيدة' },
  { id: 'ceiling_light_only', nameAr: 'إضاءة سقف علوية فقط (Fluorescent/LED)', nameEn: 'Top Ceiling Light', descAr: 'ظلال حادة تحت الحواجب والأنف والذقن' },
  { id: 'street_led', nameAr: 'أعمدة إنارة الشارع البلدية (LED 4000K)', nameEn: 'Municipal Street LED', descAr: 'إنارة شارع واقعية مع مناطق مظلمة خلفية' },
  { id: 'storefront_light', nameAr: 'واجهة محل تجاري مضاءة', nameEn: 'Storefront Commercial', descAr: 'إضاءة أفقية ساطعة على جانب واحد' },
  { id: 'vehicle_dashboard', nameAr: 'طبلون السيارة والعدادات ليلاً', nameEn: 'Vehicle Dashboard Glow', descAr: 'وهج خافت صاعد من العدادات داخل قمرة مظلمة' },
  { id: 'mixed_practical', nameAr: 'إضاءة عملية مختلطة (أباجورة + نافذة)', nameEn: 'Mixed Practical Lighting', descAr: 'تداخل حراري طبيعي بين درجات الكلفن' }
];

export interface HairPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionEn: string;
  compatibleWithLockedDensity: boolean;
}

export const HAIR_PRESETS: HairPreset[] = [
  { id: 'reference_exact', nameAr: 'الحفاظ الدقيق على قصة المرجع وكثافته', nameEn: 'Exact reference hair and hairline', descriptionEn: 'Preserve original observed hairline, temple contours, natural density and strand texture', compatibleWithLockedDensity: true },
  { id: 'natural_short_textured', nameAr: 'قصير مع ملمس طبيعي (غير مصفف بمبالغة)', nameEn: 'Natural short textured crop', descriptionEn: 'Short dark hair with realistic finger-textured separation, soft tapered sides without harsh lines', compatibleWithLockedDensity: true },
  { id: 'relaxed_side_sweep', nameAr: 'انسياب جانبي هادئ', nameEn: 'Relaxed side sweep', descriptionEn: 'Medium-short top casually swept to one side, obeying natural parting without stiff wax', compatibleWithLockedDensity: true },
  { id: 'after_waking_bedhead', nameAr: 'مبعثر قليلًا بعد الاستيقاظ (Bedhead)', nameEn: 'Authentic morning bedhead', descriptionEn: 'Subtly flattened on one side from pillow contact, loose natural front strands, believable disarray', compatibleWithLockedDensity: true },
  { id: 'finger_combed_casual', nameAr: 'مسرح بأصابع اليد بدون جل', nameEn: 'Casual finger-combed look', descriptionEn: 'Natural matte strands grouped into loose locks, zero artificial plastic shine or helmet stiffness', compatibleWithLockedDensity: true },
  { id: 'naturally_damp_post_shower', nameAr: 'مبلل رطب قليلًا بعد الاستحمام', nameEn: 'Subtly damp post-shower hair', descriptionEn: 'Darker clumped damp strands with organic clumping, soft individual droplet glints, realistic weight', compatibleWithLockedDensity: true },
  { id: 'loose_front_fringe', nameAr: 'خصلات أمامية هابطة بخفة على الجبهة', nameEn: 'Loose casual front fringe', descriptionEn: 'A few irregular strands dropping naturally toward upper forehead line without blocking eyes', compatibleWithLockedDensity: true }
];

export interface OutfitPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  upperAr: string;
  upperEn: string;
  lowerAr: string;
  lowerEn: string;
  material: FabricMaterial;
  defaultCategory: EnvironmentCategory;
}

export const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: 'white_tank_navy_shorts',
    nameAr: 'فانيلة قطنية بيضاء + شورت كحلي (منزلي)',
    nameEn: 'White cotton sleeveless tank top & navy shorts',
    upperAr: 'فانيلة حفر بيضاء قطنية بدون أكمام',
    upperEn: 'White ribbed-cotton sleeveless athletic tank top with raw armhole seam',
    lowerAr: 'شورت قطني مريح باللون الكحلي الداكن',
    lowerEn: 'Deep navy-blue breathable cotton-jersey lounge shorts with elastic waistband',
    material: 'lightweight_cotton',
    defaultCategory: 'bedroom'
  },
  {
    id: 'white_tshirt_black_shorts',
    nameAr: 'تيشيرت أبيض سادة + شورت أسود',
    nameEn: 'Plain white crewneck T-shirt & black shorts',
    upperAr: 'تيشيرت أبيض قطني سادة ياقة دائرية',
    upperEn: 'Clean plain white crewneck cotton T-shirt with natural fit',
    lowerAr: 'شورت رياضي أسود',
    lowerEn: 'Black relaxed-fit athletic shorts with subtle drawstring',
    material: 'medium_cotton',
    defaultCategory: 'bedroom'
  },
  {
    id: 'saudi_thobe_classic_white',
    nameAr: 'ثوب سعودي أبيض تقليدي مريح',
    nameEn: 'Classic white Saudi thobe, clean tailored drape',
    upperAr: 'ثوب سعودي أبيض منسوج بياقة قلاب كلاسيكية',
    upperEn: 'Authentic Saudi white tailored thobe with crisp mandarin collar, clean buttons, and structured drape',
    lowerAr: 'سروال أبيض داخلي مريح',
    lowerEn: 'Traditional lightweight white inner trousers beneath thobe hem',
    material: 'woven_thobe_fabric',
    defaultCategory: 'saudi_street'
  },
  {
    id: 'casual_polo_chinos',
    nameAr: 'قميص بولو زيتي + بنطلون تشينو بيج',
    nameEn: 'Olive green polo shirt & beige chinos',
    upperAr: 'قميص بولو قطني زيتي بأزرار نصفية',
    upperEn: 'Olive green piqué cotton polo shirt with ribbed collar',
    lowerAr: 'بنطلون تشينو بيج بقصة معتدلة',
    lowerEn: 'Warm sand beige tailored cotton chinos with straight leg drape',
    material: 'cotton_poly_blend',
    defaultCategory: 'cafe'
  },
  {
    id: 'gym_athletic_wear',
    nameAr: 'طقم رياضي: تيشيرت أسود + شورت تدريب رمادي',
    nameEn: 'Gym athletic set: black performance tee & charcoal shorts',
    upperAr: 'تيشيرت رياضي أسود ماص للرطوبة',
    upperEn: 'Breathable matte black technical training shirt',
    lowerAr: 'شورت تدريب رمادي فحمي',
    lowerEn: 'Charcoal grey stretch training shorts with side slits',
    material: 'athletic_polyester',
    defaultCategory: 'gym'
  }
];

export const SAUDI_CITIES: { id: SaudiCity; nameAr: string; nameEn: string; terrainNotesEn: string }[] = [
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', terrainNotesEn: 'Central Najd plateau, modern stone-clad villas, pale limestone tones, crisp dry air' },
  { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', terrainNotesEn: 'Coastal Red Sea humidity, white contemporary facades, palm accents, warm ambient bounce' },
  { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', terrainNotesEn: 'Rugged dark mountain backdrops, high-density residential slopes' },
  { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', terrainNotesEn: 'Basalt volcanic stone textures, open serene residential plains' },
  { id: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam', terrainNotesEn: 'Eastern coastal plain, clean interlocking asphalt roads, modern villa clusters' },
  { id: 'khobar', nameAr: 'الخبر', nameEn: 'Al Khobar', terrainNotesEn: 'Cosmopolitan seaside boulevards, sleek cafe promenades, modern architectural curbs' },
  { id: 'dhahran', nameAr: 'الظهران', nameEn: 'Dhahran', terrainNotesEn: 'Low rolling hills, neat suburban campus streets' },
  { id: 'abha', nameAr: 'أبها', nameEn: 'Abha', terrainNotesEn: 'Green Asir mountains, misty evening skies, stone-textured stepped residential hillsides' },
  { id: 'taif', nameAr: 'الطائف', nameEn: 'Taif', terrainNotesEn: 'Highland mountain terrace views, cooler high-altitude afternoon sunlight' },
  { id: 'tabuk', nameAr: 'تبوك', nameEn: 'Tabuk', terrainNotesEn: 'Northern crisp desert atmosphere, sandstone tones, clear starry night skies' },
  { id: 'hail', nameAr: 'حائل', nameEn: 'Hail', terrainNotesEn: 'Red granite mountain outlines, traditional spacious villa avenues' },
  { id: 'buraidah', nameAr: 'بريدة', nameEn: 'Buraidah', terrainNotesEn: 'Classic Qassim agricultural oasis periphery, warm brick and plaster villas' },
  { id: 'hofuf', nameAr: 'الهفوف (الأحساء)', nameEn: 'Hofuf (Al-Ahsa)', terrainNotesEn: 'Vast palm oasis neighborhood border, warm earth-toned villa facades' },
  { id: 'yanbu', nameAr: 'ينبع', nameEn: 'Yanbu', terrainNotesEn: 'Industrial-residential port aesthetic, clean planned streetscapes' },
  { id: 'najran', nameAr: 'نجران', nameEn: 'Najran', terrainNotesEn: 'Southern valley palm groves, distinctive mud-brick inspired modern perimeter walls' },
  { id: 'custom', nameAr: 'مدينة مخصصة', nameEn: 'Custom location', terrainNotesEn: 'Authentic regional Saudi urban setting' }
];

export const INITIAL_SCENE_STATE: SceneState = {
  version: 1,
  id: 'scene_default_01',
  title: 'سيلفي غرفة النوم العفوي (افتراضي)',
  descriptionInput: 'سيلفي داخل غرفة النوم بالليل بالفانيلة البيضاء والشورت الكحلي والإضاءة من الشاشة فقط.',
  environmentCategory: 'bedroom',
  locationPresetId: 'bedroom_bed_edge',

  identity: {
    referenceImageUrl: null,
    referenceImageName: null,
    heightCm: 193,
    weightKg: 83,
    bodyType: 'tall_lean_athletic',
    apparentAge: 27,
    skinTone: 'wheat-tan Saudi Arabian complexion with authentic undertones',
    headShape: 'proportional oval skull with defined clean jawline',
    facialAsymmetry: 'subtle natural human asymmetry without digital warping',
    locks: {
      faceAndSkull: true,
      eyeAndNose: true,
      skinTone: true,
      hairline: true,
      hairDensity: true,
      facialHair: true,
      apparentAge: true,
      bodyProportions: true,
    },
    customDescription: 'Tall, lean-athletic Arab young man with natural facial features and calm presence.'
  },

  hair: {
    length: 'short',
    direction: 'irregular',
    presetId: 'reference_exact',
    densityLock: true,
    physicsMode: 'natural_clumps',
    preventArtificialThickening: true,
    customNotes: 'Preserve natural observed density and authentic temple recession. No fake thick hair helmet.'
  },

  facialHair: {
    preserveBeard: true,
    preserveMoustache: true,
    growthTexture: 'natural_stubble',
    densityLock: true,
    naturalBoundaries: true,
    noGapFilling: true,
    customNotes: 'Natural short-boxed stubble, preserving genuine natural density without artificial barber line carving.'
  },

  expression: {
    presetId: 'calm_presence',
    intensity: 'subtle',
    customDescription: 'Calm, rested facial expression without forced smile or exaggerated grimace.'
  },

  gaze: {
    targetId: 'phone_screen',
    alignedWithAction: true,
    customDescription: 'Eyes directed toward phone screen surface, angled naturally downward.'
  },

  eyewear: {
    mode: 'no_glasses',
    preserveEyeStructure: true,
    styleDescription: 'No spectacles or eyeglasses; eyes fully visible.'
  },

  clothing: {
    activeOutfitPresetId: 'white_tank_navy_shorts',
    upper: {
      id: 'upper_tank_white',
      nameAr: 'فانيلة حفر بيضاء قطنية',
      nameEn: 'White ribbed-cotton sleeveless tank top',
      category: 'upper',
      colorAr: 'أبيض قطني طبيعي',
      colorEn: 'Off-white natural breathable cotton',
      material: 'lightweight_cotton',
      fit: 'natural_athletic',
      wearState: 'lived_in'
    },
    lower: {
      id: 'lower_navy_shorts',
      nameAr: 'شورت كحلي مريح',
      nameEn: 'Navy-blue cotton lounge shorts',
      category: 'lower',
      colorAr: 'كحلي داكن',
      colorEn: 'Deep navy blue',
      material: 'medium_cotton',
      fit: 'relaxed',
      wearState: 'lightly_creased'
    },
    outer: null,
    footwear: {
      id: 'footwear_barefoot',
      nameAr: 'حافي القدمين (داخل الغرفة)',
      nameEn: 'Barefoot on bedroom floor',
      category: 'footwear',
      colorAr: 'طبيعي',
      colorEn: 'Barefoot',
      material: 'lightweight_cotton',
      fit: 'natural_athletic',
      wearState: 'fresh_clean'
    },
    customOutfitDescription: 'White cotton tank top paired with casual navy shorts, showing athletic shoulder and arm anatomy.'
  },

  fabric: {
    enabled: true,
    gravityResponse: true,
    bodyContactFolds: true,
    seamTension: true,
    anchorPoints: true,
    postureFolds: {
      sittingHipFolds: true,
      recliningCompression: true,
      armLiftTension: true,
      gripPointRadiation: true
    },
    reflectance: 'matte_textile',
    preventPlasticGarments: true
  },

  pose: {
    presetId: 'sitting_bed_edge_phone_held',
    category: 'sitting',
    freeHand: 'right_holding_phone',
    supportSurface: 'bed_mattress',
    selfieArmDistanceCm: 55,
    candidAction: 'Resting on bed edge after a long day, casually holding phone at comfortable arm length'
  },

  camera: {
    device: 'Xiaomi 15 Ultra',
    mode: 'front_selfie',
    angle: 'slightly_elevated',
    aspectRatio: '9:16',
    focalLengthEquivMm: 21,
    aperture: 'f/2.0',
    sensorSize: '1/2.74-inch',
    naturalHandheldRollDeg: 1.2,
    faceFraming: 'slightly_off_center',
    lensFlawsSimulation: {
      naturalVignette: true,
      sensorNoiseLowLight: true,
      noArtificialPortraitBlur: true
    }
  },

  lighting: {
    mode: 'phone_screen_only',
    strictRealismLock: true,
    timeOfDay: 'night',
    primarySource: {
      type: 'Smartphone AMOLED Screen Glow',
      direction: 'front_screen',
      colorTempK: 6500,
      intensity: 'medium'
    },
    secondarySourceEnabled: false,
    secondarySourceType: 'None (Room fixtures strictly off)'
  },

  bedroomGeometry: {
    persistentLayout: true,
    roomDimensionsM: { length: 6.2, width: 5.2, height: 2.9 },
    bedDimensionsCm: { width: 160, length: 200, height: 55 },
    headboardWidthCm: 175,
    wallFinish: 'matte_cream_plaster',
    flooring: 'saudi_ceramic_tile',
    curtainState: 'drawn_shut',
    forbiddenLuxuryDetails: true,
    spatialObjects: [
      { id: 'queen_bed', name: 'Queen Bed', x: 0, y: -0.8, z: 0.28, widthM: 1.6, depthM: 2.0, heightM: 0.55, isFixed: true },
      { id: 'dark_headboard', name: 'Dark Wood Headboard', x: 0, y: -1.8, z: 0.6, widthM: 1.75, depthM: 0.1, heightM: 1.1, isFixed: true },
      { id: 'nightstand_right', name: 'Bedside Nightstand', x: 1.1, y: -1.75, z: 0.25, widthM: 0.5, depthM: 0.45, heightM: 0.5, isFixed: true },
      { id: 'bedroom_window', name: 'Curtained Window', x: -2.5, y: 0.2, z: 1.4, widthM: 1.4, depthM: 0.1, heightM: 1.6, isFixed: true },
      { id: 'wardrobe_closet', name: 'Dark Wardrobe', x: 2.2, y: 0.8, z: 1.1, widthM: 1.8, depthM: 0.65, heightM: 2.2, isFixed: true },
      { id: 'entry_door', name: 'Bedroom Door', x: -1.8, y: 2.8, z: 1.0, widthM: 0.95, depthM: 0.08, heightM: 2.1, isFixed: true }
    ]
  },

  realismIntelligence: {
    opticalGeometryStrictness: 'high',
    lightingPhysicsStrictness: 'very_high',
    naturalTextureProtection: 'very_high',
    candidMotionIntensity: 'everyday_candid',
    materialPhysicsEnforcement: true,
    sceneContinuityLock: true,
    automaticExaggerationReduction: true,
    contactPhysics: {
      mattressPelvisCompression: true,
      pillowHeadDeformation: true,
      clothingPressureFolds: true,
      armReachAnatomicalAnchor: true,
      gripPointTensionOrigination: true
    },
    unifiedSmartphoneImaging: {
      enabled: true,
      coherentToneMapping: true,
      localExposureNoise: true,
      prohibitFaceOnlyBeautyDenoise: true,
      prohibitArtificialPortraitBlur: true
    },
    controlledImperfections: {
      sensorLuminanceNoise: true,
      slightOpticalAberration: true,
      realisticLowLightDetailLoss: true,
      modestHandheldFramingTilt: true,
      highlightClippingNearSource: true
    }
  },

  saudiEnvironment: {
    city: 'riyadh',
    neighborhoodType: 'modern_villa',
    curbStyle: 'yellow_black',
    sidewalkMaterial: 'interlocking_pavers',
    preventOrientalistCliches: true
  },

  vehicle: {
    enabled: false,
    category: 'suv',
    makeModel: 'White full-size crossover SUV',
    exteriorColor: 'Pearl White',
    interiorColor: 'Black leatherette with contrast stitching',
    seatPosition: 'driver_seat',
    doorState: 'closed'
  },

  backgroundPeople: {
    count: 0,
    densityMode: 'exact',
    actions: 'No background people in private bedroom',
    noFaceCloning: true
  },

  disorder: {
    level: 2,
    recentContextActivity: 'casual_lounging',
    activeItems: [
      'displaced_grey_duvet',
      'compressed_pillow',
      'smartphone_charging_cable_on_nightstand',
      'water_bottle_on_bedside_table'
    ]
  },

  // ============================================================
  // VERSION 3.0 INITIAL STATES
  // ============================================================
  referenceAnalysis: {
    hasReferenceImage: false,
    referenceImageName: null,
    referenceImageUrl: null,
    analysisDate: null,
    isAnalyzed: false,
    observations: [],
    lockedFeatures: ['faceAndSkull', 'hairline', 'hairDensity', 'skinTone'],
    hairCompatibility: {
      isCompatible: true,
      hairlinePreserved: true,
      densityPreserved: true,
      warnings: [],
      suggestions: ['Preserve authentic reference hair density and natural growth direction.']
    },
    uncertaintyNotesAr: 'لم يتم تزويد صورة مرجعية بعد. عند رفع صورة وطلب التحليل، سيتم استخراج الخصائص بدقة وفصل المؤكد عن المشكوك فيه.'
  },

  geometryCalibration: {
    subject: {
      heightCm: 193,
      proportions: 'tall_lean',
      shoulderWidthCm: 48,
      cameraHoldingArm: 'right',
      armReachCm: 56,
      headPitchDeg: 0,
      headYawDeg: 0,
      torsoOrientationDeg: 0,
      posture: 'sitting'
    },
    camera: {
      lensToFaceDistanceCm: 56,
      cameraHeightCm: 105,
      horizontalOffsetCm: 4,
      cameraPitchDeg: 4,
      cameraYawDeg: 3,
      cameraRollDeg: -1.5,
      fovHorizontalDeg: 84
    },
    environment: {
      roomWidthM: 4.2,
      roomLengthM: 5.0,
      ceilingHeightM: 2.9,
      bedWidthCm: 160,
      bedLengthCm: 200,
      bedHeightCm: 55,
      walkingClearanceM: 1.1,
      supportSurfaceHeightCm: 55,
      isPhysicalSupportValid: true
    },
    reachStatus: {
      canReach: true,
      maxReachCm: 72,
      currentReachCm: 56,
      messageAr: 'مسافة الكاميرا (56 سم) تقع تمامًا ضمن المدى التشريحي الطبيعي للذراع الممتدة (حتى 72 سم).'
    },
    clearanceWarnings: []
  },

  framingPreview: {
    aspectRatio: '9:16',
    facePositionX: 0,
    facePositionY: -8,
    framingTightness: 'medium_close_up',
    headBoundingBox: { x: 32, y: 16, width: 36, height: 28 },
    shoulderBoundingBox: { x: 18, y: 44, width: 64, height: 26 },
    torsoBoundingBox: { x: 22, y: 68, width: 56, height: 32 },
    armDirection: 'right_bottom',
    backgroundCoveragePercent: 44,
    isApproximatePreviewNoticeAcknowledged: true
  },

  preCaptureContext: {
    recentActivity: 'recently_sat_on_bed',
    minutesAgo: 3,
    naturalConsequences: {
      hairOrientationEffect: 'Subtle natural movement from sitting down, relaxed hair strands without static freeze',
      beddingDeformationEffect: 'Local mattress compression depression directly beneath subject pelvis, slight blanket fold displacement',
      fabricTensionEffect: 'Slight horizontal compression folds across cotton shorts hip line and lower shirt drape',
      nearbyObjectsEffect: 'Smartphone charging cable resting on adjacent nightstand surface',
      skinMoistureEffect: null,
      postureRelaxationEffect: 'Naturally settled spine and relaxed shoulders after sitting'
    },
    userCustomConsequences: ''
  },

  sceneDecisions: [
    {
      id: 'dec_camera_01',
      property: 'camera.angle',
      propertyLabelAr: 'زاوية الكاميرا',
      selectedValue: 'eye_level',
      reasonAr: 'تم اختيار زاوية سيلفي قريبة من مستوى العين لأن الشخص جالس ويمسك الهاتف بيده بزاوية طبيعية.',
      ruleId: 'CAMERA_SEATED_SELFIE_PITCH',
      assumptionsAr: ['الشخص يمسك الهاتف بيده اليمنى', 'المسافة بين العدسة والوجه حوالي 56 سم'],
      confidence: 'high',
      relatedFields: ['pose.category', 'camera.focalLengthEquivMm'],
      alternativesAr: ['slightly_elevated (زاوية مرتفعة قليلاً)']
    },
    {
      id: 'dec_lighting_01',
      property: 'lighting.mode',
      propertyLabelAr: 'نمط الإضاءة',
      selectedValue: 'phone_screen_only',
      reasonAr: 'تم تفعيل إضاءة شاشة الهاتف فقط كمنبع رئيسي وحيد، مع إخماد أي مصادر خفية لمنع إضاءة الاستوديو الصناعية.',
      ruleId: 'STRICT_NIGHT_SCREEN_LIGHT',
      assumptionsAr: ['غرفة النوم مظلمة ليلاً', 'لا توجد أضواء حواف خفية'],
      confidence: 'high',
      relatedFields: ['lighting.strictRealismLock', 'camera.lensFlawsSimulation.sensorNoiseLowLight']
    },
    {
      id: 'dec_fabric_01',
      property: 'fabric.postureFolds.sittingHipFolds',
      propertyLabelAr: 'طيات القماش عند الجلوس',
      selectedValue: true,
      reasonAr: 'تم فرض طيات انضغاط القماش على الوركين لأن الشخص في وضعية جلوس على حافة السرير.',
      ruleId: 'FABRIC_PHYSICS_SEATED_HIP',
      assumptionsAr: ['قماش الفانيلة قطن ناعم والشورت قطني مريح'],
      confidence: 'high',
      relatedFields: ['clothing.lower', 'pose.category']
    }
  ],

  sceneVersions: {
    snapshots: [],
    activeSnapshotId: null,
    comparisonSnapshotId: null
  },

  sceneDiff: {
    activeSessionChanges: [],
    lastModifiedField: null,
    preservedLockedFields: ['identity.locks.faceAndSkull', 'identity.locks.hairDensity', 'identity.locks.skinTone']
  },

  readinessStatus: {
    status: 'ready',
    statusLabelAr: 'جاهز للتوليد',
    scoreExplanationAr: 'جميع القواعد الفيزيائية والتشريحية متوافقة دون تعارضات قاتلة.',
    warnings: [],
    errors: [],
    checklist: [
      { id: 'cam_mode', labelAr: 'تحديد وضعية الكاميرا والعدسة', passed: true, detailsAr: 'سيلفي أمامية 21mm f/2.0 محددة بدقة' },
      { id: 'arm_reach', labelAr: 'توافق مدى الذراع والمسافة', passed: true, detailsAr: 'المسافة 56 سم ممكنة تشريحيًا' },
      { id: 'id_locks', labelAr: 'أقفال الهوية وكثافة الشعر', passed: true, detailsAr: 'قفل كثافة الشعر وشكل الجمجمة مفعل' },
      { id: 'hair_comp', labelAr: 'توافق تسريحة الشعر مع الأصل', passed: true, detailsAr: 'لا توجد كثافة مصطنعة مضافة' },
      { id: 'clothing_mat', labelAr: 'تحديد خامات وملابس واقعية', passed: true, detailsAr: 'قطن طبيعي محدد للفانيلة والشورت' },
      { id: 'body_contact', labelAr: 'فيزياء ملامسة الجسم والأسطح', passed: true, detailsAr: 'انضغاط المرتبة تحت الحوض مفعل' },
      { id: 'light_compat', labelAr: 'اتساق مصادر الإضاءة والظلال', passed: true, detailsAr: 'إضاءة الشاشة فقط مطبقة مع إخماد الأضواء الخفية' },
      { id: 'env_coherence', labelAr: 'اتساق البيئة والمعمار', passed: true, detailsAr: 'غرفة نوم سكنية سعودية طبيعية' },
      { id: 'room_geom', labelAr: 'ثبات هندسة الغرفة', passed: true, detailsAr: 'أبعاد السرير والجدران محفوظة' },
      { id: 'bg_plausibility', labelAr: 'معقولية الخلفية والأشخاص', passed: true, detailsAr: 'غرفة نوم خاصة دون أشخاص عشوائيين' },
      { id: 'disorder_limit', labelAr: 'انضباط مستوى الفوضى العفوية', passed: true, detailsAr: 'مستوى الفوضى 2 (عفوي طبيعي غير مبالغ فيه)' },
      { id: 'assumptions_id', labelAr: 'شفافية الافتراضات التلقائية', passed: true, detailsAr: 'تم توثيق افتراضات زاوية الكاميرا والإضاءة' }
    ],
    unsupportedAssumptions: [],
    suggestedCorrectionsAr: []
  },

  output: {
    englishPrompt: '',
    negativePrompt: '',
    modelRecommendation: 'Midjourney v6.1 / Flux.1 Schnell / Stable Diffusion 3.5 / Ideogram v2',
    generationTimestamp: Date.now(),
    isAiRefined: false,
    appliedCorrections: []
  },

  v4LibraryFavorites: [],
  v4RecentlyUsed: [],

  validationIssues: []
};

export const RECENT_ACTIVITIES: {
  id: RecentActivityType;
  titleAr: string;
  titleEn: string;
  category: 'sleep_rest' | 'motion' | 'grooming' | 'daily';
  descriptionAr: string;
  hairEffect: string | null;
  beddingEffect: string | null;
  fabricEffect: string | null;
  objectEffect: string | null;
  skinMoistureEffect: string | null;
  postureEffect: string | null;
}[] = [
  {
    id: 'just_woke_up',
    titleAr: 'استيقظ لتوه من النوم',
    titleEn: 'Just woke up',
    category: 'sleep_rest',
    descriptionAr: 'آثار خفيفة للنوم على وضعية الشعر وملاءات السرير غير المرتبة دون مبالغة.',
    hairEffect: 'Natural slight bedhead texture with modest directional flattening where head touched pillow',
    beddingEffect: 'Duvet pushed back naturally, head depression clearly visible in soft pillow foam',
    fabricEffect: 'Natural sleep creases across cotton fabric, relaxed loose neckline',
    objectEffect: 'Smartphone on nightstand or charging cable resting nearby',
    skinMoistureEffect: null,
    postureEffect: 'Gently relaxed waking posture, heavy-lidded calm expression'
  },
  {
    id: 'recently_sat_on_bed',
    titleAr: 'جلس لتوه على حافة السرير',
    titleEn: 'Recently sat on bed',
    category: 'sleep_rest',
    descriptionAr: 'انضغاط طبيعي للمرتبة تحت الحوض والفخذين وتراخي وضعية الجلوس.',
    hairEffect: 'Combed or naturally settled hair with minor stray strands',
    beddingEffect: 'Mattress edge compressed beneath pelvis, duvet gently displaced around seating area',
    fabricEffect: 'Compression creases around lower torso and hip creases of shorts or pants',
    objectEffect: 'Phone in hand, casual room backdrop',
    skinMoistureEffect: null,
    postureEffect: 'Feet resting casually near floor, weight anchored into mattress'
  },
  {
    id: 'recently_reclined',
    titleAr: 'مستلقٍ على السرير أو الوسائد',
    titleEn: 'Recently reclined',
    category: 'sleep_rest',
    descriptionAr: 'انضغاط الوسادة خلف الرأس والكتفين مع استرخاء العضلات.',
    hairEffect: 'Hair spread naturally against supportive pillow surface without digital floating',
    beddingEffect: 'Pillow visibly indented around occipital skull contour, mattress conforming to torso weight',
    fabricEffect: 'Loose chest drape conforming to supine or semi-reclined ribcage',
    objectEffect: 'Headboard close in background frame',
    skinMoistureEffect: null,
    postureEffect: 'Complete structural support from pillows and mattress'
  },
  {
    id: 'finished_exercising',
    titleAr: 'أنهى تمرينًا رياضيًا للتو',
    titleEn: 'Finished exercising',
    category: 'motion',
    descriptionAr: 'بريق بشرة خفيف جدًا وطبيعي، تنفس عميق دون مبالغة في التعرق.',
    hairEffect: 'Slightly damp hairline with subtle clumping, naturally pushed back',
    beddingEffect: null,
    fabricEffect: 'Athletic fabric drape with minor perspiration cling at upper back/chest',
    objectEffect: 'Reusable sports water bottle or gym towel resting nearby',
    skinMoistureEffect: 'Subtle natural post-workout sheen on forehead and temples, no artificial dripping sweat',
    postureEffect: 'Slightly elevated breathing posture, grounded athletic stance'
  },
  {
    id: 'just_entered_room',
    titleAr: 'دخل الغرفة لتوه',
    titleEn: 'Just entered a room',
    category: 'motion',
    descriptionAr: 'توقف عفوي بعد الدخول، التفاتة رأس أو وضع المفاتيح/الهاتف.',
    hairEffect: 'Natural outdoor-to-indoor hair state with slight environmental texture',
    beddingEffect: null,
    fabricEffect: 'Fabric settled from walking motion, outer garments shifting naturally',
    objectEffect: 'Door or entryway visible in background perspective',
    skinMoistureEffect: null,
    postureEffect: 'Momentary paused step or turning toward camera with realistic balance'
  },
  {
    id: 'just_exited_vehicle',
    titleAr: 'نزل من السيارة لتوه',
    titleEn: 'Just exited a vehicle',
    category: 'motion',
    descriptionAr: 'وقوف قريب من باب السيارة أو الشارع السكني.',
    hairEffect: 'Natural light breeze displacement from outdoor ambient air',
    beddingEffect: null,
    fabricEffect: 'Seatbelt compression crease across upper chest/shoulder fading naturally',
    objectEffect: 'Car door edge, vehicle silhouette, or residential curb in frame',
    skinMoistureEffect: null,
    postureEffect: 'Weight shifted over one foot near open or closed car door'
  },
  {
    id: 'waiting_for_someone',
    titleAr: 'ينتظر أحدًا بهدوء',
    titleEn: 'Waiting for someone',
    category: 'daily',
    descriptionAr: 'وقفة أو جلسة استرخاء مع التفاتة انتباه خفيفة غير متكلفة.',
    hairEffect: 'Neatly groomed or everyday casual hair',
    beddingEffect: null,
    fabricEffect: 'Relaxed resting folds on clothing',
    objectEffect: 'Car keys, wallet, or phone held naturally',
    skinMoistureEffect: null,
    postureEffect: 'Casual leaning against wall, railing, or car body with authentic weight shift'
  },
  {
    id: 'preparing_to_leave',
    titleAr: 'يستعد للخروج',
    titleEn: 'Preparing to leave',
    category: 'daily',
    descriptionAr: 'تفقد سريع للمظهر في المرآة أو الهاتف قبل الانطلاق.',
    hairEffect: 'Freshly styled hair adhering strictly to reference density and line',
    beddingEffect: null,
    fabricEffect: 'Clean crisp garment drape, watch or cufflinks visible if appropriate',
    objectEffect: 'House keys, sunglasses, or wallet on console table nearby',
    skinMoistureEffect: null,
    postureEffect: 'Upright alert posture, purposeful gaze'
  },
  {
    id: 'adjusting_clothing',
    titleAr: 'يعدّل ياقة أو أكمام الملابس',
    titleEn: 'Adjusting clothing',
    category: 'daily',
    descriptionAr: 'حركة يد عفوية تضبط ياقة الفانيلة أو كم الثوب مع طيات شد صادرة من نقطة اللمس.',
    hairEffect: 'Subtle tilt of head following hand action',
    beddingEffect: null,
    fabricEffect: 'Mechanical tension lines radiating precisely from grip point between thumb and forefinger',
    objectEffect: null,
    skinMoistureEffect: null,
    postureEffect: 'Elbow bent in natural biomechanical plane with anatomically sound shoulder'
  },
  {
    id: 'drinking_coffee',
    titleAr: 'يشرب قهوة أو وضع الكوب لتوه',
    titleEn: 'Drinking coffee',
    category: 'daily',
    descriptionAr: 'كوب سيراميك أو فنجان قهوة سعودية موضوع بجانبه أو محمول باليد.',
    hairEffect: 'Everyday casual grooming',
    beddingEffect: null,
    fabricEffect: 'Natural sleeve folds from arm elevation',
    objectEffect: 'Realistically scaled ceramic coffee cup or small Finjan on table surface',
    skinMoistureEffect: null,
    postureEffect: 'Relaxed conversational or reflective posture'
  },
  {
    id: 'checking_phone',
    titleAr: 'يتفقد هاتفه في لحظة عفوية',
    titleEn: 'Checking phone',
    category: 'daily',
    descriptionAr: 'انشغال بصري طبيعي بشاشة الهاتف بدلاً من التحديق المتكلف في الكاميرا.',
    hairEffect: 'Slight head downward pitch (~5-10 degrees) shifting hair gravity drape slightly forward',
    beddingEffect: null,
    fabricEffect: 'Collar and shoulder drape responding to head pitch',
    objectEffect: 'Soft screen glow illuminating face plane',
    skinMoistureEffect: null,
    postureEffect: 'Natural focal gaze dropped toward screen surface'
  },
  {
    id: 'resting_after_work',
    titleAr: 'يستريح بعد يوم عمل طويل',
    titleEn: 'Resting after work',
    category: 'daily',
    descriptionAr: 'تراخٍ عفوي مريح، فك رباط أو ياقة مريحة مع هدوء ملامح الوجه.',
    hairEffect: 'Relaxed hair structure with end-of-day natural softening',
    beddingEffect: 'Sofa or bed upholstery compressed under body mass',
    fabricEffect: 'Soft lived-in fabric wrinkles across elbows and thighs',
    objectEffect: 'Work badge or phone resting on side table',
    skinMoistureEffect: null,
    postureEffect: 'Relaxed shoulder drop, unforced breathing posture'
  },
  {
    id: 'recently_washed_face',
    titleAr: 'غسل وجهه لتوه بالماء',
    titleEn: 'Recently washed face',
    category: 'grooming',
    descriptionAr: 'نضارة طبيعية نقية مع أطراف شعر مبللة خفيفًا عند الصدغين دون لمعان زيتي.',
    hairEffect: 'Damp hairline fringe with tiny separated strands clinging gently to temple skin',
    beddingEffect: null,
    fabricEffect: 'Collar lightly pulled back, pure clean appearance',
    objectEffect: 'Bathroom towel or clean mirror frame in corner',
    skinMoistureEffect: 'Clean matte-hydrated skin with zero artificial oily shine',
    postureEffect: 'Refreshed upright head position'
  },
  {
    id: 'recently_showered',
    titleAr: 'خرج من الاستحمام لتوه',
    titleEn: 'Recently showered',
    category: 'grooming',
    descriptionAr: 'شعر رطب نسبيًا مصفف للخلف أو جانبيًا، مع ارتداء ملابس مريحة.',
    hairEffect: 'Naturally damp dark hair showing discrete authentic clumps without oily gel look',
    beddingEffect: null,
    fabricEffect: 'Fresh clean white cotton undershirt or robe',
    objectEffect: 'Subtle soft ambient humidity tone (no artificial fog)',
    skinMoistureEffect: 'Clean refreshed matte skin tone',
    postureEffect: 'Relaxed shoulders, clean casual atmosphere'
  },
  {
    id: 'casual_conversation',
    titleAr: 'في منتصف محادثة عفوية',
    titleEn: 'Casual conversation',
    category: 'daily',
    descriptionAr: 'تعابير وجه حية عفوية كأنه يتحدث أو يبتسم بلطف لصديق.',
    hairEffect: 'Natural dynamic movement',
    beddingEffect: null,
    fabricEffect: 'Natural shifting wrinkles',
    objectEffect: null,
    skinMoistureEffect: null,
    postureEffect: 'Slight head cant and engaging authentic eye contact'
  },
  {
    id: 'none',
    titleAr: 'بدون نشاط مسبق محدد',
    titleEn: 'No preceding activity specified',
    category: 'daily',
    descriptionAr: 'حالة محايدة ترتكز على إعدادات المشهد المباشرة.',
    hairEffect: null,
    beddingEffect: null,
    fabricEffect: null,
    objectEffect: null,
    skinMoistureEffect: null,
    postureEffect: null
  }
];

// RE-EXPORT V4 EXTENDED LIBRARIES
export * from './locationsData';
export * from './clothingData';
export * from './posesData';
export * from './cameraAnglesData';
export * from './expressionsData';
export * from './hairstylesData';
export * from './gazeData';
