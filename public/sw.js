/* ============================================
   Service Worker - MahdiArts Articles PWA
   Version: 2.0.0
============================================ */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `mahdiarts-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/assets/css/services.css',
  '/assets/js/services.js',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('mahdiarts-') && name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Network First with Cache Fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone response before caching
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If HTML page, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background Sync for future features
self.addEventListener('sync', event => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

async function syncComments() {
  // Placeholder for comment sync functionality
  console.log('[SW] Syncing comments...');
}

// Push notifications (future feature)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'مهدی آرتز';
  const options = {
    body: data.body || 'مقاله جدید منتشر شد!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    dir: 'rtl',
    lang: 'fa-IR'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});