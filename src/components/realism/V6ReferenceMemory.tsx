import React,{useState} from 'react';
import {useSceneStore} from '../../store/sceneStore';

type Note={id:string;label:string;kind:'identity'|'environment';details:string;};
const KEY='realism_studio_v6_reference_notes';
function load():Note[]{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>typeof x.details==='string'&&typeof x.label==='string'):[];}catch{return []}}
export function V6ReferenceMemory(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [items,setItems]=useState<Note[]>(load);
 const [label,setLabel]=useState('');
 const [kind,setKind]=useState<Note['kind']>('environment');
 const [details,setDetails]=useState('');
 const [notice,setNotice]=useState('');
 const save=()=>{
  if(!details.trim()||!label.trim())return;
  const next=[{id:'note_'+Date.now(),label:label.trim(),kind,details:details.trim()},...items].slice(0,30);
  localStorage.setItem(KEY,JSON.stringify(next));setItems(next);setLabel('');setDetails('');setNotice('تم الحفظ في هذا المتصفح');
 };
 const apply=(item:Note)=>{
  updateGlobalSceneState(prev=>item.kind==='identity'?{
   ...prev,identity:{...prev.identity,customDescription:[prev.identity.customDescription,item.details].filter(Boolean).join('; ')}
  }:{
   ...prev,descriptionInput:[prev.descriptionInput,item.details].filter(Boolean).join('; ')
  });
  setNotice('أُضيفت الملاحظات إلى وصف المشهد. راجعها قبل توليد البرومبت.');
 };
 const remove=(id:string)=>{const next=items.filter(x=>x.id!==id);localStorage.setItem(KEY,JSON.stringify(next));setItems(next)};
 return <section dir="rtl" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
  <h2 className="font-bold">V6: ذاكرة المرجع والمكان</h2>
  <p className="text-xs text-neutral-400">احتفظ بملاحظات مرئية تحققت منها بنفسك حول الغرفة أو الهوية. لا تُحلّل الصور آليًا ولا تحفظ صور الوجه ضمن هذه الملاحظات.</p>
  <div className="grid sm:grid-cols-2 gap-2">
   <input aria-label="اسم المرجع" value={label} onChange={e=>setLabel(e.target.value)} maxLength={80} placeholder="اسم المرجع" className="p-2 bg-neutral-950 border border-neutral-700 rounded-lg"/>
   <select aria-label="نوع المرجع" value={kind} onChange={e=>setKind(e.target.value as Note['kind'])} className="p-2 bg-neutral-950 border border-neutral-700 rounded-lg">
    <option value="environment">المكان والعناصر الثابتة</option><option value="identity">الهوية والسمات المرئية</option>
   </select>
  </div>
  <textarea aria-label="ملاحظات المرجع" rows={3} value={details} onChange={e=>setDetails(e.target.value)} maxLength={1500} placeholder="اكتب فقط التفاصيل المؤكدة: موضع السرير والمصباح، أو ملامح الشعر المرئية..." className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded-lg"/>
  <button disabled={!label.trim()||!details.trim()} onClick={save} className="px-3 py-2 rounded-lg bg-amber-500 text-neutral-950 font-bold disabled:opacity-40">حفظ المرجع</button>
  <div className="space-y-2">{items.map(item=><div key={item.id} className="p-2 border border-neutral-800 rounded-lg">
    <p className="font-semibold text-sm">{item.label} <span className="text-neutral-500 text-xs">({item.kind==='identity'?'هوية':'مكان'})</span></p>
    <p className="text-xs text-neutral-400 break-words my-1">{item.details}</p>
    <div className="flex gap-3 text-xs"><button onClick={()=>apply(item)} className="text-amber-400">تطبيق الملاحظات</button><button onClick={()=>remove(item.id)} className="text-red-300">حذف</button></div>
   </div>)}</div>
  <p className="text-[11px] text-neutral-500">مرجع الهوية الأصلي والقفل الحالي لا يتغيران تلقائيًا. أي ملاحظة جديدة تحتاج مراجعة المستخدم، ولا تؤكد التعرف على الشخص.</p>
  {notice&&<p role="status" className="text-emerald-300 text-xs">{notice}</p>}
 </section>;
}
