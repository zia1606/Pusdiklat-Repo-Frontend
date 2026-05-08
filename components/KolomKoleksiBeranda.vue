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
    
    <h2 class="text-3xl font-bold text-gray-900 mb-2 mt-20 md:mt-0">
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
            <div class="flex flex-col space-y-1.5 p-6 relative bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                
              <div class="font-semibold leading-none tracking-tight relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Koleksi Terpopuler
              </div>
              <p class="text-sm text-amber-50">Koleksi dengan jumlah kunjungan terbanyak</p>
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
                      <div class="flex items-stretch gap-4">
                        <!-- Thumbnail Portrait -->
                        <div class="flex-shrink-0 w-24 sm:w-28 relative">
                          <div class="aspect-[2/3] bg-amber-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                            <img 
                              v-if="item.thumbnail" 
                              :src="item.thumbnail" 
                              :alt="item.judul"
                              class="w-full h-full object-cover"
                            />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1 flex flex-col min-w-0">
                          <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="block text-lg font-bold text-gray-900 hover:text-amber-600 line-clamp-1 transition-colors"
                          >
                            {{ item.judul }}
                          </NuxtLink>
                          
                          <!-- Info Badges -->
                          <div class="flex flex-wrap gap-1.5 mt-1.5">
                            <span v-for="kat in item.kategoris" :key="kat.id" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-800 uppercase">
                              {{ kat.nama }}
                            </span>
                            <span v-if="item.is_active === 1" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-600 uppercase tracking-tighter">
                              Active
                            </span>
                            <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-gray-100 text-gray-500 italic">
                              In-Active
                            </span>
                          </div>

                          <p class="text-sm text-gray-500 mt-2">
                            <span class="font-semibold text-gray-400">Oleh: </span>
                            <span v-for="(p, idx) in item.penulis_list" :key="p.id">
                              {{ p.nama }}{{ idx < item.penulis_list.length - 1 ? ', ' : '' }}
                            </span>
                          </p>

                          <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{{ item.tahun_terbit }}</span>
                            </div>
                            <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              <span>{{ item.views || 0 }} kali dibaca</span>
                            </div>
                          </div>

                          <!-- Spacer -->
                          <div class="flex-grow"></div>

                          <!-- Themed Button -->
                          <div class="mt-4 flex justify-end">
                            <NuxtLink 
                              :to="`/detail/${item.id}`" 
                              class="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-sm shadow-amber-200"
                            >
                              Lihat Detail
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  
          <!-- Kolom Kedua - Koleksi Terbaik -->
          <div class="rounded-xl border border-gray-300 bg-white shadow overflow-hidden">
            <!-- Header -->            <div class="flex flex-col space-y-1.5 p-6 relative bg-gradient-to-r from-red-600 to-red-500 text-white">
              <div class="font-semibold leading-none tracking-tight relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Koleksi Terbaik
              </div>
              <p class="text-sm text-red-50">Koleksi yang direkomendasikan pengelola</p>
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
                    <div class="flex items-stretch gap-4">
                        <!-- Thumbnail Portrait -->
                        <div class="flex-shrink-0 w-24 sm:w-28 relative">
                          <div class="aspect-[2/3] bg-red-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                            <img 
                              v-if="item.thumbnail" 
                              :src="item.thumbnail" 
                              :alt="item.judul"
                              class="w-full h-full object-cover"
                            />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1 flex flex-col min-w-0">
                          <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="block text-lg font-bold text-gray-900 hover:text-red-600 line-clamp-1 transition-colors"
                          >
                            {{ item.judul }}
                          </NuxtLink>
                          
                          <!-- Info Badges -->
                          <div class="flex flex-wrap gap-1.5 mt-1.5">
                            <span v-for="kat in item.kategoris" :key="kat.id" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-800 uppercase">
                              {{ kat.nama }}
                            </span>
                            <span v-if="item.is_active === 1" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-600 uppercase tracking-tighter">
                              Active
                            </span>
                            <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-gray-100 text-gray-500 italic">
                              In-Active
                            </span>
                          </div>

                          <p class="text-sm text-gray-500 mt-2">
                            <span class="font-semibold text-gray-400">Oleh: </span>
                            <span v-for="(p, idx) in item.penulis_list" :key="p.id">
                              {{ p.nama }}{{ idx < item.penulis_list.length - 1 ? ', ' : '' }}
                            </span>
                          </p>

                          <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{{ item.tahun_terbit }}</span>
                            </div>
                            <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              <span>{{ item.views || 0 }} kali dibaca</span>
                            </div>
                          </div>

                          <!-- Spacer -->
                          <div class="flex-grow"></div>

                          <!-- Themed Button -->
                          <div class="mt-4 flex justify-end">
                            <NuxtLink 
                              :to="`/detail/${item.id}`" 
                              class="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm shadow-red-200"
                            >
                              Lihat Detail
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </NuxtLink>
                          </div>
                        </div>
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
                      <div class="flex items-stretch gap-4">
                        <!-- Thumbnail Portrait -->
                        <div class="flex-shrink-0 w-24 sm:w-28 relative">
                          <div class="aspect-[2/3] bg-amber-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                            <img 
                              v-if="item.thumbnail" 
                              :src="item.thumbnail" 
                              :alt="item.judul"
                              class="w-full h-full object-cover"
                            />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1 flex flex-col min-w-0">
                          <NuxtLink 
                            :to="`/detail/${item.id}`" 
                            class="block text-lg font-bold text-gray-900 hover:text-amber-600 line-clamp-1 transition-colors"
                          >
                            {{ item.judul }}
                          </NuxtLink>
                          
                          <!-- Info Badges -->
                          <div class="flex flex-wrap gap-1.5 mt-1.5">
                            <span v-for="kat in item.kategoris" :key="kat.id" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-800 uppercase">
                              {{ kat.nama }}
                            </span>
                            <span v-if="item.is_active === 1" class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-600 uppercase tracking-tighter">
                              Active
                            </span>
                            <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-gray-100 text-gray-500 italic">
                              In-Active
                            </span>
                          </div>

                          <p class="text-sm text-gray-500 mt-2">
                            <span class="font-semibold text-gray-400">Oleh: </span>
                            <span v-for="(p, idx) in item.penulis_list" :key="p.id">
                              {{ p.nama }}{{ idx < item.penulis_list.length - 1 ? ', ' : '' }}
                            </span>
                          </p>

                          <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                              </svg>
                              <span>{{ item.favorits_count || 0 }} difavoritkan</span>
                            </div>
                            <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              <span>{{ item.views || 0 }} kali dibaca</span>
                            </div>
                          </div>

                          <!-- Spacer -->
                          <div class="flex-grow"></div>

                          <!-- Themed Button -->
                          <div class="mt-4 flex justify-end">
                            <NuxtLink 
                              :to="`/detail/${item.id}`" 
                              class="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-sm shadow-amber-200"
                            >
                              Lihat Detail
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  const { apiFetch } = useApi();
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
      const response = await apiFetch('/koleksi', {
        params: {
          sort_by: 'popular',
          per_page: 10
        }
      })
      
      popularCollections.value = response.data.map(item => ({
        id: item.id,
        judul: item.judul,
        penulis_list: item.penulis_list,
        kategoris: item.kategoris,
        tahun_terbit: item.tahun_terbit,
        views: item.views,
        isBestCollection: item.is_best_collection,
        thumbnail: item.thumbnail,
        is_active: item.is_active
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
      const bestResponse = await apiFetch('/koleksi/best-collections')
      
      if (bestResponse.success && bestResponse.data.length > 0) {
        bestCollections.value = bestResponse.data.map(item => ({
          id: item.id,
          judul: item.judul,
          penulis_list: item.penulis_list,
          kategoris: item.kategoris,
          views: item.views,
          tahun_terbit: item.tahun_terbit,
          isBestCollection: true,
          thumbnail: item.thumbnail,
          is_active: item.is_active
        }))
        showingBestCollection.value = true
      } else {
        // Jika tidak ada best collection, ambil koleksi dengan favorit tertinggi
        const favResponse = await apiFetch('/koleksi/most-favorited')
        
        if (favResponse.success) {
          mostFavorited.value = favResponse.data.map(item => ({
            id: item.id,
            judul: item.judul,
            penulis_list: item.penulis_list,
            kategoris: item.kategoris,
            views: item.views,
            favorits_count: item.favorits_count,
            thumbnail: item.thumbnail,
            is_active: item.is_active
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