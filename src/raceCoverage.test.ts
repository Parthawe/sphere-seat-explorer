import test from 'node:test';
import assert from 'node:assert/strict';
import { calendars } from './races';
import { raceCoverage } from './raceCoverage';

test('a dated Vegas reference is labeled before entering its explorer in either season', () => {
  for (const season of [2026,2027]) {
    const coverage = raceCoverage(season,'las-vegas');
    assert.equal(coverage.kind,'reference3d');
    assert.equal(coverage.sourceSeason,2026);
    assert.match(coverage.label,/2026 reference/);
    assert.match(coverage.detail,/2026 reference/);
  }
});
test('all 47 calendar entries keep model and area-map coverage bound to their own season', () => {
  let count=0;
  for (const season of [2026,2027] as const) for (const race of calendars[season]) {
    const coverage=raceCoverage(season,race.slug); count++;
    assert.ok(coverage.label && coverage.detail);
    if (coverage.kind==='model'||coverage.kind==='area') assert.equal(coverage.sourceSeason,season);
    if (coverage.kind==='guide'||coverage.kind==='area') assert.equal(coverage.has3d,false);
  }
  assert.equal(count,47);
  assert.equal(raceCoverage(2026,'bahrain').kind,'layout3d');
  assert.equal(raceCoverage(2027,'bahrain').kind,'model');
  assert.equal(raceCoverage(2026,'qatar').kind,'model');
  assert.equal(raceCoverage(2027,'qatar').kind,'layout3d');
  assert.equal(raceCoverage(2027,'china').kind,'layout3d');
});
