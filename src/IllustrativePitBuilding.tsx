import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import VenueSurfaceMaterial from './VenueSurfaceMaterial';
import {SurfaceMaterial} from './SceneMaterials';

/** Existing generic pit-block envelope and openings; not venue architecture evidence. */
export default function IllustrativePitBuilding(){
 const geometry=useMemo(()=>{
  const metal:T.BufferGeometry[]=[],doors:T.BufferGeometry[]=[],glass:T.BufferGeometry[]=[];
  const box=(list:T.BufferGeometry[],w:number,h:number,d:number,x:number,y:number,z:number)=>{const g=new T.BoxGeometry(w,h,d);g.translate(x,y,z);list.push(g);};
  box(metal,295,.6,24,0,11,0);
  for(let i=0;i<22;i++){
   const x=-132+i*12.5;
   box(doors,10,5,.15,x,2.5,-8.1);box(glass,10,2,.08,x,7.8,-8.16);
   for(const side of [-1,1]){
    box(metal,.14,5.2,.26,x+side*5.07,2.6,-8.2);
    box(metal,10.3,.14,.24,x,7.8+side*1.07,-8.2);
    box(metal,.14,2.1,.24,x+side*5.07,7.8,-8.2);
   }
   box(metal,10.3,.22,.34,x,5.17,-8.2);
   for(let j=1;j<6;j++)box(metal,.055,2,.16,x-5+10*j/6,7.8,-8.23);
   // Shutter seams are merged and stay within the existing garage faces.
   for(let j=1;j<10;j++)box(metal,9.9,.025,.04,x,j*.5,-8.19);
  }
  const out={metal:mergeGeometries(metal),doors:mergeGeometries(doors),glass:mergeGeometries(glass)};
  [...metal,...doors,...glass].forEach(g=>g.dispose());return out;
 },[]);
 useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
 return <group>
  <mesh position={[0,5,0]} castShadow receiveShadow><boxGeometry args={[285,10,16]}/><VenueSurfaceMaterial surface="concrete" color="#8c959d" roughness={.94} strength={.25}/></mesh>
  <mesh geometry={geometry.metal} castShadow receiveShadow><SurfaceMaterial surface="metal" color="#9ea8ad" metalness={.55} roughness={.6} strength={.2}/></mesh>
  <mesh geometry={geometry.doors} receiveShadow><SurfaceMaterial surface="metal" color="#29313a" metalness={.22} roughness={.8} strength={.3}/></mesh>
  <mesh geometry={geometry.glass}><meshPhysicalMaterial color="#243b4b" metalness={.15} roughness={.28} clearcoat={.45}/></mesh>
 </group>;
}
