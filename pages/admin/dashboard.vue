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
        <div class="p-10">
          <!-- Welcome Section -->
          <div class="bg-white rounded-xl shadow p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ authStore.user?.name }}</h1>
            <p class="text-gray-600">Dashboard Admin - {{ formatDate(lastLogin) }} WIB</p>
          </div>
          
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
            
            <StatCard 
              title="Total Pengguna" 
              :value="stats.total_users" 
              icon="users"
              color="green"
              @click="navigateTo('/admin/tabelUsers')"
            />
            
            <StatCard 
              title="Total Baca" 
              :value="stats.total_views" 
              icon="eye"
              color="indigo"
              @click="navigateTo('/admin/tabelKoleksi?sort_by=popular')"
            />
          </div>

          <!-- Best Collections Table -->
          <div class="bg-white rounded-xl shadow overflow-hidden">
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
                <thead class="bg-gray-100">
                  <tr>
                    <th scope="col" class="px-50 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th scope="col" class="px-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-10 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loadingBest">
                    <td colspan="5" class="px-6 py-4 text-center">
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
                    <td class="px-6 py-4 max-w-[240px]">
                      <div class="text-sm font-medium text-gray-900 truncate" :title="item.judul">
                        {{ item.judul }}
                      </div>
                    </td>
                    <td class="px-6 py-4 max-w-[180px]">
                      <div class="text-sm text-gray-500 truncate" :title="item.penulis">
                        {{ item.penulis }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ item.tahun_terbit }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      >
                        Best Collection
                        <button 
                          @click.stop="confirmUnmark(item.id)"
                          class="ml-1 text-red-600 hover:text-red-900"
                          title="Remove from Best Collection"
                        >
                          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    </td>
                    <td class="text-gray-600 px-10 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-3">
                        <!-- View Button -->
                        <button
                          @click="viewContent(item)"
                          class="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110 cursor-pointer"
                          :title="item.youtube_link ? 'Lihat Video' : 'Lihat PDF'"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        <!-- Edit Button -->
                        <NuxtLink :to="`/admin/${item.id}`" class="w-4 mr-2 transform hover:text-blue-500 hover:scale-110">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </NuxtLink>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Kategori Distribution Chart -->
            <!-- <div class="bg-white rounded-xl shadow p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Kategori</h3>
              <div class="relative h-64">
                <canvas ref="kategoriChart" v-if="kategoriDistribution.length > 0"></canvas>
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  Tidak ada data kategori
                </div>
              </div>
            </div> -->

            <!-- Jenis Dokumen Distribution Chart -->
            <!-- <div class="bg-white rounded-xl shadow p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Jenis Dokumen</h3>
              <div class="relative h-64">
                <canvas ref="jenisChart" v-if="jenisDistribution.length > 0"></canvas>
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  Tidak ada data jenis dokumen
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Confirmation Modal -->
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
                <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus dari Best Collection</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus koleksi ini dari Best Collections?</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="unmarkAsBest"
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

    <!-- Toast Component -->
    <!-- <Toast v-if="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" /> -->
  <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo } from '#imports'
import { $fetch } from 'ofetch'
import Chart from 'chart.js/auto'

// Import komponen yang sudah diperbaiki
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import StatCard from '@/components/Admin/StatCard.vue'
// import Toast from '@/components/Toast.vue'
// Di dashboard.vue

useHead({
  title: 'Dashboard Admin - Sistem Repositori Pusdiklat BPS'
})

import { useToast } from '~/composables/useToast'

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('Dashboard')
const showSidebar = ref(false)
// Use toast composable
const { showToast } = useToast()

// Modal and Toast states
const showDeleteModal = ref(false)
const itemToUnmark = ref(null)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const lastLogin = ref(new Date())
const loadingBest = ref(false)
const loadingKategori = ref(false)
const loadingJenis = ref(false)
const loadingFavorited = ref(false)

const stats = ref({
  total_koleksi: 0,
  best_collections: 0,
  total_users: 0,
  total_views: 0
})

const bestCollections = ref([])
const kategoriDistribution = ref([])
const jenisDistribution = ref([])
const mostFavorited = ref([])

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

// View content function
const viewContent = (item) => {
  if (item.youtube_link) {
    window.open(item.youtube_link, '_blank')
  } else if (item.dokumen_pdf) {
    viewPdf(item.id)
  } else {
    showToast('warning', 'Tidak ada konten yang tersedia untuk koleksi ini')
  }
}

// View PDF function
const viewPdf = async (id) => {
  try {
    if (!authStore.isAuthenticated) {
      alert('Anda harus login terlebih dahulu')
      return navigateTo('/auth/login')
    }

    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      await authStore.logout()
      return navigateTo('/auth/login')
    }

    navigateTo(`/admin/pdf-view2/${id}`)
  } catch (error) {
    console.error('Error:', error)
    showToast('error', 'Gagal membuka dokumen')
  }
}

// Pengecekan awal saat komponen dimount
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return

  // Tambahkan pengecekan role
  if (!authStore.isAdmin) {
    await authStore.logout()
    return navigateTo('/auth/login')
  }
  
  try {
    await Promise.all([
      fetchStats(),
      fetchBestCollections(),
      // fetchKategoriDistribution(),
      // fetchJenisDistribution(),
      // fetchMostFavorited()
    ])
  } catch (error) {
    console.error('Failed to initialize dashboard:', error)
    alert('Gagal memuat data dashboard')
  }
  initCharts()
})

// Fetch functions menggunakan $fetch dengan auth headers
const fetchStats = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    const [koleksiRes, bestRes, usersRes, viewsRes] = await Promise.all([
      $fetch('https://pusdiklat-repo-backend.zeabur.app/api/koleksi', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      }),
      $fetch('https://pusdiklat-repo-backend.zeabur.app/api/koleksi/best-collections', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      }),
      $fetch('https://pusdiklat-repo-backend.zeabur.app/api/users/count', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      }),
      $fetch('https://pusdiklat-repo-backend.zeabur.app/api/koleksi/total-views', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      })
    ])

    stats.value = {
      total_koleksi: koleksiRes.meta?.total || 0,
      best_collections: bestRes.data?.length || 0,
      total_users: usersRes.data || 0,
      total_views: viewsRes.data || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    if (error.status === 401) {
      alert('Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    }
    throw error
  }
}

const fetchBestCollections = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  loadingBest.value = true
  try {
    const res = await $fetch('https://pusdiklat-repo-backend.zeabur.app/api/koleksi/best-collections', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    bestCollections.value = res.data || []
    stats.value.best_collections = bestCollections.value.length
  } catch (error) {
    console.error('Error fetching best collections:', error)
    if (error.status === 401) {
      alert('Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      alert('Gagal memuat best collections')
    }
  } finally {
    loadingBest.value = false
  }
}

// Modal functions for unmarking as best
const confirmUnmark = (id) => {
  itemToUnmark.value = id
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToUnmark.value = null
}

const unmarkAsBest = async () => {
  showDeleteModal.value = false
  
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    await $fetch(`https://pusdiklat-repo-backend.zeabur.app/api/koleksi/${itemToUnmark.value}/unmark-as-best`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    
    await fetchBestCollections()
    showToast('success', 'Koleksi berhasil dihapus dari best collection')
  } catch (error) {
    console.error('Error unmarking as best collection:', error)
    if (error.status === 401) {
      alert('Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      showToast('error', 'Gagal menghapus dari best collection')
    }
  } finally {
    itemToUnmark.value = null
  }
}

// ... (keep the rest of the existing code)
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