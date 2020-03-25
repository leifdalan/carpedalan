/* eslint-disable no-underscore-dangle,no-restricted-globals,no-console */
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

const { DOMAIN, NODE_ENV } = process.env;

skipWaiting();
clientsClaim();

const precache =
  NODE_ENV === 'production'
    ? [
        ...(self.__WB_MANIFEST ?? []).map(obj => ({
          ...obj,
          url: `https://cdn.${DOMAIN}/${obj.url}`,
        })),
        // { url: '/' },
      ]
    : [...(self.__WB_MANIFEST ?? [])];
console.log('SW manifestz: ', precache);
precacheAndRoute(precache);
setCacheNameDetails({
  prefix: 'carpe',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'default-runtime',
});

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

function fetchEventHandler(event: FetchEvent) {
  if (event.request.url.includes('login') && event.request.method === 'POST') {
    const returnValue = event.respondWith(
      fetch(event.request).then(res => {
        caches.open('document').then(cache => {
          console.log('Updating document cache to be logged in.');
          cache.add('/');
        });

        return res;
      }),
    );
    console.log(returnValue);
  }
}

self.addEventListener('fetch', fetchEventHandler as (d: Event) => void);

console.log('WHASzzzzzzSUPzzzzv4', caches);
caches.keys().then(keys => {
  console.log('keyseeee', keys);
  if (!keys.includes('document')) {
    caches.open('document').then(cache => cache.add('/'));
  }
});

registerRoute(
  /\.(?:js|css)$/,
  new CacheFirst({
    cacheName: 'static-resources',
  }),
);

self.addEventListener('push', function(event: any) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

registerRoute(
  /\/v1/,
  new NetworkFirst({
    cacheName: 'api',
  }),
);

registerRoute(
  match => match.url.origin === `https://photos.${DOMAIN}`,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);
registerRoute(
  match => match.url.origin === `https://cdn.${DOMAIN}`,
  new CacheFirst({
    cacheName: 'public',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  /\//,
  new NetworkFirst({
    cacheName: 'document',
  }),
);
