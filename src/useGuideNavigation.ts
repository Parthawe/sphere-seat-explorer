import {useEffect,useRef,useState} from 'react';

const sections=['venue-stands','circuit-guide','booking-checks','venue-references','race-schedule','race-circuit'];

/** Keep guide navigation aligned with the actual section and its measured sticky height. */
export function useGuideNavigation() {
 const nav=useRef<HTMLElement>(null),[active,setActive]=useState('venue-stands');
 useEffect(()=>{
  const element=nav.current,root=element?.closest<HTMLElement>('.race-hub');
  if(!element||!root)return;
  let frame=0,lastHeight=-1;
  const update=()=>{
   frame=0;const height=element.getBoundingClientRect().height;
   if(height!==lastHeight){lastHeight=height;root.style.setProperty('--guide-nav-offset',`${height+16}px`);}
   const passed=sections.map(id=>({id,top:document.getElementById(id)?.getBoundingClientRect().top??Infinity}))
    .filter(section=>section.top<=height+32).sort((a,b)=>b.top-a.top);
   setActive(passed[0]?.id??'venue-stands');
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const resize=new ResizeObserver(queue);resize.observe(element);
  const content=new MutationObserver(queue);content.observe(root,{childList:true,subtree:true});
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  queue();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();content.disconnect();window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);root.style.removeProperty('--guide-nav-offset');};
 },[]);
 return {nav,active};
}
