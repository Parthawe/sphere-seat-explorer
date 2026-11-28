import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import data from './venue-context.json';
import {circuitModels} from './circuitSeating';

test('published footprint download matches the scene data and carries its provenance and elevation limits',()=>{
 assert.deepEqual(JSON.parse(readFileSync('public/data/venue-context.json','utf8')),data);
 assert.match(data.licence,/ODbL/);assert.match(data.scope,/no surveyed elevations/);
 for(const [id,venue] of Object.entries(data.venues)){
  assert.match(venue.source,/^https:\/\/api.openstreetmap.org\/api\/0.6\/map\?bbox=/);
  assert.equal(new Set(venue.buildings.map(b=>b.id)).size,venue.buildings.length);
  const model=Object.values(circuitModels).find(m=>m.id===id)!;assert(model);
  for(const b of venue.buildings){
   assert(!model.features.some(f=>f.id===b.id),'Existing stand/landmark must not be drawn twice');
   assert.deepEqual(b.points[0],b.points.at(-1));assert(b.points.length>=4);
   assert(b.points.flat().every(Number.isFinite));assert(b.height>0&&b.height<=12);
   assert.match(b.heightEvidence,/illustrative/);
  }
 }
});
