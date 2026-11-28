import {expandedFromUrl,withImmersiveView} from './immersiveNavigation';
import {useEffect,useLayoutEffect,type RefObject} from 'react';

/** Viewport mode also works on mobile browsers without the Fullscreen API. */
export default function useImmersiveScene(surface:RefObject<HTMLElement|null>,active:boolean,setActive:(active:boolean)=>void){
 useEffect(()=>{const restore=()=>setActive(expandedFromUrl());window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[setActive]);
 useLayoutEffect(()=>{const current=location.pathname+location.search+location.hash,next=withImmersiveView(current,active);if(next!==current)history.replaceState(history.state,'',next);},[active]);
 useLayoutEffect(()=>{
  const element=surface.current;if(!active||!element)return;
  const opener=element.querySelector<HTMLElement>('.scene-expand')??(document.activeElement instanceof HTMLElement?document.activeElement:null);
  const scrollY=window.scrollY,scrollX=window.scrollX;
  const saved={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};
  const previousRole=element.getAttribute('role'),previousModal=element.getAttribute('aria-modal');
  element.dataset.immersive='true';element.setAttribute('role','dialog');element.setAttribute('aria-modal','true');
  Object.assign(document.body.style,{position:'fixed',top:`-${scrollY}px`,width:'100%',overflow:'hidden'});
  // Keep the existing renderer mounted, and isolate only the surrounding page.
  const siblings=new Map<HTMLElement,boolean>(),ancestors:HTMLElement[]=[];
  for(let child:HTMLElement=element;child.parentElement;child=child.parentElement){
   if(child!==element&&child!==document.body){ancestors.push(child);child.dataset.immersiveAncestor='true';}
   for(const sibling of child.parentElement.children){if(sibling!==child&&sibling instanceof HTMLElement){siblings.set(sibling,sibling.inert);sibling.inert=true;}}
  }
  const buttons=()=>Array.from(element.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],select:not(:disabled),input:not(:disabled),[tabindex="0"]')).filter(el=>!el.closest('[inert]')&&el.getClientRects().length>0&&!el.closest('[hidden]'));
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){if(document.querySelector('dialog[open]'))return;event.preventDefault();event.stopPropagation();setActive(false);return;}
   if(event.key!=='Tab'||document.querySelector('dialog[open]'))return;
   const items=buttons(),first=items[0],last=items.at(-1);if(!first)return;
   if(event.shiftKey&&(document.activeElement===first||!element.contains(document.activeElement))){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&(document.activeElement===last||!element.contains(document.activeElement))){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',key,true);
  element.querySelector<HTMLElement>('[data-exit-immersive]')?.focus({preventScroll:true});
  return()=>{
   document.removeEventListener('keydown',key,true);delete element.dataset.immersive;
   if(previousRole===null)element.removeAttribute('role');else element.setAttribute('role',previousRole);
   if(previousModal===null)element.removeAttribute('aria-modal');else element.setAttribute('aria-modal',previousModal);
   siblings.forEach((wasInert,sibling)=>{sibling.inert=wasInert;});ancestors.forEach(parent=>delete parent.dataset.immersiveAncestor);
   Object.assign(document.body.style,saved);window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});
   requestAnimationFrame(()=>{if(opener?.isConnected&&!opener.closest('[inert]'))opener.focus({preventScroll:true});});
  };
 },[surface,active,setActive]);
}
