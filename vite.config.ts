import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola cuando hacés cambios
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Economía Hogar',
        short_name: 'EcoHogar', // El nombre cortito que aparece abajo del ícono en el celu
        description: 'Gestor inteligente de gastos familiares',
        theme_color: '#2563eb', // Color de la barra superior del celular (azul)
        background_color: '#ffffff', // Color de la pantalla de carga
        display: 'standalone', // Esto oculta la barra de direcciones de Chrome (la hace parecer app nativa)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})