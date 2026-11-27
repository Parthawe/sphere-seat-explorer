import type {CircuitLayout} from './circuitLayouts';
import type {Race} from './races';

export type StudyGeometry={points:[number,number][];distances:number[];length:number};
/** Old sample/side/height parameters never create seating or a seat camera. */
export function circuitStudyUrl(race:Pick<Race,'season'|'slug'>){
 return '?'+new URLSearchParams({season:String(race.season),race:race.slug,screen:'track-study'});
}
/** Unitless tabletop geometry. No elevation, road-width or ticket-position claim. */
export function buildStudyGeometry(layout:CircuitLayout):StudyGeometry {
 const xs=layout.points.map(p=>p[0]),zs=layout.points.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),span=Math.max(x1-x0,z1-z0);
 const points=layout.points.map(p=>[(p[0]-(x0+x1)/2)/span*12,(p[1]-(z0+z1)/2)/span*12] as [number,number]);
 const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 return {points,distances,length:distances.at(-1)!};
}
