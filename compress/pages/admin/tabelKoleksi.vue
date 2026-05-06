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
      <!-- Top Action Bar (Search, Sort, Filter) -->
      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <!-- Search -->
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul, penulis, atau kata kunci..."
            class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
            @input="applyFilters"
          />
        </div>
  
        <!-- Sort & Filter Group -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Sort -->
          <div class="relative min-w-[160px]">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <select
              v-model="sortBy"
              class="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer font-bold text-xs text-gray-600 uppercase tracking-wider transition-all duration-300"
              @change="applyFilters"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="popular">Terpopuler</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
  
          <!-- Filter Button -->
          <button
            @click="openFilterModal"
            class="inline-flex items-center px-6 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-600 transition-all duration-300 group"
          >
            <svg class="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="text-xs font-bold uppercase tracking-wider">Filter Lanjut</span>
          </button>
        </div>
      </div>
  
      <!-- Second Action Bar (Bulk Actions) -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <!-- Selected Items Info -->
        <div v-if="selectedItems.length > 0" class="flex items-center px-4 py-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
          <span class="text-xs font-black text-white uppercase tracking-widest">{{ selectedItems.length }} Terpilih</span>
        </div>
        <div v-else class="flex items-center px-4 py-2">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pilih item untuk aksi massal</span>
        </div>
        
        <!-- Action Buttons Group -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="markSelectedAsBest(true)"
            :disabled="selectedItems.length === 0"
            class="inline-flex items-center px-4 py-2.5 bg-white border border-gray-100 text-yellow-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-yellow-50 hover:border-yellow-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Tandai Best
          </button>
          
          <button
            @click="markSelectedAsBest(false)"
            :disabled="selectedItems.length === 0"
            class="inline-flex items-center px-4 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
          >
            Hapus Best
          </button>

          <div class="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

          <button
            @click="markSelectedAsActive(true)"
            :disabled="selectedItems.length === 0"
            class="inline-flex items-center px-4 py-2.5 bg-white border border-gray-100 text-green-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-50 hover:border-green-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
          >
            Aktifkan
          </button>

          <button
            @click="markSelectedAsActive(false)"
            :disabled="selectedItems.length === 0"
            class="inline-flex items-center px-4 py-2.5 bg-white border border-gray-100 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 hover:border-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
          >
            Nonaktifkan
          </button>

          <div class="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

          <NuxtLink
            to="/admin/formKoleksi"
            class="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Koleksi
          </NuxtLink>
        </div>
      </div>
  
      <!-- Table Container -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Responsive Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
                  />
                </th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Koleksi & Format</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kategori & Sub</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
              <!-- Per-column search row -->
              <tr class="bg-white border-t border-gray-100">
                <td></td>
                <td class="px-4 py-2">
                  <input
                    v-model="colSearchJudul"
                    @input="applyFilters"
                    type="text"
                    placeholder="Cari judul / penulis..."
                    class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                  />
                </td>
                <td class="px-4 py-2">
                  <select
                    v-model="colSearchKategori"
                    @change="applyFilters"
                    class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none bg-white"
                  >
                    <option value="">Semua Kategori</option>
                    <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama }}</option>
                  </select>
                </td>
                <td class="px-4 py-2">
                  <select
                    v-model="colSearchStatus"
                    @change="applyFilters"
                    class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none bg-white"
                  >
                    <option value="">Semua Status</option>
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                </td>
                <td></td>
              </tr>
            </thead>
  
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in koleksi" :key="item.id" class="hover:bg-blue-50/30 transition-colors duration-200 group">
              <td class="px-6 py-5 whitespace-nowrap w-12">
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedItems"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
                />
              </td>
              
              <!-- Kolom Judul, Penulis & Format -->
              <td class="px-6 py-5">
                <div class="max-w-[400px]">
                  <div class="flex items-center gap-2 mb-1">
                    <span v-if="item.youtube_link" class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-tighter">
                      VIDEO
                    </span>
                    <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                      PDF
                    </span>
                    <span class="text-[10px] font-bold text-gray-400" v-if="item.no_induk">
                      #{{ item.no_induk }}
                    </span>
                  </div>
                  <div class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5" :title="item.judul">
                    {{ item.judul }}
                  </div>
                  <div class="text-xs text-gray-500 font-medium italic">
                    Oleh: 
                    <span v-for="(p, idx) in item.penulis_list" :key="p.id">
                      {{ p.nama }}{{ idx < item.penulis_list.length - 1 ? ', ' : '' }}
                    </span>
                    <span v-if="!item.penulis_list || item.penulis_list.length === 0">{{ item.penulis || 'Anonim' }}</span>
                  </div>
                </div>
              </td>
        
              <!-- Kolom Kategori & Sub -->
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1.5">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="kat in item.kategoris" :key="kat.id" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tight">
                      {{ kat.nama }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="sub in item.sub_kategoris" :key="sub.id" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-tight">
                      {{ sub.nama }}
                    </span>
                  </div>
                  <div v-if="(!item.kategoris || item.kategoris.length === 0) && (!item.sub_kategoris || item.sub_kategoris.length === 0)" class="text-[10px] text-gray-400 italic">Tanpa Kategori</div>
                </div>
              </td>
              
              <!-- Kolom Status -->
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex flex-col gap-1.5">
                  <div v-if="item.is_best_collection" class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider border border-yellow-100">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Best
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span v-if="item.is_active === 1" class="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                      Active
                    </span>
                    <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100 italic">
                      In-Active
                    </span>
                  </div>
                </div>
              </td>
              
              <!-- Kolom Aksi -->
              <td class="px-6 py-5 whitespace-nowrap text-right">
                <div class="flex justify-end items-center space-x-1.5">
                  <!-- Download/Open Icon -->
                  <button
                    @click="viewContent(item)"
                    class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group/btn"
                    :title="item.youtube_link ? 'Buka Video' : 'Buka PDF'"
                  >
                    <svg v-if="item.youtube_link" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>

                  <!-- Detail Information Icon (also for editing) -->
                  <NuxtLink 
                    :to="`/admin/koleksi/${item.id}`" 
                    class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 group/btn"
                    title="Lihat Detail & Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </NuxtLink>
                  
                  <!-- Delete Icon -->
                  <button
                    @click.stop="confirmDelete(item.id)"
                    class="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all duration-300 group/btn"
                    title="Hapus Permanen"
                  >
                    <svg class="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="koleksi.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-2.286 6.857a2 2 0 01-1.857 1.143H8.143a2 2 0 01-1.857-1.143L4 13" />
                  </svg>
                  <p class="text-sm text-gray-500 font-medium">Data koleksi tidak ditemukan</p>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
  </div>
  
        <!-- Pagination -->
        <div class="px-6 py-5 bg-white border-t border-gray-50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- Info Text -->
            <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Menampilkan 
              <span class="text-blue-600">{{ !total || total === 0 ? 0 : (currentPage - 1) * perPage + 1 }}</span> -
              <span class="text-blue-600">{{ Math.min(currentPage * perPage, total || 0) }}</span> 
              dari <span class="text-gray-900">{{ total || 0 }}</span> Koleksi
            </div>
            
            <!-- Pagination Controls -->
            <div class="flex items-center space-x-2">
              <button
                @click="goToPrevPage"
                :disabled="currentPage <= 1"
                class="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div class="px-4 py-2 bg-blue-50 rounded-xl text-blue-600 text-xs font-bold uppercase tracking-widest">
                Hal <span class="text-blue-800">{{ currentPage }}</span> / {{ lastPage }}
              </div>

              <button
                @click="goToNextPage"
                :disabled="currentPage >= lastPage"
                class="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
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
                  
                  <div class="mb-6">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Status Aktif</h4>
                    <select
                      v-model="selectedStatus"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Semua Status</option>
                      <option value="1">Aktif (Active)</option>
                      <option value="0">Tidak Aktif (In-Active)</option>
                    </select>
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

  <!-- Mark as Active Confirmation Modal -->
  <div v-if="showMarkActiveModal" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelMarkActive"></div>
      </div>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ isMarkingActive ? 'Aktifkan Koleksi' : 'Nonaktifkan Koleksi' }}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Apakah Anda yakin ingin mengubah status {{ selectedItems.length }} koleksi terpilih menjadi {{ isMarkingActive ? 'Aktif' : 'Tidak Aktif' }}?</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmMarkActive"
            :disabled="isProcessingActive"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span v-if="!isProcessingActive">Ya, Simpan</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
          <button 
            @click="cancelMarkActive"
            :disabled="isProcessingActive"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>

    <!-- Toast Component -->
<Toast />

  </div>
  </template>
  
  <script setup>
  import { useRuntimeConfig } from '#app'

// Panggil di dalam setup
const config = useRuntimeConfig()

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

// State for Active status
const showMarkActiveModal = ref(false)
const isMarkingActive = ref(true)
const isProcessingActive = ref(false)
const selectedStatus = ref("")

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

// Per-column search state
const colSearchJudul = ref("")
const colSearchKategori = ref("")
const colSearchStatus = ref("")

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

const markSelectedAsActive = (isActive = true) => {
  if (selectedItems.value.length === 0) return
  isMarkingActive.value = isActive
  showMarkActiveModal.value = true
}

const cancelMarkActive = () => {
  showMarkActiveModal.value = false
}

const confirmMarkActive = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    isProcessingActive.value = true
    
    const endpoint = isMarkingActive.value ? 'mark-as-active' : 'unmark-as-active'
    const successMessage = isMarkingActive.value 
      ? 'Koleksi berhasil diaktifkan' 
      : 'Koleksi berhasil dinonaktifkan'
    
    await Promise.all(
      selectedItems.value.map(id => 
        axios.post(`${apiBaseUrl}/api/koleksi/${id}/${endpoint}`, {}, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
      )
    )
    
    showToast('success', successMessage)
    selectedItems.value = []
    selectAll.value = false
    await fetchKoleksi() // Refresh data
  } catch (error) {
    console.error('Error updating status:', error)
    showToast('error', 'Gagal memperbarui status koleksi')
  } finally {
    isProcessingActive.value = false
    showMarkActiveModal.value = false
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
      search: colSearchJudul.value || searchQuery.value,
      kategori: colSearchKategori.value ? [colSearchKategori.value] : selectedKategori.value,
      sort_by: sortBy.value,
      is_active: colSearchStatus.value !== '' ? colSearchStatus.value : selectedStatus.value
    }

    // Clean params
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    const res = await axios.get(`${config.public.apiBaseUrl}/api/koleksi/filter`, { 
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
    
    // Robust handling for various API response structures (Root, Wrapped, or Meta)
    const raw = res.data
    
    // 1. Identify where the items are
    const items = raw.data && Array.isArray(raw.data) ? raw.data : 
                  (raw.data?.data && Array.isArray(raw.data.data) ? raw.data.data : 
                  (Array.isArray(raw) ? raw : []))
                  
    // 2. Identify where the pagination info is
    // Laravel Resource usually puts it in 'meta', standard pagination in root
    const pag = raw.meta || (raw.current_page ? raw : (raw.data?.current_page ? raw.data : raw))
    
    koleksi.value = items
    currentPage.value = parseInt(pag.current_page) || 1
    total.value = parseInt(pag.total) || (Array.isArray(items) ? items.length : 0)
    lastPage.value = parseInt(pag.last_page) || 1
    perPage.value = parseInt(pag.per_page) || 10
    nextPageUrl.value = pag.next_page_url || raw.links?.next || null
    prevPageUrl.value = pag.prev_page_url || raw.links?.prev || null
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
  if (currentPage.value < lastPage.value) {
    fetchKoleksi(currentPage.value + 1)
  }
}

// Navigate to previous page
const goToPrevPage = () => {
  if (currentPage.value > 1) {
    fetchKoleksi(currentPage.value - 1)
  }
}

// Fetch categories and document types
const fetchKategoriAndJenisDokumen = async () => {
  try {
    const res = await axios.get(`${config.public.apiBaseUrl}/api/kategori`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    kategoriList.value = res.data.data || res.data
  } catch (error) {
    console.error("Failed to fetch categories:", error)
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

// View PDF function - Modified to open in new tab
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

    // Open PDF in new tab
    const timestamp = Date.now();
    const pdfViewerUrl = `/admin/pdf-view2/${id}?t=${timestamp}`;
    window.open(pdfViewerUrl, '_blank');

  } catch (error) {
    console.error('Error:', error)
    alert(errorMessage)
  }
};

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