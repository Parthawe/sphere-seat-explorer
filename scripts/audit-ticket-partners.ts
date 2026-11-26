import { calendars } from '../src/races';
import { monetizationReadiness, ticketPartners, partnerIssue } from '../src/ticketPartners';

console.log('Commercial launch is ' + (monetizationReadiness.length ? 'BLOCKED' : 'locally eligible'));
for (const issue of monetizationReadiness) console.log('- ' + issue);
console.log(`${ticketPartners.length} configured referral links. This audit checks recorded reviews, not live inventory or remote destinations.`);
const links = ticketPartners.map(partner => {
  const event = calendars[partner.season as 2026 | 2027]?.find(race => race.slug === partner.race);
  const issue = event ? partnerIssue(event, partner) : 'Unknown event or season';
  return { seller: partner.seller, event: `${partner.race} ${partner.season}`, status: issue || 'Recorded review current', due: partner.verifiedUntil };
});
if (links.length) console.table(links);
if (monetizationReadiness.length || !ticketPartners.length || links.some(link => link.status !== 'Recorded review current')) process.exitCode = 1;
