const CACHE_NAME = 'vsis-site-v3';
const IMAGES_CACHE = 'images-cache-v3';
const STATIC_CACHE = 'static-cache-v3';
const MAX_IMAGES = 50; // Limit number of cached images
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/diploma.html',
  '/css/style.css',
  '/js/main.js',
  '/js/image-optimizer.js',
  '/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.error('Cache install failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME && k !== IMAGES_CACHE && k !== STATIC_CACHE)
        .map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Enhanced caching strategies
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and chrome-extension requests
  if (req.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Image caching strategy: Stale-while-revalidate with size limit
  if (req.destination === 'image' || url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        
        const networkFetch = fetch(req).then(async (res) => {
          if (res && res.status === 200) {
            // Limit cache size
            const keys = await cache.keys();
            if (keys.length >= MAX_IMAGES) {
              // Remove oldest entries
              await cache.delete(keys[0]);
            }
            
            // Add timestamp metadata
            const clonedRes = res.clone();
            const headers = new Headers(clonedRes.headers);
            headers.set('sw-cached-date', new Date().getTime().toString());
            
            cache.put(req, new Response(await clonedRes.blob(), {
              status: clonedRes.status,
              statusText: clonedRes.statusText,
              headers: headers
            }));
          }
          return res;
        }).catch(() => cached); // Fallback to cache on network error
        
        // Return cached immediately, update in background
        return cached || networkFetch;
      })
    );
    return;
  }

  // Static assets (CSS, JS): Cache first, fallback to network
  if (req.destination === 'style' || req.destination === 'script' || 
      url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) {
          // Check if cache is expired
          const cachedDate = cached.headers.get('sw-cached-date');
          if (cachedDate && (Date.now() - parseInt(cachedDate)) < CACHE_EXPIRY) {
            // Update in background
            fetch(req).then((res) => {
              if (res && res.status === 200) {
                cache.put(req, res);
              }
            }).catch(() => {});
            return cached;
          }
        }
        
        // Fetch from network
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const headers = new Headers(res.headers);
            headers.set('sw-cached-date', new Date().getTime().toString());
            cache.put(req, new Response(res.clone().body, {
              status: res.status,
              statusText: res.statusText,
              headers: headers
            }));
          }
          return res;
        }).catch(() => cached || new Response('Offline', { status: 503 }));
      })
    );
    return;
  }

  // HTML pages: Network first, fallback to cache
  if (req.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
        }
        return res;
      }).catch(() => {
        return caches.match(req).then((cached) => {
          return cached || new Response('Offline - Page not available', { status: 503 });
        });
      })
    );
    return;
  }
});

// Listen for messages from clients (e.g., to skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    // Delete old image cache versions but keep the current IMAGES_CACHE
    event.waitUntil(
      caches.keys().then(keys => {
        const imageKeys = keys.filter(k => k.startsWith('images-cache-') || k.startsWith('images-'))
          .filter(k => k !== IMAGES_CACHE);
        return Promise.all(imageKeys.map(k => caches.delete(k)));
      }).then((results) => {
        // Notify clients that clear is done
        return self.clients.matchAll().then(clients => {
          clients.forEach(c => {
            try { c.postMessage({ type: 'CLEAR_DONE' }); } catch(e){}
          });
        });
      })
    );
  }
});
