const V='lw-v5';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const OPT=['./firebase-config.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(async c=>{
    await c.addAll(SHELL);
    await Promise.all(OPT.map(u=>c.add(u.startsWith('http')?new Request(u,{mode:'no-cors'}):u).catch(()=>{})));
  }));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const put=r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r};
  if(u.hostname==='bible-api.com'||u.hostname==='bible.helloao.org'){
    e.respondWith(fetch(e.request).then(put).catch(()=>caches.match(e.request)));
    return;
  }
  if(u.hostname==='www.gstatic.com'){
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(put)));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(m=>{
      const net=fetch(e.request).then(put).catch(()=>m);
      return m||net;
    }));
  }
});
