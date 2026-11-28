import test from 'node:test';
import assert from 'node:assert/strict';
import {circuitModels} from './circuitSeating';
import {tracksideGeometry} from './tracksideGeometry';

test('fence panels are closed on both sides, finite, and retain metre-scale coverage across venues',()=>{
 for(const model of Object.values(circuitModels)){
  const {mesh,rail,posts}=tracksideGeometry(model);
  try{
   const p=mesh.getAttribute('position'),uv=mesh.getAttribute('uv'),half=p.count/2;
   for(const value of p.array)assert(Number.isFinite(value),model.id);
   for(const value of uv.array)assert(Number.isFinite(value),model.id);
   assert.equal(mesh.index!.count,(half/2-1)*12);
   assert(posts.length>100);assert(posts.length<model.length/2);
   for(const start of [0,half]){
    const end=start+half-2;assert(Math.hypot(p.getX(start)-p.getX(end),p.getZ(start)-p.getZ(end))<.01);
    assert.equal(uv.getX(start),0);assert(uv.getX(end)>model.length*.8);
    for(let i=start;i<start+half;i+=2)assert(Math.abs(p.getY(i+1)-p.getY(i)-3)<.002);
   }
  }finally{mesh.dispose();rail.dispose();}
 }
});
