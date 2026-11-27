import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advanceTraffic,createTrafficField} from './raceTraffic';

test('traffic has irregular packs and different pace without overlapping through multiple laps',()=>{
 const field=createTrafficField(.99),original=[...field.positions],minimum=.002;
 assert.equal(field.positions.length,16);
 assert.ok(new Set(field.positions.slice(1).map((p,i)=>((field.positions[i]-p+1)%1).toFixed(3))).size>5);
 for(let frame=0;frame<36000;frame++){
  advanceTraffic(field,1/60,35,minimum,u=>u>.3&&u<.4?.4:1);
  field.positions.forEach((u,i)=>{assert.ok(u>=0&&u<1);const ahead=field.positions[(i+15)%16];assert.ok((ahead-u+1)%1>=minimum-1e-10);});
 }
 assert.notDeepEqual(field.positions,original);
 assert.ok(Math.max(...field.travel)-Math.min(...field.travel)>1e-6);
});
test('zero elapsed time freezes cars and restarting is deterministic',()=>{
 const a=createTrafficField(.3),b=createTrafficField(.3),before=[...a.positions];
 advanceTraffic(a,0,46,.002);assert.deepEqual(a.positions,before);
 for(let frame=0;frame<200;frame++){advanceTraffic(a,.016,46,.002);advanceTraffic(b,.016,46,.002);}
 assert.deepEqual(a,b);
});
test('a resumed tab cannot skip a large portion of a lap',()=>{
 const a=createTrafficField(),b=createTrafficField();advanceTraffic(a,120,35,.002);advanceTraffic(b,.05,35,.002);assert.deepEqual(a,b);
});
