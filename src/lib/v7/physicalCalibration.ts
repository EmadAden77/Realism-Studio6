import type {SceneState} from '../../types/scene';
export interface V7Calibration {
 screenBrightnessPercent:number;
 screenDistanceCm:number;
 roomWear:'ordinary'|'slightly_lived_in'|'tidy';
}
export const V7_DEFAULTS:V7Calibration={screenBrightnessPercent:35,screenDistanceCm:50,roomWear:'ordinary'};
export function getV7(state:SceneState):V7Calibration{
 const cfg=state.v7Calibration;
 return {...V7_DEFAULTS,...cfg,
  screenBrightnessPercent:Math.max(1,Math.min(100,Number(cfg?.screenBrightnessPercent)||35)),
  screenDistanceCm:Math.max(25,Math.min(90,Number(cfg?.screenDistanceCm)||50))
 };
}
export function buildV7CalibrationPrompt(state:SceneState):string{
 const v=getV7(state);
 const notes:string[]=[];
 if(state.environmentCategory==='bedroom'){
  const g=state.bedroomGeometry;
  notes.push('Bedroom geometry lock: an ordinary lived-in home, room dimensions '+g.roomDimensionsM.length+'m by '+g.roomDimensionsM.width+'m by '+g.roomDimensionsM.height+'m; bed '+g.bedDimensionsCm.width+'cm by '+g.bedDimensionsCm.length+'cm. Do not reshape or enlarge the room for style.');
  notes.push(v.roomWear==='tidy'?'Natural tidy bedroom, no staged luxury styling.':v.roomWear==='slightly_lived_in'?'Slightly rumpled daily-use linens and small activity-caused clutter on supported surfaces only.':'Ordinary clean room with minor authentic daily-use asymmetry; no excessive staged disorder.');
 }
 if(state.lighting.mode==='phone_screen_only'){
  notes.push('Only the visible smartphone screen illuminates the subject: screen brightness approximately '+v.screenBrightnessPercent+'% at '+v.screenDistanceCm+'cm, a weak diffuse nearby source, with rapidly declining illumination below the upper chest, deep unfilled room shadows, no ambient rim light, no hidden flash and no falsely illuminated bedding. Brightness percentage describes device setting, not a calibrated lux measurement.');
 }
 return notes.join('\n');
}
