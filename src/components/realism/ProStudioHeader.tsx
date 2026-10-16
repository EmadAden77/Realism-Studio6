import React,{useState} from 'react';
import {Search,Undo2,Redo2,ShieldCheck,AlertTriangle} from 'lucide-react';
import {useSceneStore} from '../../store/sceneStore';
import {calculateIntegrity} from '../../lib/physics/PhysicsEngine';

export function ProStudioHeader(){
 const {state,undo,redo,canUndo,canRedo}=useSceneStore();
 const [query,setQuery]=useState('');
 const result=calculateIntegrity(state);
 const onSearch=(text:string)=>{setQuery(text);document.getElementById('studio-options')?.scrollIntoView({behavior:'smooth',block:'start'});
  window.dispatchEvent(new CustomEvent('realism-studio-filter',{detail:text}));};
 return <header dir="rtl" className="studio-pro-header sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md px-3 sm:px-4 py-3">
  <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 flex-wrap">
   <div className="flex items-center gap-3 min-w-0">
    <span aria-hidden="true" className="w-9 h-9 shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 font-mono font-bold">RS</span>
    <div><h2 className="font-extrabold text-sm text-white">REALISM STUDIO <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-300">PRO ENGINE</span></h2>
     <p className="text-[11px] text-neutral-400 hidden sm:block">بصريات الهاتف، فيزياء المشهد وقفل الهوية</p></div>
   </div>
   <label className="relative flex-1 min-w-[170px] max-w-sm order-3 md:order-none">
    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true"/>
    <span className="sr-only">بحث في إعدادات الاستوديو</span>
    <input type="search" value={query} onChange={e=>onSearch(e.target.value)} placeholder="بحث في الإعدادات..." className="w-full rounded-xl bg-neutral-900 border border-neutral-800 py-2 pl-3 pr-9 text-xs text-white focus:outline-2 focus:outline-amber-500/60"/>
   </label>
   <div className="flex items-center gap-2">
    <span title="المؤشر يحسب فقط القواعد الفيزيائية المبرمجة" className={'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs '+(result.violated?'border-amber-700 text-amber-300':'border-emerald-800 text-emerald-300')}>
     {result.violated?<AlertTriangle size={14}/>:<ShieldCheck size={14}/>}
     {result.active-result.violated}/{result.active} قواعد
    </span>
    <button type="button" onClick={undo} disabled={!canUndo} title="تراجع" aria-label="تراجع" className="p-2 rounded-lg border border-neutral-800 text-neutral-200 disabled:opacity-30"><Undo2 size={16}/></button>
    <button type="button" onClick={redo} disabled={!canRedo} title="إعادة" aria-label="إعادة" className="p-2 rounded-lg border border-neutral-800 text-neutral-200 disabled:opacity-30"><Redo2 size={16}/></button>
   </div>
  </div>
 </header>;
}
