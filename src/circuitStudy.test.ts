import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendars} from './races';
import {circuitLayoutId,validateCircuitLayout} from './circuitLayouts';
import {buildStudyGeometry,circuitStudyUrl} from './circuitStudy';
import {readRoute} from './routing';
import {publicPageUrl} from './brand';
import {findVenue} from './venueRegistry';
const data=JSON.parse(readFileSync(new URL('../public/data/circuit-layouts.json',import.meta.url),'utf8'));
test('all 47 editions retain their own bounded source outline without seat coordinates',()=>{
 let count=0;
 for(const race of Object.values(calendars).flat()){
  const layout=validateCircuitLayout(data[circuitLayoutId(race.season,race.slug)!],race)!;assert(layout);
  const geometry=buildStudyGeometry(layout);assert(geometry.length>0);assert.deepEqual(geometry.points[0],geometry.points.at(-1));
  assert(geometry.points.every(p=>p.every(v=>Number.isFinite(v)&&Math.abs(v)<=6.000001)));count++;
 }
 assert.equal(count,47);assert.notDeepEqual(buildStudyGeometry(data['my-1999']).points,buildStudyGeometry(data['bh-2002']).points);
});
test('legacy arbitrary sample links recover to a race overview and strip misleading camera parameters',()=>{
 const old=readRoute('?season=2027&race=japan&screen=track-study&sample=99.5&height=high&side=right&camera=sample');
 assert.equal(old.trackStudy,true);const race=calendars[old.season].find(r=>r.slug===old.race)!;
 const url=circuitStudyUrl(race),route=readRoute(url);assert.equal(route.race,'japan');assert.equal(route.season,2027);assert.equal(route.seats,false);
 const canonical=new URL(publicPageUrl(url+'&ticket=PRIVATE&utm_source=tracking'));
 for(const key of ['sample','height','side','camera','ticket','utm_source'])assert.equal(canonical.searchParams.get(key),null);
 assert.equal(readRoute('?season=2028&race=japan&screen=track-study').trackStudy,false);
});
test('Japan area references remain edition-specific with individual evidence and no exact-seat claim',()=>{
 const venue=findVenue(2027,'japan')!;assert.equal(venue.areas.length,19);assert.equal(venue.coverage.exactSeats,false);assert.equal(venue.coverage.seat3d,false);
 for(const area of venue.areas){assert.match(area.source,/^https:\/\//);assert(area.position);assert(area.confidence);}
 assert.equal(findVenue(2026,'japan'),undefined);
});
