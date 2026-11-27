import{test}from'node:test';import assert from'node:assert/strict';import{existsSync}from'node:fs';
import{calendars}from'./races';import{raceEventFor,sessionDisplay,sessionCalendar}from'./raceEventData';import{circuitLayoutId}from'./circuitLayouts';import profiles from'./driverProfiles.json';
test('all 47 event records retain their edition, source, timezone and independently sourced outline',()=>{
 let count=0;for(const race of Object.values(calendars).flat()){
  const detail=raceEventFor(race);assert(detail);assert.equal(detail.season,race.season);assert.equal(detail.race,race.slug);assert.equal(detail.source,`https://www.formula1.com/en/racing/${race.season}/${race.slug}`);assert.equal(detail.status,'checked');assert.doesNotThrow(()=>new Intl.DateTimeFormat('en',{timeZone:detail.timeZone}));assert(existsSync(new URL(`../public/circuit-plans/${circuitLayoutId(race.season,race.slug)}.svg`,import.meta.url)));
  assert.equal(detail.sessions.length,5);for(const s of detail.sessions){assert(s.date>=race.start&&s.date<=race.end);if(s.start){assert(Number.isFinite(Date.parse(s.start)));if(s.end)assert(Date.parse(s.end)>Date.parse(s.start));}else assert.equal(s.end,null);}
  count++;
 }assert.equal(count,47);assert.equal(raceEventFor({season:2027,slug:'unknown'}),undefined);
});
test('visible 2027 TBC labels override embedded placeholder hours and cannot enter session exports',()=>{
 for(const race of calendars[2027]){const d=raceEventFor(race)!;assert(d.sessions.every(s=>s.status==='tbc'&&s.start===null&&s.end===null));assert(!sessionCalendar(race,d).includes('BEGIN:VEVENT'));assert(d.sessions.every(s=>sessionDisplay(s,'America/New_York').time==='TBC'));}
});
test('Qatar published UTC times convert correctly and Vegas sessions preserve the local date crossing',()=>{
 const q=raceEventFor({season:2026,slug:'qatar'})!,session=q.sessions[0];assert.equal(session.start,'2026-11-27T13:30:00.000Z');assert.deepEqual(sessionDisplay(session,'Asia/Qatar'),{day:'27 Nov',time:'16:30 – 17:30'});assert.deepEqual(sessionDisplay(session,'America/New_York'),{day:'27 Nov',time:'08:30 – 09:30'});
 const v=raceEventFor({season:2026,slug:'las-vegas'})!.sessions[0];assert.equal(sessionDisplay(v,'America/Los_Angeles').day,'19 Nov');assert.notEqual(sessionDisplay(v,'UTC').day,'19 Nov');
});
test('Bahrain testing facts cannot replace the Malaysia race edition or Sakhir year',()=>{
 const a=raceEventFor({season:2026,slug:'bahrain'})!,b=raceEventFor({season:2027,slug:'bahrain'})!;assert.equal(a.timeZone,'Asia/Kuala_Lumpur');assert.equal(a.facts.lengthKm,5.543);assert.equal(b.timeZone,'Asia/Bahrain');assert.equal(b.facts.lengthKm,5.412);assert.equal(b.facts.laps,undefined);assert.equal(b.facts.distanceKm,undefined);
 const china=raceEventFor({season:2026,slug:'china'})!;assert.deepEqual(china.sessions.map(s=>s.name),['Practice 1','Sprint Qualifying','Sprint','Qualifying','Race']);
});
test('session exports contain only confirmed source instants and never invent a race finish',()=>{
 const race=calendars[2026].find(r=>r.slug==='qatar')!,d=raceEventFor(race)!,ical=sessionCalendar(race,d,new Date('2026-11-27T03:00:00Z'));assert.equal((ical.match(/BEGIN:VEVENT/g)||[]).length,5);assert.match(ical,/DTSTART:20261127T133000Z/);assert.match(ical,/DTEND:20261127T143000Z/);const last=ical.split('BEGIN:VEVENT').at(-1)!;assert(!last.includes('DTEND'));assert(!ical.includes('DURATION'));assert(ical.split('\r\n').every(l=>new TextEncoder().encode(l).length<=75));
});
test('driver portraits and source line-up are licensed local assets confined to 2026',()=>{
 assert.equal(profiles.season,2026);assert.equal(profiles.drivers.length,22);assert.equal(new Set(profiles.drivers.map(d=>d.id)).size,22);
 for(const d of profiles.drivers){assert(d.name&&d.team);assert.match(d.source,/^https:\/\/www.formula1.com\/en\/drivers\//);assert(existsSync(new URL(`../public/flags/${d.flag}.svg`,import.meta.url)));assert(d.portrait);assert(existsSync(new URL('../public'+d.portrait.src,import.meta.url)));assert(d.portrait.author&&d.portrait.source);assert(!/NC|ND/.test(d.portrait.license));assert(/CC BY|CC0|Public domain|OGL 3/.test(d.portrait.license));}
});
