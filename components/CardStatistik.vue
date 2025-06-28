<template>
    <div>
      <section class="text-gray-700 body-font">
        <div class="bg-gray-50 px-4 h-25">
          <div class="relative w-full -translate-y-1/2">
            <div class="container px-5 lg:max-w-7xl mx-auto">
              <!-- Menggunakan grid untuk mengatur jumlah kolom -->
              <div class="grid grid-cols-2 translate-y-1/4 md:-translate-y-1 md:grid-cols-4 gap-4 text-center">
                
                <!-- Card Pelatihan Dasar -->
                <div class="p-4">
                  <div class="relative bg-white shadow-2xl border-gray-600 px-3 py-4 w-full h-[150px] rounded-lg transform transition duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-500 w-10 h-10 mb-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 class="title-font font-medium text-2xl text-blue-600">{{ getCategoryCount('Pelatihan Dasar') }}</h2>
                    <p class="leading-relaxed text-sm">Pelatihan Dasar</p>
                  </div>
                </div>
  
                <!-- Card PKA -->
                <div class="p-4">
                  <div class="relative bg-white shadow-2xl border-gray-600 px-3 py-4 w-full h-[150px] rounded-lg transform transition duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500 w-10 h-10 mb-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="title-font font-medium text-2xl text-green-600">{{ getCategoryCount('PKA') }}</h2>
                    <p class="leading-relaxed text-sm">PKA</p>
                    <span class="absolute inset-x-0 bottom-0 h-2 bg-green-300 opacity-0 transition-opacity duration-500 group-hover:opacity-50"></span>
                  </div>
                </div>
  
                <!-- Card PKP -->
                <div class="p-4">
                  <div class="bg-white shadow-2xl border-gray-600 px-3 py-4 w-full h-[150px] rounded-lg transform transition duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-purple-500 w-10 h-10 mb-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h2 class="title-font font-medium text-2xl text-purple-600">{{ getCategoryCount('PKP') }}</h2>
                    <p class="leading-relaxed text-sm">PKP</p>
                  </div>
                </div>
  
                <!-- Card TB/IB -->
                <div class="p-4">
                  <div class="bg-white shadow-2xl border-gray-600 px-3 py-4 w-full h-[150px] rounded-lg transform transition duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-orange-500 w-10 h-10 mb-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 class="title-font font-medium text-2xl text-orange-600">{{ getCategoryCount('TB/IB') }}</h2>
                    <p class="leading-relaxed text-sm">TB/IB</p>
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const categories = ref([]);
  
      const fetchCategoryDistribution = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/koleksi/distribusi-kategori');
          const data = await response.json();
          
          if (data.success) {
            categories.value = data.data;
          }
        } catch (error) {
          console.error('Error fetching category distribution:', error);
        }
      };
  
      const getCategoryCount = (categoryName) => {
        const category = categories.value.find(cat => cat.nama === categoryName);
        return category ? category.total : 0;
      };
  
      onMounted(() => {
        fetchCategoryDistribution();
      });
  
      return {
        categories,
        getCategoryCount
      };
    }
  };
  </script>