import {useEffect,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as T from 'three';
import FormulaCar from './FormulaCar';

const colors=['#e10600','#e8e8ec','#2ca99f'];
export function CircuitCars({path,phase,playing}:{path:T.Curve<T.Vector3>;phase:RefObject<number>;playing:boolean}) {
  const cars=useRef<(T.Group|null)[]>([]),wheels=useRef<(T.Group|null)[]>([]);
  const scratch=useRef({p:new T.Vector3(),t:new T.Vector3(),q:new T.Quaternion(),axis:new T.Vector3(0,1,0)});
  const {gl}=useThree();
  useEffect(()=>{gl.domElement.dataset.carCount='3';gl.domElement.dataset.carsPlaying=String(playing);gl.domElement.dataset.carDetail='formula-miniature';},[gl,playing]);
  useFrame((_,dt)=>{
    cars.current.forEach((car,i)=>{if(!car)return;const u=(phase.current-i*.025+1)%1;
      const {p,t,q,axis}=scratch.current;path.getPointAt(u,p);path.getTangentAt(u,t);
      car.position.copy(p);car.position.y+=.023;
      q.setFromAxisAngle(axis,Math.atan2(t.x,t.z));car.quaternion.slerp(q,playing?1-Math.exp(-Math.min(dt,.05)*18):1);
      if(playing)wheels.current[i]?.children.forEach(w=>w.rotation.x-=Math.min(dt,.05)*20);
    });
  });
  return <>{colors.map((color,i)=><group key={color} ref={r=>{cars.current[i]=r;}} scale={.055}><FormulaCar color={color} compact wheels={r=>{wheels.current[i]=r;}}/></group>)}</>;
}

export function StraightPassCars({playing}:{playing:boolean}) {
  const cars=useRef<(T.Group|null)[]>([]),wheels=useRef<(T.Group|null)[]>([]),distance=useRef(34);
  const {gl}=useThree();
  useEffect(()=>{gl.domElement.dataset.carCount='3';gl.domElement.dataset.carsPlaying=String(playing);gl.domElement.dataset.carDetail='formula';},[gl,playing]);
  useFrame((_,dt)=>{
    if(playing)distance.current=(distance.current+Math.min(dt,.05)*27)%115;
    cars.current.forEach((car,i)=>{if(!car)return;const x=((distance.current-i*12+115)%115)-57.5;
      car.position.set(x,.395,28+(i-1)*.5);car.visible=x>-49&&x<49;
      if(playing)wheels.current[i]?.children.forEach(w=>w.rotation.x-=Math.min(dt,.05)*27/.36);
    });
  });
  return <>{colors.map((color,i)=><group key={color} ref={r=>{cars.current[i]=r;}} rotation={[0,Math.PI/2,0]}><FormulaCar color={color} wheels={r=>{wheels.current[i]=r;}}/></group>)}</>;
}
