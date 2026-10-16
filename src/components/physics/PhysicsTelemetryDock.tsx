import {compileLocalPhysicsPrompt} from '../../lib/prompt/localPhysicsCompiler';
import React, {useMemo,useState} from 'react';
import {Activity,ShieldCheck,Copy,ChevronDown,LockKeyhole,AlertTriangle} from 'lucide-react';
import {useSceneStore,getLastPhysicsCorrections} from '../../store/sceneStore';
import {getActivePhysicsLocks,calculateIntegrity,opticalDiagnostics,lightDiagnostics} from '../../lib/physics/PhysicsEngine';
import {assembleMasterPrompt} from '../../lib/prompt/promptBuilder';
export function PhysicsTelemetryDock(){
 const {state}=useSceneStore();
 const [showOutput,setShowOutput]=useState(false);
 const [notice,setNotice]=useState('');
 const locks=useMemo(()=>getActivePhysicsLocks(state),[state]);
 const corrections=getLastPhysicsCorrections();
 const integrity=calculateIntegrity(state);
 const optics=opticalDiagnostics(state);
 const light=lightDiagnostics(state);
 const compiled=useMemo(()=>assembleMasterPrompt(state),[state]);
 const localPrompt=useMemo(()=>compileLocalPhysicsPrompt(state),[state]);
 const [outputMode,setOutputMode]=useState<'master'|'local'>('master');
 const textOutput=outputMode==='local'?localPrompt:compiled.englishPrompt+'\n\nNEGATIVE PROMPT:\n'+compiled.negativePrompt;
 const copy=async()=>{try{await navigator.clipboard.writeText(compiled.englishPrompt+'\n\nNEGATIVE PROMPT:\n'+compiled.negativePrompt);setNotice('تم نسخ البرومبت');}catch{setNotice('تعذّر النسخ، يمكنك تحديد النص يدويًا.');}};
 return <aside dir="rtl" aria-label="لوحة مراقبة الفيزياء" className="studio-panel text-sm p-4 space-y-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
  <header className="flex items-center gap-2 border-b border-white/10 pb-3">
   <Activity className="w-4 h-4 text-cyan-400"/><h2 className="font-bold">Live Physics Telemetry</h2>
  </header>
  <div className="flex items-center justify-between gap-2">
   <div><p className="text-xs text-neutral-400">توافق القواعد المفحوصة</p><p className="font-mono text-3xl text-white" dir="ltr">{integrity.score}%</p></div>
   {integrity.violated===0?<ShieldCheck className="text-emerald-400 w-7 h-7"/>:<AlertTriangle className="text-amber-400 w-7 h-7"/>}
  </div>
  <p className="text-xs text-neutral-400 leading-5">فُحصت {integrity.active} قواعد نشطة؛ هذا المؤشر لا يثبت صحة الصورة أو اكتمال كل قوانين الفيزياء.</p>
  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]" dir="ltr">
   <div className="studio-metric"><span>Focal length</span><strong>{state.camera.focalLengthEquivMm}mm eq.</strong></div>
   <div className="studio-metric"><span>Aperture</span><strong>{state.camera.aperture}</strong></div>
   <div className="studio-metric"><span>Subject</span><strong>{optics.subjectCm.toFixed(0)}cm</strong></div>
   <div className="studio-metric"><span>Near DoF</span><strong>{optics.nearCm.toFixed(0)}cm</strong></div>
   <div className="studio-metric"><span>Far DoF</span><strong>{optics.farCm===null?'∞':optics.farCm.toFixed(0)+'cm'}</strong></div>
   <div className="studio-metric"><span>Light ×2 distance</span><strong>{light.relativeIlluminanceAtDoubleDistance.toFixed(2)}×</strong></div>
  </div>
  <p className="text-[11px] leading-5 text-neutral-500">البصريات والإضاءة: تقديرات نموذجية ذات افتراضات وليست قياسات مباشرة للكاميرا أو للمشهد.</p>
  {corrections.length>0&&<section role="status" aria-live="polite" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 space-y-1">
   <h3 className="text-xs font-bold text-amber-200">تصحيح تلقائي للخيارات المتعارضة</h3>
   {corrections.map(c=><p className="text-xs text-amber-100/80 leading-5" key={c.id}>{c.labelAr}: {c.reasonAr}</p>)}
  </section>}
  {state.camera.mode==='front_selfie'&&<label title="العزل الصناعي القوي ليس خيارًا مسموحًا في وضع سيلفي الكاميرا الأمامية" className="flex items-center gap-2 text-xs text-neutral-500 bg-white/5 rounded-lg p-2 border border-white/10">
   <input type="checkbox" disabled checked={false} readOnly className="accent-cyan-400"/> عزل خلفية صناعي قوي (مقفل: بصريات الهاتف الأمامية)
  </label>}
  <section>
   <h3 className="text-xs text-neutral-300 font-bold mb-2">الأقفال النشطة</h3>
   <div className="space-y-1.5">{locks.map(lock=><div title={lock.reasonAr} key={lock.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.035] border border-white/5">
    <LockKeyhole className={'w-3.5 h-3.5 shrink-0 mt-0.5 '+(lock.violated?'text-rose-400':'text-cyan-400')}/>
    <span className="text-xs">{lock.labelAr}<span className="block text-neutral-500 mt-0.5 leading-5">{lock.reasonAr}</span></span>
   </div>)}</div>
  </section>
  <section className="space-y-2">
   <div className="grid grid-cols-2 gap-2" role="group" aria-label="نوع البرومبت">
    <button type="button" aria-pressed={outputMode==='master'} onClick={()=>setOutputMode('master')} className={'rounded-lg p-2 border text-xs '+(outputMode==='master'?'border-cyan-400 text-cyan-200':'border-neutral-700')}>Master كامل</button>
    <button type="button" aria-pressed={outputMode==='local'} onClick={()=>setOutputMode('local')} className={'rounded-lg p-2 border text-xs '+(outputMode==='local'?'border-cyan-400 text-cyan-200':'border-neutral-700')}>Local بدون API</button>
   </div>
   <p className="text-[11px] text-neutral-400">الوضع المحلي يولّد وصفًا مختصرًا بالكامل داخل المتصفح. لا يرسل النص أو الصورة إلى خدمة خارجية.</p>
   <button type="button" aria-expanded={showOutput} onClick={()=>setShowOutput(!showOutput)} className="flex items-center justify-between w-full p-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold">
    <span>Compiled Master Prompt</span><ChevronDown className={'w-4 h-4 transition-transform '+(showOutput?'rotate-180':'')}/>
   </button>
   {showOutput&&<textarea dir="ltr" readOnly aria-label="البرومبت الكامل" value={compiled.englishPrompt+'\n\nNEGATIVE PROMPT:\n'+compiled.negativePrompt} rows={12} className="w-full rounded-lg bg-black/40 text-xs font-mono p-2 border border-white/10 leading-relaxed"/>}
   <button onClick={copy} type="button" className="w-full p-3 min-h-11 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center gap-2"><Copy className="w-4 h-4"/> نسخ البرومبت النهائي</button>
   {notice&&<p role="status" className="text-emerald-300 text-xs">{notice}</p>}
  </section>
 </aside>;
}
