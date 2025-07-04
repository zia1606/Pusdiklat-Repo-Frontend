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
    devProxy: {
      '/api': {
        target: 'https://pusdiklat-repo-backend.zeabur.app', // Sesuaikan dengan URL backend Anda
        changeOrigin: true,
      }
    }
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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://pusdiklat-repo-backend.zeabur.app',
    },
  },
})