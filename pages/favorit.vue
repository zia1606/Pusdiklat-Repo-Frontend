<template>
    <div class="bg-gray-100">
      <NuxtLayout>
        <!-- Banner dan Search -->
        <div class="relative">
          <banner />
          <!-- <div class="bg-gray-100 px-4">
            <div class="relative w-full -translate-y-1/2">
              <search @search="handleSearch" />
            </div>
          </div> -->
        </div>
  
        <!-- Konten Utama -->
        <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pt-10">
          <!-- Judul Halaman -->
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Koleksi Favorit Anda</h1>
  
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center">
            <Loading title="Memuat koleksi favorit..." />
          </div>
  
          <!-- Empty State -->
          <div v-else-if="favorit.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Belum ada koleksi favorit</h3>
            <p class="mt-1 text-gray-500">Tambahkan koleksi ke favorit untuk melihatnya di sini.</p>
            <div class="mt-6">
              <NuxtLink 
                to="/koleksi" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Jelajahi Koleksi
              </NuxtLink>
            </div>
          </div>
  
          <!-- Daftar Favorit -->
          <div v-else class="space-y-4">
            <!-- Display only visible items -->
            <div 
              v-for="item in visibleItems" 
              :key="item.id" 
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
            >
              <!-- Best Collection Badge -->
              <div 
                v-if="item.koleksi.is_best_collection"
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

              <div class="p-6">
                <!-- Header with date added and delete button -->
                <div class="flex justify-between items-start mb-1">
                  <span class="text-xs text-gray-500">
                    Ditambahkan pada: {{ formatDate(item.created_at) }}
                  </span>
                </div>

                <!-- Title and Author -->
                <NuxtLink 
                  :to="`/detail/${item.koleksi.id}`" 
                  class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                >
                  {{ item.koleksi.judul }}
                </NuxtLink>
                
                <!-- Penulis -->
                <p class="mt-1 text-sm text-gray-600 line-clamp-3">
                  <span class="font-semibold">Oleh: </span>
                  {{ item.koleksi.penulis }}
                </p>

                <!-- Category and Document Type -->
                <div class="mt-2 flex items-center space-x-2">
                  <span 
                    v-if="item.koleksi.kategoriBangKom?.nama"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ item.koleksi.kategoriBangKom.nama }}
                  </span>
                  <span 
                    v-if="item.koleksi.jenisDokumen?.nama"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ item.koleksi.jenisDokumen.nama }}
                  </span>
                </div>

                <!-- Stats -->
                <div class="flex items-center gap-3 text-gray-500 text-sm pt-2">
                  <!-- Tahun Terbit -->
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ item.koleksi.tahun_terbit }}</span>
                  </div>

                  <!-- Garis Vertikal -->
                  <div class="h-4 w-px bg-gray-300"></div>

                  <!-- Jumlah Baca -->
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-blue-700">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>{{ item.koleksi.views }} kali dibaca</span>
                  </div>
                </div>

                <!-- Summary -->
                <p v-if="item.koleksi.ringkasan" class="mt-3 text-sm text-gray-600 line-clamp-3">
                  {{ item.koleksi.ringkasan }}
                </p>

                <!-- Actions -->
                <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <!-- Left Side Buttons -->
                  <div class="flex items-center space-x-2">
                    <!-- Favorit Button -->
                    <button 
                      @click="showDeleteConfirmation(item.koleksi.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Favorit
                    </button>

                    <!-- Share Button -->
                    <button 
                      @click="openShareModal(item.koleksi)"
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

                  <!-- Right Side Button -->
                  <div class="mt-3 sm:mt-0">
                    <NuxtLink 
                      :to="`/detail/${item.koleksi.id}`" 
                      class="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lihat Detail
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

<!-- Load More/Show Less Links -->
<div class="text-center">
  <div v-if="hasMoreItems">
    <a 
      href="#" 
      @click.prevent="loadMore"
      class="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
    >
      Muat Lebih Banyak
    </a>
  </div>
  <div v-else-if="visibleItemCount > itemsPerPage">
    <a 
      href="#" 
      @click.prevent="showLess"
      class="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
    >
      Tampilkan Lebih Sedikit
    </a>
  </div>
</div>

            <!-- Clear All Button -->
            <div class="pt-4">
              <button
                @click="confirmClearAll"
                class="w-full py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                Hapus Semua Favorit
              </button>
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
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 3.617c-.545 1.514-1.656 2.813-3.172 3.402-1.204.468-2.356.404-3.05-.197-.748-.648-.813-1.845-.289-3.52l.001-.004c.085-.25.434-1.204.434-1.204s-.22-.713-.22-1.396c0-1.38.763-2.41 1.712-2.41.446 0 .745.275.745.756 0 .38-.158 1.044-.24 1.632-.082.588-.166 1.195-.093 1.644.16.996.69 1.687 1.275 2.246.59.563 1.34.88 1.834 1.112.38.175.724.149.991-.089.277-.246.31-.694.232-1.215M12 22a9.965 9.965 0 01-5.33-1.547 1.324 1.324 0 00-.94-.343 1.06 1.06 0 00-.684.343l-.38.38a1.324 1.324 0 01-.94.343 1.06 1.06 0 01-.684-.343A9.965 9.965 0 012 12a9.96 9.96 0 013.471-7.55 1.324 1.324 0 00.343-.94 1.06 1.06 0 00-.343-.684l-.38-.38a1.324 1.324 0 01-.343-.94 1.06 1.06 0 01.343-.684A9.965 9.965 0 0112 2a9.96 9.96 0 017.55 3.471 1.324 1.324 0 00.94.343 1.06 1.06 0 00.684-.343l.38-.38a1.324 1.324 0 01.94-.343 1.06 1.06 0 01.684.343A9.965 9.965 0 0122 12a9.96 9.96 0 01-3.471 7.55 1.324 1.324 0 00-.343.94 1.06 1.06 0 00.343.684l.38.38a1.324 1.324 0 01.343.94 1.06 1.06 0 01-.343.684A9.965 9.965 0 0112 22z"/>
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

<!-- Clear All Confirmation Modal -->
<div v-if="showClearAllModal" class="fixed inset-0 overflow-y-auto z-50">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelClearAll"></div>
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Semua Favorit</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus semua koleksi favorit?</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button 
          @click="clearAllFavorit"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Hapus Semua
        </button>
        <button 
          @click="cancelClearAll"
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
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Tambahkan import axios
import { useToast } from '~/composables/useToast'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

useHead({
  title: 'Koleksi Favorit - Sistem Repositori Pusdiklat BPS'
})

const authStore = useUnifiedAuthStore()
// const authStore = useAuthStore();
const router = useRouter();
const { showToast } = useToast()

// State
const favorit = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const perPage = 10;
const totalItems = ref(0);
const totalPages = ref(1);
const itemsPerPage = ref(10); // Items to show per page
const visibleItemCount = ref(10); // Initially show 10 items

// Computed properties
const visibleItems = computed(() => {
  return favorit.value.slice(0, visibleItemCount.value);
});

const hasMoreItems = computed(() => {
  return visibleItemCount.value < favorit.value.length;
});

// Show less items
const showLess = () => {
  visibleItemCount.value = itemsPerPage.value;
  // Optional: scroll to top after showing less items
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Load more items
const loadMore = () => {
  visibleItemCount.value += itemsPerPage.value;
};



// State untuk share modal (yang hilang sebelumnya)
const showShareModal = ref(false);
const shareLink = ref('');
const selectedItem = ref(null);

// State untuk menyimpan daftar favorit
const favorites = ref({});

// Format tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Ambil data favorit
// Ambil data favorit
const fetchFavorit = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get('https://pusdiklat-repo-backend.zeabur.app/api/favorit', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.data.success) {
      favorit.value = response.data.data
      // Reset visible items count when new data is loaded
      visibleItemCount.value = itemsPerPage.value;
    }
  } catch (err) {
    if (err.response?.status === 401) {
      await authStore.logout()
      await navigateTo('/auth/login')
    }
  } finally {
    isLoading.value = false
  }
}

// Rest of your existing methods remain the same...
// (toggleFavorite, confirmToggleFavorite, handleDeleteConfirm, handleDeleteCancel, 
// showDeleteConfirmation, confirmDelete, cancelDelete, loadFavorites, removeFromFavorit,
// openShareModal, closeShareModal, copyToClipboard, shareViaWhatsApp, shareViaTwitter,
// shareViaFacebook, shareViaEmail, shareViaTelegram, confirmClearAll, clearAllFavorit,
// cancelClearAll, handleSearch)

// Watch untuk perubahan status login
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await loadFavorites();
  } else {
    // Reset favorites ketika logout
    favorites.value = {};
  }
});


const isFavorite = (koleksiId) => {
  // Di halaman favorit, semua item sudah favorit
  return true;
};

// Modifikasi fungsi toggleFavorite untuk halaman favorit
const toggleFavorite = async (koleksiId) => {
  try {
    // Langsung hapus karena ini adalah halaman favorit
    await axios.delete(`https://pusdiklat-repo-backend.zeabur.app/api/favorit/by-koleksi/${koleksiId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    // Hapus dari daftar tampilan
    favorit.value = favorit.value.filter(item => item.koleksi.id !== koleksiId);
    
    showToast('success', 'Koleksi dihapus dari favorit');
  } catch (error) {
    console.error('Error removing favorite:', error);
    if (error.response?.status === 401) {
      await authStore.logout();
      await navigateTo('/auth/login');
    }
    showToast('error', 'Gagal menghapus dari favorit');
  }
};


const confirmToggleFavorite = async (koleksiId) => {
  if (!authStore.isAuthenticated) {
    showToast('warning', 'Silakan masuk terlebih dahulu untuk menambahkan ke favorit');
    await navigateTo('/auth/login');
    return;
  }

  if (isFavorite(koleksiId)) {
    showDeleteModal.value = true;
    koleksiToDelete.value = koleksiId;
  } else {
    await toggleFavorite(koleksiId);
  }
};

// And add these handlers for the modal buttons
const handleDeleteConfirm = async () => {
  if (koleksiToDelete.value) {
    await toggleFavorite(koleksiToDelete.value);
    koleksiToDelete.value = null;
    showDeleteModal.value = false;
  }
};

const handleDeleteCancel = () => {
  koleksiToDelete.value = null
  showDeleteModal.value = false
}


// Add this to your script setup
const showDeleteModal = ref(false)
const koleksiToDelete = ref(null)

const showDeleteConfirmation = (koleksiId) => {
  koleksiToDelete.value = koleksiId;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  showDeleteModal.value = false
  return true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  return false
}

// Fungsi untuk memuat status favorit saat pertama kali load
const loadFavorites = async () => {
  if (!authStore.isAuthenticated) return;

  try {
    const response = await axios.get('https://pusdiklat-repo-backend.zeabur.app/api/favorit', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    if (response.data.success) {
      response.data.data.forEach(item => {
        favorites.value[item.koleksi_id] = true;
      });
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
    if (error.response?.status === 401) {
      await authStore.logout();
      await navigateTo('/auth/login');
    }
  }
};

// Hapus dari favorit
const removeFromFavorit = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus dari favorit?')) return;

  try {
    await axios.delete(`https://pusdiklat-repo-backend.zeabur.app/api/favorit/${id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    // Refresh data setelah menghapus
    await fetchFavorit();
  } catch (err) {
    console.error('Error removing favorite:', err);
    alert('Gagal menghapus dari favorit');
  }
};

// Fungsi untuk membuka modal share
const openShareModal = (koleksi) => {
  selectedItem.value = koleksi;
  shareLink.value = `${window.location.origin}/detail/${koleksi.id}`;
  showShareModal.value = true;
};

// Fungsi untuk menutup modal share
const closeShareModal = () => {
  showShareModal.value = false;
  selectedItem.value = null;
  shareLink.value = '';
};

// Fungsi untuk copy ke clipboard
const copyToClipboard = () => {
  const input = document.createElement('input');
  input.value = shareLink.value;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  alert('Tautan berhasil disalin ke clipboard');
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

// Add these near your other modal states
const showClearAllModal = ref(false)

// Replace the existing clearAllFavorit function with these:
const confirmClearAll = () => {
  showClearAllModal.value = true
}

const clearAllFavorit = async () => {
  showClearAllModal.value = false
  
  try {
    isLoading.value = true
    for (const item of favorit.value) {
      await axios.delete(`https://pusdiklat-repo-backend.zeabur.app/api/favorit/${item.id}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
    }

    // Refresh data setelah menghapus
    await fetchFavorit()
    showToast('success', 'Semua koleksi favorit berhasil dihapus')
  } catch (err) {
    console.error('Error clearing favorites:', err)
    showToast('error', 'Gagal menghapus semua favorit')
  } finally {
    isLoading.value = false
  }
}

const cancelClearAll = () => {
  showClearAllModal.value = false
}

// Ganti halaman
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchFavorit();
};

// Handle pencarian
const handleSearch = (query) => {
  router.push({ path: '/koleksi', query: { search: query } });
};

// Watch untuk perubahan status login
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await loadFavorites();
  } else {
    // Reset favorites ketika logout
    favorites.value = {};
  }
});

// Jalankan saat komponen dimuat
onMounted(async () => {
  await authStore.initializeAuth();
  
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login');
  } else {
    await loadFavorites();
    await fetchFavorit();
  }
});
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