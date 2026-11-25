import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groundHeight,roadSample,sampleHeight} from './circuitTerrain';
import {circuitModels,bankGroundHeight,localModelPosition,modelPosition,findCircuitModel,modelCount,closestTrack,bankFrame} from './circuitSeating';
test('height fields keep meter axes and reject unknown domains while flat models retain zero',()=>{
 const f={bounds:[0,0,10,10],columns:2,rows:2,heights:[0,10,20,30],baseline:400,source:'test',licence:'test'};
 assert.equal(sampleHeight(f,5,5),15);assert.equal(sampleHeight(f,0,0),0);assert.equal(sampleHeight(f,10,10),30);assert.equal(sampleHeight(f,-1,5),undefined);
 assert.equal(groundHeight(circuitModels.qatar,999999,999999),0);assert.throws(()=>groundHeight(circuitModels.belgium,999999,999999),/Outside sampled/);
});
test('Spa keeps full road relief, source heights and level bank/eye offsets',()=>{
 const m=circuitModels.belgium;assert.equal(findCircuitModel(2026,'belgium'),undefined);assert.equal(m.banks.length,15);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),17424);
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


test('Spa pit products keep distinct model envelopes and unsupported Bis locations stay unmapped',()=>{
 const m=circuitModels.belgium,ids=['gold-9','gold-9-bis','gold-11','gold-6'];
 const corners=(b:typeof m.banks[number])=>{const {yaw}=bankFrame(m,b),c=Math.cos(yaw),s=Math.sin(yaw);return [-1,1].flatMap(a=>[-1,1].map(d=>{const x=a*(b.width/2+2),z=d*(b.rows*.44+2);return [b.center[0]+x*c+z*s,b.center[1]-x*s+z*c];}));};
 const separated=(a:typeof m.banks[number],b:typeof m.banks[number])=>{const ca=corners(a),cb=corners(b);return [bankFrame(m,a).yaw,bankFrame(m,b).yaw].some(t=>[[Math.cos(t),-Math.sin(t)],[Math.sin(t),Math.cos(t)]].some(axis=>{const x=ca.map(p=>p[0]*axis[0]+p[1]*axis[1]),y=cb.map(p=>p[0]*axis[0]+p[1]*axis[1]);return Math.max(...x)<Math.min(...y)||Math.max(...y)<Math.min(...x);}));};
 for(const id of ids){const b=m.banks.find(b=>b.id===id)!;assert.ok(b);assert.equal(b.footprint,undefined);assert.equal(b.roof,false);assert.match(b.confidence,/Estimated pit-straight/);for(const other of m.banks.filter(o=>o.id!==id))assert.ok(separated(b,other),id+' overlaps '+other.id);}
 assert.equal(m.banks.find(b=>b.id==='gold-9-bis')!.officialView,true);
 assert.equal(m.banks.find(b=>b.id==='gold-11')!.officialView,false);
 assert.equal(m.banks.some(b=>b.id==='gold-6-bis'),false);
 const pending=m.unmappedProducts!.find(p=>p.id==='gold-6-bis')!;assert.equal(new URL(pending.source).pathname,'/en/gold-6-bis');assert.match(pending.note,/separate uncovered/);
});
