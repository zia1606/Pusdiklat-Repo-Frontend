<template>
    <div class="pdf-viewer-container">
      <div v-if="loading" class="loading">
        Memuat dokumen...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="pdf-container">
        <iframe 
          :src="pdfUrl" 
          width="100%" 
          height="800px" 
          frameborder="0"
        ></iframe>
        
        <div class="actions">
          <button @click="goBack" class="btn btn-primary">
            Kembali
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '~/stores/auth';
  
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
      pdfUrl.value = `/api/koleksi/${id}/pdf?token=${token}`;
      
      loading.value = false;
    } catch (err) {
      console.error('Error loading PDF:', err);
      error.value = 'Gagal memuat dokumen. Silakan coba lagi.';
      loading.value = false;
    }
  });
  
  const goBack = () => {
    router.go(-1); // Kembali ke halaman sebelumnya
  };
  </script>
  
  <style scoped>
  .pdf-viewer-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .loading, .error {
    text-align: center;
    padding: 50px;
    font-size: 18px;
  }
  
  .actions {
    margin-top: 20px;
    text-align: center;
  }
  
  .btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #45a049;
  }
  </style>