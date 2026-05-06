<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar :show="showSidebar" @close="showSidebar = false" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderAdmin :pageTitle="'Kelola Kategori & Sub'" @toggle-sidebar="showSidebar = !showSidebar" />
      
      <main class="flex-1 overflow-y-auto p-8 pt-16">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-2xl font-black text-gray-900 tracking-tight">Kategori & Sub Kategori</h1>
              <p class="text-gray-500 font-medium mt-1">Kelola hierarki kategori koleksi</p>
            </div>
            <button @click="openAddModal('category')" class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              Tambah Kategori
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Categories Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-4 border-b border-gray-50 bg-emerald-50/30 flex justify-between items-center">
                <h2 class="text-sm font-black text-emerald-800 uppercase tracking-widest">Daftar Kategori</h2>
              </div>
              <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-100">
                  <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Nama Kategori</th>
                      <th class="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 bg-white">
                    <tr v-for="cat in categories" :key="cat.id" 
                      @click="selectCategory(cat)"
                      :class="selectedCategory?.id === cat.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'hover:bg-gray-50'"
                      class="cursor-pointer transition-all"
                    >
                      <td class="px-6 py-4">
                        <div class="text-sm font-bold text-gray-900">{{ cat.nama }}</div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex justify-end space-x-1" @click.stop>
                          <button @click="openEditModal('category', cat)" class="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          <button @click="deleteCategory(cat)" class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Sub-Categories Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div class="p-4 border-b border-gray-50 bg-emerald-50/30 flex justify-between items-center">
                <h2 class="text-sm font-black text-emerald-800 uppercase tracking-widest">
                  Sub Kategori: {{ selectedCategory ? selectedCategory.nama : 'Pilih Kategori' }}
                </h2>
                <button v-if="selectedCategory" @click="openAddModal('subcategory')" class="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
              <div v-if="selectedCategory" class="overflow-x-auto max-h-[600px] overflow-y-auto flex-1">
                <table class="min-w-full divide-y divide-gray-100">
                  <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Nama Sub</th>
                      <th class="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 bg-white">
                    <tr v-for="sub in subCategories" :key="sub.id" class="hover:bg-gray-50 transition-all">
                      <td class="px-6 py-4">
                        <div class="text-sm font-bold text-gray-900">{{ sub.nama }}</div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex justify-end space-x-1">
                          <button @click="openEditModal('subcategory', sub)" class="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          <button @click="deleteSubCategory(sub)" class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="subCategories.length === 0">
                      <td colspan="2" class="px-6 py-8 text-center text-gray-400 italic">Belum ada sub kategori</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="flex-1 flex items-center justify-center p-12 text-gray-400 italic text-center">
                Pilih kategori di sebelah kiri untuk melihat sub kategori
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <CategoryModal 
      :isOpen="isModalOpen" 
      :type="modalType" 
      :parentId="selectedCategory?.id"
      @close="isModalOpen = false" 
      @success="handleSuccess" 
    />

    <!-- Local Edit Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="isEditModalOpen = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
          <div class="bg-emerald-800 px-6 py-4 flex justify-between items-center text-white font-bold uppercase tracking-widest text-xs">
            Edit {{ editForm.type === 'category' ? 'Kategori' : 'Sub Kategori' }}
            <button @click="isEditModalOpen = false"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="p-6">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nama</label>
            <input v-model="editForm.nama" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium">
            <div class="mt-8 flex justify-end space-x-3">
              <button @click="isEditModalOpen = false" class="px-6 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest">Batal</button>
              <button @click="updateData" class="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100">Simpan Perubahan</button>
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
import CategoryModal from '@/components/Admin/CategoryModal.vue';

definePageMeta({ middleware: 'admin' });

const { public: { apiBaseUrl } } = useRuntimeConfig();
const authStore = useUnifiedAuthStore();
const { showToast } = useToast();

const showSidebar = ref(false);
const categories = ref([]);
const subCategories = ref([]);
const selectedCategory = ref(null);

const isModalOpen = ref(false);
const modalType = ref('category');
const isEditModalOpen = ref(false);
const editForm = reactive({ id: null, nama: '', type: 'category' });

const fetchCategories = async () => {
  try {
    const res = await $fetch(`${apiBaseUrl}/api/kategori`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    categories.value = res.data;
    if (selectedCategory.value) {
      const updated = categories.value.find(c => c.id === selectedCategory.value.id);
      if (updated) selectCategory(updated);
    } else if (categories.value.length > 0) {
      selectCategory(categories.value[0]);
    }
  } catch (err) {
    showToast('error', 'Gagal memuat data kategori');
  }
};

const selectCategory = async (cat) => {
  selectedCategory.value = cat;
  try {
    const res = await $fetch(`${apiBaseUrl}/api/sub-kategori`, {
      params: { kategori_id: cat.id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    subCategories.value = res.data;
  } catch (err) {
    subCategories.value = [];
  }
};

const openAddModal = (type) => {
  modalType.value = type;
  isModalOpen.value = true;
};

const handleSuccess = () => {
  fetchCategories();
};

const openEditModal = (type, item) => {
  editForm.id = item.id;
  editForm.nama = item.nama;
  editForm.type = type;
  isEditModalOpen.value = true;
};

const updateData = async () => {
  try {
    const endpoint = editForm.type === 'category' ? `/api/kategori/${editForm.id}` : `/api/sub-kategori/${editForm.id}`;
    await $fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'PUT',
      body: { nama: editForm.nama, kategori_id: selectedCategory.value?.id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    showToast('success', 'Data berhasil diperbarui');
    isEditModalOpen.value = false;
    fetchCategories();
  } catch (err) {
    showToast('error', 'Gagal memperbarui data');
  }
};

const deleteCategory = async (cat) => {
  if (confirm(`Hapus kategori "${cat.nama}"? Semua sub kategori juga akan terpengaruh.`)) {
    try {
      await $fetch(`${apiBaseUrl}/api/kategori/${cat.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      showToast('success', 'Kategori berhasil dihapus');
      if (selectedCategory.value?.id === cat.id) selectedCategory.value = null;
      fetchCategories();
    } catch (err) {
      showToast('error', err.data?.message || 'Gagal menghapus kategori');
    }
  }
};

const deleteSubCategory = async (sub) => {
  if (confirm(`Hapus sub kategori "${sub.nama}"?`)) {
    try {
      await $fetch(`${apiBaseUrl}/api/sub-kategori/${sub.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      showToast('success', 'Sub kategori berhasil dihapus');
      selectCategory(selectedCategory.value);
    } catch (err) {
      showToast('error', err.data?.message || 'Gagal menghapus sub kategori');
    }
  }
};

onMounted(fetchCategories);
</script>
