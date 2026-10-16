import {compileNightLaptopPrompt} from '../physics/nightLaptopSelfie';
import {compileDomesticPrompt} from '../domestic/domesticOptions';
import {compileSelectedHair} from '../physics/hairPhysicsMatrix';
import type {SceneState} from '../../types/scene';
import {resolvePhysicsState,compileMaterialContactPrompt} from '../physics/PhysicsEngine';
import {buildIdentityPrompt,buildClothingAndFabricPrompt,buildCameraPrompt,buildEnvironmentPrompt,buildPosePrompt,buildHairPrompt} from './promptBuilder';

export const LOCAL_PHYSICS_DIRECTIVE='Deterministic on-device prompt compilation. Preserve original identity and physically motivated camera perspective, practical lighting, body contact, and garment behavior. No network calls.';

const replacements:readonly [RegExp,string][]=[
 [/\b(?:photorealistic|hyper-realistic|ultra-realistic)\b/gi,'raw unretouched photograph'],
 [/\b(?:bokeh|blurry background|blurred background)\b/gi,'natural lens depth rendition'],
 [/\b(?:flawless skin|smooth skin|perfect skin|airbrushed)\b/gi,'unretouched natural skin'],
 [/\b(?:cinematic lighting|dramatic lighting|volumetric glow)\b/gi,'lighting from visible practical sources'],
 [/\b(?:masterpiece|best quality|8k|4k|uhd|award-winning|stunning|intricate details)\b/gi,''],
 [/\b(?:studio quality|professional photography)\b/gi,'ordinary smartphone capture']
];
export function sanitizeLocalPhysicsPrompt(value:string):string{
 let result=value;
 for(const [pattern,replacement] of replacements)result=result.replace(pattern,replacement);
 return result.replace(/\s+,/g,',').replace(/,\s*,+/g,',').replace(/\s{2,}/g,' ').trim();
}
export function compileLocalPhysicsPrompt(state:SceneState):string{
 const s=resolvePhysicsState(state).state;
 const optical=s.camera.mode==='front_selfie'
  ?'Xiaomi 15 Ultra front-facing camera, 21mm equivalent f/2.0, close handheld perspective with broad smartphone depth rendition'
  :s.camera.mode==='rear_main_self_capture'
  ?'Xiaomi 15 Ultra rear main camera, 23mm equivalent f/1.63, larger sensor with depth governed by actual subject distance'
  :s.camera.mode==='mirror_selfie'
  ?'smartphone captured through a physically consistent actual mirror reflection'
  :'ordinary third-person smartphone photograph with a supported camera position';
 const light=s.lighting.mode==='phone_screen_only'
  ?'Only the weak nearby phone screen illuminates the upper face at night, with rapid practical falloff toward the torso and a dark background; no invisible fill or face-only HDR'
  :s.lighting.mode==='natural_daylight'
  ?'Natural daylight enters only from plausible openings and determines direction and shadow density'
  :'Lighting follows the selected actual household or outdoor practical sources and shared shadow direction; no invented lights';
 const selected=[
  buildIdentityPrompt(s),buildHairPrompt(s),buildPosePrompt(s),buildClothingAndFabricPrompt(s),
  buildEnvironmentPrompt(s),buildCameraPrompt(s),compileMaterialContactPrompt(s),
  compileSelectedHair(s),compileDomesticPrompt(s),compileNightLaptopPrompt(s)
 ];
 return sanitizeLocalPhysicsPrompt(
  'A candid unretouched mobile photograph. '+optical+'. '+selected.filter(Boolean).join('. ')+'. '+light+
  '. Preserve reference facial structure, hairline, skin tone and natural asymmetries without artificial beautification. Skin detail follows actual exposure and available resolution; never invent freckles, pores or scars.'
 );
}
export async function generateFreeRealismPrompt(scene:SceneState):Promise<string>{
 return compileLocalPhysicsPrompt(scene);
}
