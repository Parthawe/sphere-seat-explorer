import {useEffect,useState} from 'react';

/** Keep portable screens within a smaller pixel and shadow budget. */
export default function useSceneQuality(){
 const [portable,setPortable]=useState(()=>matchMedia('(max-width:900px), (pointer:coarse)').matches);
 useEffect(()=>{const query=matchMedia('(max-width:900px), (pointer:coarse)'),update=()=>setPortable(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 return {portable,dpr:[1,portable?1.25:1.5] as [number,number],shadowSize:portable?1024:2048};
}
