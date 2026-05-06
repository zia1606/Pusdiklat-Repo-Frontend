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
            <div class="flex flex-col lg:flex-row gap-4 mb-8">
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
                  placeholder="Cari nama atau email user tidak aktif..."
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
        
                <!-- Link to Active Users -->
                <NuxtLink
                  to="/admin/tabelUsers"
                  class="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Aktif
                </NuxtLink>
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
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identitas User</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kontak & Email</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Peran / Role</th>
                      <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Waktu Non-aktif</th>
                      <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                    </tr>
                  </thead>
                  
                  <!-- Table Body -->
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-blue-50/30 transition-colors duration-200 group">
                      <td class="px-6 py-5">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xs group-hover:scale-110 transition-transform">
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
                        <span class="text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-2"
                          :class="{
                            'bg-blue-50 text-blue-700': user.role_id === 1,
                            'bg-green-50 text-green-700': user.role_id === 2
                          }"
                        >
                          {{ getRoleName(user.role_id) }}
                        </span>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap">
                        <div class="text-[11px] font-bold text-gray-400 tracking-tight">
                          {{ formatDate(user.deleted_at) }}
                        </div>
                      </td>
                      <td class="px-6 py-5 whitespace-nowrap text-right">
                        <div class="flex justify-end items-center">
                          <button
                            @click="restoreUser($event, user.id)"
                            class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-100 transition-all duration-300 group/btn"
                            title="Aktifkan Kembali"
                          >
                            <svg class="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredUsers.length === 0">
                      <td colspan="5" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center justify-center opacity-40">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <p class="text-sm text-gray-500 font-medium">Tidak ada data user tidak aktif</p>
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
  
    <!-- Restore Confirmation Modal -->
    <div v-if="showRestoreModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelRestore"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Aktifkan Kembali User</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Apakah Anda yakin ingin mengaktifkan kembali user ini? Semua data terkait akan dipulihkan.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmRestore"
              :disabled="isRestoring"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <span v-if="!isRestoring">Aktifkan</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            </button>
            <button 
              @click="cancelRestore"
              :disabled="isRestoring"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script setup>
// Import statements
import { ref, onMounted, computed } from 'vue'
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
  title: 'User Tidak Aktif - Sistem Repositori Pusdiklat BPS'
})

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('User Tidak Aktif')

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

// State for filters
const searchQuery = ref("")
const sortBy = ref("terbaru")

// State for modals
const showRestoreModal = ref(false)
const isRestoring = ref(false)
const userToRestore = ref(null)

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
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Fetch inactive users
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
      // Filter hanya user tidak aktif (role_id = 2 dan deleted_at tidak null)
      users.value = response.data.filter(user => 
        user.role_id === 2 && user.deleted_at !== null
      );
    } else {
      errorMessage.value = response.message || 'Gagal memuat data user tidak aktif';
      showToast('error', errorMessage.value);
    }
  } catch (error) {
    console.error('Failed to fetch inactive users:', error);
    errorMessage.value = error.data?.message || 'Gagal memuat data user tidak aktif';
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
      return filtered.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at))
    case 'terlama':
      return filtered.sort((a, b) => new Date(a.deleted_at) - new Date(b.deleted_at))
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

// Restore user functions
const restoreUser = (event, id) => {
  userToRestore.value = id
  showRestoreModal.value = true
}

const confirmRestore = async () => {
  if (!userToRestore.value) return
  
  isRestoring.value = true
  try {
    const response = await $fetch(`http://127.0.0.1:8000/api/users/${userToRestore.value}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.status) {
      await fetchUsers()
      showToast('success', 'User berhasil diaktifkan kembali')
    } else {
      showToast('error', response.message || 'Gagal mengaktifkan user')
    }
  } catch (error) {
    console.error("Failed to restore user:", error)
    showToast('error', error.data?.message || 'Gagal mengaktifkan user')
    if (error.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isRestoring.value = false
    showRestoreModal.value = false
    userToRestore.value = null
  }
}

const cancelRestore = () => {
  showRestoreModal.value = false
  userToRestore.value = null
}

// Apply filters
const applyFilters = () => {
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
    console.error('Failed to initialize inactive users table:', error)
    showToast('error', 'Gagal memuat data user tidak aktif')
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