import {test} from 'node:test';
import assert from 'node:assert/strict';
import {austriaAreas,austriaVariants,austriaHopping,austriaOtherOptions,austriaGeography,AUSTRIA_TICKETS} from './austria';
import {findVenue,venueAreaUrl} from './venueRegistry';
import {findCircuitModel} from './circuitSeating';
test('Austria 2027 binds current product groups without inferred chairs, access or previous-season models',()=>{
 const v=findVenue(2027,'austria')!;assert.equal(v.areas,austriaAreas);assert.equal(findVenue(2026,'austria'),undefined);assert.equal(findCircuitModel(2027,'austria'),undefined);assert.equal(v.coverage.seat3d,false);assert.equal(v.comparisonPeriod,'Weekend / Sunday product references');assert.equal(austriaAreas.length,11);assert.match(AUSTRIA_TICKETS,/2027/);
 assert.deepEqual(austriaAreas.filter(a=>a.id.startsWith('red-bull')).map(a=>a.id),['red-bull-a','red-bull-b','red-bull-cde','red-bull-fghi','red-bull-jk','red-bull-lmn']);assert.equal(austriaVariants['start-ziel'].length,2);assert.match(austriaVariants['red-bull-a'][0],/Weekend/);assert.match(austriaAreas.find(a=>a.id==='general-admission')!.kind,/no assigned chair/);assert.match(austriaAreas.find(a=>a.id==='start-ziel')!.description,/Wheelchair and companion/);
 assert.equal(austriaHopping.length,6);assert.deepEqual(austriaHopping[0].days,['Friday: Red Bull H','Saturday: Red Bull A','Sunday: Start-Finish']);assert.equal(austriaOtherOptions.length,17);assert.match(austriaOtherOptions.find(a=>a.id==='reduced')!.note,/not the designated wheelchair/);for(const o of austriaOtherOptions)assert.equal(new URL(o.source).protocol,'https:');
 const url=new URL(venueAreaUrl('https://example.com/?ticket=PRIVATE#PRIVATE',v,'red-bull-jk'));assert.equal(url.searchParams.get('ticket'),null);assert.equal(url.hash,'');assert.equal(url.searchParams.get('season'),'2027');
});
test('Austria GP keeps its own licensed circuit and plan transform, excluding motorcycle and pit branches',()=>{
 const d=austriaGeography;assert.equal(d.relation,'5309181');assert.equal(d.licence,'ODbL-1.0');assert.equal(d.ways.length,14);assert.equal(d.points.length,248);assert.deepEqual(d.points[0],d.points.at(-1));assert.ok(d.length_m>4250&&d.length_m<4400);for(const id of d.excluded_ways)assert.ok(!d.ways.includes(id));assert.match(d.vertical_evidence,/no flat 3D seat view/);assert.ok(d.map_transform.scale>0);for(const a of austriaAreas){assert.match(a.confidence,/Estimated/);for(const p of [a.point,a.label]){assert.ok(p.every(Number.isFinite));assert.ok(p[0]>0&&p[0]<620&&p[1]>0&&p[1]<570);}}
});
