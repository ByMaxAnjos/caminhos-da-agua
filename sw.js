const CACHE_NAME = "caminhos-da-agua-v4";
const APP_FILES = [
  "./",
  "./index.html",
  "./assets/app.css",
  "./assets/app.js",
  "./assets/hidro.js",
  "./assets/conteudo.js",
  "./assets/icone.png",
  "./manifest.webmanifest"
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

// Rede primeiro, cache como reserva: online sempre vê a versão publicada;
// o cache só entra sem rede (laboratório ou campo sem sinal).
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
