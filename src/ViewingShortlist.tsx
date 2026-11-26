import UiIcon from "./UiIcon";
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
      <button aria-label="Choosing tickets" aria-pressed={intent === 'buy'} onClick={() => setIntent('buy')}><UiIcon name="compare"/>Compare views</button>
      <button aria-label="Already have tickets" aria-pressed={intent === 'ticket'} onClick={() => setIntent('ticket')}><UiIcon name="ticket"/>My ticket</button>
    </div>
    <h3>{intent === 'buy' ? 'Choose your view.' : 'Find your ticket area.'}</h3>
    <p className="shortlist-context">{intent === 'buy' ? 'Compare areas before choosing a ticket.' : 'Models don’t locate your ticket’s row or seat.'}</p>
    <div className="viewing-choice-list">
      {guide.viewing.map((view, index) => <button ref={index === 0 ? firstChoice : undefined} key={view.name} aria-pressed={selected.includes(view.name)} onClick={() => toggle(view.name)}>
        <span><strong>{view.name}</strong><span>{view.detail}</span></span>
        <span className="shortlist-choice-state"><UiIcon name={selected.includes(view.name)?'check':'plus'}/><span className="sr-only">{selected.includes(view.name)?'Shortlisted':'Add'}</span></span>
      </button>)}
    </div>
    {selected.length > 0 && <div className="shortlist-notebook">
      <div className="shortlist-notebook-heading"><h4>Your race brief</h4><button onClick={() => { revision.current++; setSelected([]); setConfirmed([]); setMessage('Shortlist cleared.'); firstChoice.current?.focus(); }}>Clear</button></div>
      <p>{selected.length} viewing {selected.length===1?'area':'areas'} · page only. Download to keep.</p>
      <fieldset><legend>Confirm with the seller</legend>{checks.map((check, index) => <label key={check}><input type="checkbox" checked={confirmed.includes(index)} onChange={() => { revision.current++; setMessage(''); setConfirmed(previous => previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index]); }} /><span>{check}</span></label>)}</fieldset>
      <p className="shortlist-check-status">{confirmed.length}/{checks.length} marked by you · not independently verified.</p>
      <div className="shortlist-export"><button disabled={copying} aria-busy={copying} aria-label="Copy shortlist" onClick={copy}><UiIcon name="copy"/>{copying ? 'Copying…' : 'Copy'}</button><button aria-label="Download shortlist" onClick={download}><UiIcon name="download"/>Download</button></div>
    </div>}
    <p role="status" className="shortlist-message">{message}</p>
  </div>;
}
