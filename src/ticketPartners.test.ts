import test from 'node:test';
import assert from 'node:assert/strict';
import { partnersForRace, ticketPartners, ticketPartnersEnabled, type TicketPartner } from './ticketPartners';
import { calendars } from './races';

const race = calendars[2027].find(r => r.slug === 'bahrain')!;
const now = new Date('2026-11-26T12:00:00Z');
const partner: TicketPartner = { seller: 'Test seller', race: race.slug, season: race.season, url: 'https://example.com/event?ref=test', approved: true, verifiedUntil: '2027-01-01T00:00:00Z' };
test('unapproved, expired, cross-season and unsafe referrals never render', () => {
  assert.deepEqual(partnersForRace(race, [partner], false, now), []);
  for (const edit of [{ approved: false }, { season: 2026 }, { race: 'qatar' }, { verifiedUntil: 'invalid' }, { verifiedUntil: '2026-11-25' }, { url: 'javascript:alert(1)' }, { url: 'https://user:secret@example.com/' }]) {
    assert.deepEqual(partnersForRace(race, [{ ...partner, ...edit }], true, now), []);
  }
  assert.deepEqual(partnersForRace(race, [partner], true, new Date('2027-04-01')), []);
});
test('approved referrals preserve their issued URL, deduplicate and stay limited to two', () => {
  const result = partnersForRace(race, [partner, partner, { ...partner, seller: 'Second' }, { ...partner, seller: 'Third' }], true, now);
  assert.equal(result.length, 2);
  assert.equal(result[0].url, partner.url);
});
test('public monetization remains disabled without approved accounts', () => {
  assert.equal(ticketPartnersEnabled, false);
  assert.deepEqual(ticketPartners, []);
});
