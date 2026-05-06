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
        <div class="p-8">
          <!-- Welcome Section -->
          <div class="relative overflow-hidden bg-blue-600 rounded-3xl p-8 mb-8 shadow-xl shadow-blue-100">
            <!-- Decor -->
            <div class="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500 opacity-20"></div>
            <div class="absolute bottom-0 left-0 -ml-12 -mb-12 h-40 w-40 rounded-full bg-blue-700 opacity-20"></div>
            
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-black text-white tracking-tight">Selamat Datang, {{ authStore.user?.name }}!</h1>
                <p class="text-blue-100 mt-2 font-medium">Panel Kontrol Utama - {{ formatDate(lastLogin) }}</p>
              </div>
              <div class="hidden lg:block">
                <div class="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 3-Grid Layout System -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left + Center Column (2/3) -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Stats Overview -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                  title="Total Pengguna Aktif" 
                  :value="dashboardStats.counts.total_users_active" 
                  icon="users"
                  color="green"
                  @click="navigateTo('/admin/tabelUsers')"
                />
                
                <StatCard 
                  title="Total Koleksi Elektronik" 
                  :value="dashboardStats.counts.total_koleksi_elektronik" 
                  icon="book"
                  color="blue"
                  @click="navigateTo('/admin/tabelKoleksi')"
                />
                
                <StatCard 
                  title="Total Koleksi Aktif" 
                  :value="dashboardStats.counts.total_koleksi_aktif" 
                  icon="star"
                  color="indigo"
                  @click="navigateTo('/admin/tabelKoleksi')"
                />
                
                <StatCard 
                  title="Total Koleksi Inactive" 
                  :value="dashboardStats.counts.total_koleksi_inactive" 
                  icon="document"
                  color="red"
                  @click="navigateTo('/admin/tabelKoleksi')"
                />
              </div>

              <!-- Best Collections Table -->
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 tracking-tight">Koleksi Terbaik (Best)</h2>
                    <p class="text-xs text-gray-400 mt-1 font-medium">Koleksi pilihan yang ditampilkan di halaman utama</p>
                  </div>
                  <NuxtLink 
                    to="/admin/tabelKoleksi" 
                    class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    Lihat Semua
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="bg-gray-50/50">
                        <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Judul & Penulis</th>
                        <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tahun</th>
                        <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="loadingBest">
                        <td colspan="3" class="px-6 py-12 text-center">
                          <div class="flex flex-col items-center justify-center">
                            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                            <p class="text-sm text-gray-400 font-medium tracking-wide">Memuat data terbaik...</p>
                          </div>
                        </td>
                      </tr>
                      <tr v-else-if="bestCollections.length === 0">
                        <td colspan="3" class="px-6 py-12 text-center">
                          <div class="flex flex-col items-center justify-center opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-2.286 6.857a2 2 0 01-1.857 1.143H8.143a2 2 0 01-1.857-1.143L4 13" />
                            </svg>
                            <p class="text-sm text-gray-500 font-medium">Belum ada koleksi yang ditandai sebagai Best</p>
                          </div>
                        </td>
                      </tr>
                      <tr 
                        v-for="item in bestCollections" 
                        :key="item.id" 
                        class="hover:bg-blue-50/30 transition-colors duration-200"
                      >
                        <td class="px-6 py-5">
                          <div class="max-w-[300px]">
                            <div class="text-sm font-bold text-gray-900 truncate mb-0.5" :title="item.judul">
                              {{ item.judul }}
                            </div>
                            <div class="text-xs text-gray-400 font-medium truncate" :title="item.penulis">
                              Oleh: {{ item.penulis }}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap">
                          <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">{{ item.tahun_terbit }}</span>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-right">
                          <div class="flex justify-end items-center space-x-2">
                            <button
                              @click="viewContent(item)"
                              class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group"
                              :title="item.youtube_link ? 'Lihat Video' : 'Lihat PDF'"
                            >
                              <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            
                            <NuxtLink 
                              :to="`/admin/${item.id}`" 
                              class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group"
                            >
                              <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            <!-- Right Column (1/3) -->
            <div class="space-y-8">
              <!-- Today's Visitors Table -->
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
                <div class="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h2 class="text-lg font-bold text-gray-900 tracking-tight">Pengunjung Hari Ini</h2>
                  <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase">{{ dashboardStats.today_visitors.length }} Orang</span>
                </div>
                <div class="overflow-y-auto max-h-[400px]">
                  <table class="min-w-full">
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="loadingStats && dashboardStats.today_visitors.length === 0">
                        <td class="px-6 py-8 text-center text-gray-400 text-xs font-medium">Memuat data...</td>
                      </tr>
                      <tr v-else-if="dashboardStats.today_visitors.length === 0">
                        <td class="px-6 py-12 text-center">
                          <p class="text-xs text-gray-400 font-medium">Belum ada pengunjung hari ini</p>
                        </td>
                      </tr>
                      <tr v-for="visitor in dashboardStats.today_visitors" :key="visitor.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                          <div class="flex items-center space-x-3">
                            <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                              {{ visitor.user?.name?.charAt(0).toUpperCase() || '?' }}
                            </div>
                            <div>
                              <div class="text-xs font-bold text-gray-900">{{ visitor.user?.name }}</div>
                              <div class="text-[10px] text-gray-400 font-medium">{{ formatTime(visitor.created_at) }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                          <span class="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-wider">{{ visitor.tujuan }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="p-4 border-t border-gray-50 bg-gray-50/20 text-center">
                  <NuxtLink to="/admin/buku-tamu" class="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Lihat Semua Riwayat</NuxtLink>
                </div>
              </div>

              <!-- Most Read Collections -->
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
                <div class="p-6 border-b border-gray-50 bg-gray-50/30">
                  <h2 class="text-lg font-bold text-gray-900 tracking-tight">Koleksi Terpopuler</h2>
                  <p class="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest">Berdasarkan Jumlah Baca</p>
                </div>
                <div class="p-6 space-y-6">
                  <div v-if="loadingStats && dashboardStats.most_read.length === 0" class="py-4 text-center text-gray-400 text-xs font-medium">
                    Memuat data...
                  </div>
                  <div v-else-if="dashboardStats.most_read.length === 0" class="py-8 text-center text-gray-400 text-xs font-medium">
                    Belum ada data baca
                  </div>
                  <div v-for="(item, index) in dashboardStats.most_read" :key="item.id" class="flex items-start space-x-4 group cursor-pointer" @click="viewContent(item)">
                    <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{{ item.judul }}</h3>
                      <div class="flex items-center mt-1 space-x-3">
                        <div class="flex items-center text-[10px] text-gray-400 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {{ item.views }}x Baca
                        </div>
                        <div class="h-1 w-1 rounded-full bg-gray-300"></div>
                        <div class="text-[10px] text-gray-400 font-medium">{{ item.tahun_terbit }}</div>
                      </div>
                      <!-- Tiny Progress Bar -->
                      <div class="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-600 rounded-full" :style="{ width: (item.views / (dashboardStats.most_read[0]?.views || 1) * 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-4 border-t border-gray-50 bg-gray-50/20 text-center">
                  <NuxtLink to="/admin/tabelKoleksi?sort_by=popular" class="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Analisis Lengkap</NuxtLink>
                </div>
              </div>
            </div>

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
const { public: { apiBaseUrl } } = useRuntimeConfig();
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
const loadingStats = ref(false)

const dashboardStats = ref({
  counts: {
    total_users_active: 0,
    total_koleksi_elektronik: 0,
    total_koleksi_aktif: 0,
    total_koleksi_inactive: 0
  },
  today_visitors: [],
  most_read: []
})

const bestCollections = ref([])

const formatDate = (date) => {
  if (!date) return '-'
  
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  
  try {
    return new Date(date).toLocaleString('id-ID', options)
  } catch {
    return date
  }
}

const formatTime = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
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
      fetchDashboardStats(),
      fetchBestCollections(),
    ])
  } catch (error) {
    console.error('Failed to initialize dashboard:', error)
    // alert('Gagal memuat data dashboard')
  }
})

// Fetch functions menggunakan $fetch dengan auth headers
const fetchDashboardStats = async () => {
  if (!authStore.isAuthenticated) return

  loadingStats.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/api/admin/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    if (res.status) {
      dashboardStats.value = res.data
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    if (error.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    loadingStats.value = false
  }
}

const fetchBestCollections = async () => {
  if (!authStore.isAuthenticated) return

  loadingBest.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/api/koleksi/best-collections`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    bestCollections.value = res.data || []
  } catch (error) {
    console.error('Error fetching best collections:', error)
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
    await $fetch(`${apiBaseUrl}/api/koleksi/${itemToUnmark.value}/unmark-as-best`, {
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
    showToast('error', 'Gagal menghapus dari best collection')
  } finally {
    itemToUnmark.value = null
  }
}
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

/* Custom scrollbar for visitor list */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>