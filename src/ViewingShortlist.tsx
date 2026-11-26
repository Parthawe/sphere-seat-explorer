import { useRef, useState } from 'react';
import type { Race } from './races';
import type { CircuitGuide } from './circuitGuides';
import { bookingChecks as checks, buildViewingBrief } from './viewingBrief';

export default function ViewingShortlist({ race, guide }: { race: Race; guide: CircuitGuide }) {
  const [intent, setIntent] = useState<'buy' | 'ticket'>('buy');
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [copying, setCopying] = useState(false);
  const revision = useRef(0);
  const firstChoice = useRef<HTMLButtonElement>(null);
  function toggle(name: string) {
    revision.current++;
    setSelected(previous => previous.includes(name) ? previous.filter(value => value !== name) : [...previous, name]);
    setConfirmed([]);
    setMessage('');
  }
  async function copy() {
    const generation = revision.current;
    const brief = buildViewingBrief(race, selected, confirmed);
    setCopying(true);
    try {
      await navigator.clipboard.writeText(brief);
      if (generation === revision.current) setMessage('Shortlist copied with sources and your booking checks.');
    } catch {
      if (generation === revision.current) setMessage('Copy is unavailable. Use Download shortlist instead.');
    } finally { setCopying(false); }
  }
  function download() {
    const text = buildViewingBrief(race, selected, confirmed);
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
      <div className="shortlist-notebook-heading"><h4>Your race brief</h4><button onClick={() => { revision.current++; setSelected([]); setConfirmed([]); setMessage('Shortlist cleared.'); firstChoice.current?.focus(); }}>Clear</button></div>
      <p>{selected.length} viewing {selected.length === 1 ? 'region' : 'regions'} shortlisted. These are circuit references, not a seller’s confirmed products.</p>
      <p>Kept only while this race page is open. Download to keep a copy.</p>
      <fieldset><legend>Confirm with the seller</legend>{checks.map((check, index) => <label key={check}><input type="checkbox" checked={confirmed.includes(index)} onChange={() => { revision.current++; setMessage(''); setConfirmed(previous => previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index]); }} /><span>{check}</span></label>)}</fieldset>
      <p className="shortlist-check-status">{confirmed.length} of {checks.length} marked checked by you. This does not verify a ticket.</p>
      <div className="shortlist-export"><button disabled={copying} aria-busy={copying} onClick={copy}>{copying ? 'Copying…' : 'Copy shortlist'}</button><button onClick={download}>Download shortlist</button></div>
    </div>}
    <p role="status" className="shortlist-message">{message}</p>
  </div>;
}
