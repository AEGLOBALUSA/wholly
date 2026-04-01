// WHOLLY Service Worker
// Uses Workbox for caching strategies

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// ─── App Shell Precache ───
// Expo static export generates hashed filenames, so we cache the entry point
precacheAndRoute([
  { url: '/index.html', revision: null },
]);

// ─── Static Assets: Cache First ───
// Images, fonts, and other static files with content-hashed names
registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style',
  new CacheFirst({
    cacheName: 'wholly-static-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// ─── JS Bundles: Cache First (hashed filenames) ───
registerRoute(
  ({ request }) => request.destination === 'script',
  new CacheFirst({
    cacheName: 'wholly-js-bundles',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// ─── Supabase REST API: Stale While Revalidate ───
// Profile data, matches — show cached instantly, refresh in background
registerRoute(
  ({ url }) => url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/'),
  new StaleWhileRevalidate({
    cacheName: 'wholly-api-data',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  }),
);

// ─── Network Only: Auth, Realtime, Payments ───
// Never cache sensitive or real-time data
registerRoute(
  ({ url }) =>
    (url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/auth/')) ||
    url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/realtime/') ||
    url.hostname.includes('stripe.com'),
  new NetworkOnly(),
);

// ─── Offline Fallback ───
// Serve cached index.html for navigation requests when offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      return await fetch(event.request);
    } catch {
      return caches.match('/index.html');
    }
  },
);

// ─── Push Notification Handlers ───
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'wholly-notification',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'WHOLLY', options),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window
      return clients.openWindow(url);
    }),
  );
});
