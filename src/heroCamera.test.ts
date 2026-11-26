import {test} from 'node:test';import assert from 'node:assert/strict';
import {heroCameraEase,heroCameraPose,HERO_SELECTION} from './heroCamera';
import {seatPosition,seatTarget} from './model';
test('hero seated endpoint preserves the existing model position in all aspect ratios',()=>{
 for(const aspect of [.4,.75,1,1.8,2.5]){const pose=heroCameraPose('seat',aspect);assert.deepEqual(pose.eye,seatPosition(HERO_SELECTION));assert.deepEqual(pose.target,seatTarget(HERO_SELECTION));assert(pose.fov>=72&&pose.fov<=100);assert(heroCameraPose('circuit',aspect).eye.every(Number.isFinite));}
});
test('camera easing is bounded, monotonic and has settled endpoints',()=>{
 assert.equal(heroCameraEase(-1),0);assert.equal(heroCameraEase(2),1);assert.equal(heroCameraEase(.5),.5);
 let previous=0;for(let i=0;i<=100;i++){const value=heroCameraEase(i/100);assert(value>=previous&&value<=1);previous=value;}
 assert(heroCameraEase(.001)<.000001);assert(1-heroCameraEase(.999)<.000001);
});
