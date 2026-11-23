import qatar from './qatar-geometry.json';
import bahrain from './bahrain-geometry.json';
export type CircuitId = 'qatar' | 'bahrain';
export type ModelPosition = {bank:string;section:number;row:number;seat:number};
export type ModelBank = {id:string;product:string;name:string;center:[number,number];width:number;sections:number;rows:number;seats:number;roof:boolean;kind:'assigned'|'free'|'lawn'|'check';confidence:string;source:string};
export type CircuitModel = {id:CircuitId;name:string;country:string;season:2026|2027;dates:string;track:number[][];features:{id:string;name:string;points:number[][]}[];banks:ModelBank[];source:string;ticketUrl:string;geometryUrl:string;length:number};
export const BAHRAIN_EVENT='https://www.bahraingp.com/blog/events/f1-2027/';
const qSource=(path:string)=>'https://www.lcsc.qa/ticket/'+path+'-3-day';
function footprint(id:string){const f=bahrain.features.find(f=>f.id===id)!;const p=f.points.slice(0,-1);return {center:[p.reduce((s,v)=>s+v[0],0)/p.length,p.reduce((s,v)=>s+v[1],0)/p.length] as [number,number],width:Math.max(...p.flatMap(a=>p.map(b=>Math.hypot(a[0]-b[0],a[1]-b[1]))))};}
const b=(id:string,product:string,name:string,feature:string,sections:number,rows:number,seats:number,roof=false):ModelBank=>({id,product,name,...footprint(feature),sections,rows,seats,roof,kind:'check',confidence:'OSM footprint; modeled tiers and chairs',source:BAHRAIN_EVENT});
export const circuitModels:Record<CircuitId,CircuitModel>={
 qatar:{id:'qatar',name:'Lusail International Circuit',country:'Qatar',season:2026,dates:'27–29 November 2026',track:qatar.points,features:qatar.features,source:'https://www.lcsc.qa/formula12026',ticketUrl:'https://www.lcsc.qa/formula12026',geometryUrl:'/data/qatar-geometry.json',length:qatar.length_m,banks:[
  {id:'main',product:'main',name:'Main Grandstand',center:[-216,197],width:411,sections:9,rows:18,seats:44,roof:true,kind:'assigned',confidence:'OSM permanent footprint; modeled tiers and chairs',source:qSource('main-grandstand')},
  {id:'north',product:'north',name:'North Grandstand',center:[-465,-138],width:148,sections:4,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('north-grandstand')},
  {id:'t2',product:'t2',name:'T2 Grandstand',center:[-225,-350],width:112,sections:3,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('t2-grandstand')},
  {id:'t16',product:'t16',name:'T16 Grandstand',center:[165,750],width:112,sections:3,rows:16,seats:40,roof:false,kind:'free',confidence:'Estimated temporary-stand region',source:qSource('t16-grandstand')},
  {id:'hill',product:'hill',name:'Lusail Hill',center:[-570,-398],width:90,sections:1,rows:9,seats:15,roof:false,kind:'lawn',confidence:'Estimated lawn sampling grid; no chairs',source:qSource('general-admission-lusail-hill')},
 ]},
 bahrain:{id:'bahrain',name:'Bahrain International Circuit',country:'Bahrain',season:2027,dates:'12–14 March 2027',track:bahrain.points,features:bahrain.features,source:BAHRAIN_EVENT,ticketUrl:BAHRAIN_EVENT,geometryUrl:'/data/bahrain-geometry.json',length:bahrain.length_m,banks:[
  b('main','main','Main Grandstand','187123419',8,24,44,true),
  b('turn-1','turn-1','Turn 1 Grandstand','271535967',5,18,40),
  b('beyon','beyon','Beyon / Batelco Grandstand','187123414',6,24,44,true),
  b('university-1','university','University · bank 1','271535984',2,16,40),
  b('university-2','university','University · bank 2','271535959',2,16,40),
  b('university-3','university','University · bank 3','271535961',2,16,40),
  b('victory-1','victory','Victory · bank 1','271535964',2,16,40),
  b('victory-2','victory','Victory · bank 2','271535981',2,16,40),
 ]},
};
export function findCircuitModel(season:number,race:string){const m=circuitModels[race as CircuitId];return m?.season===season?m:undefined;}
export function closestTrack(model:CircuitModel,point:readonly number[]):[number,number]{let best=Infinity,hit:[number,number]=[0,0];for(let i=1;i<model.track.length;i++){const a=model.track[i-1],b=model.track[i],dx=b[0]-a[0],dz=b[1]-a[1],f=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dz)/(dx*dx+dz*dz||1))),p:[number,number]=[a[0]+f*dx,a[1]+f*dz],d=Math.hypot(p[0]-point[0],p[1]-point[1]);if(d<best){best=d;hit=p;}}return hit;}
export function bankFrame(model:CircuitModel,bank:ModelBank){const target=closestTrack(model,bank.center),dx=target[0]-bank.center[0],dz=target[1]-bank.center[1],len=Math.hypot(dx,dz)||1;return {forward:[dx/len,dz/len] as [number,number],yaw:Math.atan2(dx,dz),target};}
export function normalizeModelPosition(model:CircuitModel,p:Partial<ModelPosition>):ModelPosition{const b=model.banks.find(b=>b.id===p.bank)??model.banks[0];const bound=(n:unknown,max:number,def:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(1,Math.min(max,Math.round(n))):def;return {bank:b.id,section:bound(p.section,b.sections,Math.ceil(b.sections/2)),row:bound(p.row,b.rows,Math.ceil(b.rows/2)),seat:bound(p.seat,b.seats,Math.ceil(b.seats/2))};}
export function localModelPosition(bank:ModelBank,p:ModelPosition):[number,number,number]{const lawn=bank.kind==='lawn',pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3);const x=((p.section-1)*(bank.seats+3)+p.seat-.5)*pitch-bank.width/2;return [x,lawn?3+(p.row-1)*.14:.7+(p.row-1)*.43,(bank.rows/2-p.row)*(lawn?3:.88)];}
export function modelPosition(model:CircuitModel,p:ModelPosition):[number,number,number]{const b=model.banks.find(b=>b.id===p.bank)!;const [x,y,z]=localModelPosition(b,p),{yaw}=bankFrame(model,b);return [b.center[0]+x*Math.cos(yaw)+z*Math.sin(yaw),y,b.center[1]-x*Math.sin(yaw)+z*Math.cos(yaw)];}
export function modelCount(bank:ModelBank){return bank.sections*bank.rows*bank.seats;}
export function positionKey(p:ModelPosition){return `${p.bank}:${p.section}:${p.row}:${p.seat}`;}
export function modelPositionUrl(origin:string,model:CircuitModel,p:ModelPosition){const u=new URL(origin);u.search=new URLSearchParams({season:String(model.season),race:model.id,screen:'circuit',bank:p.bank,section:String(p.section),modelRow:String(p.row),position:String(p.seat)}).toString();u.hash='';return u.toString();}
