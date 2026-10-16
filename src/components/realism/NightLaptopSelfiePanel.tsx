import React from 'react';
import {useSceneStore} from '../../store/sceneStore';
import {NIGHT_LAPTOP_SELFIE_RULES,applyNightLaptopPose,validateNightLaptopPose} from '../../lib/physics/nightLaptopSelfie';
export function NightLaptopSelfiePanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const errors=validateNightLaptopPose(state);
 return <section dir="rtl" className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-3" aria-label="سيلفي اللابتوب الليلي">
  <h3 className="text-sm font-bold text-white">سيلفي غرفة النوم واللابتوب ليلًا</h3>
  <p className="text-xs text-neutral-400 leading-5">20 وضعية مرتبطة بارتكاز الجسم وحمل الهاتف واتجاه شاشة اللابتوب. يعتمد الطول والوزن وملامح الوجه على مرجعك الحالي، دون تغيير.</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
   {NIGHT_LAPTOP_SELFIE_RULES.poses.map(x=><button type="button" key={x.id} aria-pressed={state.nightLaptopPoseId===x.id}
    onClick={()=>updateGlobalSceneState(prev=>applyNightLaptopPose(prev,x.id))}
    className={'rounded-xl border p-3 text-right min-h-16 text-xs '+(state.nightLaptopPoseId===x.id?'border-amber-500 bg-amber-500/10 text-white':'border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-500')}>
    <span className="font-bold">{x.id.slice(-2)} · {x.nameAr}</span>
   </button>)}
  </div>
  {state.nightLaptopPoseId&&<button type="button" className="border border-neutral-700 rounded-lg py-2 px-3 text-xs" onClick={()=>updateGlobalSceneState(prev=>({...prev,nightLaptopPoseId:undefined}))}>إلغاء وضعية اللابتوب</button>}
  {errors.map(e=><p role="alert" className="text-xs text-amber-300" key={e}>{e}</p>)}
  <p className="text-[11px] text-neutral-500">وضع الشاشة فقط للهاتف غير متوافق مع شاشة لابتوب مضيئة. الإضاءة الدافئة في وضعية 13 تأتي من أباجورة حقيقية فقط.</p>
 </section>;
}