/* ============================================================
   SERVICE WORKER

   This is the part that makes the app work with no internet.

   The first time someone opens the app online, this file copies
   everything in FILES into the phone's own storage. After that the
   app loads from the phone, whether or not there is a connection.

   TWO RULES:

   1. When you add a new file (an image, a floor plan), add its name
      to the FILES list below, or it will not be saved for offline use.

   2. Every time you change anything at all, change the version number
      on the next line (v1 -> v2 -> v3). That is what tells phones a
      new version exists. If you forget, people keep seeing the old one.
   ============================================================ */

const VERSION = 'fire-safety-v7';

const FILES = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Save everything the first time.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// Delete old versions so the phone does not keep stale copies.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Serve from the phone first. This is deliberate: safety information
// must appear instantly and must never depend on a connection.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Videos are too big to store on the phone, so they always stream
  // from the internet and skip the offline copy.
  if (event.request.url.includes('/videos/')) return;

  event.respondWith(
    caches.match(event.request).then(hit => {
      if (hit) return hit;
      return fetch(event.request).catch(() => caches.match('index.html'));
    })
  );
});
