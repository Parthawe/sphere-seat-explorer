import type { Race } from './races';

export type TicketPartner = {
  seller: string;
  race: string;
  season: number;
  url: string;
  approved: boolean;
  verifiedUntil: string;
};

// Add only event-specific links issued by an approved affiliate programme.
// Keep the publisher's exact tracking URL; never append invented referral IDs.
export const ticketPartners: TicketPartner[] = [];
export const ticketPartnersEnabled = false;

export function partnersForRace(race: Race, partners: TicketPartner[], enabled: boolean, now = new Date()) {
  if (!enabled || !Number.isFinite(now.getTime()) || now.getTime() > Date.parse(race.end + 'T23:59:59-12:00')) return [];
  const seen = new Set<string>();
  return partners.filter(partner => {
    if (!partner.approved || partner.race !== race.slug || partner.season !== race.season || !partner.seller.trim()) return false;
    const expiry = Date.parse(partner.verifiedUntil);
    if (!Number.isFinite(expiry) || expiry <= now.getTime()) return false;
    try {
      const url = new URL(partner.url);
      if (url.protocol !== 'https:' || url.username || url.password || seen.has(partner.seller)) return false;
      seen.add(partner.seller);
      return true;
    } catch { return false; }
  }).slice(0, 2);
}
