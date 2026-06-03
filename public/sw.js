const CACHE='exploit-v5';
const ASSETS=['/','/index.html','/css/style.css','/js/matrix.js','/js/chat.js','/js/terminal.js','/js/devtools.js','/js/app.js','/login.html','/manifest.json'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  self.clients.claim();
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>r).catch(()=>caches.match(e.request)));
});
