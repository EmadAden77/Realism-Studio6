import React, {useState} from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {ContextualPhysicsPanel} from './ContextualPhysicsPanel';
import {V6LocalStudio} from './V6LocalStudio';
import {V6PoseLightingPanel} from './V6PoseLightingPanel';
import {V6ReferenceMemory} from './V6ReferenceMemory';
import {V7PhysicalCalibrationPanel} from './V7PhysicalCalibrationPanel';

const groups=[
 {id:'essential',title:'01 · المشهد والكاميرا',description:'الوضعية، زاوية السيلفي ومسافة التصوير',tags:'سيلفي كاميرا زاوية وضعية مسافة إضاءة',Component:V6PoseLightingPanel},
 {id:'physics',title:'02 · فيزياء المشهد',description:'تفاعل اليد والخامات والضوء والعناصر',tags:'ضوء خامات شعر تفاعل فيزياء',Component:ContextualPhysicsPanel},
 {id:'room',title:'03 · معايرة المكان والإضاءة',description:'هندسة الغرفة وشاشة الهاتف',tags:'غرفة نوم شاشة هاتف ابعاد هندسة معايرة',Component:V7PhysicalCalibrationPanel},
 {id:'references',title:'04 · ذاكرة الهوية والمكان',description:'ملاحظات مرجعية محفوظة على جهازك',tags:'هوية مرجع ملامح مكان ذاكرة',Component:V6ReferenceMemory},
 {id:'workflow',title:'05 · أدوات الإنتاج',description:'تسلسل اللقطات، الأطقم المحفوظة وفحص الاتساق',tags:'ملابس لقطات برومبت فحص حفظ',Component:V6LocalStudio}
] as const;

export function StudioOptionsOrganizer(){
 const [query,setQuery]=useState('');
 const [opened,setOpened]=useState<string[]>(['essential']);
 const filtered=groups.filter(g=>(g.title+' '+g.description+' '+g.tags).toLowerCase().includes(query.trim().toLowerCase()));
 const toggle=(id:string)=>setOpened(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 return <section dir="rtl" id="studio-options" className="space-y-3" aria-label="إعدادات الواقعية المنظمة">
  <div className="px-1">
   <h2 className="text-lg font-bold text-white">مركز أدوات الواقعية</h2>
   <p className="text-xs text-neutral-400 leading-5 mt-1">خمسة أقسام مرتبة من الإعدادات اليومية إلى الأدوات المتقدمة. جميع وظائف V5–V7 باقية.</p>
  </div>
  <div className="flex flex-col sm:flex-row gap-2">
   <label className="relative flex-1">
    <Search aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"/>
    <span className="sr-only">بحث في الإعدادات</span>
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث: إضاءة، شعر، وضعية، غرفة..." className="w-full rounded-xl border border-neutral-700 bg-neutral-900 pr-10 pl-3 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"/>
   </label>
   <div className="flex gap-2">
    <button onClick={()=>setOpened(groups.map(g=>g.id))} className="min-h-11 flex-1 sm:flex-none rounded-xl border border-neutral-700 px-3 text-xs text-neutral-200">فتح الكل</button>
    <button onClick={()=>setOpened([])} className="min-h-11 flex-1 sm:flex-none rounded-xl border border-neutral-700 px-3 text-xs text-neutral-200">طي الكل</button>
   </div>
  </div>
  <div className="space-y-2">
   {filtered.map((g)=>{
    const active=opened.includes(g.id)||Boolean(query.trim());
    const Body=g.Component;
    return <section key={g.id} className={'rounded-2xl border overflow-hidden '+(active?'border-amber-500/30 bg-neutral-900/50':'border-neutral-800 bg-neutral-900/20')}>
     <button type="button" aria-expanded={active} aria-controls={'studio-section-'+g.id} onClick={()=>toggle(g.id)} className="w-full min-h-16 flex items-center justify-between gap-3 p-4 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
      <span className="min-w-0"><span className="block text-sm font-bold text-white">{g.title}</span><span className="block mt-1 text-xs leading-5 text-neutral-400">{g.description}</span></span>
      <ChevronDown aria-hidden="true" className={'shrink-0 w-5 h-5 text-amber-400 transition-transform '+(active?'rotate-180':'')}/>
     </button>
     {active&&<div id={'studio-section-'+g.id} className="px-2 pb-2 sm:px-3 sm:pb-3"><Body/></div>}
    </section>;
   })}
   {filtered.length===0&&<p className="rounded-xl border border-neutral-800 p-5 text-sm text-neutral-400">لا توجد إعدادات مطابقة. جرّب كلمة أخرى.</p>}
  </div>
 </section>;
}
