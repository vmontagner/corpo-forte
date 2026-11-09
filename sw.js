const CACHE="corpo-forte-academia-v2";
const FILES=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting()})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith("corpo-forte-")&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{
 const request=event.request;if(request.method!=="GET")return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   // Para páginas, sempre tenta a versão publicada antes do cache.
   const response=await fetch(request,{cache:"no-store"});
   if(response&&response.ok)cache.put(request,response.clone());
   return response;
  }catch(error){
   const cached=await cache.match(request)||await cache.match("./index.html");
   if(cached)return cached;
   throw error;
  }
 })());
});
