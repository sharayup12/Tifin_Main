const CACHE="tiffin-cache-v2"
const ASSETS=["/index.html","/src/main.js","/src/styles.css"]
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))})
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))})
self.addEventListener("fetch",e=>{
  const req=e.request
  if(req.method!=="GET") return
  const url=new URL(req.url)
  const sameOrigin=url.origin===self.location.origin
  if(!sameOrigin){
    e.respondWith(fetch(req).catch(()=>caches.match(req)))
    return
  }
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).catch(()=>caches.match("/index.html")))
    return
  }
  e.respondWith(
    fetch(req).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));return res}).catch(()=>caches.match(req))
  )
})