import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {DOMESTIC_SELFIE_OPTIONS,setDomesticChoice,compileDomesticPrompt,validateDomesticSelection} from './domesticOptions';
import {assembleMasterPrompt} from '../prompt/promptBuilder';
describe('Domestic selfie catalog',()=>{
 it('keeps identifiers unique within every category',()=>{
  for(const options of Object.values(DOMESTIC_SELFIE_OPTIONS))assert.equal(new Set(options.map(x=>x.id)).size,options.length);
 });
 it('rejects mirror shooting in a non-mirror location',()=>{
  const location=setDomesticChoice(INITIAL_SCENE_STATE,'locations','loc_hallway');
  assert.equal(setDomesticChoice(location,'angles','ang_mirror_screen'),location);
 });
 it('allows mirror shooting at the bathroom mirror',()=>{
  const location=setDomesticChoice(INITIAL_SCENE_STATE,'locations','loc_bathroom_mirror');
  const angle=setDomesticChoice(location,'angles','ang_mirror_screen');
  assert.notEqual(angle,location);
  assert.equal(validateDomesticSelection(angle).length,0);
 });
 it('keeps close selfie depth wide rather than inventing shallow bokeh',()=>{
  const scene=setDomesticChoice(INITIAL_SCENE_STATE,'angles','ang_closeup');
  assert.match(assembleMasterPrompt(scene).englishPrompt,/no creamy artificial bokeh/);
  assert.equal(scene.pose.selfieArmDistanceCm,30);
 });
 it('compiles chosen household details into English',()=>{
  const scene=setDomesticChoice(INITIAL_SCENE_STATE,'locations','loc_kitchen_counter');
  assert.match(compileDomesticPrompt(scene),/kettle/);
 });
 it('blocks glasses adjustment when glasses are disabled',()=>{
  const scene={...INITIAL_SCENE_STATE,eyewear:{...INITIAL_SCENE_STATE.eyewear,mode:'no_glasses' as const}};
  assert.equal(setDomesticChoice(scene,'actions','act_glasses_fix'),scene);
 });
});
