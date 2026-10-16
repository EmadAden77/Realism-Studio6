import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {PHYSICS_RULES_MATRIX,resolvePhysicsState,calculateIntegrity,opticalDiagnostics,compileMechanicalPrompt} from './PhysicsEngine';

describe('Deterministic physics constraints',()=>{
 it('keeps unique, priority ordered constraints',()=>{
  assert.equal(new Set(PHYSICS_RULES_MATRIX.map(x=>x.id)).size,PHYSICS_RULES_MATRIX.length);
  assert.deepEqual([...PHYSICS_RULES_MATRIX].sort((a,b)=>a.priority-b.priority),[...PHYSICS_RULES_MATRIX]);
 });
 it('normalizes front camera optics and forbidden portrait blur',()=>{
  const scene={...INITIAL_SCENE_STATE,camera:{...INITIAL_SCENE_STATE.camera,mode:'front_selfie' as const,focalLengthEquivMm:85,aperture:'f/1.2',lensFlawsSimulation:{...INITIAL_SCENE_STATE.camera.lensFlawsSimulation,noArtificialPortraitBlur:false}}};
  const result=resolvePhysicsState(scene);
  assert.equal(result.state.camera.focalLengthEquivMm,21);
  assert.equal(result.state.camera.aperture,'f/2.0');
  assert.equal(result.state.camera.lensFlawsSimulation.noArtificialPortraitBlur,true);
  assert.equal(calculateIntegrity(result.state).violated,0);
 });
 it('forces screen-only darkness and disables extra light',()=>{
  const scene={...INITIAL_SCENE_STATE,lighting:{...INITIAL_SCENE_STATE.lighting,mode:'phone_screen_only' as const,timeOfDay:'day' as const,secondarySourceEnabled:true}};
  const result=resolvePhysicsState(scene);
  assert.equal(result.state.lighting.timeOfDay,'night');
  assert.equal(result.state.lighting.secondarySourceEnabled,false);
  assert.match(compileMechanicalPrompt(result.state),/no studio fill/);
 });
 it('supports sitting contact and limits reach',()=>{
  const scene={...INITIAL_SCENE_STATE,pose:{...INITIAL_SCENE_STATE.pose,category:'sitting' as const,supportSurface:'unsupported' as const,selfieArmDistanceCm:110}};
  const state=resolvePhysicsState(scene).state;
  assert.notEqual(state.pose.supportSurface,'unsupported');
  assert.equal(state.pose.selfieArmDistanceCm,75);
 });
 it('produces finite near depth of field from optical geometry',()=>{
  const d=opticalDiagnostics(resolvePhysicsState(INITIAL_SCENE_STATE).state);
  assert.ok(Number.isFinite(d.nearCm));
  assert.ok(d.nearCm>0);
 });
 it('is idempotent',()=>{
  const first=resolvePhysicsState(INITIAL_SCENE_STATE).state;
  assert.equal(resolvePhysicsState(first).corrections.length,0);
 });
});
