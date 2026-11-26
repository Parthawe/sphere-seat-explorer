import {calendars,type Race} from './races';
const circuitIds:Record<string,string>={australia:'au-1953',china:'cn-2004',japan:'jp-1962',miami:'us-2022',canada:'ca-1978',monaco:'mc-1929','barcelona-catalunya':'es-1991',austria:'at-1969','great-britain':'gb-1948',belgium:'be-1925',hungary:'hu-1986',netherlands:'nl-1948',italy:'it-1922',spain:'es-2026',azerbaijan:'az-2016',bahrain:'bh-2002',singapore:'sg-2008','united-states':'us-2012',mexico:'mx-1962',brazil:'br-1940','las-vegas':'us-2023',qatar:'qa-2004','united-arab-emirates':'ae-2009','saudi-arabia':'sa-2021',portugal:'pt-2008',turkey:'tr-2005'};
export function circuitLayoutId(season:number,race:string){if((season!==2026&&season!==2027)||!calendars[season].some(r=>r.slug===race))return undefined;return season===2026&&race==='bahrain'?'my-1999':circuitIds[race];}
export type CircuitLayout={id:string;name:string;points:number[][];source:string;licence:string;credit:string;snapshot:string;note:string};
export function validateCircuitLayout(data:unknown,race:Pick<Race,'season'|'slug'>):CircuitLayout|null {
 if(!data||typeof data!=='object')return null;const d=data as CircuitLayout;
 if(d.id!==circuitLayoutId(race.season,race.slug)||!Array.isArray(d.points)||d.points.length<20||d.points.length>5000||d.points.some(p=>!Array.isArray(p)||p.length!==2||p.some(n=>typeof n!=='number'||!Number.isFinite(n))))return null;
 if(!d.name||!d.credit||!d.note||!d.licence||!d.snapshot||typeof d.source!=='string'||!d.source.startsWith('https://'))return null;
 const xs=d.points.map(p=>p[0]),zs=d.points.map(p=>p[1]);if(Math.max(...xs)-Math.min(...xs)<1||Math.max(...zs)-Math.min(...zs)<1)return null;return d;
}
