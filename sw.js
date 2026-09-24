const CACHE_NAME = "caminhos-da-agua-v5";
const APP_FILES = [
  "./",
  "./index.html",
  "./assets/app.css?v=5",
  "./assets/app.js?v=5",
  "./assets/hidro.js?v=5",
  "./assets/conteudo.js?v=5",
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
    // no-cache: revalida com o servidor em vez de usar a cópia de 10 min do navegador
    // (misturar HTML antigo com JS novo quebrava o app no celular).
    (new URL(event.request.url).origin === self.location.origin
      ? fetch(event.request.url, { cache: "no-cache", credentials: "same-origin" })
      : fetch(event.request)
    ).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request, { ignoreSearch: event.request.mode === "navigate" }))
  );
});
