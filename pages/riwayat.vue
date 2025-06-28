<template>
    <div class="bg-gray-100">
      <NuxtLayout>
        <!-- Banner dan Search -->
        <div class="relative">
          <banner />
          <!-- <div class="bg-gray-100 px-4">
            <div class="relative w-full -translate-y-1/2">
              <search @search="handleSearch" />
            </div>
          </div> -->
        </div>
  
        <!-- Konten Utama -->
        <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6  pt-10">
          <!-- Judul Halaman -->
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Riwayat Baca Anda</h1>
  
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center">
            <Loading title="Memuat riwayat baca..." />
          </div>
  
          <!-- Empty State -->
          <div v-else-if="riwayat.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Belum ada riwayat baca</h3>
            <p class="mt-1 text-gray-500">Dokumen yang Anda baca akan muncul di sini.</p>
            <div class="mt-6">
              <NuxtLink 
                to="/koleksi" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Jelajahi Koleksi
              </NuxtLink>
            </div>
          </div>
  
          <!-- Daftar Riwayat -->
          <div v-else class="space-y-4">
  <div 
    v-for="item in riwayat" 
    :key="item.id" 
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <div class="p-6">
      <!-- Header with read date -->
      <div class="flex items-center space-x-2 mb-1">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Dibaca pada: {{ formatDate(item.created_at) }}
        </span>
      </div>

      <!-- Title (as link to detail) -->
      <NuxtLink 
        :to="`/detail/${item.koleksi.id}`" 
        class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
      >
        {{ item.koleksi.judul }}
      </NuxtLink>
      
      <!-- Author -->
      <p class="mt-1 text-sm text-gray-600 line-clamp-3">
        <span class="font-semibold">Oleh: </span>
        {{ item.koleksi.penulis }}
      </p>

      <!-- Category and Document Type -->
      <div class="mt-2 flex items-center space-x-2">
        <span 
          v-if="item.koleksi.kategoriBangKom?.nama"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ item.koleksi.kategoriBangKom.nama }}
        </span>
        <span 
          v-if="item.koleksi.jenisDokumen?.nama"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          {{ item.koleksi.jenisDokumen.nama }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex items-center space-x-3">
        <!-- Read Button -->
        <button
          @click="viewPdf(item.koleksi.id)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Baca Ulang
        </button>

        <!-- Delete Button -->
        <button 
          @click="deleteRiwayat(item.id)"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Hapus dari riwayat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Hapus
        </button>
      </div>
    </div>
  </div>

  <!-- Clear All Button -->
  <div class="pt-4">
    <button
      @click="clearAllHistory"
      class="w-full py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
    >
      Hapus Semua Riwayat
    </button>
  </div>
</div>
        </main>
      </NuxtLayout>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  // State
  const riwayat = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const perPage = 10;
  const totalItems = ref(0);
  const totalPages = ref(1);
  
  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Ambil data riwayat baca
  const fetchRiwayat = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/auth/login');
      return;
    }
  
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await $fetch('http://127.0.0.1:8000/api/riwayat-baca', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        params: {
          page: currentPage.value,
          per_page: perPage
        }
      });
  
      if (response.success) {
        riwayat.value = response.data;
        totalItems.value = response.total || response.data.length;
        totalPages.value = Math.ceil(totalItems.value / perPage);
      } else {
        error.value = 'Gagal memuat riwayat baca';
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      error.value = 'Terjadi kesalahan saat memuat riwayat baca';
      
      // Jika error 401 (unauthorized), logout user
      if (err.response?.status === 401) {
        await authStore.logout();
        router.push('/auth/login');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Hapus satu riwayat
  const deleteRiwayat = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat ini?')) return;
  
    try {
      await $fetch(`http://127.0.0.1:8000/api/riwayat-baca/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
  
      // Refresh data setelah menghapus
      await fetchRiwayat();
    } catch (err) {
      console.error('Error deleting history:', err);
      alert('Gagal menghapus riwayat');
    }
  };
  
  // Hapus semua riwayat
  const clearAllHistory = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua riwayat baca?')) return;
  
    try {
      await $fetch('http://127.0.0.1:8000/api/riwayat-baca/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
  
      // Refresh data setelah menghapus
      await fetchRiwayat();
    } catch (err) {
      console.error('Error clearing history:', err);
      alert('Gagal menghapus semua riwayat');
    }
  };
  
  // Ganti halaman
  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchRiwayat();
  };
  
  // Buka PDF
  const viewPdf = async (id) => {
  const authStore = useAuthStore();
  const { $toast } = useNuxtApp(); // Untuk toast notification (opsional)
  
  try {
    // Check authentication
    if (!authStore.isLoggedIn) {
      $toast.error('Anda harus login terlebih dahulu');
      return navigateTo('/auth/login');
    }

    // Verify token
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      await authStore.logout();
      return navigateTo('/auth/login');
    }

    // 1. Trigger endpoint untuk menambahkan ke riwayat
    try {
      await axios.get(`http://127.0.0.1:8000/api/koleksi/koleksi/${id}/pdf`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        responseType: 'arraybuffer'
      });
    } catch (error) {
      console.error('Gagal menambahkan ke riwayat:', error);
    }

    // 2. Buka tab baru dengan PDF Viewer
    const timestamp = Date.now();
    const pdfViewerUrl = `/detail/pdf-view/${id}?t=${timestamp}`;
    
    window.open(pdfViewerUrl, '_blank');
    
  } catch (error) {
    console.error('Error:', error);
    $toast.error('Terjadi kesalahan saat membuka dokumen');
  }
};
  
  // Handle pencarian
  const handleSearch = (query) => {
    router.push({ path: '/koleksi', query: { search: query } });
  };
  
  // Jalankan saat komponen dimuat
  onMounted(async () => {
    await authStore.init();
    
    if (!authStore.isLoggedIn) {
      router.push('/auth/login');
    } else {
      fetchRiwayat();
    }
  });
  </script>