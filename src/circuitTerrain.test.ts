import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groundHeight,roadSample,sampleHeight} from './circuitTerrain';
import {circuitModels,bankGroundHeight,localModelPosition,modelPosition,findCircuitModel,modelCount,closestTrack,bankFrame,type CircuitModel,type ModelBank} from './circuitSeating';
test('height fields keep meter axes and reject unknown domains while flat models retain zero',()=>{
 const f={bounds:[0,0,10,10],columns:2,rows:2,heights:[0,10,20,30],baseline:400,source:'test',licence:'test'};
 assert.equal(sampleHeight(f,5,5),15);assert.equal(sampleHeight(f,0,0),0);assert.equal(sampleHeight(f,10,10),30);assert.equal(sampleHeight(f,-1,5),undefined);
 assert.equal(groundHeight(circuitModels.qatar,999999,999999),0);assert.throws(()=>groundHeight(circuitModels.belgium,999999,999999),/Outside sampled/);
});
test('Spa keeps full road relief, source heights and level bank/eye offsets',()=>{
 const m=circuitModels.belgium;assert.equal(findCircuitModel(2026,'belgium'),undefined);assert.equal(m.banks.length,27);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),30528);
 assert.ok(Math.max(...m.trackHeights!)-Math.min(...m.trackHeights!)>100);assert.equal(m.terrain?.licence,'CC-BY-4.0');
 m.track.forEach((p,i)=>{const road=roadSample(m,...p as [number,number]);assert.ok(Math.abs(road.height-m.trackHeights![i])<.001);assert.ok(Math.abs(groundHeight(m,...p as [number,number])-road.height)<.001);});
 for(const b of m.banks){const selection={bank:b.id,section:1,row:1,seat:1},p=modelPosition(m,selection),local=localModelPosition(b,selection);assert.ok(Math.abs(p[1]-bankGroundHeight(m,b)-local[1])<1e-9);assert.ok(p[1]>groundHeight(m,p[0],p[2]));}
});
test('all supported Spa positions stay clear of the modeled racing surface',()=>{
 const m=circuitModels.belgium;
 for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
  const p=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[p[0],p[2]]);assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15);
 }
});
test('Spa overview projects real road heights clear of controls on wide and portrait screens',async()=>{
 const {circuitOverviewCamera}=await import('./circuitSeating');const T=await import('three'),m=circuitModels.belgium;
 for(const [width,height] of [[320,660],[1075,917]]){
  const top=Math.min(height*.35,width<760?250:220),bottom=110,fraction=Math.max(.2,1-(top+bottom)/height)*.95,view=circuitOverviewCamera(m,width/height,fraction),camera=new T.PerspectiveCamera(45,width/height,10,16000);
  camera.position.set(...view.eye);camera.lookAt(...view.target);camera.setViewOffset(width,height,0,(bottom-top)/2,width,height);camera.updateMatrixWorld();
  for(let i=0;i<m.track.length;i++){const p=m.track[i],q=new T.Vector3(p[0],m.trackHeights![i],p[1]).project(camera),x=(q.x+1)*width/2,y=(1-q.y)*height/2;assert.ok(x>0&&x<width&&y>top&&y<height-bottom);}
 }
});

test('Combes products remain distinct and cover options never become invented canopy rows',()=>{
 const m=circuitModels.belgium,combes=m.banks.filter(b=>b.id.startsWith('combes-'));
 assert.equal(combes.length,4);assert.equal(new Set(combes.map(b=>b.product)).size,4);
 for(const b of combes){assert.ok(b.confidence.startsWith('Estimated temporary'));assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.equal(b.officialView,true);assert.equal(new URL(b.source).pathname,'/en/combes-grandstands-'+b.id.at(-1));}
 assert.match(combes.find(b=>b.id==='combes-2')!.admissionNote!,/covered and uncovered/);assert.match(combes.find(b=>b.id==='combes-3')!.admissionNote!,/unverified/);
});

test('La Source variants retain organizer identities without borrowing the old-pits Endurance footprint',()=>{
 const m=circuitModels.belgium,ids=['gold-7','gold-7-bis','gold-7-ter','gold-8'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.product,id);assert.equal(b.footprint,undefined);assert.equal(b.officialView,true);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated La Source/);assert.ok(b.center[1]<-950);assert.equal(b.rows,14);}
 assert.equal(new URL(m.banks.find(b=>b.id==='gold-7-ter')!.source).pathname,'/en/gold-7-ter');
 assert.match(m.banks.find(b=>b.id==='gold-7-ter')!.admissionNote!,/uncovered/);
});


function bankEnvelopesSeparated(m:CircuitModel,a:ModelBank,b:ModelBank){
 const corners=(bank:ModelBank)=>{const {yaw}=bankFrame(m,bank),c=Math.cos(yaw),s=Math.sin(yaw);return [-1,1].flatMap(along=>[-1,1].map(across=>{const x=along*(bank.width/2+2),z=across*(bank.rows*.44+2);return [bank.center[0]+x*c+z*s,bank.center[1]-x*s+z*c];}));};
 const ca=corners(a),cb=corners(b);
 return [bankFrame(m,a).yaw,bankFrame(m,b).yaw].some(t=>[[Math.cos(t),-Math.sin(t)],[Math.sin(t),Math.cos(t)]].some(axis=>{const x=ca.map(p=>p[0]*axis[0]+p[1]*axis[1]),y=cb.map(p=>p[0]*axis[0]+p[1]*axis[1]);return Math.max(...x)<Math.min(...y)||Math.max(...y)<Math.min(...x);}));
}

test('Spa pit products keep distinct model envelopes and unsupported Bis locations stay unmapped',()=>{
 const m=circuitModels.belgium,ids=['gold-9','gold-9-bis','gold-11','gold-6'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated pit-straight/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 assert.equal(m.banks.find(b=>b.id==='gold-9-bis')!.officialView,true);
 assert.equal(m.banks.find(b=>b.id==='gold-11')!.officialView,false);
 assert.equal(m.banks.some(b=>b.id==='gold-6-bis'),false);
 const pending=m.unmappedProducts!.find(p=>p.id==='gold-6-bis')!;assert.equal(new URL(pending.source).pathname,'/en/gold-6-bis');assert.match(pending.note,/separate uncovered/);
});


test('Eau Rouge banks preserve one Gold 2 region for Standard/Premium and separate Gold 4/5 identities',()=>{
 const m=circuitModels.belgium,ids=['gold-2','gold-4','gold-5'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.equal(b.officialView,true);assert.match(b.confidence,/Estimated Eau Rouge/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const g2=m.banks.find(b=>b.id==='gold-2')!;assert.equal(m.banks.filter(b=>b.id.startsWith('gold-2')).length,1);assert.equal(g2.ticketOptions!.length,2);assert.deepEqual(g2.ticketOptions!.map(p=>new URL(p.source).pathname),['/en/gold-2-gp2','/en/vip-gold-2']);assert.match(g2.admissionNote!,/row allocation is unknown/);
 assert.match(m.banks.find(b=>b.id==='gold-4')!.name,/All-In/);assert.match(m.banks.find(b=>b.id==='gold-5')!.admissionNote!,/uncovered/);
});


test('Spa Silver products keep distinct assigned banks and package/cover limits',()=>{
 const m=circuitModels.belgium,ids=['silver-3','silver-4','silver-5','silver-6','silver-7'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.kind,'assigned');assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.equal(b.officialView,true);assert.match(b.confidence,/Estimated Silver/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const get=(id:string)=>m.banks.find(b=>b.id===id)!;
 assert.match(get('silver-3').admissionNote!,/newly covered/);assert.match(get('silver-4').admissionNote!,/Bruxelles/);
 assert.equal(new URL(get('silver-6').source).pathname,'/en/silver-6');assert.match(get('silver-6').admissionNote!,/walk takes place elsewhere/);assert.notDeepEqual(get('silver-5').center,get('silver-6').center);
 assert.match(get('silver-7').admissionNote!,/separate product from Combes/);assert.ok(get('silver-7').center[1]<m.banks.find(b=>b.id==='combes-1')!.center[1]);
});


test('Spa public products separate assigned, age-restricted free seating and source-only areas',()=>{
 const m=circuitModels.belgium,ids=['speed-corner','fanzone','fan-area-double-gauche','area-17-27'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.equal(b.officialView,true);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const age=m.banks.find(b=>b.id==='area-17-27')!;assert.equal(age.kind,'free');assert.match(age.eligibilityNote!,/Ages 17–27 only/);assert.match(age.admissionNote!,/ages 17–27/);assert.match(age.admissionNote!,/not reserved chairs/);
 const fanzone=m.banks.find(b=>b.id==='fanzone')!,fan=m.banks.find(b=>b.id==='fan-area-double-gauche')!;assert.equal(fanzone.kind,'assigned');assert.equal(fan.kind,'assigned');assert.notEqual(fanzone.source,fan.source);assert.ok(fanzone.center[1]<0&&fan.center[1]>0);
 const options=m.unmappedProducts!;assert.equal(options.length,13);assert.equal(new Set(options.map(p=>p.id)).size,13);assert.equal(options.filter(p=>p.group==='Hospitality').length,8);assert.equal(options.filter(p=>p.group==='General admission').length,2);assert.equal(options.filter(p=>p.group==='Accessible platforms').length,2);
 for(const p of options){assert.ok(!m.banks.some(b=>b.id===p.id));const u=new URL(p.source);assert.equal(u.protocol,'https:');assert.equal(u.hostname,'www.spagrandprix.com');}
 assert.match(options.find(p=>p.id==='bronze')!.note,/no assigned chair/);assert.match(options.find(p=>p.id==='prm-source')!.note,/no verified platform/);
});


test('Monza variant regions stay distinct without promoting authored splits to surveyed footprints',()=>{
 const m=circuitModels.italy,ids=['6b','6c','7','8a','8b','26a','26b','26c'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.product,id);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated product region/);assert.equal(b.kind,'assigned');for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const by=(id:string)=>m.banks.find(b=>b.id===id)!;
 assert.ok(by('26a').center[1]<by('26b').center[1]&&by('26b').center[1]<by('26c').center[1]);
 for(const id of ['8a','8b','26a','26b','26c'])assert.match(by(id).admissionNote!,/spans multiple products/);
 assert.notDeepEqual(by('8a').center,by('8b').center);assert.equal(m.banks.some(b=>b.id==='6a'),false);
});


test('Monza north products preserve source envelopes, estimated regions and Serraglio context gap',()=>{
 const m=circuitModels.italy,ids=['9','10','33a','33b','34','10-bis'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.kind,'assigned');assert.equal(b.roof,false);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const by=(id:string)=>m.banks.find(b=>b.id===id)!;
 assert.equal(by('9').footprint,undefined);assert.equal(by('10').footprint,undefined);assert.equal(by('9').width,22);assert.equal(by('10').width,22);
 for(const id of ['33a','33b','34','10-bis']){assert.equal(by(id).footprint,undefined);assert.match(by(id).confidence,/Estimated Roggia/);}
 assert.notEqual(by('10').name,by('10-bis').name);assert.equal(m.banks.some(b=>b.id==='11'),false);assert.match(m.unmappedProducts!.find(p=>p.id==='11')!.note,/No seated view/);
});


test('Monza Parabolica letters remain estimated and unresolved Vedano products never borrow bank 24',()=>{
 const m=circuitModels.italy,ids=['21a','21b','21c','21d','21e','25'];
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.kind,'assigned');assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated product region/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 const letters=['21a','21b','21c','21d','21e'].map(id=>m.banks.find(b=>b.id===id)!);for(let i=1;i<letters.length;i++)assert.ok(letters[i-1].center[1]>letters[i].center[1]);
 for(const id of ['35a','35b','35c']){assert.equal(m.banks.some(b=>b.id===id),false);assert.match(m.unmappedProducts!.find(p=>p.id===id)!.note,/does not borrow/);}
 assert.match(m.unmappedProducts!.find(p=>p.id==='11')!.note,/deck clearance/);
});


test('Monza GF stays unnumbered and unsupported start/finish products have no borrowed seats',()=>{
 const m=circuitModels.italy,gf=m.banks.find(b=>b.id==='gf')!;
 assert.equal(gf.kind,'free');assert.equal(gf.footprint,undefined);assert.equal(gf.roof,false);assert.match(gf.admissionNote!,/part of/);assert.match(gf.admissionNote!,/not numbered/);
 for(const other of m.banks.filter(b=>b.id!=='gf'))assert.ok(bankEnvelopesSeparated(m,gf,other),'GF overlaps '+other.id);
 for(const id of ['2','3','27','28','29','30','32']){assert.equal(m.banks.some(b=>b.id===id),false);const source=m.unmappedProducts!.find(p=>p.id===id)!;assert.ok(source);assert.equal(source.group,'Start/finish product boundaries');assert.equal(source.source,gf.source);}
 assert.match(m.unmappedProducts!.find(p=>p.id==='32')!.note,/pit buildings/);
});


test('Monza Ascari samples retain distinct identities and leave unsupported Ascari 4 unmapped',()=>{
 const m=circuitModels.italy;
 for(const id of ['12','14','16','18']){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated product region/);assert.match(b.admissionNote!,/named licensed envelope/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(bankEnvelopesSeparated(m,b,other),id+' overlaps '+other.id);}
 assert.equal(m.banks.some(b=>b.id==='13'),false);assert.match(m.unmappedProducts!.find(p=>p.id==='13')!.note,/does not borrow 12/);
});


test('Shanghai compact banks remain separate estimated source regions',()=>{
 const m=circuitModels.china;for(const b of m.banks)for(const other of m.banks.filter(o=>o.id!==b.id))assert.ok(bankEnvelopesSeparated(m,b,other),b.id+' overlaps '+other.id);
});

test('Miami temporary model samples remain separate estimated regions',()=>{
 const m=circuitModels.miami;for(const b of m.banks)for(const other of m.banks.filter(o=>o.id!==b.id))assert.ok(bankEnvelopesSeparated(m,b,other),b.id+' overlaps '+other.id);
});

test('Canada estimated bank samples remain separate',()=>{
 const m=circuitModels.canada;for(const b of m.banks)for(const other of m.banks.filter(o=>o.id!==b.id))assert.ok(bankEnvelopesSeparated(m,b,other),b.id+' overlaps '+other.id);
});
