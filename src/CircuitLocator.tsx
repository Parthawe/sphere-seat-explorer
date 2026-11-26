import UiIcon from './UiIcon';
import {bankFrame,modelPosition,type CircuitModel,type ModelPosition} from './circuitSeating';
export default function CircuitLocator({model,selection,onOpen}:{model:CircuitModel;selection:ModelPosition;onOpen:()=>void}) {
 const bank=model.banks.find(item=>item.id===selection.bank)!;
 const eye=modelPosition(model,selection),frame=bankFrame(model,bank);
 const points=[...model.track,...model.banks.map(item=>item.center),[eye[0],eye[2]]];
 const xs=points.map(point=>point[0]),ys=points.map(point=>point[1]);
 const span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1),pad=span*.09;
 const x=Math.min(...xs)-pad,y=Math.min(...ys)-pad,w=Math.max(...xs)-x+pad,h=Math.max(...ys)-y+pad;
 const dot=span/75,ray=span*.13,half=Math.PI*35/180;
 const edge=(angle:number)=>`${eye[0]+Math.sin(angle)*ray},${eye[2]+Math.cos(angle)*ray}`;
 return <button className="circuit-locator" aria-label="Circuit map & viewing banks" onClick={onOpen} title="Open the circuit map. Position and direction are illustrative.">
  <svg viewBox={`${x} ${y} ${w} ${h}`} aria-hidden="true">
   <polyline points={model.track.map(point=>point.join(',')).join(' ')} fill="none" stroke="#7f899c" strokeWidth={span/130} strokeLinejoin="round"/>
   {model.banks.map(item=><circle key={item.id} cx={item.center[0]} cy={item.center[1]} r={dot*.65} fill={item.id===bank.id?'#ff342e':'#8d98aa'}/>)}
   <polygon points={`${eye[0]},${eye[2]} ${edge(frame.yaw-half)} ${edge(frame.yaw+half)}`} fill="#ff342e" fillOpacity=".25" stroke="#ff342e" strokeWidth={span/340}/>
   <circle cx={eye[0]} cy={eye[2]} r={dot} fill="#ff342e" stroke="#fff" strokeWidth={span/400}/>
  </svg>
  <span className="circuit-locator-caption"><span><UiIcon name="map"/><strong>Circuit map</strong></span><UiIcon name="arrow"/></span>
 </button>;
}
