import {groundHeight,type HeightField} from './circuitTerrain';
import spa from './spa-geometry.json';
import qatar from './qatar-geometry.json';
import bahrain from './bahrain-geometry.json';
import yas from './yas-geometry.json';
import albert from './albert-park-geometry.json';
import silverstone from './silverstone-geometry.json';
export type CircuitId = 'qatar' | 'bahrain' | 'united-arab-emirates' | 'australia' | 'great-britain' | 'belgium';
export type ModelPosition = {bank:string;section:number;row:number;seat:number};
export type ModelBank = {id:string;product:string;name:string;center:[number,number];width:number;axis?:[number,number];footprint?:string;sections:number;rows:number;seats:number;roof:boolean;kind:'assigned'|'free'|'lawn'|'check';confidence:string;source:string;officialView?:boolean;admissionNote?:string};
export type CircuitModel = {id:CircuitId;name:string;country:string;season:2026|2027;dates:string;track:number[][];trackHeights?:number[];terrain?:HeightField;features:{id:string;name:string;points:number[][];kind?:string;holes?:number[][][]}[];vegetation?:{id:string;point:number[]}[];appearance?:'day';checked?:string;defaultBank?:string;pitBank?:string;banks:ModelBank[];unmappedProducts?:{id:string;name:string;source:string;note:string}[];source:string;ticketUrl:string;geometryUrl:string;length:number;evidence:string};
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
export const MELBOURNE_GUIDE='https://travel.grandprix.com.au/blog/grandstand-guide-2027';
export const MELBOURNE_TICKETS='https://www.grandprix.com.au/en/tickets';
const parkBank=(id:string,name:string,center:[number,number],sections=3,rows=16,seats=36,width=sections===7?230:sections===5?155:95):ModelBank=>({id,product:id,name,center,width,sections,rows,seats,roof:false,kind:'check',confidence:'Estimated temporary-stand region from the linked 2027 organizer diagram; all tiers and chairs modeled',source:MELBOURNE_GUIDE});
const SILVERSTONE_SOURCE='https://www.silverstone.co.uk/events/formula-1-british-grand-prix/tickets/grandstands';
const silverBank=(id:string,name:string,feature:string,sections=3,center?:[number,number],width?:number):ModelBank=>{
 const f=silverstone.features.find(f=>f.id===feature)!,fit=footprintPlacement(f.points);
 return {id,product:id,name,center:center??fit.center,width:width??Math.min(fit.width,130),axis:fit.axis,sections,rows:16,seats:36,roof:false,kind:'assigned',confidence:'OSM-anchored representative bank; rectangular boundaries, tiers and chairs estimated; not a surveyed event layout',source:SILVERSTONE_SOURCE};
};
const spaBank=(id:string,name:string,feature:string,width:number,sections:number,rows:number,seats:number,source:string):ModelBank=>{const fit=footprintPlacement(spa.features.find(f=>f.id===feature)!.points);return {id,product:id,name,center:fit.center,axis:fit.axis,width,sections,rows,seats,roof:false,kind:'assigned',source,confidence:'OSM-anchored representative bank; rectangular boundaries, level platform, tiers and chairs estimated'};};
const spaRegion=(id:string,name:string,center:[number,number],note?:string):ModelBank=>({id,product:id,name,center,width:65,sections:2,rows:16,seats:36,roof:false,kind:'assigned',confidence:'Estimated temporary Combes region from organizer map order; bank boundary, facing, platform, tiers and chairs authored',source:'https://www.spagrandprix.com/en/combes-grandstands-'+id.at(-1),officialView:true,admissionNote:note});
const spaLaSource=(id:string,name:string,center:[number,number],source:string,note:string):ModelBank=>({id,product:id,name,center,width:36,sections:1,rows:14,seats:36,roof:false,kind:'assigned',confidence:'Estimated La Source region from named organizer map groups; no association to the old-pits OSM Endurance footprint; boundaries, facing, platform, tiers and chairs authored',source,officialView:true,admissionNote:note});
const spaPitRegion=(id:string,name:string,center:[number,number],width:number,source:string,note:string,officialView=false):ModelBank=>({id,product:id,name,center,width,sections:1,rows:14,seats:36,roof:false,kind:'assigned',confidence:'Estimated pit-straight/Chicane region from named organizer map groups; center, setback, bank boundary, facing, platform, tiers and chairs authored; no surveyed footprint association',source,officialView,admissionNote:note});
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
 australia:{id:'australia',name:'Albert Park Grand Prix Circuit',country:'Australia',season:2027,checked:'24 Nov 2026',dates:'2–4 April 2027 · racing weekend',track:albert.points,features:albert.features,vegetation:albert.vegetation,appearance:'day',defaultBank:'fangio',pitBank:'fangio',source:MELBOURNE_GUIDE,ticketUrl:MELBOURNE_TICKETS,geometryUrl:'/data/albert-park-geometry.json',length:albert.length_m,evidence:'Sixteen named grandstand regions follow the map linked by AGPC’s 2027 guide. The ten-stand travel-package comparison is a subset of that map. All temporary boundaries, rows and chairs are estimates. Premium section locations and the accessible Turn 12 platform are not modeled. No canopies are shown because premium roof boundaries are unverified. Source tree points and lake outline provide park context; vegetation size, event clearing and terrain are authored. Reserved Friday–Sunday and Thursday roaming rules vary by ticket; confirm with the organizer.',banks:[
  parkBank('jones','Jones Grandstand',[-554.6, 103.1]),
  parkBank('hill','Hill Grandstand',[-849.5, -599.9]),
  parkBank('ricciardo','Ricciardo Grandstand',[-795.2, -518.2]),
  parkBank('american-express','American Express Grandstand',[-768.3, -620.1],2,16,28,55),
  parkBank('stewart','Stewart Grandstand',[-678.8, -886.9]),
  parkBank('button','Button Grandstand',[-58.7, -900.8]),
  parkBank('clark','Clark Grandstand',[41.8, -547.8]),
  parkBank('waite','Waite Grandstand',[246.5, 74.9]),
  parkBank('vettel','Vettel Grandstand',[611.0, 630.7]),
  parkBank('webber','Webber Grandstand',[529.7, 673.3],2,16,32,65),
  parkBank('lauda','Lauda Grandstand',[310.0, 827.3]),
  parkBank('schumacher','Schumacher Grandstand',[174.7, 636.6],2,16,28,55),
  parkBank('prost','Prost Grandstand',[108.6, 686.9]),
  parkBank('senna','Senna Grandstand',[-32.0, 632.7]),
  parkBank('fangio','Fangio Grandstand',[-142.8, 520.4],7,18,40),
  parkBank('piastri','Piastri Grandstand',[-279.1, 382.9],5,18,40),
 ]},
 'great-britain':{id:'great-britain',name:'Silverstone Circuit',country:'Great Britain',season:2027,checked:'24 Nov 2026',dates:'2–4 July 2027 · racing weekend',track:silverstone.points,features:silverstone.features,vegetation:silverstone.vegetation,appearance:'day',defaultBank:'hamilton-a',pitBank:'hamilton-a',source:SILVERSTONE_SOURCE,ticketUrl:'https://www.silverstone.co.uk/events/formula-1-british-grand-prix/tickets',geometryUrl:'/data/silverstone-geometry.json',length:silverstone.length_m,evidence:'The current 2027 organizer map names these 26 viewing banks. Standard and Prime View products can share a stand; premium row boundaries are not known. Club Corner uses the older OSM Club B region, and George Russell uses Farm Curve. Abbey A/B split an estimated region. Woodcote C, Hamilton B and Landostand are estimated regions. All chairs, sections, roofs, terrain, pit architecture and sightlines are illustrative. No exact ticket matching, Prime View row selection, hospitality, GA or accessible-platform geometry is supplied. Canopies are omitted because current cover boundaries are unverified. Confirm the actual ticket and cover with Silverstone.',banks:[
  silverBank('abbey-a','Abbey A','227342458',3,[-78,357],85),
  silverBank('abbey-b','Abbey B','227342458',3,[1,288],85),
  silverBank('becketts','Becketts','227342446',5),
  silverBank('chapel','Chapel','1430486596',3),
  silverBank('club-a','Club A','227342445'),
  silverBank('club-corner','Club Corner','227342448',4),
  silverBank('copse-a','Copse A','227342440'),
  silverBank('copse-b','Copse B','227342441',2),
  silverBank('copse-c','Copse C','227342444'),
  silverBank('copse-d','Copse D','1560504713',2),
  silverBank('hamilton-a','Hamilton Straight A','1387956625',5),
  silverBank('hamilton-b','Hamilton Straight B','1387956625',3,[-154,460],90),
  silverBank('luffield','Luffield','227342456',4),
  silverBank('luffield-corner','Luffield Corner','1560504709'),
  silverBank('national-pit-straight','National Pit Straight','227342452',5),
  silverBank('stirling-a','Stirling A','1560504712',2),
  silverBank('stirling-b','Stirling B','1560504711',2),
  silverBank('vale','Vale','227342453',4),
  silverBank('village-a','Village A','227342451',3),
  silverBank('village-b','Village B','227342447',3),
  silverBank('woodcote-a','Woodcote A','227342450',4),
  silverBank('woodcote-b','Woodcote B','227342459'),
  silverBank('woodcote-c','Woodcote C','227342452',2,[82,-582],35),
  silverBank('george-russell','George Russell Grandstand','227342449',4),
  silverBank('the-view','The View','227342454',2),
  silverBank('landostand','Landostand','227342453',5,[155,1255],150),
 ]},
 belgium:{id:'belgium',name:'Circuit de Spa-Francorchamps',country:'Belgium',season:2027,checked:'25 Nov 2026',dates:'23–25 July 2027 · racing weekend',track:spa.points,trackHeights:spa.trackHeights,terrain:spa.terrain,features:spa.features,vegetation:spa.forest_samples.map((point,i)=>({id:String(i+1),point})),appearance:'day',defaultBank:'gold-1',pitBank:'gold-1',source:'https://www.spagrandprix.com/en/ticketing/ticket/map',ticketUrl:'https://www.spagrandprix.com/en/ticketing/ticket/list',geometryUrl:'/data/spa-geometry.json',length:spa.length_m,unmappedProducts:[{id:'gold-6-bis',name:'Gold 6 Bis · Chicane',source:'https://www.spagrandprix.com/en/gold-6-bis',note:'The organizer lists a separate uncovered Chicane product. Its location map does not identify a distinct Gold 6 Bis region, so no seat view is assigned here.'}],evidence:'Fifteen-bank study: Gold 1 Pit, Moët & Chandon (formerly Gold 3), Silver 1, Combes 1–4, Gold 7, 7 Bis, 7 ter, Gold 8, Gold 9, 9 Bis, Gold 11 Premium and Gold 6. Gold 9 variants and Gold 11/6 follow named organizer map regions with authored setbacks. Gold 6 Bis remains a separate unmapped product. Gold 7-family and Gold 8 regions follow named organizer map groups around La Source; they are not assigned to the similarly named OSM Endurance footprint. Other current products are not modeled yet. Combes centers follow estimated ordered regions from the organizer map; the four physical products remain distinct. Covered/uncovered options share a bank when row boundaries are unknown. These are representative OSM-anchored banks, not surveyed event boundaries. All sections, rows and chairs are illustrative. SPW 2021–2022 bare-ground samples supply the road profile and a coarse 17×25 context grid; the road margin and bank foundations are authored earthwork. Tree samples are authored within licensed forest regions, not a tree inventory. This is not a 50cm terrain crop, measured sightline or exact ticket match. Cover, accessible routes, hospitality and premium row boundaries remain unverified; canopies are omitted.',banks:[
  spaBank('gold-1','Gold 1 · Pit','174882363',150,5,18,40,'https://www.spagrandprix.com/en/tickets-gold-1-pit'),
  spaBank('moet-chandon','Moët & Chandon · ex Gold 3','1134053908',140,4,18,40,'https://www.spagrandprix.com/en/tickets-moet-et-chandon-grandstand'),
  spaBank('silver-1','Silver 1 · Francorchamps','1353159437',110,4,16,36,'https://www.spagrandprix.com/en/ticketing/ticket/list'),
  spaRegion('combes-1','Combes Grandstand 1',[515,715]),
  spaRegion('combes-2','Combes Grandstand 2',[495,805],'The organizer offers covered and uncovered options within Combes 2. Their row boundaries are not mapped here; no canopy is shown.'),
  spaRegion('combes-3','Combes Grandstand 3',[488,890],'The organizer labels Combes 3 covered. Canopy shape, support obstructions and exact row boundaries are unverified; no canopy is shown.'),
  spaRegion('combes-4','Combes Grandstand 4',[478,975]),
  spaLaSource('gold-7','Gold 7 · Source',[-505,-1004],'https://www.spagrandprix.com/en/gold-7-source','The organizer labels Gold 7 covered. Canopy shape, supports and row boundaries are unverified; no canopy is shown.'),
  spaLaSource('gold-7-bis','Gold 7 Bis · Source',[-549,-1029],'https://www.spagrandprix.com/en/gold-7-bis','The organizer describes Gold 7 Bis as an uncovered extension of Gold 7. All model sections and rows are authored; the exact view is unverified.'),
  spaLaSource('gold-7-ter','Gold 7 ter · Endurance',[-461,-980],'https://www.spagrandprix.com/en/gold-7-ter','The organizer describes an uncovered La Source extension with pit-exit views. Model boundaries, obstructions and the exact view are unverified.'),
  spaLaSource('gold-8','Gold 8 · Source Start',[-616,-1039],'https://www.spagrandprix.com/en/gold-8-source-start','The organizer labels Gold 8 covered. Canopy shape, supports and row boundaries are unverified; no canopy is shown.'),
  spaPitRegion('gold-9','Gold 9 · Pole Position',[-505,-755],64,'https://www.spagrandprix.com/en/gold-9-pole-position','The organizer describes a covered stand between the start line and La Source. Canopy, pit-building obstructions and actual row boundaries are unverified; no canopy is shown.',true),
  spaPitRegion('gold-9-bis','Gold 9 Bis · Pole Position',[-478,-684],42,'https://www.spagrandprix.com/en/gold-9-bis-pole-position','The organizer describes an uncovered extension of Gold 9. This is a separate estimated bank; its model rows are not ticket rows.',true),
  spaPitRegion('gold-11','Gold 11 Premium · Chicane',[-366,-481],42,'https://www.spagrandprix.com/en/gold-11','The organizer places this covered premium product between Gold 1 and Gold 6. Package details must be checked with the organizer. Canopy, hospitality facilities, sightlines and actual rows are not modeled.'),
  spaPitRegion('gold-6','Gold 6 · Chicane',[-375,-380],42,'https://www.spagrandprix.com/en/tickets-gold-6-chicane','The organizer map names Gold 6 Chicane and the current catalogue lists a Lunch Box option. This study does not establish package availability, canopy geometry or actual row boundaries. Gold 6 Bis is a separate product and is not mapped here.'),
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
export function normalizeModelPosition(model:CircuitModel,p:Partial<ModelPosition>):ModelPosition{const b=model.banks.find(b=>b.id===p.bank)??model.banks.find(b=>b.id===model.defaultBank)??model.banks[0];const bound=(n:unknown,max:number,def:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(1,Math.min(max,Math.round(n))):def;return {bank:b.id,section:bound(p.section,b.sections,Math.ceil(b.sections/2)),row:bound(p.row,b.rows,Math.ceil(b.rows/2)),seat:bound(p.seat,b.seats,Math.ceil(b.seats/2))};}
export function localModelPosition(bank:ModelBank,p:ModelPosition):[number,number,number]{const lawn=bank.kind==='lawn',pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3);const x=((p.section-1)*(bank.seats+3)+p.seat-.5)*pitch-bank.width/2;return [x,lawn?3+(p.row-1)*.14:.7+(p.row-1)*.43,(bank.rows/2-p.row)*(lawn?3:.88)];}
export function bankGroundHeight(model:CircuitModel,bank:ModelBank){
 if(!model.terrain)return 0;
 const {yaw}=bankFrame(model,bank),c=Math.cos(yaw),s=Math.sin(yaw),samples=[groundHeight(model,...bank.center)];
 for(const x of [-bank.width/2,bank.width/2])for(const z of [-bank.rows*.44,bank.rows*.44])samples.push(groundHeight(model,bank.center[0]+x*c+z*s,bank.center[1]-x*s+z*c));
 return Math.max(...samples)+.3;
}
export function modelPosition(model:CircuitModel,p:ModelPosition):[number,number,number]{const b=model.banks.find(b=>b.id===p.bank)!;const [x,y,z]=localModelPosition(b,p),{yaw}=bankFrame(model,b);return [b.center[0]+x*Math.cos(yaw)+z*Math.sin(yaw),y+bankGroundHeight(model,b),b.center[1]-x*Math.sin(yaw)+z*Math.cos(yaw)];}
export function modelCount(bank:ModelBank){return bank.sections*bank.rows*bank.seats;}
export function positionKey(p:ModelPosition){return `${p.bank}:${p.section}:${p.row}:${p.seat}`;}
export function modelPositionUrl(origin:string,model:CircuitModel,p:ModelPosition){const u=new URL(origin);u.search=new URLSearchParams({season:String(model.season),race:model.id,screen:'circuit',bank:p.bank,section:String(p.section),modelRow:String(p.row),position:String(p.seat)}).toString();u.hash='';return u.toString();}

/** Fit overview framing to each physical venue and viewport, with room for scene controls. */
export function circuitOverviewCamera(model:CircuitModel,aspect:number,verticalFraction=.7){
 const points:number[][]=model.track.map((p,i)=>[p[0],model.trackHeights?.[i]??0,p[1]]);
 for(const b of model.banks){const {yaw}=bankFrame(model,b),c=Math.cos(yaw),s=Math.sin(yaw);for(const x of [-b.width/2,b.width/2])for(const z of [-b.rows*.44-3,b.rows*.44+3])for(const y of [0,b.rows*.43+6])points.push([b.center[0]+x*c+z*s,y+bankGroundHeight(model,b),b.center[1]-x*s+z*c]);}
 if(model.terrain){const t=model.terrain;for(let row=0;row<t.rows;row++)for(let col=0;col<t.columns;col++)points.push([t.bounds[0]+col/(t.columns-1)*(t.bounds[2]-t.bounds[0]),t.heights[row*t.columns+col],t.bounds[1]+row/(t.rows-1)*(t.bounds[3]-t.bounds[1])]);}
 const target:[number,number,number]=[(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,model.terrain?(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2:0,(Math.min(...points.map(p=>p[2]))+Math.max(...points.map(p=>p[2])))/2];
 const direction=model.terrain&&aspect<.8?[0,1,.25]:[.6,1,.9],length=Math.hypot(...direction),normal=direction.map(n=>n/length),rLength=Math.hypot(normal[0],normal[2]),right=[normal[2]/rLength,0,-normal[0]/rLength],up=[-normal[1]*normal[0]/rLength,rLength,-normal[1]*normal[2]/rLength];
 const tan=Math.tan(Math.PI/8),ratio=Number.isFinite(aspect)&&aspect>0?aspect:1;let distance=500;
 for(const p of points){const v=p.map((n,i)=>n-target[i]),depth=v.reduce((n,a,i)=>n+a*normal[i],0),x=v.reduce((n,a,i)=>n+a*right[i],0),y=v.reduce((n,a,i)=>n+a*up[i],0);distance=Math.max(distance,depth+Math.abs(x)/(tan*ratio*.82),depth+Math.abs(y)/(tan*verticalFraction));}
 return {eye:target.map((n,i)=>n+normal[i]*distance) as [number,number,number],target};
}
