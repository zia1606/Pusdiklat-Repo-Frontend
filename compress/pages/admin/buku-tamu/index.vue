<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <HeaderAdmin 
        pageTitle="Manajemen Buku Tamu" 
        @toggle-sidebar="toggleSidebar" 
      />
  
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <!-- Top Action Bar -->
          <div class="flex flex-col lg:flex-row gap-4 mb-6">
            <!-- Search -->
            <div class="flex-1 relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama pengunjung atau tujuan..."
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                @input="handleSearch"
              />
            </div>
      
            <!-- Actions Group -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Generate QR Button -->
              <NuxtLink 
                to="/admin/buku-tamu/qr"
                class="inline-flex items-center px-6 py-3.5 bg-blue-900 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-800 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span class="text-xs font-bold uppercase tracking-wider">Tampilkan QR Scanner</span>
              </NuxtLink>
            </div>
          </div>
    
          <!-- Table Container -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div v-if="isLoading" class="p-20 flex flex-col items-center justify-center space-y-4">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p class="text-gray-500 font-medium">Memuat data kunjungan...</p>
            </div>

            <div v-else-if="bukuTamus.length === 0" class="p-20 text-center">
              <div class="flex flex-col items-center justify-center opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p class="text-sm text-gray-500 font-medium">Belum ada data kunjungan buku tamu</p>
              </div>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-50/50">
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pengunjung</th>
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tujuan</th>
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Keterangan</th>
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Waktu Kunjungan</th>
                    <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20">Aksi</th>
                  </tr>
                </thead>
                
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="item in bukuTamus" :key="item.id" class="hover:bg-blue-50/30 transition-colors duration-200 group">
                    <td class="px-6 py-5">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-blue-900 font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                          {{ item.user?.name?.charAt(0).toUpperCase() || '?' }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ item.user?.name || 'User Terhapus' }}</div>
                          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ item.user?.email || '-' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" 
                        :class="{
                          'bg-green-100 text-green-700': item.tujuan === 'membaca',
                          'bg-blue-100 text-blue-700': item.tujuan === 'bekerja/belajar',
                          'bg-purple-100 text-purple-700': item.tujuan === 'diskusi',
                          'bg-gray-100 text-gray-700': item.tujuan === 'lain-lain'
                        }">
                        {{ item.tujuan }}
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <div class="text-sm text-gray-600 max-w-xs truncate" :title="item.tujuan_lain">
                        {{ item.tujuan_lain || '-' }}
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="text-[11px] font-bold text-gray-400 tracking-tight">
                        {{ formatDate(item.created_at) }}
                        <div class="text-[9px] mt-0.5">{{ formatTime(item.created_at) }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex justify-end items-center space-x-2">
                        <button
                          @click="openEditModal(item)"
                          class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300"
                          title="Edit"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(item.id)"
                          class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg transition-all duration-300"
                          title="Hapus"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </p>
              <div class="flex space-x-2">
                <button 
                  @click="changePage(currentPage - 1)" 
                  :disabled="currentPage === 1"
                  class="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 transition-all"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  @click="changePage(currentPage + 1)" 
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 transition-all"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  
    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="p-8">
          <div class="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 text-center mb-2">Hapus Data Kunjungan</h3>
          <p class="text-sm text-gray-500 text-center font-medium">Apakah Anda yakin ingin menghapus data buku tamu ini? (Soft delete)</p>
        </div>
        <div class="p-6 bg-gray-50/50 flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 px-6 py-3 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Batal</button>
          <button @click="deleteItem" class="flex-1 px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Ya, Hapus</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="p-8">
          <h3 class="text-xl font-black text-gray-900 mb-6">Edit Data Kunjungan</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tujuan</label>
              <select v-model="editForm.tujuan" class="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all">
                <option value="membaca">Membaca</option>
                <option value="bekerja/belajar">Bekerja/Belajar</option>
                <option value="diskusi">Diskusi</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>
            <div v-if="editForm.tujuan === 'lain-lain'">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Keterangan</label>
              <textarea v-model="editForm.tujuan_lain" rows="3" class="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"></textarea>
            </div>
          </div>
        </div>
        <div class="p-6 bg-gray-50/50 flex gap-3">
          <button @click="showEditModal = false" class="flex-1 px-6 py-3 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Batal</button>
          <button @click="updateItem" class="flex-1 px-6 py-3 bg-blue-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all">Simpan</button>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { useToast } from '~/composables/useToast'

const { public: { apiBaseUrl } } = useRuntimeConfig()
const authStore = useUnifiedAuthStore()
const { showToast } = useToast()

// Page Meta
definePageMeta({
  middleware: 'admin'
})

// State
const showSidebar = ref(false)
const isLoading = ref(false)
const searchQuery = ref("")
const bukuTamus = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// Modal State
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const itemActionId = ref(null)
const editForm = reactive({
  tujuan: "",
  tujuan_lain: ""
})

// Methods
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const fetchBukuTamus = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await $fetch(`${apiBaseUrl}/api/admin/buku-tamu`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      params: { 
        page,
        search: searchQuery.value
      }
    })
    
    if (response.success) {
      bukuTamus.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
    }
  } catch (err) {
    console.error('Error fetching guest book:', err)
    showToast('error', 'Gagal memuat data buku tamu.')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchBukuTamus()
}

const changePage = (page) => {
  fetchBukuTamus(page)
}

const confirmDelete = (id) => {
  itemActionId.value = id
  showDeleteModal.value = true
}

const deleteItem = async () => {
  try {
    await $fetch(`${apiBaseUrl}/api/admin/buku-tamu/${itemActionId.value}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    showToast('success', 'Data berhasil dihapus.')
    showDeleteModal.value = false
    fetchBukuTamus(currentPage.value)
  } catch (err) {
    showToast('error', 'Gagal menghapus data.')
  }
}

const openEditModal = (item) => {
  itemActionId.value = item.id
  editForm.tujuan = item.tujuan
  editForm.tujuan_lain = item.tujuan_lain
  showEditModal.value = true
}

const updateItem = async () => {
  try {
    await $fetch(`${apiBaseUrl}/api/admin/buku-tamu/${itemActionId.value}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: editForm
    })
    showToast('success', 'Data berhasil diperbarui.')
    showEditModal.value = false
    fetchBukuTamus(currentPage.value)
  } catch (err) {
    showToast('error', 'Gagal memperbarui data.')
  }
}

onMounted(() => {
  fetchBukuTamus()
})

useHead({
  title: 'Manajemen Buku Tamu - Admin'
})
</script>
