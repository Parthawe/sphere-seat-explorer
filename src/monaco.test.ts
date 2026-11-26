import {test} from 'node:test';
import assert from 'node:assert/strict';
import {monacoAreas,monacoVariants,monacoOtherOptions,monacoGeography,MONACO_BUY} from './monaco';
import {findVenue,venueAreaUrl} from './venueRegistry';
import {findCircuitModel} from './circuitSeating';
test('Monaco 2027 retains current families, Gold/tier categories and unnumbered standing without borrowed views',()=>{
 const v=findVenue(2027,'monaco')!;assert.equal(v.durationDays,4);assert.equal(v.comparisonPeriod,'Day-specific ticket categories');assert.equal(v.areas,monacoAreas);assert.equal(findVenue(2026,'monaco'),undefined);assert.equal(findCircuitModel(2027,'monaco'),undefined);
 assert.deepEqual(monacoAreas.map(a=>a.id),['a','b','e','k','l','n','o','p','t','v','z','rocher']);assert.equal(Object.values(monacoVariants).reduce((n,a)=>n+a.length,0),20);
 for(const id of ['z','rocher'])assert.match(monacoAreas.find(a=>a.id===id)!.kind,/Standing.*unnumbered/);
 assert.deepEqual(monacoVariants.k,['K1–K2','K3–K4–K5–K6','K-GOLD']);assert.equal(monacoVariants.o.length,2);assert.equal(monacoVariants.t.length,3);assert.equal(monacoOtherOptions.length,6);assert.ok(!monacoAreas.some(a=>a.id==='x-pmr'||a.id==='chiron'));assert.ok(monacoOtherOptions.every(o=>new URL(o.source).protocol==='https:'));
 const u=new URL(venueAreaUrl('https://example.com/?ticket=PRIVATE#PRIVATE',v,'k'));assert.equal(u.searchParams.get('ticket'),null);assert.equal(u.hash,'');assert.equal(u.searchParams.get('season'),'2027');assert.match(MONACO_BUY,/2027/);
});
test('Monaco street interpretation closes through explicit source-node adaptations without pit branches',()=>{
 const d=monacoGeography;assert.equal(d.source,'https://www.openstreetmap.org/relation/148194');assert.equal(d.licence,'ODbL-1.0');assert.equal(d.ways.length,41);assert.equal(d.points.length,416);assert.deepEqual(d.points[0],d.points.at(-1));assert.ok(d.length_m>3250&&d.length_m<3400);for(const id of d.excluded_ways)assert.ok(!d.ways.includes(id));assert.equal(d.route_adaptations.length,2);assert.ok(d.ways.includes('35092475'));assert.equal(d.water_sources.length,13);assert.deepEqual(d.water[0],d.water.at(-1));assert.match(d.water_evidence,/authored seaward closure/);
 assert.ok(d.segments.find(s=>s.id==='39839529')!.mapCenter[1]>430,'first segment metadata must not alias the whole route');
 assert.equal(d.segments.filter(s=>s.tunnel).length,3);assert.ok(d.points.flat().every(Number.isFinite));for(const a of monacoAreas){assert.ok(a.point.every(Number.isFinite));assert.ok(a.point[0]>0&&a.point[0]<620&&a.point[1]>0&&a.point[1]<570);assert.match(a.confidence,/Estimated/);}
});
