const CACHE_PREFIX = 'villa-hermosa-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}offline-v1`;
const OFFLINE_ASSETS = [
  '/offline.html',
  '/pwa/offline.css',
  '/pwa/icons/icon-192.png',
  '/pwa/icons/icon-512.png',
  '/pwa/icons/maskable-192.png',
  '/pwa/icons/maskable-512.png',
  '/pwa/icons/apple-touch-icon.png',
];
const OFFLINE_ASSET_PATHS = new Set(OFFLINE_ASSETS);

const precacheOfflineAssets = async () => {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(
    OFFLINE_ASSETS.map(async (path) => {
      const response = await fetch(path, { cache: 'reload' });

      if (!response.ok || response.type !== 'basic') {
        throw new Error(`No se pudo guardar ${path} para el modo sin conexión.`);
      }

      await cache.put(path, response);
    })
  );
};

self.addEventListener('install', (event) => {
  event.waitUntil(precacheOfflineAssets().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(async () => {
        const offlinePage = await caches.match('/offline.html');

        return (
          offlinePage ||
          new Response('Necesitas conexión a internet para abrir el cotizador.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        );
      })
    );
    return;
  }

  if (url.search || !OFFLINE_ASSET_PATHS.has(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(url.pathname);
      if (cachedResponse) return cachedResponse;

      const networkResponse = await fetch(request, { cache: 'no-store' });

      if (networkResponse.ok && networkResponse.type === 'basic') {
        await cache.put(url.pathname, networkResponse.clone());
      }

      return networkResponse;
    })
  );
});
