const CACHE_NAME = 'textile-calc-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './version.json'
];

// App ကို Install လုပ်ချိန်မှာ ဖိုင်အားလုံးကို ဖုန်းထဲ သိမ်းမယ်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Internet မရှိရင် သိမ်းထားတာတွေကို ပြန်ထုတ်ပြမယ်
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // သိမ်းထားတာရှိရင် ပြမယ်၊ မရှိရင် Network ကနေ ဆွဲမယ်
      return response || fetch(event.request);
    })
  );
});

// Version အဟောင်းတွေကို ဖျက်ထုတ်မယ်
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
