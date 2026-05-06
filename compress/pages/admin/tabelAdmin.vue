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
                  placeholder="Cari nama atau email admin..."
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
        
                <!-- Add Admin Button -->
                <button
                  @click="showRegisterModal = true"
                  class="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Admin
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
                <th class="px-6 py-4 text-center w-12 text-[11px] font-bold text-gray-400 uppercase tracking-widest">No.</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identitas Admin</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kontak & Email</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Peran / Role</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Terdaftar Sejak</th>
              </tr>
            </thead>
            
            <!-- Table Body -->
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-blue-50/30 transition-colors duration-200 group">
                <td class="px-6 py-5 whitespace-nowrap text-center w-12">
                  <div class="text-[11px] font-black text-gray-300 tracking-tighter italic">#{{ index + 1 }}</div>
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
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p class="text-sm text-gray-500 font-medium">Data admin tidak ditemukan</p>
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
  
    <!-- Register Admin Modal -->
    <div v-if="showRegisterModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-modalIn">
        <!-- Modal Header -->
        <div class="relative overflow-hidden bg-blue-600 px-8 py-8">
          <div class="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-blue-500 opacity-20"></div>
          <div class="relative z-10 flex items-center space-x-4">
            <div class="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-white tracking-tight">Tambah Admin Baru</h3>
              <p class="text-blue-100 text-xs font-medium mt-0.5">Daftarkan pengelola sistem repositori</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <form @submit.prevent="handleRegisterAdmin" class="space-y-6">
            <div v-if="!registrationSuccess">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" for="name">Nama Lengkap</label>
                  <input
                    v-model="registerForm.name"
                    type="text"
                    id="name"
                    required
                    class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    placeholder="Contoh: Admin Pusdiklat"
                  >
                </div>
                
                <div class="space-y-2">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" for="email">Alamat Email</label>
                  <input
                    v-model="registerForm.email"
                    type="email"
                    id="email"
                    required
                    class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    placeholder="email@bps.go.id"
                  >
                </div>
              </div>
              
              <div v-if="registerError" class="mt-4 p-4 bg-red-50 rounded-2xl flex items-center space-x-3">
                <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs font-bold text-red-600">{{ registerError }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div v-else class="animate-fadeIn">
              <div class="bg-green-50 rounded-3xl p-6 border border-green-100">
                <div class="flex items-center space-x-4 mb-6">
                  <div class="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-green-800 uppercase tracking-tight">Pendaftaran Berhasil</h4>
                    <p class="text-[10px] text-green-600 font-bold uppercase tracking-widest">Detail login telah dibuat otomatis</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Akun</span>
                      <button @click="copyRegistrationDetails" class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Salin Detail</button>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 font-medium">Email:</span>
                        <span class="text-xs text-gray-900 font-bold">{{ registrationData.email }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 font-medium">Password:</span>
                        <span class="text-xs text-blue-600 font-black tracking-widest">{{ registrationData.password }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-[10px] text-gray-400 font-medium text-center italic">Berikan informasi di atas kepada admin yang baru didaftarkan.</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row-reverse gap-3">
              <button
                v-if="!registrationSuccess"
                type="submit"
                :disabled="registerLoading"
                class="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
              >
                <span v-if="!registerLoading">Daftarkan Admin</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              </button>
              <button
                type="button"
                @click="closeRegisterModal"
                class="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all duration-300"
              >
                {{ registrationSuccess ? 'Selesai' : 'Batal' }}
              </button>
            </div>
          </form>
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