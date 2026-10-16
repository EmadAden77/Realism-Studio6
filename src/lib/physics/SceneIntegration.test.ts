import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {REAL_GARMENTS,applyRealGarment} from '../presets/realWardrobe';
import {assembleMasterPrompt} from '../prompt/promptBuilder';
import {resolvePhysicsState} from './PhysicsEngine';

describe('Clothing and pose integration',()=>{
 it('includes individually selected jacket and footwear in compiled prompt',()=>{
  const jacket=REAL_GARMENTS.find(x=>x.id==='outer_denim_blue');
  const shoes=REAL_GARMENTS.find(x=>x.id==='footwear_sneakers_white');
  assert.ok(jacket&&shoes);
  const withJacket=applyRealGarment(INITIAL_SCENE_STATE,jacket);
  const scene=applyRealGarment(withJacket,shoes);
  const result=assembleMasterPrompt(scene).englishPrompt;
  assert.match(result,/Blue denim trucker jacket/);
  assert.match(result,/Plain white low-top sneakers/);
  assert.match(result,/physically plausible overlap/);
 });
 it('does not force a handheld selfie arm into a third-person shot',()=>{
  const scene={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'third_person_phone' as const}};
  const prompt=assembleMasterPrompt(scene).englishPrompt;
  assert.doesNotMatch(prompt,/handheld selfie arm distance approx/);
 });
 it('enforces screen-only light even when imported outfit and scene state conflict',()=>{
  const scene={...INITIAL_SCENE_STATE,lighting:{...INITIAL_SCENE_STATE.lighting,mode:'phone_screen_only' as const,timeOfDay:'day' as const,secondarySourceEnabled:true}};
  const corrected=resolvePhysicsState(scene).state;
  assert.equal(corrected.lighting.secondarySourceEnabled,false);
  assert.match(assembleMasterPrompt(scene).englishPrompt,/LIGHT CAUSALITY LOCK/);
 });
});
