import {useMemo,useEffect} from 'react';
import * as T from 'three';
import {bankFrame,bankGroundHeight,type CircuitModel} from './circuitSeating';
import {groundHeight,roadSample} from './circuitTerrain';
/** Coarse licensed ground samples plus explicitly authored road grading/platforms. */
export default function CircuitTerrainMesh({model,texture}:{model:CircuitModel;texture:T.Texture}){
 const geometry=useMemo(()=>{
  const t=model.terrain!,[west,north,east,south]=t.bounds,cols=257,rows=385,vertices:number[]=[],uv:number[]=[],indices:number[]=[];
  const pads=model.banks.map(bank=>({bank,frame:bankFrame(model,bank),height:bankGroundHeight(model,bank)}));
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const x=west+col/(cols-1)*(east-west),z=north+row/(rows-1)*(south-north);let y=groundHeight(model,x,z)-.22;
   for(const {bank,frame,height} of pads){const dx=x-bank.center[0],dz=z-bank.center[1],along=dx*Math.cos(frame.yaw)-dz*Math.sin(frame.yaw),depth=dx*Math.sin(frame.yaw)+dz*Math.cos(frame.yaw),edge=Math.max(Math.abs(along)-bank.width/2-2,Math.abs(depth)-bank.rows*.44-2);if(edge<8){const blend=T.MathUtils.smoothstep(edge,0,8);y=(height-.15)*(1-blend)+y*blend;}}
   vertices.push(x,y,z);uv.push((x-west)/20000,(south-z)/20000);
  }
  for(let row=0;row<rows-1;row++)for(let col=0;col<cols-1;col++){const a=row*cols+col,b=a+1,c=a+cols,d=c+1;for(const tri of [[a,c,b],[b,c,d]]){const cx=tri.reduce((n,i)=>n+vertices[i*3],0)/3,cz=tri.reduce((n,i)=>n+vertices[i*3+2],0)/3;if(roadSample(model,cx,cz).distance>=16)indices.push(...tri);}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
 },[model]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} receiveShadow><meshStandardMaterial map={texture} roughness={1}/></mesh>;
}
