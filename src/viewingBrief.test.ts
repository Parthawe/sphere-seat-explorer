import test from 'node:test';
import assert from 'node:assert/strict';
import { calendars } from './races';
import { circuitGuideFor } from './circuitGuides';
import { bookingChecks, buildViewingBrief } from './viewingBrief';

test('race briefs preserve venue and season boundaries and exclude unsupported user strings', () => {
  for (const season of [2026, 2027] as const) {
    const race = calendars[season].find(r => r.slug === 'bahrain')!;
    const guide = circuitGuideFor(season, race.slug)!;
    const brief = buildViewingBrief(race, [guide.viewing[0].name, 'PRIVATE-TICKET-123'], [0]);
    assert.ok(brief.includes(guide.venue));
    assert.ok(brief.includes(`${race.start} to ${race.end}`));
    assert.ok(brief.includes(guide.viewing[0].detail));
    assert.ok(!brief.includes('PRIVATE-TICKET-123'));
    const link=brief.split('\n').find(line=>line.startsWith('Race guide: '))!.slice('Race guide: '.length);
    const url=new URL(link);assert.equal(url.origin,'https://f1tickets.online');assert.equal(url.searchParams.get('season'),String(season));assert.equal(url.searchParams.get('race'),race.slug);assert.equal([...url.searchParams].length,2);
    assert.ok(brief.includes(`[Marked checked by you] ${bookingChecks[0]}`));
    assert.ok(brief.includes(`[To confirm] ${bookingChecks[1]}`));
    if (season === 2026) assert.ok(brief.split('\n')[1].startsWith('Sepang International Circuit'));
  }
});
test('a completed manual checklist is never presented as seller verification', () => {
  const race = calendars[2027][0];
  const brief = buildViewingBrief(race, [], [0,1,2,3]);
  assert.ok(!brief.includes('[To confirm]'));
  assert.ok(brief.includes('not independently verified'));
  assert.ok(brief.includes('Generated views are estimates'));
});
