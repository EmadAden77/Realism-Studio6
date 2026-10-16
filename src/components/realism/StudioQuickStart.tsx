import {HAIR_PHYSICS_MATRIX} from '../../lib/physics/hairPhysicsMatrix';
import {ALL_SHIRT_PANTS_SETS,applyShirtPantsSet} from '../../lib/presets/shirtPantsSets';
import {NIGHT_LAPTOP_SELFIE_RULES} from '../../lib/physics/nightLaptopSelfie';
import React,{useMemo,useState} from 'react';
import {Camera,Home,Moon,Monitor,Copy,Check,ShieldCheck} from 'lucide-react';
import {useSceneStore} from '../../store/sceneStore';
import {applyNightLaptopPose} from '../../lib/physics/nightLaptopSelfie';
import {setDomesticChoice} from '../../lib/domestic/domesticOptions';
import {resolvePhysicsState,calculateIntegrity} from '../../lib/physics/PhysicsEngine';
import {compileLocalPhysicsPrompt} from '../../lib/prompt/localPhysicsCompiler';
import {assembleMasterPrompt} from '../../lib/prompt/promptBuilder';

export function StudioQuickStart(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [mode,setMode]=useState<'master'|'local'>('local');
 const [copied,setCopied]=useState(false);
 const integrity=calculateIntegrity(state);
 const output=useMemo(()=>mode==='local'?compileLocalPhysicsPrompt(state):assembleMasterPrompt(state).englishPrompt,[state,mode]);
 const setScene=(value:'bed'|'home'|'laptop')=>{
  updateGlobalSceneState(prev=>{
   if(value==='laptop')return applyNightLaptopPose(prev,'nl_pose_01');
   const cleared={...prev,nightLaptopPoseId:undefined,domesticSelection:undefined};
   if(value==='home'){
    const next=setDomesticChoice(cleared,'locations','loc_living_tv');
    return {...next,lighting:{...next.lighting,mode:'mixed_practical',timeOfDay:'night'}};
   }
   return {...cleared,environmentCategory:'bedroom',locationPresetId:'bedroom_bed_edge',
     camera:{...cleared.camera,mode:'front_selfie'},lighting:{...cleared.lighting,mode:'phone_screen_only',timeOfDay:'night'}};
  });
 };
 const changeCamera=(modeValue:'front_selfie'|'rear_main_self_capture'|'mirror_selfie'|'third_person_phone')=>{
  updateGlobalSceneState(prev=>resolvePhysicsState({...prev,nightLaptopPoseId:undefined,domesticSelection:undefined,...(modeValue==='mirror_selfie'?{environmentCategory:'bedroom' as const,locationPresetId:'bedroom_standing_mirror'}:{}),camera:{...prev.camera,mode:modeValue}}).state);
 };
 const changeLighting=(value:'phone_screen_only'|'ceiling_light_only'|'bedside_lamp_only'|'natural_daylight')=>{
  updateGlobalSceneState(prev=>resolvePhysicsState({...prev,nightLaptopPoseId:undefined,domesticSelection:undefined,lighting:{...prev.lighting,mode:value,timeOfDay:value==='natural_daylight'?'day':'night'}}).state);
 };
 const copy=async()=>{try{await navigator.clipboard.writeText(output);setCopied(true);}catch{setCopied(false);}};
 return <section dir="rtl" className="rounded-2xl border border-amber-500/20 bg-neutral-900/90 p-4 sm:p-5 space-y-4" aria-label="الإنشاء السريع للمشهد">
  <div className="flex flex-wrap justify-between items-start gap-2">
   <div><h2 className="font-extrabold text-base text-white">أنشئ المشهد من مكان واحد</h2><p className="text-xs text-neutral-400 mt-1">اختر المشهد، الكاميرا والإضاءة، ثم انسخ البرومبت. بقية الأدوات المتقدمة أدناه.</p></div>
   <div className="flex gap-1 items-center text-xs text-emerald-300"><ShieldCheck size={15}/>{integrity.active-integrity.violated}/{integrity.active} أقفال</div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
   <button type="button" onClick={()=>setScene('bed')} className="rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-400 text-right p-3 text-xs flex items-center gap-2"><Moon size={17} className="text-amber-400"/>سيلفي غرفة النوم</button>
   <button type="button" onClick={()=>setScene('home')} className="rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-400 text-right p-3 text-xs flex items-center gap-2"><Home size={17} className="text-amber-400"/>داخل المنزل</button>
   <button type="button" onClick={()=>setScene('laptop')} className="rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-400 text-right p-3 text-xs flex items-center gap-2"><Monitor size={17} className="text-amber-400"/>لابتوب ليلي</button>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
   <label className="text-xs text-neutral-300">الكاميرا
    <select value={state.camera.mode} onChange={e=>changeCamera(e.target.value as typeof state.camera.mode)} className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     <option value="front_selfie">أمامية 21mm</option><option value="rear_main_self_capture">خلفية 23mm</option>
     <option value="mirror_selfie">انعكاس مرآة</option><option value="third_person_phone">تصوير شخص آخر</option>
    </select>
   </label>
   <label className="text-xs text-neutral-300">الإضاءة
    <select value={['phone_screen_only','ceiling_light_only','bedside_lamp_only','natural_daylight'].includes(state.lighting.mode)?state.lighting.mode:''} onChange={e=>changeLighting(e.target.value as 'phone_screen_only'|'ceiling_light_only'|'bedside_lamp_only'|'natural_daylight')} className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     <option value="" disabled>إضاءة مخصصة من الأدوات المتقدمة</option>
     <option value="phone_screen_only">شاشة الهاتف فقط</option><option value="ceiling_light_only">إضاءة السقف</option><option value="bedside_lamp_only">أباجورة جانبية</option><option value="natural_daylight">ضوء النهار</option>
    </select>
   </label>
  </div>
  <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-neutral-800 pt-3" aria-label="الملابس والشعر والوضعية">
   <label className="text-xs text-neutral-300">طقم القميص والبنطلون
    <select value={ALL_SHIRT_PANTS_SETS.some(x=>x.id===state.clothing.activeOutfitPresetId)?state.clothing.activeOutfitPresetId:''}
     onChange={e=>{const outfit=ALL_SHIRT_PANTS_SETS.find(x=>x.id===e.target.value);if(outfit)updateGlobalSceneState(prev=>applyShirtPantsSet(prev,outfit));setCopied(false);}}
     className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     <option value="">الملابس الحالية (يمكن تعديلها من الخزانة)</option>
     {ALL_SHIRT_PANTS_SETS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}
    </select>
   </label>
   <label className="text-xs text-neutral-300">تسريحة الشعر
    <select value={state.hair.selectedPhysicsStyleId||'hair_ref_exact'}
     onChange={e=>{updateGlobalSceneState(prev=>({...prev,hair:{...prev.hair,selectedPhysicsStyleId:e.target.value,densityLock:true,preventArtificialThickening:true}}));setCopied(false);}}
     className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     {HAIR_PHYSICS_MATRIX.styles.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}
    </select>
   </label>
   <label className="text-xs text-neutral-300">الوضعية
    <select value={state.nightLaptopPoseId||''}
     onChange={e=>{updateGlobalSceneState(prev=>e.target.value?applyNightLaptopPose(prev,e.target.value):({...prev,nightLaptopPoseId:undefined}));setCopied(false);}}
     className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     <option value="">الوضعية الحالية (الأدوات المتقدمة)</option>
     {NIGHT_LAPTOP_SELFIE_RULES.poses.map(x=><option key={x.id} value={x.id}>{x.nameAr}</option>)}
    </select>
   </label>
   <label className="text-xs text-neutral-300">جوانب الشعر
    <select value={state.hair.selectedSideId||'side_ref'}
     onChange={e=>{updateGlobalSceneState(prev=>({...prev,hair:{...prev.hair,selectedSideId:e.target.value,densityLock:true,preventArtificialThickening:true}}));setCopied(false);}}
     className="w-full block mt-1 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
     {HAIR_PHYSICS_MATRIX.sides.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}
    </select>
   </label>
  </section>
  <div className="space-y-2 border-t border-neutral-800 pt-3">
   <div className="flex justify-between items-center gap-2"><h3 className="text-xs font-bold text-white">البرومبت المباشر</h3>
    <div className="flex gap-1 rounded-lg border border-neutral-700 p-1">
     <button type="button" aria-pressed={mode==='local'} onClick={()=>{setMode('local');setCopied(false);}} className={'px-2 py-1 rounded text-xs '+(mode==='local'?'bg-amber-500 text-neutral-950':'text-neutral-400')}>Local</button>
     <button type="button" aria-pressed={mode==='master'} onClick={()=>{setMode('master');setCopied(false);}} className={'px-2 py-1 rounded text-xs '+(mode==='master'?'bg-amber-500 text-neutral-950':'text-neutral-400')}>Master</button>
    </div>
   </div>
   <textarea dir="ltr" readOnly value={output} rows={5} aria-label="معاينة البرومبت الإنجليزي" className="w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed"/>
   <button type="button" onClick={copy} className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold min-h-11 flex items-center justify-center gap-2">{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'تم النسخ':'نسخ البرومبت'}</button>
  </div>
  <p className="text-[11px] text-neutral-500"><Camera size={12} className="inline"/> المسافات والظلال تُحاكى تقريبياً؛ مؤشر الأقفال لا يعني ضمان نتيجة الصورة. جميع المعالجة المحلية داخل المتصفح.</p>
 </section>;
}
