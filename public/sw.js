const CACHE_VERSION = 'v1';
const CACHE_NAME = `brilliant-quest-${CACHE_VERSION}`;

// Different caches for different asset types
const CACHES_TO_MANAGE = [
  `app-shell-${CACHE_VERSION}`,
  `images-${CACHE_VERSION}`,
  `api-${CACHE_VERSION}`,
  `assets-${CACHE_VERSION}`
];

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...', CACHE_NAME);
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(`app-shell-${CACHE_VERSION}`).then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(STATIC_ASSETS).catch(() => {
          console.log('Some static assets could not be cached');
        });
      }),
      // Pre-cache manifest for offline access
      caches.open(`assets-${CACHE_VERSION}`).then((cache) => {
        return cache.add('./manifest.json').catch(() => {
          console.log('Could not cache manifest');
        });
      })
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return !CACHES_TO_MANAGE.some(name => cacheName.startsWith(name.split('-')[0]));
          })
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // For navigation requests (HTML pages), use network-first then cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.status === 200) {
            const cache = caches.open(`app-shell-${CACHE_VERSION}`);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || new Response('Offline - Page not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        })
    );
    return;
  }

  // For images, use cache-first strategy with network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          if (response.ok) {
            const cache = caches.open(`images-${CACHE_VERSION}`);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        });
      }).catch(() => {
        return new Response(null, { status: 404 });
      })
    );
    return;
  }

  // For API/data requests, use network-first with cache fallback
  if (url.pathname.includes('/api/') || request.destination === 'empty') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.status === 200) {
            const cache = caches.open(`api-${CACHE_VERSION}`);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // For all other assets (JS, CSS, fonts), use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((response) => {
        if (response.ok && response.status === 200) {
          const cache = caches.open(`assets-${CACHE_VERSION}`);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      }).catch(() => {
        // Return a generic offline response
        return new Response('Resource offline', {
          status: 503,
          statusText: 'Service Unavailable', 
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});
