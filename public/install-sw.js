/* Instalación liviana: sin precarga, APIs, caché masiva ni datos personales. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => { /* La red existente maneja el contenido. */ });
