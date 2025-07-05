<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <HeaderAdmin 
        :pageTitle="pageTitle" 
        @toggle-sidebar="toggleSidebar" 
      />
  
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <slot />
        
    <div>
      <!-- Top Action Bar (Search, Sort, Filter) -->
      <div class="flex flex-col sm:flex-row gap-4 mb-4 w-full">
        <!-- Search (left-aligned, full width on mobile) -->
        <div class="w-full sm:w-auto sm:flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau keywords..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="applyFilters"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
  
        <!-- Sort and Filter (right-aligned on all screens) -->
          
        <div class="flex gap-4 justify-end">
          <!-- Sorting Dropdown -->
           <div class="relative">
          <select
            v-model="sortBy"
            class="appearance-none cursor-pointer hover:bg-gray-50 shadow-sm pl-3 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            @change="applyFilters"
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
  
        <div class="relative">
          <!-- Filter Button -->
          <button
            @click="openFilterModal"
            class="flex items-center cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg justify-center shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <svg
              class="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
        </div>
        </div>
      </div>
  
      <!-- Second Action Bar (Bulk Actions) -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
  <!-- Selected Items Info - shown on md/lg screens (left-aligned) -->
  <div v-if="selectedItems.length > 0" class="text-md font-semibold text-gray-600 pl-2 hidden sm:block">
    {{ selectedItems.length }} terpilih
  </div>
  
  <!-- Bulk Actions (right-aligned) -->
  <div class="flex gap-2 sm:ml-auto justify-end">
    <button
      @click="markSelectedAsBest(true)"
      :disabled="selectedItems.length === 0"
      class="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
    <span class="sm:hidden lg:hidden">Tandai</span>
      <span class="hidden sm:inline lg:hidden">Tandai</span>
      <span class="hidden lg:inline">Tandai Best Collection</span>
    </button>
    <button
      @click="markSelectedAsBest(false)"
      :disabled="selectedItems.length === 0"
      class="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
      <span class="sm:hidden lg:hidden">Hapus</span>
      <span class="hidden sm:inline lg:hidden">Hapus</span>
      <span class="hidden lg:inline">Hapus Best Collection</span>
    </button>
    <NuxtLink
      :to="`/admin/formKoleksi`"
      class="flex items-center px-3 bg-blue-600 border border-gray-200 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1 mt-0.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
      <span class="sm:hidden lg:hidden">Tambah</span>
      <span class="hidden sm:inline lg:hidden">Tambah</span>
      <span class="hidden lg:inline">Tambah Koleksi</span>
    </NuxtLink>
  </div>
  
  <!-- Selected Items Info - shown on sm screens (appears below buttons) -->
  <div v-if="selectedItems.length > 0" class="text-md font-semibold text-gray-600 pl-2 sm:hidden">
    {{ selectedItems.length }} terpilih
  </div>
  </div>
  
      <!-- Table Container -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <!-- Responsive Table -->
        <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100">
    <tr>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
        <input
          type="checkbox"
          v-model="selectAll"
          @change="toggleSelectAll"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Konten</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Bangkom</th>
      <!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th> -->
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diperbarui</th>
    </tr>
  </thead>
  
  <tbody class="bg-white divide-y divide-gray-200">
    <tr v-for="item in koleksi" :key="item.id" class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap w-12">
        <input
          type="checkbox"
          :value="item.id"
          v-model="selectedItems"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      
      <!-- Kolom Judul -->
      <td class="px-6 py-4 max-w-[240px]">
        <div class="text-sm font-medium text-gray-900 truncate" :title="item.judul">
          {{ item.judul }}
        </div>
      </td>

      <!-- Kolom Penulis -->
      <td class="px-6 py-4 max-w-[180px]">
        <div class="text-sm text-gray-500 truncate" :title="item.penulis">
          {{ item.penulis }}
        </div>
      </td>
      
      <!-- Kolom Tipe Konten -->
      <td class="px-6 py-4 whitespace-nowrap">
        <span v-if="item.youtube_link" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          YouTube
        </span>
        <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          PDF
        </span>
      </td>
      
      <!-- Kolom Jenis Dokumen -->
      <td class="px-6 py-4 max-w-[150px]">
        <div class="text-sm text-gray-500 truncate" :title="item.jenis_dokumen">
          {{ item.jenis_dokumen }}
        </div>
      </td>
      
      <!-- Kolom Kategori Bangkom -->
      <td class="px-6 py-4 max-w-[150px]">
        <div class="text-sm text-gray-500 truncate" :title="item.kategoriBangKom">
          {{ item.kategoriBangKom }}
        </div>
      </td>
      
      <!-- Kolom Tahun Terbit -->
      <!-- <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">{{ item.tahun_terbit }}</div>
      </td> -->
      
      <!-- Kolom Status -->
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          v-if="item.is_best_collection"
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
        >
          Best Collection
          <button 
            @click.stop="unmarkAsBest(item.id)"
            class="ml-1 text-red-600 hover:text-red-900"
            title="Remove from Best Collection"
          >
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span
          v-else
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
        >
          Regular
        </span>
      </td>
      
      <!-- Kolom Actions -->
      <td class="text-gray-600 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div class="flex justify-end space-x-3">
          <!-- View Button -->
          <button
            @click="viewContent(item)"
            class="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110 cursor-pointer"
            :title="item.youtube_link ? 'Lihat Video' : 'Lihat PDF'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <!-- Edit Button -->
          <NuxtLink :to="`/admin/${item.id}`" class="w-4 mr-2 transform hover:text-blue-500 hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </NuxtLink>
          
          <!-- Delete Button -->
          <button
            @click.stop="confirmDelete(item.id)"
            class="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>

      <!-- Kolom Updated At -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">
          {{ formatDate(item.updated_at) }}
        </div>
      </td>
    </tr>
    <tr v-if="koleksi.length === 0">
      <td colspan="10" class="px-6 py-4 text-center text-sm text-gray-500">
        No collections found
      </td>
    </tr>
  </tbody>
    </table>
  </div>
  
        <!-- Pagination -->
        <div class="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between items-center sm:hidden">
            <button
              @click="goToPrevPage"
              :disabled="!prevPageUrl"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span class="text-sm text-gray-700">
              Hal {{ currentPage }} / {{ lastPage }}
            </span>
            <button
              @click="goToNextPage"
              :disabled="!nextPageUrl"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> -
                <span class="font-medium">{{ Math.min(currentPage * perPage, total) }}</span> dari
                <span class="font-medium">{{ total }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="goToPrevPage"
                  :disabled="!prevPageUrl"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  @click="goToNextPage"
                  :disabled="!nextPageUrl"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filter Modal -->
      <div v-if="isFilterModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeFilterModal"></div>
          </div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Koleksi</h3>
                  
                  <!-- Categories Section -->
                  <div class="mb-6">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Kategori Bangkom</h4>
                    <div class="relative mb-2">
                      <input
                        v-model="searchKategori"
                        type="text"
                        placeholder="Cari kategori bangkom..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <svg
                        class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      <div v-for="kategori in filteredKategoriList" :key="kategori.id" class="flex items-center mb-2">
                        <input
                          type="checkbox"
                          :id="`kategori-${kategori.id}`"
                          :value="kategori.id"
                          v-model="selectedKategori"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`kategori-${kategori.id}`" class="ml-2 text-sm text-gray-700">
                          {{ kategori.nama }}
                        </label>
                      </div>
                      <div v-if="filteredKategoriList.length === 0" class="text-sm text-gray-500 py-2 text-center">
                        Kategori tidak ditemukan
                      </div>
                    </div>
                  </div>
  
                  <!-- Document Types Section -->
                  <div class="mb-6">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Jenis Dokumen</h4>
                    <div class="relative mb-2">
                      <input
                        v-model="searchJenisDokumen"
                        type="text"
                        placeholder="Cari jenis dokumen..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <svg
                        class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      <div v-for="jenis in filteredJenisDokumenList" :key="jenis.id" class="flex items-center mb-2">
                        <input
                          type="checkbox"
                          :id="`jenis-${jenis.id}`"
                          :value="jenis.id"
                          v-model="selectedJenisDokumen"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`jenis-${jenis.id}`" class="ml-2 text-sm text-gray-700">
                          {{ jenis.nama }}
                        </label>
                      </div>
                      <div v-if="filteredJenisDokumenList.length === 0" class="text-sm text-gray-500 py-2 text-center">
                        Jenis dokumen tidak ditemukan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                @click="applyFilters"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Terapkan
              </button>
              <button
                type="button"
                @click="closeFilterModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Koleksi</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus koleksi ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button 
          @click="deleteKoleksi"
          :disabled="isDeleting"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          <span v-if="!isDeleting">Hapus</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menghapus...
          </span>
        </button>
        <button 
          @click="cancelDelete"
          :disabled="isDeleting"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Mark as Best Collection Confirmation Modal -->
  <div v-if="showMarkBestModal" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelMarkBest"></div>
      </div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Tandai Best Collection</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin menandai {{ selectedItems.length }} koleksi terpilih sebagai Best Collection?</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmMarkBest(true)"
            :disabled="isMarking"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isMarking">Ya, Tandai</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelMarkBest"
            :disabled="isMarking"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Unmark as Best Collection Confirmation Modal -->
  <div v-if="showUnmarkBestModal" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelUnmarkBest"></div>
      </div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Best Collection</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus {{ selectedItems.length }} koleksi terpilih dari Best Collection?</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmMarkBest(false)"
            :disabled="isMarking"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isMarking">Ya, Hapus</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelUnmarkBest"
            :disabled="isMarking"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Unmark Single Item Confirmation Modal -->
  <div v-if="showUnmarkSingleModal" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelUnmarkSingle"></div>
      </div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Best Collection</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus koleksi ini dari Best Collection?</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmUnmarkSingle"
            :disabled="isMarking"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isMarking">Ya, Hapus</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelUnmarkSingle"
            :disabled="isMarking"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>

    </div>
  
  </div>
      </main>
    </div>

    <!-- Toast Component -->
<Toast />

  </div>
  </template>
  
  <script setup>
// Import statements
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo } from '#imports'
import axios from 'axios'
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import { NuxtLink } from '#components'
// Di bagian atas script setup
import { useToast } from '~/composables/useToast'
const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Kelola Koleksi - Sistem Repositori Pusdiklat BPS'
})

const { showToast } = useToast()

// State untuk modal konfirmasi
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const isDeleting = ref(false)
// State for modals
const showMarkBestModal = ref(false)
const showUnmarkBestModal = ref(false)
const showUnmarkSingleModal = ref(false)
const isMarking = ref(false)
const itemToMark = ref(null)

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('Tabel Koleksi')

// Di parent component (Layout Admin)
const showSidebar = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// State for collections
const koleksi = ref([])
const isLoading = ref(false)
const errorMessage = ref("")
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const lastPage = ref(1)
const nextPageUrl = ref(null)
const prevPageUrl = ref(null)

// State for filters
const searchQuery = ref("")
const selectedKategori = ref([])
const selectedJenisDokumen = ref([])
const sortBy = ref("terbaru")
const isFilterModalOpen = ref(false)
const searchKategori = ref("")
const searchJenisDokumen = ref("")
const kategoriList = ref([])
const jenisDokumenList = ref([])

// State for selection
const selectedItems = ref([])
const selectAll = ref(false)

// Authentication check menggunakan unified auth
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }

  if (!authStore.canAccessAdmin) {
    alert('Akses ditolak. Hanya admin yang dapat mengakses halaman ini.')
    await navigateTo('/')
    return false
  }

  try {
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      alert('Sesi telah berakhir, silakan login kembali')
      await navigateTo('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    alert('Terjadi kesalahan saat verifikasi sesi')
    await authStore.logout()
    await navigateTo('/auth/login')
    return false
  }
}

// Watch for changes in the collection data to reset selectAll
watch(koleksi, () => {
  selectAll.value = false
})

// Toggle select all items
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = koleksi.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

// Modify the markSelectedAsBest function to show confirmation modal
const markSelectedAsBest = (markAsBest = true) => {
  if (selectedItems.value.length === 0) return
  
  if (markAsBest) {
    showMarkBestModal.value = true
  } else {
    showUnmarkBestModal.value = true
  }
}

// Confirm mark as best
const confirmMarkBest = async (markAsBest = true) => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    isMarking.value = true
    
    const endpoint = markAsBest ? 'mark-as-best' : 'unmark-as-best'
    const successMessage = markAsBest 
      ? 'Koleksi berhasil ditandai sebagai Best Collection' 
      : 'Koleksi berhasil dihapus dari Best Collection'
    
    await Promise.all(
      selectedItems.value.map(id => 
        axios.post(`${apiBaseUrl}/api/koleksi/${id}/${endpoint}`, {}, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
      )
    )
    
    await fetchKoleksi(currentPage.value)
    selectedItems.value = []
    selectAll.value = false
    
    showToast('success', successMessage)
  } catch (error) {
    console.error("Error updating best collection status:", error)
    showToast('error', 'Gagal memperbarui status Best Collection')
    if (error.response?.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isMarking.value = false
    showMarkBestModal.value = false
    showUnmarkBestModal.value = false
  }
}

// Cancel mark as best
const cancelMarkBest = () => {
  showMarkBestModal.value = false
  isMarking.value = false
}

// Cancel unmark as best
const cancelUnmarkBest = () => {
  showUnmarkBestModal.value = false
  isMarking.value = false
}

// Modify unmarkAsBest to show confirmation modal
const unmarkAsBest = (id) => {
  itemToMark.value = id
  showUnmarkSingleModal.value = true
}

// Confirm unmark single item
const confirmUnmarkSingle = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    isMarking.value = true
    await axios.post(`${apiBaseUrl}/api/koleksi/${itemToMark.value}/unmark-as-best`, {}, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    await fetchKoleksi(currentPage.value)
    showToast('success', 'Koleksi berhasil dihapus dari Best Collections')
  } catch (error) {
    console.error("Error removing from best collection:", error)
    showToast('error', 'Gagal menghapus dari Best Collections')
    if (error.response?.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isMarking.value = false
    showUnmarkSingleModal.value = false
    itemToMark.value = null
  }
}

// Cancel unmark single
const cancelUnmarkSingle = () => {
  showUnmarkSingleModal.value = false
  itemToMark.value = null
}

// Function to fetch collections with filters
const fetchKoleksi = async (page = 1) => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    isLoading.value = true
    const params = {
      page,
      per_page: perPage.value,
      search: searchQuery.value,
      kategori: selectedKategori.value,
      jenisDokumen: selectedJenisDokumen.value,
      sort_by: sortBy.value,
    }

    const res = await axios.get("https://pusdiklat-repo-backend.zeabur.app/api/koleksi/filter", { 
      params,
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map(v => `${key}[]=${v}`).join('&')
            }
            return `${key}=${value}`
          })
          .join('&')
      }
    })
    
    koleksi.value = res.data.data
    currentPage.value = res.data.current_page
    total.value = res.data.total
    lastPage.value = res.data.last_page
    nextPageUrl.value = res.data.next_page_url
    prevPageUrl.value = res.data.prev_page_url
  } catch (error) {
    console.error("Failed to fetch collections:", error)
    if (error.response?.status === 401) {
      alert('Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      errorMessage.value = "Failed to load collections"
    }
  } finally {
    isLoading.value = false
  }
}

// Apply filters and close modal
const applyFilters = () => {
  fetchKoleksi(1)
  closeFilterModal()
}

// Open filter modal
const openFilterModal = () => {
  isFilterModalOpen.value = true
}

// Close filter modal
const closeFilterModal = () => {
  isFilterModalOpen.value = false
}

// Navigate to next page
const goToNextPage = () => {
  if (nextPageUrl.value) {
    fetchKoleksi(currentPage.value + 1)
  }
}

// Navigate to previous page
const goToPrevPage = () => {
  if (prevPageUrl.value) {
    fetchKoleksi(currentPage.value - 1)
  }
}

// Fetch categories and document types
const fetchKategoriAndJenisDokumen = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    const [kategoriRes, jenisDokumenRes] = await Promise.all([
      axios.get("https://pusdiklat-repo-backend.zeabur.app/api/kategori-bang-kom", {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }),
      axios.get("https://pusdiklat-repo-backend.zeabur.app/api/jenis-dokumen", {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }),
    ])
    kategoriList.value = kategoriRes.data.data
    jenisDokumenList.value = jenisDokumenRes.data.data
  } catch (error) {
    console.error("Failed to fetch categories or document types:", error)
    if (error.response?.status === 401) {
      alert('Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  }
}

// Computed for filtered categories
const filteredKategoriList = computed(() => {
  return kategoriList.value.filter(kategori =>
    kategori.nama.toLowerCase().includes(searchKategori.value.toLowerCase())
  )
})

// Computed for filtered document types
const filteredJenisDokumenList = computed(() => {
  return jenisDokumenList.value.filter(jenis =>
    jenis.nama.toLowerCase().includes(searchJenisDokumen.value.toLowerCase())
  )
})

// Add formatDate function
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Modify viewContent function to handle both PDF and YouTube
const viewContent = (item) => {
  if (item.youtube_link) {
    // Open YouTube link in new tab
    window.open(item.youtube_link, '_blank')
  } else if (item.dokumen_pdf) {
    // View PDF
    viewPdf(item.id)
  } else {
    showToast('warning', 'Tidak ada konten yang tersedia untuk koleksi ini')
  }
}

// View PDF function
const viewPdf = async (id) => {
  try {
    // Check authentication
    if (!authStore.isAuthenticated) {
      alert('Anda harus login terlebih dahulu')
      return navigateTo('/auth/login')
    }

    // Verify token
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      await authStore.logout()
      return navigateTo('/auth/login')
    }

    // Make the request
    navigateTo(`/admin/pdf-view2/${id}`)

  } catch (error) {
    console.error('Error:', error)
    alert(errorMessage)
  }
}

// Fungsi untuk membuka modal konfirmasi
const confirmDelete = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

// Fungsi untuk membatalkan penghapusan
const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// Fungsi utama untuk menghapus koleksi
const deleteKoleksi = async () => {
  if (!itemToDelete.value) return
  
  isDeleting.value = true
  try {
    await axios.delete(`${apiBaseUrl}/api/koleksi/${itemToDelete.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    await fetchKoleksi(currentPage.value)
    showToast('success', 'Koleksi berhasil dihapus')
  } catch (error) {
    console.error("Failed to delete collection:", error)
    showToast('error', 'Gagal menghapus koleksi')
    if (error.response?.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}
  
  // Pengecekan awal saat komponen dimount
  onMounted(async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
  
    try {
      await Promise.all([
        fetchKoleksi(),
        fetchKategoriAndJenisDokumen()
      ]);
    } catch (error) {
      console.error('Failed to initialize koleksi table:', error);
      alert('Gagal memuat data koleksi');
    }
  });
  </script>
  
  <style scoped>
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .flex-col > div {
      width: 100%;
    }
    
    .flex-col .justify-end {
      justify-content: flex-end;
    }
  }

  .truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
  </style>