import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import data from './venue-context.json';
import {SurfaceMaterial} from './SceneMaterials';
import type {CircuitModel} from './circuitSeating';
export const venueContext=data.venues;
export function hasVenueContext(id:string):id is keyof typeof venueContext{return Object.hasOwn(venueContext,id);}

/** Source plan geometry. Elevation and finish are explicitly illustrative.
 * All buildings share four merged meshes, keeping draw calls independent of count. */
export default function VenueContext({model}:{model:CircuitModel}){
 const geometry=useMemo(()=>{
  if(!hasVenueContext(model.id))return null;
  const bodies:T.BufferGeometry[]=[],roofs:T.BufferGeometry[]=[],frames:T.BufferGeometry[]=[],glass:T.BufferGeometry[]=[];
  for(const b of venueContext[model.id].buildings){
   const shape=new T.Shape(b.points.map(p=>new T.Vector2(p[0],-p[1])));
   const body=new T.ExtrudeGeometry(shape,{depth:b.height,steps:1,bevelEnabled:false});body.rotateX(-Math.PI/2);bodies.push(body);
   const roof=new T.ShapeGeometry(shape);roof.rotateX(-Math.PI/2);roof.translate(0,b.height+.02,0);roofs.push(roof.toNonIndexed());roof.dispose();
   // Repeating facade modules are an authored finish, not surveyed windows.
   for(let i=1;i<b.points.length;i++){
    const a=b.points[i-1],c=b.points[i],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
    if(length<18)continue;
    const count=Math.ceil(length/8),yaw=-Math.atan2(dz,dx);
    const beam=new T.BoxGeometry(length+.3,.28,.45);beam.rotateY(yaw);beam.translate((a[0]+c[0])/2,b.height-.2,(a[1]+c[1])/2);frames.push(beam);
    for(let j=0;j<count;j++){
     const t=(j+.5)/count,panel=new T.BoxGeometry(length/count*.8,Math.min(2.5,b.height*.25),.2);panel.rotateY(yaw);panel.translate(a[0]+dx*t,b.height*.69,a[1]+dz*t);glass.push(panel);
     const post=new T.BoxGeometry(.18,b.height,.3);post.rotateY(yaw);post.translate(a[0]+dx*j/count,b.height/2,a[1]+dz*j/count);frames.push(post);
    }
   }
  }
  const walls=mergeGeometries(bodies),tops=mergeGeometries(roofs),structure=mergeGeometries(frames),glazing=mergeGeometries(glass);[...bodies,...roofs,...frames,...glass].forEach(g=>g.dispose());return {walls,tops,structure,glazing};
 },[model.id]);
 useEffect(()=>()=>{geometry?.walls?.dispose();geometry?.tops?.dispose();geometry?.structure?.dispose();geometry?.glazing?.dispose();},[geometry]);
 return geometry&&<group>
  {geometry.walls&&<mesh geometry={geometry.walls} castShadow receiveShadow><SurfaceMaterial surface="concrete" color={model.id==='bahrain'?'#b8ac96':'#9fa9b1'} roughness={.83} strength={.55}/></mesh>}
  {geometry.tops&&<mesh geometry={geometry.tops} receiveShadow><SurfaceMaterial surface="metal" color="#c1c9ce" metalness={.35} roughness={.58} side={T.DoubleSide}/></mesh>}
  {geometry.structure&&<mesh geometry={geometry.structure} castShadow receiveShadow><SurfaceMaterial surface="metal" color="#75828b" metalness={.55} roughness={.42}/></mesh>}
  {geometry.glazing&&<mesh geometry={geometry.glazing}><meshPhysicalMaterial color="#243c4d" metalness={.45} roughness={.22} clearcoat={1}/></mesh>}
 </group>;
}
