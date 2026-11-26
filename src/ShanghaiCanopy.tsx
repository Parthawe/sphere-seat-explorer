import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {footprintPlacement,type CircuitModel} from './circuitSeating';
import source from './shanghai-geometry.json';
/** Licensed building outline and raw height-tag inspired context.
 * Flat canopy profile, supports and thickness are authored, not a structural survey.
 */
export default function ShanghaiCanopy({model}:{model:CircuitModel}){
 const feature=model.features.find(f=>f.id==='107371135')!,height=Number(source.source_context.main_grandstand_height_tag);
 const {geometry,edges,fit}=useMemo(()=>{
  const shape=new T.Shape(feature.points.map(p=>new T.Vector2(p[0],-p[1]))),geometry=new T.ExtrudeGeometry(shape,{depth:1.2,bevelEnabled:false});
  return {geometry,edges:new T.EdgesGeometry(geometry,25),fit:footprintPlacement(feature.points)};
 },[feature]);
 useEffect(()=>()=>{geometry.dispose();edges.dispose();},[geometry,edges]);
 return <group>
  <group position={[0,height-1.2,0]} rotation={[-Math.PI/2,0,0]}>
   <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color="#adb5b5" metalness={.2} roughness={.7}/></mesh>
   <lineSegments geometry={edges}><lineBasicMaterial color="#75848a"/></lineSegments>
  </group>
  {Array.from({length:8},(_,i)=>{const along=(i-3.5)*45,x=fit.center[0]+fit.axis[0]*along+fit.axis[1]*67,z=fit.center[1]+fit.axis[1]*along-fit.axis[0]*67;return <mesh key={i} position={[x,(height-1.2)/2,z]} castShadow><cylinderGeometry args={[1.1,1.6,height-1.2,8]}/><meshStandardMaterial color="#9fa9a9" roughness={.8}/></mesh>;})}
 </group>;
}
