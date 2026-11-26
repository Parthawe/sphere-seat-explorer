import {test} from 'node:test';
import assert from 'node:assert/strict';
import source from './canada-geometry.json';
import {circuitModels,findCircuitModel,modelCount,modelPosition,closestTrack} from './circuitSeating';
function inside(point:number[],ring:number[][]){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
test('Canada 2027 retains sale uncertainty, four independent samples and source-only alternatives',()=>{
 const m=circuitModels.canada;assert.equal(findCircuitModel(2027,'canada'),m);assert.equal(findCircuitModel(2026,'canada'),undefined);assert.deepEqual(m.banks.map(b=>b.id),['1','11','15','24']);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),6080);assert.match(m.coverageNote!,/postponed/);assert.match(m.coverageNote!,/waitlist/);assert.match(m.evidence,/2026 identity/);assert.match(m.banks.find(b=>b.id==='11')!.admissionNote!,/limited giant-screen view/);
 for(const b of m.banks){assert.equal(b.footprint,undefined);assert.equal(b.kind,'assigned');assert.equal(b.roof,false);assert.match(b.confidence,/Estimated temporary viewing region/);}
 const p=m.unmappedProducts!;assert.equal(p.length,14);assert.match(p.find(p=>p.id==='general-admission')!.note,/without a reserved chair or grandstand access/);assert.match(p.find(p=>p.id==='accessible')!.source,/accessibility/);assert.match(p.find(p=>p.id==='hospitality')!.note,/No suite, table/);
});
test('Canada GP, water and source envelopes retain independent provenance and clear model positions',()=>{
 assert.equal(source.licence,'ODbL-1.0');assert.equal(source.relation,'284595');assert.deepEqual(source.ways,['136717490']);assert.deepEqual(source.excluded_ways,['413000959']);assert.equal(source.points.length,233);assert.deepEqual(source.points[0],source.points.at(-1));assert.ok(source.length_m>4300&&source.length_m<4430);assert.equal(source.features.filter(f=>f.kind==='unassigned-bleachers').length,5);assert.equal(source.features.filter(f=>f.kind==='water').length,3);assert.ok(source.vegetation.length>0);
 const m=circuitModels.canada;for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){const q=modelPosition(m,{bank:b.id,section,row,seat}),p=[q[0],q[2]],t=closestTrack(m,p);assert.ok(Math.hypot(p[0]-t[0],p[1]-t[1])>15,b.id+' road collision');for(const water of source.features.filter(f=>f.kind==='water'))assert.equal(inside(p,water.points),false,b.id+' in source water');}
});
