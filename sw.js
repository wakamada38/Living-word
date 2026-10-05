const V='lw-v3',SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='bible-api.com'||u.hostname==='bible.helloao.org'){
    // network first, remember verses for offline re-reading
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(m=>{
      const net=fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>m);
      return m||net;
    }));
  }
});
