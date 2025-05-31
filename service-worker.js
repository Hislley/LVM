const CACHE_NAME = 'meu-site-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Evento de instalação
self.addEventListener("install", event => {
  console.log("Service Worker instalado.");
  self.skipWaiting(); // ativa imediatamente

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de ativação
self.addEventListener("activate", event => {
  console.log("Service Worker ativado.");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // controla imediatamente todas as abas
});

// Evento de fetch (busca de arquivos)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a nova resposta
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Se estiver offline, tenta servir o cache
        return caches.match(event.request);
      })
  );
});
