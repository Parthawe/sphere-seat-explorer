import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calendars} from './races';
import {raceGuideUrl,standAnchor,venueReferenceData} from './venueReferenceData';
import {venueStandCatalogue} from './standCatalogueData';
import {findCircuitModel} from './circuitSeating';

test('every catalogue option has an exact race/year return link and a unique anchor',()=>{
 for(const race of Object.values(calendars).flat()){
  const entries=venueStandCatalogue(race).entries;
  assert.equal(new Set(entries.map(e=>standAnchor(e.id))).size,entries.length);
  for(const entry of entries){
   const result=venueReferenceData(race,entry.id),url=new URL(raceGuideUrl(race,standAnchor(entry.id)),'https://example.com');
   assert.equal(result.option?.id,entry.id);assert.equal(url.searchParams.get('season'),String(race.season));assert.equal(url.searchParams.get('race'),race.slug);assert.equal(url.hash,'#'+standAnchor(entry.id));
   assert.ok(result.links.some(link=>link.url===entry.source));
  }
 }
});
test('source links are unique https destinations and reports retain original dates and authors',()=>{
 for(const race of Object.values(calendars).flat()){
  const data=venueReferenceData(race);
  assert.equal(new Set(data.links.map(l=>l.url)).size,data.links.length);
  for(const link of data.links)assert.equal(new URL(link.url).protocol,'https:');
  for(const report of data.reports){assert.ok(report.author);assert.ok(report.yearEvidence);assert.ok(report.checked);assert.ok(report.year<race.season);}
 }
});
test('Sakhir attendee reports never appear for the Sepang edition with the Bahrain event name',()=>{
 assert.equal(venueReferenceData({season:2026,slug:'bahrain'}).reports.length,0);
 assert.ok(venueReferenceData({season:2027,slug:'bahrain'}).reports.length>0);
});
test('only exact source product identifiers produce same-area report matches',()=>{
 for(const race of Object.values(calendars).flat()){
  const model=findCircuitModel(race.season,race.slug);
  for(const entry of venueStandCatalogue(race).entries){
   const data=venueReferenceData(race,entry.id);
   if(entry.kind==='source')assert.deepEqual(data.areaReports,[]);
   if(model&&entry.kind==='model'){
    const product=model.banks.find(b=>'model-'+b.id===entry.id)?.product;
    assert.deepEqual(data.areaReports,data.reports.filter(r=>r.areas.includes(product!)));
   }
  }
 }
 assert.equal(venueReferenceData({season:2026,slug:'hungary'},'stand-0').option,undefined);
 assert.equal(venueReferenceData({season:2027,slug:'hungary'},'made-up').option,undefined);
});
