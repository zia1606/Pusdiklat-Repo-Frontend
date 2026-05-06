<template>
    <div class="bg-gray-100">
      <NuxtLayout>
        <!-- Banner dan Search -->
        <div class="relative">
          <banner />
          <div class="bg-gray-100 px-4">
            <div class="relative w-full -translate-y-1/2">
              <search @search="handleSearch" />
            </div>
          </div>
        </div>
  
        <!-- Konten Utama -->
        <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <!-- Judul Halaman -->
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Koleksi Tersimpan Anda</h1>
  
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center">
            <Loading title="Memuat koleksi tersimpan..." />
          </div>
  
          <!-- Empty State -->
          <div v-else-if="simpan.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Belum ada koleksi tersimpan</h3>
            <p class="mt-1 text-gray-500">Simpan koleksi untuk melihatnya di sini.</p>
            <div class="mt-6">
              <NuxtLink 
                to="/koleksi" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Jelajahi Koleksi
              </NuxtLink>
            </div>
          </div>
  
          <!-- Daftar Simpan -->
          <div v-else class="space-y-4">
            <div v-for="item in simpan" :key="item.id" class="bg-white shadow rounded-lg overflow-hidden">
              <div class="p-6">
                <!-- Header dengan tanggal ditambahkan -->
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-xs text-gray-500">
                      Disimpan pada: {{ formatDate(item.created_at) }}
                    </span>
                  </div>
                  <button 
                    @click="removeFromSimpan(item.id)"
                    class="text-gray-400 hover:text-red-500"
                    title="Hapus dari simpan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
  
                <!-- Konten Koleksi -->
                <div class="mt-2 flex items-start">
                  <!-- Thumbnail PDF -->
                  <div class="flex-shrink-0 mr-4">
                    <div class="h-20 w-16 bg-green-50 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>
  
                  <!-- Detail Koleksi -->
                  <div class="flex-1 min-w-0">
                    <NuxtLink 
                      :to="`/detail/${item.koleksi.id}`" 
                      class="text-lg font-medium text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {{ item.koleksi.judul }}
                    </NuxtLink>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ item.koleksi.penulis }} • {{ item.koleksi.tahun_terbit }}
                    </p>
                    <div class="mt-2 flex items-center">
                      <!-- <span v-if="item.koleksi.kategori_bang_kom_id" class="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        Kategori: {{ item.koleksi.kategori_bang_kom_id }}
                      </span>
                      <span v-if="item.koleksi.jenis_dokumen_id" class="ml-2 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-green-100 text-green-800">
                        Jenis: {{ item.koleksi.jenis_dokumen_id }}
                      </span> -->
                      <span v-if="item.koleksi.is_best_collection" class="ml-2 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-red-100 text-red-800">
                        BEST
                      </span>
                    </div>
                  </div>
  
                  <!-- Tombol Detail -->
                  <div class="ml-4 flex-shrink-0">
                    <NuxtLink
                      :to="`/detail/${item.koleksi.id}`"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lihat Detail
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Pagination -->
            <div class="flex justify-between items-center mt-6">
              <button
                @click="clearAllSimpan"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hapus Semua Simpan
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
  import { useToast } from '~/composables/useToast';
  
  const authStore = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  
  // State
  const simpan = ref([]);
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
  
  // Ambil data simpan
  const fetchSimpan = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/auth/login');
      return;
    }
  
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await $fetch('http://127.0.0.1:8000/api/simpan-koleksi', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        params: {
          page: currentPage.value,
          per_page: perPage
        }
      });
  
      if (response.success) {
        simpan.value = response.data;
        totalItems.value = response.total || response.data.length;
        totalPages.value = Math.ceil(totalItems.value / perPage);
      } else {
        error.value = 'Gagal memuat koleksi tersimpan';
      }
    } catch (err) {
      console.error('Error fetching saved items:', err);
      error.value = 'Terjadi kesalahan saat memuat koleksi tersimpan';
      
      // Jika error 401 (unauthorized), logout user
      if (err.response?.status === 401) {
        await authStore.logout();
        router.push('/auth/login');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Hapus dari simpan
  const removeFromSimpan = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dari simpan?')) return;
  
    try {
      await $fetch(`http://127.0.0.1:8000/api/simpan-koleksi/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
  
      // Refresh data setelah menghapus
      await fetchSimpan();
      toast.success('Koleksi dihapus dari simpan');
    } catch (err) {
      console.error('Error removing saved item:', err);
      toast.error('Gagal menghapus dari simpan');
    }
  };
  
  // Hapus semua simpan
  const clearAllSimpan = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua simpan?')) return;
  
    try {
      // Anda perlu membuat endpoint khusus untuk ini di backend
      // Contoh: DELETE /api/simpan-koleksi/clear-all
      for (const item of simpan.value) {
        await $fetch(`http://127.0.0.1:8000/api/simpan-koleksi/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
      }
  
      // Refresh data setelah menghapus
      await fetchSimpan();
      toast.success('Semua koleksi dihapus dari simpan');
    } catch (err) {
      console.error('Error clearing saved items:', err);
      toast.error('Gagal menghapus semua simpan');
    }
  };
  
  // Ganti halaman
  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchSimpan();
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
      fetchSimpan();
    }
  });
  </script>