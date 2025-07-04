<template>
  <!-- PDF Viewer -->
  <div class="flex-1 relative h-screen">
    <PdfViewer 
      v-if="pdfUrl" 
      :pdf-url="pdfUrl" 
      :key="pdfUrl" 
      class="h-full"
      @document-loaded="handleDocumentLoaded"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div v-if="loading" class="animate-pulse">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-gray-600">Memuat dokumen...</p>
        </div>
        <div v-else-if="error" class="text-red-500">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="mt-4">{{ error }}</p>
          <router-link 
            to="/auth/login" 
            class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            v-if="error.includes('login') || error.includes('Sesi')"
          >
            Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import PdfViewer from '~/components/PdfViewer.vue';

useHead({
  title: 'PDF - Sistem Repositori Pusdiklat BPS'
})

const route = useRoute();
const router = useRouter();
const authStore = useUnifiedAuthStore()

const koleksi = ref({});
const pdfUrl = ref('');
const loading = ref(true);
const error = ref('');

const handleDocumentLoaded = (doc) => {
  console.log('Dokumen berhasil dimuat:', doc);
};

const fetchPdf = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await authStore.initializeAuth();

    const timestamp = Date.now();
    const url = authStore.isAuthenticated 
      ? `http://127.0.0.1:8000/api/koleksi/${route.params.id}/pdf?t=${timestamp}`
      : `http://127.0.0.1:8000/api/koleksi/${route.params.id}/public-pdf?t=${timestamp}`;

    const headers = {};
    if (authStore.isAuthenticated) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(response.status === 401 
        ? 'Anda harus login untuk mengakses dokumen ini' 
        : 'Gagal memuat dokumen');
    }

    const blob = await response.blob();
    pdfUrl.value = URL.createObjectURL(blob);
    
  } catch (err) {
    error.value = err.message;
    if (err.message.includes('login')) {
      navigateTo('/auth/login');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await authStore.initializeAuth();
  await fetchPdf();
});
</script>