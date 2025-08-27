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
            <div class="flex flex-col sm:flex-row gap-4 mb-4 w-full">
              <!-- Search (left-aligned, full width on mobile) -->
              <div class="w-full sm:w-auto sm:flex-1">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari berdasarkan nama atau email..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @input="applyFilters"
                  />
                  <svg
                    class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
      
              <!-- Sort and Filter (right-aligned on all screens) -->
              <div class="flex gap-4 justify-end">
                <!-- Sorting Dropdown -->
                <div class="relative">
                  <select
                    v-model="sortBy"
                    class="appearance-none cursor-pointer hover:bg-gray-50 shadow-sm pl-3 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                    @change="applyFilters"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="nama-asc">Nama (A-Z)</option>
                    <option value="nama-desc">Nama (Z-A)</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <!-- Link to active users -->
                <NuxtLink 
                  to="/admin/tabelUser3"
                  class="flex items-center px-3 bg-blue-600 border border-gray-200 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
                >
                  <span class="hidden sm:inline">User Aktif</span>
                </NuxtLink>
              </div>
            </div>
      
            <!-- Table Container -->
            <div class="bg-white rounded-xl shadow overflow-hidden">
              <!-- Responsive Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full shadow-sm border border-gray-300 divide-y divide-gray-200">
                  <!-- Table Head -->
                  <thead class="bg-gray-100">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Nama
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Role
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Tanggal Dinonaktifkan
                      </th>
                      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  <!-- Table Body -->
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 w-1/4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      </td>
                      <td class="px-6 py-4 w-1/4">
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-xs leading-5 font-semibold rounded-full px-3 py-1"
                          :class="{
                            'bg-blue-100 text-blue-800': user.role_id === 1,
                            'bg-green-100 text-green-800': user.role_id === 2
                          }"
                        >
                          {{ getRoleName(user.role_id) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{ formatDate(user.deleted_at) }}</div>
                      </td>
                      <td class="text-gray-600 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex justify-end space-x-3">
                          <!-- Restore Button -->
                          <button
                            @click="restoreUser($event, user.id)"
                            class="w-4 mr-2 transform hover:text-green-500 hover:scale-110 cursor-pointer"
                            title="Restore"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredUsers.length === 0">
                      <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data user tidak aktif ditemukan
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