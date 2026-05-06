<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
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
          <slot />
        
          <div>
            <!-- Top Action Bar (Search, Sort, Filter) -->
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
                  placeholder="Cari nama atau email user..."
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                  @input="applyFilters"
                />
              </div>
        
              <!-- Sort & Actions Group -->
              <div class="flex flex-wrap items-center gap-3">
                <!-- Sort -->
                <div class="relative min-w-[160px]">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </div>
                  <select
                    v-model="sortBy"
                    class="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer font-bold text-xs text-gray-600 uppercase tracking-wider transition-all duration-300"
                    @change="applyFilters"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="nama-asc">Nama (A-Z)</option>
                    <option value="nama-desc">Nama (Z-A)</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
        
                <!-- Link to inactive users -->
                <NuxtLink 
                  to="/admin/tabelUsersInactive"
                  class="inline-flex items-center px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-100 text-gray-600 transition-all duration-300 group"
                >
                  <svg class="w-4 h-4 mr-2 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span class="text-xs font-bold uppercase tracking-wider">User Tidak Aktif</span>
                </NuxtLink>
              </div>
            </div>
      
            <!-- Second Action Bar (Bulk Actions) -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <!-- Selected Items Info -->
              <div v-if="selectedItems.length > 0" class="flex items-center px-4 py-2 bg-red-600 rounded-xl shadow-lg shadow-red-200">
                <span class="text-xs font-black text-white uppercase tracking-widest">{{ selectedItems.length }} Terpilih</span>
              </div>
              <div v-else class="flex items-center px-4 py-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pilih user untuk aksi massal</span>
              </div>
              
              <!-- Bulk Actions (right-aligned) -->
              <div class="flex gap-2">
                <button
                  @click="deleteSelectedUsers"
                  :disabled="selectedItems.length === 0"
                  class="inline-flex items-center px-6 py-2.5 bg-white border border-gray-100 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 hover:border-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus Massal
                </button>
              </div>
            </div>
      
            <!-- Table Container -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <!-- Responsive Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <!-- Table Head -->
                  <thead>
                    <tr class="bg-gray-50/50">
                      <th class="px-6 py-4 text-center w-12">
                        <input
                          type="checkbox"
                          v-model="selectAll"
                          @change="toggleSelectAll"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
                        />
                      </th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identitas User</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kontak & Email</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Peran / Role</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bergabung</th>
                      <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20">Aksi</th>
                    </tr>
                  </thead>
                  
                  <!-- Table Body -->
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-blue-50/30 transition-colors duration-200 group">
                      <td class="px-6 py-5 whitespace-nowrap text-center w-12">
                        <input
                          type="checkbox"
                          :value="user.id"
                          v-model="selectedItems"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
                        />
                      </td>
                      <td class="px-6 py-5">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ user.name }}</div>
                            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #{{ user.id }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap">
                        <div class="flex items-center text-sm font-medium text-gray-600">
                          <svg class="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ user.email }}
                        </div>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap">
                        <select
                          :value="originalRoles[user.id] || user.role_id"
                          @change="confirmRoleChange(user, $event)"
                          :disabled="user.id === authStore.user?.id || updatingRoles[user.id]"
                          class="text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-50 appearance-none border-none transition-all duration-300 min-w-[120px]"
                          :class="{
                            'bg-blue-50 text-blue-700': (originalRoles[user.id] || user.role_id) === 1,
                            'bg-green-50 text-green-700': (originalRoles[user.id] || user.role_id) === 2,
                            'cursor-pointer hover:bg-opacity-80': user.id !== authStore.user?.id,
                            'cursor-not-allowed opacity-60': user.id === authStore.user?.id || updatingRoles[user.id]
                          }"
                        >
                          <option 
                            v-for="role in availableRoles" 
                            :key="role.id" 
                            :value="role.id"
                            class="bg-white text-gray-900"
                          >
                            {{ role.name }}
                          </option>
                        </select>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap">
                        <div class="text-[11px] font-bold text-gray-400 tracking-tight">
                          {{ formatDate(user.created_at) }}
                        </div>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap text-right">
                        <div class="flex justify-end items-center">
                          <button
                            @click="deleteUser($event, user.id)"
                            :disabled="user.role_id === 1"
                            class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all duration-300 group/btn disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Hapus User"
                          >
                            <svg class="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredUsers.length === 0">
                      <td colspan="6" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center justify-center opacity-40">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <p class="text-sm text-gray-500 font-medium">Data user tidak ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-modalIn">
        <div class="p-8">
          <div class="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 text-center mb-2">Hapus User</h3>
          <p class="text-sm text-gray-500 text-center font-medium">Apakah Anda yakin ingin menghapus user ini? Tindakan ini akan menonaktifkan akun user dan menghapus data terkait.</p>
        </div>
        <div class="p-6 bg-gray-50/50 flex flex-col sm:flex-row-reverse gap-3">
          <button 
            @click="confirmDelete"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            <span v-if="!isDeleting">Ya, Hapus</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelDelete"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3.5 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-modalIn">
        <div class="p-8">
          <div class="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 text-center mb-2">Hapus User Terpilih</h3>
          <p class="text-sm text-gray-500 text-center font-medium">Apakah Anda yakin ingin menghapus <span class="text-red-600 font-bold">{{ selectedItems.length }}</span> user yang dipilih? Tindakan ini akan menonaktifkan akun mereka.</p>
        </div>
        <div class="p-6 bg-gray-50/50 flex flex-col sm:flex-row-reverse gap-3">
          <button 
            @click="confirmBulkDelete"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            <span v-if="!isDeleting">Ya, Hapus Semua</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelBulkDelete"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3.5 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Role Change Confirmation Modal -->
    <div v-if="showRoleChangeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-modalIn">
        <div class="p-8">
          <div class="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 text-center mb-2">Ubah Peran User</h3>
          <div class="bg-blue-50 rounded-2xl p-4 mb-4">
            <p class="text-xs text-blue-700 text-center font-bold leading-relaxed">
              Mengubah peran <span class="text-blue-900">{{ userForRoleChange?.name }}</span> dari 
              <span class="px-2 py-0.5 bg-white rounded-lg mx-1 shadow-sm">{{ getRoleName(userForRoleChange?.originalRole) }}</span> ke 
              <span class="px-2 py-0.5 bg-blue-600 text-white rounded-lg mx-1 shadow-sm">{{ getRoleName(userForRoleChange?.newRoleId) }}</span>
            </p>
          </div>
          <p class="text-[11px] text-gray-400 text-center font-bold uppercase tracking-widest">Apakah Anda yakin?</p>
        </div>
        <div class="p-6 bg-gray-50/50 flex flex-col sm:flex-row-reverse gap-3">
          <button 
            @click="updateUserRole"
            :disabled="updatingRole"
            class="flex-1 px-6 py-3.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            <span v-if="!updatingRole">Ya, Ubah Peran</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelRoleChange"
            :disabled="updatingRole"
            class="flex-1 px-6 py-3.5 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'

// Panggil di dalam setup
const config = useRuntimeConfig()
// Import statements
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo } from '#imports'
import { $fetch } from 'ofetch'
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import { NuxtLink } from '#components'
import { useToast } from '~/composables/useToast'
const { showToast } = useToast()
const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Kelola User - Sistem Repositori Pusdiklat BPS'
})

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('Manajemen User')

// Di parent component (Layout Admin)
const showSidebar = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// State for users
const users = ref([])
const availableRoles = ref([])
const isLoading = ref(false)
const errorMessage = ref("")
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const lastPage = ref(1)
const nextPageUrl = ref(null)
const prevPageUrl = ref(null)

// State for filters
const searchQuery = ref("")
const sortBy = ref("terbaru")

// State for selection
const selectedItems = ref([])
const selectAll = ref(false)

// State for modals
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isDeleting = ref(false)
const userToDelete = ref(null)
const showRoleChangeModal = ref(false)
const userForRoleChange = ref(null)
const updatingRole = ref(false)
const originalRoles = ref({})
const updatingRoles = ref({})

// Authentication check menggunakan unified auth
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }

  if (!authStore.canAccessAdmin) {
    showToast('error', 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.')
    await navigateTo('/')
    return false
  }

  try {
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      showToast('warning', 'Sesi telah berakhir, silakan login kembali')
      await navigateTo('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    showToast('error', 'Terjadi kesalahan saat verifikasi sesi')
    await authStore.logout()
    await navigateTo('/auth/login')
    return false
  }
}

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Fetch users dengan menyimpan role asli
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(`${apiBaseUrl}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.status) {
      // Filter hanya user aktif (role_id = 2 dan deleted_at null)
      users.value = response.data.filter(user => 
        user.role_id === 2 && user.deleted_at === null
      );
      // Simpan role asli untuk setiap user
      response.data.forEach(user => {
        originalRoles.value[user.id] = user.role_id;
      });
      total.value = users.value.length;
    } else {
      errorMessage.value = response.message || 'Gagal memuat data user';
      showToast('error', errorMessage.value);
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    errorMessage.value = error.data?.message || 'Gagal memuat data user';
    showToast('error', errorMessage.value);
    if (error.status === 401) {
      await authStore.logout();
      await navigateTo('/auth/login');
    }
  } finally {
    isLoading.value = false;
  }
};

// Fetch available roles
const fetchRoles = async () => {
  try {
    const response = await $fetch(`${apiBaseUrl}/api/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.status) {
      availableRoles.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    showToast('error', 'Gagal memuat daftar role')
  }
}

// Filtered users based on search query
const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  switch(sortBy.value) {
    case 'terbaru':
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'terlama':
      return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    case 'nama-asc':
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    case 'nama-desc':
      return filtered.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return filtered
  }
})

// Get role name by ID
const getRoleName = (roleId) => {
  const role = availableRoles.value.find(r => r.id === roleId)
  return role ? role.name : 'Unknown'
}

// Fungsi confirmRoleChange yang diperbaiki
const confirmRoleChange = (user, event) => {
  if (user.id === authStore.user?.id) {
    showToast('warning', 'Anda tidak dapat mengubah role sendiri');
    event.target.value = originalRoles.value[user.id]; // Kembalikan ke nilai asli
    return;
  }

  const newRoleId = parseInt(event.target.value);
  
  // Simpan data untuk konfirmasi
  userForRoleChange.value = {
    ...user,
    newRoleId: newRoleId,
    originalRole: originalRoles.value[user.id] // Gunakan nilai asli dari originalRoles
  };
  
  // Kembalikan select ke nilai semula
  event.target.value = originalRoles.value[user.id];
  
  showRoleChangeModal.value = true;
};

// Cancel role change
const cancelRoleChange = () => {
  showRoleChangeModal.value = false;
  userForRoleChange.value = null;
};

// Update user role after confirmation
const updateUserRole = async () => {
  if (!userForRoleChange.value) return;

  updatingRole.value = true;
  try {
    const response = await $fetch(`${apiBaseUrl}/api/users/${userForRoleChange.value.id}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role_id: userForRoleChange.value.newRoleId
      })
    });
    
    if (response.status) {
      // Update role di frontend hanya setelah sukses
      const userIndex = users.value.findIndex(u => u.id === userForRoleChange.value.id);
      if (userIndex !== -1) {
        users.value[userIndex].role_id = userForRoleChange.value.newRoleId;
        // Update juga originalRoles
        originalRoles.value[userForRoleChange.value.id] = userForRoleChange.value.newRoleId;
      }
      showToast('success', 'Role user berhasil diperbarui');
    } else {
      showToast('error', response.message || 'Gagal mengubah role');
    }
  } catch (error) {
    console.error("Failed to update user role:", error);
    showToast('error', error.data?.message || 'Gagal mengupdate role user');
  } finally {
    updatingRole.value = false;
    showRoleChangeModal.value = false;
    userForRoleChange.value = null;
  }
};

// Delete user functions (soft delete)
const deleteUser = (event, id) => {
  userToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  isDeleting.value = true
  try {
    const response = await $fetch(`http://127.0.0.1:8000/api/users/${userToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.status) {
      await fetchUsers()
      showToast('success', 'User berhasil dinonaktifkan')
    } else {
      showToast('error', response.message || 'Gagal menonaktifkan user')
    }
  } catch (error) {
    console.error("Failed to delete user:", error)
    showToast('error', error.data?.message || 'Gagal menonaktifkan user')
    if (error.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
    userToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

// Bulk delete functions (soft delete)
const deleteSelectedUsers = () => {
  if (selectedItems.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDelete = async () => {
  if (selectedItems.value.length === 0) return

  isDeleting.value = true
  try {
    const response = await $fetch(`${apiBaseUrl}/api/users/bulk-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_ids: selectedItems.value
      })
    })
    
    if (response.status) {
      await fetchUsers()
      selectedItems.value = []
      selectAll.value = false
      showToast('success', `${selectedItems.length} user berhasil dinonaktifkan`)
    } else {
      showToast('error', response.message || 'Gagal menonaktifkan user yang dipilih')
    }
  } catch (error) {
    console.error("Failed to delete selected users:", error)
    showToast('error', error.data?.message || 'Gagal menonaktifkan user yang dipilih')
    if (error.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isDeleting.value = false
    showBulkDeleteModal.value = false
  }
}

const cancelBulkDelete = () => {
  showBulkDeleteModal.value = false
}

// Watch for changes in the users data to reset selectAll
watch(users, () => {
  selectAll.value = false
})

// Toggle select all items
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = filteredUsers.value.map(user => user.id)
  } else {
    selectedItems.value = []
  }
}

// Apply filters
const applyFilters = () => {
  currentPage.value = 1
  fetchUsers()
}

// Pengecekan awal saat komponen dimount
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return

  try {
    await fetchRoles()
    await fetchUsers()
  } catch (error) {
    console.error('Failed to initialize user table:', error)
    showToast('error', 'Gagal memuat data user')
  }
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col .justify-end {
    justify-content: flex-end;
  }
}

select {
  min-width: 100px;
  transition: all 0.2s ease;
}
</style>