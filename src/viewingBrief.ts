import {SITE_ORIGIN} from './brand';
import type { Race } from './races';
import { circuitGuideFor, circuitGuideSource, circuitTicketSource } from './circuitGuides';

export const bookingChecks = [
  'Correct event, venue and year',
  'Ticket days, category and permitted areas',
  'Final price, fees and delivery terms',
  'Cover, screens and any access requirements',
] as const;

/** Exports contain only curated race context and the visitor's public viewing choices. */
export function buildViewingBrief(race: Race, selected: readonly string[], confirmed: readonly number[]) {
  const guide = circuitGuideFor(race.season, race.slug);
  if (!guide) throw new Error('No circuit reference for this race');
  const ticketUrl = circuitTicketSource(guide, race.season);
  return [
    `${race.name} ${race.season} · viewing shortlist`,
    `${guide.venue} · ${guide.location}`,
    `Race weekend: ${race.start} to ${race.end} (venue dates)`,
    `Race guide: ${SITE_ORIGIN}/?${new URLSearchParams({season:String(race.season),race:race.slug})}`,
    ...guide.viewing.filter(view => selected.includes(view.name)).map(view => `${view.name}: ${view.detail}`),
    '', 'Booking checks (marked by you, not independently verified):',
    ...bookingChecks.map((check, index) => `${confirmed.includes(index) ? '[Marked checked by you]' : '[To confirm]'} ${check}`),
    guide.ticketCheck,
    `Circuit reference (${guide.referenceSeason}): ${circuitGuideSource(guide)}`,
    ...(guide.referenceSeason !== race.season ? [`The circuit reference is from ${guide.referenceSeason}; confirm ${race.season} event details separately.`] : []),
    ticketUrl ? `Ticket source (${race.season}): ${ticketUrl}` : `No event-year ticket source supplied for ${race.season}.`,
    'Circuit references are not confirmed ticket products or seat allocations. Generated views are estimates. Confirm exact seats, current prices and availability with the seller.',
  ].join('\n');
}
