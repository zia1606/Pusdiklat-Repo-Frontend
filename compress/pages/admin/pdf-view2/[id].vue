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
          <h1 class="text-xl font-black text-gray-900 tracking-tight italic uppercase">Peninjau Dokumen V2</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Mode Pratinjau Tingkat Lanjut</p>
        </div>
      </div>
      
      <div class="hidden sm:block">
        <span class="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100/50">
          <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Sesi Terautentikasi
        </span>
      </div>
    </div>

    <!-- Viewer Container -->
    <div class="max-w-7xl mx-auto w-full flex-1 flex flex-col relative">
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center animate-pulse">
        <div class="relative mb-8">
          <div class="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-black text-gray-900 tracking-tight">Memuat Arsitektur Dokumen</h3>
        <p class="text-sm text-gray-400 font-medium mt-2">Mohon tunggu saat sistem merender file...</p>
      </div>

      <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center">
        <div class="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
          <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ error }}</h3>
        <div class="flex space-x-4 mt-8">
          <button @click="fetchPdf" class="px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Coba Lagi
          </button>
          <button @click="goBack" class="px-8 py-3.5 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all">
            Kembali
          </button>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col group animate-fadeIn h-full">
        <div class="relative flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/20 border border-gray-100 overflow-hidden ring-1 ring-black/[0.02]">
          <PdfViewer2
            :pdf-url="pdfUrl" 
            :key="pdfUrl" 
            class="h-full w-full"
            @document-loaded="onDocumentLoaded"
          />
        </div>
      </div>
    </div>

    <!-- Footer Decoration -->
    <div class="max-w-7xl mx-auto w-full mt-8 flex justify-between items-center opacity-30">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Dokumen Internal Pusdiklat BPS RI</p>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2024 SIKOMPAK</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta, navigateTo } from '#imports';

const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Advanced PDF View - Sistem Repositori Pusdiklat BPS'
})

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const route = useRoute();
const router = useRouter();
const authStore = useUnifiedAuthStore();

const pdfUrl = ref('');
const loading = ref(true);
const error = ref('');
const pdfBlob = ref(null);

const goBack = () => {
  router.back();
};

const onDocumentLoaded = (document) => {
  console.log('Document loaded successfully');
};

// Authentication check menggunakan unified auth
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }

  if (!authStore.canAccessAdmin) {
    await navigateTo('/')
    return false
  }

  try {
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      await navigateTo('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    await authStore.logout()
    await navigateTo('/auth/login')
    return false
  }
}

onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return
  
  await fetchPdf();
});

const fetchPdf = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Fetch PDF with authentication headers
    const response = await axios.get(
      `${apiBaseUrl}/api/koleksi/${route.params.id}/pdf`, 
      {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/pdf',
        },
        responseType: 'blob'
      }
    );
    
    // Create a blob URL from the response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    pdfBlob.value = blob;
    
    // Create object URL for the PDF blob
    pdfUrl.value = URL.createObjectURL(blob);
    
  } catch (err) {
    console.error('Error fetching PDF:', err);
    if (err.response?.status === 401) {
      error.value = 'Sesi telah berakhir. Silakan login kembali.';
      await authStore.logout();
      await navigateTo('/auth/login');
    } else if (err.response?.status === 403) {
      error.value = 'Akses ditolak. Anda tidak memiliki izin.';
    } else if (err.response?.status === 404) {
      error.value = 'Dokumen tidak ditemukan.';
    } else {
      error.value = 'Gagal memuat dokumen. Coba muat ulang halaman.';
    }
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  if (pdfUrl.value && pdfUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
