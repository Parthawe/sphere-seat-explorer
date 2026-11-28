import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {SurfaceMaterial} from './SceneMaterials';
import {circuitRibbon} from './circuitRibbon';
import {studyRibbonBody} from './studyRibbonBody';

/** Studio relief of the source outline; road width and thickness are illustrative. */
export default function StudyTrackSurface({points}:{points:T.Vector3[]}){
 const geometry=useMemo(()=>{
  const shoulder=circuitRibbon(points,.16);
  return {body:studyRibbonBody(shoulder,.14),road:circuitRibbon(points,.105),edge:circuitRibbon(points,.12),shoulder};
 },[points]);
 useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
 return <group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.05,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#080c12" roughness={.92} metalness={.04}/></mesh>
  <mesh geometry={geometry.body} position={[0,-.013,0]} receiveShadow castShadow><SurfaceMaterial surface="metal" color="#323f4b" roughness={.48} metalness={.46} grainScale={6} strength={.1}/></mesh>
  <mesh geometry={geometry.shoulder} position={[0,-.013,0]} receiveShadow castShadow><meshStandardMaterial color="#39434d" roughness={.65} metalness={.3}/></mesh>
  <mesh geometry={geometry.edge} position={[0,-.005,0]} receiveShadow><meshStandardMaterial color="#dce1e3" roughness={.66} metalness={.12}/></mesh>
  <mesh geometry={geometry.road} receiveShadow><SurfaceMaterial surface="asphalt" color="#1b2229" roughness={.88} grainScale={14} strength={.2}/></mesh>
 </group>;
}
