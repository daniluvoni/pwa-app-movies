'use strict';

const CACHE_NAME = 'movie-app-v1'
const FILES_TO_CACHE = [
    'images/icons/favicon.ico',
    //'images/logo.png',
    //'images/bg.jpg',
    //'images/offline.png',
    //'css/styles.css',
    //'css/bootstrap.min.css',
    //'js/bootstrap.bundle.min.js',
    'js/app.js',
    'offline.html'
];

//Instala el service worker 
self.addEventListener('install', (evt) => {

    console.log('[ServiceWorker] Instalando...');

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log('[ServiceWorker] Almacenamiento en caché de archivos de aplicaciones');
            return cache.addAll(FILES_TO_CACHE);
        })

    );
    self.skipWaiting();
});

//Genera el CACHE de archivos estáticos
self.addEventListener('activate', (evt) => {

    console.log('[ServiceWorker] Activando...');

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                //console.log('[ServiceWorker] Removiendo cache antiguo...');
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});


//Responder a la versión sin conexión de la aplicación
self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Recibiendo', evt.request.url);

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