import {useEffect,useState} from 'react';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import {HDRLoader} from 'three/examples/jsm/loaders/HDRLoader.js';
import {WorldSky} from './WorldShaders';

const maps=new Map<string,Promise<T.DataTexture>>();
function hdr(url:string){if(!maps.has(url))maps.set(url,new HDRLoader().loadAsync(url).catch(error=>{maps.delete(url);throw error;}));return maps.get(url)!;}

/** Licensed lighting references, not venue photography or a live weather feed. */
export default function VenueEnvironment({day=false}:{day?:boolean}){
 const {gl,scene,invalidate}=useThree(),[skyReady,setSkyReady]=useState(false);
 useEffect(()=>{
  let cancelled=false;setSkyReady(false);
  const previous={environment:scene.environment,intensity:scene.environmentIntensity,background:scene.background,blur:scene.backgroundBlurriness,bgIntensity:scene.backgroundIntensity};
  const generator=new T.PMREMGenerator(gl),fallback=new T.Scene();
  const sphere=new T.Mesh(new T.SphereGeometry(10,24,16),new T.MeshBasicMaterial({color:day?'#70899c':'#0e1723',side:T.BackSide}));fallback.add(sphere);
  const lamp=new T.Mesh(new T.PlaneGeometry(4,2),new T.MeshBasicMaterial({color:new T.Color(day?3:6,day?3:6.2,day?3:6.6),toneMapped:false}));lamp.position.set(-4,6,2);lamp.lookAt(0,0,0);fallback.add(lamp);
  let target=generator.fromScene(fallback,.06);scene.environment=target.texture;scene.environmentIntensity=day?.55:.3;
  gl.domElement.dataset.environmentReflections='ready';gl.domElement.dataset.environmentSource='outdoor-fallback';invalidate();
  hdr(day?'/materials/day-sky.hdr':'/materials/night-sky.hdr').then(texture=>{
   if(cancelled)return;texture.mapping=T.EquirectangularReflectionMapping;
   const next=generator.fromEquirectangular(texture);target.dispose();target=next;scene.environment=next.texture;scene.environmentIntensity=day?.65:.3;
   if(day){scene.background=texture;scene.backgroundIntensity=.75;scene.backgroundBlurriness=.035;setSkyReady(true);}
   gl.domElement.dataset.environmentSource='outdoor-hdr';invalidate();
  }).catch(()=>{if(!cancelled){gl.domElement.dataset.environmentSource='outdoor-fallback';invalidate();}});
  return()=>{cancelled=true;scene.environment=previous.environment;scene.environmentIntensity=previous.intensity;scene.background=previous.background;scene.backgroundBlurriness=previous.blur;scene.backgroundIntensity=previous.bgIntensity;target.dispose();generator.dispose();sphere.geometry.dispose();sphere.material.dispose();lamp.geometry.dispose();lamp.material.dispose();};
 },[gl,scene,invalidate,day]);
 return !day||!skyReady?<WorldSky day={day}/>:null;
}
