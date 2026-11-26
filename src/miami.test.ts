import {test} from 'node:test';
import assert from 'node:assert/strict';
import source from './miami-geometry.json';
import {circuitModels,findCircuitModel,modelCount,modelPosition,closestTrack} from './circuitSeating';
test('Miami 2027 keeps current families distinct from rotating/team/hospitality and inaccessible context',()=>{
 const m=circuitModels.miami;assert.equal(findCircuitModel(2027,'miami'),m);assert.equal(findCircuitModel(2026,'miami'),undefined);assert.deepEqual(m.banks.map(b=>b.id),['start-finish','turn-1','marina','turn-18']);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),7072);assert.equal(m.groundStyle,'campus');assert.equal(m.vegetationStyle,'palms');
 for(const b of m.banks){assert.equal(b.footprint,undefined);assert.equal(b.kind,'check');assert.equal(b.roof,false);assert.match(b.confidence,/Estimated temporary viewing region/);}
 const p=m.unmappedProducts!;assert.equal(p.length,8);assert.match(p.find(p=>p.id==='grandstand-pass')!.note,/different grandstands/);assert.match(p.find(p=>p.id==='grandstand-plus')!.note,/auto-renewal/);assert.match(p.find(p=>p.id==='north-beach')!.note,/no North Beach seat view/);assert.match(p.find(p=>p.id==='msc-yacht')!.note,/does not certify/);
});
test('Miami uses the full seven-way GP loop rather than the shorter nested MIA route or pit lane',()=>{
 assert.equal(source.licence,'ODbL-1.0');assert.equal(source.points.length,263);assert.deepEqual(source.points[0],source.points.at(-1));assert.equal(source.ways.length,7);assert.ok(source.length_m>5350&&source.length_m<5500);for(const id of source.excluded_ways)assert.ok(!source.ways.includes(id));assert.match(source.route_evidence,/shorter MIA configuration/);assert.ok(source.vegetation.length>300);assert.equal(source.features.find(f=>f.id==='171419981')!.kind,'stadium');assert.equal(source.features.find(f=>f.id==='171419978')!.kind,'pitch');
 const m=circuitModels.miami;for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){const q=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[q[0],q[2]]);assert.ok(Math.hypot(q[0]-t[0],q[2]-t[1])>15,b.id+' intersects road');}
});
