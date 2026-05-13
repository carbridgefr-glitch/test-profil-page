const CACHE_NAME = "andreas-business-card-v3";

const FILES_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json",
  "andreas-profile.jpg.jpeg",
  "carbridge-logo.png.png",
  "jewelart-logo.png.jpeg",
  "cover.jpg.jpg",
  "gmail.jpg",
  "call.jpg",
  "sms.jpg",
  "viber.jpg",
  "watsapp.jpg",
  "facebook.jpg",
  "instagram.jpg",
  "tiktok.jpg",
  "googlemap.jpg",
  "googlereview.jpg"
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(function (response) {
          return response;
        })
        .catch(function () {
          return caches.match("index.html");
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
