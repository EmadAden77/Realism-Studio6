import React, {useState} from 'react';
import {useSceneStore} from '../../store/sceneStore';

const failureModes=[
 {id:'identity',ar:'تغير ملامح الوجه',en:'Restore the original facial identity from the supplied reference without reshaping skull, eyes, nose, jaw, beard, skin tone or age.'},
 {id:'hair',ar:'تكثيف أو شعر اصطناعي',en:'Preserve exactly the reference hairline and existing density; do not fill sparse temples or invent strands.'},
 {id:'lighting',ar:'إضاءة غير منطقية',en:'Remove unmotivated fill and rim lighting. Recalculate shadows and brightness only from existing physical sources.'},
 {id:'arm',ar:'تشوه الذراع أو اليد',en:'Correct arm reach, shoulders, elbows, wrists and finger contacts; phone and free-hand objects must be anatomically plausible.'},
 {id:'fabric',ar:'قماش بلاستيكي أو طيات غير طبيعية',en:'Restore genuine matte fabric weave, gravity folds, seam tension and contact compression, without synthetic gloss.'},
 {id:'room',ar:'تغير هندسة المكان',en:'Keep original furniture layout and all persistent environmental objects unchanged; no invented architecture.'},
 {id:'camera',ar:'زاوية أو منظور غير واقعي',en:'Correct the true 21mm-equivalent smartphone selfie perspective and handheld reach; prohibit portrait bokeh and studio optics.'}
] as const;

export function V6ManualImageReview(){
 const {state}=useSceneStore();
 const [selected,setSelected]=useState<string[]>([]);
 const [note,setNote]=useState('');
 const [message,setMessage]=useState('');
 const toggle=(id:string)=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const corrections=failureModes.filter(x=>selected.includes(x.id)).map(x=>x.en);
 const text= [
 'EDIT THE SAME IMAGE; DO NOT REGENERATE AN UNRELATED SCENE.',
 'Preserve subject identity, original composition, wardrobe, location, spatial relationships and lighting unless an explicitly listed issue requires a change.',
 ...corrections,
 note.trim()?('User-observed issue: '+note.trim()):'',
 'Apply one coherent camera/imaging pipeline, with authentic unfiltered skin, hair and fabrics. Do not invent new facial features.'
 ].filter(Boolean).join('\n');
 return <section dir="rtl" className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 mt-4 space-y-3">
  <h3 className="font-bold text-sm">V6: تصحيح الصورة حسب الأخطاء التي شاهدتها</h3>
  <p className="text-xs text-neutral-400">أنت تختار العيوب المرئية بنفسك؛ التطبيق لا يدّعي كشفها آليًا. تُنتج تعليمات تعديل للصورة نفسها.</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{failureModes.map(f=><label key={f.id} className="flex gap-2 items-center text-xs bg-neutral-950 border border-neutral-800 rounded-lg p-2">
   <input type="checkbox" checked={selected.includes(f.id)} onChange={()=>toggle(f.id)} className="accent-amber-500"/>{f.ar}
  </label>)}</div>
  <textarea aria-label="وصف الخطأ" rows={2} maxLength={600} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs" placeholder="صف الخطأ الذي لاحظته، دون تغيير تفاصيل الهوية المقفلة" value={note} onChange={e=>setNote(e.target.value)}/>
  <textarea aria-label="تعليمات التصحيح" dir="ltr" rows={7} readOnly value={text} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs"/>
  <button className="bg-amber-500 rounded-lg px-3 py-2 text-neutral-950 font-bold text-xs" onClick={async()=>{try{await navigator.clipboard.writeText(text);setMessage('تم نسخ تعليمات التصحيح');}catch{setMessage('تعذر النسخ');}}}>نسخ تعليمات التصحيح</button>
  {message&&<p role="status" className="text-xs text-emerald-400">{message}</p>}
  <p className="text-[11px] text-neutral-500">المشهد الحالي: {state.title}. هذه تعليمات نصية فقط؛ لا تُعدل الصورة داخل التطبيق.</p>
 </section>;
}
