<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar :show="showSidebar" @close="showSidebar = false" @toggle="toggleSidebar" />

      <!-- Main content -->
      <div class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <div class="max-w-6xl mx-auto">
            <!-- Top Action Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Pemberitahuan</h2>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Manajemen Pengumuman</p>
              </div>
              <button 
                @click="openAddModal" 
                class="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
              >
                Tambah Pemberitahuan
              </button>
            </div>

            <!-- Table Container -->
            <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-50/50 border-b border-gray-50">
                      <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-16">Status</th>
                      <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Judul</th>
                      <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                      <th class="py-5 px-8 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="item in items" :key="item.id" class="hover:bg-blue-50/30 transition-all duration-200">
                      <td class="py-6 px-6">
                        <span :class="item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {{ item.is_active ? 'Aktif' : 'Tidak' }}
                        </span>
                      </td>
                      <td class="py-6 px-6">
                        <div class="text-sm font-bold text-gray-900">{{ item.title }}</div>
                        <div class="text-xs text-gray-500 mt-1 line-clamp-1">{{ item.description }}</div>
                      </td>
                      <td class="py-6 px-6 text-sm font-medium text-gray-600">{{ item.date || '-' }}</td>
                      <td class="py-6 px-8 whitespace-nowrap text-right">
                        <div class="flex justify-end items-center space-x-2">
                          <button @click="openEditModal(item)" class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button @click="confirmDelete(item.id)" class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="items.length === 0">
                      <td colspan="4" class="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Data Kosong</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div class="bg-blue-600 px-8 py-6">
          <h3 class="text-lg font-black text-white">{{ isEditMode ? 'Edit Pemberitahuan' : 'Tambah Pemberitahuan' }}</h3>
        </div>
        <div class="p-8">
          <form @submit.prevent="saveData" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Judul</label>
              <input v-model="form.title" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deskripsi</label>
              <textarea v-model="form.description" required rows="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</label>
                <input v-model="form.date" type="date" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Icon Type</label>
                <select v-model="form.icon_type" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
                  <option value="info">Info</option>
                  <option value="alert">Alert</option>
                  <option value="book">Book</option>
                  <option value="refresh">Refresh</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Link (Opsional)</label>
              <input v-model="form.link" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
            </div>
            <div class="flex items-center mt-2">
              <input v-model="form.is_active" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <label for="isActive" class="ml-2 text-sm font-bold text-gray-900">Aktifkan Pemberitahuan</label>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" :disabled="isSubmitting" class="flex-1 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 disabled:opacity-50">
                Simpan
              </button>
              <button type="button" @click="closeModal" class="flex-1 py-3 bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h3 class="text-xl font-black mb-2">Hapus Item?</h3>
        <p class="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex gap-3">
          <button @click="deleteData" :disabled="isDeleting" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Hapus</button>
          <button @click="showDeleteModal = false" class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Batal</button>
        </div>
      </div>
    </div>
    
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta } from '#imports';
import { $fetch } from 'ofetch';
import Sidebar from '~/components/Admin/Sidebar.vue';
import { useToast } from '~/composables/useToast';

const { public: { apiBaseUrl } } = useRuntimeConfig();
const { showToast } = useToast();
const authStore = useUnifiedAuthStore();

definePageMeta({ middleware: 'admin' });
useHead({ title: 'Manajemen Pemberitahuan - Sistem Repositori' });

const showSidebar = ref(false);
const items = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

const form = ref({
  id: null,
  title: '',
  description: '',
  date: '',
  icon_type: 'info',
  color: '',
  link: '',
  is_active: true
});

const toggleSidebar = () => showSidebar.value = !showSidebar.value;

const fetchData = async () => {
  try {
    const response = await $fetch(`${apiBaseUrl}/api/pemberitahuan`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    items.value = response.data || [];
  } catch (error) {
    showToast('error', 'Gagal memuat data');
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  form.value = { id: null, title: '', description: '', date: '', icon_type: 'info', color: '', link: '', is_active: true };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

const saveData = async () => {
  isSubmitting.value = true;
  try {
    const method = isEditMode.value ? 'PUT' : 'POST';
    const url = isEditMode.value ? `${apiBaseUrl}/api/pemberitahuan/${form.value.id}` : `${apiBaseUrl}/api/pemberitahuan`;
    
    await $fetch(url, {
      method,
      body: form.value,
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    
    showToast('success', 'Data berhasil disimpan');
    closeModal();
    fetchData();
  } catch (error) {
    showToast('error', 'Gagal menyimpan data');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (id) => {
  itemToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteData = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await $fetch(`${apiBaseUrl}/api/pemberitahuan/${itemToDelete.value}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    showToast('success', 'Data berhasil dihapus');
    showDeleteModal.value = false;
    fetchData();
  } catch (error) {
    showToast('error', 'Gagal menghapus data');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => fetchData());
</script>
