import React,{useState} from 'react';
import {useSceneStore} from '../../store/sceneStore';
import {DOMESTIC_SELFIE_OPTIONS,getDomesticSelection,setDomesticChoice,validateDomesticSelection,type DomesticCategory} from '../../lib/domestic/domesticOptions';
const sections:{id:DomesticCategory;label:string}[]=[
 {id:'locations',label:'المكان'}, {id:'angles',label:'الزاوية'}, {id:'poses',label:'الوضعية'},
 {id:'actions',label:'الحركة العفوية'}, {id:'lighting',label:'الإضاءة'}
];
export function DomesticSelfieStudio(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [tab,setTab]=useState<DomesticCategory>('locations');
 const [notice,setNotice]=useState('');
 const current=getDomesticSelection(state);
 const selected=current[tab==='locations'?'location':tab==='angles'?'angle':tab==='poses'?'pose':tab==='actions'?'action':'lighting'];
 const choose=(id:string)=>{
  const next=setDomesticChoice(state,tab,id);
  if(next===state){setNotice('هذا الاختيار يتعارض مع موقع أو زاوية أو وضعية أخرى. عدّل الاختيار السابق أولًا.');return;}
  setNotice('');
  updateGlobalSceneState(()=>next);
 };
 const reset=()=>updateGlobalSceneState(prev=>({...prev,domesticSelection:undefined}));
 return <section dir="rtl" className="studio-panel p-4 space-y-3" aria-label="مكتبة السيلفي المنزلي">
  <div className="flex flex-wrap items-center justify-between gap-2">
   <div><h2 className="text-sm font-bold text-white">المنزل والسيلفي العفوي</h2><p className="text-xs text-neutral-400 mt-1">54 خيارًا واقعيًا، مرتبطًا بمحرك البصريات والتلامس والهوية.</p></div>
   <button onClick={reset} className="rounded-lg border border-neutral-700 py-2 px-3 text-xs text-neutral-300">مسح الخيارات المنزلية</button>
  </div>
  <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="فئات السيلفي المنزلي">{sections.map(x=><button key={x.id} aria-pressed={tab===x.id} onClick={()=>setTab(x.id)} className={'shrink-0 rounded-xl border px-3 py-2.5 text-xs '+(tab===x.id?'border-cyan-500 bg-cyan-500/15 text-cyan-200':'border-neutral-700 bg-neutral-950 text-neutral-300')}>{x.label}</button>)}</nav>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
   {DOMESTIC_SELFIE_OPTIONS[tab].map(x=>{
    const candidate=setDomesticChoice(state,tab,x.id);
    const blocked=candidate===state&&selected!==x.id;
    return <button type="button" key={x.id} disabled={blocked} title={blocked?'تعارض مع الاختيارات الحالية؛ عدّل المكان أو الوضعية أولاً.':x.prompt} aria-pressed={selected===x.id} onClick={()=>choose(x.id)} className={'text-right p-3 border rounded-xl text-xs min-h-16 disabled:opacity-40 disabled:cursor-not-allowed '+(selected===x.id?'border-cyan-400 bg-cyan-500/10 text-white':'border-neutral-700 bg-neutral-950 text-neutral-200 hover:border-cyan-700')}>
     <span className="block font-semibold">{x.label}</span>
     {blocked&&<span className="block text-amber-300 text-[11px] mt-1">🔒 غير متوافق</span>}
    </button>;
   })}
  </div>
  {notice&&<p role="status" className="text-xs text-amber-300">{notice}</p>}
  {validateDomesticSelection(state).map(x=><p key={x} role="alert" className="text-xs text-rose-300">{x}</p>)}
  <p className="text-xs text-neutral-500">خيار العدسة 30 سم لا يُضيف عزلًا قويًا اصطناعيًا. إضاءة النافذة الخلفية لا تُستخدم لإضاءة الوجه دون مصدر أمامي حقيقي.</p>
 </section>;
}
