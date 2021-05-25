var toCache = ['cube.png', 'index.html', 'main.js', 'main.css', 'droplet2.mp3', 'hammer3.mp3'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('cache-v4')
    .then(cache => {
      cache.addAll(toCache);
    }));
});

self.addEventListener('fetch', event => {
if(!navigator.onLine && caches.match(event.request)){
  event.respondWith(caches.match(event.request));
  }
  if(navigator.connection.downLink < 0.5 || !navigator.onLine){
    var cached = caches.match(event.request);
    event.respondWith(cached);
}
else
{
    var webResp = fetch(event.request.url);
    event.respondWith(webResp);
  }
});
