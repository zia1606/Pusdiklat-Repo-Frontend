<template>
    <div class="pb-25 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section with Explore Button -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-10 gap-6 px-4">
  <div class="text-left w-full lg:w-auto">
    <!-- New Badge with consistent styling -->
    <!-- <div class="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-blue-800 text-white text-xs font-bold tracking-wide shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      BARU
    </div> -->
    
    <h2 class="text-3xl font-bold text-gray-900 mb-2">
      Koleksi <span class="text-blue-800">Lainnya</span>
    </h2>
    <p class="text-gray-600 max-w-lg">Temukan koleksi terpopuler dan terbaik kami</p>
  </div>

</div>

        <!-- Grid Container -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Kolom Pertama - Koleksi Populer -->
          <div class="rounded-xl border border-gray-300 bg-white shadow overflow-hidden">
            <!-- Header -->
            <div class="flex flex-col space-y-1.5 p-6 relative bg-gradient-to-r from-blue-800 to-blue-700 text-white">
                
              <div class="font-semibold leading-none tracking-tight relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Koleksi Terpopuler
              </div>
              <p class="text-sm text-blue-100">Koleksi dengan jumlah kunjungan terbanyak</p>
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <div class="relative overflow-hidden h-[500px] pr-2">
                <!-- Scroll Area -->
                <div class="h-full w-full overflow-y-auto">
                  <!-- Loading State -->
                  <div v-if="isLoadingPopular" class="flex justify-center py-10">
                    <Loading title="Memuat koleksi populer..." />
                  </div>
                  
                  <!-- Empty State -->
                  <div v-else-if="popularCollections.length === 0" class="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">Tidak ada koleksi populer</h3>
                    <p class="mt-1 text-gray-500">Menampilkan koleksi favorit sebagai alternatif</p>
                  </div>
                  
                  <!-- Collections List -->
                  <div v-else class="space-y-4">
                    <div 
                      v-for="item in popularCollections" 
                      :key="item.id" 
                      class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div class="flex items-start">
                        <!-- Thumbnail -->
                        <!-- <div class="flex-shrink-0 mr-4">
                          <div class="h-12 w-12 bg-blue-50 rounded-md flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div> -->
                        
                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                          <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="block text-lg font-semibold text-gray-900 hover:text-blue-900 line-clamp-1"
                          >
                            {{ item.judul }}
                          </NuxtLink>
                          <p class="text-sm text-gray-500 mt-1">
                            <span class="font-semibold">Oleh: </span>
                             {{ item.penulis }}</p>
                          <div class="mt-2 flex flex-wrap gap-2">
                            <span v-if="item.kategori" class="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {{ item.kategori }}
                            </span>
                            <span v-if="item.jenisDokumen" class="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                              {{ item.jenisDokumen }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Footer -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 text-gray-500 text-sm">
                        
                        <!-- Tahun Terbit -->
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ item.tahun_terbit }}</span>
                        </div>
    
                        <!-- Garis Vertikal -->
                        <div class="h-4 w-px bg-gray-300"></div>
    
                        <!-- Jumlah Baca -->
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-blue-700">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span>{{ item.views || 0 }} kali dibaca</span>
                        </div>
                        
                        </div>
                        
                        <!-- <NuxtLink 
                          :to="`/detail/${item.id}`" 
                          class="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Lihat Detail →
                        </NuxtLink> -->
                        <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="hidden sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                            Lihat Detail
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Kolom Kedua - Koleksi Terbaik -->
          <div class="rounded-xl border border-gray-300 bg-white shadow overflow-hidden">
            <!-- Header -->
            <div class="flex flex-col space-y-1.5 p-6 relative bg-gradient-to-r from-amber-600 to-amber-500 text-white">
              <div class="font-semibold leading-none tracking-tight relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Koleksi Terbaik
              </div>
              <p class="text-sm text-amber-100">Koleksi pilihan dengan kualitas terbaik</p>
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <div class="relative overflow-hidden h-[500px] pr-2">
                <!-- Scroll Area -->
                <div class="h-full w-full overflow-y-auto">
                  <!-- Loading State -->
                  <div v-if="isLoadingBest" class="flex justify-center py-10">
                    <Loading title="Memuat koleksi terbaik..." />
                  </div>
                  
                  <!-- Empty State -->
                  <div v-else-if="bestCollections.length === 0 && mostFavorited.length === 0" class="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">Belum ada koleksi terbaik</h3>
                    <p class="mt-1 text-gray-500">Tidak ada koleksi best collection atau favorit</p>
                  </div>
                  
                  <!-- Collections List -->
                  <div v-else class="space-y-4">
                    <div v-if="bestCollections.length > 0" class="space-y-4">
                    <div 
                    v-for="item in bestCollections" 
                        :key="'best-'+item.id" 
                        class="bg-white rounded-lg border border-gray-200 px-4 pb-4 pt-6 hover:shadow-md transition-shadow duration-200 relative"
                    >
                    <!-- Best Collection Badge -->
                    <div 
                      v-if="bestCollections"
                      class="absolute top-0 right-0 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md"
                    >
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        Best Collection
                      </div>
                    </div>
                      <div class="flex items-start">
                        <!-- Thumbnail -->
                        <!-- <div class="flex-shrink-0 mr-4">
                          <div class="h-12 w-12 bg-amber-50 rounded-md flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                        </div> -->
                        
                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center">
                            <NuxtLink 
                              :to="`/detail/${item.id}`" 
                              class="block text-lg font-semibold text-gray-900 hover:text-amber-600 line-clamp-1"
                            >
                              {{ item.judul }}
                            </NuxtLink>
                          </div>
                          <p class="text-sm text-gray-500 mt-1">
                            <span class="font-semibold">Oleh: </span>
                             {{ item.penulis }}
                          </p>
                          <div class="mt-2 flex flex-wrap gap-2">
                            <span v-if="item.kategori" class="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {{ item.kategori }}
                            </span>
                            <span v-if="item.jenisDokumen" class="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                              {{ item.jenisDokumen }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Footer -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 text-gray-500 text-sm">
                        
                        <!-- Tahun Terbit -->
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ item.tahun_terbit }}</span>
                        </div>
    
                        <!-- Garis Vertikal -->
                        <div class="h-4 w-px bg-gray-300"></div>
    
                        <!-- Jumlah Baca -->
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-amber-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span>{{ item.views || 0 }} kali dibaca</span>
                        </div>
                        
                        </div>
                        
                        <!-- <NuxtLink 
                          :to="`/detail/${item.id}`" 
                          class="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Lihat Detail →
                        </NuxtLink> -->
                        <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="hidden sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                            Lihat Detail
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            </NuxtLink>
                      </div>
                    </div>
                    </div>
  
  <!-- Tampilkan koleksi favorit jika tidak ada best collection -->
  <div v-else class="space-y-4">
                      <div 
                        v-for="item in mostFavorited" 
                        :key="'fav-'+item.id" 
                        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div class="flex items-start">
                          <!-- Thumbnail -->
                          <div class="flex-shrink-0 mr-4">
                            <div class="h-12 w-12 bg-amber-50 rounded-md flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                          </div>
                          
                          <!-- Content -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center">
                              <NuxtLink 
                                :to="`/detail/${item.id}`" 
                                class="block text-lg font-semibold text-gray-900 hover:text-amber-600 line-clamp-1"
                              >
                                {{ item.judul }}
                              </NuxtLink>
                              <!-- <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                {{ item.favorits_count }} ♥
                              </span> -->
                            </div>
                            <p class="text-sm text-gray-500 mt-1">
                              <span class="font-semibold">Oleh: </span>
                              {{ item.penulis }}
                            </p>
                            <div class="mt-2 flex flex-wrap gap-2">
                              <span v-if="item.kategori" class="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                {{ item.kategori }}
                              </span>
                              <span v-if="item.jenisDokumen" class="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                                {{ item.jenisDokumen }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Footer -->
                        <div class="mt-4 flex items-center justify-between">
                          <div class="flex items-center text-sm text-gray-500">
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            class="h-4 w-4 mr-1" 
                            fill="none"
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                            {{ item.favorits_count }} difavoritkan
                          </div>
                          
                          <!-- <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="text-sm font-medium text-amber-600 hover:text-amber-800"
                          > -->
                          <!-- <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="text-sm font-medium text-blue-700 hover:text-blue-800"
                          >
                            Lihat Detail →
                          </NuxtLink> -->
                          <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="hidden sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white hidden sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                            Lihat Detail
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            </NuxtLink>
                        </div>
                      </div>
                    </div>
  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  // State
  const popularCollections = ref([])
  const bestCollections = ref([])
  const mostFavorited = ref([])
  const isLoadingPopular = ref(true)
  const isLoadingBest = ref(true)
  const showingBestCollection = ref(true)
  
  // Fetch popular collections
  const fetchPopularCollections = async () => {
    try {
      isLoadingPopular.value = true
      const response = await $fetch(`${apiBaseUrl}/api/koleksi`, {
        params: {
          sort_by: 'popular',
          per_page: 10
        }
      })
      
      popularCollections.value = response.data.map(item => ({
        id: item.id,
        judul: item.judul,
        penulis: item.penulis || 'Penulis tidak tersedia',
        kategori: item.kategori_bang_kom?.nama,
        jenisDokumen: item.jenis_dokumen?.nama,
        tahun_terbit: item.tahun_terbit,
        views: item.views,
        isBestCollection: item.is_best_collection
      }))
    } catch (error) {
      console.error('Gagal memuat koleksi populer:', error)
    } finally {
      isLoadingPopular.value = false
    }
  }
  
  // Fetch best collections
  const fetchBestCollections = async () => {
    try {
      isLoadingBest.value = true
      
      // Coba ambil best collection terlebih dahulu
      const bestResponse = await $fetch(`${apiBaseUrl}/api/koleksi/best-collections`)
      
      if (bestResponse.success && bestResponse.data.length > 0) {
        bestCollections.value = bestResponse.data.map(item => ({
          id: item.id,
          judul: item.judul,
          penulis: item.penulis || 'Penulis tidak tersedia',
          kategori: item.kategori_bang_kom?.nama,
          jenisDokumen: item.jenis_dokumen?.nama,
          views: item.views,
          tahun_terbit: item.tahun_terbit,
          isBestCollection: true
        }))
        showingBestCollection.value = true
      } else {
        // Jika tidak ada best collection, ambil koleksi dengan favorit tertinggi
        const favResponse = await $fetch(`${apiBaseUrl}/api/koleksi/most-favorited`)
        
        if (favResponse.success) {
          mostFavorited.value = favResponse.data.map(item => ({
            id: item.id,
            judul: item.judul,
            penulis: item.penulis || 'Penulis tidak tersedia',
            kategori: item.kategori_bang_kom?.nama,
            jenisDokumen: item.jenis_dokumen?.nama,
            views: item.views,
            favorits_count: item.favorits_count
          }))
          showingBestCollection.value = false
        }
      }
    } catch (error) {
      console.error('Gagal memuat koleksi terbaik:', error)
    } finally {
      isLoadingBest.value = false
    }
  }
  
  // Lifecycle
  onMounted(() => {
    fetchPopularCollections()
    fetchBestCollections()
  })
  </script>
  
  <style scoped>
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>