import {useMemo,useEffect} from 'react';
import * as T from 'three';
import {footprintPlacement,type CircuitModel} from './circuitSeating';
/** Licensed stadium outline; roof opening, bowl heights and facade are authored context.
 * No NFL seat inventory or F1 hospitality/table allocation is reconstructed.
 */
export default function HardRockStadium({model}:{model:CircuitModel}){
 const feature=model.features.find(f=>f.id==='171419981')!;
 const {bowl,roof,edges,fit}=useMemo(()=>{
  const fit=footprintPlacement(feature.points),center=fit.center;
  function ring(outer:number,inner:number,depth:number){
   const points=feature.points.slice(0,-1),project=(p:number[],s:number)=>new T.Vector2(center[0]+(p[0]-center[0])*s,-center[1]-(p[1]-center[1])*s),shape=new T.Shape(points.map(p=>project(p,outer)));
   shape.holes=[new T.Path(points.slice().reverse().map(p=>project(p,inner)))];return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false});
  }
  const bowl=ring(.96,.59,24),roof=ring(1,.56,1.6);return {bowl,roof,edges:new T.EdgesGeometry(roof,30),fit};
 },[feature]);
 useEffect(()=>()=>{bowl.dispose();roof.dispose();edges.dispose();},[bowl,roof,edges]);
 const field=model.features.find(f=>f.id==='171419978');
 const fieldGeometry=useMemo(()=>field?new T.ShapeGeometry(new T.Shape(field.points.map(p=>new T.Vector2(p[0],-p[1])))):null,[field]);
 useEffect(()=>()=>fieldGeometry?.dispose(),[fieldGeometry]);
 return <group>
  <mesh geometry={bowl} rotation={[-Math.PI/2,0,0]} position={[0,.1,0]} castShadow receiveShadow><meshStandardMaterial color="#89999e" metalness={.25} roughness={.7}/></mesh>
  <group position={[0,34,0]} rotation={[-Math.PI/2,0,0]}><mesh geometry={roof} castShadow receiveShadow><meshStandardMaterial color="#e4e8e2" metalness={.12} roughness={.65}/></mesh><lineSegments geometry={edges}><lineBasicMaterial color="#a9b4b7"/></lineSegments></group>
  {feature.points.filter((_,i)=>i%3===0).slice(0,-1).map((p,i)=><mesh key={i} position={[p[0],29,p[1]]} castShadow><cylinderGeometry args={[.6,.8,10,6]}/><meshStandardMaterial color="#b7c1c0" roughness={.6}/></mesh>)}
  {fieldGeometry&&<mesh geometry={fieldGeometry} position={[0,.15,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><meshStandardMaterial color="#527c54" roughness={1}/></mesh>}
  {[-1,1].map(side=><mesh key={side} position={[fit.center[0]+fit.axis[0]*fit.width*.28*side,21,fit.center[1]+fit.axis[1]*fit.width*.28*side]} rotation={[0,-Math.atan2(fit.axis[1],fit.axis[0]),0]}><boxGeometry args={[24,10,2]}/><meshStandardMaterial color="#173741" metalness={.45} roughness={.3}/></mesh>)}
 </group>;
}
