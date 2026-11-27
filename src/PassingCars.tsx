import {useEffect,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as T from 'three';
import FormulaCar from './FormulaCar';
import {advanceTraffic,createTrafficField,fieldColors} from './raceTraffic';

const colors=['#e10600','#e8e8ec','#2ca99f'];
export function CircuitCars({path,phase,playing,scale=.055,height=.023,lapSeconds=35}:{path:T.Curve<T.Vector3>;phase:RefObject<number>;playing:boolean;scale?:number;height?:number;lapSeconds?:number}) {
  const cars=useRef<(T.Group|null)[]>([]),wheels=useRef<(T.Group|null)[]>([]),field=useRef(createTrafficField(phase.current));
  const scratch=useRef({p:new T.Vector3(),t:new T.Vector3(),next:new T.Vector3(),q:new T.Quaternion(),euler:new T.Euler()});
  const {gl,invalidate}=useThree();
  useEffect(()=>{field.current=createTrafficField(phase.current);invalidate();},[path,phase,invalidate]);
  useEffect(()=>{gl.domElement.dataset.carCount=String(fieldColors.length);gl.domElement.dataset.carsPlaying=String(playing);gl.domElement.dataset.carDetail=scale===1?'formula':'formula-miniature';},[gl,playing,scale]);
  useFrame((_,dt)=>{
    if(playing)advanceTraffic(field.current,dt,lapSeconds,6*scale/path.getLength(),u=>{const {t,next}=scratch.current;path.getTangentAt(u,t);path.getTangentAt((u+.003)%1,next);return .57+.43*Math.max(0,t.dot(next))**16;});
    cars.current.forEach((car,i)=>{if(!car)return;const u=field.current.positions[i];
      const {p,t}=scratch.current;path.getPointAt(u,p);path.getTangentAt(u,t);
      car.position.copy(p);car.position.y+=height;
      const {q,euler}=scratch.current;euler.set(-Math.atan2(t.y,Math.hypot(t.x,t.z)),Math.atan2(t.x,t.z),0,'YXZ');q.setFromEuler(euler);car.quaternion.slerp(q,playing?1-Math.exp(-Math.min(dt,.05)*18):1);
      if(playing)wheels.current[i]?.children.forEach(w=>w.rotation.x-=field.current.travel[i]*path.getLength()/(.36*scale));
    });
    if(playing)invalidate();
  });
  return <>{fieldColors.map((color,i)=><group key={i} ref={r=>{cars.current[i]=r;}} scale={scale}><FormulaCar color={color} compact={scale!==1||i>=4} wheels={r=>{wheels.current[i]=r;}}/></group>)}</>;
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
