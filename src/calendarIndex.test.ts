import test from 'node:test';
import assert from 'node:assert/strict';
import index from './calendarIndex.json';
import {calendarEntryFor,matchesCalendarSearch} from './calendarIndex';
import {calendars} from './races';
import {circuitGuideFor,matchesCircuitSearch} from './circuitGuides';
import {findCircuitModel} from './circuitSeating';
import {findVenue} from './venueRegistry';

test('light calendar metadata preserves every race edition and its source-backed coverage',()=>{
  const races=Object.values(calendars).flat();
  assert.equal(Object.keys(index).length,races.length);
  for(const race of races){
    const entry=calendarEntryFor(race.season,race.slug)!,model=findCircuitModel(race.season,race.slug),venue=findVenue(race.season,race.slug);
    assert.ok(entry,`${race.season}:${race.slug}`);
    assert.equal(entry.venue,circuitGuideFor(race.season,race.slug)?.venue??null);
    assert.deepEqual(entry.model,model?{country:model.country,season:model.season,banks:model.banks.length}:null);
    assert.equal(entry.areaMap,!!venue);
    const points=model?.track??venue?.geography.points;
    assert.equal(!!entry.outline,!!points?.length,'No borrowed thumbnail for an unsupported edition');
    if(entry.outline){
      const pairs=[...entry.outline.matchAll(/[ML]([\d.]+),([\d.]+)/g)];
      assert.equal(pairs.length,points!.length,'Thumbnail retains its original geometry samples');
      for(const [,x,y]of pairs){assert.ok(Number(x)>=6.9&&Number(x)<=93.1);assert.ok(Number(y)>=6.9&&Number(y)<=57.1);}
    }
  }
});
test('light search retains accent, city, venue and case behavior without loading the guide',()=>{
  for(const race of Object.values(calendars).flat()){
    const guide=circuitGuideFor(race.season,race.slug)!;
    const queries=['',race.name,race.slug,guide.id,guide.venue,guide.location,'Sao Paulo','Montréal','Suzuka','Singapore','sakhir','sepang','DOES NOT EXIST'];
    for(const q of queries)for(const query of [q,`  ${q.toUpperCase()}  `])assert.equal(matchesCalendarSearch(race,query),matchesCircuitSearch(race,query),`${race.season} ${race.slug}: ${query}`);
  }
});
test('light lookup does not transfer models or geography between seasons',()=>{
  assert.equal(calendarEntryFor(2026,'bahrain')?.model,null);
  assert.match(calendarEntryFor(2026,'bahrain')!.venue!,/Sepang/);
  assert.match(calendarEntryFor(2027,'bahrain')!.venue!,/Bahrain/);
  assert.equal(calendarEntryFor(2027,'china')?.model,null);
  assert.equal(calendarEntryFor(2026,'china')?.model?.season,2026);
  assert.equal(calendarEntryFor(2025,'qatar'),undefined);
  assert.equal(calendarEntryFor(2027,'unknown'),undefined);
});
