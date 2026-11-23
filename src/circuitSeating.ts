import qatar from './qatar-geometry.json';
import bahrain from './bahrain-geometry.json';
import yas from './yas-geometry.json';
export type CircuitId = 'qatar' | 'bahrain' | 'united-arab-emirates';
export type ModelPosition = {bank:string;section:number;row:number;seat:number};
export type ModelBank = {id:string;product:string;name:string;center:[number,number];width:number;axis?:[number,number];footprint?:string;sections:number;rows:number;seats:number;roof:boolean;kind:'assigned'|'free'|'lawn'|'check';confidence:string;source:string};
export type CircuitModel = {id:CircuitId;name:string;country:string;season:2026|2027;dates:string;track:number[][];features:{id:string;name:string;points:number[][]}[];banks:ModelBank[];source:string;ticketUrl:string;geometryUrl:string;length:number;evidence:string};
export const BAHRAIN_EVENT='https://www.bahraingp.com/blog/events/f1-2027/';
const qSource=(path:string)=>'https://www.lcsc.qa/ticket/'+path+'-3-day';
// Fit the source polygon rather than pointing a rectangular stand at one nearby road point.
// This constrains the horizontal envelope only; seating tiers remain illustrative.
export function footprintPlacement(points:readonly (readonly number[])[]){
 const p=points.filter((v,i)=>i===0||v[0]!==points[0][0]||v[1]!==points[0][1]);
 if(p.length<3||p.some(v=>!Number.isFinite(v[0])||!Number.isFinite(v[1])))throw new Error('Invalid footprint');
 let best:{area:number;center:[number,number];width:number;axis:[number,number]}|undefined;
 for(let i=0;i<p.length;i++){
  const q=p[(i+1)%p.length],dx=q[0]-p[i][0],dz=q[1]-p[i][1],length=Math.hypot(dx,dz);if(length<1e-8)continue;
  const ux=dx/length,uz=dz/length,along=p.map(v=>v[0]*ux+v[1]*uz),across=p.map(v=>-v[0]*uz+v[1]*ux);
  const lo=Math.min(...along),hi=Math.max(...along),bottom=Math.min(...across),top=Math.max(...across),w=hi-lo,d=top-bottom,area=w*d;
  if(!best||area<best.area-1e-6){const u=(lo+hi)/2,v=(bottom+top)/2;best={area,center:[u*ux-v*uz,u*uz+v*ux],width:Math.max(w,d),axis:w>=d?[ux,uz]:[-uz,ux]};}
 }
 if(!best||best.area<1e-8)throw new Error('Degenerate footprint');
 return {center:best.center,width:best.width,axis:best.axis};
}
function footprint(data:typeof bahrain,id:string){const f=data.features.find(f=>f.id===id);if(!f)throw new Error('Missing footprint '+id);return {...footprintPlacement(f.points),footprint:id};}
const b=(id:string,product:string,name:string,feature:string,sections:number,rows:number,seats:number,roof=false):ModelBank=>({id,product,name,...footprint(bahrain,feature),sections,rows,seats,roof,kind:'check',confidence:'OSM footprint-aligned envelope; modeled tiers and chairs; facing inferred',source:BAHRAIN_EVENT});
const YAS_TICKETS='https://www.abudhabigp.com/en/formula1/tickets-2026/';
const y=(id:string,name:string,feature:string,sections:number,rows:number,seats:number):ModelBank=>({id,product:id,name,...footprint(yas,feature),sections,rows,seats,roof:true,kind:'check',confidence:'OSM footprint-aligned envelope; modeled tiers and chairs; facing inferred',source:YAS_TICKETS+id+'-grandstand-4day'});
const yRegion=(id:string,name:string,center:[number,number],width:number,sections:number):ModelBank=>({id,product:id,name,center,width,sections,rows:16,seats:40,roof:true,kind:'check',confidence:'Estimated representative bank region; not a surveyed footprint',source:YAS_TICKETS+id+'-grandstand-4day'});
export const circuitModels:Record<CircuitId,CircuitModel>={
 qatar:{id:'qatar',name:'Lusail International Circuit',country:'Qatar',season:2026,dates:'27–29 November 2026',track:qatar.points,features:qatar.features,source:'https://www.lcsc.qa/formula12026',ticketUrl:'https://www.lcsc.qa/formula12026',geometryUrl:'/data/qatar-geometry.json',length:qatar.length_m,evidence:'Main has a permanent footprint reference. North, T2, T16 and Hill are estimated regions from organizer descriptions; they are not surveyed temporary layouts.',banks:[
  {id:'main',product:'main',name:'Main Grandstand',...footprint(qatar,'152483596'),sections:9,rows:18,seats:44,roof:true,kind:'assigned',confidence:'OSM permanent footprint-aligned envelope; modeled tiers and chairs; facing inferred',source:qSource('main-grandstand')},
  {id:'north',product:'north',name:'North Grandstand',center:[-465,-138],width:148,sections:4,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('north-grandstand')},
  {id:'t2',product:'t2',name:'T2 Grandstand',center:[-225,-350],width:112,sections:3,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('t2-grandstand')},
  {id:'t16',product:'t16',name:'T16 Grandstand',center:[165,750],width:112,sections:3,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('t16-grandstand')},
  {id:'hill',product:'hill',name:'Lusail Hill',center:[-570,-398],width:90,sections:1,rows:9,seats:15,roof:false,kind:'lawn',confidence:'Estimated lawn sampling grid; no chairs',source:qSource('general-admission-lusail-hill')},
 ]},
 bahrain:{id:'bahrain',name:'Bahrain International Circuit',country:'Bahrain',season:2027,dates:'12–14 March 2027',track:bahrain.points,features:bahrain.features,source:BAHRAIN_EVENT,ticketUrl:BAHRAIN_EVENT,geometryUrl:'/data/bahrain-geometry.json',length:bahrain.length_m,evidence:'The 2027 organizer lists five grandstand products. University and Victory banks follow named OSM footprints; model sections do not establish current ticket subdivisions.',banks:[
  b('main','main','Main Grandstand','187123419',8,24,44,true),
  b('turn-1','turn-1','Turn 1 Grandstand','271535967',5,18,40),
  b('beyon','beyon','Beyon / Batelco Grandstand','187123414',6,24,44,true),
  b('university-1','university','University · bank 1','271535984',2,16,40),
  b('university-2','university','University · bank 2','271535959',2,16,40),
  b('university-3','university','University · bank 3','271535961',2,16,40),
  b('victory-1','victory','Victory · bank 1','271535964',2,16,40),
  b('victory-2','victory','Victory · bank 2','271535981',2,16,40),
 ]},
 'united-arab-emirates':{id:'united-arab-emirates',name:'Yas Marina Circuit',country:'Abu Dhabi',season:2026,dates:'3–6 December 2026 · 4-day products',track:yas.points,features:yas.features,source:YAS_TICKETS,ticketUrl:YAS_TICKETS,geometryUrl:'/data/yas-geometry.json',length:yas.length_m,evidence:'Five named OSM stand polygons provide geographic context. Main, Marina and South use footprint-aligned envelopes; curved North and West stands use estimated representative banks within their broad regions. North Straight and West Straight are estimated regions. Surrounding water, hotel architecture, bridges and event structures are not reconstructed. Terrain and track elevations are flattened.',banks:[
  y('main','Main Grandstand','188731381',8,20,40),
  yRegion('north','North Grandstand',[30,-930],110,3),
  yRegion('north-straight','North Straight Grandstand',[-170,-420],120,3),
  yRegion('west-straight','West Straight Grandstand',[-300,-65],120,3),
  yRegion('west','West Grandstand',[-390,230],105,3),
  y('marina','Marina Grandstand','133907079',4,18,40),
  y('south','South Grandstand','133907081',4,18,40),
 ]},
};
export function findCircuitModel(season:number,race:string){const m=circuitModels[race as CircuitId];return m?.season===season?m:undefined;}
export function closestTrack(model:CircuitModel,point:readonly number[]):[number,number]{let best=Infinity,hit:[number,number]=[0,0];for(let i=1;i<model.track.length;i++){const a=model.track[i-1],b=model.track[i],dx=b[0]-a[0],dz=b[1]-a[1],f=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dz)/(dx*dx+dz*dz||1))),p:[number,number]=[a[0]+f*dx,a[1]+f*dz],d=Math.hypot(p[0]-point[0],p[1]-point[1]);if(d<best){best=d;hit=p;}}return hit;}
export function bankFrame(model:CircuitModel,bank:ModelBank){
 const target=closestTrack(model,bank.center),dx=target[0]-bank.center[0],dz=target[1]-bank.center[1],len=Math.hypot(dx,dz)||1;
 let forward:[number,number]=[dx/len,dz/len];
 if(bank.axis){forward=[-bank.axis[1],bank.axis[0]];if(forward[0]*dx+forward[1]*dz<0)forward=[-forward[0],-forward[1]];}
 return {forward,yaw:Math.atan2(forward[0],forward[1]),target};
}
export function normalizeModelPosition(model:CircuitModel,p:Partial<ModelPosition>):ModelPosition{const b=model.banks.find(b=>b.id===p.bank)??model.banks[0];const bound=(n:unknown,max:number,def:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(1,Math.min(max,Math.round(n))):def;return {bank:b.id,section:bound(p.section,b.sections,Math.ceil(b.sections/2)),row:bound(p.row,b.rows,Math.ceil(b.rows/2)),seat:bound(p.seat,b.seats,Math.ceil(b.seats/2))};}
export function localModelPosition(bank:ModelBank,p:ModelPosition):[number,number,number]{const lawn=bank.kind==='lawn',pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3);const x=((p.section-1)*(bank.seats+3)+p.seat-.5)*pitch-bank.width/2;return [x,lawn?3+(p.row-1)*.14:.7+(p.row-1)*.43,(bank.rows/2-p.row)*(lawn?3:.88)];}
export function modelPosition(model:CircuitModel,p:ModelPosition):[number,number,number]{const b=model.banks.find(b=>b.id===p.bank)!;const [x,y,z]=localModelPosition(b,p),{yaw}=bankFrame(model,b);return [b.center[0]+x*Math.cos(yaw)+z*Math.sin(yaw),y,b.center[1]-x*Math.sin(yaw)+z*Math.cos(yaw)];}
export function modelCount(bank:ModelBank){return bank.sections*bank.rows*bank.seats;}
export function positionKey(p:ModelPosition){return `${p.bank}:${p.section}:${p.row}:${p.seat}`;}
export function modelPositionUrl(origin:string,model:CircuitModel,p:ModelPosition){const u=new URL(origin);u.search=new URLSearchParams({season:String(model.season),race:model.id,screen:'circuit',bank:p.bank,section:String(p.section),modelRow:String(p.row),position:String(p.seat)}).toString();u.hash='';return u.toString();}

/** Fit overview framing to each physical venue and viewport, with room for scene controls. */
export function circuitOverviewCamera(model:CircuitModel,aspect:number,verticalFraction=.7){
 const points:number[][]=model.track.map(p=>[p[0],0,p[1]]);
 for(const b of model.banks){const {yaw}=bankFrame(model,b),c=Math.cos(yaw),s=Math.sin(yaw);for(const x of [-b.width/2,b.width/2])for(const z of [-b.rows*.44-3,b.rows*.44+3])for(const y of [0,b.rows*.43+6])points.push([b.center[0]+x*c+z*s,y,b.center[1]-x*s+z*c]);}
 const target:[number,number,number]=[(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,0,(Math.min(...points.map(p=>p[2]))+Math.max(...points.map(p=>p[2])))/2];
 const length=Math.hypot(.6,1,.9),normal=[.6/length,1/length,.9/length],rLength=Math.hypot(normal[0],normal[2]),right=[normal[2]/rLength,0,-normal[0]/rLength],up=[-normal[1]*normal[0]/rLength,rLength,-normal[1]*normal[2]/rLength];
 const tan=Math.tan(Math.PI/8),ratio=Number.isFinite(aspect)&&aspect>0?aspect:1;let distance=500;
 for(const p of points){const v=p.map((n,i)=>n-target[i]),depth=v.reduce((n,a,i)=>n+a*normal[i],0),x=v.reduce((n,a,i)=>n+a*right[i],0),y=v.reduce((n,a,i)=>n+a*up[i],0);distance=Math.max(distance,depth+Math.abs(x)/(tan*ratio*.82),depth+Math.abs(y)/(tan*verticalFraction));}
 return {eye:target.map((n,i)=>n+normal[i]*distance) as [number,number,number],target};
}
