import React,{useMemo,useState} from 'react';
import {Search,Shirt} from 'lucide-react';
import {useSceneStore} from '../../store/sceneStore';
import {REAL_GARMENTS,applyRealGarment,type WardrobeCategory} from '../../lib/presets/realWardrobe';
const tabs:{id:WardrobeCategory;label:string}[]=[
 {id:'upper',label:'التيشيرتات والقمصان والثياب'},
 {id:'lower',label:'الشورتات والبناطيل'},
 {id:'outer',label:'الجاكيتات والطبقات'},
 {id:'footwear',label:'الأحذية والصنادل'}
];
export function RealWardrobeCatalog(){
 const {state,updateGlobalSceneState}=useSceneStore();
 const [category,setCategory]=useState<WardrobeCategory>('upper');
 const [search,setSearch]=useState('');
 const [showAll,setShowAll]=useState(false);
 const options=useMemo(()=>REAL_GARMENTS.filter(x=>x.category===category&&
  (x.nameAr+' '+x.nameEn+' '+x.colorAr).toLowerCase().includes(search.trim().toLowerCase())),[category,search]);
 const visible=showAll?options:options.slice(0,12);
 const chosen=(item:typeof REAL_GARMENTS[number])=>{
  updateGlobalSceneState(prev=>applyRealGarment(prev,item));
 };
 return <section dir="rtl" className="border border-neutral-800 rounded-2xl bg-neutral-900/70 p-3 sm:p-4 space-y-3" aria-label="مكتبة الملابس الواقعية">
  <div className="flex gap-2 items-start">
   <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Shirt className="w-4 h-4"/></div>
   <div><h3 className="font-bold text-sm text-white">خزانة الملابس الواقعية</h3>
    <p className="text-xs text-neutral-400 leading-5 mt-1">{REAL_GARMENTS.length} قطعة متنوعة بألوان وخامات وقصّات حقيقية. اختر كل قطعة على حدة لبناء طقمك.</p></div>
  </div>
  <label className="relative block">
   <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true"/>
   <span className="sr-only">البحث في الملابس</span>
   <input value={search} onChange={e=>{setSearch(e.target.value);setShowAll(false)}} placeholder="ابحث باسم القطعة أو اللون..." className="w-full rounded-xl bg-neutral-950 border border-neutral-700 pr-10 pl-3 py-3 text-sm focus:border-amber-500 focus:outline-none"/>
  </label>
  <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="تصنيفات الملابس">{tabs.map(tab=><button type="button" key={tab.id} aria-pressed={category===tab.id} onClick={()=>{setCategory(tab.id);setShowAll(false)}} className={'px-3 py-2.5 rounded-xl whitespace-nowrap text-xs border '+(category===tab.id?'bg-amber-500 text-neutral-950 font-bold border-amber-500':'bg-neutral-950 text-neutral-300 border-neutral-700')}>{tab.label}</button>)}</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
   {visible.map(item=>{
    const selected=state.clothing[item.category]?.id===item.id;
    return <button key={item.id} type="button" onClick={()=>chosen(item)} aria-pressed={selected} className={'text-right border rounded-xl p-3 min-h-20 '+(selected?'border-amber-500 bg-amber-500/10':'border-neutral-800 bg-neutral-950 hover:border-neutral-600')}>
     <span className="block font-bold text-sm text-neutral-100">{item.nameAr}</span>
     <span className="block text-xs text-neutral-400 mt-1" dir="ltr">{item.nameEn}</span>
     <span className="block text-[11px] text-neutral-500 mt-1">{item.colorAr} · {item.fit==='relaxed'?'مريح':item.fit==='loose'?'واسع':'طبيعي'} {selected?' · ✓ محدد':''}</span>
    </button>;
   })}
  </div>
  {options.length===0&&<p role="status" className="text-sm text-neutral-400 p-3">لا توجد قطع مطابقة لهذا البحث.</p>}
  {!showAll&&options.length>12&&<button type="button" onClick={()=>setShowAll(true)} className="w-full rounded-xl border border-neutral-700 p-3 text-xs text-amber-400">عرض كل القطع ({options.length})</button>}
  {category==='outer'&&state.clothing.outer&&<button className="text-xs text-rose-300 p-2" onClick={()=>updateGlobalSceneState(prev=>({...prev,clothing:{...prev.clothing,outer:null}}))}>إزالة الجاكيت أو الطبقة الخارجية</button>}
  {category==='footwear'&&state.clothing.footwear&&<button className="text-xs text-rose-300 p-2" onClick={()=>updateGlobalSceneState(prev=>({...prev,clothing:{...prev.clothing,footwear:null}}))}>بدون حذاء</button>}
  <p className="text-[11px] text-neutral-500">تُستخدم الأسماء والخامات في بناء البرومبت، مع استمرار قواعد طيات القماش والتلامس والهوية. لا توجد علامات تجارية مفترضة.</p>
 </section>;
}
