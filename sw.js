// ၁။ Cache နာမည် (Update လုပ်တိုင်း v1, v2 စသဖြင့် ပြောင်းပေးပါ)
const CACHE_NAME = 'textile-calc-v10';

// ၂။ Offline သိမ်းထားရမယ့် ဖိုင်စာရင်း
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json'
];

// ၃။ Service Worker စတင်သွင်းယူခြင်း (Install Event)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // လက်ရှိ version အသစ်ကို ချက်ချင်း အလုပ်လုပ်စေရန်
  self.skipWaiting();
});

// ၄။ Version ဟောင်းတွေကို ရှင်းထုတ်ခြင်း (Activate Event)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Browser tab အားလုံးကို ချက်ချင်း ထိန်းချုပ်ရန်
  return self.clients.claim();
});

// ၅။ အင်တာနက်မရှိချိန် Cache ထဲကနေ ဆွဲထုတ်ပေးခြင်း (Fetch Event)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache ထဲမှာရှိရင် ပေးမယ်၊ မရှိရင် အင်တာနက်ကနေ ဆွဲမယ်
      return response || fetch(event.request);
    }).catch(() => {
      // အကယ်၍ အင်တာနက်လည်းမရှိ၊ Cache ထဲမှာလည်း ရှာမတွေ့ရင် index.html ကို ပြမယ်
      return caches.match('index.html');
    })
  );
});
