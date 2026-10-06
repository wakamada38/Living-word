const V='lw-v6',BIBLE='lw-bible'; // BIBLE is never deleted, so saved Bible text survives app updates
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const OPT=['./firebase-config.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(async c=>{
    await c.addAll(SHELL);
    await Promise.all(OPT.map(u=>c.add(u.startsWith('http')?new Request(u,{mode:'no-cors'}):u).catch(()=>{})));
  }));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==BIBLE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const put=(name,r)=>{if(r&&r.ok){const c=r.clone();caches.open(name).then(x=>x.put(e.request,c))}return r};
  if(u.hostname==='bible-api.com'||u.hostname==='bible.helloao.org'){
    if(u.pathname.endsWith('available_translations.json')){
      e.respondWith(fetch(e.request).then(r=>put(BIBLE,r)).catch(()=>caches.match(e.request)));
    }else{ // chapter text never changes: cache first, then network
      e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>put(BIBLE,r))));
    }
    return;
  }
  if(u.hostname==='www.gstatic.com'){
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>put(V,r))));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(m=>{
      const net=fetch(e.request).then(r=>put(V,r)).catch(()=>m);
      return m||net;
    }));
  }
});
