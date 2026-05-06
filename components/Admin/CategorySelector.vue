<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Category Select -->
    <div>
      <div class="flex justify-between items-center mb-1">
        <label class="block text-sm font-medium text-gray-700">Kategori</label>
        <button @click="$emit('open-modal', 'category')" type="button" class="text-blue-600 text-[10px] font-bold hover:underline">
          + TAMBAH KATEGORI
        </button>
      </div>
      <select
        v-model="selectedCategoryId"
        @change="handleCategoryChange"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">Pilih Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama }}</option>
      </select>
    </div>

    <!-- Sub-Category Select -->
    <div>
      <div class="flex justify-between items-center mb-1">
        <label class="block text-sm font-medium text-gray-700">Sub Kategori</label>
        <button v-if="selectedCategoryId" @click="$emit('open-modal', 'subcategory', selectedCategoryId)" type="button" class="text-blue-600 text-[10px] font-bold hover:underline">
          + TAMBAH SUB
        </button>
      </div>
      <select
        v-model="selectedSubCategoryId"
        @change="handleSubCategoryChange"
        :disabled="!selectedCategoryId"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Pilih Sub Kategori</option>
        <option v-for="sub in subCategories" :key="sub.id" :value="sub.id">{{ sub.nama }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  categoryValue: { type: [String, Number], default: '' },
  subCategoryValue: { type: [String, Number], default: '' }
});

const emit = defineEmits(['update:categoryValue', 'update:subCategoryValue', 'open-modal']);

const { apiFetch } = useApi();
const categories = ref([]);
const subCategories = ref([]);
const selectedCategoryId = ref(props.categoryValue);
const selectedSubCategoryId = ref(props.subCategoryValue);

const fetchCategories = async () => {
  try {
    const res = await apiFetch('/kategori');
    categories.value = res.data;
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
  }
};

const fetchSubCategories = async (catId) => {
  if (!catId) {
    subCategories.value = [];
    return;
  }
  try {
    const res = await apiFetch('/sub-kategori', { params: { kategori_id: catId } });
    subCategories.value = res.data;
  } catch (error) {
    console.error('Gagal mengambil sub-kategori:', error);
  }
};

const handleCategoryChange = () => {
  emit('update:categoryValue', selectedCategoryId.value);
  selectedSubCategoryId.value = '';
  emit('update:subCategoryValue', '');
  fetchSubCategories(selectedCategoryId.value);
};

const handleSubCategoryChange = () => {
  emit('update:subCategoryValue', selectedSubCategoryId.value);
};

// Sync with props
watch(() => props.categoryValue, (newVal) => {
  selectedCategoryId.value = newVal;
  fetchSubCategories(newVal);
});

watch(() => props.subCategoryValue, (newVal) => {
  selectedSubCategoryId.value = newVal;
});

onMounted(() => {
  fetchCategories();
  if (props.categoryValue) {
    fetchSubCategories(props.categoryValue);
  }
});

// Method to refresh data (called after adding via modal)
defineExpose({
  refresh: () => {
    fetchCategories();
    if (selectedCategoryId.value) fetchSubCategories(selectedCategoryId.value);
  }
});
</script>
