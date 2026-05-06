// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@nuxt/image', '@pinia/nuxt'],
  nitro: {
<<<<<<< HEAD
    devProxy: {
      '/api': {
        // target: 'http://127.0.0.1:8000',
        target: 'https://gojags-lib.web.bps.go.id/backend',
        changeOrigin: true,
=======
    // devProxy hanya untuk development
    ...(process.env.NODE_ENV === 'development' && {
      devProxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        }
>>>>>>> ab7ef2a2acc161877f8ac6d7e9a6aac129c8e41c
      }
    })
  },

  // Tambahkan konfigurasi head di sini
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/logo.png' }
      ],
      // Anda juga bisa menambahkan meta tags lainnya jika diperlukan
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Tambahan meta tags lainnya
      ]
    }
  },

  runtimeConfig: {
    public: {
<<<<<<< HEAD
      // apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
=======
>>>>>>> ab7ef2a2acc161877f8ac6d7e9a6aac129c8e41c
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://gojags-lib.web.bps.go.id/backend',
    },
  },
})