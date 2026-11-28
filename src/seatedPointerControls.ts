import {MathUtils,PerspectiveCamera,Vector3} from 'three';

type Point={x:number;y:number};
export function pinchedFieldOfView(fov:number,previousDistance:number,distance:number,max=105){
 if(!Number.isFinite(previousDistance)||!Number.isFinite(distance)||previousDistance<4||distance<4)return fov;
 return MathUtils.clamp(MathUtils.radToDeg(2*Math.atan(Math.tan(MathUtils.degToRad(fov)/2)*previousDistance/distance)),35,max);
}

/** One finger looks; two fingers change the lens without translating the seat eye. */
export function attachSeatedPointerControls(element:HTMLElement,camera:PerspectiveCamera,{
 onStart,onLook,onZoom,invalidate,pitchLimits=[-1.1,.7],maxFov=105,wheelScale=.03,
}:{onStart:()=>void;onLook:(yaw:number,pitch:number)=>void;onZoom?:(fov:number)=>void;invalidate:()=>void;pitchLimits?:[number,number];maxFov?:number;wheelScale?:number}){
 const pointers=new Map<number,Point>();let last:Point|null=null,pinch:number|null=null,yaw=0,pitch=0;
 const sync=()=>{const direction=camera.getWorldDirection(new Vector3());yaw=Math.atan2(direction.x,direction.z);pitch=Math.asin(MathUtils.clamp(direction.y,-1,1));};
 const distance=()=>{const [a,b]=[...pointers.values()];return a&&b?Math.hypot(a.x-b.x,a.y-b.y):null;};
 const zoom=(fov:number)=>{camera.fov=fov;camera.updateProjectionMatrix();onZoom?.(fov);invalidate();};
 const down=(event:PointerEvent)=>{
  if(event.pointerType!=='touch'&&event.button!==0)return;
  onStart();if(!pointers.size)sync();
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});element.setPointerCapture(event.pointerId);
  if(pointers.size===1)last=pointers.get(event.pointerId)!;else{last=null;pinch=distance();}
 };
 const move=(event:PointerEvent)=>{
  if(!pointers.has(event.pointerId))return;
  const point={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,point);
  if(pointers.size>1){const next=distance();if(next!==null&&pinch!==null)zoom(pinchedFieldOfView(camera.fov,pinch,next,maxFov));pinch=next;return;}
  if(last){yaw-=(point.x-last.x)*.003;pitch=MathUtils.clamp(pitch+(point.y-last.y)*.003,...pitchLimits);onLook(yaw,pitch);invalidate();}
  last=point;
 };
 const up=(event:PointerEvent)=>{
  if(!pointers.delete(event.pointerId))return;
  if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId);
  pinch=distance();last=pointers.size===1?[...pointers.values()][0]:null;if(last)sync();
 };
 const wheel=(event:WheelEvent)=>{event.preventDefault();zoom(MathUtils.clamp(camera.fov+event.deltaY*wheelScale,35,maxFov));};
 element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('lostpointercapture',up);element.addEventListener('wheel',wheel,{passive:false});
 return ()=>{
  element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('lostpointercapture',up);element.removeEventListener('wheel',wheel);
  for(const id of pointers.keys())if(element.hasPointerCapture(id))element.releasePointerCapture(id);
 };
}
