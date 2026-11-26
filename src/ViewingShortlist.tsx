import { useRef, useState } from 'react';
import type { Race } from './races';
import { circuitGuideSource, type CircuitGuide } from './circuitGuides';

const checks = [
  'Correct event, venue and year',
  'Ticket days, category and permitted areas',
  'Final price, fees and delivery terms',
  'Cover, screens and any access requirements',
];

export default function ViewingShortlist({ race, guide, ticketUrl }: { race: Race; guide: CircuitGuide; ticketUrl?: string }) {
  const [intent, setIntent] = useState<'buy' | 'ticket'>('buy');
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const firstChoice = useRef<HTMLButtonElement>(null);
  function toggle(name: string) {
    setSelected(previous => previous.includes(name) ? previous.filter(value => value !== name) : [...previous, name]);
    setConfirmed([]);
    setMessage('');
  }
  async function copy() {
    const brief = [
      `${race.name} ${race.season} · viewing shortlist`,
      `${guide.venue} · ${guide.location}`,
      ...guide.viewing.filter(view => selected.includes(view.name)).map(view => `${view.name}: ${view.detail}`),
      'Circuit references, not confirmed ticket products or seat allocations.',
      `Still to confirm with seller: ${checks.filter((_, index) => !confirmed.includes(index)).join('; ') || 'Checklist marked complete by you. Recheck details before paying.'}`,
      guide.ticketCheck,
      `Circuit reference (${guide.referenceSeason}): ${circuitGuideSource(guide)}`,
      ...(ticketUrl ? [`Event-year ticket source: ${ticketUrl}`] : []),
      'Generated views are estimates. No live availability or price is verified.',
    ].join('\n');
    try { await navigator.clipboard.writeText(brief); setMessage('Shortlist copied with source and remaining checks.'); }
    catch { setMessage('Copy is unavailable. Use Download shortlist instead.'); }
  }
  function download() {
    const text = [`${race.name} ${race.season} · ${guide.venue}`,
      ...guide.viewing.filter(view => selected.includes(view.name)).map(view => `${view.name}: ${view.detail}`),
      'Circuit references only. No confirmed ticket product, seat, price or availability.',
      ...checks.map((check, index) => `${confirmed.includes(index) ? '[Marked checked by you]' : '[To confirm]'} ${check}`),
      guide.ticketCheck, `Circuit reference (${guide.referenceSeason}): ${circuitGuideSource(guide)}`, ticketUrl || 'No event-year ticket source supplied.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${race.slug}-${race.season}-shortlist.txt`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Shortlist downloaded.');
  }
  return <div className="viewing-shortlist">
    <div className="planning-intent" role="group" aria-label="Your ticket planning stage">
      <button aria-pressed={intent === 'buy'} onClick={() => setIntent('buy')}>Choosing tickets</button>
      <button aria-pressed={intent === 'ticket'} onClick={() => setIntent('ticket')}>Already have tickets</button>
    </div>
    <h3>{intent === 'buy' ? 'What would you like to watch?' : 'Match the area on your ticket.'}</h3>
    <p className="shortlist-context">{intent === 'buy' ? 'Shortlist viewing regions, then check the actual ticket category with the seller.' : 'Use these circuit references to orient yourself. Model positions cannot locate the row or seat printed on your ticket.'}</p>
    <div className="viewing-choice-list">
      {guide.viewing.map((view, index) => <button ref={index === 0 ? firstChoice : undefined} key={view.name} aria-pressed={selected.includes(view.name)} onClick={() => toggle(view.name)}>
        <span><strong>{view.name}</strong><span>{view.detail}</span></span>
        <span className="shortlist-choice-state">{selected.includes(view.name) ? 'Shortlisted' : 'Add'}</span>
      </button>)}
    </div>
    {selected.length > 0 && <div className="shortlist-notebook">
      <div className="shortlist-notebook-heading"><h4>Your race brief</h4><button onClick={() => { setSelected([]); setConfirmed([]); setMessage('Shortlist cleared.'); firstChoice.current?.focus(); }}>Clear</button></div>
      <p>{selected.length} viewing {selected.length === 1 ? 'region' : 'regions'} shortlisted. These are circuit references, not a seller’s confirmed products.</p>
      <p>Kept only while this race page is open. Download to keep a copy.</p>
      <fieldset><legend>Confirm with the seller</legend>{checks.map((check, index) => <label key={check}><input type="checkbox" checked={confirmed.includes(index)} onChange={() => setConfirmed(previous => previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index])} /><span>{check}</span></label>)}</fieldset>
      <p className="shortlist-check-status">{confirmed.length} of {checks.length} marked checked by you. This does not verify a ticket.</p>
      <div className="shortlist-export"><button onClick={copy}>Copy shortlist</button><button onClick={download}>Download shortlist</button></div>
    </div>}
    <p role="status" className="shortlist-message">{message}</p>
  </div>;
}
