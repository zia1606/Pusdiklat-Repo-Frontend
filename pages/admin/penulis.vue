<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar :show="showSidebar" @close="showSidebar = false" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderAdmin :pageTitle="'Kelola Penulis'" @toggle-sidebar="showSidebar = !showSidebar" />
      
      <main class="flex-1 overflow-y-auto p-8 pt-16">
        <div class="max-w-6xl mx-auto p-10">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-2xl font-black text-gray-900 tracking-tight">Daftar Penulis</h1>
              <p class="text-gray-500 font-medium mt-1">Kelola data penulis dan creator koleksi</p>
            </div>
            <button @click="openAddModal" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              Tambah Penulis
            </button>
          </div>

          <!-- Table -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-50 bg-gray-50/30">
              <div class="relative max-w-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input v-model="search" @input="fetchPenulis" type="text" placeholder="Cari nama penulis..." class="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Penulis</th>
                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Dibuat Pada</th>
                    <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 bg-white">
                  <tr v-for="p in penulis" :key="p.id" class="hover:bg-blue-50/30 transition-all group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ p.nama }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-xs text-gray-400 font-medium">{{ formatDate(p.created_at) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex justify-end space-x-2">
                        <button @click="openEditModal(p)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button @click="confirmDelete(p)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="penulis.length === 0">
                    <td colspan="3" class="px-6 py-12 text-center text-gray-400 italic">Data penulis tidak ditemukan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals (Reuse AuthorModal or create a generic one) -->
    <!-- For simplicity, I'll use a local modal here for Edit since AuthorModal is for Add -->
    <AuthorModal :isOpen="isModalOpen" @close="isModalOpen = false" @success="fetchPenulis" />

    <!-- Edit Modal Local -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="isEditModalOpen = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
          <div class="bg-blue-900 px-6 py-4 flex justify-between items-center text-white font-bold">
            Edit Penulis
            <button @click="isEditModalOpen = false"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="p-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Penulis</label>
            <input v-model="editForm.nama" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <div class="mt-6 flex justify-end space-x-3">
              <button @click="isEditModalOpen = false" class="px-4 py-2 text-gray-600 font-bold">Batal</button>
              <button @click="updatePenulis" class="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { useToast } from '~/composables/useToast';
import Sidebar from '@/components/Admin/Sidebar.vue';
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
import AuthorModal from '@/components/Admin/AuthorModal.vue';

definePageMeta({ middleware: 'admin' });

const { public: { apiBaseUrl } } = useRuntimeConfig();
const authStore = useUnifiedAuthStore();
const { showToast } = useToast();

const showSidebar = ref(false);
const penulis = ref([]);
const search = ref('');
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const editForm = reactive({ id: null, nama: '' });

const fetchPenulis = async () => {
  try {
    const res = await $fetch(`${apiBaseUrl}/api/penulis`, {
      params: { search: search.value },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    penulis.value = res.data;
  } catch (err) {
    showToast('error', 'Gagal memuat data penulis');
  }
};

const openAddModal = () => { isModalOpen.value = true; };

const openEditModal = (p) => {
  editForm.id = p.id;
  editForm.nama = p.nama;
  isEditModalOpen.value = true;
};

const updatePenulis = async () => {
  try {
    await $fetch(`${apiBaseUrl}/api/penulis/${editForm.id}`, {
      method: 'PUT',
      body: { nama: editForm.nama },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    showToast('success', 'Penulis berhasil diperbarui');
    isEditModalOpen.value = false;
    fetchPenulis();
  } catch (err) {
    showToast('error', err.data?.message || 'Gagal memperbarui penulis');
  }
};

const confirmDelete = async (p) => {
  if (confirm(`Hapus penulis "${p.nama}"?`)) {
    try {
      await $fetch(`${apiBaseUrl}/api/penulis/${p.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      showToast('success', 'Penulis berhasil dihapus');
      fetchPenulis();
    } catch (err) {
      showToast('error', err.data?.message || 'Penulis tidak bisa dihapus karena masih memiliki koleksi');
    }
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(fetchPenulis);
</script>
