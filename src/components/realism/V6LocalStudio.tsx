import React,{useState} from 'react';
import { useSceneStore } from '../../store/sceneStore';
import { buildShotSequence, checkV6Scene, readV6Outfits, saveV6Outfit, removeV6Outfit, storeV6Sequence, type V6Outfit } from '../../lib/v6/localStudio';

export function V6LocalStudio(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [outfits,setOutfits]=useState<V6Outfit[]>(()=>readV6Outfits());
 const [outfitName,setOutfitName]=useState('');
 const [shots,setShots]=useState(()=>buildShotSequence(state));
 const [active,setActive]=useState(0);
 const [message,setMessage]=useState('');
 const checks=checkV6Scene(state);
 const saveOutfit=()=>{
   const name=outfitName.trim()||'طقم الملابس الحالي';
   setOutfits(saveV6Outfit({id:'outfit_'+Date.now(),name,clothing:structuredClone(state.clothing)}));
   setOutfitName('');setMessage('تم حفظ الطقم محليًا');
 };
 const regenerate=()=>{const next=buildShotSequence(state);setShots(next);storeV6Sequence(next);setActive(0);setMessage('تم إنشاء خمس لقطات اعتمادًا على المشهد الحالي');};
 const applyOutfit=(o:V6Outfit)=>{
   updateGlobalSceneState(p=>({...p,clothing:structuredClone(o.clothing)}));
   setMessage('تم تطبيق الطقم المحفوظ');
 };
 return <section dir="rtl" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 text-sm">
  <div><h2 className="text-base font-bold text-white">مختبر V6 المحلي</h2>
  <p className="text-xs text-neutral-400 mt-1">تسلسل سيلفي، خزانة ملابس شخصية، ومراجعة قواعد المشهد. يعمل دون خادم أو مفاتيح API.</p></div>
  <div className="border border-neutral-800 rounded-xl p-3 space-y-2">
   <h3 className="font-bold">خزانة الملابس الشخصية</h3>
   <div className="flex gap-2">
    <input aria-label="اسم الطقم" placeholder="اسم الطقم الحالي" value={outfitName} onChange={e=>setOutfitName(e.target.value)} className="min-w-0 flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-2 text-white"/>
    <button onClick={saveOutfit} className="px-3 rounded-lg bg-amber-500 text-neutral-950 font-bold">حفظ</button>
   </div>
   {outfits.length===0?<p className="text-neutral-500 text-xs">لا توجد أطقم محفوظة بعد.</p>:<div className="space-y-2">{outfits.map(o=><div className="flex items-center justify-between gap-2 bg-neutral-950 rounded-lg p-2" key={o.id}>
    <span className="truncate">{o.name}</span><div className="flex gap-2">
     <button className="text-amber-400" onClick={()=>applyOutfit(o)}>تطبيق</button>
     <button className="text-red-300" onClick={()=>setOutfits(removeV6Outfit(o.id))}>حذف</button>
    </div></div>)}</div>}
  </div>
  <div className="border border-neutral-800 rounded-xl p-3 space-y-2">
   <div className="flex items-center justify-between gap-2"><h3 className="font-bold">سلسلة من 5 لقطات سيلفي</h3><button onClick={regenerate} className="bg-neutral-700 px-3 py-1.5 rounded-lg">تحديث من المشهد</button></div>
   <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">{shots.map((shot,i)=><button key={shot.id} onClick={()=>setActive(i)} className={'rounded-lg p-2 text-xs border '+(active===i?'bg-amber-500/20 border-amber-500 text-amber-200':'border-neutral-700 text-neutral-300')}>{shot.titleAr}</button>)}</div>
   <textarea readOnly aria-label="برومبت السيلفي" rows={5} value={shots[active]?.prompt||''} dir="ltr" className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-200"/>
   <button onClick={async()=>{try{await navigator.clipboard.writeText(shots[active].prompt);setMessage('تم نسخ برومبت اللقطة');}catch{setMessage('تعذر النسخ في هذا المتصفح');}}} className="bg-amber-500 text-neutral-950 px-3 py-2 font-bold rounded-lg">نسخ برومبت اللقطة</button>
  </div>
  <div className="border border-neutral-800 rounded-xl p-3 space-y-2">
   <h3 className="font-bold">فحص اتساق المشهد</h3>
   {checks.map(c=><p key={c.id} className={'text-xs '+(c.status==='warning'?'text-amber-300':'text-neutral-300')}><span className="font-semibold">{c.status==='pass'?'✓':'⚠'} {c.labelAr}: </span>{c.messageAr}</p>)}
   <p className="text-[11px] text-neutral-500">فحص بنيوي للإعدادات فقط، وليس تحليلًا بصريًا آليًا للصورة.</p>
  </div>
  {message&&<p role="status" className="text-emerald-300 text-xs">{message}</p>}
 </section>;
}
