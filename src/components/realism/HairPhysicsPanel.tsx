import React from 'react';
import {HAIR_PHYSICS_MATRIX} from '../../lib/physics/hairPhysicsMatrix';
import {useSceneStore} from '../../store/sceneStore';

type HairSectionProps={
 selectedStyle:string;
 selectedSide:string;
 onSelectStyle:(id:string)=>void;
 onSelectSide:(id:string)=>void;
};

export function HairSection({selectedStyle,selectedSide,onSelectStyle,onSelectSide}:HairSectionProps){
 return (
  <section dir="rtl" aria-label="قسم الشعر والتسريحات الواقعية" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-6 text-white">
   <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
    <div>
     <h2 className="text-lg font-bold flex items-center gap-2"><span aria-hidden="true" className="text-indigo-400">✨</span> قسم الشعر والتسريحات الواقعية</h2>
     <p className="text-xs text-slate-400 mt-1 leading-5">يحافظ على كثافة ومَنبت الشعر الأصلي من الصورة المرجعية مع تغيير اتجاه الخصلات وحركتها وفق طول الشعر الظاهر.</p>
    </div>
    <span className="bg-indigo-500/10 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-500/20">قسم مستقل</span>
   </header>
   <div className="space-y-3">
    <h3 className="text-sm font-semibold text-slate-300">اختر نمط وحركة الشعر:</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
     {HAIR_PHYSICS_MATRIX.styles.map(style=>{
      const active=selectedStyle===style.id;
      return <button type="button" key={style.id} aria-pressed={active} onClick={()=>onSelectStyle(style.id)}
       className={'text-right p-3.5 rounded-xl transition-colors duration-200 border flex flex-col justify-between gap-2 min-h-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 '+(active?'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 text-white':'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300')}>
       <span className="flex items-start justify-between w-full gap-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">{style.category}</span>
        <span aria-hidden="true" className={'w-4 h-4 shrink-0 rounded-full border flex items-center justify-center '+(active?'border-indigo-400 bg-indigo-500':'border-slate-600')}>
         {active&&<span className="w-1.5 h-1.5 rounded-full bg-white"/>}
        </span>
       </span>
       <span className="text-sm font-medium leading-snug">{style.label}</span>
      </button>;
     })}
    </div>
   </div>
   <div className="space-y-3 pt-3 border-t border-slate-800">
    <h3 className="text-sm font-semibold text-slate-300">تحكم في جوانب الشعر والمنبت (Sides & Taper):</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
     {HAIR_PHYSICS_MATRIX.sides.map(side=>{
      const active=selectedSide===side.id;
      return <button type="button" key={side.id} aria-pressed={active} onClick={()=>onSelectSide(side.id)}
       className={'text-right px-4 py-3 rounded-lg text-xs font-medium transition-colors border flex items-center justify-between gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 '+(active?'bg-indigo-600/30 border-indigo-500 text-indigo-200':'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800 text-slate-400')}>
       <span>{side.label}</span><span aria-hidden="true" className={'w-2 h-2 shrink-0 rounded-full '+(active?'bg-indigo-400':'bg-slate-600')}/>
      </button>;
     })}
    </div>
   </div>
   <p role="note" className="text-xs leading-5 text-amber-200 border border-amber-500/20 rounded-lg bg-amber-500/5 p-3">🔒 قفل ثابت: كثافة الشعر، ومنبت الجبهة والصدغين، وتوزيع البصيلات مأخوذة من المرجع فقط. لا إضافة شعر جديد ولا تعديل لملامح الوجه.</p>
  </section>
 );
}

export function HairPhysicsPanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const set=(key:'selectedPhysicsStyleId'|'selectedSideId',value:string)=>{
  updateGlobalSceneState(prev=>({...prev,hair:{...prev.hair,[key]:value,densityLock:true,preventArtificialThickening:true}}));
 };
 return <HairSection
  selectedStyle={state.hair.selectedPhysicsStyleId||'hair_ref_exact'}
  selectedSide={state.hair.selectedSideId||'side_ref'}
  onSelectStyle={id=>set('selectedPhysicsStyleId',id)}
  onSelectSide={id=>set('selectedSideId',id)}
 />;
}
