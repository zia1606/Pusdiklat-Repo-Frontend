<template>
  <div>
      <div class="bg-gray-50">
          <div class="flex h-screen">
      
              <!-- Sidebar -->
              <Sidebar :show="showSidebar" @close="showSidebar = false" />

              <!-- Main content -->
              <div class="flex flex-col flex-1 h-screen overflow-y-auto">
                  <HeaderAdmin @toggle-sidebar="toggleSidebar" pageTitle="Tabel Kategori Bangkom" />

                  <div class="pt-16 flex flex-col flex-1 overflow-y-auto p-6">
                      <div class="bg-gray-50">
                          <div class="container mx-auto px-4 py-20">
                              <!-- Search and Add User (Static) -->
<div class="flex flex-col md:flex-row justify-between items-center mb-6">
    <div class="w-full md:w-1/3 mb-4 md:mb-0">
        <!-- <input type="text" placeholder="Search kategori..." class="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"> -->
    </div>
    <div class="w-full flex justify-end">
        <button @click="openAddModal" class="flex items-center cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>Tambah Kategori</span>
        </button>
    </div>
</div>

                              <!-- User Table -->
                              <div class="overflow-x-auto bg-white rounded-lg shadow">
                                  <table class="w-full table-auto shadow-sm border border-gray-300 divide-y divide-gray-200">
                                      <thead>
                                          <tr class="bg-gray-100 text-gray-500 uppercase text-sm leading-normal">
                                              <th class="py-3 px-6 text-left text-xs font-lg">No</th>
                                              <th class="py-3 px-6 text-left text-xs font-lg">Nama</th>
                                              <th class="py-3 px-6 text-center text-xs font-lg">Jumlah Koleksi</th>
                                              <th class="py-3 px-6 text-center text-xs font-lg">Action</th>
                                          </tr>
                                      </thead>
                                      <tbody class="text-gray-600 text-sm">
                                          <tr v-for="(item, index) in kategoriWithCounts" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50">
                                              <td class="px-6 py-3 text-left text-sm text-gray-500">{{ index + 1 }}</td>
                                              <td class="px-6 py-3 text-left text-sm text-gray-500">{{ item.nama }}</td>
                                              <td class="px-6 py-3 text-center text-sm text-gray-500">
                                                  <!-- <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                      
                                                  </span> -->
                                                  {{ item.total || 0 }}
                                              </td>
                                              <td class="px-6 py-3 text-center text-sm text-gray-500">
                                                  <div class="flex item-center justify-center">
                                                      <button @click="openEditModal(item)" class="w-5 mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110">
                                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                      </button>
                                                      <button @click="deleteKategori(item.id)" class="w-5 mr-2 cursor-pointer transform hover:text-red-500 hover:scale-110">
                                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                          </svg>
                                                      </button>
                                                  </div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal for Add and Edit -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeModal"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ isEditMode ? 'Edit Kategori' : 'Tambah Kategori' }}
                  </h3>
                  
                  <form @submit.prevent="isEditMode ? updateKategori() : addKategori()">
                  <div class="mb-6">
                      <label class="block text-sm font-medium text-gray-700 mb-2" for="nama">Nama Kategori</label>
                      <div class="relative">
                      <input 
                          v-model="form.nama" 
                          type="text" 
                          id="nama" 
                          class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan nama kategori"
                      >
                      </div>
                  </div>

                  <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                      type="submit"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                      {{ isEditMode ? 'Update' : 'Simpan' }}
                      </button>
                      <button
                      type="button"
                      @click="closeModal"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuth';
import Sidebar from '~/components/Admin/Sidebar.vue';
import HeaderAdmin from '~/components/Admin/HeaderAdmin.vue';

const router = useRouter();
const authStore = useAdminAuthStore();

const showSidebar = ref(false);
const kategori = ref([]);
const distribusiKategori = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const form = ref({
  id: null,
  nama: ''
});

// Computed property untuk menggabungkan data kategori dengan jumlah koleksi
const kategoriWithCounts = computed(() => {
  return kategori.value.map(kat => {
    const distribusi = distribusiKategori.value.find(dist => dist.id === kat.id);
    return {
      ...kat,
      total: distribusi ? distribusi.total : 0
    };
  });
});

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

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const fetchKategori = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  try {
      const response = await axios.get('http://localhost:8000/api/kategori-bang-kom', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      kategori.value = response.data.data;
  } catch (error) {
      console.error('Error fetching kategori:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      }
  }
};

const fetchDistribusiKategori = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  try {
      const response = await axios.get('http://localhost:8000/api/koleksi/distribusi-kategori', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      distribusiKategori.value = response.data.data;
  } catch (error) {
      console.error('Error fetching distribusi kategori:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      }
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  form.value = { id: null, nama: '' };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const addKategori = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  try {
      const response = await axios.post('http://localhost:8000/api/kategori-bang-kom', form.value, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      kategori.value.push(response.data.data);
      closeModal();
      alert('Kategori berhasil ditambahkan!');
      // Refresh distribusi data setelah menambah kategori
      await fetchDistribusiKategori();
  } catch (error) {
      console.error('Error adding kategori:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal menambahkan kategori. Silakan coba lagi.'); 
      }
  }
};

const updateKategori = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  try {
      const response = await axios.put(`http://localhost:8000/api/kategori-bang-kom/${form.value.id}`, form.value, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      const index = kategori.value.findIndex(k => k.id === form.value.id);
      kategori.value[index] = response.data.data;
      closeModal();
      alert('Kategori berhasil diperbarui!');
      // Refresh distribusi data setelah update kategori
      await fetchDistribusiKategori();
  } catch (error) {
      console.error('Error updating kategori:', error);
      if (error.response?.status === 401) {
        alert('Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        router.push('/admin/auth/login');
      } else {
        alert('Gagal memperbarui kategori. Silakan coba lagi.');
      }
  }
};

const deleteKategori = async (id) => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
          await axios.delete(`http://localhost:8000/api/kategori-bang-kom/${id}`, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            }
          });
          kategori.value = kategori.value.filter(k => k.id !== id);
          alert('Kategori berhasil dihapus!');
          // Refresh distribusi data setelah delete kategori
          await fetchDistribusiKategori();
      } catch (error) {
          console.error('Error deleting kategori:', error);
          if (error.response?.status === 401) {
            alert('Sesi telah berakhir, silakan login kembali');
            await authStore.logout();
            router.push('/admin/auth/login');
          } else {
            alert('Gagal menghapus kategori. Silakan coba lagi.');
          }
      }
  }
};

onMounted(async () => {
const isAuthenticated = await checkAuth();
if (!isAuthenticated) return;

// Fetch data kategori dan distribusi secara bersamaan
await Promise.all([
  fetchKategori(),
  fetchDistribusiKategori()
]);
});
</script>