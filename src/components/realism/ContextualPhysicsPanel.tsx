import React from 'react';
import { useSceneStore } from '../../store/sceneStore';
import { getV5, validateV5, V5_DEFAULTS, type V5Context } from '../../lib/v5/contextualPhysics';

const options = {
  handAction: [['none','بدون تفاعل'],['hold_cup','الإمساك بكوب'],['pinch_sleeve','إمساك طرف الكم'],['move_pillow','تحريك الوسادة'],['lift_duvet','رفع البطانية'],['touch_hair','لمس الشعر']],
  climate: [['neutral','طبيعي'],['air_conditioned','غرفة مكيفة'],['warm_humid','حار ورطب'],['after_shower','بعد الاستحمام'],['after_workout','بعد التمرين']],
  reflection: [['none','بدون'],['mirror','مرآة'],['car_glass','زجاج سيارة'],['window','نافذة']],
  promptLength: [['concise','مختصر'],['balanced','متوازن'],['detailed','مفصل']]
} as const;

export function ContextualPhysicsPanel() {
  const { state, updateGlobalSceneState } = useSceneStore();
  const v = getV5(state);
  const change = (patch: Partial<V5Context>) => updateGlobalSceneState(prev => ({
    ...prev, v5Context: { ...V5_DEFAULTS, ...prev.v5Context, ...patch }
  }));
  const warnings = validateV5(state);
  const controls: Array<{key:keyof Pick<V5Context,'handAction'|'climate'|'reflection'|'promptLength'>, title:string}> = [
    {key:'handAction',title:'تفاعل اليد والأشياء'},
    {key:'climate',title:'الحرارة والرطوبة'},
    {key:'reflection',title:'المرآة والزجاج'},
    {key:'promptLength',title:'طول البرومبت'}
  ];
  const toggles: Array<{key:keyof Pick<V5Context,'layeredClothing'|'causalClutter'|'occlusion'|'relationLock'>,title:string}> = [
    {key:'layeredClothing',title:'فيزياء الملابس متعددة الطبقات'},
    {key:'causalClutter',title:'الفوضى المرتبطة بالنشاط'},
    {key:'occlusion',title:'الحجب البصري الطبيعي'},
    {key:'relationLock',title:'ثبات العلاقات بين الأجسام'}
  ];
  return <section dir="rtl" className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
    <header><h3 className="text-base font-bold text-white">محرك الواقعية السياقية V5</h3>
      <p className="text-xs text-neutral-400 mt-1">ربط اليد والأشياء والخامات والانعكاسات بالسبب الفيزيائي، دون تغيير الهوية.</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {controls.map(({key,title})=><label key={key} className="text-xs text-neutral-300 space-y-1 block">
        <span className="font-semibold">{title}</span>
        <select aria-label={title} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white" value={v[key]}
          onChange={e=>change({[key]:e.target.value} as Partial<V5Context>)}>
          {options[key].map(([id,label])=><option key={id} value={id}>{label}</option>)}
        </select>
      </label>)}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {toggles.map(({key,title})=><label key={key} className="flex items-center gap-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200">
        <input type="checkbox" checked={v[key]} onChange={e=>change({[key]:e.target.checked} as Partial<V5Context>)} className="accent-amber-500" />
        {title}
      </label>)}
    </div>
    {warnings.length>0 && <div role="status" className="space-y-1 rounded-lg border border-amber-700/40 bg-amber-950/20 p-3">
      {warnings.map(w=><p key={w.id} className="text-xs text-amber-300">{w.messageAr}</p>)}
    </div>}
    <p className="text-[11px] text-neutral-500">هذه ضوابط اتساق للبرومبت، وليست محاكاة فيزيائية مؤكدة للصورة الناتجة.</p>
  </section>;
}
