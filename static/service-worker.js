//========== install PWA as mobile app
/*
we're caching a simple offline page to be served if the user has no network connection
*/
const CACHE_NAME = 'static-cache';

const FILES_TO_CACHE = [
  '/static/offline.html',
];

/*
install event
*/
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

/*
Activation
The activate event happens the first time a connection is made to the service worker.
When a new service worker is made available it is installed in the background but not activated until
there are no pages using the old service worker. We'll use this to clean up any old caches.
*/
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

/*
Fetch
Now that the files are cached we need a way of serving them. The fetch event listener allows the
service worker to work as a middleman between your web server and the browser. For now we'll just
add the fetch event listener so that it does not utilise the cache and responds only with network requests
*/
//self.addEventListener('fetch', function(event) {
//  event.respondWith(fetch(event.request));
//});

/*
Network only with offline page
If your application requires a user to have a network connection you don't want them to see the default
offline page
*/
self.addEventListener('fetch', (evt) => {
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('offline.html');
      });
    })
  );
});

/*
Network falling back to cache
Using this strategy means users will always be served the most up to date version of your application,
but if they lose network connection the cached data will be served instead
*/
//self.addEventListener('fetch', function(event) {
//  event.respondWith(
//    fetch(event.request).catch(function() {
//      return caches.match(event.request);
//    })
//  );
//});

/*
Cache falling back to network
deal for applications that prioritise offline use. Cached content is served faster, rather than waiting
for the resource to be downloaded. This is good for PWAs as this makes users percieve the application
as faster and even native
*/
//self.addEventListener('fetch', function(event) {
//  event.respondWith(
//    caches.match(event.request).then(function(response) {
//      return response || fetch(event.request);
//    })
//  );
//});