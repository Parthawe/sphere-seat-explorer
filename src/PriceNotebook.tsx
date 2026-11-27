import {useEffect,useRef,useState,type FormEvent} from 'react';
import type {Race} from './races';
import UiIcon from './UiIcon';
import {mergePriceWatches,notebookKey,PRICE_CURRENCIES,priceAdmissionWindow,priceMoney,priceSummary,publicProductUrl,readWatches,validAmount,validPriceAdmission,type PriceCurrency,type PriceWatch} from './ticketPriceHistory';

export default function PriceNotebook({race}:{race:Race}) {
 const admission=priceAdmissionWindow(race);
 const [watches,setWatches]=useState<PriceWatch[]>(()=>{try{return readWatches(JSON.parse(localStorage.getItem(notebookKey(race))??'[]'),race);}catch{return [];}});
 const [active,setActive]=useState(watches[0]?.id??''),[message,setMessage]=useState(''),[storageFailed,setStorageFailed]=useState(false),[editing,setEditing]=useState<string|null>(null),[undo,setUndo]=useState<PriceWatch[]|null>(null),[saving,setSaving]=useState(false),[targetDraft,setTargetDraft]=useState('');
 const dialog=useRef<HTMLDialogElement>(null),addButton=useRef<HTMLButtonElement>(null),quotes=useRef<HTMLDetailsElement>(null),wasOpen=useRef(false),opener=useRef<HTMLElement|null>(null);
 const selected=watches.find(w=>w.id===active)??watches[0],summary=selected?priceSummary(selected):null;
 useEffect(()=>setTargetDraft(selected?.target===null||selected?.target===undefined?'':String(selected.target)),[selected?.id,selected?.target]);
 useEffect(()=>{if(editing!==null){dialog.current?.showModal();wasOpen.current=true;dialog.current?.querySelector<HTMLInputElement>(editing?'input[name=amount]':'input[name=product]')?.focus({preventScroll:true});}else{dialog.current?.close();if(wasOpen.current){wasOpen.current=false;(opener.current?.isConnected?opener.current:addButton.current)?.focus({preventScroll:true});}}},[editing]);
 useEffect(()=>{const update=(event:StorageEvent)=>{if(event.key!==notebookKey(race)&&event.key!==null)return;if(storageFailed){setMessage('Another tab changed saved notes. Export your unsaved notes before reloading.');return;}try{setWatches(readWatches(JSON.parse(localStorage.getItem(notebookKey(race))??'[]'),race));setUndo(null);setMessage('Price notes updated in another tab.');}catch{setMessage('Saved notes could not be read. Your current view was kept.');}};window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update);},[race,storageFailed]);
 async function persist(next:PriceWatch[]){
  if(saving)return false;setSaving(true);
  const write=()=>{
   if(storageFailed){setWatches(next);return true;}
   let raw:string|null;try{raw=localStorage.getItem(notebookKey(race));}catch{setWatches(next);setStorageFailed(true);return true;}
   let latest:PriceWatch[];try{latest=readWatches(JSON.parse(raw??'[]'),race);}catch{setMessage('Saved notes could not be read. Export your current notes before clearing browser data.');return false;}
   let merged:PriceWatch[];try{merged=mergePriceWatches(watches,next,latest);}catch(error){setMessage(error instanceof Error?error.message:'Notes changed in another tab. Reload before editing.');return false;}
   setWatches(merged);try{if(merged.length)localStorage.setItem(notebookKey(race),JSON.stringify(merged));else localStorage.removeItem(notebookKey(race));setStorageFailed(false);}catch{setStorageFailed(true);}return true;
  };
  try{return navigator.locks?await navigator.locks.request(notebookKey(race),write).catch(()=>write()):write();}finally{setSaving(false);}
 }
 async function save(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const data=new FormData(event.currentTarget),amount=Number(data.get('amount')),existing=watches.find(w=>w.id===editing);
  if(editing&&!existing){setMessage('This option was removed in another tab. Close the form and add a new option.');return;}
  if(!validAmount(amount)){setMessage('Enter a price above zero.');return;}
  if(existing&&existing.points.length>=200){setMessage('This option has 200 quotes. Export your notes before removing older quotes.');return;}
  if(!existing&&watches.length>=30){setMessage('This race has 30 saved options. Remove one before adding another.');return;}
  const url=publicProductUrl(data.get('url'));
  if(!existing&&!url){setMessage('Use an HTTPS product-page link without query parameters or a fragment.');return;}
  const start=String(data.get('start')),end=String(data.get('end'));
  if(!existing&&!validPriceAdmission(start,end,race)){setMessage('Choose admission dates within the supported event window.');return;}
  const point={id:crypto.randomUUID(),amount,observedAt:new Date().toISOString()};
  const watch:PriceWatch=existing?{...existing,points:[...existing.points,point]}:{id:crypto.randomUUID(),product:String(data.get('product')).trim(),seller:String(data.get('seller')).trim(),url:url!,currency:String(data.get('currency')) as PriceCurrency,start,end,target:null,points:[point]};
  const next=existing?watches.map(w=>w.id===watch.id?watch:w):[...watches,watch];
  if(readWatches([watch],race).length!==1){setMessage('Check the product, seller, dates and price.');return;}
  if(!await persist(next))return;setActive(watch.id);setUndo(null);setEditing(null);setMessage('Quote saved. Seller price and stock are not verified.');
 }
 function restoreQuoteFocus(){requestAnimationFrame(()=>{if(document.activeElement!==document.body)return;const list=quotes.current;const target=list?.querySelector<HTMLElement>(list.open?'button':'summary')??addButton.current;target?.focus({preventScroll:true});});}
 async function remove(id:string){if(!selected)return;const previous=watches;const points=selected.points.filter(p=>p.id!==id);if(await persist(points.length?watches.map(w=>w.id===selected.id?{...w,points}:w):watches.filter(w=>w.id!==selected.id))){setUndo(previous);setMessage('Quote removed.');restoreQuoteFocus();}}
 function exportNotes(){const blob=new Blob([JSON.stringify({race:race.slug,season:race.season,provenance:'Personal quotes. Not seller-verified.',options:watches},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${race.slug}-${race.season}-price-notes.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('Price notes exported.');}
 return <section className="price-notebook" aria-labelledby="price-notebook-title">
  <header><div><h2 id="price-notebook-title">Your price notes</h2><p>Manual quotes · 1 adult · fees included · ticket only</p></div><button ref={addButton} className="price-primary" onClick={event=>{opener.current=event.currentTarget;setMessage('');setEditing('');}}><UiIcon name="plus"/>Add ticket option</button></header>
  <p className="price-local-note"><UiIcon name="info"/>{storageFailed?'Session-only notes.':'Saved on this browser.'} No automatic price updates or alerts.</p>
  {storageFailed&&<p role="alert">Browser storage is unavailable. These notes will be lost when you leave. Export them below.</p>}
  {!selected?<div className="price-empty"><UiIcon name="ticket"/><div><h3>No saved prices</h3><p>Add a seller’s quote to compare later.</p></div></div>:<>
   <div className="price-workspace"><div className="price-history">
    <label htmlFor="price-option">Ticket option</label><select id="price-option" value={selected.id} onChange={event=>{setActive(event.target.value);setMessage('');}}>{watches.map(w=><option key={w.id} value={w.id}>{w.product} · {w.seller} · {w.currency}</option>)}</select>
    <div className="price-metrics"><div><span>Last saved quote</span><strong>{priceMoney(summary!.latest.amount,selected.currency)}</strong></div><div><span>Since your first quote</span><strong className={summary!.change!==null&&summary!.change<0?'price-lower':''}>{summary!.change===null?'One quote':summary!.change===0?'Unchanged':`${summary!.change>0?'+':'−'}${priceMoney(Math.abs(summary!.change),selected.currency)}`}</strong></div></div>
    <PriceChart key={selected.id} watch={selected}/>
    <p className="price-chart-note">{selected.points.length} saved {selected.points.length===1?'quote':'quotes'} · {new Date(summary!.latest.observedAt).toLocaleString()}<br/>Your notes, not market history. No price forecast.</p>
   </div><div className="price-decision">
    <h3>{selected.product}</h3><p>{selected.seller} · {selected.start} → {selected.end}</p>
    <form onSubmit={async event=>{event.preventDefault();const trigger=(event.nativeEvent as SubmitEvent).submitter as HTMLElement|null;const value=new FormData(event.currentTarget).get('target');const target=value?Number(value):null;if(target!==null&&!validAmount(target))return;if(!await persist(watches.map(w=>w.id===selected.id?{...w,target}:w)))return;setUndo(null);setMessage(target===null?'Target cleared.':'Target saved. This does not enable alerts.');requestAnimationFrame(()=>{if(document.activeElement===document.body)trigger?.focus({preventScroll:true});});}} key={selected.id}>
     <label htmlFor="price-target">Your target · {selected.currency}</label><div className="price-target-controls"><input id="price-target" name="target" type="number" min="0.01" max="100000000" step="0.01" value={targetDraft} onChange={event=>setTargetDraft(event.target.value)} placeholder="Optional"/><button disabled={saving} type="submit">Save</button></div>
    </form>
    {selected.target!==null&&<p className="price-target-state">{summary!.withinTarget?'Saved quote meets your target.':'Saved quote is above your target.'} Recheck with the seller.</p>}
    <button className="price-primary" onClick={event=>{opener.current=event.currentTarget;setMessage('');setEditing(selected.id);}}><UiIcon name="plus"/>Log latest price</button>
    <a href={selected.url} target="_blank" rel="noreferrer nofollow"><UiIcon name="ticket"/>Open saved product page<UiIcon name="arrow"/></a>
    <p>Same product, dates and seller only. If access or inclusions change, add a new option.</p>
   </div></div>
   <details ref={quotes} className="price-quotes"><summary>Saved quotes & sources <span>{selected.points.length}</span></summary><ul>{[...selected.points].reverse().map(p=><li key={p.id}><time dateTime={p.observedAt}>{new Date(p.observedAt).toLocaleString()}</time><strong>{priceMoney(p.amount,selected.currency)}</strong><button aria-label={`Remove quote from ${new Date(p.observedAt).toLocaleString()}`} disabled={saving} onClick={()=>remove(p.id)}><UiIcon name="close"/></button></li>)}</ul></details>
  </>}
  <div className="price-footer">{!!watches.length&&<button onClick={exportNotes}><UiIcon name="download"/>Export notes</button>}{undo&&<button disabled={saving} onClick={async()=>{if(await persist(undo)){setUndo(null);setMessage('Quote restored.');restoreQuoteFocus();}}}>Undo removal</button>}<details><summary>How this works</summary><p>Manually recorded prices are private browser notes, not verified offers or live stock. History compares one exact option in its original currency; it does not compare different packages or predict the market. Record the same all-in adult price each time. Use a public product URL without query parameters or fragments, never a checkout link. No account, email, ticket barcode or payment details are needed. Remove individual quotes or clear this site’s browser data to delete notes. Export before switching devices. External sellers apply their own privacy and purchase terms.</p></details></div>
  <p className="price-message" role="status">{message}</p>
  <dialog ref={dialog} className="price-dialog" aria-labelledby="price-dialog-title" onCancel={()=>setEditing(null)} onClose={()=>setEditing(null)}>
   <header><div><span className="context-note">{race.name} / {race.season}</span><h2 id="price-dialog-title">{editing?'Log latest price':'Add a ticket option'}</h2></div><button aria-label="Close price form" onClick={()=>setEditing(null)}><UiIcon name="close"/></button></header>
   {editing!==null&&<form key={editing} onSubmit={save}>
    {editing?<p>{watches.find(w=>w.id===editing)?.product} · {watches.find(w=>w.id===editing)?.seller}<br/>Keep dates, currency and inclusions unchanged.</p>:<>
     <label>Exact ticket category<input name="product" required maxLength={100} placeholder="Grandstand, package and access"/></label>
     <label>Seller<input name="seller" required maxLength={80} autoComplete="off"/></label>
     <label>Public product page<input name="url" type="url" required placeholder="https://…" autoComplete="off"/></label>
     <div className="price-form-pair"><label>Admission from<input name="start" type="date" required min={admission.start} max={admission.end} defaultValue={race.start}/></label><label>Admission through<input name="end" type="date" required min={admission.start} max={admission.end} defaultValue={race.end}/></label></div>
     {admission.source&&<p className="price-date-guidance">Some products include Thursday, 3 Dec. Use your quote’s dates; daily access varies. <a href={admission.source} target="_blank" rel="noreferrer">Organizer dates</a></p>}
     <label>Currency<select name="currency" aria-label="Currency" defaultValue="USD">{PRICE_CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></label>
    </>}
    <label>Price per adult, including fees {editing&&`· ${watches.find(w=>w.id===editing)?.currency}`}<input name="amount" type="number" min="0.01" max="100000000" step="0.01" required/></label>
    <label className="price-confirm"><input type="checkbox" required/>I checked the adult total, fees, dates and ticket inclusions. No travel or hotel bundle.</label>
    <p className="price-message" role="status">{message}</p><button disabled={saving} aria-busy={saving} className="price-primary" type="submit">{saving?'Saving…':'Save quote'}<UiIcon name="check"/></button>
   </form>}
  </dialog>
 </section>;
}

function PriceChart({watch}:{watch:PriceWatch}) {
 const [hover,setHover]=useState<number|null>(null),points=watch.points,summary=priceSummary(watch);
 const low=summary.min,high=summary.max,spread=Math.max(high-low,high*.05,1),min=low-spread*.15,max=high+spread*.15;
 const start=Date.parse(points[0].observedAt),duration=Math.max(Date.parse(points.at(-1)!.observedAt)-start,1);
 const xy=points.map(p=>[points.length===1?300:36+(Date.parse(p.observedAt)-start)/duration*528,146-(p.amount-min)/(max-min)*112]);
 const selected=hover===null?null:points[hover];
 return <div className="price-chart"><svg viewBox="0 0 600 180" role="img" aria-label={points.length===1?'One saved quote. Save another price to see change over time.':`${points.length} personal price observations, from ${priceMoney(points[0].amount,watch.currency)} to ${priceMoney(points.at(-1)!.amount,watch.currency)}. Full values in Saved quotes and sources.`}>
  {[34,90,146].map(y=><path key={y} d={`M36 ${y}H564`} stroke="currentColor" opacity=".16"/>)}
  {points.length>1&&<polyline points={xy.map(p=>p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth="2.5"/>}
  {xy.map(([x,y],i)=><circle key={points[i].id} cx={x} cy={y} r={hover===i?6:4} fill="#d00903"><title>{new Date(points[i].observedAt).toLocaleString()} · {priceMoney(points[i].amount,watch.currency)}</title></circle>)}
  <text x="36" y="173" fill="currentColor" fontSize="12">{new Date(points[0].observedAt).toLocaleDateString()}</text>{points.length>1&&<text x="564" y="173" textAnchor="end" fill="currentColor" fontSize="12">{new Date(points.at(-1)!.observedAt).toLocaleDateString()}</text>}
 </svg>{points.length>1&&<label className="price-chart-scrub">Explore saved quotes<input aria-label="Explore saved quotes" type="range" min={0} max={points.length-1} value={hover??points.length-1} onChange={e=>setHover(Number(e.target.value))}/></label>}{selected&&<output>{priceMoney(selected.amount,watch.currency)} · {new Date(selected.observedAt).toLocaleString()}</output>}</div>;
}
