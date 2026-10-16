import React from 'react';
import {useSceneStore} from '../../store/sceneStore';
import {getV7,type V7Calibration} from '../../lib/v7/physicalCalibration';

export function V7PhysicalCalibrationPanel(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const settings=getV7(state);
 const patch=(update:Partial<V7Calibration>)=>updateGlobalSceneState(prev=>({
   ...prev,v7Calibration:{...getV7(prev),...update}
 }));
 const changeRoom=(field:'length'|'width'|'height',value:number)=>updateGlobalSceneState(prev=>({
   ...prev,bedroomGeometry:{...prev.bedroomGeometry,
     roomDimensionsM:{...prev.bedroomGeometry.roomDimensionsM,[field]:value}}
 }));
 const room=state.bedroomGeometry.roomDimensionsM;
 return <section dir="rtl" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
  <div><h2 className="text-base font-bold">V7: المعايرة الفيزيائية للمكان والضوء</h2>
   <p className="text-xs text-neutral-400">ضوابط وصفية تحفظ هندسة الغرفة وتضيف قيود الإضاءة إلى البرومبت. لا تزعم محاكاة إشعاعية دقيقة.</p></div>
  <div className="grid grid-cols-3 gap-2">{(['length','width','height'] as const).map((axis,i)=>
   <label key={axis} className="text-xs text-neutral-300">{['الطول (م)','العرض (م)','الارتفاع (م)'][i]}
    <input type="number" step=".1" min="2" max="12" value={room[axis]} onChange={e=>{const n=Number(e.target.value);if(Number.isFinite(n)&&n>=2&&n<=12)changeRoom(axis,n);}} className="w-full mt-1 bg-neutral-950 border border-neutral-700 rounded p-2"/>
   </label>)}</div>
  <label className="block text-xs">طبيعة الغرفة
   <select className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 mt-1" value={settings.roomWear} onChange={e=>patch({roomWear:e.target.value as V7Calibration['roomWear']})}>
    <option value="ordinary">عادية مع تفاصيل يومية</option><option value="slightly_lived_in">مستخدمة مع تجاعيد خفيفة</option><option value="tidy">مرتبة طبيعيًا</option>
   </select>
  </label>
  <label className="block text-xs">سطوع شاشة الهاتف التقريبي: {settings.screenBrightnessPercent}%
   <input type="range" min="1" max="100" value={settings.screenBrightnessPercent} onChange={e=>patch({screenBrightnessPercent:Number(e.target.value)})} className="w-full accent-amber-500 mt-2"/>
  </label>
  <label className="block text-xs">المسافة بين الشاشة والوجه: {settings.screenDistanceCm} سم
   <input type="range" min="25" max="90" value={settings.screenDistanceCm} onChange={e=>patch({screenDistanceCm:Number(e.target.value)})} className="w-full accent-amber-500 mt-2"/>
  </label>
  {state.lighting.mode!=='phone_screen_only'&&<p className="text-xs text-amber-300">إعدادا الشاشة محفوظان، لكن تأثيرهما لا يطبق في البرومبت إلا عند اختيار «إضاءة الشاشة فقط».</p>}
  <p className="text-xs text-neutral-500">لا تُضاف مصادر ضوء غير موجودة، ولا يتم تعديل هوية الشخص أو كثافة شعره.</p>
 </section>;
}
