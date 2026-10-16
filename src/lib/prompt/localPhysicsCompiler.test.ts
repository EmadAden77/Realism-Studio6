import {describe,it} from 'node:test';import assert from 'node:assert/strict';import {INITIAL_SCENE_STATE} from '../presets/data';import {compileLocalPhysicsPrompt,sanitizeLocalPhysicsPrompt} from './localPhysicsCompiler';
describe('offline prompt engine',()=>{
 it('blocks unwanted styling terms without deleting scientific context',()=>{const x=sanitizeLocalPhysicsPrompt('cinematic lighting, 8k, flawless skin and bokeh');assert.doesNotMatch(x,/cinematic lighting|8k|flawless skin|\bbokeh\b/i);assert.match(x,/natural skin/);});
 it('uses real front camera specs',()=>{const s={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'front_selfie' as const}};const x=compileLocalPhysicsPrompt(s);assert.match(x,/21mm equivalent f\/2.0/);assert.doesNotMatch(x,/Xiaomi 15 Ultra rear main camera/);});
 it('uses separate rear camera specs',()=>{const s={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'rear_main_self_capture' as const}};assert.match(compileLocalPhysicsPrompt(s),/23mm equivalent f\/1.63/);});
 it('prevents invisible light in phone screen only mode',()=>{const s={...INITIAL_SCENE_STATE,lighting:{...INITIAL_SCENE_STATE.lighting,mode:'phone_screen_only' as const}};assert.match(compileLocalPhysicsPrompt(s),/no invisible fill/i);});
 it('includes chosen home location and hair motion in local output',()=>{
  const scene={...INITIAL_SCENE_STATE,domesticSelection:{location:'loc_kitchen_counter',angle:'ang_eye_level'},hair:{...INITIAL_SCENE_STATE.hair,selectedPhysicsStyleId:'hair_bedhead'}};
  const prompt=compileLocalPhysicsPrompt(scene);
  assert.match(prompt,/kettle/);
  assert.match(prompt,/asymmetrically flattened bedhead/);
  assert.match(prompt,/preserve original hairline/);
 });
});
