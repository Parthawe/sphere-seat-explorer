import {useThree} from '@react-three/fiber';
import {WaterSurface} from './WorldShaders';
import {groundHeight} from './circuitTerrain';
import CircuitTerrainMesh from './CircuitTerrainMesh';
import {useEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {bankFrame,closestTrack,type CircuitModel} from './circuitSeating';

export function createGrassTexture(repeatX=420,repeatY=420,base:[number,number,number]=[67,86,53]){
  const size=128,pixels=new Uint8Array(size*size*4);let seed=31871;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   const variation=(seed/4294967296-.5)*16+Math.sin(x*.16)*Math.cos(y*.11)*4,i=(y*size+x)*4;
   pixels[i]=base[0]+variation;pixels[i+1]=base[1]+variation;pixels[i+2]=base[2]+variation*.7;pixels[i+3]=255;
  }
  const texture=new T.DataTexture(pixels,size,size);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}


/** Geographic park context. Tree crowns, heights and event clearing are authored. */
export default function CircuitPark({model,motion=false}:{model:CircuitModel;motion?:boolean}){
 const {gl}=useThree();
 const water=useMemo(()=>model.features.filter(f=>f.kind==='water').map(f=>{
  const shape=new T.Shape(f.points.map(p=>new T.Vector2(p[0],-p[1])));
  shape.holes=(f.holes??[]).map(h=>new T.Path(h.map(p=>new T.Vector2(p[0],-p[1]))));
  return {id:f.id,geometry:new T.ShapeGeometry(shape)};
 }),[model]);
 const normal=useMemo(()=>{
  const size=64,pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=(y*size+x)*4;pixels[i]=128+Math.round(20*Math.sin(x/size*Math.PI*8+y/size*Math.PI*4));pixels[i+1]=128+Math.round(20*Math.cos(y/size*Math.PI*6-x/size*Math.PI*2));pixels[i+2]=253;pixels[i+3]=255;
  }
  const texture=new T.DataTexture(pixels,size,size);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(.14,.14);texture.needsUpdate=true;return texture;
 },[]);
 const grass=useMemo(()=>createGrassTexture(420,420,model.groundStyle==='campus'?[103,110,113]:undefined),[model.groundStyle]);
 useEffect(()=>{grass.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());grass.needsUpdate=true;return()=>grass.dispose();},[grass,gl]);
 const palmGeometry=useMemo(()=>{
  if(model.vegetationStyle!=='palms')return null;
  const vertices:number[]=[];
  for(let leaf=0;leaf<8;leaf++)for(let step=0;step<7;step++){
   const angle=leaf*Math.PI/4;
   function p(u:number,side:number){const r=u,w=Math.sin(u*Math.PI)*.1*side,y=Math.sin(u*Math.PI)*.22-u*.35;return [Math.cos(angle)*r-Math.sin(angle)*w,y,Math.sin(angle)*r+Math.cos(angle)*w];}
   const u=step/7,v=(step+1)/7,a=p(u,-1),b=p(u,1),c=p(v,-1),d=p(v,1);vertices.push(...a,...c,...b,...b,...c,...d);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();return g;
 },[model.vegetationStyle]);
 useEffect(()=>()=>palmGeometry?.dispose(),[palmGeometry]);
 const treeRefs=useRef<T.InstancedMesh[]>([]);
 const trees=useMemo(()=>{
  const woodland=!!model.terrain||model.vegetationStyle==='woodland';
  const frames=model.banks.map(b=>({bank:b,frame:bankFrame(model,b)}));
  return (model.vegetation??[]).filter(tree=>{
   const [x,z]=tree.point,track=closestTrack(model,tree.point);
   if(model.id==='miami'){const p=model.features.find(f=>f.id==='171419981')!.points;let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;}if(inside)return false;}if(Math.hypot(x-track[0],z-track[1])<(woodland?22:14))return false;
   return !frames.some(({bank:b,frame:f})=>{const dx=x-b.center[0],dz=z-b.center[1],along=dx*Math.cos(f.yaw)-dz*Math.sin(f.yaw),depth=dx*Math.sin(f.yaw)+dz*Math.cos(f.yaw);return Math.abs(along)<b.width/2+12&&Math.abs(depth)<b.rows*.44+14;});
  });
 },[model]);
 useEffect(()=>{
  const object=new T.Object3D();trees.forEach((tree,i)=>{
   const palm=model.vegetationStyle==='palms';
   const [x,z]=tree.point,ground=groundHeight(model,x,z),height=palm?9+(Number(tree.id)%17)/4:(model.terrain||model.vegetationStyle==='woodland')?12+(Number(tree.id)%37)/3:5+(Number(tree.id)%37)/12,width=palm?3.2+(Number(tree.id)%11)/10:(model.terrain||model.vegetationStyle==='woodland')?4+(Number(tree.id)%17)/5:2.1+(Number(tree.id)%17)/12;
   object.rotation.set(0,0,0);object.position.set(x,ground+height*(palm?.43:.38),z);object.scale.set(.22,height*(palm?.86:.76),.22);object.updateMatrix();treeRefs.current[0]?.setMatrixAt(i,object.matrix);
   object.position.set(x,ground+height*(palm?.86:.82),z);object.scale.set(width,palm?width:height*.4,width);object.rotation.y=Number(tree.id)%6;object.updateMatrix();treeRefs.current[1]?.setMatrixAt(i,object.matrix);
  });for(const mesh of treeRefs.current){if(mesh){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}
 },[trees]);
 useEffect(()=>()=>{water.forEach(w=>w.geometry.dispose());normal.dispose();},[water,normal]);
 return <>
  {model.terrain?<CircuitTerrainMesh model={model} texture={grass}/>:<mesh position={[0,-1,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20000,20000]}/><meshStandardMaterial map={grass} roughness={1}/></mesh>}
  {water.map(w=><mesh key={w.id} geometry={w.geometry} rotation={[-Math.PI/2,0,0]} position={[0,.035,0]} receiveShadow><WaterSurface normalMap={normal} playing={motion}/></mesh>)}
  {trees.length>0&&<>
   <instancedMesh ref={m=>{if(m)treeRefs.current[0]=m;}} args={[undefined,undefined,trees.length]} castShadow receiveShadow><cylinderGeometry args={[1,1,1,6]}/><meshStandardMaterial color="#66563d" roughness={1}/></instancedMesh>
   <instancedMesh ref={m=>{if(m)treeRefs.current[1]=m;}} args={[palmGeometry??undefined,undefined,trees.length]} castShadow receiveShadow>{!palmGeometry&&<icosahedronGeometry args={[1,1]}/>}<meshStandardMaterial color={model.terrain?'#315439':model.vegetationStyle==='palms'?'#426844':'#4b743b'} roughness={1} side={palmGeometry?T.DoubleSide:T.FrontSide}/></instancedMesh>
  </>}
 </>;
}
