import {useEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {bankFrame,closestTrack,type CircuitModel} from './circuitSeating';

/** Geographic park context. Tree crowns, heights and event clearing are authored. */
export default function CircuitPark({model}:{model:CircuitModel}){
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
 const treeRefs=useRef<T.InstancedMesh[]>([]);
 const trees=useMemo(()=>{
  const frames=model.banks.map(b=>({bank:b,frame:bankFrame(model,b)}));
  return (model.vegetation??[]).filter(tree=>{
   const [x,z]=tree.point,track=closestTrack(model,tree.point);if(Math.hypot(x-track[0],z-track[1])<14)return false;
   return !frames.some(({bank:b,frame:f})=>{const dx=x-b.center[0],dz=z-b.center[1],along=dx*Math.cos(f.yaw)-dz*Math.sin(f.yaw),depth=dx*Math.sin(f.yaw)+dz*Math.cos(f.yaw);return Math.abs(along)<b.width/2+12&&Math.abs(depth)<b.rows*.44+14;});
  });
 },[model]);
 useEffect(()=>{
  const object=new T.Object3D();trees.forEach((tree,i)=>{
   const [x,z]=tree.point,height=5+(Number(tree.id)%37)/12,width=2.1+(Number(tree.id)%17)/12;
   object.rotation.set(0,0,0);object.position.set(x,height*.38,z);object.scale.set(.22,height*.76,.22);object.updateMatrix();treeRefs.current[0]?.setMatrixAt(i,object.matrix);
   object.position.set(x,height*.82,z);object.scale.set(width,height*.4,width);object.rotation.y=Number(tree.id)%6;object.updateMatrix();treeRefs.current[1]?.setMatrixAt(i,object.matrix);
  });for(const mesh of treeRefs.current){if(mesh){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}
 },[trees]);
 useEffect(()=>()=>{water.forEach(w=>w.geometry.dispose());normal.dispose();},[water,normal]);
 return <>
  {water.map(w=><mesh key={w.id} geometry={w.geometry} rotation={[-Math.PI/2,0,0]} position={[0,.035,0]} receiveShadow><meshPhysicalMaterial color="#3f8b9e" roughness={.28} metalness={.08} clearcoat={.75} normalMap={normal} normalScale={new T.Vector2(.2,.2)}/></mesh>)}
  {trees.length>0&&<>
   <instancedMesh ref={m=>{if(m)treeRefs.current[0]=m;}} args={[undefined,undefined,trees.length]} castShadow receiveShadow><cylinderGeometry args={[1,1,1,6]}/><meshStandardMaterial color="#66563d" roughness={1}/></instancedMesh>
   <instancedMesh ref={m=>{if(m)treeRefs.current[1]=m;}} args={[undefined,undefined,trees.length]} castShadow receiveShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#4b743b" roughness={1}/></instancedMesh>
  </>}
 </>;
}
