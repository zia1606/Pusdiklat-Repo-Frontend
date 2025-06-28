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
        target: 'http://localhost:8000', // Sesuaikan dengan URL backend Anda
        changeOrigin: true,
      }
    }
  }
})