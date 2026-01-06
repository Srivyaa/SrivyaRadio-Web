const CACHE_NAME = 'srivya-radio-v3';
const STATIC_CACHE = 'srivya-static-v3';
const DYNAMIC_CACHE = 'srivya-dynamic-v3';

// Static assets to cache on install
const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icons/icon.png'
];

// API endpoints (radio data)
const API_PATTERNS = [
    /raw\.githubusercontent\.com/,
    /api\.radio\.net/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => {
                            return name !== STATIC_CACHE &&
                                name !== DYNAMIC_CACHE &&
                                name !== CACHE_NAME;
                        })
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;

    // For API requests (radio data) - Network first, cache fallback
    if (API_PATTERNS.some(pattern => pattern.test(url.href))) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // For static assets - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(request));
});

// Cache first strategy
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Update cache in background
        fetchAndCache(request);
        return cachedResponse;
    }

    return fetchAndCache(request);
}

// Network first strategy
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline fallback for API requests
        return new Response(JSON.stringify({ error: 'Offline', stations: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Fetch and cache helper
async function fetchAndCache(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Fetch failed, serving from cache if available:', request.url);
        throw error;
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavorites());
    }
});

async function syncFavorites() {
    // Implement favorites sync if needed
    console.log('Syncing favorites...');
}

// Push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Check out the latest radio stations!',
        icon: './icons/icon.png',
        badge: './icons/icon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || './'
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SrivyaRadio', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const url = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((windowClients) => {
                // Check if app is already open
                for (const client of windowClients) {
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Media session handler
self.addEventListener('mediaseession', (event) => {
    // Handle media session actions
    console.log('Media session action:', event.action);
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CLEAR_CACHE') {
        caches.delete(DYNAMIC_CACHE);
    }
});
