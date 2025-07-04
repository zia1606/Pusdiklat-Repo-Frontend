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
              <button 
                @click="toggleMobileFilter"
                class="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
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
                  <option value="popular">Populer</option>
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
                :selectedYear="selectedYear"
                :fixedYears="fixedYears"
                :customStart="customStart"
                :customEnd="customEnd"
                :documentTypes="documentTypes"
                :selectedDocumentTypes="selectedDocumentTypes"
                @update:selectedCategories="selectedCategories = $event"
                @update:selectedYear="selectedYear = $event"
                @update:customStart="customStart = $event"
                @update:customEnd="customEnd = $event"
                @update:selectedDocumentTypes="selectedDocumentTypes = $event"
                @resetFilters="resetFilters"
              />
            </div>

            <!-- Desktop Filters -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200">
              <Filters
                :year-range="yearRange"
                :kategoriList="kategoriList"
                :selectedCategories="selectedCategories"
                :selectedYear="selectedYear"
                :fixedYears="fixedYears"
                :customStart="customStart"
                :customEnd="customEnd"
                :documentTypes="documentTypes"
                :selectedDocumentTypes="selectedDocumentTypes"
                @update:selectedCategories="selectedCategories = $event"
                @update:selectedYear="selectedYear = $event"
                @update:customStart="customStart = $event"
                @update:customEnd="customEnd = $event"
                @update:selectedDocumentTypes="selectedDocumentTypes = $event"
                @resetFilters="resetFilters"
              />
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:w-3/4">
            <!-- Loading State -->
            <!-- <div v-if="isLoading" class="flex justify-center py-12">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Memuat koleksi...</p>
              </div>
            </div> -->
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

            <!-- Koleksi List -->
            <div v-else class="space-y-4">
              <div 
                v-for="item in koleksi.data" 
                :key="item.id" 
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
              >
                <div class="p-6">
                  <!-- Header with category and date -->
                  <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-2 mb-1">
                      <span 
                        v-if="item.kategoriBangKom"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ item.kategoriBangKom }}
                      </span>
                      <span 
                        v-if="item.jenis_dokumen"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ item.jenis_dokumen }}
                      </span>
                    </div>
                  </div>

                  <!-- Title -->
                  <NuxtLink 
  :to="`/detail/${item.id}`"  
                  class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                >
                  {{ item.judul }}
                </NuxtLink>

                  <!-- Author -->
                  <p class="text-sm text-gray-600 mb-2">
                    <span class="font-semibold">Oleh: </span>{{ item.penulis }}
                  </p>

                  <!-- Meta info -->
                  <div class="flex items-center gap-3 text-gray-500 text-sm mb-3">
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ item.tahun_terbit }}</span>
                    </div>
                    <div class="h-4 w-px bg-gray-300"></div>
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-blue-700">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span>{{ item.views ?? 0 }} kali {{ item.youtube_link ? 'dilihat' : 'dibaca' }}</span>
                    </div>
                    <div class="h-4 w-px bg-gray-300"></div>
                    <div>
                      <span 
                        v-if="item.youtube_link"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Video
                      </span>
                      <span 
                        v-else-if="item.dokumen_pdf"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        PDF
                      </span>
                    </div>
                  </div>

                  <!-- Summary -->
                  <p v-if="item.ringkasan" class="text-sm text-gray-600 line-clamp-3 mb-4">
                    {{ item.ringkasan }}
                  </p>

                  <!-- Actions -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="confirmToggleFavorite(item.id)"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-4 w-4 mr-1" 
                          fill="none"
                          :class="{ 'text-yellow-500 fill-yellow-500': isFavorite(item.id), 'text-gray-400': !isFavorite(item.id) }" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Favorit
                      </button>
                      
                      <button 
                        @click="openShareModal(item)"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-4 w-4 mr-1 text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Bagikan
                      </button>
                    </div>

                    <NuxtLink 
  :to="`/detail/${item.id}`" 
  class="hidden md:inline-flex items-center px-2 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  Lihat Detail
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
</NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
<div class="mt-6">
  <!-- Mobile View (Small Screens) -->
  <div class="flex sm:hidden justify-between items-center">
    <button
      @click="goToPrevPage"
      :disabled="!prevPageUrl"
      class="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Prev
    </button>
    
    <!-- Page Selector -->
    <div class="flex items-center gap-2">
      <select
        v-model="currentPage"
        @change="goToSelectedPage"
        class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="page in lastPage" :key="page" :value="page">
          {{ page }}
        </option>
      </select>
      <span class="text-sm text-gray-900">/ {{ lastPage }}</span>
    </div>
    
    <button
      @click="goToNextPage"
      :disabled="!nextPageUrl"
      class="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>

  <!-- Desktop View (Medium Screens and Up) -->
  <div class="hidden sm:flex justify-between items-center">
  <div class="flex items-center gap-2">
    <button
      @click="goToFirstPage"
      :disabled="currentPage === 1"
      class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
      First
    </button>
    
    <button
      @click="goToPrevPage"
      :disabled="!prevPageUrl"
      class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Previous
    </button>
  </div>

  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-900">Halaman</span>
    <select
      v-model="currentPage"
      @change="goToSelectedPage"
      class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-for="page in lastPage" :key="page" :value="page">
        {{ page }}
      </option>
    </select>
    <span class="text-sm text-gray-900">dari {{ lastPage }}</span>
  </div>

  <div class="flex items-center gap-2">
    <button
      @click="goToNextPage"
      :disabled="!nextPageUrl"
      class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    
    <button
  @click="goToLastPage"
  :disabled="currentPage === lastPage"
  class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
>
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
                <input 
                  type="text" 
                  :value="shareLink" 
                  ref="shareInput"
                  readonly
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <button 
                  @click="copyToClipboard"
                  class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Salin
                </button>
              </div>
              
              <!-- Share Buttons -->
              <div class="mt-6">
                <p class="text-sm text-gray-500 mb-3">Bagikan melalui:</p>
                <div class="flex space-x-4">
                  <!-- WhatsApp -->
<button
  @click="shareViaWhatsApp"
  class="inline-flex items-center justify-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
  title="Bagikan via WhatsApp"
>
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
  </svg>
</button>
                  
                  <!-- Twitter -->
                  <button 
                    @click="shareViaTwitter"
                    class="inline-flex items-center justify-center p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                    title="Bagikan via Twitter"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </button>
                  
                  <!-- Facebook -->
                  <!-- <button 
                    @click="shareViaFacebook"
                    class="inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Bagikan via Facebook"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"/>
                    </svg>
                  </button> -->
                  
                  <!-- Email -->
                  <!-- <button 
                    @click="shareViaEmail"
                    class="inline-flex items-center justify-center p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                    title="Bagikan via Email"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                    </svg>
                  </button> -->
                  
                  <!-- Telegram -->
                  <button 
                    @click="shareViaTelegram"
                    class="inline-flex items-center justify-center p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Bagikan via Telegram"
                  >
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
        <button 
          type="button" 
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          @click="closeShareModal"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</div>
    </NuxtLayout>

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
        <button 
  @click="handleDeleteConfirm"
  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
>
  Hapus
</button>
<button 
  @click="handleDeleteCancel"
  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
>
  Batal
</button>
      </div>
    </div>
  </div>
</div>

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

// State
const searchQuery = ref('');
const isMobileFilterOpen = ref(false);
const currentYear = new Date().getFullYear();
const fixedYears = [currentYear, currentYear - 1, currentYear - 5];
const selectedYear = ref(null);
const selectedCategories = ref([]);
const selectedDocumentTypes = ref([]);

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
const documentTypes = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const customStart = ref('');
const customEnd = ref('');
const sortBy = ref('terbaru');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const lastPage = ref(1);
const nextPageUrl = ref(null);
const prevPageUrl = ref(null);
const showShareModal = ref(false);
const shareLink = ref('');
const selectedItem = ref(null);
const hasDataLoaded = ref(false);
const favorites = ref({});

const yearRange = ref({
  min: null,
  max: null
});

const isInitialized = ref(false);

// Computed
const paginationDisplay = computed(() => {
  if (total.value === 0) {
    return { start: 0, end: 0, total: 0 };
  }
  return {
    start: (currentPage.value - 1) * perPage.value + 1,
    end: Math.min(currentPage.value * perPage.value, total.value),
    total: total.value
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
    const res = await axios.get(`${apiBaseUrl}/api/kategori-bang-kom`);
    kategoriList.value = res.data.data;
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error);
  }
};

const getDocumentTypes = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/jenis-dokumen`);
    documentTypes.value = res.data.data;
  } catch (error) {
    console.error('Gagal mengambil data jenis dokumen:', error);
  }
};

const getYearRange = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/koleksi/year-range`);
    yearRange.value = {
      min: res.data.min_year,
      max: res.data.max_year,
    };
    customStart.value = res.data.min_year;
    customEnd.value = res.data.max_year;
  } catch (error) {
    console.error('Gagal mengambil data year range:', error);
  }
};

// PERBAIKAN UTAMA: getKoleksi selalu menggunakan searchQuery.value yang sudah di-set
const getKoleksi = async (overrideSearchQuery = null) => {
  if (isLoading.value) return;
  
  // Cek search dari home jika belum ada searchQuery
  const searchFromHome = checkSearchFromHome();
  
  // Tentukan search query yang akan digunakan
  let finalSearchQuery = overrideSearchQuery !== null ? overrideSearchQuery : searchQuery.value;
  
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
      tahun: selectedYear.value,
      jenisDokumen: selectedDocumentTypes.value,
      customStart: customStart.value,
      customEnd: customEnd.value,
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

    const res = await axios.get(`${apiBaseUrl}/api/koleksi/filter`, { params });
    koleksi.value = res.data;
    currentPage.value = res.data.current_page;
    total.value = res.data.total;
    lastPage.value = res.data.last_page;
    nextPageUrl.value = res.data.next_page_url;
    prevPageUrl.value = res.data.prev_page_url;
    
    console.log('✅ Data loaded, total:', res.data.total, 'items');
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
  selectedDocumentTypes.value = [];
  selectedYear.value = null;
  customStart.value = yearRange.value.min;
  customEnd.value = yearRange.value.max;
  sortBy.value = 'terbaru';
  currentPage.value = 1;
  if (isInitialized.value) {
    getKoleksi(); // Tetap menggunakan searchQuery.value
  }
};

// Di bagian script setup koleksi.vue, tambahkan ref untuk search component
const searchComponent = ref(null);

// Modifikasi fungsi resetFilters untuk juga menghapus search query
const resetFilters2 = () => {
  // Reset semua filter (fungsi yang sudah ada)
  selectedCategories.value = [];
  selectedDocumentTypes.value = [];
  selectedYear.value = null;
  customStart.value = yearRange.value.min;
  customEnd.value = yearRange.value.max;
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
    getKoleksi();
  }
};

const goToLastPage = () => {
  if (currentPage.value !== lastPage.value) {
    currentPage.value = lastPage.value;
    getKoleksi();
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
    getKoleksi();
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



// Add this to your script setup
const showDeleteModal = ref(false)
const koleksiToDelete = ref(null)

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
      getDocumentTypes(),
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
// Watch untuk filters
watch([selectedCategories, selectedYear, selectedDocumentTypes, customStart, customEnd, sortBy], () => {
  if (!isInitialized.value) return;
  console.log('🔧 Filter changed');
  currentPage.value = 1;
  getKoleksi(); // Menggunakan searchQuery.value yang sudah ada
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