import{test}from'node:test';import assert from'node:assert/strict';import{existsSync}from'node:fs';
import{calendars}from'./races';import{racePhotoFor,raceFlagFor,seasonHighlights,seasonCalendarFile,raceStudyLink}from'./raceCards';
import{raceCoverage}from'./raceCoverage';
test('every listed race uses its own local visual, attribution and geographic flag',()=>{
 for(const race of Object.values(calendars).flat()){
  const photo=racePhotoFor(race);assert(photo);assert(photo.author&&photo.license&&photo.capture&&photo.title);assert.match(photo.src,/^\/race-photos\/[a-z-]+\.(jpg|png|svg)$/);assert(existsSync(new URL('../public'+photo.src,import.meta.url)));assert(photo.width>0&&photo.height>0);assert.match(photo.source,/^https:\/\/(commons.wikimedia.org|github.com)\//);assert(photo.licenseUrl.startsWith('https://')||photo.licenseUrl==='/data/circuit-layouts-LICENSE.txt');assert(existsSync(new URL(`../public/flags/${raceFlagFor(race)}.svg`,import.meta.url)));
 }
 const malaysia=calendars[2026].find(r=>r.slug==='bahrain')!,sakhir=calendars[2027].find(r=>r.slug==='bahrain')!;assert.equal(raceFlagFor(malaysia),'my');assert.equal(raceFlagFor(sakhir),'bh');assert.notEqual(racePhotoFor(malaysia).src,racePhotoFor(sakhir).src);assert.equal(racePhotoFor(calendars[2027].find(r=>r.slug==='spain')!).kind,'Destination photo');
 for(const slug of['great-britain','saudi-arabia'])assert.equal(racePhotoFor({season:2027,slug}).kind,'Circuit illustration');
});
test('highlights use the actual most recent race and do not invent a previous race in a future season',()=>{
 const current=seasonHighlights(calendars[2026],'2026-11-26');assert.deepEqual(current.map(h=>h.race.slug),['las-vegas','qatar','united-arab-emirates']);assert.equal(current[0].label,'Previous');assert.equal(seasonHighlights(calendars[2026],'2026-11-27')[1].label,'This weekend');
 const future=seasonHighlights(calendars[2027],'2026-11-26');assert.equal(future[0].label,'Season opener');assert.equal(future[0].race.season,2027);assert.equal(future.some(h=>h.label==='Previous'),false);assert.equal(seasonHighlights([], '2026-11-26').length,0);assert.equal(seasonHighlights(calendars[2026],'2027-01-01').length,1);
});
test('card study links preserve every edition and choose only its supported study type',()=>{
 for(const race of Object.values(calendars).flat()){const url=new URL(raceStudyLink(race),'https://f1tickets.online'),kind=raceCoverage(race.season,race.slug).kind;assert.equal(url.searchParams.get('race'),race.slug);assert.equal(url.searchParams.get('season'),String(race.season));assert.equal(url.searchParams.get('screen'),kind==='model'?'circuit':kind==='reference3d'?'vegas':'track-study');}
});
test('calendar export uses all-day exclusive end dates and valid folded UTF-8 without crossing seasons',()=>{
 const file=seasonCalendarFile([...calendars[2026],...calendars[2027]],2026,new Date('2026-11-27T03:00:00Z'));assert.equal((file.match(/BEGIN:VEVENT/g)||[]).length,23);assert.match(file,/DTSTAMP:20261127T030000Z/);assert.match(file,/DTSTART;VALUE=DATE:20261127\r\nDTEND;VALUE=DATE:20261130/);assert.match(file,/DTSTART;VALUE=DATE:20261204\r\nDTEND;VALUE=DATE:20261207/);assert(!file.includes('UID:2027'));assert(file.split('\r\n').every(line=>new TextEncoder().encode(line).length<=75));assert(file.replace(/\r\n /g,'').includes('Session times and ticket admission vary.'));
});
