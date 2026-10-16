import type {SceneState} from '../../types/scene';
export type LaptopPose={id:string;nameAr:string;category:SceneState['pose']['category'];support:SceneState['pose']['supportSurface'];angle:SceneState['camera']['angle'];promptEn:string};
export const NIGHT_LAPTOP_SELFIE_RULES={
 environmentId:'bedroom_night_laptop',
 globalConstraints:{
 identityLock:'Preserve exact reference facial identity, facial silhouette, skin tone, natural hairline and original height and weight; never overwrite person measurements.',
 cameraOptics:'Use the existing Xiaomi 15 Ultra front-camera profile 21mm equivalent f/2.0, realistic close handheld geometry and sensor noise; no invented shallow depth of field.',
 lightingPhysics:'Night bedroom, laptop screen as directional broad extended light source, plausible cool screen emission and realistic falloff; warm ambient only when an actual lamp is selected.',
 conflictLocks:['NO_STUDIO_SOFTBOX','NO_DAYLIGHT_WINDOW','SINGLE_PHONE_HAND_EXTENSION','VALID_LAPTOP_SCREEN_OCCLUSION']
 },
 poses:[["01","الجلسة الكلاسيكية على السرير","sitting","bed_mattress","eye_level","Laptop open on lap; free hand rests on keyboard; pillow supports back."],["02","الاستلقاء على البطن واللابتوب أمامه","reclining","bed_mattress","low_angle","Prone on mattress, upper torso supported by elbows; laptop open on mattress in front, free hand supports chin only if forearm stays supported."],["03","جلسة المكتب وإسناد الذقن","sitting","chair","lateral_right","Seated at bedroom desk; laptop on desk; free elbow planted on desk and fingers support jaw."],["04","يضع ساقه على ساقه واللابتوب على الفخذ","sitting","chair","eye_level","Seated in stable lounge chair with one leg crossed; laptop base balanced on thigh and stabilized by free hand."],["05","زاوية علوية مع إرجاع الرأس للخلف","sitting","pillows","slightly_elevated","Back supported by pillows, laptop on lap; free hand behind neck, phone raised within reach."],["06","سيلفي جانبي أثناء الكتابة","sitting","chair","lateral_right","Laptop on desk; free hand types with natural wrist support; phone held 45 degrees to side."],["07","اللابتوب بجانب الجسم على المرتبة","sitting","bed_mattress","eye_level","Laptop beside hip on bed within actual trackpad reach, screen facing subject; light reaches only exposed nearby surfaces."],["08","سيلفي مرآة الغرفة وانعكاس الشاشة","standing","ground","eye_level","Actual bedroom mirror and open laptop on desk positioned to be visible through geometrically correct reflection."],["09","حمل اللابتوب بيد والهاتف بالأخرى","standing","ground","eye_level","One forearm and palm support the open laptop base close to torso; other hand holds phone; both objects safely balanced."],["10","جلسة أرضية واللابتوب على الركبتين","sitting","ground","slightly_elevated","Seated on carpet, back against bed, knees raised supporting laptop base; realistic leg and forearm angles."],["11","نظرة من فوق حافة الشاشة نصف المغلقة","sitting","bed_mattress","eye_level","Laptop base rests on lap; free hand adjusts partially lowered lid; screen edge occludes only physically overlapping portions."],["12","استراحة القهوة بجانب اللابتوب","sitting","chair","eye_level","Laptop on desk, free hand holds ceramic cup; fingers grip handle without impossible reach."],["13","شاشة اللابتوب مع أباجورة دافئة خافتة","sitting","bed_mattress","eye_level","Laptop open on lap and separately visible dim 2700K bedside lamp supplies weak warm ambient; no hidden rim light."],["14","لمس الجبين بعد عمل متأخر","sitting","chair","eye_level","Laptop on desk, free fingertips touch forehead; screen light reaches hand and face from credible direction."],["15","سيلفي عريض يظهر الغرفة واللابتوب","sitting","bed_mattress","eye_level","Front camera 21mm environmental framing at normal arm reach; open laptop on duvet with localized weak screen illumination."],["16","الالتفات من كرسي المكتب","sitting","chair","lateral_right","Torso rotates on swivel chair; laptop remains on desk behind, screen spill only if facing the subject."],["17","شبه مستلقٍ واللابتوب على البطن","reclining","pillows","overhead_reachable","Torso supported by bed pillows and mattress, laptop base on thighs or abdomen safely stabilized by free hand, overhead phone within arm reach."],["18","الشاشة وحدها في ظلام الغرفة","sitting","chair","eye_level","Laptop screen is sole light; nearby face lit unevenly, background falls into darkness, no phone-screen fill or imaginary ambient."],["19","سماعات رأس أثناء العمل","sitting","chair","slightly_elevated","Laptop on desk, optional over-ear headphones actually worn; free hand touches earcup while filming."],["20","إغلاق اللابتوب بعد العمل","sitting","bed_mattress","eye_level","Laptop on lap and free hand lowers lid; diminishing screen emission as gap narrows, no residual illumination after full closure."]].map(([id,nameAr,category,support,angle,promptEn]):LaptopPose=>({id:'nl_pose_'+id,nameAr,category:category as LaptopPose['category'],support:support as LaptopPose['support'],angle:angle as LaptopPose['angle'],promptEn}))
};
export function applyNightLaptopPose(scene:SceneState,id:string):SceneState{
 const choice=NIGHT_LAPTOP_SELFIE_RULES.poses.find(x=>x.id===id);if(!choice)return scene;
 const mirror=id==='nl_pose_08';
 return {...scene,nightLaptopPoseId:id,domesticSelection:undefined,
  environmentCategory:'bedroom',locationPresetId:mirror?'bedroom_standing_mirror':'bedroom_bed_edge',
  camera:{...scene.camera,mode:mirror?'mirror_selfie':'front_selfie',angle:choice.angle},
  pose:{...scene.pose,category:choice.category,supportSurface:choice.support},
  lighting:{...scene.lighting,mode:id==='nl_pose_13'?'mixed_practical':'deep_night',timeOfDay:'night',secondarySourceEnabled:id==='nl_pose_13'}
 };
}
export function validateNightLaptopPose(s:SceneState):string[]{
 const id=s.nightLaptopPoseId;if(!id)return [];
 const errors:string[]=[];
 const pose=NIGHT_LAPTOP_SELFIE_RULES.poses.find(p=>p.id===id);
 if(!pose)return ['Unknown laptop pose.'];
 if(s.environmentCategory!=='bedroom')errors.push('Laptop preset requires bedroom.');
 if(s.lighting.timeOfDay!=='night')errors.push('Laptop preset requires night.');
 if(s.lighting.mode==='phone_screen_only')errors.push('Phone screen only cannot coexist with an illuminated laptop.');
 if(id==='nl_pose_08'&&s.camera.mode!=='mirror_selfie')errors.push('Mirror preset requires mirror camera mode.');
 if(id!=='nl_pose_08'&&s.camera.mode==='mirror_selfie')errors.push('Mirror mode requires the mirror preset.');
 if(s.pose.category!==pose.category)errors.push('Body category conflicts with the selected laptop pose.');
 return errors;
}
export function compileNightLaptopPrompt(s:SceneState):string{
 const pose=NIGHT_LAPTOP_SELFIE_RULES.poses.find(p=>p.id===s.nightLaptopPoseId);
 if(!pose)return '';
 const mirror=pose.id==='nl_pose_08';
 const lamp=pose.id==='nl_pose_13';
 const dark=pose.id==='nl_pose_18';
 return 'NIGHT LAPTOP SELFIE: '+pose.promptEn+
 '. '+NIGHT_LAPTOP_SELFIE_RULES.globalConstraints.identityLock+
 ' '+NIGHT_LAPTOP_SELFIE_RULES.globalConstraints.cameraOptics+
 ' Active laptop screen provides directionally plausible close-range illumination: '+(lamp?'cool screen light and dim visible warm bedside lamp, each with its own shadows.':dark?'screen light only, with dark unlit room and no invisible fill.':'cool laptop screen light only where the screen physically faces the subject; no invented warm light.')+
 (mirror?' Mirror shows geometrically valid laptop and phone reflections.':' One arm supports the smartphone and the other performs the specified task.')+
 ' Never show an unsupported floating laptop or invented daylight.';
}
