<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Sidebar - Tampil di lg, tersembunyi di sm/md -->
      <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <HeaderAdmin 
          :pageTitle="pageTitle" 
          @toggle-sidebar="toggleSidebar" 
        />
  
        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto pt-16">
          <div class="p-6">
            <!-- Welcome Section -->
            <!-- <div class="bg-white rounded-xl shadow p-6 mb-6">
              <h1 class="text-2xl font-bold text-gray-800">Selamat Datang, Admin</h1>
              <p class="text-gray-600">Terakhir login: {{ formatDate(lastLogin) }} WIB</p>
            </div> -->
            
            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Total Koleksi" 
                :value="stats.total_koleksi" 
                icon="book"
                color="blue"
                @click="navigateTo('/admin/tabelKoleksi')"
              />
              
              <StatCard 
                title="Best Collection" 
                :value="stats.best_collections" 
                icon="star"
                color="yellow"
                @click="navigateTo('/admin/dashboard')"
              />
              
              <!-- Ganti Total Kategori Bangkom dengan Total Pengguna -->
  <StatCard 
    title="Total Pengguna" 
    :value="stats.total_users" 
    icon="users"
    color="green"
    @click="navigateTo('/admin/manajemen-user')"
  />
              
              <!-- Ganti Total Jenis Dokumen dengan Total Kunjungan -->
  <StatCard 
    title="Total Baca" 
    :value="stats.total_views" 
    icon="eye"
    color="indigo"
    @click="navigateTo('/admin/tabelKoleksi?sort_by=popular')"
  />
            </div>
  
            <!-- Best Collections Table -->
            <div class="bg-white rounded-xl shadow overflow-hidden mb-6">
              <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-800">Best Collections</h2>
                <NuxtLink 
                  to="/admin/tabelKoleksi" 
                  class="flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Lihat Selengkapnya
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="loadingBest">
                      <td colspan="4" class="px-6 py-4 text-center">
                        <div class="flex justify-center">
                          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="bestCollections.length === 0">
                      <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada best collections
                      </td>
                    </tr>
                    <tr 
                      v-for="item in bestCollections" 
                      :key="item.id" 
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4 max-w-xs truncate">{{ item.judul }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">{{ item.penulis }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">{{ item.tahun_terbit }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                        >
                          Best Collection
                          <button 
                            @click.stop="unmarkAsBest(item.id)"
                            class="ml-1 text-red-600 hover:text-red-900"
                            title="Remove from Best Collection"
                          >
                            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
  
            <!-- sintaks di word -->
            
          </div>
  
          
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Sidebar from '@/components/Admin/Sidebar.vue';
  import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
  import StatCard from '@/components/Admin/StatCard.vue';
  
  const router = useRouter();
  const authStore = useAdminAuthStore();
  
  // Di parent component (Layout Admin)
  const showSidebar = ref(false);
  
  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
  };
  
  const lastLogin = ref(new Date());
  const loadingBest = ref(false);
  const loadingKategori = ref(false);
  const loadingJenis = ref(false);
  
  const stats = ref({
    total_koleksi: 0,
    best_collections: 0,
    total_users: 0,
    total_views: 0
  });
  
  const bestCollections = ref([]);
  const kategoriDistribution = ref([]);
  const jenisDistribution = ref([]);
  
  
  const formatDate = (date) => {
    if (!date) return '-'
    
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    try {
      return new Date(date).toLocaleString('id-ID', options)
    } catch {
      return date
    }
  }
  
  // Authentication check
  const checkAuth = async () => {
    await authStore.init();
    
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return false;
    }
  
    try {
      const isValid = await authStore.verifyToken();
      if (!isValid) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Terjadi kesalahan saat verifikasi sesi');
      await authStore.logout();
      router.push('/admin/auth/login');
      return false;
    }
  };
  
  // Pengecekan awal saat komponen dimount
  onMounted(async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
  
    try {
      await Promise.all([
        fetchStats(),
        fetchBestCollections(),
        fetchKategoriDistribution(),
        fetchJenisDistribution(),
        fetchMostFavorited()
      ]);
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      alert('Gagal memuat data dashboard');
    }
    initCharts();
  });
  
  
  // Fetch functions using $fetch with auth headers
  const fetchStats = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }
  
    try {
      const [koleksiRes, bestRes, usersRes, viewsRes] = await Promise.all([
        $fetch('http://127.0.0.1:8000/api/koleksi', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        }),
        $fetch('http://127.0.0.1:8000/api/koleksi/best-collections', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        }),
        // Tambahkan endpoint untuk mengambil jumlah user
      $fetch('http://127.0.0.1:8000/api/users/count', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
        }),
        // Tambahkan endpoint untuk mengambil total views
      $fetch('http://127.0.0.1:8000/api/koleksi/total-views', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
        })
      ]);
  
      stats.value = {
        total_koleksi: koleksiRes.meta?.total || 0,
        best_collections: bestRes.data?.length || 0,
        total_users: usersRes.data,
        total_views: viewsRes.data || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      }
      throw error;
    }
  };
  
  const fetchBestCollections = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }
  
    loadingBest.value = true;
    try {
      const res = await $fetch('http://127.0.0.1:8000/api/koleksi/best-collections', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      bestCollections.value = res.data || [];
      stats.value.best_collections = bestCollections.value.length;
    } catch (error) {
      console.error('Error fetching best collections:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal memuat best collections');
      }
    } finally {
      loadingBest.value = false;
    }
  };
  
  const fetchKategoriDistribution = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/authlogin');
      return;
    }
  
    loadingKategori.value = true;
    try {
      const res = await $fetch('http://127.0.0.1:8000/api/koleksi/distribusi-kategori', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      kategoriDistribution.value = res.data || [];
      
      if (stats.value.total_koleksi === 0) {
        stats.value.total_koleksi = kategoriDistribution.value.reduce((sum, cat) => sum + cat.total, 0);
      }
    } catch (error) {
      console.error('Error fetching kategori distribution:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal memuat distribusi kategori');
      }
    } finally {
      loadingKategori.value = false;
    }
  };
  
  const fetchJenisDistribution = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }
  
    loadingJenis.value = true;
    try {
      const res = await $fetch('http://127.0.0.1:8000/api/koleksi/distribusi-jenis', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      jenisDistribution.value = res.data || [];
      
      if (stats.value.total_koleksi === 0) {
        stats.value.total_koleksi = jenisDistribution.value.reduce((sum, jenis) => sum + jenis.total, 0);
      }
    } catch (error) {
      console.error('Error fetching jenis distribution:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal memuat distribusi jenis dokumen');
      }
    } finally {
      loadingJenis.value = false;
    }
  };
  
  const unmarkAsBest = async (id) => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }
  
    if (confirm('Apakah Anda yakin ingin menghapus koleksi ini dari Best Collections?')) {
      try {
        await $fetch(`http://127.0.0.1:8000/api/koleksi/${id}/unmark-as-best`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        await fetchBestCollections();
        alert('Koleksi berhasil dihapus dari best collection');
      } catch (error) {
        console.error('Error unmarking as best collection:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          router.push('/admin/auth/login');
        } else {
          alert('Gagal menghapus dari best collection');
        }
      }
    }
  };
  
  // Add to your refs
  const loadingFavorited = ref(false);
  const mostFavorited = ref([]);
  
  // Add this function
  const fetchMostFavorited = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }
  
    loadingFavorited.value = true;
    try {
      const res = await $fetch('http://127.0.0.1:8000/api/koleksi/most-favorited', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      mostFavorited.value = res.data || [];
    } catch (error) {
      console.error('Error fetching most favorited collections:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal memuat koleksi terfavorit');
      }
    } finally {
      loadingFavorited.value = false;
    }
  };
  
  
  //Charts
  import Chart from 'chart.js/auto';
  
  const kategoriChart = ref(null);
  const jenisChart = ref(null);
  
  // Warna untuk chart
  const chartColors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
  ];
  
  const getChartColor = (index) => {
    return chartColors[index % chartColors.length];
  };
  
  // Fungsi untuk membuat chart
  const initCharts = () => {
    if (kategoriDistribution.value.length > 0) {
      createChart(
        kategoriChart.value,
        'pie',
        kategoriDistribution.value.map(cat => cat.nama),
        kategoriDistribution.value.map(cat => cat.total),
        'Distribusi Kategori'
      );
    }
  
    if (jenisDistribution.value.length > 0) {
      createChart(
        jenisChart.value,
        'doughnut',
        jenisDistribution.value.map(item => item.nama),
        jenisDistribution.value.map(item => item.total),
        'Distribusi Jenis Dokumen'
      );
    }
  };
  
  const createChart = (canvas, type, labels, data, title) => {
    return new Chart(canvas, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: labels.map((_, index) => getChartColor(index)),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: type === 'doughnut' ? '60%' : undefined,
      }
    });
  };
  
  // Watch perubahan data untuk update chart
  watch([kategoriDistribution, jenisDistribution], () => {
    initCharts();
  });
  
  
  </script>
  
  <style scoped>
  /* Responsive sidebar behavior */
  @media (min-width: 1024px) {
    .lg\:translate-x-0 {
      transform: translateX(0);
    }
  }
  
  /* Truncate text for long titles */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  </style>