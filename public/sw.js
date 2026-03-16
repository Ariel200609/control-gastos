const CACHE_NAME = 'ecohogar-v1';

// Se instala el Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado correctamente');
  self.skipWaiting(); // Fuerza a que se active al instante
});

// Se activa y toma el control de la app
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activado y listo');
  return self.clients.claim();
});

// "Atrapa" las peticiones de red (Esto es lo que exige Chrome para dejarte instalar la app)
self.addEventListener('fetch', (e) => {
  // Por ahora dejamos que todo pase normal de largo a internet, 
  // pero solo con tener este bloque de código, el celular ya te da el OK para instalarla.
});