<template>
    <div :class="{ 'hidden lg:block': !isMobileFilterOpen, 'block': isMobileFilterOpen }">
      <!-- Filter Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <!-- Filter Sections -->
        <div class="p-5 space-y-5">
          <!-- Kategori Filter -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
            <div class="relative group">
              <select 
                v-model="singleCategory"
                class="block w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option :value="null">Semua Kategori</option>
                <option v-for="kategori in kategoriList" :key="kategori.id" :value="kategori.id">
                  {{ kategori.nama }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
  
          <!-- Penerbit Filter -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Penerbit</label>
            <div class="relative group">
              <select 
                v-model="penerbitType"
                class="block w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="">Semua Penerbit</option>
                <option value="BPS">BPS</option>
                <option value="Non-BPS">Non-BPS</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <!-- Status Filter -->
          <div v-if="isAuthenticated" class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
            <div class="relative group">
              <select 
                v-model="selectedStatus"
                class="block w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="1">Aktif</option>
                <option value="0">Tidak Aktif</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
  
          <!-- Tahun Filter -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tahun</label>
            <div class="flex items-center gap-2">
              <input
                type="number"
                v-model="customStart"
                :min="yearRange.min"
                :max="yearRange.max"
                placeholder="Awal"
                class="block w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none text-center"
              />
              <span class="text-gray-300 font-bold">-</span>
              <input
                type="number"
                v-model="customEnd"
                :min="yearRange.min"
                :max="yearRange.max"
                placeholder="Akhir"
                class="block w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none text-center"
              />
            </div>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            @click="resetFilters"
            class="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 hover:text-gray-700 transition-all shadow-sm"
          >
            Reset Filter
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
    customStart: { type: [Number, String], required: true },
    customEnd: { type: [Number, String], required: true },
    yearRange: { type: Object, required: true },
    penerbitType: { type: String, default: '' },
    selectedStatus: { type: String, default: '' },
    isAuthenticated: { type: Boolean, default: false }
  });
  
  // Emits
  const emit = defineEmits([
    'update:selectedCategories',
    'update:customStart',
    'update:customEnd',
    'update:penerbitType',
    'update:selectedStatus',
    'resetFilters'
  ]);
  
  // State (No longer needed for accordions)
  
  // Computed for binding
  const singleCategory = computed({
    get: () => props.selectedCategories.length > 0 ? props.selectedCategories[0] : null,
    set: (value) => emit('update:selectedCategories', value !== null ? [value] : []),
  });
  
  const selectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value),
  });

  const penerbitType = computed({
    get: () => props.penerbitType,
    set: (value) => emit('update:penerbitType', value),
  });

  const customStart = computed({
    get: () => props.customStart,
    set: (value) => emit('update:customStart', value),
  });
  
  const customEnd = computed({
    get: () => props.customEnd,
    set: (value) => emit('update:customEnd', value),
  });

  const resetFilters = () => {
    emit('update:selectedCategories', []);
    emit('update:customStart', props.yearRange.min);
    emit('update:customEnd', props.yearRange.max);
    emit('update:penerbitType', '');
    emit('update:selectedStatus', '');
    emit('resetFilters');
  };
  </script>