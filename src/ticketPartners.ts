import type { Race } from './races';

export type TicketPartner = {
  seller: string;
  race: string;
  season: number;
  url: string;
  approved: boolean;
  approvedTrackingHosts: string[];
  verifiedUntil: string;
  destination: { url: string; race: string; season: number; checkedAt: string };
  attribution: { result: 'passed' | 'pending'; testedAt: string; method: 'partner-confirmed' | 'sandbox'; trackingUrl: string; destinationUrl: string };
};

// These are release requirements, not evidence of rights or account approval.
export const monetizationReadiness = { commercialDomainAccepted: false, operatorPoliciesPublished: false };
export const ticketPartnersEnabled = Object.values(monetizationReadiness).every(Boolean);
// Add only exact event links issued under an approved agreement. No fabricated IDs.
export const ticketPartners: TicketPartner[] = [];
export const PARTNER_REVIEW_DAYS = 7;

function safeHttps(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url : null; }
  catch { return null; }
}
export function partnerIssue(race: Race, partner: TicketPartner, now = new Date()): string | null {
  if (!Number.isFinite(now.getTime())) return 'Invalid review time';
  const eventEnd = Date.parse(race.end + 'T23:59:59-12:00');
  if (!Number.isFinite(eventEnd) || now.getTime() > eventEnd) return 'Event has ended or has no valid final date';
  if (!partner.approved) return 'Programme approval missing';
  if (!partner.seller.trim()) return 'Seller name missing';
  if (partner.race !== race.slug || partner.season !== race.season) return 'Race or season mismatch';
  const expiry = Date.parse(partner.verifiedUntil);
  if (!Number.isFinite(expiry) || expiry <= now.getTime()) return 'Link review expired';
  const tracking = safeHttps(partner.url);
  if (!tracking || !partner.approvedTrackingHosts.includes(tracking.hostname)) return 'Tracking URL host not approved';
  const destination = partner.destination;
  if (!destination || !safeHttps(destination.url) || destination.race !== race.slug || destination.season !== race.season) return 'Event destination review missing or mismatched';
  const reviewed = Date.parse(destination.checkedAt);
  if (!Number.isFinite(reviewed) || reviewed > now.getTime() || now.getTime() - reviewed > PARTNER_REVIEW_DAYS * 86400000) return 'Destination needs a fresh review';
  const tested = Date.parse(partner.attribution?.testedAt);
  if (partner.attribution?.result !== 'passed' || partner.attribution.trackingUrl !== partner.url || partner.attribution.destinationUrl !== destination.url || !['partner-confirmed', 'sandbox'].includes(partner.attribution.method) || !Number.isFinite(tested) || tested > now.getTime()) return 'Permitted attribution test not confirmed';
  return null;
}
export function partnersForRace(race: Race, partners: TicketPartner[], enabled: boolean, now = new Date()) {
  if (!enabled) return [];
  const seen = new Set<string>();
  return partners.filter(partner => {
    if (partnerIssue(race, partner, now)) return false;
    const seller = partner.seller.trim().toLocaleLowerCase();
    if (seen.has(seller)) return false;
    seen.add(seller); return true;
  });
}
