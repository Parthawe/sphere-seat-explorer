import {useEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {Sky} from 'three/examples/jsm/objects/Sky.js';
import type {RaceLighting} from './raceLighting';
import {WorldSky} from './WorldShaders';
/** Atmospheric scattering follows the estimated sun; it is not venue photography. */
export default function RaceSky({light}:{light:RaceLighting}){
 const {invalidate,gl}=useThree(),sky=useMemo(()=>{const s=new Sky();s.scale.setScalar(30000);s.frustumCulled=false;s.material.depthWrite=false;return s;},[]);
 useEffect(()=>()=>{sky.geometry.dispose();sky.material.dispose();},[sky]);
 useEffect(()=>{const u=sky.material.uniforms;u.sunPosition.value.set(...light.sun).multiplyScalar(10000);u.turbidity.value=light.period==='dusk'?7:4;u.rayleigh.value=light.period==='dusk'?2.5:1.8;u.mieCoefficient.value=.005;u.mieDirectionalG.value=.82;gl.domElement.dataset.raceLight=light.period;gl.domElement.dataset.raceLightBasis=light.basis;gl.domElement.dataset.raceStart=light.start??'unconfirmed';invalidate();},[sky,light.period,light.basis,light.start,light.sun[0],light.sun[1],light.sun[2],invalidate,gl]);
 return light.period==='night'?<WorldSky/>:<primitive object={sky}/>;
}
