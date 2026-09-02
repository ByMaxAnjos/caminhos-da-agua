const CACHE_NAME = "caminhos-da-agua-v2";
const APP_FILES = [
  "./",
  "./index.html",
  "./app.html",
  "./assets/app.css",
  "./assets/app.js",
  "./manifest.webmanifest",
  "./missoes/paraibuna-enchentes.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

// Rede primeiro, cache como reserva — para quem já visitou o site sempre ver a
// versão publicada mais recente quando estiver online. O cache só entra em
// jogo sem rede (offline em campo), que é o requisito real (§10.5 da spec).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request))
  );
});
