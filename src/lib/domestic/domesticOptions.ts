import type {SceneState,CameraAngle,LightingMode} from '../../types/scene';
type Choice={id:string;label:string;prompt:string};
const make=(rows:string[][]):Choice[]=>rows.map(([id,label,prompt])=>({id,label,prompt}));
export const DOMESTIC_SELFIE_OPTIONS={
 locations:make([
 ['loc_living_tv','الصالة العائلية (كنب وتلفاز)','In an occupied family living room, textile sofa and uneven cushions, remote on a side table; switched-on TV emits only weak screen spill.'],
 ['loc_majlis','المجلس / الديوان العربي','In a residential Arabic majlis with floor mattresses, patterned carpet and cylindrical bolster cushions in plausible daily-use arrangement.'],
 ['loc_bedroom_bed','غرفة النوم (سرير غير مرتب وشاحن)','In an ordinary bedroom with rumpled cotton bed linen, plugged charger on nearby nightstand; room geometry preserved.'],
 ['loc_wardrobe','أمام دولاب الملابس المفتوح جزئياً','Beside a wardrobe with one door slightly open, everyday garments hanging inside; no implied mirror.'],
 ['loc_hallway','ممر المنزل الضيق (الطرقة)','In a narrow hall with matte paint, wooden doors and realistic receding perspective.'],
 ['loc_bathroom_mirror','أمام مرآة مغسلة الحمام','In a bathroom mirror by ceramic sink, soap dispenser and faint water droplets; physically plausible mirror reflection.'],
 ['loc_kitchen_counter','المطبخ المنزلي (الرخامة وأدوات القهوة)','Home kitchen beside stone-look counter with kettle, dish rack and used cotton towel on a handle.'],
 ['loc_kitchen_fridge','بجانب الثلاجة في المطبخ','Near home refrigerator, kitchen cabinets and ordinary magnets or paper notes.'],
 ['loc_stairs','درج المنزل الداخلي (بيت الدرج)','On supported residential stair landing with handrail and realistic stairwell geometry.'],
 ['loc_rooftop','سطح المنزل المفتوح (السطح)','Open residential rooftop with low concrete parapet and ordinary water tank, natural outdoor illumination.'],
 ['loc_balcony','الشرفة / البلكونة المنزلية','Small balcony with safe railing, plastic chair, potted plant and neighboring buildings.'],
 ['loc_foyer','مدخل البيت الداخلي (بجانب الباب)','Indoor home entryway, main wooden door, keys on shelf and ordinary coat hook.'],
 ['loc_desk','زاوية المكتب المنزلي (شاشة وأسلاك)','At lived-in home desk with computer monitor, cables, notebook and pen cup; screen light only when powered on.'],
 ['loc_window','بجانب نافذة الغرفة والستائر','Beside a home window with half-drawn sheer curtain, daylight only when outdoors is bright.'],
 ['loc_courtyard','حوش المنزل الداخلي (الفناء)','Enclosed domestic courtyard with tiled ground, textured outer walls and coiled water hose.']
 ]),
 angles:make([
 ['ang_high_arm','ذراع ممدودة - زاوية علوية خفيفة','Handheld front camera raised approximately 20–30 degrees, reachable arm geometry, modest downward pitch.'],
 ['ang_eye_level','مستوى العين المباشر - مسافة متوسطة','Eye-level front selfie at approximately 50cm, naturally wide foreground perspective and room depth.'],
 ['ang_low_chin','زاوية منخفضة عفوية','Front camera at upper chest height tilted upward; natural jaw perspective and upper wall visibility.'],
 ['ang_closeup','سيلفي قريب جداً للوجه','Close-up front camera at approximately 30cm: stronger near-camera facial perspective; broad smartphone depth of field, no creamy artificial bokeh.'],
 ['ang_side_34','زاوية جانبية ثلاثة أرباع','Three-quarter handheld selfie approximately 45 degrees to the side with natural facial foreshortening.'],
 ['ang_dutch','كادر مائل بيد واحدة','Gently rolled handheld selfie by about 8 degrees, naturally tilted horizon.'],
 ['ang_mirror_screen','سيلفي المرآة (النظر للشاشة)','Mirror reflection with rear camera held at chest, phone and fingers visible, eyes looking at the screen.'],
 ['ang_mirror_lens','سيلفي المرآة (النظر للعدسة)','Mirror reflection with visible phone near cheek and eye-line directed toward reflected lens.'],
 ['ang_overhead','زاوية علوية حادة من فوق الرأس','Overhead handheld selfie only within reachable shoulder and wrist range, believable perspective of floor below.'],
 ['ang_arm_visible','كادر يظهر الكتف والذراع','Front selfie with supporting shoulder and arm naturally entering frame edge; consistent foreshortening.'],
 ['ang_propped_timer','هاتف مسند على طاولة (بدون إمساك)','Hands-free self timer with phone supported on real surface, both hands free and stable camera position.']
 ]),
 poses:make([
 ['pos_stand_casual','وقوف عفوي مع إمالة الوزن','Standing contrapposto, weight borne on one planted leg; hips and shoulders respond naturally.'],
 ['pos_wall_back','اتكاء كامل بالظهر على الجدار','Standing with back against actual wall, shoulder and shirt compression at contact.'],
 ['pos_wall_shoulder','اتكاء جانبي بكتف واحد','Standing shoulder contact with real wall or doorframe, body weight supported over feet.'],
 ['pos_slouch','استرخاء في الكنبة','Slouched in a real sofa with cushion compression beneath pelvis and back.'],
 ['pos_lean_knees','جلوس مع انحناء للأمام','Seated, leaning forward with elbows on knees, fabric folds at flexed hips.'],
 ['pos_floor_arab','جلسة أرضية متربعاً','Cross-legged floor sit with weight supported by mat and optional side cushion.'],
 ['pos_lying_back','استلقاء على الظهر','Supine on real bed, pillow indentation under head, gravity-directed textile folds.'],
 ['pos_lying_stomach','استلقاء على البطن','Prone on mattress, elbows and forearms support elevated upper torso.'],
 ['pos_edge_sit','جلوس على حافة السرير أو الدرج','Seated on sturdy edge with pelvis supported and feet placed naturally.'],
 ['pos_counter_lean','انحناء على رخامة أو سور','Standing forward lean supported by countertop or railing at anatomically reachable height.']
 ]),
 actions:make([
 ['act_hair_touch','تمرير اليد في الشعر','Free hand touches original hair strands without changing hairline or density.'],
 ['act_neck_rub','فرك مؤخرة الرقبة','Free hand reaches neck naturally, mild fatigue expression only.'],
 ['act_chin_rest','إسناد الخد أو الذقن','Palm supports cheek with subtle skin compression, realistic wrist and elbow placement.'],
 ['act_drink_mug','إمساك كوب شاي أو قهوة','Free hand holds a real cup near chest, grounded grip and plausible liquid surface.'],
 ['act_collar_fix','تعديل ياقة الملابس','Free fingertips grip an existing collar and produce local tension creases.'],
 ['act_glasses_fix','تعديل النظارة','Index finger adjusts actual worn eyeglasses, never invent eyewear.'],
 ['act_mid_speech','لقطة أثناء التحدث','Brief candid moment mid-speech, relaxed jaw and naturally parted lips.'],
 ['act_smirk_squint','نصف ابتسامة جانبية','Small asymmetrical mouth movement with subtle eye narrowing, no changed identity.'],
 ['act_neutral','ملامح هادئة بدون ابتسامة','Neutral resting face, relaxed mouth, unchanged reference facial anatomy.'],
 ['act_side_glance','التفاتة عين جانبية','Eyes glance briefly to side without distorting original facial features.'],
 ['act_earbud','سماعة أذن أو ميكروفون','Single real earbud or wired microphone held plausibly, no phantom devices.'],
 ['act_remote','إمساك ريموت التلفاز','Free hand grips remote or controller, only when scene context supports it.']
 ]),
 lighting:make([
 ['lit_ceiling_white','إضاءة سقفية بيضاء','Ordinary ceiling LED creating downward shadow gradients under eyes and chin.'],
 ['lit_warm_lamp','إضاءة أباجورة دافئة','Visible or credible warm 2700K bedside lamp with localized soft penumbra and natural falloff.'],
 ['lit_hard_sun','شمس مباشرة من النافذة','Direct sun through real window creates directional higher-contrast shadows.'],
 ['lit_soft_window','ضوء نهار ناعم من الشباك','Diffused daylight through window, directional side shading with realistic indoor falloff.'],
 ['lit_phone_glow','توهج شاشة الهاتف في غرفة مظلمة','Only weak smartphone screen illumination at night, deep shadows and modest sensor noise.'],
 ['lit_backlit','إضاءة خلفية طبيعية','Bright window behind the subject; face remains underexposed without invented fill or face-only HDR recovery.']
 ])
} as const;
export type DomesticCategory=keyof typeof DOMESTIC_SELFIE_OPTIONS;
export type DomesticSelection={location?:string;angle?:string;pose?:string;action?:string;lighting?:string};
export function getDomesticSelection(s:SceneState):DomesticSelection{return s.domesticSelection||{};}
export function validateDomesticSelection(s:SceneState):string[]{
 const v=getDomesticSelection(s),errors:string[]=[];
 const mirror=['ang_mirror_screen','ang_mirror_lens'].includes(v.angle||'');
 const mirrorLocation=v.location==='loc_bathroom_mirror';
 if(mirror&&!mirrorLocation)errors.push('Mirror angles require a known mirror in the selected home location.');
 if(v.action==='act_glasses_fix'&&s.eyewear.mode==='none')errors.push('Cannot adjust glasses when eyewear is disabled.');
 if(v.pose==='pos_wall_back'||v.pose==='pos_wall_shoulder'){
  if(v.angle==='ang_low_chin'&&v.pose==='pos_wall_shoulder')errors.push('Low seated-style angle conflicts with the standing shoulder-wall pose.');
 }
 if(v.pose==='pos_lying_back'||v.pose==='pos_lying_stomach'){
  if(v.location&& !['loc_bedroom_bed'].includes(v.location))errors.push('Lying poses require a supported lying surface; use the bedroom bed.');
 }
 if(v.pose==='pos_slouch'&&v.location&&!['loc_living_tv','loc_majlis'].includes(v.location))errors.push('Slouching into a sofa requires a sofa location.');
 if(v.angle==='ang_propped_timer'&&v.action==='act_hair_touch'){} 
 return errors;
}
export function setDomesticChoice(s:SceneState,category:DomesticCategory,id:string):SceneState{
 const choice=DOMESTIC_SELFIE_OPTIONS[category].find(x=>x.id===id);
 if(!choice)return s;
 const selection={...getDomesticSelection(s),[category==='locations'?'location':category==='angles'?'angle':category==='poses'?'pose':category==='actions'?'action':'lighting']:id};
 let next={...s,domesticSelection:selection};
 if(category==='locations'){
  next={...next,environmentCategory:['loc_bedroom_bed','loc_wardrobe','loc_bathroom_mirror'].includes(id)?'bedroom':'home_general'};
 }
 if(category==='angles'){
  const angleMap:Record<string,CameraAngle>={ang_high_arm:'slightly_elevated',ang_eye_level:'eye_level',ang_low_chin:'low_angle',ang_closeup:'eye_level',ang_side_34:'lateral_right',ang_dutch:'eye_level',ang_mirror_screen:'eye_level',ang_mirror_lens:'eye_level',ang_overhead:'overhead_reachable',ang_arm_visible:'eye_level',ang_propped_timer:'eye_level'};
  next={...next,camera:{...next.camera,angle:angleMap[id],mode:id.startsWith('ang_mirror')?'mirror_selfie':id==='ang_propped_timer'?'third_person_phone':'front_selfie'},pose:{...next.pose,selfieArmDistanceCm:id==='ang_closeup'?30:id==='ang_eye_level'?50:next.pose.selfieArmDistanceCm,} as SceneState['pose']};
  if(id==='ang_dutch')next={...next,camera:{...next.camera,naturalHandheldRollDeg:8}};
 }
 if(category==='lighting'){
  const mode:Record<string,LightingMode>={lit_ceiling_white:'ceiling_light_only',lit_warm_lamp:'bedside_lamp_only',lit_hard_sun:'late_afternoon',lit_soft_window:'natural_daylight',lit_phone_glow:'phone_screen_only',lit_backlit:'natural_daylight'};
  next={...next,lighting:{...next.lighting,mode:mode[id]}};
 }
 if(category==='poses'){
  const categories:Record<string,SceneState['pose']['category']>={pos_stand_casual:'standing',pos_wall_back:'standing',pos_wall_shoulder:'standing',pos_slouch:'sitting',pos_lean_knees:'sitting',pos_floor_arab:'sitting',pos_lying_back:'reclining',pos_lying_stomach:'reclining',pos_edge_sit:'sitting',pos_counter_lean:'standing'};
  const support:Record<string,SceneState['pose']['supportSurface']>={pos_stand_casual:'ground',pos_wall_back:'wall',pos_wall_shoulder:'wall',pos_slouch:'chair',pos_lean_knees:'chair',pos_floor_arab:'ground',pos_lying_back:'bed_mattress',pos_lying_stomach:'bed_mattress',pos_edge_sit:'bed_mattress',pos_counter_lean:'wall'};
  next={...next,pose:{...next.pose,category:categories[id],supportSurface:support[id]}};
 }
 return next;
}
export function compileDomesticPrompt(s:SceneState):string{
 const v=getDomesticSelection(s),segments:string[]=[];
 for(const [key,field] of [['locations','location'],['angles','angle'],['poses','pose'],['actions','action'],['lighting','lighting']] as const){
  const choice=DOMESTIC_SELFIE_OPTIONS[key].find(x=>x.id===v[field]);
  if(choice)segments.push(choice.prompt);
 }
 return segments.length?'DOMESTIC SELFIE CONSTRAINTS: '+segments.join(' ')+ ' Preserve all user-verified facial identity, original hairline, skin tone and natural asymmetry; no beautification.':'';
}
