import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sampleResearchGrid,validateTerrainResearch} from './lib/spa-terrain.mjs';
test('north/south row orientation, exact corners and meter interpolation remain explicit',()=>{
 const t={bbox:[5,50,6,51],columns:2,rows:2,grid_heights_m:[300,400,500,600]};
 assert.equal(sampleResearchGrid(t,5,51),300);assert.equal(sampleResearchGrid(t,6,50),600);assert.equal(sampleResearchGrid(t,5.5,50.5),450);
 assert.equal(sampleResearchGrid(t,4.9,51),undefined);assert.equal(sampleResearchGrid(t,5,49),undefined);assert.equal(sampleResearchGrid(t,NaN,50),undefined);
 assert.equal(sampleResearchGrid({...t,grid_heights_m:[300,NaN,500,600]},5.5,50.5),undefined);
});
test('partial source samples cannot be treated as a complete terrain field',async()=>{
 const d=JSON.parse(await readFile(new URL('../research/spa/terrain-partial.json',import.meta.url),'utf8'));
 assert.equal(d.status,'partial_research_not_connected_to_scene');assert.throws(()=>validateTerrainResearch(d),/Incomplete research/);
 assert.equal(d.track.points.length,330);assert.equal(d.track.heights_m.length,330);assert.equal(d.track.node_ids[0],d.track.node_ids.at(-1));
 const available=d.track.heights_m.filter(h=>h!==null);assert.ok(available.length>100&&available.length<329);assert.ok(available.every(h=>Number.isFinite(h)&&h>200&&h<800));
 assert.equal(d.terrain.licence,'CC-BY-4.0');assert.equal(d.track.licence,'ODbL-1.0');assert.equal(d.terrain.vertical_reference,'EPSG:5710');
 for(let i=0;i<d.track.points.length;i++){
  const key=d.track.lonlat[i].map(n=>n.toFixed(8)).join(',');assert.equal(d.track.heights_m[i],d.sample_cache[key]??null);
 }
 assert.match(d.stop_reason,/502/);assert.match(d.terrain.modifications,/no full terrain crop/);
});
