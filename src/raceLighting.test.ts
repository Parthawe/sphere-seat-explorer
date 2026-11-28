import test from 'node:test';import assert from 'node:assert/strict';
import {calendars} from './races';import {raceLighting,raceLightLabel} from './raceLighting';
import {venueMapLinks,satelliteEmbedUrl} from './venueMaps';
test('all race editions have finite light, schedule evidence or an explicit unconfirmed study',()=>{
 for(const race of Object.values(calendars).flat()){
  const l=raceLighting(race);assert(l.sun.every(Number.isFinite));assert(Math.abs(Math.hypot(...l.sun)-1)<.003);
  if(race.season===2026){assert.equal(l.basis,'schedule');assert(l.start);assert(l.trackTime);assert(l.altitude!==null);}
  else {assert.equal(l.basis,'study');assert.equal(l.start,null);assert.equal(l.trackTime,null);assert.match(raceLightLabel(l),/Time TBC/);}
 }
});
test('published race starts distinguish daylight, low sun, night and local-date rollover',()=>{
 assert.equal(raceLighting({season:2026,slug:'china'}).period,'day');
 assert.equal(raceLighting({season:2026,slug:'qatar'}).period,'night');
 const yas=raceLighting({season:2026,slug:'united-arab-emirates'});assert.equal(yas.period,'dusk');assert.equal(yas.trackTime,'17:00');assert.match(raceLightLabel(yas),/Low sun/);
 assert.equal(raceLighting({season:2026,slug:'united-arab-emirates'},undefined,90).period,'night');
 const vegas=raceLighting({season:2026,slug:'las-vegas'});assert.equal(vegas.trackTime,'20:00');assert(vegas.start!.startsWith('2026-11-22'));
 const malaysia=raceLighting({season:2026,slug:'bahrain'});assert.equal(malaysia.period,'day');assert.equal(malaysia.trackTime,'15:00');
 const sakhir=raceLighting({season:2027,slug:'bahrain'});assert.equal(sakhir.basis,'study');assert.equal(sakhir.period,'night');
});
test('Google venue links preserve physical geography and remain useful without a key',()=>{
 for(const race of Object.values(calendars).flat()){
  const m=venueMapLinks(race)!;assert(m);const satellite=new URL(m.satellite),street=new URL(m.street);assert.equal(satellite.hostname,'www.google.com');assert.equal(satellite.searchParams.get('api'),'1');assert.equal(satellite.searchParams.get('basemap'),'satellite');assert.equal(satellite.searchParams.get('center'),m.center);assert.equal(street.searchParams.get('viewpoint'),m.center);assert.equal(satelliteEmbedUrl(race,undefined),null);assert.equal(satelliteEmbedUrl(race,'invalid'),null);
 }
 const a=venueMapLinks({season:2026,slug:'bahrain'})!,b=venueMapLinks({season:2027,slug:'bahrain'})!;assert(a.location.longitude>100);assert(b.location.longitude<60);assert.notEqual(a.center,b.center);
 const embedded=new URL(satelliteEmbedUrl({season:2026,slug:'qatar'},'AIza'+'x'.repeat(35))!);assert.equal(embedded.pathname,'/maps/embed/v1/view');assert.equal(embedded.searchParams.get('maptype'),'satellite');
});
