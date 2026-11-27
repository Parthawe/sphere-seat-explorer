import {useEffect,useRef} from 'react';
import {bankFrame,modelPosition,type CircuitModel,type ModelPosition} from './circuitSeating';

export default function CircuitOverview({model,selection,open,onClose,onSelect}:{model:CircuitModel;selection:ModelPosition;open:boolean;onClose:()=>void;onSelect:(bank:string)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open)dialog.current?.close();},[open]);
 const bank=model.banks.find(b=>b.id===selection.bank)!,eye=modelPosition(model,selection),frame=bankFrame(model,bank);
 const points=[...model.track,...model.banks.map(b=>b.center),...model.features.flatMap(f=>f.points)];
 const minX=Math.min(...points.map(p=>p[0]))-180,minZ=Math.min(...points.map(p=>p[1]))-180;
 const width=Math.max(...points.map(p=>p[0]))-minX+180,height=Math.max(...points.map(p=>p[1]))-minZ+180;
 const marker=Math.max(width,height)/48,ray=190,half=35*Math.PI/180;
 const tip=(angle:number)=>`${eye[0]+Math.sin(angle)*ray},${eye[2]+Math.cos(angle)*ray}`;
 const polygon=(b:typeof bank)=>{const f=bankFrame(model,b),c=Math.cos(f.yaw),s=Math.sin(f.yaw),depth=b.kind==='lawn'?27:b.rows*.44+2;return [[-b.width/2,-depth],[b.width/2,-depth],[b.width/2,depth],[-b.width/2,depth]].map(([x,z])=>`${b.center[0]+x*c+z*s},${b.center[1]-x*s+z*c}`).join(' ');};
 return <dialog ref={dialog} className="circuit-overview-dialog" aria-labelledby="circuit-overview-title" onCancel={onClose} onClose={onClose}>
  <header><div><h2 id="circuit-overview-title">{model.name}</h2><p>{model.country} · {model.season} · {model.banks.length} modeled banks</p></div><button type="button" onClick={onClose} aria-label="Close circuit map">×</button></header>
  <div className="circuit-overview-layout">
   <div className="circuit-overview-drawing"><span className="circuit-overview-north" aria-label="North is up">N ↑</span>
    <svg viewBox={`${minX} ${minZ} ${width} ${height}`} role="img" aria-label={`Full ${model.country} circuit map. Selected ${bank.name}. Numbered markers correspond to viewing bank buttons. Shaded fan shows an illustrative 70 degree horizontal view direction.`}>
     <polyline points={model.track.map(p=>p.join(',')).join(' ')} fill="none" stroke="#abb1bb" strokeWidth={24} strokeLinejoin="round"/>
     <polyline points={model.track.map(p=>p.join(',')).join(' ')} fill="none" stroke="#f3f4f6" strokeWidth={12} strokeLinejoin="round"/>
     {model.features.map(f=><path key={f.id} d={[f.points,...(f.holes??[])].map(r=>'M'+r.map(p=>p.join(',')).join(' L')+' Z').join(' ')} fill={f.kind==='water'?'#b4d0db':'#dde0e6'} stroke="#a4acba" strokeWidth={3} fillRule="evenodd"/>)}
     {model.banks.map(b=><polygon key={b.id} points={polygon(b)} fill={b.id===bank.id?'#e10600':'#546377'} fillOpacity={.65} stroke={b.footprint?'#1b2739':'#546377'} strokeWidth={4} strokeDasharray={b.footprint?undefined:'10 7'}/>)}
     <polygon points={`${eye[0]},${eye[2]} ${tip(frame.yaw-half)} ${tip(frame.yaw+half)}`} fill="#e10600" fillOpacity={.15} stroke="#e10600" strokeWidth={3} strokeDasharray="9 7"/>
     <circle cx={eye[0]} cy={eye[2]} r={marker*.23} fill="#e10600" stroke="white" strokeWidth={3}/>
     {model.banks.map((b,i)=>{const x=b.center[0]+(b.mapLabelOffset?.[0]??0),z=b.center[1]+(b.mapLabelOffset?.[1]??0);return <g key={b.id}>{b.mapLabelOffset&&<><line x1={b.center[0]} y1={b.center[1]} x2={x} y2={z} stroke="#546377" strokeWidth={4}/><circle cx={b.center[0]} cy={b.center[1]} r={marker*.16} fill="#546377"/></>}<circle cx={x} cy={z} r={marker} fill={b.id===bank.id?'#e10600':'#172232'} stroke="#fff" strokeWidth={4}/><text x={x} y={z} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={marker*1.15} fontFamily="sans-serif" fontWeight={500}>{i+1}</text></g>;})}
    </svg>
    <div className="circuit-overview-legend"><span>Solid: footprint-aligned bank</span><span>Dashed: estimated region</span></div>
   </div>
   <section className="circuit-overview-banks" aria-label="Choose a viewing bank"><h3>Choose your bank</h3><p>The selection updates your 3D view.</p>{model.banks.map((b,i)=><button type="button" key={b.id} aria-pressed={selection.bank===b.id} onClick={()=>onSelect(b.id)}><span>{i+1}</span><div><strong>{b.name}</strong><small>{b.footprint?'OSM footprint · facing inferred':'Estimated viewing region'}</small></div></button>)}</section>
  </div>
  <footer><div><strong>{bank.name}</strong><p>The shaded fan illustrates a 70° horizontal view. It does not measure visibility, obstructions or the camera’s current zoom. North is up; distances use adapted OSM geography.{model.banks.some(b=>b.mapLabelOffset)&&' Leader lines connect labels to their estimated regions.'}</p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a></div><button type="button" onClick={onClose}>Return to selected view</button></footer>
 </dialog>;
}
