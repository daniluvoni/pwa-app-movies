const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';
const FILES_TO_CACHE = [
  '/',
  'images/icons/favicon.ico',
  'images/bg-home.jpg',
  'images/no-results.png',
  'css/style.css',
  'css/bootstrap/bootstrap.min.css',
  'js/bootstrap/bootstrap.bundle.min.js',
  'js/app.js',
  'js/movies.js',
  'js/offline.js',
  'js/jquery-3.6.0.js',
  'js/top-ten.js',
  'js/watchlist.js',
  'sections/top-ten.html',
  'sections/watchlist.html',
  'index.html',
  'offline.html'
];

self.addEventListener('install', function (event) {
  console.log('install', event);
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      [...FILES_TO_CACHE, OFFLINE_URL].map((path) => {
        return cache.add(new Request(path, { cache: "reload" }));
      })
    );
  })());

  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  console.log('activate', event);
  event.waitUntil((async () => {
    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  console.log('fetch', event);
  event.respondWith((async () => {
    try {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        return preloadResponse;
      }

      return await fetch(event.request);
    } catch (e) {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(event.request);
    }
  })());

});