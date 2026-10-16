import {constraintById} from '../../lib/physics/UIConstraints';
import React, {useState} from 'react';
import {useSceneStore} from '../../store/sceneStore';
import type {CameraAngle, LightingMode} from '../../types/scene';

const angles: {value:CameraAngle;label:string}[]=[
 {value:'eye_level',label:'مستوى العين'}, {value:'slightly_elevated',label:'أعلى قليلًا'}, {value:'elevated',label:'مرتفعة'},
 {value:'low_angle',label:'منخفضة'},{value:'lateral_left',label:'جانبية يسار'},
 {value:'lateral_right',label:'جانبية يمين'},{value:'reclining_angle',label:'استلقاء'},
 {value:'overhead_reachable',label:'علوية ضمن مدى الذراع'}
];
const lights:{value:LightingMode;label:string}[]=[
 {value:'phone_screen_only',label:'شاشة الهاتف فقط'},
 {value:'ceiling_light_only',label:'سقف الغرفة فقط'},
 {value:'bedside_lamp_only',label:'مصباح الطاولة فقط'},
 {value:'street_led',label:'مصابيح الشارع'},
 {value:'natural_daylight',label:'نهار طبيعي'},
 {value:'mixed_practical',label:'إنارة عملية مختلطة'}
];
export function V6PoseLightingPanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [notes,setNotes]=useState('');
 const screenLock=constraintById(state,'secondary_light');
 const reachLock=constraintById(state,'selfie_overreach');
 const patchPose=(patch:Partial<typeof state.pose>)=>updateGlobalSceneState(prev=>({...prev,pose:{...prev.pose,...patch}}));
 const patchCamera=(patch:Partial<typeof state.camera>)=>updateGlobalSceneState(prev=>({...prev,camera:{...prev.camera,...patch}}));
 const setLighting=(mode:LightingMode)=>updateGlobalSceneState(prev=>({
  ...prev,lighting:{
   ...prev.lighting,mode,
   secondarySourceEnabled:mode==='phone_screen_only'?false:prev.lighting.secondarySourceEnabled,
   primarySource:mode==='phone_screen_only'
    ? {type:'phone screen',direction:'front_screen',colorTempK:5000,intensity:'low'}
    : prev.lighting.primarySource
  }
 }));
 const addPoseNotes=()=>{
  const cleaned=notes.trim();
  if(!cleaned)return;
  patchPose({candidAction:cleaned});setNotes('');
 };
 return <section dir="rtl" className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
  <h2 className="font-bold text-white">V6: تكوين الوضعية والإضاءة</h2>
  <p className="text-xs text-neutral-400">تعديل فعلي في حالة المشهد، مع الحفاظ على الوجه والشعر والملابس.</p>
  <label className="block text-xs space-y-1">وضعية الجسم
   <select className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-700" value={state.pose.category}
    onChange={e=>patchPose({category:e.target.value as typeof state.pose.category})}>
    {['standing','sitting','reclining','walking','interaction','candid_micro'].map((v,i)=><option value={v} key={v}>{['واقف','جالس','مستلقي','يمشي','يتفاعل مع غرض','حركة عفوية'][i]}</option>)}
   </select>
  </label>
  <label className="block text-xs space-y-1">زاوية الكاميرا
   <select className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-700" value={state.camera.angle}
    onChange={e=>patchCamera({angle:e.target.value as CameraAngle})}>{angles.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}</select>
  </label>
  <label className="block text-xs space-y-1">مسافة العدسة عن الوجه: {state.pose.selfieArmDistanceCm} سم
   <input className="w-full accent-amber-500" aria-label="مسافة السيلفي" type="range" min="30" max={state.camera.mode==='front_selfie'?75:90} step="1"
    value={state.pose.selfieArmDistanceCm} onChange={e=>{
     const distance=Number(e.target.value);
     updateGlobalSceneState(prev=>({...prev,pose:{...prev.pose,selfieArmDistanceCm:distance},
      geometryCalibration:{...prev.geometryCalibration,camera:{...prev.geometryCalibration.camera,lensToFaceDistanceCm:distance}}}));
    }}/>
  </label>
  <label className="block text-xs space-y-1">الإضاءة
   <select className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-700" value={state.lighting.mode}
    onChange={e=>setLighting(e.target.value as LightingMode)}>
    {lights.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
    {!lights.some(l=>l.value===state.lighting.mode)&&<option value={state.lighting.mode}>{state.lighting.mode.replaceAll('_',' ')}</option>}
   </select>
  </label>
  <div className="rounded-xl border border-neutral-700 p-3 bg-neutral-950/60 space-y-2">
   <label className="flex items-center gap-2 text-xs">
    <input type="checkbox" checked={state.lighting.secondarySourceEnabled} disabled={screenLock.disabled} title={screenLock.disabled?screenLock.reasonAr:undefined}
     onChange={e=>updateGlobalSceneState(prev=>({...prev,lighting:{...prev.lighting,secondarySourceEnabled:e.target.checked}}))} className="accent-amber-400"/>
    مصدر ضوء ثانوي
   </label>
   {screenLock.disabled&&<p role="note" className="text-xs text-amber-300">🔒 {screenLock.reasonAr}</p>}
   {reachLock.disabled&&<p className="text-[11px] text-neutral-400" title={reachLock.reasonAr}>قفل مدى الذراع: 30–75 سم للكاميرا الأمامية</p>}
  </div>
  <label className="block text-xs space-y-1">وصف الحركة الخاصة
   <textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={500} rows={2} placeholder="مثال: يميل قليلًا للأمام أثناء تعديل طرف الكم" className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-700"/>
  </label>
  <button onClick={addPoseNotes} disabled={!notes.trim()} className="rounded-lg bg-amber-500 text-neutral-950 px-3 py-2 disabled:opacity-40">تطبيق الحركة</button>
  {state.camera.mode==='front_selfie' && state.pose.selfieArmDistanceCm>70&&<p role="status" className="text-amber-300 text-xs">مسافة بعيدة نسبيًا؛ تحقق من مدى الذراع وزاوية الالتقاط.</p>}
  <p className="text-xs text-neutral-500">هذه ضوابط وصفية وليست محاكاة عظمية أو ضوئية كاملة.</p>
 </section>;
}
