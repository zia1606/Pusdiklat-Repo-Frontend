<template>
    <div class="bg-gray-50">
        <div class="flex h-screen">
        
                <!-- Sidebar -->
                <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
                <!-- Main content -->
                    <div class="flex-1 overflow-y-auto pt-16">
                        <div class="p-10">
                            <div class="max-w-6xl mx-auto">
                                <!-- Top Action Bar -->
                                <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                                    <div>
                                        <h2 class="text-2xl font-black text-gray-900 tracking-tight">Jenis Dokumen</h2>
                                        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Klasifikasi tipe konten repositori</p>
                                    </div>
                                    <button 
                                        @click="openAddModal" 
                                        class="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah Jenis
                                    </button>
                                </div>

                                <!-- Table Container -->
                                <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                    <div class="overflow-x-auto">
                                        <table class="w-full text-left border-collapse">
                                            <thead>
                                                <tr class="bg-gray-50/50 border-b border-gray-50">
                                                    <th class="py-5 px-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20">No.</th>
                                                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Jenis Dokumen</th>
                                                    <th class="py-5 px-6 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">Jumlah Koleksi</th>
                                                    <th class="py-5 px-8 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-gray-50">
                                                <tr v-for="(item, index) in jenisDokumenWithCounts" :key="item.id" class="hover:bg-blue-50/30 transition-all duration-200 group">
                                                    <td class="py-6 px-8 whitespace-nowrap">
                                                        <div class="text-[11px] font-black text-gray-300 tracking-tighter italic">#{{ index + 1 }}</div>
                                                    </td>
                                                    <td class="py-6 px-6">
                                                        <div class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ item.nama }}</div>
                                                    </td>
                                                    <td class="py-6 px-6 text-center">
                                                        <span class="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100/50">
                                                            {{ item.total || 0 }}
                                                        </span>
                                                    </td>
                                                    <td class="py-6 px-8 whitespace-nowrap text-right">
                                                        <div class="flex justify-end items-center space-x-2">
                                                            <button 
                                                                @click="openEditModal(item)" 
                                                                class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group/btn"
                                                                title="Edit"
                                                            >
                                                                <svg class="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                @click="confirmDelete(item.id)" 
                                                                class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all duration-300 group/btn"
                                                                title="Hapus"
                                                            >
                                                                <svg class="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr v-if="jenisDokumenWithCounts.length === 0">
                                                    <td colspan="4" class="py-20 text-center text-gray-400">
                                                        <div class="flex flex-col items-center opacity-30">
                                                            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <p class="text-sm font-bold uppercase tracking-widest">Data Kosong</p>
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
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-modalIn">
                <!-- Modal Header -->
                <div class="relative overflow-hidden bg-blue-600 px-8 py-8">
                    <div class="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-blue-500 opacity-20"></div>
                    <div class="relative z-10 flex items-center space-x-4">
                        <div class="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                            <svg v-if="!isEditMode" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-black text-white tracking-tight">{{ isEditMode ? 'Edit Jenis Dokumen' : 'Tambah Jenis Dokumen' }}</h3>
                            <p class="text-blue-100 text-xs font-medium mt-0.5">{{ isEditMode ? 'Perbarui informasi jenis dokumen' : 'Buat klasifikasi dokumen baru' }}</p>
                        </div>
                    </div>
                </div>

                <div class="p-8">
                    <form @submit.prevent="isEditMode ? updateJenisDokumen() : addJenisDokumen()" class="space-y-6">
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" for="nama">Nama Jenis Dokumen</label>
                            <input 
                                v-model="form.nama" 
                                type="text" 
                                id="nama" 
                                class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                                placeholder="Contoh: Modul Pembelajaran"
                                required
                            >
                        </div>

                        <div class="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                            <button
                                type="submit"
                                :disabled="isSubmitting"
                                class="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                            >
                                <span v-if="!isSubmitting">{{ isEditMode ? 'Update' : 'Simpan' }}</span>
                                <span v-else class="flex items-center justify-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
                                class="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-modalIn">
                <div class="p-8 text-center">
                    <div class="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                        <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-black text-gray-900 mb-2">Hapus Jenis Dokumen?</h3>
                    <p class="text-sm text-gray-500 font-medium leading-relaxed">Apakah Anda yakin ingin menghapus jenis dokumen ini? Tindakan ini <span class="text-red-600 font-bold">permanen</span> dan tidak dapat dibatalkan.</p>
                </div>
                <div class="p-6 bg-gray-50/50 flex flex-col sm:flex-row-reverse gap-3">
                    <button 
                        @click="deleteJenisDokumen"
                        :disabled="isDeleting"
                        class="flex-1 px-8 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                    >
                        <span v-if="!isDeleting">Ya, Hapus</span>
                        <span v-else class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menghapus...
                        </span>
                    </button>
                    <button 
                        @click="cancelDelete"
                        :disabled="isDeleting"
                        class="flex-1 px-8 py-4 bg-white border border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast Component -->
        <Toast />
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