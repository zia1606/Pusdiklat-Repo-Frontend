<template>
    <div :class="{ 'hidden lg:block': !isMobileFilterOpen, 'block': isMobileFilterOpen }">
      <!-- Filter Content -->
      <div class="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <!-- Filter Sections -->
        <div class="divide-y divide-gray-200">
          <!-- Kategori Filter -->
          <div class="px-6 py-2 mt-2">
            <button
              @click="toggleCategoryFilter"
              class="flex w-full items-center justify-between text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <span class="text-sm font-medium uppercase tracking-wider">Kategori</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': isCategoryFilterOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              class="mt-2 space-y-2 transition-all duration-300 overflow-hidden"
              :class="{ 'max-h-96': isCategoryFilterOpen, 'max-h-0': !isCategoryFilterOpen }"
            >
              <div v-for="kategori in kategoriList" :key="kategori.id" class="flex items-center py-1 ml-1">
                <input
                  :id="'kategori-' + kategori.id"
                  type="checkbox"
                  :value="kategori.id"
                  v-model="selectedCategories"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label :for="'kategori-' + kategori.id" class="ml-3 text-sm text-gray-700">
                  {{ kategori.nama }}
                </label>
              </div>
            </div>
          </div>
  
          <!-- Penerbit Filter (New) -->
          <div class="px-6 py-2 mt-2">
            <button
              @click="togglePublisherFilter"
              class="flex w-full items-center justify-between text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <span class="text-sm font-medium uppercase tracking-wider">Penerbit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': isPublisherFilterOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              class="mt-2 space-y-2 transition-all duration-300 overflow-hidden"
              :class="{ 'max-h-96': isPublisherFilterOpen, 'max-h-0': !isPublisherFilterOpen }"
            >
              <div class="flex items-center py-1 ml-1">
                <input
                  id="penerbit-bps"
                  type="radio"
                  value="BPS"
                  v-model="penerbitType"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="penerbit-bps" class="ml-3 text-sm text-gray-700">BPS</label>
              </div>
              <div class="flex items-center py-1 ml-1">
                <input
                  id="penerbit-non-bps"
                  type="radio"
                  value="Non-BPS"
                  v-model="penerbitType"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="penerbit-non-bps" class="ml-3 text-sm text-gray-700">Non-BPS</label>
              </div>
              <div class="flex items-center py-1 ml-1">
                <input
                  id="penerbit-all"
                  type="radio"
                  value=""
                  v-model="penerbitType"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="penerbit-all" class="ml-3 text-sm text-gray-700">Semua</label>
              </div>
            </div>
          </div>
  
          <!-- Tahun Filter -->
          <div class="px-6 py-2 mt-2">
            <button
              @click="toggleYearFilter"
              class="flex w-full items-center justify-between text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <span class="text-sm font-medium uppercase tracking-wider">Tahun</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': isYearFilterOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              class="mt-2 space-y-3 transition-all duration-300 overflow-hidden"
              :class="{ 'max-h-96': isYearFilterOpen, 'max-h-0': !isYearFilterOpen }"
            >
              <div v-for="year in fixedYears" :key="year" class="flex items-center ml-1.5">
                <input
                  type="radio"
                  :id="'year-' + year"
                  name="year-filter"
                  :value="year"
                  v-model="selectedYear"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label :for="'year-' + year" class="ml-3 text-sm text-gray-700">
                  Sejak {{ year }}
                </label>
              </div>
  
              <div class="pt-2">
                <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Pilih Rentang Tahun</h3>
                <div class="flex items-center gap-3 mt-2 mb-2">
                  <div class="flex-1">
                    <input
                      id="custom-start"
                      type="number"
                      v-model="customStart"
                      :min="yearRange.min"
                      :max="yearRange.max"
                      placeholder="Tahun awal"
                      @focus="clearSelectedYear"
                      class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                    />
                  </div>
                  <span class="text-gray-500">-</span>
                  <div class="flex-1">
                    <input
                      id="custom-end"
                      type="number"
                      v-model="customEnd"
                      :min="yearRange.min"
                      :max="yearRange.max"
                      placeholder="Tahun akhir"
                      @focus="clearSelectedYear"
                      class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Status Filter -->
          <div class="px-6 py-2 mt-2 border-t border-gray-200">
            <button
              @click="toggleStatusFilter"
              class="flex w-full items-center justify-between text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <span class="text-sm font-medium uppercase tracking-wider">Status</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': isStatusFilterOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              class="mt-2 space-y-2 transition-all duration-300 overflow-hidden"
              :class="{ 'max-h-96': isStatusFilterOpen, 'max-h-0': !isStatusFilterOpen }"
            >
              <div class="flex items-center py-1 ml-1">
                <input
                  id="status-active"
                  type="radio"
                  value="1"
                  v-model="selectedStatus"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="status-active" class="ml-3 text-sm text-gray-700">Aktif</label>
              </div>
              <div class="flex items-center py-1 ml-1">
                <input
                  id="status-inactive"
                  type="radio"
                  value="0"
                  v-model="selectedStatus"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="status-inactive" class="ml-3 text-sm text-gray-700">Tidak Aktif</label>
              </div>
              <div class="flex items-center py-1 ml-1">
                <input
                  id="status-all"
                  type="radio"
                  value=""
                  v-model="selectedStatus"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="status-all" class="ml-3 text-sm text-gray-700">Semua</label>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="bg-gray-100 px-4 py-3 flex justify-between gap-3">
          <button
            @click="resetFilters"
            class="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Props
  const props = defineProps({
    isMobileFilterOpen: { type: Boolean, required: true },
    kategoriList: { type: Array, required: true },
    selectedCategories: { type: Array, required: true },
    selectedYear: { type: Number, required: true },
    fixedYears: { type: Array, required: true },
    customStart: { type: [Number, String], required: true },
    customEnd: { type: [Number, String], required: true },
    yearRange: { type: Object, required: true },
    penerbitType: { type: String, default: '' },
    selectedStatus: { type: String, default: '' }
  });
  
  // Emits
  const emit = defineEmits([
    'update:selectedCategories',
    'update:selectedYear',
    'update:customStart',
    'update:customEnd',
    'update:penerbitType',
    'update:selectedStatus',
    'resetFilters'
  ]);
  
  // State
  const isCategoryFilterOpen = ref(true);
  const isPublisherFilterOpen = ref(true);
  const isYearFilterOpen = ref(true);
  const isStatusFilterOpen = ref(true);
  
  const toggleCategoryFilter = () => isCategoryFilterOpen.value = !isCategoryFilterOpen.value;
  const togglePublisherFilter = () => isPublisherFilterOpen.value = !isPublisherFilterOpen.value;
  const toggleYearFilter = () => isYearFilterOpen.value = !isYearFilterOpen.value;
  const toggleStatusFilter = () => isStatusFilterOpen.value = !isStatusFilterOpen.value;
  
  // Computed for binding
  const selectedCategories = computed({
    get: () => props.selectedCategories,
    set: (value) => emit('update:selectedCategories', value),
  });
  
  const selectedYear = computed({
    get: () => props.selectedYear,
    set: (value) => {
      if (value !== null) {
        emit('update:customStart', '');
        emit('update:customEnd', '');
      }
      emit('update:selectedYear', value);
    },
  });
  
  const customStart = computed({
    get: () => props.customStart,
    set: (value) => emit('update:customStart', value),
  });
  
  const customEnd = computed({
    get: () => props.customEnd,
    set: (value) => emit('update:customEnd', value),
  });

  const penerbitType = computed({
    get: () => props.penerbitType,
    set: (value) => emit('update:penerbitType', value)
  });

  const selectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value)
  });
  
  const clearSelectedYear = () => emit('update:selectedYear', null);
  
  const resetFilters = () => {
    emit('update:selectedCategories', []);
    emit('update:selectedYear', null);
    emit('update:customStart', props.yearRange.min);
    emit('update:customEnd', props.yearRange.max);
    emit('update:penerbitType', '');
    emit('update:selectedStatus', '');
    emit('resetFilters');
  };
  </script>