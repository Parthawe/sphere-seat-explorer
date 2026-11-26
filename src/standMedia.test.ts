import {calendars} from './races';
import {findCircuitModel} from './circuitSeating';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {standMediaFor,validVideoId} from './standMediaData';
import {venueStandCatalogue} from './standCatalogueData';

test('organizer media covers every reviewed Suzuka area with exact source identities',()=>{
 const race={slug:'japan',season:2027 as const},stands=standMediaFor(race),catalogue=venueStandCatalogue(race);
 assert.equal(stands.length,19);
 for(const stand of stands){
  const area=catalogue.entries.find(e=>e.id===stand.id);assert.ok(area);assert.equal(stand.source,area.source);
  assert.ok(stand.areaUrl?.includes('area='+stand.id));
  assert.match(stand.capture,/unverified/);
  for(const video of stand.videos)assert.ok(validVideoId(video.id));
  assert.equal(new Set(stand.videos.map(v=>v.id)).size,stand.videos.length);
  for(const photo of stand.photos){assert.equal(new URL(photo.url).hostname,'www.suzukacircuit.jp');assert.ok(photo.sourceLabel);assert.ok(!photo.url.includes('map'));assert.ok(!photo.url.includes('img_seat_'));}
 }
 assert.equal(stands.reduce((n,s)=>n+s.videos.length,0),193);
 assert.equal(stands.reduce((n,s)=>n+s.photos.length,0),157);
 for(const id of ['a2','m','p']){const area=stands.find(s=>s.id===id)!;assert.equal(area.videos.length,0);assert.ok(area.photos.length);}
});
test('Jeddah preserves six products and only the source-reported Central A video match',()=>{
 const stands=standMediaFor({slug:'saudi-arabia',season:2027});assert.equal(stands.length,6);
 for(const stand of stands){assert.equal(stand.photos.length,0);assert.equal(stand.areaUrl,undefined);assert.match(stand.location,/unverified/);}
 const withVideo=stands.filter(s=>s.videos.length);assert.equal(withVideo.length,1);assert.equal(withVideo[0].name,'Central Grandstand A');assert.match(withVideo[0].credit,/Race Experience/);assert.match(withVideo[0].capture,/2025/);assert.ok(validVideoId(withVideo[0].videos[0].id));
});
test('media never silently crosses editions, and invalid embed identifiers are rejected',()=>{
 for(const slug of ['japan','saudi-arabia','bahrain'])assert.deepEqual(standMediaFor({slug,season:2026}),[]);
 assert.equal(standMediaFor({slug:'hungary',season:2027}).length,23);
 assert.equal(validVideoId('not-a-valid-video-id'),false);assert.equal(validVideoId('https://evil.example'),false);
});


test('media browsing exists for every reviewed catalogue, with exact stand identities',()=>{
 for(const race of Object.values(calendars).flat()){
  const catalogue=venueStandCatalogue(race),media=standMediaFor(race);
  for(const entry of catalogue.entries.filter(e=>e.kind!=='source'))assert.ok(media.some(m=>m.id===entry.id),`${race.slug} ${race.season}: ${entry.id}`);
  for(const item of media){assert.ok(catalogue.entries.some(e=>e.id===item.id));for(const clip of item.videos)assert.ok(validVideoId(clip.id));}
 }
});
test('model source products match reports without fuzzy names or venue-only borrowing',()=>{
 for(const race of Object.values(calendars).flat()){
  const model=findCircuitModel(race.season,race.slug);if(!model)continue;
  for(const bank of model.banks){const media=standMediaFor(race).find(m=>m.id==='model-'+bank.id)!;assert.ok(media);for(const r of media.reports??[]){assert.ok(r.areas.includes(bank.product));assert.notEqual(r.match,'venue-only');}}
 }
 const bahrain=standMediaFor({slug:'bahrain',season:2027}).find(m=>m.id==='model-main');assert.ok(bahrain?.videos.some(v=>v.id==='SHWt_z22CSQ'));
 const monza=standMediaFor({slug:'italy',season:2027});assert.equal(monza.filter(m=>m.videos.some(v=>v.id==='EmtmrRn-Ns0')).length,1);
 assert.ok(standMediaFor({slug:'hungary',season:2027}).find(m=>m.id==='stand-0')?.videos.some(v=>v.id==='H-a210pBFGc'));
 assert.equal(standMediaFor({slug:'hungary',season:2027}).find(m=>m.id==='stand-4')?.videos.length,0);
});
