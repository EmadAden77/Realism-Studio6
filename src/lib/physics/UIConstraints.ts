import type {SceneState} from '../../types/scene';
export type ControlConstraint={id:string;disabled:boolean;reasonAr:string;forcedValue?:string};
export function getUIConstraints(s:SceneState):ControlConstraint[]{
 return [
  {id:'secondary_light',disabled:s.lighting.mode==='phone_screen_only',reasonAr:'الشاشة وحدها مصدر الضوء في هذا النمط، لذلك يُمنع تشغيل مصدر ثانوي.',forcedValue:s.lighting.mode==='phone_screen_only'?'off':undefined},
  {id:'daylight_time',disabled:s.lighting.mode==='phone_screen_only',reasonAr:'وضع الشاشة فقط يقتضي مشهدًا ليليًا بدون ضوء نهاري.',forcedValue:s.lighting.mode==='phone_screen_only'?'night':undefined},
  {id:'heavy_bokeh',disabled:s.camera.mode==='front_selfie',reasonAr:'عدسة الهاتف الأمامية لا تدعم العزل الاصطناعي القوي في النمط البصري الطبيعي.',forcedValue:s.camera.mode==='front_selfie'?'off':undefined},
  {id:'unsupported_seat',disabled:s.pose.category==='sitting'||s.pose.category==='reclining',reasonAr:'الجلوس والاستلقاء يحتاجان سطحًا حقيقيًا يدعم وزن الجسم.'},
  {id:'selfie_overreach',disabled:s.camera.mode==='front_selfie',reasonAr:'المسافة الأكبر من 75 سم تتجاوز حد السيلفي المحمول المعتمد في التطبيق.',forcedValue:s.camera.mode==='front_selfie'?'75 cm maximum':undefined}
 ];
}
export function constraintById(s:SceneState,id:string):ControlConstraint{
 const item=getUIConstraints(s).find(x=>x.id===id);
 if(!item)throw new Error('Unknown control constraint: '+id);
 return item;
}
