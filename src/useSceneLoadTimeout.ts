import {useEffect,useRef} from 'react';

/** A stalled visible scene must offer recovery; background tabs get a fresh window. */
export default function useSceneLoadTimeout(ready:boolean,failed:boolean,attempt:number,onTimeout:()=>void,active=true){
 const callback=useRef(onTimeout);callback.current=onTimeout;
 useEffect(()=>{
  if(ready||failed||!active)return;
  let timer:ReturnType<typeof setTimeout>|undefined;
  const restart=()=>{clearTimeout(timer);if(!document.hidden)timer=setTimeout(()=>callback.current(),30000);};
  restart();document.addEventListener('visibilitychange',restart);
  return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',restart);};
 },[ready,failed,attempt,active]);
}
