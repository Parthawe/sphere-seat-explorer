import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {replaySample,sectionPasses,type HistoricalRace,type ReplayDriver} from './replayMath';
const data=JSON.parse(readFileSync(new URL('../public/historical/las-vegas-2024-opening.json',import.meta.url),'utf8')) as HistoricalRace;
test('archive contains the full 2024 field and bounded ordered observations',()=>{
 assert.equal(data.session,9644);assert.equal(data.drivers.length,20);assert.equal(new Set(data.drivers.map(d=>d.number)).size,20);
 for(const d of data.drivers){assert.ok(d.samples.length>100);for(let i=1;i<d.samples.length;i++){const p=d.samples[i];assert.ok(p[0]>=d.samples[i-1][0]);assert.ok(p[1]>=0&&p[1]<1);assert.ok(p.every(v=>v===null||Number.isFinite(v)));}}
});
test('interpolation crosses start line forwards and hides missing observations',()=>{
 const driver={samples:[[0,.99,0,0,200],[1,.01,10,20,210],[5,.1,20,30,220]]} as ReplayDriver;
 const p=replaySample(driver,.5)!;assert.ok(p[1]<.001||p[1]>.999);assert.equal(p[2],5);assert.equal(p[3],10);
 assert.equal(replaySample(driver,-1),null);assert.equal(replaySample(driver,6),null);assert.equal(replaySample(driver,3),null);
});
test('passes are chronological and reject large telemetry jumps',()=>{
 const a={number:1,samples:[[0,.95,0,0,100],[1,.01,0,0,100],[2,.02,0,0,110]]} as ReplayDriver;
 const passes=sectionPasses({...data,drivers:[a]},.015);assert.equal(passes.length,1);assert.ok(Math.abs(passes[0].time-1.5)<.00001);
 const real=sectionPasses(data,.15);assert.ok(real.length>=15);assert.ok(real.every((p,i)=>!i||p.time>=real[i-1].time));
});
