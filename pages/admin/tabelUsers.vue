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
          <!-- Ganti NuxtLink dengan button -->
<button
  @click="showRegisterModal = true"
  class="flex items-center px-3 bg-blue-600 border border-gray-200 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1 mt-0.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  <span class="hidden sm:inline">Tambah Admin</span>
</button>
        </div>
      </div>
  
      <!-- User Type Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="changeTab('admin')"
          :class="{'border-b-2 border-blue-500 text-blue-600': activeTab === 'admin', 'text-gray-500 hover:text-gray-700': activeTab !== 'admin'}"
          class="py-2 px-4 font-medium text-sm focus:outline-none"
        >
          Admin
        </button>
        <button
          @click="changeTab('user')"
          :class="{'border-b-2 border-blue-500 text-blue-600': activeTab === 'user', 'text-gray-500 hover:text-gray-700': activeTab !== 'user'}"
          class="py-2 px-4 font-medium text-sm focus:outline-none"
        >
          User
        </button>
      </div>
  
      <!-- Second Action Bar (Bulk Actions) -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <!-- Selected Items Info - shown on md/lg screens (left-aligned) -->
        <div v-if="selectedItems.length > 0" class="text-md font-semibold text-gray-600 pl-2 hidden sm:block">
          {{ selectedItems.length }} terpilih
        </div>
        
        <!-- Bulk Actions (right-aligned) -->
        <div class="flex gap-2 sm:ml-auto justify-end">
          <button
            @click="deleteSelectedUsers"
            :disabled="selectedItems.length === 0"
            class="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span class="hidden sm:inline">Hapus User</span>
          </button>
        </div>
        
        <!-- Selected Items Info - shown on sm screens (appears below buttons) -->
        <div v-if="selectedItems.length > 0" class="text-md font-semibold text-gray-600 pl-2 sm:hidden">
          {{ selectedItems.length }} terpilih
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
        <!-- Add No. column -->
        <th v-if="activeTab === 'admin'" scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
          No.
        </th>
        <!-- Show checkbox column only for user tab -->
        <th v-if="activeTab === 'user'" scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
          <input
            type="checkbox"
            v-model="selectAll"
            @change="toggleSelectAll"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
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
        <!-- Show actions column only for user tab -->
        <th v-if="activeTab === 'user'" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          Actions
        </th>
      </tr>
    </thead>
    
    <!-- Table Body -->
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-gray-50">
        <!-- Show number for admin tab -->
        <td v-if="activeTab === 'admin'" class="px-2 py-4 whitespace-nowrap text-center w-8">
          <div class="text-sm text-gray-500">{{ index + 1 }}</div>
        </td>
        <!-- Show checkbox for user tab -->
        <td v-if="activeTab === 'user'" class="px-2 py-4 whitespace-nowrap text-center w-12">
          <input
            type="checkbox"
            :value="user.id"
            v-model="selectedItems"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
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
        <!-- Show actions only for user tab -->
        <td v-if="activeTab === 'user'" class="text-gray-600 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex justify-end space-x-3">
            <!-- Delete Button -->
            <button
              @click="deleteUser($event, user.id)"
              :disabled="user.role_id === 1"
              class="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="filteredUsers.length === 0">
        <td :colspan="activeTab === 'admin' ? 5 : 6" class="px-6 py-4 text-center text-sm text-gray-500">
          Tidak ada data user ditemukan
        </td>
      </tr>
    </tbody>
  </table>
</div>
  
        <!-- Pagination -->
        <div class="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between items-center sm:hidden">
            <button
              @click="goToPrevPage"
              :disabled="!prevPageUrl"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Halaman {{ currentPage }} dari {{ lastPage }}
            </span>
            <button
              @click="goToNextPage"
              :disabled="!nextPageUrl"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> -
                <span class="font-medium">{{ Math.min(currentPage * perPage, total) }}</span> dari
                <span class="font-medium">{{ total }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="goToPrevPage"
                  :disabled="!prevPageUrl"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  @click="goToNextPage"
                  :disabled="!nextPageUrl"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  </div>
      </main>
    </div>
  
    <!-- Register Admin Modal -->
  <div v-if="showRegisterModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2" for="name">Nama</label>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2" for="email">Email</label>
                  <input
                    v-model="registerForm.email"
                    type="email"
                    id="email"
                    required
                    class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email admin"
                  >
                </div>
                
                <!-- Success Message (shown after successful registration) -->
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

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
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
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus User</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmDelete"
            :disabled="isDeleting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isDeleting">Hapus</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghapus...
            </span>
          </button>
          <button 
            @click="cancelDelete"
            :disabled="isDeleting"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bulk Delete Confirmation Modal -->
  <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelBulkDelete"></div>
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
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus User Terpilih</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus {{ selectedItems.length }} user yang dipilih? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmBulkDelete"
            :disabled="isDeleting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isDeleting">Hapus</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghapus...
            </span>
          </button>
          <button 
            @click="cancelBulkDelete"
            :disabled="isDeleting"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
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

useHead({
  title: 'Kelola Pengguna - Sistem Repositori Pusdiklat BPS'
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
const activeTab = ref("admin") // 'admin' or 'user'

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
const originalRoles = ref({});

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
    
    const response = await $fetch('https://pusdiklat-repo-backend.zeabur.app/api/register/admin', {
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
    const response = await $fetch('https://pusdiklat-repo-backend.zeabur.app/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.status) {
      users.value = response.data;
      // Simpan role asli untuk setiap user
      response.data.forEach(user => {
        originalRoles.value[user.id] = user.role_id;
      });
      total.value = response.data.length;
    } else {
      errorMessage.value = response.message || 'Gagal memuat data user';
      showToast('error', errorMessage.value);
    }
  } catch (error) {
    // ... (tetap sama)
  } finally {
    isLoading.value = false;
  }
};

// Fetch available roles
const fetchRoles = async () => {
  try {
    const response = await $fetch('http://localhost:8000/api/roles', {
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

// Change tab and filter users
const changeTab = (tab) => {
  activeTab.value = tab
  fetchUsers()
}

// Filtered users based on active tab and search query
const filteredUsers = computed(() => {
  let filtered = users.value.filter(user => {
    if (activeTab.value === 'admin') {
      return user.role_id === 1 // Admin role
    } else {
      return user.role_id === 2 // User role
    }
  })
  
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

const updatingRoles = ref({}) // Track which users are being updated

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
// Fungsi cancelRoleChange yang diperbaiki
const cancelRoleChange = () => {
  showRoleChangeModal.value = false;
  userForRoleChange.value = null;
};

// Update user role after confirmation
// Fungsi updateUserRole yang diperbaiki
const updateUserRole = async () => {
  if (!userForRoleChange.value) return;

  updatingRole.value = true;
  try {
    const response = await $fetch(`http://localhost:8000/api/users/${userForRoleChange.value.id}/role`, {
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

// Delete user functions
const deleteUser = (event, id) => {
  userToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  isDeleting.value = true
  try {
    const response = await $fetch(`http://localhost:8000/api/users/${userToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.status) {
      await fetchUsers()
      showToast('success', 'User berhasil dihapus')
    } else {
      showToast('error', response.message || 'Gagal menghapus user')
    }
  } catch (error) {
    console.error("Failed to delete user:", error)
    showToast('error', error.data?.message || 'Gagal menghapus user')
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

// Bulk delete functions
const deleteSelectedUsers = () => {
  if (selectedItems.value.length === 0) return
  showBulkDeleteModal.value = true
}

const confirmBulkDelete = async () => {
  if (selectedItems.value.length === 0) return

  isDeleting.value = true
  try {
    const response = await $fetch('http://localhost:8000/api/users/bulk-delete', {
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
      showToast('success', `user berhasil dihapus`)
    } else {
      showToast('error', response.message || 'Gagal menghapus user yang dipilih')
    }
  } catch (error) {
    console.error("Failed to delete selected users:", error)
    showToast('error', error.data?.message || 'Gagal menghapus user yang dipilih')
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

// Navigate to next page
const goToNextPage = () => {
  if (nextPageUrl.value) {
    currentPage.value++
    fetchUsers()
  }
}

// Navigate to previous page
const goToPrevPage = () => {
  if (prevPageUrl.value) {
    currentPage.value--
    fetchUsers()
  }
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