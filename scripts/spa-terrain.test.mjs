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
 const available=d.track.heights_m.filter(h=>h!==null);assert.ok(available.length>100&&available.length<=330);assert.ok(available.every(h=>Number.isFinite(h)&&h>200&&h<800));
 assert.equal(d.terrain.licence,'CC-BY-4.0');assert.equal(d.track.licence,'ODbL-1.0');assert.equal(d.terrain.vertical_reference,'EPSG:5710');
 for(let i=0;i<d.track.points.length;i++){
  const key=d.track.lonlat[i].map(n=>n.toFixed(8)).join(',');assert.equal(d.track.heights_m[i],d.sample_cache[key]??null);
 }
 assert.ok(typeof d.stop_reason==='string'&&d.stop_reason.length>0);assert.match(d.terrain.modifications,/no full terrain crop/);
});
test('road profile review exposes missing heights, coincident jumps and steep segments without correction',async()=>{
 const {roadProfileReview}=await import('./lib/spa-terrain.mjs');
 const track={points:[[0,0],[10,0],[10,0],[20,0],[30,0]],heights_m:[300,304,305,null,310]};
 const original=structuredClone(track),issues=roadProfileReview(track);
 assert.deepEqual(issues.map(i=>i.reason),['grade requires source review','height discontinuity at coincident points','missing height','missing height']);assert.deepEqual(track,original);
 assert.deepEqual(roadProfileReview({points:[[0,0],[10,0]],heights_m:[300,301]}),[]);
});
test('complete offline Spa input retains source profile, units and grid coverage',async()=>{
 const {roadProfileReview}=await import('./lib/spa-terrain.mjs');
 const d=JSON.parse(await readFile(new URL('../research/spa/terrain-samples.json',import.meta.url),'utf8'));
 const stats=validateTerrainResearch(d);assert.equal(stats.road_points,330);assert.equal(stats.grid_points,425);
 assert.ok(stats.road_relief_m>99&&stats.road_relief_m<105);assert.deepEqual(roadProfileReview(d.track),[]);
 for(let row=0;row<d.terrain.rows;row++)for(let col=0;col<d.terrain.columns;col++){
  const i=row*d.terrain.columns+col,p=d.terrain.grid_lonlat[i];assert.ok(Math.abs(sampleResearchGrid(d.terrain,...p)-d.terrain.grid_heights_m[i])<.001);
 }
 const reversed=structuredClone(d);reversed.track.points[10][1]*=-1;assert.throws(()=>validateTerrainResearch(reversed),/Projection units/);
 const missing=structuredClone(d);missing.terrain.grid_heights_m[100]=null;assert.throws(()=>validateTerrainResearch(missing),/nodata/);
 const licence=structuredClone(d);licence.track.licence='unknown';assert.throws(()=>validateTerrainResearch(licence),/licences/);
});
