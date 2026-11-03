/* Instalación mínima. Sin cache anticipada, sin lecturas/escrituras de datos. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Respuesta normal de red, sin duplicar solicitudes ni descargar módulos.
  event.respondWith(fetch(event.request));
});
