import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {Vector3} from 'three';
import {modelPosition,type CircuitModel,type ModelPosition} from './circuitSeating';
import {clusterBankMarkers,type BankMarkerPoint} from './bankMarkerClusters';

export default function BankSceneMarkers({model,selection,mode,ready,layer}:{model:CircuitModel;selection:ModelPosition;mode:string;ready:boolean;layer:RefObject<HTMLDivElement|null>}){
 const {camera,size,invalidate}=useThree(),scratch=useRef(new Vector3());
 const anchors=useMemo(()=>model.banks.map(bank=>new Vector3(...modelPosition(model,{bank:bank.id,section:Math.ceil(bank.sections/2),row:Math.ceil(bank.rows/2),seat:Math.ceil(bank.seats/2)}))),[model]);
 useEffect(()=>{invalidate();},[model,selection.bank,mode,ready,size.width,size.height,invalidate]);
 useFrame(()=>{
  const element=layer.current;if(!element||mode!=='circuit'||!ready)return;
  const buttons=Array.from(element.querySelectorAll<HTMLButtonElement>('[data-bank-marker]'));
  const stage=element.parentElement!,stageTop=stage.getBoundingClientRect().top;
  const headerBottom=stage.querySelector('.circuit-camera-modes')?.getBoundingClientRect().bottom??stageTop+200;
  const top=headerBottom-stageTop+28,points:BankMarkerPoint[]=[];
  const stageLeft=stage.getBoundingClientRect().left;
  const controls=Array.from(stage.querySelectorAll('.circuit-model-heading,.circuit-camera-modes,.circuit-photo-trigger,.circuit-seat-zoom,.circuit-scene-actions,.circuit-scene-note')).map(node=>node.getBoundingClientRect()).filter(rect=>rect.width&&rect.height);
  const covered=(x:number,y:number)=>controls.some(rect=>x+26>rect.left-stageLeft&&x-26<rect.right-stageLeft&&y+26>rect.top-stageTop&&y-26<rect.bottom-stageTop);
  camera.updateMatrixWorld();
  anchors.forEach((anchor,index)=>{
   const point=scratch.current.copy(anchor).project(camera),x=(point.x+1)*size.width/2,y=(1-point.y)*size.height/2;
   if(point.z>=-1&&point.z<=1&&x>=24&&x<=size.width-24&&y>=top&&y<=size.height-140&&!covered(x,y))points.push({index,x,y});
  });
  const groups=clusterBankMarkers(points).filter(group=>!covered(group.x,group.y));
  const visible=new Set(groups.map(group=>group.members[0]));
  buttons.forEach((button,index)=>{const hidden=!visible.has(index);if(button.hidden!==hidden)button.hidden=hidden;});
  for(const group of groups){
   const index=group.members[0],button=buttons[index];if(!button)continue;
   const clustered=group.members.length>1,label=clustered?`${group.members.length} modeled banks`:model.banks[index].name;
   const transform=`translate(${group.x}px,${group.y}px) translate(-50%,-50%)`;
   if(button.style.transform!==transform)button.style.transform=transform;
   button.dataset.members=group.members.join(',');button.dataset.cluster=String(clustered);button.dataset.selected=String(group.members.some(i=>model.banks[i].id===selection.bank));
   button.setAttribute('aria-label',clustered?`Choose from ${label}`:`Explore modeled bank ${label}`);button.title=label;
   const count=button.querySelector('[data-marker-count]'),caption=button.querySelector('[data-marker-label]');
   const countText=clustered?String(group.members.length):`#${index+1}`;
   if(count&&count.textContent!==countText)count.textContent=countText;if(caption&&caption.textContent!==label)caption.textContent=label;
  }
  element.dataset.visibleMarkers=String(groups.length);
 });
 return null;
}
