// Minimal Service Worker to satisfy PWA requirements
globalThis.addEventListener('install', () => {
    globalThis.skipWaiting();
});

globalThis.addEventListener('activate', (event) => {
    event.waitUntil(globalThis.clients.claim());
});

globalThis.addEventListener('fetch', (event) => {
    // Basic pass-through fetch
    event.respondWith(fetch(event.request));
});
