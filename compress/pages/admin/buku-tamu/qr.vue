<template>
  <NuxtLayout>
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div class="max-w-xl w-full text-center space-y-8 p-10 rounded-3xl border-2 border-gray-100 shadow-2xl bg-gradient-to-b from-white to-blue-50">
        <div class="space-y-2">
          <h1 class="text-4xl font-extrabold text-blue-900 tracking-tight">Selamat Datang</h1>
          <p class="text-xl text-gray-600">Silakan scan QR Code di bawah ini untuk mengisi Buku Tamu</p>
        </div>

        <div class="flex justify-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 inline-block mx-auto transform transition-transform hover:scale-105 duration-300">
          <client-only>
            <qrcode-vue :value="qrValue" :size="300" level="H" render-as="svg" foreground="#1e3a8a" />
          </client-only>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-center space-x-3 text-blue-800 font-bold bg-blue-100 py-3 px-6 rounded-full inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Gunakan Kamera Smartphone Anda</span>
          </div>
          
          <p class="text-gray-500 text-sm">
            Pastikan Anda sudah login ke aplikasi Repositori Pusdiklat BPS sebelum melakukan scan.
          </p>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <img src="/img/logo_benar.png" alt="Logo" class="h-12 mx-auto grayscale opacity-50">
        </div>
      </div>
      
      <!-- Admin Back Button (only shown if navigated from admin) -->
      <NuxtLink v-if="isAdmin" to="/admin/buku-tamu" class="mt-8 flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Kembali ke Dashboard Admin
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

const authStore = useUnifiedAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

// The same value used in scan.vue
const qrValue = "BUKU-TAMU-PUSDIKLAT"

useHead({
  title: 'Display QR Buku Tamu - Repositori Pusdiklat'
})
</script>

<style scoped>
/* Optional: Prevent printing the back button and layout parts if needed */
@media print {
  .NuxtLink, button {
    display: none;
  }
}
</style>
