import test from 'node:test';
import assert from 'node:assert/strict';
import { partnersForRace, partnerIssue, ticketPartners, ticketPartnersEnabled, monetizationReadiness, type TicketPartner } from './ticketPartners';
import { calendars } from './races';

const race = calendars[2027].find(r => r.slug === 'bahrain')!;
const now = new Date('2026-11-26T12:00:00Z');
const partner: TicketPartner = {
  seller: 'Test seller', race: race.slug, season: race.season, url: 'https://example.com/event?ref=test', approved: true,
  approvedTrackingHosts: ['example.com'], verifiedUntil: '2026-12-01T00:00:00Z',
  destination: { url: 'https://seller.example/bahrain-2027', race: race.slug, season: race.season, checkedAt: '2026-11-26T11:00:00Z' },
  attribution: { result: 'passed', testedAt: '2026-11-26T11:00:00Z', method: 'sandbox', trackingUrl: 'https://example.com/event?ref=test', destinationUrl: 'https://seller.example/bahrain-2027' },
};
test('unapproved, expired, cross-season and unsafe referrals never render', () => {
  assert.deepEqual(partnersForRace(race, [partner], false, now), []);
  for (const edit of [{ approved: false }, { season: 2026 }, { race: 'qatar' }, { verifiedUntil: 'invalid' }, { verifiedUntil: '2026-11-25' }, { url: 'javascript:alert(1)' }, { url: 'https://user:secret@example.com/' }, { approvedTrackingHosts: ['different.example'] }]) {
    assert.deepEqual(partnersForRace(race, [{ ...partner, ...edit }], true, now), []);
  }
  assert.deepEqual(partnersForRace(race, [partner], true, new Date('2027-04-01')), []);
});
test('seller review needs a recent event-matched destination and a test of these exact URLs', () => {
  const edits: Partial<TicketPartner>[] = [
    { destination: { ...partner.destination, season: 2026 } },
    { destination: { ...partner.destination, checkedAt: '2026-11-01' } },
    { destination: { ...partner.destination, checkedAt: '2026-11-27' } },
    { attribution: { ...partner.attribution, result: 'pending' } },
    { attribution: { ...partner.attribution, trackingUrl: 'https://example.com/old-link' } },
    { attribution: { ...partner.attribution, destinationUrl: 'https://seller.example/old-event' } },
  ];
  for (const edit of edits) assert.ok(partnerIssue(race, { ...partner, ...edit }, now));
  assert.equal(partnerIssue(race, partner, now), null);
});
test('approved URLs are preserved and sellers deduplicate without an arbitrary two-seller limit', () => {
  const result = partnersForRace(race, [partner, { ...partner, seller: ' TEST SELLER ' }, { ...partner, seller: 'Second' }, { ...partner, seller: 'Third' }], true, now);
  assert.equal(result.length, 3);
  assert.equal(result[0].url, partner.url);
});
test('commercial activation follows both release requirements', () => {
  assert.equal(ticketPartnersEnabled, Object.values(monetizationReadiness).every(Boolean));
  if (ticketPartnersEnabled) for (const item of ticketPartners) {
    const event = calendars[item.season as 2026 | 2027]?.find(r => r.slug === item.race);
    assert.ok(event, 'Configured affiliate must match a published race');
    assert.equal(partnerIssue(event!, item), null);
  }
});
