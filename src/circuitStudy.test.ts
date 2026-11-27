import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendars} from './races';
import {circuitLayoutId,validateCircuitLayout} from './circuitLayouts';
import {buildStudyGeometry,sampleStudy,readStudySelection,circuitStudyUrl} from './circuitStudy';
import {readRoute} from './routing';
import {publicPageUrl} from './brand';
const data=JSON.parse(readFileSync(new URL('../public/data/circuit-layouts.json',import.meta.url),'utf8'));
test('every listed edition supports a bounded unitless study and finite camera bases around its own outline',()=>{
 let count=0;
 for(const race of Object.values(calendars).flat()){
  const layout=validateCircuitLayout(data[circuitLayoutId(race.season,race.slug)!],race)!;assert(layout);
  const geometry=buildStudyGeometry(layout);assert(geometry.length>0);assert.deepEqual(geometry.points[0],geometry.points.at(-1));
  assert(geometry.points.every(p=>p.every(v=>Number.isFinite(v)&&Math.abs(v)<=6.000001)));
  for(let sample=0;sample<100;sample+=.5){const at=sampleStudy(geometry,sample);assert([...at.point,...at.normal,...at.tangent].every(Number.isFinite));assert(Math.abs(Math.hypot(...at.tangent)-1)<1e-8);assert(Math.abs(at.tangent[0]*at.normal[0]+at.tangent[1]*at.normal[1])<1e-8);}
  count++;
 }
 assert.equal(count,47);
});
test('study links retain only public sample controls and round-trip their race and season',()=>{
 const race=calendars[2027].find(r=>r.slug==='japan')!,selection={sample:62.5,height:'high' as const,side:'right' as const,camera:'sample' as const};
 const url=circuitStudyUrl(race,selection),route=readRoute(url);assert.equal(route.trackStudy,true);assert.equal(route.race,'japan');assert.equal(route.season,2027);assert.equal(route.seats,false);assert.equal(route.circuit,false);assert.equal(route.layout,false);assert.deepEqual(readStudySelection(url),selection);
 const canonical=new URL(publicPageUrl(url+'&ticket=PRIVATE&utm_source=tracking'));assert.equal(canonical.searchParams.get('sample'),'62.5');assert.equal(canonical.searchParams.get('height'),'high');assert.equal(canonical.searchParams.get('ticket'),null);assert.equal(canonical.searchParams.get('utm_source'),null);
 assert.equal(readRoute('?season=2028&race=japan&screen=track-study').trackStudy,false);
});
test('malformed controls clamp without deriving an actual seat or an unsupported mode',()=>{
 assert.deepEqual(readStudySelection('?sample=Infinity&height=roof&side=unknown&camera=seat'),{sample:12.5,height:'mid',side:'left',camera:'overview'});
 assert.equal(readStudySelection('?sample=-1').sample,0);assert.equal(readStudySelection('?sample=999').sample,99.5);
 const a=buildStudyGeometry(data['my-1999']),b=buildStudyGeometry(data['bh-2002']);assert.notDeepEqual(a.points,b.points);
});
