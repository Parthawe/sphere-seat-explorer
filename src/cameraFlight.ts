import {Vector3,type PerspectiveCamera} from 'three';

/** Zero velocity and acceleration at both ends of a deliberate camera move. */
export function flightEase(progress:number){
 const t=Math.max(0,Math.min(1,progress));
 return t*t*t*(t*(t*6-15)+10);
}
export function flightDuration(distance:number){
 return Math.min(1.35,.32+Math.sqrt(Math.max(0,distance))*.035);
}
/** Demand rendering may resume after a long idle; use the flight's own clock. */
export function flightProgress(started:number,now:number,duration:number){
 return duration<=0?1:Math.max(0,Math.min(1,(now-started)/(duration*1000)));
}
/** Reuses caller-owned vectors; no allocations in the render loop. */
export function sampleFlight(from:Vector3,to:Vector3,fromTarget:Vector3,toTarget:Vector3,progress:number,eye:Vector3,target:Vector3){
 const eased=flightEase(progress),distance=from.distanceTo(to);
 eye.lerpVectors(from,to,eased);
 if(distance>20)eye.y+=Math.sin(Math.PI*eased)**2*Math.min(distance*.1,35);
 target.lerpVectors(fromTarget,toTarget,eased);
 return eased;
}

/** Finish arrival before handing a seated camera to direct manipulation. */
export function settleCamera(camera:PerspectiveCamera,target:Vector3,eye:Vector3,look:Vector3,fov:number){
 camera.position.copy(eye);target.copy(look);camera.fov=fov;camera.updateProjectionMatrix();camera.lookAt(target);
}
