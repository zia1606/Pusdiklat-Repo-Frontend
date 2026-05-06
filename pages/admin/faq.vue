<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="flex h-screen">
      <Sidebar :show="showSidebar" @close="showSidebar = false" @toggle="toggleSidebar" />
      <div class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <div class="max-w-6xl mx-auto">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">FAQ</h2>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Frequently Asked Questions</p>
              </div>
              <div class="flex gap-3">
                <button @click="openCategoryModal" class="inline-flex items-center px-6 py-3.5 bg-gray-100 text-gray-700 font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-sm hover:bg-gray-200 transition-all">
                  Kelola Kategori
                </button>
                <button @click="openAddModal" class="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
                  Tambah FAQ
                </button>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/50 border-b border-gray-50">
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-16">Status</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pertanyaan & Jawaban</th>
                    <th class="py-5 px-8 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="item in items" :key="item.id" class="hover:bg-blue-50/30 transition-all">
                    <td class="py-6 px-6">
                      <span :class="item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {{ item.is_active ? 'Aktif' : 'Tidak' }}
                      </span>
                    </td>
                    <td class="py-6 px-6 text-sm font-bold text-gray-600">{{ item.kategori?.name || '-' }}</td>
                    <td class="py-6 px-6">
                      <div class="text-sm font-bold text-gray-900">{{ item.question }}</div>
                      <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.answer }}</div>
                    </td>
                    <td class="py-6 px-8 text-right flex justify-end space-x-2">
                      <button @click="openEditModal(item)" class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                      <button @click="confirmDelete(item.id, 'faq')" class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </td>
                  </tr>
                  <tr v-if="items.length === 0"><td colspan="4" class="py-10 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">Data Kosong</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form FAQ -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div class="bg-blue-600 px-8 py-6"><h3 class="text-lg font-black text-white">{{ isEditMode ? 'Edit FAQ' : 'Tambah FAQ' }}</h3></div>
        <div class="p-8">
          <form @submit.prevent="saveData" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kategori</label>
              <select v-model="form.faq_kategori_id" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pertanyaan</label>
              <input v-model="form.question" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jawaban</label>
              <textarea v-model="form.answer" required rows="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Urutan</label>
                <input v-model="form.order_number" type="number" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none">
              </div>
            </div>
            <div class="flex items-center mt-2">
              <input v-model="form.is_active" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <label for="isActive" class="ml-2 text-sm font-bold text-gray-900">Aktifkan FAQ</label>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" :disabled="isSubmitting" class="flex-1 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 disabled:opacity-50">Simpan</button>
              <button type="button" @click="closeModal" class="flex-1 py-3 bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Categories Management -->
    <div v-if="isCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-gray-800 px-8 py-6 flex justify-between items-center">
          <h3 class="text-lg font-black text-white">Kelola Kategori FAQ</h3>
          <button @click="isCategoryModalOpen = false" class="text-gray-400 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div class="p-6 bg-gray-50 flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nama Kategori</label>
            <input v-model="catForm.name" type="text" placeholder="Nama Kategori Baru" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
          </div>
          <div class="flex-1">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Slug</label>
            <input v-model="catForm.slug" type="text" placeholder="slug-kategori" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
          </div>
          <button @click="saveCategory" :disabled="isSubmitting" class="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-50 h-[42px] flex items-center justify-center">
            {{ catForm.id ? 'Update' : 'Tambah' }}
          </button>
          <button v-if="catForm.id" @click="resetCatForm" class="px-4 py-2 bg-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-300 h-[42px] flex items-center justify-center">Batal</button>
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <table class="w-full text-left border-collapse">
            <tbody class="divide-y divide-gray-100">
              <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50">
                <td class="py-3 px-4 text-sm font-bold">{{ cat.name }}</td>
                <td class="py-3 px-4 text-xs text-gray-500">{{ cat.slug }}</td>
                <td class="py-3 px-4 text-right flex justify-end space-x-2">
                  <button @click="editCategory(cat)" class="text-blue-500 hover:text-blue-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button @click="confirmDelete(cat.id, 'category')" class="text-red-500 hover:text-red-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </td>
              </tr>
              <tr v-if="categories.length === 0"><td colspan="3" class="text-center py-4 text-gray-400">Tidak ada kategori</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h3 class="text-xl font-black mb-2">Hapus Item?</h3>
        <p class="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex gap-3">
          <button @click="deleteItem" :disabled="isDeleting" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Hapus</button>
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
useHead({ title: 'Manajemen FAQ - Sistem Repositori' });

const showSidebar = ref(false);
const items = ref([]);
const categories = ref([]);

const isModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);

const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const deleteType = ref('faq'); // 'faq' or 'category'
const isDeleting = ref(false);

const form = ref({
  id: null,
  faq_kategori_id: '',
  question: '',
  answer: '',
  order_number: 0,
  is_active: true
});

const catForm = ref({
  id: null,
  name: '',
  slug: '',
  order_number: 0
});

const toggleSidebar = () => showSidebar.value = !showSidebar.value;

const fetchData = async () => {
  try {
    const resCat = await $fetch(`${apiBaseUrl}/api/faq-kategori`, { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    categories.value = resCat.data || [];

    const resFaq = await $fetch(`${apiBaseUrl}/api/faqs`, { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    items.value = resFaq.data || [];
  } catch (error) {
    showToast('error', 'Gagal memuat data');
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  form.value = { id: null, faq_kategori_id: '', question: '', answer: '', order_number: items.value.length + 1, is_active: true };
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
    const url = isEditMode.value ? `${apiBaseUrl}/api/faqs/${form.value.id}` : `${apiBaseUrl}/api/faqs`;
    
    await $fetch(url, {
      method,
      body: form.value,
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    
    showToast('success', 'FAQ berhasil disimpan');
    closeModal();
    fetchData();
  } catch (error) {
    showToast('error', 'Gagal menyimpan FAQ');
  } finally {
    isSubmitting.value = false;
  }
};

const openCategoryModal = () => {
  resetCatForm();
  isCategoryModalOpen.value = true;
};

const resetCatForm = () => {
  catForm.value = { id: null, name: '', slug: '', order_number: categories.value.length + 1 };
};

const editCategory = (cat) => {
  catForm.value = { ...cat };
};

const saveCategory = async () => {
  if (!catForm.value.name || !catForm.value.slug) {
    showToast('warning', 'Nama dan slug harus diisi');
    return;
  }
  isSubmitting.value = true;
  try {
    const isEdit = !!catForm.value.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${apiBaseUrl}/api/faq-kategori/${catForm.value.id}` : `${apiBaseUrl}/api/faq-kategori`;
    
    await $fetch(url, {
      method,
      body: catForm.value,
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    
    showToast('success', 'Kategori berhasil disimpan');
    resetCatForm();
    fetchData();
  } catch (error) {
    showToast('error', 'Gagal menyimpan Kategori');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (id, type) => {
  itemToDelete.value = id;
  deleteType.value = type;
  showDeleteModal.value = true;
};

const deleteItem = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    const endpoint = deleteType.value === 'faq' ? `/api/faqs/${itemToDelete.value}` : `/api/faq-kategori/${itemToDelete.value}`;
    await $fetch(`${apiBaseUrl}${endpoint}`, {
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
