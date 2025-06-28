<template>
    <div>
        <div class="bg-gray-50">
            <div class="flex h-screen">
        
                <!-- Sidebar -->
                <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
                <!-- Main content -->
                <div class="flex flex-col flex-1 h-screen overflow-y-auto">
                    <HeaderAdmin @toggle-sidebar="toggleSidebar" pageTitle="Tabel Jenis Dokumen" />
 
                    <div class="pt-16 flex flex-col flex-1 overflow-y-auto p-6">
                        <div class="bg-gray-50">
                            <div class="container mx-auto px-4 py-20">
                                <!-- Search and Add User (Static) -->
<div class="flex flex-col md:flex-row justify-between items-center mb-6">
    <div class="w-full md:w-1/3 mb-4 md:mb-0">
        <!-- <input type="text" placeholder="Search jenis dokumen..." class="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"> -->
    </div>
    <div class="w-full flex justify-end">
        <button @click="openAddModal" class="flex items-center cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>Tambah Jenis Dokumen</span>
        </button>
    </div>
</div>

                                <!-- User Table -->
                                <div class="overflow-x-auto bg-white rounded-lg shadow">
                                    <table class="w-full table-auto shadow-sm border border-gray-300 divide-y divide-gray-200">
                                        <thead>
                                            <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th class="py-3 px-6 text-left text-xs font-lg">No</th>
                                                <th class="py-3 px-6 text-left text-xs font-lg">Nama</th>
                                                <th class="py-3 px-6 text-center text-xs font-lg">Jumlah Koleksi</th>
                                                <th class="py-3 px-6 text-center text-xs font-lg">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-gray-600 text-sm">
                                            <tr v-for="(item, index) in jenisDokumenWithCounts" :key="item.id" class="border-b border-gray-200 hover:bg-gray-100">
                                                <td class="px-6 py-3 text-left text-sm text-gray-500">{{ index + 1 }}</td>
                                                <td class="px-6 py-3 text-left text-sm text-gray-500">{{ item.nama }}</td>
                                                <td class="px-6 py-3 text-center text-sm text-gray-500">
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {{ item.total || 0 }}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-3 text-center text-sm text-gray-500">
                                                    <div class="flex item-center justify-center">
                                                        <button @click="openEditModal(item)" class="w-5 mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </button>
                                                        <button @click="deleteJenisDokumen(item.id)" class="w-5 mr-2 cursor-pointer transform hover:text-red-500 hover:scale-110">
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
                    {{ isEditMode ? 'Edit Jenis Dokumen' : 'Tambah Jenis Dokumen' }}
                    </h3>
                    
                    <form @submit.prevent="isEditMode ? updateJenisDokumen() : addJenisDokumen()">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2" for="nama">Nama Jenis Dokumen</label>
                        <div class="relative">
                        <input 
                            v-model="form.nama" 
                            type="text" 
                            id="nama" 
                            class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama jenis dokumen"
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
const jenisDokumen = ref([]);
const distribusiJenis = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const form = ref({
    id: null,
    nama: ''
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

// Computed property untuk menggabungkan data jenis dokumen dengan jumlah koleksi
const jenisDokumenWithCounts = computed(() => {
  return jenisDokumen.value.map(jenis => {
    const distribusi = distribusiJenis.value.find(dist => dist.id === jenis.id);
    return {
      ...jenis,
      total: distribusi ? distribusi.total : 0
    };
  });
});

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

const fetchJenisDokumen = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }

    try {
        const response = await axios.get('http://localhost:8000/api/jenis-dokumen', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        jenisDokumen.value = response.data.data;
    } catch (error) {
        console.error('Error fetching jenis dokumen:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          router.push('/admin/auth/login');
        }
    }
};

const fetchDistribusiJenis = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/admin/auth/login');
    return;
  }

  try {
      const response = await axios.get('http://localhost:8000/api/koleksi/distribusi-jenis', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      distribusiJenis.value = response.data.data;
  } catch (error) {
      console.error('Error fetching distribusi jenis:', error);
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

const addJenisDokumen = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }

    try {
        const response = await axios.post('http://localhost:8000/api/jenis-dokumen', form.value, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        jenisDokumen.value.push(response.data.data);
        closeModal();
        alert('Jenis dokumen berhasil ditambahkan!');
        // Refresh distribusi data setelah menambah jenis dokumen
        await fetchDistribusiJenis();
    } catch (error) {
        console.error('Error adding jenis dokumen:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          router.push('/admin/auth/login');
        } else {
          alert('Gagal menambahkan jenis dokumen. Silakan coba lagi.'); 
        }
    }
};

const updateJenisDokumen = async () => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }

    try {
        const response = await axios.put(`http://localhost:8000/api/jenis-dokumen/${form.value.id}`, form.value, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        const index = jenisDokumen.value.findIndex(k => k.id === form.value.id);
        jenisDokumen.value[index] = response.data.data;
        closeModal();
        alert('Jenis dokumen berhasil diperbarui!');
        // Refresh distribusi data setelah update jenis dokumen
        await fetchDistribusiJenis();
    } catch (error) {
        console.error('Error updating jenis dokumen:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          router.push('/admin/auth/login');
        } else {
          alert('Gagal memperbarui jenis dokumen. Silakan coba lagi.');
        }
    }
};

const deleteJenisDokumen = async (id) => {
    if (!authStore.isLoggedIn) {
      router.push('/admin/auth/login');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus jenis dokumen ini?')) {
        try {
            await axios.delete(`http://localhost:8000/api/jenis-dokumen/${id}`, {
              headers: {
                'Authorization': `Bearer ${authStore.token}`
              }
            });
            jenisDokumen.value = jenisDokumen.value.filter(k => k.id !== id);
            alert('Jenis dokumen berhasil dihapus!');
            // Refresh distribusi data setelah delete jenis dokumen
            await fetchDistribusiJenis();
        } catch (error) {
            console.error('Error deleting jenis dokumen:', error);
            if (error.response?.status === 401) {
              alert('Sesi telah berakhir, silakan login kembali');
              await authStore.logout();
              router.push('/admin/auth/login');
            } else {
              alert('Gagal menghapus jenis dokumen. Silakan coba lagi.');
            }
        }
    }
};

onMounted(async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;
  
  // Fetch data jenis dokumen dan distribusi secara bersamaan
  await Promise.all([
    fetchJenisDokumen(),
    fetchDistribusiJenis()
  ]);
});
</script>