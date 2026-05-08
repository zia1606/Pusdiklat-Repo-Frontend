<template>
  <div class="bg-gray-50 min-h-screen">
    <NuxtLayout>
      <!-- Banner Section -->
      <div class="relative">
        <banner />
        <!-- Search Bar Section -->
        <div class="relative w-full -translate-y-1/2">
          <search @search="handleSearch" />
        </div>
      </div>

      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <!-- Header Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center mb-6">
          <!-- Kolom 1: Kosong di lg, Info Pagination di sm/md -->
          <div class="col-span-1 lg:col-span-1 justify-self-start">
            <!-- Tampilkan di sm/md saja -->
            <p class="flex items-baseline text-gray-600 lg:hidden pl-5 text-sm font-medium tracking-wider whitespace-nowrap overflow-hidden">
              Menampilkan {{ paginationDisplay.start }} - {{ paginationDisplay.end }} dari {{ paginationDisplay.total }} koleksi
              <span v-if="searchQuery" class="text-blue-600 font-semibold ml-1 inline-block max-w-[200px] truncate">untuk "{{ searchQuery }}"</span>
            </p>
            <!-- Kosong di lg -->
            <div class="hidden lg:block"></div>
          </div>

          <!-- Kolom 2: Info Pagination (lg only) -->
          <div class="hidden lg:block col-span-1 justify-self-start">
            <p class="flex items-baseline not-first:text-gray-600 pl-5 text-sm font-medium tracking-wider whitespace-nowrap overflow-visible">
              Menampilkan {{ paginationDisplay.start }} - {{ paginationDisplay.end }} dari {{ paginationDisplay.total }} koleksi
              <span v-if="searchQuery" class="text-blue-600 font-semibold ml-1 inline-block max-w-[350px] truncate">untuk "{{ searchQuery }}"</span>
            </p>
          </div>

          <!-- Kolom 3: Kosong (lg) -->
          <div class="hidden lg:block col-span-1"></div>

          <!-- Kolom 4: Tombol Filter dan Urutkan -->
          <div class="col-span-1 md:col-span-1 lg:col-span-1 justify-self-end">
            <div class="flex items-center space-x-4 justify-end">
              <!-- Mobile Filter Button -->
              <button @click="toggleMobileFilter" class="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
                <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter</span>
              </button>

              <!-- Sort Dropdown -->
              <div class="relative">
                <select 
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="appearance-none bg-white pl-3 pr-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="populer">Populer</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Filters Sidebar -->
          <div class="lg:w-1/4">
            <!-- Mobile Filters -->
            <div v-if="isMobileFilterOpen" class="mb-6">
              <Filters
                :year-range="yearRange"
                :isMobileFilterOpen="isMobileFilterOpen"
                :kategoriList="kategoriList"
                :selectedCategories="selectedCategories"
                :customStart="customStart"
                :customEnd="customEnd"
                :penerbitType="penerbitType"
                :selectedStatus="selectedStatus"
                :isAuthenticated="authStore.isAuthenticated"
                @update:selectedCategories="selectedCategories = $event"
                @update:customStart="customStart = $event"
                @update:customEnd="customEnd = $event"
                @update:penerbitType="penerbitType = $event"
                @update:selectedStatus="selectedStatus = $event"
                @resetFilters="resetFilters"
              />
            </div>

            <!-- Desktop Filters -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200">
              <Filters
                :year-range="yearRange"
                :kategoriList="kategoriList"
                :selectedCategories="selectedCategories"
                :customStart="customStart"
                :customEnd="customEnd"
                :penerbitType="penerbitType"
                :selectedStatus="selectedStatus"
                :isAuthenticated="authStore.isAuthenticated"
                @update:selectedCategories="selectedCategories = $event"
                @update:customStart="customStart = $event"
                @update:customEnd="customEnd = $event"
                @update:penerbitType="penerbitType = $event"
                @update:selectedStatus="selectedStatus = $event"
                @resetFilters="resetFilters"
              />
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:w-3/4">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center">
              <Loading title="Memuat koleksi..." />
            </div>

            <!-- Error State -->
            <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="hasDataLoaded && koleksi.data.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">Tidak ada koleksi ditemukan</h3>
              <p class="mt-1 text-gray-500">
                <span v-if="searchQuery">Tidak ada hasil untuk pencarian "{{ searchQuery }}".</span>
                <span v-else>Coba ubah filter pencarian Anda.</span>
              </p>
              <button 
                @click="resetFilters2"
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filter
              </button>
            </div>

            <!-- Koleksi List + Banner -->
            <div v-else>
              <!-- Info Banner -->
              <div v-if="!authStore.isAuthenticated" class="mb-4 rounded-xl overflow-hidden border border-blue-200">
                <div class="bg-blue-50 px-4 py-3 flex flex-wrap items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-blue-700 font-medium">Koleksi yang ditampilkan adalah koleksi yang <strong>aktif</strong> saja.</span>
                  <span class="text-sm text-blue-600">
                    — <NuxtLink to="/auth/login" class="underline font-semibold hover:text-blue-800">Login</NuxtLink> untuk melihat koleksi lengkap.
                  </span>
                </div>
              </div>

              <!-- Daftar Koleksi -->
              <div class="space-y-4">
                <div v-for="item in koleksi.data" :key="item.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative group">
                  <!-- Best Collection Tag - Outer Position -->
                  <div 
                    v-if="item.is_best_collection" 
                    class="absolute top-0 right-0 bg-gradient-to-r from-red-400 to-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg shadow-md z-20"
                  >
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-2.5 h-2.5 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                      </svg>
                      Best Collection
                    </div>
                  </div>
                  <div class="flex">
                    <!-- Thumbnail Kiri -->
                    <div class="flex-shrink-0 w-28 sm:w-36 bg-gray-100 relative">
                      <img
                        v-if="item.thumbnail"
                        :src="item.thumbnail"
                        :alt="item.judul"
                        class="w-full h-full object-cover"
                        style="min-height: 160px;"
                      />
                      <div v-else class="w-full flex flex-col items-center justify-center text-gray-400 p-3" style="min-height: 160px;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span class="text-xs text-center leading-tight">Tidak ada cover</span>
                      </div>
                      
                    </div>

                    <!-- Konten Kanan -->
                    <div class="flex-1 p-4 flex flex-col sm:flex-row min-w-0 gap-3">

                      <!-- Teks Konten (kiri) -->
                      <div class="flex-1 flex flex-col min-w-0">
                        <!-- Badges Kategori & Jenis -->
                        <div class="flex flex-wrap items-center gap-1.5 mb-2">
                          <span v-for="kat in item.kategoris" :key="kat.id" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ kat.nama }}
                          </span>
                        </div>

                        <!-- Judul -->
                        <NuxtLink :to="`/detail/${item.id}`" class="text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1">
                          {{ item.judul }}
                        </NuxtLink>

                        <!-- Penulis -->
                        <p class="text-sm text-gray-600 mb-2">
                          <span class="font-semibold">Oleh: </span>
                          <span v-for="(p, index) in item.penulis_list" :key="p.id">
                            {{ p.nama }}{{ index < item.penulis_list.length - 1 ? ', ' : '' }}
                          </span>
                          <span v-if="!item.penulis_list || item.penulis_list.length === 0">{{ item.penulis }}</span>
                        </p>

                        <!-- Meta -->
                        <div class="flex flex-wrap items-center gap-2 text-gray-500 text-xs mb-2">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ item.tahun_terbit }}</span>
                          </div>
                          <div class="h-3 w-px bg-gray-300"></div>
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3.5 w-3.5 text-blue-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span>{{ item.views ?? 0 }} kali dibaca</span>
                          </div>
                          <!-- Badge PDF/Video + status -->
                          <div class="h-3 w-px bg-gray-300"></div>
                          <template v-if="item.dokumen_pdf">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                              PDF
                            </span>
                          </template>
                          <span v-if="item.is_active === 1" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-600 uppercase tracking-tighter">Active</span>
                          <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 italic">In-Active</span>
                        </div>

                        <!-- Ringkasan -->
                        <p v-if="item.ringkasan" class="hidden sm:block text-sm text-gray-500 line-clamp-2">
                          {{ item.ringkasan }}
                        </p>
                      </div>

                      <!-- Kolom Tombol (kanan bawah / bawah kiri di mobile) -->
                      <div class="flex flex-row sm:flex-col items-center sm:items-end justify-end sm:justify-end gap-2 sm:pl-2 flex-shrink-0">
                        <button
                          @click="confirmToggleFavorite(item.id)"
                          :title="isFavorite(item.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'"
                          class="inline-flex items-center px-5.5 py-1.5 border text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                          :class="isFavorite(item.id)
                            ? 'border-yellow-400 text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'border-gray-200 text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-700'"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" :class="{ 'text-yellow-500 fill-yellow-500': isFavorite(item.id), 'text-gray-400': !isFavorite(item.id) }" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Favorit
                        </button>
                        <NuxtLink
                          :to="`/detail/${item.id}`"
                          class="hidden sm:inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition-colors whitespace-nowrap"
                        >
                          Lihat Detail
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div><!-- end space-y-4 -->

              <!-- Pagination -->
              <div class="mt-6">
                <!-- Mobile View (Small Screens) -->
                <div class="flex sm:hidden justify-between items-center">
                  <button @click="goToPrevPage" :disabled="currentPage <= 1" class="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Prev
                  </button>
    
                <!-- Page Selector -->
                <div class="flex items-center gap-2">
                  <select v-model="currentPage" @change="goToSelectedPage" class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option v-for="page in lastPage" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                  <span class="text-sm text-gray-900">/ {{ lastPage }}</span>
                </div>
    
                <button @click="goToNextPage" :disabled="currentPage >= lastPage" class="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <!-- Desktop View (Medium Screens and Up) -->
              <div class="hidden sm:flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <button @click="goToFirstPage" :disabled="currentPage === 1" class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    First
                  </button>
      
                  <button @click="goToPrevPage" :disabled="currentPage <= 1" class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-900">Halaman</span>
                  <select v-model="currentPage" @change="goToSelectedPage" class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option v-for="page in lastPage" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                  <span class="text-sm text-gray-900">dari {{ lastPage }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <button @click="goToNextPage" :disabled="currentPage >= lastPage" class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
    
                  <button @click="goToLastPage" :disabled="currentPage === lastPage" class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Last
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>
      </main>

    <!-- Update the Share Modal section in your template -->
    <div v-if="showShareModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeShareModal"></div>
          </div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Bagikan Koleksi</h3>
                  <div class="mt-4">
                    <p class="text-sm text-gray-500 mb-2">Bagikan tautan ini untuk mengakses koleksi:</p>
                    <div class="flex items-center">
                      <input type="text" :value="shareLink" ref="shareInput" readonly class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <button @click="copyToClipboard" class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Salin
                      </button>
                    </div>
                    
                    <!-- Share Buttons -->
                    <div class="mt-6">
                      <p class="text-sm text-gray-500 mb-3 text-left">Bagikan melalui:</p>
                      <div class="flex space-x-4">
                        <!-- WhatsApp -->
                        <button @click="shareViaWhatsApp" class="inline-flex items-center justify-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors" title="Bagikan via WhatsApp">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
                          </svg>
                        </button>
                        
                        <!-- Twitter -->
                        <button @click="shareViaTwitter" class="inline-flex items-center justify-center p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors" title="Bagikan via Twitter">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                          </svg>
                        </button>
                        
                        <!-- Telegram -->
                        <button @click="shareViaTelegram" class="inline-flex items-center justify-center p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors" title="Bagikan via Telegram">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeShareModal">
                Tutup
              </button>
            </div>
          </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelDelete"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus dari favorit</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus koleksi ini dari daftar favorit?</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="handleDeleteConfirm" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Hapus
            </button>
            <button @click="handleDeleteCancel" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>

    </NuxtLayout>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import Filters from '@/components/Filters.vue';
  import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
  import debounce from 'lodash/debounce';
  import { useNuxtApp } from '#app';
  import { useToast } from '~/composables/useToast'
  
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  useHead({
    title: 'Daftar Koleksi - Sistem Repositori Pusdiklat BPS'
  })

  const { showToast } = useToast()
  const route = useRoute();
  const router = useRouter();
  const authStore = useUnifiedAuthStore();
  const { apiFetch } = useApi();
  // State
  const searchQuery = ref('');
  const isMobileFilterOpen = ref(false);
  const selectedCategories = ref([]);

  // Data Koleksi
  const koleksi = ref({
    data: [],
    current_page: 1,
    prev_page_url: null,
    next_page_url: null,
    total: 0,
    per_page: 10,
    last_page: 1,
  });

  const kategoriList = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');
  const customStart = ref('');
  const customEnd = ref('');
  const sortBy = ref('terbaru');
  const prevPageUrl = ref(null);
  const showShareModal = ref(false);
  const shareLink = ref('');
  const selectedItem = ref(null);
  const hasDataLoaded = ref(false);
  const favorites = ref({});
  const penerbitType = ref('');
  const selectedStatus = ref('');
  const currentPage = ref(1);
  const perPage = ref(10);
  const total = ref(0);
  const lastPage = ref(1);
  const nextPageUrl = ref(null);

  const yearRange = ref({
    min: null,
    max: null
  });

  const isInitialized = ref(false);
  const showDeleteModal = ref(false);
  const koleksiToDelete = ref(null);

  // Computed
  const paginationDisplay = computed(() => {
    const totalVal = parseInt(total.value) || 0;
    const currentPageVal = parseInt(currentPage.value) || 1;
    const perPageVal = parseInt(perPage.value) || 10;

    if (totalVal === 0) {
      return { start: 0, end: 0, total: 0 };
    }
    return {
      start: (currentPageVal - 1) * perPageVal + 1,
      end: Math.min(currentPageVal * perPageVal, totalVal),
      total: totalVal
    };
  });

  // Functions
  const toggleMobileFilter = () => {
    isMobileFilterOpen.value = !isMobileFilterOpen.value;
  };

  // PERBAIKAN UTAMA: checkSearchFromHome dipanggil di dalam getKoleksi
  const checkSearchFromHome = () => {
    if (process.client && !searchQuery.value) { // Hanya cek jika searchQuery masih kosong
      const searchFromHome = sessionStorage.getItem('searchFromHome');
      if (searchFromHome) {
        console.log('🏠 Found search from home:', searchFromHome);
        searchQuery.value = searchFromHome;
        sessionStorage.removeItem('searchFromHome');
        return searchFromHome;
      }
    }
    return null;
  };

  const getKategori = async () => {
    try {
      const res = await $fetch(`${apiBaseUrl}/api/kategori`, {
        headers: {
          'Accept': 'application/json',
          ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` })
        }
      });
      kategoriList.value = res.data;
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    }
  };


  const getYearRange = async () => {
    try {
      const res = await $fetch(`${apiBaseUrl}/api/koleksi/year-range`, {
        headers: {
          'Accept': 'application/json',
          ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` })
        }
      });
      yearRange.value = {
        min: res.min_year,
        max: res.max_year,
      };
      customStart.value = res.min_year;
      customEnd.value = res.max_year;
    } catch (error) {
      console.error('Gagal mengambil data year range:', error);
    }
  };

  const getKoleksi = async (overrideSearchQuery = null) => {
    if (isLoading.value) return;

    const searchFromHome = checkSearchFromHome(); // Cek search dari home jika belum ada searchQuery
    let finalSearchQuery = overrideSearchQuery !== null ? overrideSearchQuery : searchQuery.value; // Tentukan search query yang akan digunakan
    
    console.log('🔍 getKoleksi called with:');
    console.log('  - overrideSearchQuery:', overrideSearchQuery);
    console.log('  - searchQuery.value:', searchQuery.value);
    console.log('  - searchFromHome:', searchFromHome);
    console.log('  - finalSearchQuery:', finalSearchQuery);
    
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const params = {
        search: finalSearchQuery,
        kategori: selectedCategories.value,
        penerbit_type: penerbitType.value,
        customStart: customStart.value?.toString().length === 4 ? customStart.value : null,
        customEnd: customEnd.value?.toString().length === 4 ? customEnd.value : null,
        status: !authStore.isAuthenticated ? '1' : selectedStatus.value,
        sort_by: sortBy.value,
        page: currentPage.value,
        per_page: perPage.value,
      };

      // Hapus parameter yang null/undefined/empty
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      console.log('📡 API call params:', params);

      const res = await $fetch(`${apiBaseUrl}/api/koleksi/filter`, { 
        params,
        headers: {
          'Accept': 'application/json',
          ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` })
        }
      });
      
      // Robust handling for various API response structures (Root, Wrapped, or Meta)
      const raw = res
      
      // 1. Identify where the items are
      const items = raw.data && Array.isArray(raw.data) ? raw.data : 
                    (raw.data?.data && Array.isArray(raw.data.data) ? raw.data.data : 
                    (Array.isArray(raw) ? raw : []))
                    
      // 2. Identify where the pagination info is
      const pag = raw.meta || (raw.current_page ? raw : (raw.data?.current_page ? raw.data : raw))
      
      // Maintain the object structure for koleksi.value
      koleksi.value = {
        ...pag,
        data: items
      };
      
      currentPage.value = parseInt(pag.current_page) || 1;
      total.value = parseInt(pag.total) || (Array.isArray(items) ? items.length : 0);
      lastPage.value = parseInt(pag.last_page) || 1;
      perPage.value = parseInt(pag.per_page) || 10;
      nextPageUrl.value = pag.next_page_url || raw.links?.next || null;
      prevPageUrl.value = pag.prev_page_url || raw.links?.prev || null;
      
      console.log('✅ Data loaded, total:', total.value, 'items, lastPage:', lastPage.value);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      errorMessage.value = 'Gagal memuat data koleksi.';
    } finally {
      isLoading.value = false;
      hasDataLoaded.value = true;
    }
  };

  const debouncedSearch = debounce((query) => {
    if (!isInitialized.value) return;
    currentPage.value = 1;
    getKoleksi(query);
  }, 500);

  const handleSearch = (query) => {
    console.log('🔍 handleSearch called with:', query);
    searchQuery.value = query;
    debouncedSearch(query);
  };

  const handleSortChange = () => {
    if (!isInitialized.value) return;
    getKoleksi(); // Menggunakan searchQuery.value yang sudah ada
  };

  const resetFilters = () => {
    selectedCategories.value = [];
    customStart.value = yearRange.value.min;
    customEnd.value = yearRange.value.max;
    penerbitType.value = '';
    selectedStatus.value = '';
    sortBy.value = 'terbaru';
    currentPage.value = 1;
    if (isInitialized.value) {
      getKoleksi();
    }
  };

  // Di bagian script setup koleksi.vue, tambahkan ref untuk search component
  const searchComponent = ref(null);

  // Modifikasi fungsi resetFilters untuk juga menghapus search query
  const resetFilters2 = () => {
    selectedCategories.value = [];
    customStart.value = yearRange.value.min;
    customEnd.value = yearRange.value.max;
    penerbitType.value = '';
    selectedStatus.value = '';
    sortBy.value = 'terbaru';
    currentPage.value = 1;
    
    // Reset search query dan clear search input
    searchQuery.value = '';
    
    // Clear search input di komponen search
    if (searchComponent.value) {
      searchComponent.value.clearSearch();
    }
    
    // Update URL untuk menghapus query parameter search
    router.push({ 
      path: route.path, 
      query: {} 
    });
    
    if (isInitialized.value) {
      getKoleksi(''); // Panggil dengan search query kosong
    }
  };

  // Navigation functions
  const goToFirstPage = () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  };

  const goToLastPage = () => {
    if (currentPage.value !== lastPage.value) {
      currentPage.value = lastPage.value;
    }
  };

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToNextPage = () => {
    if (currentPage.value < lastPage.value) {
      currentPage.value++;
    }
  };

  const goToSelectedPage = (event) => {
    const page = parseInt(event.target.value);
    if (page !== currentPage.value) {
      currentPage.value = page;
    }
  };

  // Share modal functions
  const openShareModal = (item) => {
    selectedItem.value = item;
    shareLink.value = `${window.location.origin}/detail/${item.id}`;
    showShareModal.value = true;
  };

  const closeShareModal = () => {
    showShareModal.value = false;
  };

  const copyToClipboard = () => {
    const input = document.createElement('input');
    input.value = shareLink.value;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('success', 'Tautan berhasil disalin ke clipboard')
  };

  // Add these methods to your script setup
  const shareViaWhatsApp = () => {
    const text = `Lihat koleksi "${selectedItem.value.judul}" di: ${shareLink.value}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaTwitter = () => {
    const text = `Lihat koleksi "${selectedItem.value.judul}" di: ${shareLink.value}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink.value)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Koleksi "${selectedItem.value.judul}"`;
    const body = `Saya ingin berbagi koleksi ini dengan Anda:\n\n${selectedItem.value.judul}\n${shareLink.value}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const shareViaTelegram = () => {
    const text = `Lihat koleksi "${selectedItem.value.judul}" di: ${shareLink.value}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Favorite functions - Modified to use unifiedAuthStore
  const isFavorite = (koleksiId) => {
    return favorites.value[koleksiId] || false;
  };

  const confirmToggleFavorite = async (koleksiId) => {
    if (!authStore.isAuthenticated) {
      showToast('warning', 'Silakan masuk terlebih dahulu untuk menambahkan ke favorit')
      await navigateTo('/auth/login')
      return
    }

    if (isFavorite(koleksiId)) {
      showDeleteModal.value = true
      koleksiToDelete.value = koleksiId
    } else {
      await toggleFavorite(koleksiId)
    }
  }

  // And add these handlers for the modal buttons
  const handleDeleteConfirm = async () => {
    if (koleksiToDelete.value) {
      await toggleFavorite(koleksiToDelete.value)
      koleksiToDelete.value = null
      showDeleteModal.value = false
    }
  }

  const handleDeleteCancel = () => {
    koleksiToDelete.value = null
    showDeleteModal.value = false
  }

  const toggleFavorite = async (koleksiId) => {
    try {
      if (isFavorite(koleksiId)) {
        await axios.delete(`${apiBaseUrl}/api/favorit/by-koleksi/${koleksiId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        favorites.value[koleksiId] = false
        showToast('success', 'Koleksi dihapus dari favorit')
      } else {
        await axios.post(`${apiBaseUrl}/api/favorit`, {
          koleksi_id: koleksiId
        }, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        favorites.value[koleksiId] = true
        showToast('success', 'Koleksi ditambahkan ke favorit')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      if (error.response?.status === 401) {
        await authStore.logout()
        await navigateTo('/auth/login')
      }
      showToast('error', 'Gagal mengubah status favorit')
    }
  }




  const showDeleteConfirmation = () => {
    return new Promise((resolve) => {
      showDeleteModal.value = true
      // We'll handle the resolution in the modal buttons
      const unwatch = watch(showDeleteModal, (newVal) => {
        if (!newVal) {
          resolve(false)
          unwatch()
        }
      })
    })
  }

  const confirmDelete = () => {
    showDeleteModal.value = false
    return true
  }

  const cancelDelete = () => {
    showDeleteModal.value = false
    return false
  }

  const loadFavorites = async () => {
    if (!authStore.isAuthenticated) return;

    try {
      const response = await axios.get(`${apiBaseUrl}/api/favorit`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });

      if (response.data.success) {
        response.data.data.forEach(item => {
          favorites.value[item.koleksi_id] = true;
        });
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      if (error.response?.status === 401) {
        await authStore.logout()
        await navigateTo('/auth/login')
      }
    }
  };

  // LIFECYCLE - Modified to use unifiedAuthStore
  onMounted(async () => {
    console.log('🚀 Component mounted');
    
    if (isInitialized.value) return;

    try {
      // Initialize auth
      await authStore.initializeAuth();
      
      // Load basic data
      await Promise.all([
        getKategori(),
        getYearRange()
      ]);

      // Load user data if logged in
      if (authStore.isAuthenticated) {
        await loadFavorites();
      }

      // Handle initial search scenarios
      if (route.query.search) {
        console.log('🔗 URL search detected:', route.query.search);
        searchQuery.value = route.query.search;
        currentPage.value = 1;
      }
      
      // Load data
      await getKoleksi();
      
      isInitialized.value = true;
      console.log('✅ Initialization complete');
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
    }
  });

  // Watch untuk route changes
  watch(route, async (newRoute, oldRoute) => {
    if (!isInitialized.value) return;
    
    const newSearch = newRoute.query.search || '';
    const oldSearch = oldRoute?.query?.search || '';
    
    if (newSearch !== oldSearch) {
      console.log('🔗 Route search changed:', newSearch);
      searchQuery.value = newSearch;
      currentPage.value = 1;
      await getKoleksi();
    }
  }, { immediate: false });

  // Watch untuk currentPage
  watch(currentPage, (newPage, oldPage) => {
    if (!isInitialized.value || newPage === oldPage) return;
    console.log('📄 Page changed to:', newPage);
    getKoleksi(); // Menggunakan searchQuery.value yang sudah ada
  });

  // Watch untuk auth status - Modified for unifiedAuthStore
  watch(() => authStore.isAuthenticated, async (authenticated) => {
    if (authenticated) {
      await loadFavorites();
    } else {
      favorites.value = {};
    }
  });
  const debouncedFilter = debounce(() => {
    if (!isInitialized.value) return;
    console.log('🔧 Filter changed (debounced)');
    currentPage.value = 1;
    getKoleksi();
  }, 500);

  // Watch untuk filters
  watch([selectedCategories, penerbitType, selectedStatus, customStart, customEnd, sortBy], () => {
    debouncedFilter();
  }, { deep: true });
  </script>

  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>