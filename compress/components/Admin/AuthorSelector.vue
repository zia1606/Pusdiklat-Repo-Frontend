<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
    
    <!-- Selected Authors Chips -->
    <div class="flex flex-wrap gap-2 mb-2">
      <div v-for="author in selectedAuthors" :key="author.id" class="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
        {{ author.nama }}
        <button @click="removeAuthor(author.id)" class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @focus="isDropdownOpen = true"
        @input="handleSearch"
        placeholder="Ketik nama penulis..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
      <div v-if="isLoading" class="absolute right-3 top-2.5">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="isDropdownOpen && (filteredAuthors.length > 0 || searchQuery)" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
      <ul class="py-1">
        <li v-for="author in filteredAuthors" :key="author.id" 
            @click="selectAuthor(author)"
            class="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-sm">
          <span>{{ author.nama }}</span>
          <svg v-if="isSelected(author.id)" class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </li>
        
        <!-- Add New Author Button -->
        <li v-if="filteredAuthors.length === 0 && !isLoading" 
            @click="openAddAuthorModal"
            class="px-4 py-3 text-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
          <p class="text-sm text-gray-500 mb-1">Penulis belum ada atau belum pernah ditambahkan</p>
          <button class="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center m-auto gap-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            TAMBAHKAN PENULIS
          </button>
        </li>
      </ul>
    </div>

    <!-- Hidden Input for Vuelidate/Form -->
    <input type="hidden" :value="selectedIds" name="penulis_ids[]" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import debounce from 'lodash/debounce';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'open-modal']);

const { apiFetch } = useApi();
const searchQuery = ref('');
const allAuthors = ref([]);
const filteredAuthors = ref([]);
const selectedAuthors = ref([...props.modelValue]);
const isDropdownOpen = ref(false);
const isLoading = ref(false);

const selectedIds = computed(() => selectedAuthors.value.map(a => a.id));

const fetchAuthors = async (query = '') => {
  isLoading.value = true;
  try {
    const res = await apiFetch('/penulis', { params: { search: query } });
    allAuthors.value = res.data;
    filteredAuthors.value = res.data.filter(a => !isSelected(a.id));
  } catch (error) {
    console.error('Gagal mengambil penulis:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = debounce(() => {
  fetchAuthors(searchQuery.value);
}, 300);

const selectAuthor = (author) => {
  if (!isSelected(author.id)) {
    selectedAuthors.value.push(author);
    emit('update:modelValue', selectedAuthors.value);
  }
  searchQuery.value = '';
  isDropdownOpen.value = false;
};

const removeAuthor = (id) => {
  selectedAuthors.value = selectedAuthors.value.filter(a => a.id !== id);
  emit('update:modelValue', selectedAuthors.value);
};

const isSelected = (id) => selectedIds.value.includes(id);

const openAddAuthorModal = () => {
  emit('open-modal', 'author');
  isDropdownOpen.value = false;
};

// Sync with modelValue prop
watch(() => props.modelValue, (newVal) => {
  selectedAuthors.value = [...newVal];
}, { deep: true });

onMounted(() => {
  fetchAuthors();
  
  // Close dropdown on click outside
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      isDropdownOpen.value = false;
    }
  });
});
</script>
