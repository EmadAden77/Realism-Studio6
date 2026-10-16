import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {SHIRT_PANTS_SETS,ALL_SHIRT_PANTS_SETS,applyShirtPantsSet} from '../presets/shirtPantsSets';
import {assembleMasterPrompt} from '../prompt/promptBuilder';
describe('shirt and pants coordinated sets',()=>{
 it('has 34 unique identifiers across all three groups',()=>{
  assert.equal(SHIRT_PANTS_SETS.smartColorCombos.length,12);
  assert.equal(SHIRT_PANTS_SETS.monochromeSets.length,10);
  assert.equal(SHIRT_PANTS_SETS.casualDenimCombos.length,12);
  assert.equal(new Set(ALL_SHIRT_PANTS_SETS.map(x=>x.id)).size,34);
 });
 it('updates both garments without touching identity',()=>{
  const chosen=ALL_SHIRT_PANTS_SETS.find(x=>x.id==='set_white_navy');assert.ok(chosen);
  const state=applyShirtPantsSet(INITIAL_SCENE_STATE,chosen);
  assert.deepEqual(state.identity,INITIAL_SCENE_STATE.identity);
  assert.equal(state.clothing.upper.material,'medium_cotton');
  assert.equal(state.clothing.lower.material,'heavy_cotton');
  const prompt=assembleMasterPrompt(state).englishPrompt;
  assert.match(prompt,/White cotton button-down shirt/);
  assert.match(prompt,/Tailored navy trousers/);
 });
});