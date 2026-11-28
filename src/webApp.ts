import {analyticsAllowed,subscribeConsent,trackStandaloneLaunch,trackUsage} from './usageAnalytics';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
type AppState={standalone:boolean;confirmed:boolean;panel:boolean;busy:boolean;error:string};
let state:AppState={standalone:false,confirmed:false,panel:false,busy:false,error:''},prompt:InstallEvent|null=null,started=false,launchTracked=false,opener:HTMLElement|null=null;
const listeners=new Set<()=>void>();
const update=(next:Partial<AppState>)=>{state={...state,...next};listeners.forEach(fn=>fn());};
export const appSnapshot=()=>state;
export const subscribeApp=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};};
export const isAppleDevice=(agent:string,platform:string,touches:number)=>/iPhone|iPad|iPod/.test(agent)||(platform==='MacIntel'&&touches>1);
export const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone);
export const canonicalAppHost=()=>location.hostname==='f1tickets.online'||['localhost','127.0.0.1'].includes(location.hostname);
function measureLaunch(){
 if(!isStandalone()||!analyticsAllowed()||launchTracked||['/insights','/privacy'].includes(location.pathname))return;
 launchTracked=trackStandaloneLaunch();
}
export function installWebApp(){
 if(started)return;started=true;
 const display=matchMedia('(display-mode: standalone)'),change=()=>{update({standalone:isStandalone()});measureLaunch();};
 change();display.addEventListener('change',change);subscribeConsent(measureLaunch);
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event as InstallEvent;});
 window.addEventListener('appinstalled',()=>{prompt=null;update({confirmed:true,panel:false,busy:false,error:''});trackUsage('app_installed');});
 if(import.meta.env.PROD&&'serviceWorker' in navigator&&location.pathname==='/'){
  // Registration failure never prevents browsing or requires a reload.
  void navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(()=>{});
 }
}
export function closeInstallPanel(){update({panel:false,error:''});const target=opener;requestAnimationFrame(()=>{if(target?.isConnected)target.focus({preventScroll:true});});}
export async function requestAppInstall(element:HTMLElement){
 if(state.busy||state.standalone||state.confirmed)return;
 opener=element;
 if(!canonicalAppHost()||!prompt){update({panel:true,error:''});return;}
 const event=prompt;prompt=null;update({busy:true,error:''});
 try{await event.prompt();await event.userChoice;update({busy:false});}
 catch{update({busy:false,panel:true,error:'Installation could not open. Use your browser’s installation menu, or keep exploring here.'});}
}
