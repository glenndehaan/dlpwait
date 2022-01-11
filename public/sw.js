const RUNTIME = '__SW_VERSION__';
const PRECACHE = '__SW_VERSION__';
const PRECACHE_URLS = ['./'];

const sameOrigin = true;
const exceptions = ['/kill-switch.txt'];
const networkFirst = ['/', '/api'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
            })
            .then(cachesToDelete => {
                return Promise.all(
                    cachesToDelete.map(cacheToDelete => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => {
                console.log(`${RUNTIME} now ready to handle fetches!`);
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', event => {
    const {url} = event.request;

    const isException = exceptions.filter(exception => url.indexOf(exception) !== -1).length;
    const isRightOrigin = sameOrigin ? url.startsWith(self.location.origin) : true;
    const isNetworkFirst = networkFirst.filter(n => url.indexOf(n) !== -1).length;

    if (!isException && isRightOrigin && event.request.method === 'GET') {
        if (isNetworkFirst) {
            event.respondWith(
                caches.open(RUNTIME).then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            });
                        })
                        .catch(() => {
                            return caches.match(event.request).then(
                                response =>
                                    response
                                        ? response
                                        : caches.open(PRECACHE).then(cache => {
                                            return cache.match('offline');
                                        })
                            );
                        });
                })
            );
            return;
        }
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            });
                        })
                        .catch(() => {
                            return caches.open(PRECACHE).then(cache => {
                                return cache.match('offline');
                            });
                        });
                });
            })
        );
    }
});
