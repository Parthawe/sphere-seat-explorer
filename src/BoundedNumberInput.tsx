import {useEffect,useState} from 'react';

/** Keep incomplete edits local instead of forcing an empty field back to position 1. */
export default function BoundedNumberInput({value,max,label,onCommit}:{value:number;max:number;label:string;onCommit:(value:number)=>void}) {
 const [draft,setDraft]=useState(String(value));
 useEffect(()=>setDraft(String(value)),[value,max]);
 function finish(){
  const number=draft.trim()?Number(draft):value;
  const next=Math.max(1,Math.min(max,Number.isFinite(number)?Math.round(number):value));
  setDraft(String(next));if(next!==value)onCommit(next);
 }
 return <input type="number" inputMode="numeric" aria-label={label} min={1} max={max} step={1} value={draft}
  onChange={event=>{const next=event.target.value;setDraft(next);const number=Number(next);if(next.trim()&&Number.isInteger(number)&&number>=1&&number<=max)onCommit(number);}}
  onBlur={finish} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();finish();}}}/>;
}
