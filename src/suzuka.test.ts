import {test} from 'node:test';
import assert from 'node:assert/strict';
import {suzukaAreas,suzukaGeography,suzukaOtherOptions,suzukaSeatGuides} from './suzuka';
import {findVenue,venueAreaUrl} from './venueRegistry';
import {findCircuitModel} from './circuitSeating';
test('Suzuka current area map is isolated to 2027 and does not invent a 3D view',()=>{
 const v=findVenue(2027,'japan')!;assert.equal(v.circuitId,'suzuka');assert.equal(v.areas,suzukaAreas);assert.equal(findVenue(2026,'japan'),undefined);assert.equal(findCircuitModel(2027,'japan'),undefined);assert.equal(v.coverage.exactSeats,false);assert.equal(v.coverage.seat3d,false);
 const expected=['v1','v2','a1','a2','b1','b2','c','d','e','g','h','i','m','o','p','q1','q2','r','s'];assert.deepEqual(suzukaAreas.map(a=>a.id),expected);
 for(const a of suzukaAreas){assert.equal(new URL(a.source).hostname,'www.suzukacircuit.jp');assert.ok(a.point.every(Number.isFinite));assert.ok(a.label.every(Number.isFinite));assert.ok(a.point[0]>0&&a.point[0]<620&&a.point[1]>0&&a.point[1]<570);assert.match(a.confidence,/Estimated/);}
 assert.notEqual(suzukaAreas[0].source,suzukaAreas[1].source);assert.match(suzukaAreas.find(a=>a.id==='q1')!.description,/Q1-1.*Q1-2/);assert.match(suzukaAreas.find(a=>a.id==='s')!.description,/S-BOX/);
 const url=new URL(venueAreaUrl('https://example.com/?ticket=PRIVATE#PRIVATE',v,'v2'));assert.equal(url.searchParams.get('area'),'v2');assert.equal(url.searchParams.get('ticket'),null);assert.equal(url.hash,'');
});
test('Suzuka source GP closes without the pit lane and preserves crossover ordering without fake heights',()=>{
 const d=suzukaGeography;assert.equal(d.source,'https://www.openstreetmap.org/relation/284570');assert.equal(d.licence,'ODbL-1.0');assert.equal(d.ways.length,40);assert.equal(d.points.length,269);assert.deepEqual(d.points[0],d.points.at(-1));assert.ok(d.length_m>5750&&d.length_m<5900);assert.ok(!d.ways.includes('120917578'));assert.equal(d.grade_separation.upper_way,'175231434');assert.equal(d.grade_separation.lower_way,'183391655');assert.match(d.grade_separation.evidence,/no measured clearance/);
 assert.deepEqual(suzukaOtherOptions.map(o=>o.id),['west','wheel','camera','fwl','vip','rbox','paddock','champions','thursday','thursday-friday','zero']);assert.ok(!suzukaAreas.some(a=>a.id==='west'||a.id==='wheel'));assert.match(suzukaOtherOptions.find(o=>o.id==='wheel')!.note,/do not certify/);
});


test('Suzuka first-sector seat references keep separate original charts without inventing chair coordinates',()=>{
 assert.deepEqual(Object.keys(suzukaSeatGuides),['v1','v2','a1','a2','b1','b2']);
 const urls=new Set<string>();for(const [id,g] of Object.entries(suzukaSeatGuides)){assert.ok(g);assert.ok(suzukaAreas.some(a=>a.id===id));const u=new URL(g.diagram);assert.equal(u.hostname,'www.suzukacircuit.jp');assert.equal(u.pathname,'/f1/ticket/images/seat/pdf/f1_'+id+'.pdf');assert.ok(!urls.has(g.diagram));urls.add(g.diagram);assert.ok(g.note);}
 assert.equal(suzukaSeatGuides.h,undefined);assert.match(suzukaSeatGuides.b1!.note,/fences, signs and structures/);assert.match(suzukaSeatGuides.v2!.note,/V2-1 through V2-9/);
});
