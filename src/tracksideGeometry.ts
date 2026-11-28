import * as T from 'three';
import {roadSample} from './circuitTerrain';
import type {CircuitModel} from './circuitSeating';

/** Retains the existing illustrative fence alignment, 12 m from the track centre. */
export function tracksideGeometry(model:CircuitModel){
 const curve=new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal');
 const samples=curve.getSpacedPoints(Math.round(model.length/4)),positions:number[]=[],uv:number[]=[],indices:number[]=[],posts:T.Matrix4[]=[],rails:number[]=[];
 for(const side of [-1,1]){
  let distance=0,previous:T.Vector3|undefined,first:T.Vector3|undefined;
  samples.forEach((p,i)=>{
   const t=curve.getTangentAt(i/(samples.length-1)),x=p.x-t.z*12*side,z=p.z+t.x*12*side;
   const q=new T.Vector3(x,(model.terrain?roadSample(model,x,z).height:p.y)+.4,z);
   if(i===0)first=q.clone();else if(i===samples.length-1)q.copy(first!);
   if(previous)distance+=q.distanceTo(previous);
   const base=positions.length/3;positions.push(q.x,q.y,q.z,q.x,q.y+3,q.z);uv.push(distance,0,distance,3);
   if(i){indices.push(base-2,base-1,base,base-1,base+1,base);for(const h of [0,1.5,3])rails.push(previous!.x,previous!.y+h,previous!.z,q.x,q.y+h,q.z);}
   if(i%2===0&&i<samples.length-1){const matrix=new T.Matrix4().makeTranslation(q.x,q.y+1.5,q.z);posts.push(matrix);}
   previous=q;
  });
 }
 const mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.Float32BufferAttribute(positions,3));mesh.setAttribute('uv',new T.Float32BufferAttribute(uv,2));mesh.setIndex(indices);mesh.computeVertexNormals();mesh.computeBoundingSphere();
 const rail=new T.BufferGeometry();rail.setAttribute('position',new T.Float32BufferAttribute(rails,3));
 return {mesh,rail,posts};
}
