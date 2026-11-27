import {useEffect,useMemo,useRef,useState} from 'react';
import {getStand} from './model';
import {points} from './racingLine';
import {nearestTrackFraction} from './rendering';
import {replaySample,replayTime,sectionPasses,type HistoricalRace,type ReplayFrame} from './replayMath';
export function HistoricalReplay({standId,onChange,onClose,onReferences}:{standId:string;onChange:(frame:ReplayFrame|null)=>void;onClose:()=>void;onReferences?:()=>void}){
 const [data,setData]=useState<HistoricalRace|null>(null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[time,setTime]=useState(0),[focus,setFocus]=useState(63),[compact,setCompact]=useState(false);
 useEffect(()=>{const pause=()=>setPlaying(false);window.addEventListener("apexreplaypause",pause);return()=>window.removeEventListener("apexreplaypause",pause);},[]);
 const clock=useRef(0),lastPaint=useRef(0);
 const stand=getStand(standId);
 const fraction=useMemo(()=>nearestTrackFraction(points,stand.center),[standId]);
 const passes=useMemo(()=>data?sectionPasses(data,fraction):[],[data,fraction]);
 useEffect(()=>{const abort=new AbortController();setError(false);setData(null);
  fetch('/historical/las-vegas-2024-opening.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('Unavailable');return r.json();}).then((d:HistoricalRace)=>{if(d.session!==9644||d.drivers.length!==20)throw new Error('Incomplete');setData(d);}).catch(e=>{if(e.name!=='AbortError')setError(true);});
  return()=>abort.abort();
 },[attempt]);
 useEffect(()=>{onChange(data?{data,clock,playing}:null);},[data,playing,onChange]);
 useEffect(()=>()=>onChange(null),[onChange]);
 const seek=(t:number)=>{clock.current=Math.max(0,Math.min(data?.duration??0,t));setTime(clock.current);window.dispatchEvent(new Event('apexreplaychange'));};
 useEffect(()=>{if(!data)return;const first=passes[0];clock.current=Math.max(0,(first?.time??0)-4);setTime(clock.current);window.dispatchEvent(new Event('apexreplaychange'));},[data,fraction]);
 useEffect(()=>{if(!playing||!data)return;let previous=0,id=0;
  const tick=(now:number)=>{if(previous)clock.current=Math.min(data.duration,clock.current+Math.min((now-previous)/1000,.1)*speed);previous=now;
   if(now-lastPaint.current>100){setTime(clock.current);lastPaint.current=now;}
   if(clock.current>=data.duration){setPlaying(false);setTime(data.duration);return;}id=requestAnimationFrame(tick);};
  id=requestAnimationFrame(tick);const hide=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',hide);
  return()=>{cancelAnimationFrame(id);document.removeEventListener('visibilitychange',hide);};
 },[playing,speed,data]);
 const driver=data?.drivers.find(d=>d.number===focus),sample=driver?replaySample(driver,time):null;
 const next=passes.filter(p=>p.time>=time-.3).slice(0,3);
 return <section className={"historical-replay"+(compact?" replay-compact":"")} aria-label="Historical race replay">
  <header><div><span className="context-note">RACE ARCHIVE / 2024</span><h2>Watch the field pass.</h2></div><button className="replay-size" onClick={()=>setCompact(c=>!c)}>{compact?"Details":"Watch from seat"}</button><button className="replay-close" onClick={onClose} aria-label="Close historical replay">×</button></header>
  {error?<div className="replay-status" role="alert"><p>The race archive could not load.</p><button onClick={()=>setAttempt(a=>a+1)}>Retry archive</button></div>:!data?<div className="replay-status" role="status">Loading 20 drivers and recorded positions…</div>:<>
  <div className="replay-context"><strong>LAS VEGAS · OPENING FIELD</strong><span>{data.date} · first 2:09 of race</span></div>
  <div className="replay-track-row"><svg className="replay-track" viewBox="-30 -30 660 1060" role="img" aria-label="Full circuit tracker using recorded car positions">
   <polyline points={data.track.map(p=>p.join(',')).join(' ')} fill="none" stroke="#5a6275" strokeWidth="15" strokeLinejoin="round"/>
   {data.drivers.map(d=>{const p=replaySample(d,time);return p?<g key={d.number}><circle cx={p[2]} cy={p[3]} r={d.number===focus?22:13} fill={d.color} stroke={d.number===focus?'#fff':'#0c101b'} strokeWidth="5"><title>{d.name}</title></circle>{d.number===focus&&<text x={p[2]+32} y={p[3]+10} fill="#fff" fontSize="48">{d.code}</text>}</g>:null;})}
  </svg><div className="replay-driver"><label htmlFor="replay-driver">Follow a driver</label><select id="replay-driver" value={focus} onChange={e=>setFocus(Number(e.target.value))}>{data.drivers.map(d=><option key={d.number} value={d.number}>{d.number} · {d.name}</option>)}</select><strong style={{color:driver?.color}}>{driver?.code} <span>{sample?.[4]??'—'} <small>km/h</small></span></strong><p>Recorded speed<br/>Full circuit shows all 20 cars.</p></div></div>
  <div className="replay-timeline"><label htmlFor="replay-time">Race elapsed <output>{replayTime(time)} / 2:09.0</output></label><input id="replay-time" aria-label="Historical race time" type="range" min="0" max={data.duration} step="0.1" value={time} onChange={e=>seek(Number(e.target.value))}/></div>
  <div className="replay-actions"><button className="replay-play" onClick={()=>{if(clock.current>=data.duration)seek(0);setPlaying(!playing);}}>{playing?'Pause replay':'Play replay'}</button><select aria-label="Replay speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.25,.5,1,2,4].map(s=><option key={s} value={s}>{s}× speed</option>)}</select><button onClick={()=>{const p=passes.find(p=>p.time>time+1)??passes[0];if(p)seek(Math.max(0,p.time-3));}}>Next pass</button></div>
  {onReferences&&<button className="replay-photo-link" onClick={()=>{setPlaying(false);onReferences();}}>Photos & fan reports</button>}
  <div className="replay-passes"><div><strong>Near {stand.name}</strong><span>Estimated crossing</span></div>{next.length?next.map((p,i)=><button key={p.driver.number+'-'+p.time} onClick={()=>{setFocus(p.driver.number);seek(Math.max(0,p.time-3));}}><i style={{background:p.driver.color}}/><b>{p.driver.code}</b><span>{replayTime(p.time)}</span><small>{i?'+'+(p.time-next[i-1].time).toFixed(2)+'s':'next'}</small></button>):<p>No more passes in this clip. Scrub back to replay.</p>}</div>
  <details className="replay-method"><summary>How this replay is reconstructed</summary><p>Recorded OpenF1 locations and speeds drive the replay. Cars in 3D follow our estimated centerline; their lateral lines, overtakes and exact visibility from a seat are unverified. Crossing times depend on this approximate mapping. This clip is historical, not a forecast for 2026 or 2027.</p><a href="https://openf1.org/docs/#location" target="_blank" rel="noreferrer">OpenF1 data and methodology</a><a href="https://www.formula1.com/en/results/2024/races/1250/las-vegas/race-result" target="_blank" rel="noreferrer">Official 2024 race result</a></details>
  </>}
 </section>;
}
