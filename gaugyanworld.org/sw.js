// Minimal Service Worker to satisfy PWA requirements
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through fetch
    event.respondWith(fetch(event.request));
});
