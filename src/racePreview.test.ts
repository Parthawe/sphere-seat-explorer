import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {racePreview,racePreviewLink} from './racePreview';
import {calendars} from './races';
import {readRoute} from './routing';
import {raceCoverage} from './raceCoverage';
test('every listed race has its own correct route and a real rendered preview asset',()=>{
 const specs=Object.values(calendars).flat().map(race=>({race,...racePreview(race)}));assert.equal(specs.length,47);
 for(const spec of specs){const route=readRoute(spec.href);assert.equal(route.season,spec.race.season);assert.equal(route.race,spec.race.slug);assert.equal(spec.key.includes('undefined'),false);const file=new URL('../public'+spec.poster,import.meta.url);assert(existsSync(file),spec.poster);assert(readFileSync(file).byteLength>1000);assert.equal(spec.kind==='model',raceCoverage(spec.race.season,spec.race.slug).kind==='model');}
});
test('Malaysia and Sakhir previews stay geographically distinct and Vegas preserves reference year',()=>{
 const a=racePreview(calendars[2026].find(r=>r.slug==='bahrain')!),b=racePreview(calendars[2027].find(r=>r.slug==='bahrain')!);
 assert.equal(a.key,'outline-my-1999');assert.equal(b.key,'model-2027-bahrain');assert.notEqual(a.poster,b.poster);
 const vegas=racePreview(calendars[2027].find(r=>r.slug==='las-vegas')!);assert.equal(vegas.key,'vegas-2026');assert.match(vegas.note,/2026 reference/);
 const japan=racePreview(calendars[2027].find(r=>r.slug==='japan')!);assert.equal(japan.kind,'outline');assert.match(japan.note,/no seating or elevation/);
});

test('inline model cameras keep every track point visible in phone and wide preview panels',async()=>{
 const {circuitModels,circuitPreviewCamera}=await import('./circuitSeating');
 const {PerspectiveCamera,Vector3}=await import('three');
 for(const model of Object.values(circuitModels))for(const aspect of [1,1.25,2.5,3]){
  const view=circuitPreviewCamera(model,aspect),camera=new PerspectiveCamera(45,aspect,10,1000000);
  camera.position.set(...view.eye);camera.lookAt(new Vector3(...view.target));camera.updateMatrixWorld();
  for(let i=0;i<model.track.length;i++){const p=model.track[i],v=new Vector3(p[0],model.trackHeights?.[i]??0,p[1]).project(camera);assert(Number.isFinite(v.x)&&Number.isFinite(v.y));assert(Math.abs(v.x)<1&&Math.abs(v.y)<1,`${model.id} preview crop at aspect ${aspect}`);}
 }
});

test('outline-only editions never offer a seat-exploration action',()=>{
 for(const race of Object.values(calendars).flat()){
  const preview=racePreview(race);
  if(preview.kind==='outline'){
   assert.equal(preview.action,'Explore circuit');assert.match(preview.note,/no seating/);
  }else{
   assert.equal(preview.action,'Explore seats');assert.match(preview.note,/unverified/);
  }
 }
});

test('preview entry preserves the demonstrated camera without inventing seats on outline studies',()=>{
 for(const race of Object.values(calendars).flat())for(const camera of ['circuit','seat'] as const){
  const spec=racePreview(race),params=new URLSearchParams(racePreviewLink(race,camera).slice(1)),route=readRoute('?'+params);
  assert.equal(route.season,race.season);assert.equal(route.race,race.slug);
  if(spec.kind==='model'){assert.equal(params.get('camera'),camera);assert.equal(route.camera,camera);}
  else if(spec.kind==='vegas'){assert(route.seats);assert.equal(params.get('view'),camera);assert.equal(params.get('seat'),'C:12:18');}
  else {assert(route.trackStudy);assert(!params.has('camera'));assert(!params.has('seat'));}
 }
});
