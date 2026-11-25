import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groundHeight,roadSample,sampleHeight} from './circuitTerrain';
import {circuitModels,bankGroundHeight,localModelPosition,modelPosition,findCircuitModel,modelCount,closestTrack} from './circuitSeating';
test('height fields keep meter axes and reject unknown domains while flat models retain zero',()=>{
 const f={bounds:[0,0,10,10],columns:2,rows:2,heights:[0,10,20,30],baseline:400,source:'test',licence:'test'};
 assert.equal(sampleHeight(f,5,5),15);assert.equal(sampleHeight(f,0,0),0);assert.equal(sampleHeight(f,10,10),30);assert.equal(sampleHeight(f,-1,5),undefined);
 assert.equal(groundHeight(circuitModels.qatar,999999,999999),0);assert.throws(()=>groundHeight(circuitModels.belgium,999999,999999),/Outside sampled/);
});
test('Spa keeps full road relief, source heights and level bank/eye offsets',()=>{
 const m=circuitModels.belgium;assert.equal(findCircuitModel(2026,'belgium'),undefined);assert.equal(m.banks.length,3);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),8784);
 assert.ok(Math.max(...m.trackHeights!)-Math.min(...m.trackHeights!)>100);assert.equal(m.terrain?.licence,'CC-BY-4.0');
 m.track.forEach((p,i)=>{const road=roadSample(m,...p as [number,number]);assert.ok(Math.abs(road.height-m.trackHeights![i])<.001);assert.ok(Math.abs(groundHeight(m,...p as [number,number])-road.height)<.001);});
 for(const b of m.banks){const selection={bank:b.id,section:1,row:1,seat:1},p=modelPosition(m,selection),local=localModelPosition(b,selection);assert.ok(Math.abs(p[1]-bankGroundHeight(m,b)-local[1])<1e-9);assert.ok(p[1]>groundHeight(m,p[0],p[2]));}
});
test('all initial Spa positions stay clear of the modeled racing surface',()=>{
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
