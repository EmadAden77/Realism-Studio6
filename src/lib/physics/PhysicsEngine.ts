import type { SceneState } from '../../types/scene';

export type PhysicsRule = {
 id: string;
 labelAr: string;
 domain: 'optics'|'lighting'|'mechanics';
 priority: number;
 reasonAr: string;
 active: (scene:SceneState)=>boolean;
 conflict: (scene:SceneState)=>boolean;
 correct: (scene:SceneState)=>SceneState;
};
export type RuleCorrection={id:string;labelAr:string;reasonAr:string};
export const PHYSICS_RULES_MATRIX = ([
 {
  id:'FRONT_OPTICAL_PROFILE',labelAr:'بصريات الكاميرا الأمامية',domain:'optics',priority:10,
  reasonAr:'الكاميرا الأمامية تستخدم المنظور المكافئ 21mm وفتحة f/2.0 مع مستشعر صغير؛ لا تستخدم خصائص العدسة الخلفية.',
  active:s=>s.camera.mode==='front_selfie',
  conflict:s=>s.camera.focalLengthEquivMm!==21||s.camera.aperture!=='f/2.0'||s.camera.sensorSize!=='1/2.74-inch'||!s.camera.lensFlawsSimulation.noArtificialPortraitBlur,
  correct:s=>({...s,camera:{...s.camera,focalLengthEquivMm:21,aperture:'f/2.0',sensorSize:'1/2.74-inch',lensFlawsSimulation:{...s.camera.lensFlawsSimulation,noArtificialPortraitBlur:true}}})
 },
 {
  id:'REAR_OPTICAL_PROFILE',labelAr:'بصريات الكاميرا الخلفية',domain:'optics',priority:11,
  reasonAr:'عند اختيار العدسة الرئيسية الخلفية تُضبط مواصفاتها مستقلة عن الكاميرا الأمامية.',
  active:s=>s.camera.mode==='rear_main_self_capture',
  conflict:s=>s.camera.focalLengthEquivMm!==23||s.camera.aperture!=='f/1.63'||s.camera.sensorSize!=='1-inch-type',
  correct:s=>({...s,camera:{...s.camera,focalLengthEquivMm:23,aperture:'f/1.63',sensorSize:'1-inch-type'}})
 },
 {
  id:'SCREEN_ONLY_CAUSALITY',labelAr:'الإضاءة من الشاشة وحدها',domain:'lighting',priority:20,
  reasonAr:'المصدر الضعيف الوحيد هو شاشة الهاتف؛ يجب إلغاء الإضاءة الثانوية وتثبيت الليل.',
  active:s=>s.lighting.mode==='phone_screen_only',
  conflict:s=>s.lighting.secondarySourceEnabled||s.lighting.timeOfDay!=='night'||s.lighting.primarySource.direction!=='front_screen'||s.lighting.primarySource.intensity!=='low',
  correct:s=>({...s,lighting:{...s.lighting,timeOfDay:'night',secondarySourceEnabled:false,secondarySourceType:'none',primarySource:{...s.lighting.primarySource,type:'phone screen',direction:'front_screen',intensity:'low'}}})
 },
 {
  id:'MIDDAY_SUN_CONSISTENCY',labelAr:'اتساق ضوء الظهيرة',domain:'lighting',priority:21,
  reasonAr:'الشمس المباشرة في منتصف النهار تتطلب مشهدًا نهاريًا؛ نعومة الظلال تعتمد أيضًا على الغيوم وحجب الضوء.',
  active:s=>s.lighting.mode==='midday_sunlight',
  conflict:s=>s.lighting.timeOfDay!=='day',
  correct:s=>({...s,lighting:{...s.lighting,timeOfDay:'day'}})
 },
 {
  id:'SELFIE_REACH_LIMIT',labelAr:'حد وصول ذراع السيلفي',domain:'mechanics',priority:30,
  reasonAr:'المسافة الكبيرة جدًا في سيلفي محمول باليد غير مدعومة بوضعية الذراع.',
  active:s=>s.camera.mode==='front_selfie',
  conflict:s=>s.pose.selfieArmDistanceCm>75||s.pose.selfieArmDistanceCm<30,
  correct:s=>({...s,pose:{...s.pose,selfieArmDistanceCm:Math.max(30,Math.min(75,s.pose.selfieArmDistanceCm))}})
 },
 {
  id:'SUPPORTED_SEATED_POSTURE',labelAr:'دعم الجسد عند الجلوس',domain:'mechanics',priority:40,
  reasonAr:'الجلوس يتطلب سطح ارتكاز وليس وضعية طافية.',
  active:s=>s.pose.category==='sitting',
  conflict:s=>s.pose.supportSurface==='unsupported',
  correct:s=>({...s,pose:{...s.pose,supportSurface:s.environmentCategory==='vehicle'?'car_seat':s.environmentCategory==='bedroom'?'bed_mattress':'chair'}})
 },
 {
  id:'SUPPORTED_RECLINE',labelAr:'دعم الاستلقاء',domain:'mechanics',priority:41,
  reasonAr:'الاستلقاء يفرض سطحًا يتحمل الوزن وتلامسًا واقعيًا.',
  active:s=>s.pose.category==='reclining',
  conflict:s=>s.pose.supportSurface==='unsupported',
  correct:s=>({...s,pose:{...s.pose,supportSurface:s.environmentCategory==='vehicle'?'car_seat':'bed_mattress'}})
 }
] satisfies PhysicsRule[]).sort((a,b)=>a.priority-b.priority);

export function resolvePhysicsState(source:SceneState):{state:SceneState;corrections:RuleCorrection[]}{
 let state=source;
 const corrections:RuleCorrection[]=[];
 for(const rule of PHYSICS_RULES_MATRIX){
  if(rule.active(state)&&rule.conflict(state)){
   state=rule.correct(state);
   corrections.push({id:rule.id,labelAr:rule.labelAr,reasonAr:rule.reasonAr});
  }
 }
 return {state,corrections};
}
export function getActivePhysicsLocks(s:SceneState){return PHYSICS_RULES_MATRIX.filter(r=>r.active(s)).map(r=>({id:r.id,labelAr:r.labelAr,reasonAr:r.reasonAr,violated:r.conflict(s)}));}
export function opticalDiagnostics(s:SceneState){
 const fEquivalent=s.camera.focalLengthEquivMm;
 const crop=s.camera.sensorSize==='1-inch-type'?2.73:6.55; // approximate diagonal crop factors
 const fActual=fEquivalent/crop;
 const fNumber=Number(s.camera.aperture.replace('f/',''))||2;
 const subjectMm=Math.max(300,s.pose.selfieArmDistanceCm*10);
 const coc=.03/crop;
 const hyperfocalMm=fActual*fActual/(fNumber*coc)+fActual;
 const nearMm=hyperfocalMm*subjectMm/(hyperfocalMm+(subjectMm-fActual));
 const farDen=hyperfocalMm-(subjectMm-fActual);
 const farMm=farDen>0?hyperfocalMm*subjectMm/farDen:Infinity;
 return {fActual,fNumber,subjectCm:subjectMm/10,nearCm:nearMm/10,farCm:Number.isFinite(farMm)?farMm/10:null,nearFaceRelativeScale:1.25,assumptions:'تقريب للعدسة الرقيقة ودائرة تشوش 0.03mm مكافئة على إطار كامل؛ لا يشمل معالجة الهاتف الحاسوبية.'};
}
export function lightDiagnostics(s:SceneState){
 const distance=Math.max(.25,(s.v7Calibration?.screenDistanceCm||50)/100);
 return {referenceDistanceM:distance,relativeIlluminanceAtDoubleDistance:.25,ratioAtOneMeter:(distance/1)**2,model:'نموذج نقطة ضوئية تقريبي؛ الشاشة مصدر ممتد ولا ينطبق قانون التربيع العكسي قربها حرفيًا.'};
}
export function compileMechanicalPrompt(s:SceneState):string{
 const parts:string[]=[];
 const optics=opticalDiagnostics(s);
 if(s.camera.mode==='front_selfie'){
  parts.push('OPTICS LOCK: real close-held front-camera perspective at '+optics.subjectCm.toFixed(0)+' cm; approximate real focal length '+optics.fActual.toFixed(2)+' mm, f/'+optics.fNumber.toFixed(1)+'; deep apparent depth of field with naturally mild close-range perspective enlargement, not artificial portrait blur. Optical blur is not determined by focal-length equivalence alone.');
 }
 if(s.lighting.mode==='phone_screen_only'){
  parts.push('LIGHT CAUSALITY LOCK: the extended phone screen is the only weak emitter. Face receives more light than lower torso; steeply falling illumination and genuinely dark background; no studio fill or face-only HDR.');
 } else if(s.lighting.mode==='midday_sunlight'){
  parts.push('LIGHT CAUSALITY LOCK: direct high-elevation sun creates directional shadows and potentially harsh specular highlights; cloud cover or architectural shade can soften the result only if present in the scene.');
 }
 if(s.pose.category==='sitting'){
  parts.push('BODY MECHANICS: center of mass supported by pelvis and seat, with compression beneath hips and thighs; garment folds at hip flexion and realistic foot support.');
 } else if(s.pose.category==='reclining'){
  parts.push('BODY MECHANICS: torso and pelvis supported by '+s.pose.supportSurface.replaceAll('_',' ')+', pressure flattening in contact areas, fabric tension across flexed joints.');
 } else if(s.pose.category==='standing'){
  parts.push('BODY MECHANICS: center of mass balanced over planted feet, gravity-aligned clothing drape and natural load transfer at ankles, knees and hips.');
 }
 parts.push(compileMaterialContactPrompt(s));
 parts.push('CAMERA RIG: '+s.camera.angle.replaceAll('_',' ')+' pitch orientation and '+s.camera.naturalHandheldRollDeg+' degree handheld roll; no physically impossible hovering camera.');
 return parts.join('\n');
}
export function calculateIntegrity(s:SceneState){
 const active=PHYSICS_RULES_MATRIX.filter(r=>r.active(s));
 const violated=active.filter(r=>r.conflict(s));
 return {active:active.length,violated:violated.length,score:active.length?Math.round(100*(active.length-violated.length)/active.length):100};
}

export const MATERIAL_BEHAVIOR = {
 lightweight_cotton:{drape:'soft light folds',friction:'moderate grip against cotton bedding',specular:'very low sheen'},
 medium_cotton:{drape:'medium-weight gravity folds',friction:'moderate surface friction',specular:'matte diffuse reflection'},
 heavy_cotton:{drape:'broad structured weight-bearing folds',friction:'moderate-to-high fabric contact',specular:'low sheen'},
 jersey_knit:{drape:'elastic drape following joint motion',friction:'moderate contact grip',specular:'soft low sheen'},
 athletic_polyester:{drape:'light flowing folds that follow tension lines',friction:'relatively low surface grip',specular:'subtle technical fabric highlights'},
 cotton_poly_blend:{drape:'medium flexible fold radius',friction:'moderate surface grip',specular:'restrained mixed-fiber highlights'},
 woven_thobe_fabric:{drape:'long continuous woven panels with measured diagonal creases',friction:'gentle seat and knee interaction',specular:'restrained woven highlights'},
 linen_blend:{drape:'angular broken folds and persistent creases',friction:'moderate dry fiber contact',specular:'matte scattering'},
 denim:{drape:'stiff broad creases concentrated near joints',friction:'higher resistant friction at seated interfaces',specular:'subdued twill reflection'}
} as const;
export function compileMaterialContactPrompt(s:SceneState):string{
 const top=MATERIAL_BEHAVIOR[s.clothing.upper.material];
 const bottom=MATERIAL_BEHAVIOR[s.clothing.lower.material];
 const lines=[
  'MATERIAL CONTACT MATRIX: upper garment '+s.clothing.upper.nameEn+', '+top.drape+', '+top.specular+'; lower garment '+s.clothing.lower.nameEn+', '+bottom.drape+', '+bottom.friction+'.'
 ];
 if(s.pose.category==='sitting'){
  lines.push('At the supported seat contact, the lower garment is compressed beneath hips and thighs while cloth gathers around flexed knees; wrinkle direction follows supported load and actual seam positions.');
 }else if(s.pose.category==='reclining'){
  lines.push('At cushion, pillow or mattress contacts, existing garments flatten under the supported body segments, with gravity drape redirected toward free edges rather than uniform random wrinkles.');
 }else if(s.pose.category==='walking'){
  lines.push('Alternating leg motion creates asymmetric knee and hip folds; loose hems trail only slightly according to weight and movement, without impossible airborne cloth.');
 }
 if(s.pose.freeHand==='adjusting_item'){
  lines.push('Any fabric pinch must have a visible contacting hand, realistic local tension and connected arm joints; no detached or duplicated fingers.');
 }
 if(s.clothing.outer){
  const outer=MATERIAL_BEHAVIOR[s.clothing.outer.material];
  lines.push('Outer layer '+s.clothing.outer.nameEn+': '+outer.drape+', physically separated from inner fabric with real overlap shadows.');
 }
 return lines.join(' ');
}
