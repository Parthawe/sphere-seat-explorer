import type {RaceLighting} from './raceLighting';
import {fitStudyCamera} from './studyCamera';
import useDoubleTapFocus from './useDoubleTapFocus';
import StudyTrackSurface from './StudyTrackSurface';
import useSceneQuality from './useSceneQuality';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ShaderGuard,StudioReflections} from './SceneMaterials';
import {CircuitCars} from './PassingCars';
import {buildStudyGeometry} from './circuitStudy';
import type {CircuitLayout} from './circuitLayouts';


type Props={lighting?:RaceLighting;immersive?:boolean;mode?:'perspective'|'top';autoRotate?:boolean;preview?:boolean;layout:CircuitLayout;playing:boolean;visible:boolean;reset:number;zoom:number;onReady:()=>void;onUnavailable:()=>void};
export default function CircuitIllustrativeScene(props:Props){
 const quality=useSceneQuality();
 return <Canvas shadows dpr={quality.dpr} frameloop={!props.visible?'never':props.playing?'always':'demand'} camera={{fov:44,near:.015,far:120,position:[12,15,15]}} gl={{antialias:true}} fallback={<span>3D requires WebGL.</span>}><ShaderGuard onUnavailable={props.onUnavailable}/><World {...props} playing={props.playing&&props.visible} shadowSize={quality.shadowSize}/></Canvas>;
}
function World({lighting,layout,mode='perspective',immersive=false,autoRotate,preview,playing,reset,zoom,onReady,onUnavailable,shadowSize}:Props&{shadowSize:number}){
 const {camera,gl,invalidate,size}=useThree(),controls=useRef<OrbitControls|null>(null),goal=useRef<{eye:T.Vector3;target:T.Vector3}|null>(null),phase=useRef(.1),reported=useRef(false);
 useDoubleTapFocus(!preview,.35,(eye,target)=>{
  goal.current={eye,target};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(eye);controls.current?.target.copy(target);camera.lookAt(target);goal.current=null;}
  invalidate();
 });
 const geometry=useMemo(()=>buildStudyGeometry(layout),[layout]);
 const points=useMemo(()=>geometry.points.map(p=>new T.Vector3(p[0],.11,p[1])),[geometry]);

 const path=useMemo(()=>{const p=new T.CurvePath<T.Vector3>();for(let i=1;i<points.length;i++)p.add(new T.LineCurve3(points[i-1],points[i]));p.updateArcLengths();return p;},[points]);
 const orbitTime=useRef(0);
 const previousZoom=useRef(zoom);
 const cameraGoal=useMemo(()=>fitStudyCamera(points,size.width/size.height,mode,size.height,immersive,Boolean(preview&&autoRotate)),[points,mode,size.width,size.height,immersive,preview,autoRotate]);
 useEffect(()=>{const lens=camera as T.PerspectiveCamera;lens.clearViewOffset();if(immersive)lens.setViewOffset(size.width,size.height,0,cameraGoal.offsetY,size.width,size.height);lens.updateProjectionMatrix();},[camera,cameraGoal,immersive,size.width,size.height]);
 useEffect(()=>{gl.setClearColor(lighting?.period==='day'?'#778491':lighting?.period==='dusk'?'#504654':'#11161c');gl.domElement.dataset.raceLight=lighting?.period??'night';gl.domElement.dataset.raceLightBasis=lighting?.basis??'study';const lost=(e:Event)=>{e.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onUnavailable,lighting?.period,lighting?.basis]);
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;c.enablePan=false;c.minDistance=.2;c.maxDistance=55;c.maxPolarAngle=Math.PI*.48;const change=()=>invalidate(),manual=()=>{goal.current=null;};c.addEventListener('change',change);c.addEventListener('start',manual);controls.current=c;return()=>{c.dispose();controls.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{
  goal.current=cameraGoal;
  const q=matchMedia('(prefers-reduced-motion: reduce)'),settle=()=>{if(q.matches&&goal.current){camera.position.copy(goal.current.eye);controls.current?.target.copy(goal.current.target);camera.lookAt(goal.current.target);goal.current=null;invalidate();}};
  settle();q.addEventListener('change',settle);invalidate();return()=>q.removeEventListener('change',settle);
 },[cameraGoal,reset,camera,invalidate]);
 useEffect(()=>{const delta=zoom-previousZoom.current;previousZoom.current=zoom;if(!delta)return;goal.current=null;const target=controls.current?.target??new T.Vector3();camera.position.sub(target).multiplyScalar(delta>0?.85:1.18).add(target);controls.current?.update();invalidate();},[zoom,camera,invalidate]);
 useEffect(()=>{gl.domElement.dataset.studyCamera=mode;gl.domElement.dataset.sceneSurface='studio-outline';gl.domElement.dataset.studySeats='none';invalidate();},[gl,invalidate,mode]);

 useFrame((_,delta)=>{
  if(goal.current){const t=1-Math.exp(-Math.min(delta,.05)*8);camera.position.lerp(goal.current.eye,t);controls.current?.target.lerp(goal.current.target,t);camera.lookAt(controls.current?.target??goal.current.target);if(camera.position.distanceTo(goal.current.eye)<.002){camera.position.copy(goal.current.eye);goal.current=null;}else invalidate();}
  if(!goal.current&&autoRotate&&playing){orbitTime.current+=Math.min(delta,.05);camera.position.copy(cameraGoal.eye).applyAxisAngle(T.Object3D.DEFAULT_UP,Math.sin(orbitTime.current*.22)*.12);gl.domElement.dataset.previewOrbit=String(orbitTime.current);}
  controls.current?.update();
  if(playing)phase.current=(phase.current+Math.min(delta,.05)/35)%1;
  if(!reported.current){reported.current=true;onReady();}
 });
 return <><StudioReflections intensity={.55}/><ambientLight intensity={lighting?.period==='night'?.15:.3}/><hemisphereLight args={['#f7f4f1','#24242b',.65]}/><directionalLight position={[-7,13,7]} intensity={lighting?.period==='night'?1.1:lighting?.period==='dusk'?1.8:2.7} color={lighting?.period==='dusk'?'#ffd1a0':'#fff2e3'} castShadow shadow-mapSize={[shadowSize,shadowSize]} shadow-bias={-.0001} shadow-normalBias={.003} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/><directionalLight position={[8,4,-8]} intensity={.6}/>
  <StudyTrackSurface points={points}/>
  <CircuitCars path={path} phase={phase} playing={playing}/>
 </>;
}
