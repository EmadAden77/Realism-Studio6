import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {HAIR_PHYSICS_MATRIX,compileHairEngineBlock,compileSelectedHair} from './hairPhysicsMatrix';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {assembleMasterPrompt} from '../prompt/promptBuilder';
describe('reference hair physics',()=>{
 it('has sixteen styles and three side options with unique IDs',()=>{
  assert.equal(HAIR_PHYSICS_MATRIX.styles.length,16);assert.equal(HAIR_PHYSICS_MATRIX.sides.length,3);
  assert.equal(new Set(HAIR_PHYSICS_MATRIX.styles.map(x=>x.id)).size,16);
 });
 it('prevents invented follicles for every hairstyle',()=>{
  for(const x of HAIR_PHYSICS_MATRIX.styles)assert.match(compileHairEngineBlock(x.id),/preserve original hairline/);
 });
 it('compiles user-selected hairstyle into master prompt',()=>{
  const state={...INITIAL_SCENE_STATE,hair:{...INITIAL_SCENE_STATE.hair,selectedPhysicsStyleId:'hair_bedhead',selectedSideId:'side_ref'}};
  assert.match(compileSelectedHair(state),/asymmetrically flattened bedhead/);
  assert.match(assembleMasterPrompt(state).englishPrompt,/asymmetrically flattened bedhead/);
 });
});
