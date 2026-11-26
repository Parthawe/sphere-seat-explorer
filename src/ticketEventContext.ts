type TicketVenue = 'qatar' | 'abu-dhabi' | 'singapore';
const venueNames: Record<TicketVenue, RegExp> = {
  qatar: /\b(qatar|lusail|losail)\b/,
  'abu-dhabi': /\b(abu dhabi|yas marina)\b/,
  singapore: /\b(singapore|marina bay)\b/,
};
// Named venues are exclusion evidence, never evidence of a ticket's validity.
const otherVenues = /\b(australia|melbourne|albert park|china|shanghai|japan|suzuka|miami|canada|montreal|montréal|monaco|barcelona|catalunya|austria|spielberg|red bull ring|great britain|british grand prix|silverstone|belgium|spa-francorchamps|hungary|hungaroring|netherlands|zandvoort|italy|monza|spain|madrid|madring|azerbaijan|baku|bahrain|sakhir|malaysia|sepang|united states|austin|circuit of the americas|mexico|mexico city|brazil|sao paulo|são paulo|interlagos|las vegas|saudi arabia|jeddah|portugal|portimao|portimão)\b/;
export function hasConflictingTicketContext(text: string, season: number, venue: TicketVenue): boolean {
  const context = text.replace(/\b(?:seat|row|section)\s*[:#-]?\s*\d{1,4}[a-z]?\b/g, '');
  const years = context.match(/\b(?:19|20)\d{2}\b/g) ?? [];
  return years.some(year => Number(year) !== season) || otherVenues.test(context) ||
    Object.entries(venueNames).some(([id, pattern]) => id !== venue && pattern.test(context));
}
