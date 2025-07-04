<template>
  <!-- PDF Viewer -->
  <div class="flex-1 relative h-screen">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10">
      <div class="animate-pulse text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-gray-600">Memuat dokumen...</p>
      </div>
    </div>
    
    <div v-else-if="error" class="absolute inset-0 flex items-center justify-center z-10">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="mt-4 text-red-500">{{ error }}</p>
        <button 
          @click="fetchPdf"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    </div>
    
    <!-- PDF Viewer Component -->
    <PdfViewer2
      v-if="pdfUrl && !loading && !error" 
      :pdf-url="pdfUrl" 
      :key="pdfUrl" 
      class="h-full"
      @document-loaded="onDocumentLoaded"
    />
    
    <!-- <button 
      @click="goBack" 
      class="absolute top-4 left-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 z-20"
    >
      Kembali
    </button> -->
  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta, navigateTo } from '#imports';
import PdfViewer from '@/components/PdfViewer.vue'; // Adjust path as needed
const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'PDF Admin - Sistem Repositori Pusdiklat BPS'
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
  console.log('Document loaded:', document);
  // You can add additional logic here when the document is loaded
};

// Authentication check menggunakan unified auth
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }

  if (!authStore.canAccessAdmin) {
    alert('Akses ditolak. Hanya admin yang dapat mengakses halaman ini.')
    await navigateTo('/')
    return false
  }

  try {
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      alert('Sesi telah berakhir, silakan login kembali')
      await navigateTo('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    alert('Terjadi kesalahan saat verifikasi sesi')
    await authStore.logout()
    await navigateTo('/auth/login')
    return false
  }
}

// Initialize authStore and fetch PDF
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return
  
  await fetchPdf();
});

const fetchPdf = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Check authentication
    if (!authStore.isAuthenticated) {
      await navigateTo('/auth/login')
      return
    }

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
      error.value = 'Anda tidak memiliki izin untuk mengakses dokumen ini.';
    } else if (err.response?.status === 404) {
      error.value = 'Dokumen PDF tidak ditemukan.';
    } else {
      error.value = err.message || 'Gagal memuat dokumen';
    }
  } finally {
    loading.value = false;
  }
};

// Clean up object URL when component is unmounted
onUnmounted(() => {
  if (pdfUrl.value && pdfUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>
