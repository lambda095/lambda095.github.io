const CACHE_NAME = 'vsis-site-v1';
const IMAGES_CACHE = 'images-cache-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/diploma.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/images/responsive/start-preliminary-1200.jpg',
  '/images/responsive/start-preliminary-768.jpg',
  '/images/responsive/start-preliminary-480.jpg',
  '/images/responsive/start-preliminary-1800.jpg',
  '/images/responsive/start-welcome-1200.jpg',
  '/images/responsive/start-welcome-768.jpg',
  '/images/responsive/start-welcome-480.jpg',
  '/images/responsive/start-welcome-1800.jpg',
  '/images/responsive/start-first-events-1200.jpg',
  '/images/responsive/start-first-events-768.jpg',
  '/images/responsive/start-first-events-480.jpg',
  '/images/responsive/start-first-events-1800.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Pre-fill image cache as well
  event.waitUntil(
    caches.open(IMAGES_CACHE).then((cache) => cache.addAll([
      '/images/responsive/start-preliminary-1200.jpg',
      '/images/responsive/start-preliminary-768.jpg',
      '/images/responsive/start-preliminary-480.jpg',
      '/images/responsive/start-preliminary-1800.jpg',
      '/images/responsive/start-welcome-1200.jpg',
      '/images/responsive/start-welcome-768.jpg',
      '/images/responsive/start-welcome-480.jpg',
      '/images/responsive/start-welcome-1800.jpg',
      '/images/responsive/start-first-events-1200.jpg',
      '/images/responsive/start-first-events-768.jpg',
      '/images/responsive/start-first-events-480.jpg',
      '/images/responsive/start-first-events-1800.jpg'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Simple runtime caching for images (Stale-while-revalidate)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.destination === 'image' || req.url.includes('/images/responsive/')) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const networkFetch = fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => null);
        return cached || networkFetch;
      })
    );
  }
});

// Listen for messages from clients (e.g., to skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    // Delete old image cache versions but keep the current IMAGES_CACHE
    caches.keys().then(keys => {
      const imageKeys = keys.filter(k => k.startsWith('images-cache-') || k.startsWith('images-'))
        .filter(k => k !== IMAGES_CACHE);
      return Promise.all(imageKeys.map(k => caches.delete(k)));
    });
  }
});
