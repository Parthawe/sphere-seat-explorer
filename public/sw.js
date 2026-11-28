/* Online-first: cache only the public, self-contained offline screen. */
const CACHE='f1tickets-offline-v1';
const OFFLINE='/offline.html';
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const response=await fetch(OFFLINE,{cache:'reload',credentials:'omit'});
  if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw new Error('Offline screen unavailable');
  const cache=await caches.open(CACHE);await cache.put(OFFLINE,response);
 })());
 // No skipWaiting: an update must not take over an active 3D session.
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('f1tickets-offline-')&&key!==CACHE).map(key=>caches.delete(key)));
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 // All APIs, authentication, private pages, assets and external media go straight to the network.
 if(request.method!=='GET'||request.mode!=='navigate'||url.origin!==self.location.origin||url.pathname!=='/')return;
 event.respondWith((async()=>{
  try{return await fetch(request);}catch{
   const cache=await caches.open(CACHE),offline=await cache.match(OFFLINE);
   if(offline)return new Response(offline.body,{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
   return Response.error();
  }
 })());
});
