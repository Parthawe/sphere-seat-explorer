import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import {tracksideGeometry} from './tracksideGeometry';
import type {CircuitModel} from './circuitSeating';

/** Filtered wire coverage avoids a solid grey wall when links become subpixel. */
export default function TracksideFence({model}:{model:CircuitModel}){
 const data=useMemo(()=>tracksideGeometry(model),[model]),ref=useRef<T.InstancedMesh>(null),{gl}=useThree();
 useEffect(()=>()=>{data.mesh.dispose();data.rail.dispose();},[data]);
 useLayoutEffect(()=>{data.posts.forEach((m,i)=>ref.current?.setMatrixAt(i,m));if(ref.current){ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();}},[data]);
 const compile=(shader:Parameters<T.MeshStandardMaterial['onBeforeCompile']>[0])=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vFenceMetres;').replace('#include <begin_vertex>','#include <begin_vertex>\nvFenceMetres=uv;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vFenceMetres;').replace('#include <alphatest_fragment>',`#include <alphatest_fragment>
   vec2 diamond=vec2(vFenceMetres.x+vFenceMetres.y,vFenceMetres.x-vFenceMetres.y)/.1;
   vec2 pixel=max(fwidth(diamond),vec2(.0001));
   vec2 lineDistance=abs(fract(diamond-.5)-.5);
   vec2 wire=1.-smoothstep(vec2(.018)-pixel*.5,vec2(.018)+pixel*.5,lineDistance);
   float resolved=1.-smoothstep(.35,1.1,max(pixel.x,pixel.y));
   diffuseColor.a*=max(wire.x,wire.y)*resolved*.65;
   if(diffuseColor.a<.005)discard;`);
  gl.domElement.dataset.fenceDetail='filtered-wire';
 };
 return <group>
  <mesh geometry={data.mesh} renderOrder={2} raycast={()=>{}}><meshStandardMaterial color="#a8b1b6" metalness={.65} roughness={.5} side={T.DoubleSide} transparent depthWrite={false} onBeforeCompile={compile} customProgramCacheKey={()=>'venue-fence-wire-v1'}/></mesh>
  <instancedMesh ref={ref} args={[undefined,undefined,data.posts.length]} castShadow><cylinderGeometry args={[.045,.06,3.12,5]}/><meshStandardMaterial color="#7c868a" metalness={.7} roughness={.48}/></instancedMesh>
  <lineSegments geometry={data.rail}><lineBasicMaterial color="#89959a" transparent opacity={.42}/></lineSegments>
 </group>;
}
