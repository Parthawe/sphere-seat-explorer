import { calendars } from '../src/races';
import { monetizationReadiness, ticketPartners, partnerIssue } from '../src/ticketPartners';

const release = Object.entries(monetizationReadiness).map(([requirement, ready]) => ({ requirement, status: ready ? 'recorded complete' : 'needs owner input' }));
console.log('Commercial release requirements');
console.table(release);
console.log(`${ticketPartners.length} configured referral links. This audit checks recorded reviews, not live inventory or remote destinations.`);
const links = ticketPartners.map(partner => {
  const event = calendars[partner.season as 2026 | 2027]?.find(race => race.slug === partner.race);
  const issue = event ? partnerIssue(event, partner) : 'Unknown event or season';
  return { seller: partner.seller, event: `${partner.race} ${partner.season}`, status: issue || 'Recorded review current', due: partner.verifiedUntil };
});
if (links.length) console.table(links);
if (links.some(link => link.status !== 'Recorded review current')) process.exitCode = 1;
