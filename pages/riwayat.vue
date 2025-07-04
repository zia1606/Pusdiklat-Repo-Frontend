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
          Dibaca pada: {{ formatDate(item.updated_at) }}
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
  @click="confirmDelete(item.id)"
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

  <!-- Load More/Show Less Links -->
  <div class="text-center pt-4">
    <div v-if="hasMoreItems">
      <a 
        href="#" 
        @click.prevent="loadMore"
        class="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
      >
        Tampilkan Lebih Banyak
      </a>
    </div>
    <div v-else-if="visibleItemCount > itemsPerPage">
      <a 
        href="#" 
        @click.prevent="showLess"
        class="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
      >
        Tampilkan Lebih Sedikit
      </a>
    </div>
  </div>

  <!-- Clear All Button -->
  <div class="pt-4">
    <button
  @click="confirmClearAll"
  class="w-full py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
>
  Hapus Semua Riwayat
</button>
  </div>
</div>
        </main>
      </NuxtLayout>

      <!-- Single Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelDelete"></div>
    </div>
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Riwayat</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus riwayat baca ini?</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button 
          @click="deleteRiwayat"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Hapus
        </button>
        <button 
          @click="cancelDelete"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Clear All Confirmation Modal -->
<div v-if="showClearAllModal" class="fixed inset-0 overflow-y-auto z-50">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelClearAll"></div>
    </div>
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Semua Riwayat</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus semua riwayat baca? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button 
          @click="clearAllHistory"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Hapus Semua
        </button>
        <button 
          @click="cancelClearAll"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Toast Component -->
<!-- <Toast /> -->

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
  import { useRouter } from 'vue-router';
  import { useToast } from '~/composables/useToast'

  useHead({
  title: 'Riwayat Baca - Sistem Repositori Pusdiklat BPS'
})

const { showToast } = useToast()

// Modal states
const showDeleteModal = ref(false)
const showClearAllModal = ref(false)
const itemToDelete = ref(null)

  const authStore = useUnifiedAuthStore()
  const router = useRouter();
  
  // State
  const riwayat = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const perPage = 10;
  const totalItems = ref(0);
  const totalPages = ref(1);

  const itemsPerPage = ref(10);
const visibleItemCount = ref(10);
  
  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Ambil data riwayat baca

// Update fetchRiwayat to reset visible count when new data loads
const fetchRiwayat = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login');
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await $fetch('https://pusdiklat-repo-backend.zeabur.app/api/riwayat-baca', {
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
      visibleItemCount.value = itemsPerPage.value; // Reset visible count
    } else {
      error.value = 'Gagal memuat riwayat baca';
    }
  } catch (err) {
    console.error('Error fetching history:', err);
    error.value = 'Terjadi kesalahan saat memuat riwayat baca';
    
    if (err.response?.status === 401) {
      await authStore.logout();
      await navigateTo('/auth/login');
    }
  } finally {
    isLoading.value = false;
  }
};
  
const visibleItems = computed(() => {
  return riwayat.value.slice(0, visibleItemCount.value);
});

const hasMoreItems = computed(() => {
  return visibleItemCount.value < riwayat.value.length;
});

// Methods
const loadMore = () => {
  visibleItemCount.value += itemsPerPage.value;
};

const showLess = () => {
  visibleItemCount.value = itemsPerPage.value;
  // Optional: scroll to top after showing less items
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })};

  // Hapus satu riwayat
  // Single delete functions
const confirmDelete = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

const deleteRiwayat = async () => {
  showDeleteModal.value = false
  
  try {
    await $fetch(`https://pusdiklat-repo-backend.zeabur.app/api/riwayat-baca/${itemToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    await fetchRiwayat()
    showToast('success', 'Riwayat berhasil dihapus')
  } catch (err) {
    console.error('Error deleting history:', err)
    showToast('error', 'Gagal menghapus riwayat')
  } finally {
    itemToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// Clear all functions
const confirmClearAll = () => {
  showClearAllModal.value = true
}

const clearAllHistory = async () => {
  showClearAllModal.value = false
  
  try {
    await $fetch('https://pusdiklat-repo-backend.zeabur.app/api/riwayat-baca/clear', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    await fetchRiwayat()
    showToast('success', 'Semua riwayat berhasil dihapus')
  } catch (err) {
    console.error('Error clearing history:', err)
    showToast('error', 'Gagal menghapus semua riwayat')
  }
}

const cancelClearAll = () => {
  showClearAllModal.value = false
}
  
  // Ganti halaman
  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchRiwayat();
  };
  
  // Buka PDF
  const viewPdf = async (id) => {
  try {
    if (!authStore.isAuthenticated) {
      showToast('error', 'Anda harus login terlebih dahulu');
      return navigateTo('/auth/login');
    }

    const timestamp = Date.now();
    const pdfViewerUrl = `/detail/pdf-view/${id}?t=${timestamp}`;
    
    try {
      await axios.get(`https://pusdiklat-repo-backend.zeabur.app/api/koleksi/koleksi/${id}/pdf`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        responseType: 'arraybuffer'
      });
    } catch (error) {
      console.error('Gagal menambahkan ke riwayat:', error);
    }
    
    window.open(pdfViewerUrl, '_blank');
    
  } catch (error) {
    console.error('Error:', error);
    showToast('error', 'Terjadi kesalahan saat membuka dokumen');
  }
};
  
  // Handle pencarian
  const handleSearch = (query) => {
    router.push({ path: '/koleksi', query: { search: query } });
  };
  
  onMounted(async () => {
  await authStore.initializeAuth();
  
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login');
  } else {
    await fetchRiwayat();
  }
});
  </script>