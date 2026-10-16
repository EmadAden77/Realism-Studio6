import React from 'react';
import {useSceneStore} from '../../store/sceneStore';
import {HAIR_PHYSICS_MATRIX} from '../../lib/physics/hairPhysicsMatrix';
export function HairPhysicsPanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const selected=state.hair.selectedPhysicsStyleId||'hair_ref_exact';
 const sides=state.hair.selectedSideId||'side_ref';
 const set=(key:'selectedPhysicsStyleId'|'selectedSideId',value:string)=>updateGlobalSceneState(prev=>({...prev,hair:{...prev.hair,[key]:value,densityLock:true,preventArtificialThickening:true}}));
 return <section dir="rtl" className="space-y-3 rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
  <h2 className="text-sm font-bold text-white">تسريحات الشعر والفيزياء المرجعية</h2>
  <p className="text-xs text-neutral-400 leading-5">16 تسريحة و3 خيارات للجوانب. يُحافظ على الكثافة وخط الشعر المرجعي؛ الخيارات التي تتطلب طولًا أو تموجًا غير ظاهر بالمرجع توصف بوصفها مشروطة، لا يُخترع شعر جديد.</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{HAIR_PHYSICS_MATRIX.styles.map(x=><button type="button" key={x.id} aria-pressed={selected===x.id} onClick={()=>set('selectedPhysicsStyleId',x.id)} className={'text-right p-3 rounded-xl border min-h-14 '+(selected===x.id?'border-amber-400 bg-amber-500/10':'border-neutral-700 bg-neutral-950')}><span className="block text-sm text-neutral-100">{x.label}</span><span className="block text-[11px] text-neutral-500 mt-1">{x.category}</span></button>)}</div>
  <label className="block text-xs text-neutral-300">جوانب الشعر
   <select value={sides} onChange={e=>set('selectedSideId',e.target.value)} className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-700 p-3">{HAIR_PHYSICS_MATRIX.sides.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select>
  </label>
  <p role="note" className="text-xs text-amber-300">🔒 الكثافة، فروة الرأس، الجبهة والصدغان تُؤخذ من المرجع، دون تجميل أو ملء الفراغات.</p>
 </section>;
}