'use strict';

const CACHE_NAME = 'movie-app-v1'
const FILES_TO_CACHE = [
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


self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {

    evt.waitUntil(
        caches.keys().then((keylist) => {
            return Promise.all(keylist.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    if (evt.request.mode !== 'navigate') {
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
});