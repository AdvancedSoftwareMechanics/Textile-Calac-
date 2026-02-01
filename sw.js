const CACHE_NAME = 'textile-calc-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './version.json'
];

// ၁။ Install လုပ်စဉ်မှာ ဖိုင်တွေကို အတင်းသိမ်းခိုင်းမယ်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // ဒီတစ်ကြောင်းက အရေးကြီးတယ် (Version အဟောင်းကို ချက်ချင်းကျော်ဖို့)
});

// ၂။ Activate ဖြစ်တာနဲ့ App ကို ချက်ချင်း ထိန်းချုပ်ခိုင်းမယ်
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(), // App ပိတ်ပြီး ပြန်ဖွင့်ရင်လည်း ချက်ချင်း အလုပ်လုပ်စေဖို့
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

// ၃။ ဖိုင်တောင်းဆိုမှုတိုင်းကို Cache ထဲကပဲ အရင်ရှာခိုင်းမယ်
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache ထဲမှာရှိရင် ပြမယ်၊ မရှိရင်မှ Network သွားမယ်
      return response || fetch(event.request).catch(() => {
        // အကယ်၍ ၂ ခုလုံးမရရင် index.html ကို ပြန်ပြမယ် (Offline Fallback)
        return caches.match('./index.html');
      });
    })
  );
});
