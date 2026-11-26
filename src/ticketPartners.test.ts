import test from 'node:test';
import assert from 'node:assert/strict';
import { partnersForRace, partnerIssue, ticketPartners, ticketPartnersEnabled, monetizationReadiness, type TicketPartner } from './ticketPartners';
import { calendars } from './races';

const race = calendars[2026].find(r => r.slug === 'qatar')!;
const now = new Date('2026-11-26T12:00:00Z');
const partner: TicketPartner = {
  stopSale:false,
  contract:{agreementReference:'SYNTHETIC test agreement',domainAccepted:true,commissionBasis:'Net eligible ticket value only',commissionRateTerms:'Synthetic test rate, not an actual agreement',attributionWindow:'Synthetic test window',attributionRules:'Synthetic partner-confirmed test',cancellationDeductions:'Cancelled orders reversed',payoutTerms:'Test terms',reviewedBy:'Test reviewer'},
  product:{areaId:'main',durationDays:3,availability:'reviewed-available',venue:'Lusail International Circuit',category:'Main Grandstand',ticketDays:'27–29 November 2026',admission:'Assigned seats',organizerSource:'https://www.lcsc.qa/ticket/main-grandstand-3-day',sellerTermsUrl:'https://seller.example/terms',feeTerms:'Confirm final fees',deliveryTerms:'Test delivery terms',refundTerms:'Test refund terms',checkedAt:'2026-11-26T11:00:00Z'},
  seller: 'Test seller', race: race.slug, season: race.season, url: 'https://example.com/event?ref=test', approved: true,
  approvedTrackingHosts: ['example.com'], verifiedUntil: '2026-12-01T00:00:00Z',
  destination: { url: 'https://seller.example/qatar-2026', race: race.slug, season: race.season, checkedAt: '2026-11-26T11:00:00Z' },
  attribution: { result: 'passed', testedAt: '2026-11-26T11:00:00Z', method: 'sandbox', trackingUrl: 'https://example.com/event?ref=test', destinationUrl: 'https://seller.example/qatar-2026' },
};
test('unapproved, expired, cross-season and unsafe referrals never render', () => {
  assert.deepEqual(partnersForRace(race, [partner], false, now), []);
  for (const edit of [{ approved: false }, { season: 2027 }, { race: 'bahrain' }, { verifiedUntil: 'invalid' }, { verifiedUntil: '2026-11-25' }, { url: 'javascript:alert(1)' }, { url: 'https://user:secret@example.com/' }, { approvedTrackingHosts: ['different.example'] }]) {
    assert.deepEqual(partnersForRace(race, [{ ...partner, ...edit }], true, now), []);
  }
  assert.deepEqual(partnersForRace(race, [partner], true, new Date('2027-04-01')), []);
});
test('seller review needs a recent event-matched destination and a test of these exact URLs', () => {
  const edits: Partial<TicketPartner>[] = [
    { destination: { ...partner.destination, season: 2027 } },
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
test('commercial activation follows evidence-backed release requirements', () => {
  assert.equal(ticketPartnersEnabled, monetizationReadiness.length === 0);
  if (ticketPartnersEnabled) for (const item of ticketPartners) {
    const event = calendars[item.season as 2026 | 2027]?.find(r => r.slug === item.race);
    assert.ok(event, 'Configured affiliate must match a published race');
    assert.equal(partnerIssue(event!, item), null);
  }
});

test('stop-sale, incomplete contracts and stale category reviews suppress referrals',()=>{
 for(const edit of [{stopSale:true},{product:{...partner.product,availability:'sold-out' as const}},{product:{...partner.product,availability:'unknown' as const}},{contract:{...partner.contract,domainAccepted:false}},{contract:{...partner.contract,payoutTerms:''}},{product:{...partner.product,feeTerms:''}},{product:{...partner.product,areaId:'unknown'}},{product:{...partner.product,durationDays:1}},{product:{...partner.product,admission:'Free seating'}},{product:{...partner.product,checkedAt:'2026-11-01'}},{url:'https://example.com:8443/event'}]) assert.ok(partnerIssue(race,{...partner,...edit},now));
 assert.deepEqual(partnersForRace(calendars[2027].find(r=>r.slug==='qatar')!,[{...partner,season:2027}],true,now),[]);
});
