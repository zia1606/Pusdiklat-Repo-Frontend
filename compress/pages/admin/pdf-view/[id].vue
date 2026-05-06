<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col">
    <!-- Header Area -->
    <div class="max-w-7xl mx-auto w-full mb-8 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button 
          @click="goBack" 
          class="h-12 w-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-md transition-all duration-300 group"
        >
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-black text-gray-900 tracking-tight italic uppercase">Peninjau Dokumen</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Mode Pratinjau Administrator</p>
        </div>
      </div>
      
      <div class="hidden sm:block">
        <span class="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100/50">
          <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Akses Terverifikasi
        </span>
      </div>
    </div>

    <!-- Viewer Container -->
    <div class="max-w-7xl mx-auto w-full flex-1 flex flex-col relative">
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center">
        <div class="relative mb-8">
          <div class="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin"></div>
        </div>
        <h3 class="text-lg font-black text-gray-900 tracking-tight">Menyiapkan Dokumen</h3>
        <p class="text-sm text-gray-400 font-medium mt-2">Mohon tunggu sebentar...</p>
      </div>

      <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center">
        <div class="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
          <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ error }}</h3>
        <button @click="goBack" class="mt-8 px-8 py-3.5 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all">
          Kembali ke Daftar
        </button>
      </div>

      <div v-else class="flex-1 flex flex-col group animate-fadeIn">
        <div class="relative flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/20 border border-gray-100 overflow-hidden ring-1 ring-black/[0.02]">
          <iframe 
            :src="pdfUrl" 
            class="w-full h-full border-none"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Footer Decoration -->
    <div class="max-w-7xl mx-auto w-full mt-8 flex justify-center opacity-30">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2024 Pusdiklat BPS RI • Sistem Repositori Digital</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '~/stores/adminAuth';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const route = useRoute();
const router = useRouter();
const authStore = useAdminAuthStore();

const id = route.params.id;
const loading = ref(true);
const error = ref(null);
const pdfUrl = ref(null);

onMounted(async () => {
  try {
    // Check authentication
    if (!authStore.isLoggedIn) {
      error.value = 'Anda harus login terlebih dahulu';
      return router.push('/admin/auth/login');
    }

    // Verify token
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      await authStore.logout();
      return router.push('/admin/auth/login');
    }

    // Generate PDF URL with authorization token
    const token = authStore.token;
    // Gunakan URL endpoint API yang benar
    pdfUrl.value = `${apiBaseUrl}/api/koleksi/${id}/pdf?token=${token}`;
    
    loading.value = false;
  } catch (err) {
    console.error('Error loading PDF:', err);
    error.value = 'Gagal memuat dokumen. Silakan coba lagi.';
    loading.value = false;
  }
});

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-modalIn {
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Custom scrollbar for better look */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>