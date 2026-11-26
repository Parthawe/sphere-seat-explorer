import { findVenue } from "./venueRegistry";
import { commercialLaunch, commercialLaunchIssues, safeCommercialUrl } from "./commercialLaunch";
import type { Race } from './races';

export type TicketPartner = {
  seller: string;
  stopSale: boolean;
  contract: { agreementReference:string; domainAccepted:boolean; commissionBasis:string; commissionRateTerms:string; attributionWindow:string; attributionRules:string; cancellationDeductions:string; payoutTerms:string; reviewedBy:string };
  product: { areaId:string; durationDays:number; availability:'reviewed-available'|'sold-out'|'unknown'; venue:string; category:string; ticketDays:string; admission:string; organizerSource:string; sellerTermsUrl:string; feeTerms:string; deliveryTerms:string; refundTerms:string; checkedAt:string };
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
export const monetizationReadiness = commercialLaunchIssues(commercialLaunch);
export const ticketPartnersEnabled = monetizationReadiness.length === 0;
// Add only exact event links issued under an approved agreement. No fabricated IDs.
export const ticketPartners: TicketPartner[] = [];
export const PARTNER_REVIEW_DAYS = 7;

export function partnerIssue(race: Race, partner: TicketPartner, now = new Date()): string | null {
  if (!Number.isFinite(now.getTime())) return 'Invalid review time';
  const eventEnd = Date.parse(race.end + 'T23:59:59-12:00');
  if (!Number.isFinite(eventEnd) || now.getTime() > eventEnd) return 'Event has ended or has no valid final date';
  if (partner.stopSale !== false) return 'Seller link stopped or stop-sale review missing';
  const contract=partner.contract;
  if(!contract?.domainAccepted||!['agreementReference','commissionBasis','commissionRateTerms','attributionWindow','attributionRules','cancellationDeductions','payoutTerms','reviewedBy'].every(key=>typeof contract[key as keyof typeof contract]==='string'&&String(contract[key as keyof typeof contract]).trim()))return 'Approved contract terms or domain acceptance missing';
  const product=partner.product;
  if(!product||!['venue','category','ticketDays','admission','feeTerms','deliveryTerms','refundTerms'].every(key=>typeof product[key as keyof typeof product]==='string'&&String(product[key as keyof typeof product]).trim())||!safeCommercialUrl(product.organizerSource)||!safeCommercialUrl(product.sellerTermsUrl))return 'Ticket category mapping or seller terms missing';
  const venue=findVenue(race.season,race.slug), area=venue?.areas.find(a=>a.id===product.areaId);
  if(!venue||!area||product.venue!==venue.name||product.category!==area.name||product.admission!==area.kind||product.durationDays!==venue.durationDays||product.organizerSource!==area.source)return 'Product does not match the reviewed venue, area, duration or organizer source';
  if(product.availability!=='reviewed-available')return 'Availability review missing or product sold out';
  const productReview=Date.parse(product.checkedAt);
  if(!Number.isFinite(productReview)||productReview>now.getTime()||now.getTime()-productReview>PARTNER_REVIEW_DAYS*86400000)return 'Ticket category review needs refreshing';
  if (!partner.approved) return 'Programme approval missing';
  if (!partner.seller.trim()) return 'Seller name missing';
  if (partner.race !== race.slug || partner.season !== race.season) return 'Race or season mismatch';
  const expiry = Date.parse(partner.verifiedUntil);
  if (!Number.isFinite(expiry) || expiry <= now.getTime()) return 'Link review expired';
  const tracking = safeCommercialUrl(partner.url);
  if (!tracking || !partner.approvedTrackingHosts.includes(tracking.hostname)) return 'Tracking URL host not approved';
  const destination = partner.destination;
  if (!destination || !safeCommercialUrl(destination.url) || destination.race !== race.slug || destination.season !== race.season) return 'Event destination review missing or mismatched';
  const reviewed = Date.parse(destination.checkedAt);
  if (!Number.isFinite(reviewed) || reviewed > now.getTime() || now.getTime() - reviewed > PARTNER_REVIEW_DAYS * 86400000) return 'Destination needs a fresh review';
  const tested = Date.parse(partner.attribution?.testedAt);
  if (partner.attribution?.result !== 'passed' || partner.attribution.trackingUrl !== partner.url || partner.attribution.destinationUrl !== destination.url || !['partner-confirmed', 'sandbox'].includes(partner.attribution.method) || !Number.isFinite(tested) || tested > now.getTime()) return 'Permitted attribution test not confirmed';
  return null;
}
export function partnersForRace(race: Race, partners: TicketPartner[], enabled: boolean, now = new Date()) {
  if (!enabled || commercialLaunch.pilot.stopSale || race.slug!==commercialLaunch.pilot.race || race.season!==commercialLaunch.pilot.season) return [];
  const seen = new Set<string>();
  return partners.filter(partner => {
    if (partnerIssue(race, partner, now)) return false;
    const seller = partner.seller.trim().toLocaleLowerCase();
    if (seen.has(seller)) return false;
    seen.add(seller); return true;
  });
}
