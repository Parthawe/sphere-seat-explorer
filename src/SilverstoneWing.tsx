import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {footprintPlacement,type CircuitModel} from './circuitSeating';

/** Licensed plan footprint; all elevations, glazing and roof folds are authored. */
export default function SilverstoneWing({model}:{model:CircuitModel}){
 const feature=model.features.find(f=>f.id==='227332429')!;
 const {geometry,fit,depth}=useMemo(()=>{
  const shape=new T.Shape(feature.points.map(p=>new T.Vector2(p[0],-p[1])));
  const geometry=new T.ExtrudeGeometry(shape,{depth:10,bevelEnabled:false});
  const fit=footprintPlacement(feature.points),side=[-fit.axis[1],fit.axis[0]],values=feature.points.map(p=>(p[0]-fit.center[0])*side[0]+(p[1]-fit.center[1])*side[1]);
  return {geometry,fit,depth:Math.max(...values)-Math.min(...values)};
 },[feature]);
 const folds=useMemo(()=>{
  const result:number[]=[],span=fit.width/7;
  for(let i=0;i<7;i++){
   const x=-fit.width/2+i*span,a=[x,10,-depth/2],b=[x+span,10,-depth/2],c=[x+span*.65,17,depth*.05],d=[x,10,depth/2],e=[x+span,10,depth/2];
   result.push(...a,...c,...b,...d,...e,...c,...a,...d,...c,...b,...c,...e);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(result,3));g.computeVertexNormals();return g;
 },[fit.width,depth]);
 useEffect(()=>()=>{geometry.dispose();folds.dispose();},[geometry,folds]);
 return <>
  <mesh geometry={geometry} rotation={[-Math.PI/2,0,0]} castShadow receiveShadow><meshStandardMaterial color="#969fa2" roughness={.6} metalness={.22}/></mesh>
  <group position={[fit.center[0],0,fit.center[1]]} rotation={[0,-Math.atan2(fit.axis[1],fit.axis[0]),0]}>
   <mesh geometry={folds} castShadow><meshStandardMaterial color="#d9dddc" metalness={.5} roughness={.36} side={T.DoubleSide}/></mesh>
   {[-1,1].map(side=><group key={side} position={[0,0,side*(depth/2+.15)]}>
    <mesh position={[0,7,0]}><boxGeometry args={[fit.width*.95,3,.18]}/><meshPhysicalMaterial color="#385464" roughness={.17} metalness={.45} clearcoat={1}/></mesh>
    {Array.from({length:28},(_,i)=><mesh key={i} position={[-fit.width*.46+i*fit.width*.92/27,2.6,0]}><boxGeometry args={[fit.width/35,5,.2]}/><meshStandardMaterial color={i%4===0?'#454c51':'#67737b'} metalness={.35} roughness={.6}/></mesh>)}
   </group>)}
  </group>
 </>;
}
