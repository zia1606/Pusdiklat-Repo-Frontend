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
            <span class="sm:hidden">Tambah</span>
            <span class="hidden sm:inline">Tambah Jenis Dokumen</span>
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
                                                    <!-- <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {{ item.total || 0 }}
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
                                                        <button @click="confirmDelete(item.id)" class="w-5 mr-2 cursor-pointer transform hover:text-red-500 hover:scale-110">
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
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                        <label class="block text-sm font-medium text-gray-700 mb-2 text-left" for="nama">Nama Jenis Dokumen</label>
                        <div class="relative">
                        <input 
                            v-model="form.nama" 
                            type="text" 
                            id="nama" 
                            class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama jenis dokumen"
                            required
                        >
                        </div>
                    </div>

                    <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                        <span v-if="!isSubmitting">{{ isEditMode ? 'Update' : 'Simpan' }}</span>
                        <span v-else class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </span>
                        </button>
                        <button
                        type="button"
                        @click="closeModal"
                        :disabled="isSubmitting"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
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
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Jenis Dokumen</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus jenis dokumen ini? Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="deleteJenisDokumen"
                  :disabled="isDeleting"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta, navigateTo } from '#imports';
import { $fetch } from 'ofetch';
import Sidebar from '~/components/Admin/Sidebar.vue';
import HeaderAdmin from '~/components/Admin/HeaderAdmin.vue';
import { useToast } from '~/composables/useToast';
const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Jenis Dokumen - Sistem Repositori Pusdiklat BPS'
})

const { showToast } = useToast();

const router = useRouter();
const authStore = useUnifiedAuthStore();

const showSidebar = ref(false);
const jenisDokumen = ref([]);
const distribusiJenis = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const form = ref({
    id: null,
    nama: ''
});

// State for delete confirmation modal
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
});

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

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

const fetchJenisDokumen = async () => {
    if (!authStore.isAuthenticated) {
      await navigateTo('/auth/login');
      return;
    }

    try {
        const response = await $fetch(`${apiBaseUrl}/api/jenis-dokumen`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': 'application/json'
          }
        });
        jenisDokumen.value = response.data;
    } catch (error) {
        console.error('Error fetching jenis dokumen:', error);
        if (error.status === 401) {
          showToast('warning', 'Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          await navigateTo('/auth/login');
        } else {
          showToast('error', 'Gagal memuat data jenis dokumen');
        }
    }
};

const fetchDistribusiJenis = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login');
    return;
  }

  try {
      const response = await $fetch(`${apiBaseUrl}/api/koleksi/distribusi-jenis`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      });
      distribusiJenis.value = response.data;
  } catch (error) {
      console.error('Error fetching distribusi jenis:', error);
      if (error.status === 401) {
        showToast('warning', 'Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        await navigateTo('/auth/login');
      } else {
        showToast('error', 'Gagal memuat distribusi jenis dokumen');
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
    if (!authStore.isAuthenticated) {
      await navigateTo('/auth/login');
      return;
    }

    if (!form.value.nama.trim()) {
      showToast('warning', 'Nama jenis dokumen tidak boleh kosong');
      return;
    }

    try {
        isSubmitting.value = true;
        const response = await $fetch(`${apiBaseUrl}/api/jenis-dokumen`, {
          method: 'POST',
          body: form.value,
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': 'application/json'
          }
        });
        jenisDokumen.value.push(response.data);
        closeModal();
        showToast('success', 'Jenis dokumen berhasil ditambahkan');
        await fetchDistribusiJenis();
    } catch (error) {
        console.error('Error adding jenis dokumen:', error);
        if (error.status === 401) {
          showToast('warning', 'Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          await navigateTo('/auth/login');
        } else {
          showToast('error', 'Gagal menambahkan jenis dokumen');
        }
    } finally {
        isSubmitting.value = false;
    }
};

const updateJenisDokumen = async () => {
    if (!authStore.isAuthenticated) {
      await navigateTo('/auth/login');
      return;
    }

    if (!form.value.nama.trim()) {
      showToast('warning', 'Nama jenis dokumen tidak boleh kosong');
      return;
    }

    try {
        isSubmitting.value = true;
        const response = await $fetch(`${apiBaseUrl}/api/jenis-dokumen/${form.value.id}`, {
          method: 'PUT',
          body: form.value,
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': 'application/json'
          }
        });
        const index = jenisDokumen.value.findIndex(k => k.id === form.value.id);
        jenisDokumen.value[index] = response.data;
        closeModal();
        showToast('success', 'Jenis dokumen berhasil diperbarui');
        await fetchDistribusiJenis();
    } catch (error) {
        console.error('Error updating jenis dokumen:', error);
        if (error.status === 401) {
          showToast('warning', 'Sesi telah berakhir, silakan login kembali');
          await authStore.logout();
          await navigateTo('/auth/login');
        } else {
          showToast('error', 'Gagal memperbarui jenis dokumen');
        }
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = (id) => {
  itemToDelete.value = id;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const deleteJenisDokumen = async () => {
  if (!itemToDelete.value) return;
  
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login');
    return;
  }

  try {
      isDeleting.value = true;
      await $fetch(`${apiBaseUrl}/api/jenis-dokumen/${itemToDelete.value}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        }
      });
      jenisDokumen.value = jenisDokumen.value.filter(k => k.id !== itemToDelete.value);
      showDeleteModal.value = false;
      showToast('success', 'Jenis dokumen berhasil dihapus');
      await fetchDistribusiJenis();
  } catch (error) {
      console.error('Error deleting jenis dokumen:', error);
      if (error.status === 401) {
        showToast('warning', 'Sesi telah berakhir, silakan login kembali');
        await authStore.logout();
        await navigateTo('/auth/login');
      } else {
        showToast('error', 'Gagal menghapus jenis dokumen');
      }
  } finally {
      isDeleting.value = false;
      itemToDelete.value = null;
  }
};

onMounted(async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;
  
  await Promise.all([
    fetchJenisDokumen(),
    fetchDistribusiJenis()
  ]);
});
</script>