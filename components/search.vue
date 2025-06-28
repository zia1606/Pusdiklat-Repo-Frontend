<template>
    <div>
      <div class="relative w-full max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl appearance-none border border-gray-300 shadow-sm">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Masukkan pencarian berdasarkan judul, penulis, dan kata kunci.."
          @keyup.enter="handleSearch"
          class="rounded-lg w-full h-12 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-blue-300 focus:border-blue-300"  
          name="query" 
          id="query"
        />
        <button 
          @click="handleSearch" 
          type="submit" 
          class="cursor-pointer absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white transition duration-150 ease-in-out rounded-lg outline-none right-1 top-1 bg-blue-800 sm:px-6 sm:text-base sm:font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 appearance-none border border-gray-300 shadow-sm"
        >
          <svg class="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Cari
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const searchQuery = ref(''); // State untuk menyimpan query pencarian
  const emit = defineEmits(['search']); // Emit event ke parent component
  
  // Fungsi untuk menangani pencarian
  const handleSearch = () => {
    emit('search', searchQuery.value); // Kirim query pencarian ke parent
    // searchQuery.value = ''; // Kosongkan input setelah pencarian
  };

  // Fungsi untuk menghapus search query (dipanggil dari parent)
  const clearSearch = () => {
    searchQuery.value = '';
  };

  // Expose method agar bisa dipanggil dari parent
  defineExpose({
    clearSearch
  });
  </script>