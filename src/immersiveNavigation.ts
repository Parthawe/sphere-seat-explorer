/** Preserve only this public presentation flag when a viewer rebuilds its URL. */
export function withImmersiveView(value:string,active:boolean){
 const url=new URL(value,'https://f1tickets.online');
 if(active)url.searchParams.set('immersive','1');else url.searchParams.delete('immersive');
 if(value.startsWith('?'))return url.search+url.hash;
 return /^https?:\/\//.test(value)?url.href:url.pathname+url.search+url.hash;
}
export const expandedFromUrl=()=>new URLSearchParams(location.search).get('immersive')==='1';
