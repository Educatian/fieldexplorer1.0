// FieldExplorer service worker — installable PWA + offline app shell.
// Same-origin assets + known CDN deps (vis-network, fonts, chart.js) are cached
// (stale-while-revalidate) so the network explorer works offline after first load.
// Cross-origin APIs (Supabase, OpenAlex) are never intercepted -> always network.
const CACHE = 'fe-v1';
const SHELL = ['/', '/app.html', '/index.html', '/logo.png', '/manifest.webmanifest', '/hero-bg.jpg', '/icon-192.png'];
const CDN_HOSTS = ['unpkg.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', 'aistudiocdn.com'];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    const sameOrigin = url.origin === self.location.origin;
    const isCDN = CDN_HOSTS.includes(url.hostname);
    if (!sameOrigin && !isCDN) return; // Supabase / OpenAlex / others -> straight to network

    // HTML navigations: network-first (fresh deploys win), cache fallback offline
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req)
                .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
                .catch(() => caches.match(req).then((m) => m || caches.match('/')))
        );
        return;
    }

    // assets + CDN deps: stale-while-revalidate (opaque CDN responses allowed)
    e.respondWith(
        caches.match(req).then((cached) => {
            const net = fetch(req)
                .then((r) => {
                    if (r && (r.status === 200 || r.type === 'opaque')) {
                        const cp = r.clone();
                        caches.open(CACHE).then((c) => c.put(req, cp));
                    }
                    return r;
                })
                .catch(() => cached);
            return cached || net;
        })
    );
});
