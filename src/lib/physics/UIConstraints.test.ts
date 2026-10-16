import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {constraintById,getUIConstraints} from './UIConstraints';
import {resolvePhysicsState} from './PhysicsEngine';

describe('Reactive physical UI constraints',()=>{
 it('locks secondary light and daytime when phone screen is the only emitter',()=>{
  const state=resolvePhysicsState({...INITIAL_SCENE_STATE,lighting:{...INITIAL_SCENE_STATE.lighting,mode:'phone_screen_only',secondarySourceEnabled:true}}).state;
  assert.equal(constraintById(state,'secondary_light').disabled,true);
  assert.equal(constraintById(state,'daylight_time').forcedValue,'night');
  assert.equal(state.lighting.secondarySourceEnabled,false);
 });
 it('does not lock extra light for mixed practical sources',()=>{
  const state={...INITIAL_SCENE_STATE,lighting:{...INITIAL_SCENE_STATE.lighting,mode:'mixed_practical' as const}};
  assert.equal(constraintById(state,'secondary_light').disabled,false);
 });
 it('locks fake bokeh only for front-camera capture',()=>{
  const front={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'front_selfie' as const}};
  const rear={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'rear_main_self_capture' as const}};
  assert.equal(constraintById(front,'heavy_bokeh').disabled,true);
  assert.equal(constraintById(rear,'heavy_bokeh').disabled,false);
 });
 it('has unique control IDs',()=>{
  const ids=getUIConstraints(INITIAL_SCENE_STATE).map(x=>x.id);
  assert.equal(new Set(ids).size,ids.length);
 });
});
