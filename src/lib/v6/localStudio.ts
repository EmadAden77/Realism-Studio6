import type { SceneState, ClothingState } from '../../types/scene';
import { assembleMasterPrompt } from '../prompt/promptBuilder';

export interface V6Shot { id:string; titleAr:string; instructionEn:string; prompt:string; negativePrompt:string; }
export interface V6Outfit { id:string; name:string; clothing:ClothingState; }
export const V6_OUTFIT_KEY='realism_studio_v6_outfits';
export const V6_SEQUENCE_KEY='realism_studio_v6_sequences';
export const shotVariants=[
  {titleAr:'اللقطة الأساسية',instructionEn:'Preserve original subject identity, environment, clothing, lighting and camera mode; natural original framing.'},
  {titleAr:'التفاتة عفوية',instructionEn:'Change only gaze to a subtle off-camera glance and a slight natural head turn; preserve all locked identity and scene details.'},
  {titleAr:'تعديل الملابس',instructionEn:'The free hand gently adjusts the current upper garment hem; retain the selfie-holding hand and physiologically plausible grip folds.'},
  {titleAr:'تأطير جانبي خفيف',instructionEn:'Slightly shift framing to one side while preserving the same camera, physical arm reach, subject identity and background layout.'},
  {titleAr:'لحظة استرخاء',instructionEn:'Relax shoulder tension and expression naturally while retaining the same pose support, hairstyle density, lighting sources and clothing.'}
] as const;

export function buildShotSequence(state: SceneState):V6Shot[]{
 const base=assembleMasterPrompt(state);
 return shotVariants.map((shot,i)=>({
   id:'shot_'+(i+1),titleAr:shot.titleAr,instructionEn:shot.instructionEn,
   prompt: base.englishPrompt+' Sequence shot '+(i+1)+': '+shot.instructionEn,
   negativePrompt:base.negativePrompt
 }));
}

export interface V6LocalCheck { id:string;labelAr:string;status:'pass'|'warning';messageAr:string; }
export function checkV6Scene(state: SceneState):V6LocalCheck[]{
 const checks:V6LocalCheck[]=[];
 checks.push({id:'identity',labelAr:'قفل الهوية والشعر',status:state.identity.locks.faceAndSkull&&state.identity.locks.hairDensity?'pass':'warning',messageAr:'القفلان يحميان وصف الوجه وكثافة الشعر، وليس التحقق البصري من صورة مولّدة.'});
 checks.push({id:'lighting',labelAr:'مصادر الإنارة',status:state.lighting.mode==='phone_screen_only'&&state.lighting.secondarySourceEnabled?'warning':'pass',messageAr:state.lighting.mode==='phone_screen_only'&&state.lighting.secondarySourceEnabled?'إضاءة الشاشة فقط تتعارض مع مصدر ثانوي مفعل.':'الإضاءة لا تحتوي هذا التعارض المحدد.'});
 checks.push({id:'reach',labelAr:'مسافة الكاميرا',status:state.camera.mode==='front_selfie'&&state.pose.selfieArmDistanceCm>75?'warning':'pass',messageAr:'هذه مقارنة تقريبية؛ مدى الذراع الفعلي يعتمد على الشخص والوضعية.'});
 checks.push({id:'materials',labelAr:'الملمس الطبيعي',status:state.fabric.enabled&&state.fabric.preventPlasticGarments?'pass':'warning',messageAr:'افحص خامات الملابس والتجاعيد الناتجة عن الحركة، ولا تفترض أن الصور فُحصت فعليًا.'});
 return checks;
}

export function readV6Outfits():V6Outfit[]{
 try {const d=JSON.parse(localStorage.getItem(V6_OUTFIT_KEY)||'[]');return Array.isArray(d)?d:[];}catch{return [];}
}
export function saveV6Outfit(outfit:V6Outfit):V6Outfit[]{
 const others=readV6Outfits().filter(x=>x.id!==outfit.id);
 const next=[outfit,...others].slice(0,40);
 localStorage.setItem(V6_OUTFIT_KEY,JSON.stringify(next));return next;
}
export function removeV6Outfit(id:string):V6Outfit[]{
 const next=readV6Outfits().filter(o=>o.id!==id);
 localStorage.setItem(V6_OUTFIT_KEY,JSON.stringify(next));return next;
}
export function storeV6Sequence(shots:V6Shot[]):void{
 localStorage.setItem(V6_SEQUENCE_KEY,JSON.stringify(shots));
}
