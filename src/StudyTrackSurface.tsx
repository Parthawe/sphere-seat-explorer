import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {SurfaceMaterial} from './SceneMaterials';
import {circuitRibbon} from './circuitRibbon';

/** A studio presentation of the source line, never a surveyed road or venue. */
export default function StudyTrackSurface({points}:{points:T.Vector3[]}){
 const geometry=useMemo(()=>{
  const xs=points.map(p=>p.x),zs=points.map(p=>p.z),width=Math.max(...xs)-Math.min(...xs)+1.4,depth=Math.max(...zs)-Math.min(...zs)+1.4;
  const shape=new T.Shape(),x=-width/2,y=-depth/2,r=.16;
  shape.moveTo(x+r,y);shape.lineTo(x+width-r,y);shape.quadraticCurveTo(x+width,y,x+width,y+r);shape.lineTo(x+width,y+depth-r);shape.quadraticCurveTo(x+width,y+depth,x+width-r,y+depth);shape.lineTo(x+r,y+depth);shape.quadraticCurveTo(x,y+depth,x,y+depth-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  return {base:new T.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035}),road:circuitRibbon(points,.09),edge:circuitRibbon(points,.105),shoulder:circuitRibbon(points,.145)};
 },[points]);
 useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
 return <group>
  <mesh geometry={geometry.base} rotation={[-Math.PI/2,0,0]} position={[0,-.19,0]} receiveShadow castShadow><SurfaceMaterial surface="coated" color="#252b34" roughness={.72} metalness={.22} grainScale={6} strength={.12}/></mesh>
  <mesh geometry={geometry.shoulder} position={[0,-.013,0]} receiveShadow><meshStandardMaterial color="#414b54" roughness={.95}/></mesh>
  <mesh geometry={geometry.edge} position={[0,-.005,0]} receiveShadow><meshStandardMaterial color="#c2c7c9" roughness={.8}/></mesh>
  <mesh geometry={geometry.road} receiveShadow><SurfaceMaterial surface="asphalt" color="#171d24" roughness={.92} grainScale={14} strength={.22}/></mesh>
 </group>;
}
