import React,{useState} from 'react';
import {useSceneStore} from '../../store/sceneStore';
import {ALL_SHIRT_PANTS_SETS,SHIRT_PANTS_SETS,applyShirtPantsSet,type ShirtPantsGroup} from '../../lib/presets/shirtPantsSets';
const groups:{id:ShirtPantsGroup;label:string}[]=[
 {id:'smartColorCombos',label:'كلاسيكية وشبه رسمية'},
 {id:'monochromeSets',label:'موحّدة اللون'},
 {id:'casualDenimCombos',label:'كاجوال وجينز وكارجو'}
];
export function ShirtPantsSetsPanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [group,setGroup]=useState<ShirtPantsGroup>('smartColorCombos');
 const [query,setQuery]=useState('');
 const choices=SHIRT_PANTS_SETS[group].filter(x=>(x.label+' '+x.shirt+' '+x.pants).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 return <section dir="rtl" aria-label="أطقم القمصان والبناطيل" className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 space-y-3">
  <div><h3 className="text-sm text-white font-bold">أطقم القمصان والبناطيل المتناسقة</h3><p className="text-xs text-neutral-400 mt-1">{ALL_SHIRT_PANTS_SETS.length} طقمًا جاهزًا، وكل طقم يغيّر القميص والبنطلون معًا مع الحفاظ على الهوية.</p></div>
  <label className="block text-xs text-neutral-300">بحث في الأطقم<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="القميص، البنطلون، اللون..." className="mt-1 block w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white"/></label>
  <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="تصنيفات الأطقم">{groups.map(x=><button type="button" key={x.id} aria-pressed={group===x.id} onClick={()=>setGroup(x.id)} className={'shrink-0 px-3 py-2.5 rounded-xl border text-xs '+(group===x.id?'bg-amber-500 text-neutral-950 font-bold border-amber-500':'border-neutral-700 text-neutral-300')}>{x.label}</button>)}</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{choices.map(x=><button type="button" key={x.id} aria-pressed={state.clothing.activeOutfitPresetId===x.id} onClick={()=>updateGlobalSceneState(prev=>applyShirtPantsSet(prev,x))} className={'text-right rounded-xl border p-3 min-h-16 '+(state.clothing.activeOutfitPresetId===x.id?'border-amber-500 bg-amber-500/10':'border-neutral-700 bg-neutral-950 hover:border-neutral-500')}><span className="text-sm text-white font-semibold block">{x.label}</span><span className="text-xs text-neutral-400 block mt-1" dir="ltr">{x.shirt} + {x.pants}</span></button>)}</div>
  {choices.length===0&&<p role="status" className="text-xs text-neutral-400">لا توجد أطقم مطابقة للبحث.</p>}
 </section>;
}