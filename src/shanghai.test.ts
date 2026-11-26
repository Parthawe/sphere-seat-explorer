import {test} from 'node:test';
import assert from 'node:assert/strict';
import data from './shanghai-geometry.json';
import {circuitModels,findCircuitModel,modelCount,modelPosition,closestTrack} from './circuitSeating';
test('Shanghai 2026 reference cannot become a current 2027 ticket layout',()=>{
 const m=circuitModels.china;assert.equal(findCircuitModel(2026,'china'),m);assert.equal(findCircuitModel(2027,'china'),undefined);assert.deepEqual(m.banks.map(b=>b.id),['a','b','h','k']);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),5760);assert.match(m.coverageNote!,/does not verify 2027/);assert.match(m.evidence,/waitlist/);assert.deepEqual(m.unmappedProducts!.map(p=>p.id),['e','c','f','j','vip']);assert.equal(m.catalogueLabel,'Read the 2026 public event guide');
 for(const b of m.banks){assert.equal(b.kind,'check');assert.equal(b.footprint,undefined);assert.equal(b.roof,b.id==='a');assert.match(b.source,/20260311/);assert.match(b.confidence,/Compact estimated region/);}
 assert.equal(data.source_context.main_grandstand_height_tag,'35');assert.equal(data.source,'https://www.openstreetmap.org/relation/2094941');assert.equal(data.licence,'ODbL-1.0');assert.deepEqual(data.ways,['156328670']);assert.equal(data.points.length,257);assert.ok(data.length_m>5400&&data.length_m<5500);assert.deepEqual(data.points[0],data.points.at(-1));assert.deepEqual(data.features.map(f=>f.id),['107371135','1372223261','1372223262','156341844','156341848','156341851']);
});
test('Shanghai representative positions stay outside the source GP surface',()=>{
 const m=circuitModels.china;for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){const p=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[p[0],p[2]]);assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15,b.id+' intersects source road');}
});

test('Shanghai A sample stays inside its seating-side source wing rather than the envelope void',()=>{
 const polygon=data.features.find(f=>f.id==='107371135')!.points,m=circuitModels.china,b=m.banks.find(b=>b.id==='a')!;
 function inside(x:number,z:number){let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],c=polygon[j];if((a[1]>z)!==(c[1]>z)&&x<(c[0]-a[0])*(z-a[1])/(c[1]-a[1])+a[0])hit=!hit;}return hit;}
 for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){const p=modelPosition(m,{bank:'a',section,row,seat});assert.ok(inside(p[0],p[2]));}
});
