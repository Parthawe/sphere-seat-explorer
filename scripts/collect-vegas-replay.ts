/** Refresh the bounded historical clip. No API credentials or live requests needed by visitors. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { curve, points } from '../src/racingLine';
import { route } from '../src/racingLine';
const api = 'https://api.openf1.org/v1/';
const start = Date.parse('2024-11-24T06:03:40.010Z');
const queries = {
  drivers: 'drivers?session_key=9644',
  locations: 'location?session_key=9644&date%3E=2024-11-24T06:03:40&date%3C=2024-11-24T06:05:50',
  reference: 'location?session_key=9644&driver_number=63&date%3E=2024-11-24T06:05:23.754&date%3C=2024-11-24T06:07:02.831',
  speeds: 'car_data?session_key=9644&date%3E=2024-11-24T06:03:40&date%3C=2024-11-24T06:05:50',
};
const raw: Record<string, any[]> = {};
for (const [name, query] of Object.entries(queries)) {
  // Optional local cache avoids repeating requests during collection QA.
  const cache = process.env.REPLAY_CACHE;
  if (cache) raw[name] = JSON.parse(await readFile(`${cache}/vegas-${name === 'speeds' ? 'car-data' : name}.json`, 'utf8'));
  else {
    const response = await fetch(api + query);
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    raw[name] = await response.json();
  }
}
const reference = raw.reference.filter(p => p.x || p.y);
// Corresponding landmarks on the recorded lap and the estimated 3D centerline.
// This deliberately removes lateral movement: it must never be described as an exact racing line.
const anchors = [[0,22],[20,23],[40,26],[60,0],[100,1],[120,2],[140,3],[160,4],[180,8],[220,14],[240,15],[280,17],[320,20],[340,21],[389,22]];
let previous = -1;
const mapped = anchors.map(([index, vertex]) => {
 const [x,z] = route[vertex];
 let best=Infinity, at=0;
 points.forEach((p,i)=> { const d=(p.x-x)**2+(p.z-z)**2; if(d<best){best=d;at=i/(points.length-1);} });
 while(at < previous) at += 1;
 previous=at;
 return [index,at];
});
function project(p: any) {
 let best=Infinity,index=0;
 reference.forEach((r,i)=>{const d=(p.x-r.x)**2+(p.y-r.y)**2;if(d<best){best=d;index=i;}});
 const upper=Math.max(1,mapped.findIndex(a=>a[0]>=index));
 const a=mapped[upper-1],b=mapped[upper];
 return (a[1]+(b[1]-a[1])*(index-a[0])/(b[0]-a[0]))%1;
}
const xs=reference.map(p=>p.x),ys=reference.map(p=>p.y);
const minX=Math.min(...xs),maxY=Math.max(...ys),scale=1000/Math.max(Math.max(...xs)-minX,maxY-Math.min(...ys));
const xy=(p:any)=>[Math.round((p.x-minX)*scale),Math.round((maxY-p.y)*scale)];
const drivers=raw.drivers.map(d=> {
 const speeds=raw.speeds.filter(p=>p.driver_number===d.driver_number);
 const samples=raw.locations.filter(p=>p.driver_number===d.driver_number&&(p.x||p.y)).map(p=>{
  const t=(Date.parse(p.date)-start)/1000;
  let speed=null,best=Infinity;
  for(const s of speeds){const gap=Math.abs(Date.parse(s.date)-Date.parse(p.date));if(gap<best){best=gap;speed=s.speed;}}
  return [Math.round(t*1000)/1000,Number(project(p).toFixed(6)),...xy(p),best<1500?speed:null];
 }).sort((a,b)=>Number(a[0])-Number(b[0]));
 return {number:d.driver_number,code:d.name_acronym,name:d.full_name,team:d.team_name,color:'#'+d.team_colour,samples};
});
if(drivers.length!==20||drivers.some(d=>d.samples.length<100))throw new Error('Incomplete field');
const data={title:'Las Vegas 2024 · Opening field',session:9644,date:'23 November 2024',startUtc:new Date(start).toISOString(),duration:129,recordedAt:new Date().toISOString(),sources:Object.values(queries).map(q=>api+q),method:'Recorded locations and speeds from OpenF1. 3D cars are projected onto an estimated centerline using landmark correspondence. Lateral lines, overtakes and seat visibility are not verified. Full-circuit tracker uses recorded XY positions.',track:reference.filter((_,i)=>i%3===0).map(xy),drivers};
await mkdir('public/historical',{recursive:true});
await writeFile('public/historical/las-vegas-2024-opening.json',JSON.stringify(data));
console.log(`Saved ${drivers.length} drivers; ${drivers.reduce((n,d)=>n+d.samples.length,0)} location samples.`);
