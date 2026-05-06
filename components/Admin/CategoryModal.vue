<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>
      <span class="hidden sm:inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full border border-gray-100">
        <div class="bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white" id="modal-title">
            {{ isSub ? 'Tambah Sub Kategori' : 'Tambah Kategori Baru' }}
          </h3>
          <button @click="close" class="text-white hover:text-gray-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submit">
          <div class="px-6 py-6 space-y-4">
            <div v-if="isSub">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Kategori Induk</label>
              <select 
                v-model="form.kategori_id" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm bg-gray-50 cursor-not-allowed"
                disabled
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                {{ isSub ? 'Nama Sub Kategori' : 'Nama Kategori' }}
              </label>
              <input 
                v-model="form.nama" 
                type="text" 
                :placeholder="isSub ? 'Masukkan nama sub kategori...' : 'Masukkan nama kategori...'"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
              />
              <p v-if="error" class="mt-1 text-xs text-red-600 font-medium">{{ error }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100">
            <button 
              type="submit" 
              :disabled="isLoading"
              class="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <span v-if="isLoading">Menyimpan...</span>
              <span v-else>Simpan {{ isSub ? 'Sub Kategori' : 'Kategori' }}</span>
            </button>
            <button 
              @click="close" 
              type="button" 
              class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useToast } from '~/composables/useToast';

const props = defineProps({
  isOpen: Boolean,
  type: String, // 'category' or 'subcategory'
  parentId: [String, Number]
});

const emit = defineEmits(['close', 'success']);
const { apiFetch } = useApi();
const { showToast } = useToast();

const isSub = computed(() => props.type === 'subcategory');
const categories = ref([]);
const form = reactive({
  nama: '',
  kategori_id: props.parentId || ''
});
const isLoading = ref(false);
const error = ref('');

const fetchCategories = async () => {
  try {
    const res = await apiFetch('/kategori');
    categories.value = res.data;
  } catch (err) {}
};

watch(() => props.parentId, (newVal) => {
  form.kategori_id = newVal;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchCategories();
    form.nama = '';
    error.value = '';
    form.kategori_id = props.parentId || '';
  }
});

const close = () => {
  emit('close');
};

const submit = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const endpoint = isSub.value ? '/sub-kategori' : '/kategori';
    const res = await apiFetch(endpoint, {
      method: 'POST',
      body: form
    });
    showToast('success', `${isSub.value ? 'Sub Kategori' : 'Kategori'} berhasil ditambahkan!`);
    emit('success', res.data);
    close();
  } catch (err) {
    console.error(err);
    error.value = err.response?._data?.message || 'Gagal menambahkan data.';
    showToast('error', error.value);
  } finally {
    isLoading.value = false;
  }
};
</script>
