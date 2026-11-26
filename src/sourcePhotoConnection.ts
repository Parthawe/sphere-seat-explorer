// Page-session permission only. No cookies, storage, analytics or image proxy.
let allowed=false;
const listeners=new Set<()=>void>();
export const photoConnectionAllowed=()=>allowed;
export function allowPhotoConnection(value:boolean){allowed=value;listeners.forEach(listener=>listener());}
export function subscribePhotoConnection(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};}
