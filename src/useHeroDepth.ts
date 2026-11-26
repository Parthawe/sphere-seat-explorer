import {useEffect,type RefObject} from 'react';

/** Event-driven preview depth: no permanent animation loop or motion offscreen. */
export function useHeroDepth(root:RefObject<HTMLElement|null>,enabled:boolean) {
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const reset=()=>{for(const key of ['--depth-x','--depth-y','--depth-rx','--depth-ry'])element.style.removeProperty(key);};
  if(!enabled){reset();return;}
  const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,visible=true,x=0,y=0;
  const render=()=>{frame=0;if(!visible||document.hidden||reduce.matches){reset();return;}const rect=element.getBoundingClientRect();const scroll=Math.max(-28,Math.min(28,(innerHeight/2-rect.top-rect.height/2)*.055));element.style.setProperty('--depth-x',`${x*9}px`);element.style.setProperty('--depth-y',`${scroll+y*6}px`);element.style.setProperty('--depth-rx',`${-y*1.6}deg`);element.style.setProperty('--depth-ry',`${x*2.2}deg`);};
  const schedule=()=>{if(!visible||document.hidden||reduce.matches)return;if(!frame)frame=requestAnimationFrame(render);};
  const move=(event:PointerEvent)=>{if(!fine.matches)return;const rect=element.getBoundingClientRect();x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));schedule();};
  const leave=()=>{x=0;y=0;schedule();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else schedule();});observer.observe(element);
  element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);schedule();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);reduce.removeEventListener('change',schedule);reset();};
 },[root,enabled]);
}
