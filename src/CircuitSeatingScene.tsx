import {attachSeatedPointerControls} from './seatedPointerControls';
import VenueContext,{hasVenueContext} from './VenueContext';
import {detailedSeatPositions,distantSeatBands} from './seatDetail';
import useDoubleTapFocus from './useDoubleTapFocus';
import useSceneQuality from './useSceneQuality';
import BankSceneMarkers from './BankSceneMarkers';
import {advanceTraffic,createTrafficField,fieldColors} from './raceTraffic';
import {WorldSky} from './WorldShaders';
import {stadiumSeatPanel,modelSeatAccent} from './stadiumSeat';
import {flightDuration,flightProgress,sampleFlight,settleCamera} from './cameraFlight';
import {SurfaceMaterial,ShaderGuard,StudioReflections} from './SceneMaterials';
import {LightShaft} from './Atmosphere';
import {seatedLookTarget} from "./seatLook";
import {groundHeight,roadSample} from './circuitTerrain';
import SilverstoneWing from './SilverstoneWing';
import ShanghaiCanopy from './ShanghaiCanopy';
import HardRockStadium from './HardRockStadium';
import CircuitPark,{createGrassTexture} from "./CircuitPark";
import FormulaCar from "./FormulaCar";
import {Canvas,useFrame,useThree,useLoader} from '@react-three/fiber';
import {Component,Suspense,useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode,type RefObject} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {bankGroundHeight,bankFrame,bankOverviewCamera,circuitOverviewCamera,circuitPreviewCamera,footprintPlacement,localModelPosition,modelPosition,type CircuitModel,type ModelBank,type ModelPosition} from './circuitSeating';
export type ModelCameraControls={zoomIn:()=>void;zoomOut:()=>void;resetZoom:()=>void};
type Mode='circuit'|'stand'|'seat';
type Props={viewInsets?:{top:number;bottom:number};markerLayer?:RefObject<HTMLDivElement|null>;markersReady?:boolean;autoRotate?:boolean;preview?:boolean;visible?:boolean;onZoomLimitsChange:(inward:boolean,outward:boolean)=>void;cameraControls:RefObject<ModelCameraControls|null>;model:CircuitModel;selection:ModelPosition;mode:Mode;playing:boolean;speed:number;pass:number;following:boolean;onManualLook:()=>void;roofs:boolean;reset:number;onSelect:(p:ModelPosition)=>void;onUnavailable:()=>void;onReady:()=>void};
function Instances({items,color,geometry,onClick,surface='coated',colors,metalness=.32,roughness=.46}:{colors?:string[];metalness?:number;roughness?:number;surface?:'concrete'|'coated'|'metal';items:{p:number[];s:number[];r?:number[]}[];color:string;geometry?:T.BufferGeometry;onClick?:(index:number)=>void}){
 const ref=useRef<T.InstancedMesh>(null),{invalidate}=useThree();
 // Switching the active bank replaces its mesh geometry. Restore instance transforms
 // on that replacement before rendering, even when the positions have not changed.
 useLayoutEffect(()=>{const o=new T.Object3D();items.forEach((v,i)=>{o.position.set(v.p[0],v.p[1],v.p[2]);o.scale.set(v.s[0],v.s[1],v.s[2]);o.rotation.set(...((v.r??[0,0,0]) as [number,number,number]));o.updateMatrix();ref.current?.setMatrixAt(i,o.matrix);});if(ref.current){ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();}invalidate();},[items,geometry,invalidate]);
 useLayoutEffect(()=>{if(!ref.current||!colors)return;const tint=new T.Color();colors.forEach((value,i)=>ref.current?.setColorAt(i,tint.set(value)));if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;invalidate();},[colors,geometry,items.length,invalidate]);
 return <instancedMesh ref={ref} args={[geometry,undefined,items.length]} castShadow receiveShadow onClick={e=>{if(onClick&&e.instanceId!==undefined){e.stopPropagation();onClick(e.instanceId);}}}>{!geometry&&<boxGeometry/>}<SurfaceMaterial surface={surface} color={colors?'#ffffff':color} metalness={surface==='concrete'?0:metalness} roughness={surface==='concrete'?.9:roughness} strength={surface==='concrete'?.7:.25}/></instancedMesh>;
}
function Bank({bank,model,selection,onSelect,roofs,detail,preview,portable}:{portable:boolean;preview:boolean;detail:boolean;bank:ModelBank;model:CircuitModel;selection:ModelPosition;onSelect:Props['onSelect'];roofs:boolean}){
 const shells=useMemo(()=>({pan:stadiumSeatPanel(),back:stadiumSeatPanel(true)}),[]);
 useEffect(()=>()=>{shells.pan.dispose();shells.back.dispose();},[shells]);
 const active=selection.bank===bank.id,frame=useMemo(()=>bankFrame(model,bank),[model,bank]);
 const closeDetail=active&&detail&&bank.kind!=='lawn';
 const positions=useMemo(()=>closeDetail?detailedSeatPositions(bank,selection,preview,portable):[],[bank,closeDetail,selection,preview,portable]);
 const chairs=useMemo(()=>positions.map(p=>{const v=localModelPosition(bank,p);return {p:[v[0],v[1]+.28,v[2]],s:[.48,.075,.48]};}),[positions,bank]);
 const backs=useMemo(()=>positions.map(p=>{const v=localModelPosition(bank,p);return {p:[v[0],v[1]+.55,v[2]-.24],s:[.48,.52,.055],r:[-.12,0,0]};}),[positions,bank]);
 const tiers=useMemo(()=>Array.from({length:bank.rows},(_,i)=>({p:[0,(.55+i*.43)/2,(bank.rows/2-i-1)*.88],s:[bank.width+2,.55+i*.43,.9]})),[bank]);
 const supports=useMemo(()=>Array.from({length:Math.ceil(bank.width/14)+1},(_,i)=>({p:[-bank.width/2+i*bank.width/Math.ceil(bank.width/14),bank.rows*.43/2,-bank.rows*.44],s:[.22,bank.rows*.43,.22]})),[bank]);
 const chairColor=model.id==='qatar'?'#783b4d':model.id==='miami'?'#356d73':'#3d647c',backColor=model.id==='qatar'?'#8a4056':model.id==='miami'?'#447f86':'#4c7895';
 const chairColors=useMemo(()=>closeDetail?positions.map(p=>modelSeatAccent(p,selection,chairColor)):undefined,[closeDetail,positions,selection,chairColor]);
 const backColors=useMemo(()=>closeDetail?positions.map(p=>modelSeatAccent(p,selection,backColor)):undefined,[closeDetail,positions,selection,backColor]);
 const aisleDetail=useMemo(()=>{if(!closeDetail)return [];const out:{p:number[];s:number[];r?:number[]}[]=[],pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3);for(let section=1;section<bank.sections;section++){const x=-bank.width/2+section*(bank.seats+3)*pitch-1.5*pitch;for(let row=0;row<bank.rows;row++)out.push({p:[x,.58+row*.43,(bank.rows/2-row-1)*.88+.38],s:[1.3,.025,.055]});for(const side of [-1,1])out.push({p:[x+side*.7,1.58+bank.rows*.215,0],s:[.045,.045,bank.rows*.98],r:[Math.atan2(.43,.88),0,0]});}return out;},[bank,closeDetail]);
 const hardware=useMemo(()=>closeDetail?positions.flatMap(p=>{const v=localModelPosition(bank,p);return [{p:[v[0],v[1]+.12,v[2]],s:[.065,.24,.065]},{p:[v[0],v[1]+.04,v[2]],s:[.34,.06,.28]}];}):[],[positions,bank,closeDetail]);
 const rearRail=useMemo(()=>{if(!closeDetail)return [];const z=-bank.rows*.44-.7,y=bank.rows*.43,count=Math.ceil(bank.width/2.5);return [...Array.from({length:count+1},(_,i)=>({p:[-bank.width/2+i*bank.width/count,y+.55,z],s:[.045,1.1,.045]})),...[.55,1.1].map(height=>({p:[0,y+height,z],s:[bank.width,.045,.045]}))];},[bank,closeDetail]);
 const seatBands=useMemo(()=>distantSeatBands(bank,closeDetail&&(preview||portable)?positions:[]),[bank,closeDetail,preview,portable,positions]);
 const roofRibs=useMemo(()=>{const count=Math.ceil(bank.width/8);return Array.from({length:count+1},(_,i)=>({p:[-bank.width/2+i*bank.width/count,bank.rows*.43+4.5,-1],s:[.15,.5,bank.rows*.88+7],r:[-.04,0,0]}));},[bank]);
 const pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3),picked=localModelPosition(bank,selection);
 return <group position={[bank.center[0],bankGroundHeight(model,bank),bank.center[1]]} rotation={[0,frame.yaw,0]}>
  {bank.kind==='lawn'?<mesh position={[0,1.7,0]} scale={[bank.width/2,3.2,22]}><sphereGeometry args={[1,32,12]}/><meshStandardMaterial color="#777348" roughness={1}/></mesh>:<>
   <Instances items={tiers} color="#646a73" surface="concrete"/>
   <Instances items={supports} color="#b5bbc4"/>
   {closeDetail&&<><Instances items={hardware} surface="metal" color="#adb6c1" metalness={.7} roughness={.35}/><Instances items={rearRail} surface="metal" color="#c6ced8" metalness={.7} roughness={.3}/><Instances items={aisleDetail} surface="metal" color="#cad2dc" metalness={.55} roughness={.4}/></>}
   {(!closeDetail||preview||portable)&&<Instances items={seatBands} color={backColor} metalness={.025} roughness={.65} onClick={()=>onSelect({bank:bank.id,section:Math.ceil(bank.sections/2),row:Math.ceil(bank.rows/2),seat:Math.ceil(bank.seats/2)})}/>}
   {closeDetail&&<><Instances geometry={shells.pan} items={chairs} color={chairColor} colors={chairColors} metalness={.025} roughness={.36} onClick={i=>onSelect(positions[i])}/><Instances geometry={shells.back} items={backs} color={backColor} colors={backColors} metalness={.025} roughness={.36} onClick={i=>onSelect(positions[i])}/></>}

   {Array.from({length:bank.sections-1},(_,i)=><group key={i} position={[-bank.width/2+(i+1)*(bank.seats+3)*pitch-1.5*pitch,0,0]}>
    <mesh position={[0,.58+bank.rows*.215,0]} rotation={[Math.atan2(.43,.88),0,0]}><boxGeometry args={[1.5,.15,bank.rows*.98]}/><meshStandardMaterial color="#b1b6c0"/></mesh>
   </group>)}
   {!closeDetail&&<mesh position={[0,bank.rows*.43+.45,-bank.rows*.44-.7]}><boxGeometry args={[bank.width+3,1.1,.12]}/><meshStandardMaterial color="#9fa6b3" wireframe/></mesh>}
   {bank.roof&&roofs&&!(model.id==='china'&&bank.id==='a')&&<>
    <mesh position={[0,bank.rows*.43+5,-1]} rotation={[-.04,0,0]} castShadow><boxGeometry args={[bank.width+9,.4,bank.rows*.88+8]}/><meshStandardMaterial color="#d8dadd" metalness={.45} roughness={.4}/></mesh>
    {closeDetail&&<Instances items={roofRibs} surface="metal" color="#9ca9b5" metalness={.6} roughness={.4}/>}
    {[-1,1].map(s=><mesh key={s} position={[s*(bank.width/2+2),(bank.rows*.43+5)/2,-bank.rows*.44]}><cylinderGeometry args={[.25,.35,bank.rows*.43+5,8]}/><meshStandardMaterial color="#b9c0ca" metalness={.6} roughness={.3}/></mesh>)}
   </>}
  </>}
  {active&&<group position={picked}>
   <mesh position={[0,.34,0]}><boxGeometry args={[bank.kind==='lawn'?1.2:.53,.18,bank.kind==='lawn'?1.2:.54]}/><meshBasicMaterial color="#ffcb69"/></mesh>
   <mesh position={[0,1.7,0]}><cylinderGeometry args={[.06,.06,2.3,8]}/><meshBasicMaterial color="#ffcc72" transparent opacity={.8}/></mesh>
  </group>}
 </group>;
}
function ribbon(track:number[][],width:number,height:number,heights?:number[],sample?:(x:number,z:number)=>number){
 const vertices:number[]=[],uv:number[]=[],indices:number[]=[],columns=sample?11:2;let distance=0;
 track.forEach((p,i)=>{const a=track[Math.max(0,i-1)],b=track[Math.min(track.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;if(i)distance+=Math.hypot(p[0]-track[i-1][0],p[1]-track[i-1][1]);
  for(let col=0;col<columns;col++){const side=-1+2*col/(columns-1),x=p[0]-dz/l*width/2*side,z=p[1]+dx/l*width/2*side;vertices.push(x,height+(sample?sample(x,z):heights?.[i]??0),z);uv.push(col/(columns-1),distance/10);}
  if(i<track.length-1)for(let col=0;col<columns-1;col++){const j=i*columns+col;indices.push(j,j+1,j+columns,j+1,j+columns+1,j+columns);}
 });const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function Track({model}:{model:CircuitModel}){
 const maps=useLoader(T.TextureLoader,['/materials/asphalt-color.jpg','/materials/asphalt-normal.jpg','/materials/asphalt-roughness.jpg']);
 const textures=useMemo(()=>maps.map((source,i)=>{const t=source.clone();t.anisotropy=8;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,1);if(!i)t.colorSpace=T.SRGBColorSpace;return t;}),[maps]);
 useEffect(()=>()=>textures.forEach(t=>t.dispose()),[textures]);
 const terrainGrass=useMemo(()=>model.terrain?createGrassTexture(2,1):null,[model]);
 useEffect(()=>()=>terrainGrass?.dispose(),[terrainGrass]);
 const road=useMemo(()=>ribbon(model.track,14,.07,model.trackHeights),[model]),runoff=useMemo(()=>ribbon(model.track,model.terrain?52:30,model.terrain?-1:.025,model.trackHeights,model.terrain?(x,z)=>roadSample(model,x,z).height:undefined),[model]);
 const curve=useMemo(()=>new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),[model]);
 const curbs=useMemo(()=>{const out:{p:number[];s:number[];r:number[]}[][]=[[],[]];const samples=curve.getSpacedPoints(Math.round(model.length/4));samples.forEach((p,i)=>{const tangent=curve.getTangentAt(i/(samples.length-1)),yaw=Math.atan2(tangent.x,tangent.z);for(const side of [-1,1])out[i%2].push({p:[p.x-tangent.z*7.7*side,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.13,p.z+tangent.x*7.7*side],s:[1.1,.18,4.1],r:[0,yaw,0]});});return out;},[curve,model]);
 useEffect(()=>()=>{road.dispose();runoff.dispose();textures.forEach(t=>t.dispose());},[road,runoff,textures]);
 return <><mesh geometry={runoff} receiveShadow><meshStandardMaterial map={terrainGrass} color={terrainGrass?'#ffffff':model.appearance==='day'?'#6d8976':model.id==='qatar'?'#355b69':model.id==='united-arab-emirates'?'#347c8c':'#967456'} roughness={.95}/></mesh><mesh geometry={road} receiveShadow><SurfaceMaterial surface="asphalt" grainScale={.7} strength={.4} map={textures[0]} normalMap={textures[1]} roughnessMap={textures[2]} normalScale={new T.Vector2(.35,.35)} color="#acb1ba" roughness={.78}/></mesh><Instances items={curbs[0]} color="#dc2529"/><Instances items={curbs[1]} color="#e9e8e5"/></>;
}
function Context({model,selection,roofs}:{model:CircuitModel;selection:ModelPosition;roofs:boolean}){
 const bank=model.banks.find(b=>b.id===selection.bank)!,frame=bankFrame(model,bank);
 const poles=useMemo(()=>{const c=new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true);return c.getSpacedPoints(Math.round(model.length/75)).map((p,i,a)=>{const d=c.getTangentAt(i/(a.length-1));return [p.x-d.z*20,p.z+d.x*20];});},[model]);
 const tower=model.features.find(f=>f.name==='Sakhir Tower'),towerCenter=tower?footprintPlacement(tower.points).center:undefined;
 const nearPoles=useMemo(()=>[...poles].sort((a,b)=>Math.hypot(a[0]-bank.center[0],a[1]-bank.center[1])-Math.hypot(b[0]-bank.center[0],b[1]-bank.center[1])).slice(0,3),[poles,bank]);
 const main=model.banks.find(b=>b.id===model.pitBank)??model.banks[0],mf=bankFrame(model,main),pit=[mf.target[0]+mf.forward[0]*28,mf.target[1]+mf.forward[1]*28];
 return <>
  {model.appearance!=='day'&&<mesh position={[0,-1,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20000,20000]}/><SurfaceMaterial surface="concrete" color={model.id==='qatar'?'#15171d':model.id==='united-arab-emirates'?'#142126':'#191b23'} roughness={.98} grainScale={.45} strength={.45}/></mesh>}
  {model.appearance!=='day'&&poles.map((p,i)=><group key={i} position={[p[0],0,p[1]]}><mesh position={[0,12,0]}><cylinderGeometry args={[.17,.33,24,6]}/><meshStandardMaterial color="#7c8796" metalness={.6}/></mesh><mesh position={[0,24,0]} rotation={[-.2,0,0]}><boxGeometry args={[4,.45,1.1]}/><meshBasicMaterial color={new T.Color(2.2,2.4,3)} toneMapped={false}/></mesh></group>)}
  {model.appearance!=='day'&&<pointLight position={[bank.center[0]+frame.forward[0]*20,30,bank.center[1]+frame.forward[1]*20]} intensity={12500} distance={220} decay={2} color="#d5e5ff"/>}
  {model.appearance!=='day'&&nearPoles.map((p,i)=><LightShaft key={i} origin={[p[0],24,p[1]]} target={[p[0]+frame.forward[0]*18,.2,p[1]+frame.forward[1]*18]} strength={.55}/>)}
  {model.id==='great-britain'?<SilverstoneWing model={model}/>:hasVenueContext(model.id)?<VenueContext model={model}/>:<group position={[pit[0],groundHeight(model,pit[0],pit[1]),pit[1]]} rotation={[0,mf.yaw,0]}>
   <mesh position={[0,5,0]} castShadow><boxGeometry args={[285,10,16]}/><meshStandardMaterial color="#737d8a" metalness={.35} roughness={.6}/></mesh>
   <mesh position={[0,11,0]} castShadow><boxGeometry args={[295,.6,24]}/><meshStandardMaterial color="#c6cbd4"/></mesh>
   {Array.from({length:22},(_,i)=><group key={i} position={[-132+i*12.5,0,-8.1]}><mesh position={[0,2.5,0]}><boxGeometry args={[10,5,.15]}/><meshStandardMaterial color="#222a38"/></mesh><mesh position={[0,7.8,-.05]}><boxGeometry args={[10,2,.2]}/><meshPhysicalMaterial color="#37546b" metalness={.7} roughness={.15} clearcoat={1}/></mesh><mesh position={[0,5.4,-.1]}><boxGeometry args={[10,.4,.2]}/><meshBasicMaterial color={i%3===0?'#d02d36':'#bfc7d6'}/></mesh></group>)}
  </group>}
  {model.id==='china'&&roofs&&<ShanghaiCanopy model={model}/>}
  {model.id==='miami'&&<HardRockStadium model={model}/>}
  {model.id==='bahrain'&&towerCenter&&<group position={[towerCenter[0],0,towerCenter[1]]}>
   {Array.from({length:8},(_,i)=><group key={i} position={[0,5+i*3.2,0]}><mesh castShadow><cylinderGeometry args={[14+i*.8,14+i*.8,2.6,48]}/><meshStandardMaterial color="#243346" metalness={.7} roughness={.22}/></mesh><mesh position={[0,1.5,0]} castShadow><cylinderGeometry args={[16+i*.8,16+i*.8,.4,48]}/><meshStandardMaterial color="#d9d8d3" roughness={.45}/></mesh></group>)}
  </group>}
  <mesh position={[bank.center[0]+frame.forward[0]*10,bankGroundHeight(model,bank)+.5,bank.center[1]+frame.forward[1]*10]} rotation={[0,frame.yaw,0]}><boxGeometry args={[bank.width+12,1,.5]}/><meshStandardMaterial color="#c3cad2"/></mesh>
 </>;
}
function DemoCars({model,playing,selection,speed,pass,lead}:{model:CircuitModel;playing:boolean;selection:ModelPosition;speed:number;pass:number;lead:RefObject<T.Vector3>}){
 const refs=useRef<(T.Group|null)[]>([]),wheels=useRef<(T.Group|null)[]>([]),field=useRef(createTrafficField());const {invalidate,gl}=useThree();
 useEffect(()=>{gl.domElement.dataset.carCount=String(fieldColors.length);gl.domElement.dataset.carsPlaying=String(playing);gl.domElement.dataset.carDetail='formula';gl.domElement.dataset.replaySpeed=String(speed);invalidate();},[playing,speed,gl,invalidate]);
 const curve=useMemo(()=>new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),[model]);
 useEffect(()=>{const selected=modelPosition(model,selection),samples=curve.getSpacedPoints(1500);let best=Infinity,index=0;samples.forEach((p,i)=>{const d=Math.hypot(p.x-selected[0],p.z-selected[2]);if(d<best){best=d;index=i;}});field.current=createTrafficField((index/(samples.length-1)-1/105+1)%1);invalidate();},[model,selection.bank,selection.section,selection.row,selection.seat,pass,curve,invalidate]);
 useFrame((_,delta)=>{if(playing)advanceTraffic(field.current,delta,105/speed,8/model.length,u=>{const t=curve.getTangentAt(u),next=curve.getTangentAt((u+.003)%1);return .57+.43*Math.max(0,t.dot(next))**16;});refs.current.forEach((r,i)=>{if(!r)return;const u=field.current.positions[i],p=curve.getPointAt(u),t=curve.getTangentAt(u);r.position.set(p.x,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.43,p.z);if(i===0)lead.current.copy(r.position);r.rotation.set(-Math.atan2(t.y,Math.hypot(t.x,t.z)),Math.atan2(t.x,t.z),0,'YXZ');if(playing)wheels.current[i]?.children.forEach(w=>w.rotation.x-=field.current.travel[i]*model.length/.36);});if(playing)invalidate();});
 return <>{fieldColors.map((c,i)=><group key={i} ref={r=>{refs.current[i]=r;}}><FormulaCar color={c} compact={i>=4} wheels={r=>{wheels.current[i]=r;}}/></group>)}</>;
}
function Rig({viewInsets,model,selection,mode,preview,autoRotate,playing,visible,reset,cameraControls,onZoomLimitsChange,following,onManualLook,lead}:Props&{lead:RefObject<T.Vector3>}){
 const topInset=mode==='seat'?0:viewInsets?.top,bottomInset=mode==='seat'?0:viewInsets?.bottom;
 const orbit=useRef({time:0,eye:new T.Vector3(),target:new T.Vector3()});
 const {camera,gl,invalidate,size,scene}=useThree(),control=useRef<OrbitControls|null>(null),tr=useRef<{p:T.Vector3;t:T.Vector3;started:number;duration:number;fromFov:number;toFov:number;from:T.Vector3;fromT:T.Vector3}|null>(null),target=useRef(new T.Vector3()),lookGoal=useRef<T.Vector3|null>(null);
 useDoubleTapFocus(!preview&&mode!=='seat',12,(eye,look)=>{
  lookGoal.current=null;const lens=camera as T.PerspectiveCamera;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(eye);target.current.copy(look);control.current?.target.copy(look);camera.lookAt(look);tr.current=null;}
  else tr.current={p:eye,t:look,from:camera.position.clone(),fromT:control.current?.target.clone()??target.current.clone(),started:performance.now(),duration:650,fromFov:lens.fov,toFov:lens.fov};
  invalidate();
 });
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enablePan=false;c.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;c.dampingFactor=.09;c.minDistance=12;c.maxDistance=3000;c.maxPolarAngle=Math.PI*.495;control.current=c;const change=()=>invalidate(),start=()=>{tr.current=null;gl.domElement.dataset.modelReady='true';};c.addEventListener('change',change);c.addEventListener('start',start);return()=>{c.dispose();control.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{lookGoal.current=null;const bank=model.banks.find(b=>b.id===selection.bank)!,p=modelPosition(model,selection),f=bankFrame(model,bank);let position:T.Vector3,look:T.Vector3;
  if(mode==='seat'){position=new T.Vector3(p[0],p[1]+1.15,p[2]);look=new T.Vector3(p[0]+f.forward[0]*90,1.6+roadSample(model,p[0]+f.forward[0]*90,p[2]+f.forward[1]*90).height,p[2]+f.forward[1]*90);if(preview){const direction=look.clone().sub(position);look.set(...seatedLookTarget(position,Math.atan2(direction.x,direction.z)+.18,Math.min(Math.atan2(direction.y,90),-.13)));}else if(size.width<size.height){look.set(...seatedLookTarget(position,f.yaw,Math.min(Math.atan2(look.y-position.y,90),-.16)));}}
  else if(mode==='stand'){const top=topInset??Math.min(size.height*.5,size.width<760?250:220),bottom=bottomInset??110,fraction=Math.max(.2,1-(top+bottom)/size.height)*.95,view=bankOverviewCamera(model,bank,size.width/size.height,fraction);position=new T.Vector3(...view.eye);look=new T.Vector3(...view.target);}
  else {const top=preview?0:(topInset??Math.min(size.height*.35,size.width<760?250:220)),bottom=preview?0:(bottomInset??110),fraction=preview?.84:Math.max(.2,1-(top+bottom)/size.height)*.95,overview=preview?circuitPreviewCamera(model,size.width/size.height):circuitOverviewCamera(model,size.width/size.height,fraction);position=new T.Vector3(...overview.eye);look=new T.Vector3(...overview.target);}
  if(scene.fog instanceof T.Fog){const d=position.distanceTo(look);scene.fog.near=mode==='circuit'?d+1000:1000;scene.fog.far=mode==='circuit'?d+3000:4500;}
  (camera as T.PerspectiveCamera).near=mode==='circuit'?10:mode==='stand'?.5:.15;
  (camera as T.PerspectiveCamera).far=mode==='circuit'?Math.max(6500,position.distanceTo(look)+4000):6500;
  const c=control.current;if(c){c.enabled=true;c.minDistance=mode==='seat'?.1:12;c.maxDistance=mode==='circuit'?Math.max(3000,position.distanceTo(look)*1.4):3000;c.enableZoom=mode!=='seat';}
  (camera as T.PerspectiveCamera).clearViewOffset();
  if(mode!=='seat'&&!preview){const top=topInset??Math.min(size.height*(mode==='stand'?.5:.35),size.width<760?250:220),bottom=bottomInset??110;(camera as T.PerspectiveCamera).setViewOffset(size.width,size.height,0,(bottom-top)/2,size.width,size.height);}
  const lens=camera as T.PerspectiveCamera,fromFov=lens.fov,toFov=mode==='seat'?(size.width<size.height?(preview?78:90):70):45;lens.fov=toFov;lens.updateProjectionMatrix();gl.domElement.dataset.seatFov=String(lens.fov);onZoomLimitsChange((camera as T.PerspectiveCamera).fov>35,(camera as T.PerspectiveCamera).fov<105);
  orbit.current={time:0,eye:position.clone(),target:look.clone()};
  if(preview||window.matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(position);target.current.copy(look);camera.lookAt(look);c?.target.copy(look);tr.current=null;gl.domElement.dataset.modelReady='true';}
  else{lens.fov=fromFov;lens.updateProjectionMatrix();tr.current={p:position,t:look,from:camera.position.clone(),fromT:target.current.clone(),started:performance.now(),duration:flightDuration(camera.position.distanceTo(position)),fromFov,toFov};gl.domElement.dataset.modelReady='moving';}
  invalidate();
 },[topInset,bottomInset,model,selection.bank,selection.section,selection.row,selection.seat,mode,preview,reset,size.width,size.height,camera,gl,invalidate,scene,onZoomLimitsChange]);
 // An OS preference change must also finish a transition already in progress.
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce=()=>{if(control.current)control.current.enableDamping=!preference.matches;if(preference.matches&&lookGoal.current){target.current.copy(lookGoal.current);camera.lookAt(target.current);lookGoal.current=null;invalidate();}const t=tr.current;if(!preference.matches||!t)return;(camera as T.PerspectiveCamera).fov=t.toFov;(camera as T.PerspectiveCamera).updateProjectionMatrix();gl.domElement.dataset.seatFov=String(t.toFov);camera.position.copy(t.p);target.current.copy(t.t);camera.lookAt(target.current);control.current?.target.copy(target.current);tr.current=null;gl.domElement.dataset.modelReady='true';invalidate();};
  preference.addEventListener('change',reduce);return()=>preference.removeEventListener('change',reduce);
 },[camera,gl,invalidate]);
 // Zoom updates the lens only, preserving the selected eye position and look direction.
 useEffect(()=>{
  if(mode!=='seat'){cameraControls.current=null;return;}
  const lens=camera as T.PerspectiveCamera,apply=(degrees:number)=>{lens.fov=T.MathUtils.clamp(degrees,35,105);lens.updateProjectionMatrix();gl.domElement.dataset.seatFov=String(lens.fov);onZoomLimitsChange(lens.fov>35,lens.fov<105);invalidate();};
  cameraControls.current={zoomIn:()=>apply(lens.fov-10),zoomOut:()=>apply(lens.fov+10),resetZoom:()=>apply(size.width<size.height?(preview?78:90):70)};
  return()=>{cameraControls.current=null;};
 },[mode,camera,gl,invalidate,size.width,size.height,cameraControls,onZoomLimitsChange]);
 // In seated mode orbit around the eye position, never move the camera through the stands.
 useEffect(()=>{if(mode!=='seat'||preview)return;const c=control.current;if(c)c.enabled=false;
  return attachSeatedPointerControls(gl.domElement,camera as T.PerspectiveCamera,{
   onStart:()=>{onManualLook();const flight=tr.current;if(flight){settleCamera(camera as T.PerspectiveCamera,target.current,flight.p,flight.t,flight.toFov);control.current?.target.copy(flight.t);gl.domElement.dataset.seatFov=String(flight.toFov);onZoomLimitsChange(flight.toFov>35,flight.toFov<105);invalidate();}tr.current=null;lookGoal.current=null;gl.domElement.dataset.modelReady='true';},
   onLook:(yaw,pitch)=>{const desired=new T.Vector3(...seatedLookTarget(camera.position,yaw,pitch));if(matchMedia('(prefers-reduced-motion: reduce)').matches){target.current.copy(desired);camera.lookAt(target.current);}else lookGoal.current=desired;},
   onZoom:fov=>{gl.domElement.dataset.seatFov=String(fov);onZoomLimitsChange(fov>35,fov<105);},invalidate,
  });
 },[mode,preview,selection.bank,selection.section,selection.row,selection.seat,reset,model,camera,gl,invalidate,onZoomLimitsChange,onManualLook]);

 useFrame((_,delta)=>{const t=tr.current;if(!t){if(preview&&autoRotate&&playing&&visible){const o=orbit.current;o.time+=Math.min(delta,.05);camera.position.copy(o.eye).sub(o.target).applyAxisAngle(T.Object3D.DEFAULT_UP,Math.sin(o.time*.22)*.12).add(o.target);gl.domElement.dataset.previewOrbit=String(o.time);invalidate();}if(mode!=='seat')control.current?.update();const goal=lookGoal.current;if(goal&&mode==='seat'){target.current.lerp(goal,1-Math.exp(-Math.min(delta,.05)*18));if(target.current.distanceTo(goal)<.01){target.current.copy(goal);lookGoal.current=null;}camera.lookAt(target.current);invalidate();}else if(following&&mode==='seat'){target.current.lerp(lead.current,1-Math.exp(-delta*5));camera.lookAt(target.current);invalidate();}return;}const f=flightProgress(t.started,performance.now(),t.duration),e=sampleFlight(t.from,t.p,t.fromT,t.t,f,camera.position,target.current),lens=camera as T.PerspectiveCamera;lens.fov=T.MathUtils.lerp(t.fromFov,t.toFov,e);lens.updateProjectionMatrix();gl.domElement.dataset.seatFov=String(lens.fov);camera.lookAt(target.current);control.current?.target.copy(target.current);if(f===1){tr.current=null;gl.domElement.dataset.modelReady='true';}invalidate();});
 return null;
}
function Lighting({model,selection,mode,shadowSize}:{model:CircuitModel;selection:ModelPosition;mode:Mode;shadowSize:number}){
 const light=useRef<T.DirectionalLight>(null),{invalidate}=useThree();
 const p=modelPosition(model,selection),bank=model.banks.find(b=>b.id===selection.bank)!;
 const target=useMemo(()=>new T.Object3D(),[]);
 const span=mode==='circuit'?250:Math.max(45,Math.min(150,bank.width*.65));
 useEffect(()=>{light.current?.shadow.camera.updateProjectionMatrix();invalidate();},[span,invalidate]);
 target.position.set(p[0],p[1],p[2]);target.updateMatrixWorld();
 return <><StudioReflections intensity={model.appearance==='day'?.65:.5}/><primitive object={target}/>
  <ambientLight intensity={model.appearance==='day'?.25:.12}/>
  <directionalLight target={target} position={[p[0]+40,p[1]+12,p[2]-30]} intensity={model.appearance==='day'?.3:.45} color={model.appearance==='day'?'#e2ecff':'#ffdfbe'}/>
  <hemisphereLight args={model.appearance==='day'?['#deedff','#687c4c',.85]:['#c9d9f5','#554439',.45]}/>
  <directionalLight ref={light} target={target} position={[p[0]-60,p[1]+130,p[2]+50]} intensity={model.appearance==='day'?3:2.5} color={model.appearance==='day'?'#fff4de':'#deeaff'} castShadow shadow-mapSize={[shadowSize,shadowSize]} shadow-camera-left={-span} shadow-camera-right={span} shadow-camera-top={span} shadow-camera-bottom={-span} shadow-camera-far={350} shadow-bias={-.00012} shadow-normalBias={.025}/>
 </>;
}
function TrackFence({model}:{model:CircuitModel}){
 const geometry=useMemo(()=>{const c=new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),samples=c.getSpacedPoints(Math.round(model.length/8)),vertices:number[]=[];for(const side of [-1,1]){let previous:T.Vector3|undefined;samples.forEach((p,i)=>{const t=c.getTangentAt(i/(samples.length-1)),q=new T.Vector3(p.x-t.z*12*side,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.4,p.z+t.x*12*side);vertices.push(q.x,q.y,q.z,q.x,q.y+3,q.z);if(previous)for(const y of [.8,1.7,2.6,3.4])vertices.push(previous.x,previous.y+y-.4,previous.z,q.x,q.y+y-.4,q.z);previous=q;});}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));return g;},[model]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);return <lineSegments geometry={geometry}><lineBasicMaterial color="#7e8b9e" transparent opacity={.65}/></lineSegments>;
}
function Finish({bloom}:{bloom:boolean}){const {gl,scene,camera,size}=useThree();const composer=useMemo(()=>{const c=new EffectComposer(gl);c.addPass(new RenderPass(scene,camera));if(bloom)c.addPass(new UnrealBloomPass(new T.Vector2(size.width,size.height),.18,.35,1.3));c.addPass(new OutputPass());return c;},[gl,scene,camera,bloom]);useEffect(()=>{composer.setSize(size.width,size.height);},[composer,size]);useEffect(()=>()=>{composer.passes.forEach(pass=>pass.dispose());composer.dispose();},[composer]);useFrame((_,delta)=>composer.render(delta),1);return null;}
function Watch({onUnavailable,onReady}:{onUnavailable:Props['onUnavailable'];onReady:()=>void}){const {gl}=useThree();const done=useRef(false);useFrame(()=>{if(!done.current){done.current=true;gl.domElement.dataset.geometryReady='true';onReady();}});useEffect(()=>{const loss=(e:Event)=>{e.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',loss);return()=>gl.domElement.removeEventListener('webglcontextlost',loss);},[gl,onUnavailable]);return null;}
class Boundary extends Component<{children:ReactNode;onUnavailable:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onUnavailable();}render(){return this.state.failed?null:this.props.children;}}
export default function CircuitSeatingScene(props:Props){const lead=useRef(new T.Vector3()),quality=useSceneQuality();return <Boundary onUnavailable={props.onUnavailable}><Canvas frameloop={props.visible===false?'never':'demand'} shadows dpr={quality.dpr} camera={{position:[900,1500,1350],near:.15,far:6500,fov:45}} gl={{antialias:true,powerPreference:'high-performance'}}><ShaderGuard onUnavailable={props.onUnavailable}/><color attach="background" args={[props.model.appearance==='day'?'#bfd7e7':'#111b2c']}/><fog attach="fog" args={[props.model.appearance==='day'?'#d4e2df':'#121b2a',1000,4500]}/><Suspense fallback={null}><WorldSky day={props.model.appearance==='day'}/><Lighting {...props} shadowSize={quality.shadowSize}/><Context {...props}/>{props.model.appearance==='day'&&<CircuitPark model={props.model} motion={props.playing&&props.visible!==false}/>}<Track model={props.model}/><TrackFence model={props.model}/>{props.model.banks.map(bank=><Bank key={bank.id} bank={bank} model={props.model} selection={props.selection} onSelect={props.onSelect} roofs={props.roofs} portable={quality.portable} preview={Boolean(props.preview)} detail={props.mode!=='circuit'}/>)}<DemoCars model={props.model} playing={props.playing} selection={props.selection} speed={props.speed} pass={props.pass} lead={lead}/><Watch onUnavailable={props.onUnavailable} onReady={props.onReady}/></Suspense><Rig {...props} lead={lead}/>{props.markerLayer&&<BankSceneMarkers model={props.model} selection={props.selection} mode={props.mode} ready={Boolean(props.markersReady)} layer={props.markerLayer}/>}<Finish bloom={!quality.portable&&!props.preview}/></Canvas></Boundary>;}
