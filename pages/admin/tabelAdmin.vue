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
  
          <!-- Add Admin Button -->
          <button
            @click="showRegisterModal = true"
            class="flex items-center px-3 bg-blue-600 border border-gray-200 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1 mt-0.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span class="sm:hidden">Tambah</span>
            <span class="hidden sm:inline">Tambah Admin</span>
          </button>
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
                <th scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  No.
                </th>
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
                  Tanggal Daftar
                </th>
              </tr>
            </thead>
            
            <!-- Table Body -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-2 py-4 whitespace-nowrap text-center w-8">
                  <div class="text-sm text-gray-500">{{ index + 1 }}</div>
                </td>
                <td class="px-6 py-4 w-1/4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                </td>
                <td class="px-6 py-4 w-1/4">
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="originalRoles[user.id] || user.role_id"
                    @change="confirmRoleChange(user, $event)"
                    :disabled="user.id === authStore.user?.id || updatingRoles[user.id]"
                    class="text-xs leading-5 font-semibold rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                    :class="{
                      'bg-blue-100 text-blue-800': (originalRoles[user.id] || user.role_id) === 1,
                      'bg-green-100 text-green-800': (originalRoles[user.id] || user.role_id) === 2,
                      'cursor-pointer hover:bg-opacity-80': user.id !== authStore.user?.id,
                      'cursor-not-allowed': user.id === authStore.user?.id || updatingRoles[user.id]
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
                    <option v-if="updatingRoles[user.id]" disabled>Memperbarui...</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(user.created_at) }}</div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data admin ditemukan
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
  
    <!-- Register Admin Modal -->
    <div v-if="showRegisterModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeRegisterModal"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Tambah Admin Baru
                </h3>
                
                <form @submit.prevent="handleRegisterAdmin">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="name">Nama</label>
                    <input
                      v-model="registerForm.name"
                      type="text"
                      id="name"
                      required
                      class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama admin"
                    >
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="email text-left">Email</label>
                    <input
                      v-model="registerForm.email"
                      type="email"
                      id="email"
                      required
                      class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan email admin"
                    >
                  </div>
                  
                  <!-- Success Message -->
                  <div v-if="registrationSuccess" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-semibold">Admin berhasil didaftarkan!</p>
                        <p class="text-sm mt-1">Detail login telah dikirim ke email:</p>
                        <p class="text-sm font-mono">{{ registrationData.email }}</p>
                        <p class="text-sm mt-1">Password sementara:</p>
                        <p class="text-sm font-mono">{{ registrationData.password }}</p>
                      </div>
                      <button
                        @click="copyRegistrationDetails"
                        class="ml-2 p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-200"
                        title="Salin detail"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="registerError" class="text-red-500 text-sm mb-4">
                    {{ registerError }}
                  </div>

                  <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      v-if="!registrationSuccess"
                      type="submit"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      :disabled="registerLoading"
                    >
                      <span v-if="registerLoading">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </span>
                      <span v-else>
                        Daftarkan Admin
                      </span>
                    </button>
                    <button
                      type="button"
                      @click="closeRegisterModal"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {{ registrationSuccess ? 'Tutup' : 'Batal' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Change Confirmation Modal -->
    <div v-if="showRoleChangeModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelRoleChange"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Ubah Role User</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Anda akan mengubah role <span class="font-semibold">{{ userForRoleChange?.name }}</span> 
                    dari <span class="font-semibold">{{ getRoleName(userForRoleChange?.originalRole) }}</span> 
                    menjadi <span class="font-semibold">{{ getRoleName(userForRoleChange?.newRoleId) }}</span>.
                  </p>
                  <p class="text-sm text-gray-500 mt-2">Apakah Anda yakin ingin melanjutkan?</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="updateUserRole"
              :disabled="updatingRole"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <span v-if="!updatingRole">Ya, Ubah</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            </button>
            <button 
              @click="cancelRoleChange"
              :disabled="updatingRole"
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
  title: 'Kelola Admin - Sistem Repositori Pusdiklat BPS'
})

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('Manajemen Admin')

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

// State for modals
const showRegisterModal = ref(false)
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const registerLoading = ref(false)
const registerError = ref('')
const registrationSuccess = ref(false)
const registrationData = ref({
  email: '',
  password: ''
})
const showRoleChangeModal = ref(false)
const userForRoleChange = ref(null)
const updatingRole = ref(false)
const originalRoles = ref({})
const updatingRoles = ref({})

// Copy registration details to clipboard
const copyRegistrationDetails = () => {
  const text = `Email: ${registrationData.value.email}\nPassword: ${registrationData.value.password}`
  navigator.clipboard.writeText(text)
  showToast('success', 'Detail login berhasil disalin')
}

const closeRegisterModal = () => {
  showRegisterModal.value = false
  registrationSuccess.value = false
  registerForm.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }
  registerError.value = ''
}

const handleRegisterAdmin = async () => {
  try {
    registerLoading.value = true
    registerError.value = ''
    
    const response = await $fetch(`${apiBaseUrl}/api/register/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      },
      body: {
        name: registerForm.value.name,
        email: registerForm.value.email
      }
    })

    if (response.status) {
      registrationSuccess.value = true
      registrationData.value = {
        email: response.data.email,
        password: response.data.password
      }
      await fetchUsers() // Refresh user list
      showToast('success', 'Admin berhasil didaftarkan')
    } else {
      registerError.value = response.message || 'Gagal menambahkan admin'
      showToast('error', registerError.value)
    }
  } catch (error) {
    console.error('Error registering admin:', error)
    registerError.value = error.data?.message || 'Terjadi kesalahan saat menambahkan admin'
    showToast('error', registerError.value)
  } finally {
    registerLoading.value = false
  }
}

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
      // Filter hanya admin (role_id = 1)
      users.value = response.data.filter(user => user.role_id === 1);
      // Simpan role asli untuk setiap user
      response.data.forEach(user => {
        originalRoles.value[user.id] = user.role_id;
      });
      total.value = users.value.length;
    } else {
      errorMessage.value = response.message || 'Gagal memuat data admin';
      showToast('error', errorMessage.value);
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    errorMessage.value = error.data?.message || 'Gagal memuat data admin';
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
      showToast('success', 'Role admin berhasil diperbarui');
    } else {
      showToast('error', response.message || 'Gagal mengubah role');
    }
  } catch (error) {
    console.error("Failed to update user role:", error);
    showToast('error', error.data?.message || 'Gagal mengupdate role admin');
  } finally {
    updatingRole.value = false;
    showRoleChangeModal.value = false;
    userForRoleChange.value = null;
  }
};

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
    console.error('Failed to initialize admin table:', error)
    showToast('error', 'Gagal memuat data admin')
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