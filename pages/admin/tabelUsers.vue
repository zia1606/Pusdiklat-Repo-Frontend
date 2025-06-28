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
  
          <!-- Add User Button -->
          <NuxtLink
            to="/admin/users/create"
            class="flex items-center px-3 bg-blue-600 border border-gray-200 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1 mt-0.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span class="hidden sm:inline">Tambah User</span>
          </NuxtLink>
        </div>
      </div>
  
      <!-- User Type Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'admin'"
          :class="{'border-b-2 border-blue-500 text-blue-600': activeTab === 'admin', 'text-gray-500 hover:text-gray-700': activeTab !== 'admin'}"
          class="py-2 px-4 font-medium text-sm focus:outline-none"
        >
          Admin
        </button>
        <button
          @click="activeTab = 'user'"
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
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
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
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            
            <!-- Table Body -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap w-12">
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
                  <span
                    :class="{'bg-blue-100 text-blue-800': user.role === 'admin', 'bg-green-100 text-green-800': user.role === 'user'}"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.role === 'admin' ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(user.created_at) }}</div>
                </td>
                <td class="text-gray-600 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <!-- Edit Button -->
                    <NuxtLink :to="`/admin/users/edit/${user.id}`" class="w-4 mr-2 transform hover:text-blue-500 hover:scale-110">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </NuxtLink>
                    
                    <!-- Delete Button -->
                    <button
                      @click="deleteUser($event, user.id)"
                      class="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
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
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
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
  </div>
</template>

<script setup>
// Import statements
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Sidebar from '@/components/Admin/Sidebar.vue';
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
import { NuxtLink } from '#components';

const router = useRouter();
const authStore = useAdminAuthStore();

const pageTitle = ref('Manajemen User');

// Di parent component (Layout Admin)
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// State for users
const users = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const lastPage = ref(1);
const nextPageUrl = ref(null);
const prevPageUrl = ref(null);

// State for filters
const searchQuery = ref("");
const sortBy = ref("terbaru");
const activeTab = ref("admin"); // 'admin' or 'user'

// State for selection
const selectedItems = ref([]);
const selectAll = ref(false);

// Dummy data for demonstration
const dummyUsers = [
  {
    id: 1,
    name: "Admin Utama",
    email: "admin@example.com",
    role: "admin",
    created_at: "2023-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "User Biasa",
    email: "user@example.com",
    role: "user",
    created_at: "2023-02-20T14:45:00Z"
  },
  {
    id: 3,
    name: "Admin Kedua",
    email: "admin2@example.com",
    role: "admin",
    created_at: "2023-03-10T09:15:00Z"
  },
  {
    id: 4,
    name: "User Kedua",
    email: "user2@example.com",
    role: "user",
    created_at: "2023-04-05T16:20:00Z"
  },
  {
    id: 5,
    name: "User Ketiga",
    email: "user3@example.com",
    role: "user",
    created_at: "2023-05-12T11:10:00Z"
  }
];

// Authentication check
const checkAuth = async () => {
  await authStore.init();
  
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return false;
  }

  try {
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      alert('Sesi telah berakhir, silakan login kembali');
      await authStore.logout();
      router.push('/admin/auth/login');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    alert('Terjadi kesalahan saat verifikasi sesi');
    await authStore.logout();
    router.push('/admin/auth/login');
    return false;
  }
};

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Filtered users based on active tab and search query
const filteredUsers = computed(() => {
  let filtered = dummyUsers.filter(user => user.role === activeTab.value);
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  switch(sortBy.value) {
    case 'terbaru':
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'terlama':
      return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'nama-asc':
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    case 'nama-desc':
      return filtered.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return filtered;
  }
});

// Watch for changes in the users data to reset selectAll
watch(users, () => {
  selectAll.value = false;
});

// Toggle select all items
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedItems.value = [];
  }
};

// Delete selected users
const deleteSelectedUsers = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  if (confirm('Apakah Anda yakin ingin menghapus user yang dipilih?')) {
    try {
      // In a real app, you would call an API here
      // For now, we'll just filter out the selected users from our dummy data
      users.value = users.value.filter(user => !selectedItems.value.includes(user.id));
      selectedItems.value = [];
      alert('User yang dipilih telah dihapus');
    } catch (error) {
      console.error("Failed to delete users:", error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal menghapus user');
      }
    }
  }
};

// Delete single user
const deleteUser = async (event, id) => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    try {
      // In a real app, you would call an API here
      // For now, we'll just filter out the user from our dummy data
      const index = dummyUsers.findIndex(user => user.id === id);
      if (index !== -1) {
        dummyUsers.splice(index, 1);
      }
      alert('User telah dihapus');
    } catch (error) {
      console.error("Failed to delete user:", error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal menghapus user');
      }
    }
  }
};

// Apply filters
const applyFilters = () => {
  currentPage.value = 1;
};

// Navigate to next page
const goToNextPage = () => {
  if (nextPageUrl.value) {
    currentPage.value++;
  }
};

// Navigate to previous page
const goToPrevPage = () => {
  if (prevPageUrl.value) {
    currentPage.value--;
  }
};

// Pengecekan awal saat komponen dimount
onMounted(async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;

  try {
    // In a real app, you would fetch users from an API here
    users.value = dummyUsers;
  } catch (error) {
    console.error('Failed to initialize user table:', error);
    alert('Gagal memuat data user');
  }
});
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
</style>