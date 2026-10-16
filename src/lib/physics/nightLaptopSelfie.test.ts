import {describe,it} from 'node:test';import assert from 'node:assert/strict';
import {INITIAL_SCENE_STATE} from '../presets/data';
import {NIGHT_LAPTOP_SELFIE_RULES,applyNightLaptopPose,validateNightLaptopPose,compileNightLaptopPrompt} from './nightLaptopSelfie';
import {assembleMasterPrompt} from '../prompt/promptBuilder';
import {compileLocalPhysicsPrompt} from '../prompt/localPhysicsCompiler';
describe('night bedroom laptop poses',()=>{
 it('defines 20 distinct poses',()=>{assert.equal(NIGHT_LAPTOP_SELFIE_RULES.poses.length,20);assert.equal(new Set(NIGHT_LAPTOP_SELFIE_RULES.poses.map(x=>x.id)).size,20);});
 it('preserves user identity dimensions and locks',()=>{const s=applyNightLaptopPose(INITIAL_SCENE_STATE,'nl_pose_01');assert.deepEqual(s.identity,INITIAL_SCENE_STATE.identity);assert.equal(s.camera.mode,'front_selfie');assert.equal(s.lighting.timeOfDay,'night');assert.deepEqual(validateNightLaptopPose(s),[]);});
 it('uses mirror mode only with mirror pose',()=>{const s=applyNightLaptopPose(INITIAL_SCENE_STATE,'nl_pose_08');assert.equal(s.camera.mode,'mirror_selfie');assert.match(compileNightLaptopPrompt(s),/Mirror shows geometrically valid/);});
 it('adds laptop to both compilers',()=>{const s=applyNightLaptopPose(INITIAL_SCENE_STATE,'nl_pose_20');assert.match(assembleMasterPrompt(s).englishPrompt,/diminishing screen emission/);assert.match(compileLocalPhysicsPrompt(s),/diminishing screen emission/);});
 it('flags phone-screen-only conflict',()=>{const s=applyNightLaptopPose(INITIAL_SCENE_STATE,'nl_pose_18');assert.ok(validateNightLaptopPose({...s,lighting:{...s.lighting,mode:'phone_screen_only'}}).length>0);});
});