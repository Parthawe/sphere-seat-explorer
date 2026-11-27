import type {CircuitLayout} from './circuitLayouts';
import type {Race} from './races';

export type StudySelection={sample:number;height:'low'|'mid'|'high';side:'left'|'right';camera:'overview'|'sample'};
export type StudyGeometry={points:[number,number][];distances:number[];length:number};
export const STUDY_CAMERA={low:{height:.35,offset:.21},mid:{height:.545,offset:.45},high:{height:.675,offset:.62}} as const;
export function readStudySelection(search:string):StudySelection {
 const p=new URLSearchParams(search),value=Number(p.get('sample')??12.5);
 return {sample:Number.isFinite(value)?Math.max(0,Math.min(99.5,value)):12.5,height:p.get('height')==='low'?'low':p.get('height')==='high'?'high':'mid',side:p.get('side')==='right'?'right':'left',camera:p.get('camera')==='sample'?'sample':'overview'};
}
export function circuitStudyUrl(race:Pick<Race,'season'|'slug'>,selection?:StudySelection){
 const p=new URLSearchParams({season:String(race.season),race:race.slug,screen:'track-study'});
 if(selection){p.set('sample',String(selection.sample));p.set('height',selection.height);p.set('side',selection.side);p.set('camera',selection.camera);}
 return '?'+p;
}
/** Unitless tabletop geometry. No elevation, road-width or ticket-position claim. */
export function buildStudyGeometry(layout:CircuitLayout):StudyGeometry {
 const xs=layout.points.map(p=>p[0]),zs=layout.points.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),span=Math.max(x1-x0,z1-z0);
 const points=layout.points.map(p=>[(p[0]-(x0+x1)/2)/span*12,(p[1]-(z0+z1)/2)/span*12] as [number,number]);
 const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 return {points,distances,length:distances.at(-1)!};
}
export function sampleStudy(geometry:StudyGeometry,sample:number){
 const distance=Math.max(0,Math.min(.999999,Number.isFinite(sample)?sample/100:0))*geometry.length;
 let i=1;while(i<geometry.points.length-1&&geometry.distances[i]<=distance)i++;
 const a=geometry.points[i-1],b=geometry.points[i],segment=geometry.distances[i]-geometry.distances[i-1],t=segment?(distance-geometry.distances[i-1])/segment:0;
 const tangent:[number,number]=segment?[(b[0]-a[0])/segment,(b[1]-a[1])/segment]:[1,0];
 return {point:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t] as [number,number],tangent,normal:[-tangent[1],tangent[0]] as [number,number]};
}
