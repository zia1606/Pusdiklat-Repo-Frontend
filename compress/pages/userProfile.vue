<template>
  <div class="bg-soft-white min-h-screen">
    <NuxtLayout>
      <!-- Header Section -->
      <section class="bg-gradient-to-b from-blue-900 to-blue-800 pt-20 pb-10">
        <div class="w-full mx-auto px-4 lg:px-20">
          <div class="text-center">
            <h1 class="text-yellow-400 font-bold text-4xl lg:text-5xl leading-tight mb-2">Profil Pengguna</h1>
            <p class="text-white text-lg">Kelola informasi profil dan preferensi akun Anda</p>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="w-full mx-auto px-4 lg:px-20 py-10">
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="relative">
                <img 
                  :src="user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`" 
                  alt="User Profile"
                  class="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg">
                <button 
                  @click="openAvatarUpload"
                  class="absolute bottom-0 right-0 bg-yellow-400 text-blue-800 p-2 rounded-full hover:bg-yellow-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <div class="text-center md:text-left">
                <h2 class="text-2xl font-bold">{{ user.name }}</h2>
                <p class="text-blue-100">{{ user.email }}</p>
                <p class="mt-2 text-sm" v-if="user.role">{{ user.role }}</p>
                <div class="mt-3 flex justify-center md:justify-start gap-2">
                  <button 
                    @click="showEditModal = true"
                    class="bg-white text-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Edit Profil
                  </button>
                  <button 
                    @click="showPasswordModal = true"
                    class="bg-transparent border border-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Ubah Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Personal Information -->
              <div class="bg-gray-50 p-5 rounded-lg">
                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  Informasi Pribadi
                </h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-sm text-gray-500">Nama Lengkap</p>
                    <p class="font-medium">{{ user.name || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium">{{ user.email || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Nomor Telepon</p>
                    <p class="font-medium">{{ user.phone || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Alamat</p>
                    <p class="font-medium">{{ user.address || '-' }}</p>
                  </div>
                </div>
              </div>

              <!-- Account Information -->
              <div class="bg-gray-50 p-5 rounded-lg">
                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  Informasi Akun
                </h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-sm text-gray-500">Status Akun</p>
                    <p class="font-medium">
                      <span :class="{'bg-green-100 text-green-800': user.status === 'Aktif', 'bg-red-100 text-red-800': user.status !== 'Aktif'}" 
                            class="px-2 py-1 rounded-full text-xs font-semibold">
                        {{ user.status || '-' }}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Bergabung Pada</p>
                    <p class="font-medium">{{ user.joinDate || '-' }}</p>
                  </div>
                  <!-- <div>
                    <p class="text-sm text-gray-500">Terakhir Login</p>
                    <p class="font-medium">{{ user.lastLogin || '-' }}</p>
                  </div> -->
                </div>
              </div>

              <!-- Activity Summary -->
              <!-- <div class="bg-gray-50 p-5 rounded-lg md:col-span-2">
                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  Ringkasan Aktivitas
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p class="text-2xl font-bold text-blue-800">{{ user.stats.documents || 0 }}</p>
                    <p class="text-sm text-gray-600">Dokumen Dibaca</p>
                  </div>
                  <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p class="text-2xl font-bold text-blue-800">{{ user.stats.favorites || 0 }}</p>
                    <p class="text-sm text-gray-600">Favorit</p>
                  </div>
                  <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p class="text-2xl font-bold text-blue-800">{{ user.stats.downloads || 0 }}</p>
                    <p class="text-sm text-gray-600">Unduhan</p>
                  </div>
                  <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p class="text-2xl font-bold text-blue-800">{{ user.stats.comments || 0 }}</p>
                    <p class="text-sm text-gray-600">Komentar</p>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Edit Profil
            </h3>
            
            <form @submit.prevent="updateProfile">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="name">Nama Lengkap</label>
                <div class="relative">
                  <input 
                    v-model="editForm.name" 
                    type="text" 
                    id="name" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  >
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="email">Email</label>
                <div class="relative">
                  <input 
                    v-model="editForm.email" 
                    type="email" 
                    id="email" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email"
                    disabled
                  >
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="phone">Nomor Telepon</label>
                <div class="relative">
                  <input 
                    v-model="editForm.phone" 
                    type="tel" 
                    id="phone" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nomor telepon"
                  >
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="address">Alamat</label>
                <div class="relative">
                  <textarea 
                    v-model="editForm.address" 
                    id="address" 
                    rows="3"
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat"
                  ></textarea>
                </div>
              </div>

              <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  @click="showEditModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Password Modal -->
  <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Ubah Password
            </h3>
            
            <form @submit.prevent="changePassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="currentPassword">Password Saat Ini</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.currentPassword" 
                    type="password" 
                    id="currentPassword" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan password saat ini"
                  >
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="newPassword">Password Baru</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.newPassword" 
                    type="password" 
                    id="newPassword" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan password baru"
                  >
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="confirmPassword">Konfirmasi Password Baru</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    type="password" 
                    id="confirmPassword" 
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Konfirmasi password baru"
                  >
                </div>
              </div>

              <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Ubah Password
                </button>
                <button
                  type="button"
                  @click="showPasswordModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

useHead({
  title: 'Profil Pengguna - Sistem Repositori Pusdiklat BPS'
})

const authStore = useAuthStore()

// Data pengguna
const user = ref({
  name: authStore.user?.name || 'Fauziah Filda Updated',
  email: authStore.user?.email || 'user1@gmail.com',
  phone: '081234567890',
  address: 'Jl. Contoh No. 456',
  role: 'Pengguna',
  status: 'Aktif',
  joinDate: '8 Agustus 2025',
//   lastLogin: '1 jam yang lalu',
  avatar: authStore.getUserAvatar || null,
  stats: {
    documents: 24,
    favorites: 8,
    downloads: 12,
    comments: 5
  }
})

// Form edit profil
const editForm = ref({
  name: user.value.name,
  email: user.value.email,
  phone: user.value.phone,
  address: user.value.address
})

// Form ubah password
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// State untuk modal
const showEditModal = ref(false)
const showPasswordModal = ref(false)

// Fungsi untuk membuka upload avatar
const openAvatarUpload = () => {
  // Implementasi upload avatar
  console.log('Membuka dialog upload avatar')
}

// Fungsi untuk update profil
const updateProfile = () => {
  // Update data user dengan data dari form
  user.value = {
    ...user.value,
    ...editForm.value
  }
  
  // Tutup modal
  showEditModal.value = false
  
  // Tampilkan notifikasi
  console.log('Profil berhasil diupdate')
}

// Fungsi untuk ubah password
const changePassword = () => {
  // Validasi password
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    console.log('Password baru dan konfirmasi password tidak cocok')
    return
  }
  
  // Proses ubah password
  console.log('Password berhasil diubah')
  
  // Reset form dan tutup modal
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswordModal.value = false
}
</script>

<style scoped>
/* Tambahan styling jika diperlukan */
</style>