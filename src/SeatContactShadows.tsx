import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';import {useThree} from '@react-three/fiber';import * as T from 'three';
/** Low-cost local contact under each modeled chair. No time uniform or texture fetch. */
export default function SeatContactShadows({positions}:{positions:number[][]}){
 const mesh=useRef<T.InstancedMesh>(null),{invalidate}=useThree(),geometry=useMemo(()=>new T.PlaneGeometry(1,1).rotateX(-Math.PI/2),[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useLayoutEffect(()=>{const o=new T.Object3D();positions.forEach((p,i)=>{o.position.set(p[0],p[1]-.145,p[2]);o.scale.set(.72,1,.8);o.updateMatrix();mesh.current?.setMatrixAt(i,o.matrix);});if(mesh.current){mesh.current.instanceMatrix.needsUpdate=true;mesh.current.computeBoundingSphere();}invalidate();},[positions,invalidate]);
 return <instancedMesh ref={mesh} args={[geometry,undefined,positions.length]} renderOrder={1}>
  <shaderMaterial transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} vertexShader={`varying vec2 contactUv;void main(){contactUv=uv;vec4 p=vec4(position,1.);p=instanceMatrix*p;gl_Position=projectionMatrix*modelViewMatrix*p;}`} fragmentShader={`varying vec2 contactUv;void main(){vec2 p=(contactUv-.5)*2.;float a=exp(-dot(p,p)*3.7)*.36;gl_FragColor=vec4(.018,.022,.028,a);}`}/>
 </instancedMesh>;
}
