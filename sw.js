const CACHE_NAME = 'textile-calc-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// App ကို Install လုပ်ချိန်မှာ ဖိုင်အားလုံးကို သိမ်းမယ်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Internet မရှိရင် သိမ်းထားတာတွေကို ပြန်ထုတ်ပြမယ်
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
