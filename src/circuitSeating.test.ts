import {test} from 'node:test';
import assert from 'node:assert/strict';
import {circuitModels,findCircuitModel,normalizeModelPosition,modelPosition,localModelPosition,modelCount,modelPositionUrl,positionKey} from './circuitSeating';
test('physical circuit and season cannot silently cross Qatar/Bahrain references',()=>{
 assert.equal(findCircuitModel(2026,'qatar')?.id,'qatar');assert.equal(findCircuitModel(2027,'bahrain')?.id,'bahrain');
 assert.equal(findCircuitModel(2026,'bahrain'),undefined);assert.equal(findCircuitModel(2027,'qatar'),undefined);
 assert.notDeepEqual(circuitModels.qatar.track,circuitModels.bahrain.track);
 for(const m of Object.values(circuitModels)){assert.deepEqual(m.track[0],m.track.at(-1));assert.ok(m.length>5000&&m.length<5600);assert.ok(m.track.flat().every(Number.isFinite));}
});
test('all model positions are finite, unique and reachable without claiming ticket IDs',()=>{
 for(const m of Object.values(circuitModels))for(const b of m.banks){const keys=new Set<string>(),coordinates=new Set<string>();
  for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
   const p={bank:b.id,section,row,seat};assert.deepEqual(normalizeModelPosition(m,p),p);const xyz=modelPosition(m,p);assert.ok(xyz.every(Number.isFinite));keys.add(positionKey(p));coordinates.add(xyz.map(n=>n.toFixed(4)).join(':'));
  }
  assert.equal(keys.size,modelCount(b));assert.equal(coordinates.size,modelCount(b));
  const first=localModelPosition(b,{bank:b.id,section:1,row:1,seat:1}),last=localModelPosition(b,{bank:b.id,section:b.sections,row:b.rows,seat:b.seats});assert.ok(last[0]>first[0]);assert.ok(last[1]>first[1]);assert.ok(last[2]<first[2]);
 }
});
test('malformed model positions clamp to their bank and share only public model fields',()=>{
 const m=circuitModels.bahrain,p=normalizeModelPosition(m,{bank:'missing',row:NaN,seat:Infinity,section:-400});assert.equal(p.bank,'main');assert.equal(p.section,1);assert.ok(Number.isFinite(p.row));
 const u=new URL(modelPositionUrl('https://example.com/?ticket=private&seat=99#booking',m,p));assert.equal(u.hash,'');assert.equal(u.searchParams.get('ticket'),null);assert.equal(u.searchParams.get('seat'),null);assert.equal(u.searchParams.get('season'),'2027');assert.equal(u.searchParams.get('race'),'bahrain');assert.equal(u.searchParams.get('screen'),'circuit');
});
test('Qatar admission rules and all sourced Bahrain banks remain separate',()=>{
 const q=circuitModels.qatar;assert.equal(q.banks.find(b=>b.id==='main')?.kind,'assigned');for(const id of ['north','t2','t16'])assert.equal(q.banks.find(b=>b.id===id)?.kind,'free');assert.equal(q.banks.find(b=>b.id==='hill')?.kind,'lawn');
 const b=circuitModels.bahrain;assert.equal(new Set(b.banks.map(b=>b.product)).size,5);assert.equal(b.banks.filter(b=>b.product==='university').length,3);assert.equal(b.banks.filter(b=>b.product==='victory').length,2);assert.ok(b.banks.every(b=>b.confidence.startsWith('OSM footprint')));
});
