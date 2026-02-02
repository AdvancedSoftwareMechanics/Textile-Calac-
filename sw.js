const CACHE_NAME = 'textile-calc-live-v1';
const ASSETS = [
  './',
  './index.html',
  'https://asmfabric.github.io/Textile-Calac-/'
];

// ၁။ Install - ဖိုင်တွေကို သိမ်းဆည်းခြင်း
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ၂။ Activate - အဟောင်းတွေကို ရှင်းထုတ်ခြင်း
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

// ၃။ Fetch - Offline ရော Live Update ရော အလုပ်လုပ်မည့် အပိုင်း
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Internet ရှိရင် Cache ကို အသစ်လဲပေးမယ် (Live Update)
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      // Cache ရှိရင် အရင်ပြမယ် (Recent ရှင်းလည်း ပွင့်အောင်)၊ မရှိရင် Network က ယူမယ်
      return cachedResponse || fetchPromise;
    })
  );
});
