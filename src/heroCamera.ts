import {seatPosition,seatTarget,type Selection} from './model';
export const HERO_SELECTION:Selection={stand:'C',row:12,seat:18,party:1};
export type HeroCameraView='circuit'|'seat';
export function heroCameraPose(view:HeroCameraView,aspect:number) {
 if(view==='seat')return {eye:seatPosition(HERO_SELECTION),target:seatTarget(HERO_SELECTION),fov:aspect<1?Math.min(100,2*Math.atan(Math.tan(72*Math.PI/360)/Math.max(.1,aspect))*180/Math.PI):72};
 return {eye:(aspect<1?[260,300,-460]:[210,260,-365]) as [number,number,number],target:[25,30,-40] as [number,number,number],fov:46};
}
export function heroCameraEase(value:number) {
 const t=Math.max(0,Math.min(1,value));return t*t*t*(t*(t*6-15)+10);
}
