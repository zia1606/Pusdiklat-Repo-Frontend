<template>
  <div class="bg-gray-50 min-h-screen">
    <NuxtLayout>
      <!-- Banner Section -->
      <div class="relative">
        <banner />
      </div>

      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Main Content -->
          <div class="lg:w-2/3">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
              <!-- Best Collection Badge -->
              <div
                v-if="koleksi.is_best_collection"
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

              <!-- Category and Badges -->
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span
                  v-if="koleksi.kategoriBangKom"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ koleksi.kategoriBangKom }}
                </span>
                
                <span
                  v-if="koleksi.jenis_dokumen"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ koleksi.jenis_dokumen }}
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {{ koleksi.judul }}
              </h1>

              <p class="mt-1 text-sm text-gray-600 line-clamp-3 mb-3">
                <span class="font-semibold">Oleh: </span>
                {{ koleksi.penulis }}
              </p>

              <!-- Author and Stats -->
              <div class="flex flex-wrap items-center gap-8 text-sm text-gray-600 mb-3">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ koleksi.views ?? 0 }} kali {{ koleksi.youtube_link ? 'dilihat' : 'dibaca' }}</span>
                </div>
                
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ koleksi.tahun_terbit }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-center space-x-2">
                <button
                  @click="confirmToggleFavorite(koleksi.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    :class="{ 'text-yellow-500 fill-yellow-500': isFavorite(koleksi.id), 'text-gray-400': !isFavorite(koleksi.id) }"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Favorit
                </button>
                <button
                  @click="openShareModal(koleksi)"
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

              <!-- Divider -->
              <hr class="my-5 border-gray-200 mt-3 mb-3">

              <!-- YouTube Video Section -->
              <div v-if="youtubeData && youtubeData.embed_id" class="mb-8">
                <div class="relative">
                  <!-- Loading state -->
                  <div v-if="loadingYoutube" class="flex items-center justify-center h-64 md:h-96 bg-gray-100 rounded-lg">
                    <div class="text-center">
                      <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p class="text-gray-500">Memuat video...</p>
                    </div>
                  </div>
                  
                  <!-- YouTube iframe -->
                  <div v-else class="youtube-container">
                    <iframe
                      :src="`https://www.youtube.com/embed/${youtubeData.embed_id}?rel=0&modestbranding=1&enablejsapi=1`"
                      :title="`Video: ${koleksi.judul}`"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                      class="youtube-iframe"
                      @load="onYoutubeLoad"
                    ></iframe>
                  </div>
                  
                  <!-- YouTube controls -->
                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button
                        @click="openYouTubeWithTracking"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Buka di YouTube
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Abstract -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Ringkasan</h3>
                <p class="text-gray-700 text-medium leading-relaxed whitespace-pre-line text-justify hyphens-auto">
                  {{ koleksi.ringkasan || '-' }}
                </p>
              </div>

              <!-- Metadata -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
                <div class="space-y-3">
                  <!-- Penerbit -->
                  <div class="flex flex-row">
                    <div class="w-1/2 md:w-1/4 font-medium text-gray-500">Penerbit</div>
                    <div class="w-1/2 md:w-3/4 text-gray-900">: {{ koleksi.penerbit || '-' }}</div>
                  </div>
                  
                  <!-- Tahun Terbit -->
                  <div class="flex flex-row">
                    <div class="w-1/2 md:w-1/4 font-medium text-gray-500">Tahun Terbit</div>
                    <div class="w-1/2 md:w-3/4 text-gray-900">: {{ koleksi.tahun_terbit || '-' }}</div>
                  </div>
                  
                  <!-- Format Dokumen -->
                  <div class="flex flex-row">
                    <div class="w-1/2 md:w-1/4 font-medium text-gray-500">Format Dokumen</div>
                    <div class="w-1/2 md:w-3/4 text-gray-900">
                      :
                      <span
                        v-if="koleksi.youtube_link"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Video YouTube
                      </span>
                      <span
                        v-else-if="koleksi.dokumen_pdf"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        Dokumen PDF
                      </span>
                      <span v-else>-</span>
                    </div>
                  </div>
                  
                  <!-- Kata Kunci -->
                  <div class="flex flex-row">
                    <div class="w-1/2 md:w-1/4 font-medium text-gray-500">Kata Kunci</div>
                    <div class="w-1/2 md:w-3/4 text-gray-900">: {{ koleksi.keywords || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  v-if="koleksi.dokumen_pdf && !koleksi.youtube_link"
                  @click="checkAuthBeforeView(koleksi.id)"
                  class="flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baca Dokumen
                </button>
                
                <div v-if="!koleksi.dokumen_pdf && !koleksi.youtube_link" class="text-gray-500 italic">
                  Konten tidak tersedia
                </div>
              </div>
            </div>

            <!-- Related Documents -->
            <div v-if="relatedDocs.length > 0" class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Dokumen Terkait</h2>
              <div class="space-y-4">
                <div
                  v-for="doc in relatedDocs"
                  :key="doc.id"
                  class="group p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                >
                  <NuxtLink
                    :to="`/detail/${doc.id}`"
                    class="block"
                  >
                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {{ doc.judul }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      <span class="font-semibold">Oleh: </span>
                      {{ doc.penulis }}
                    </p>
                    <div class="mt-2 flex items-center text-sm text-blue-600">
                      Lihat detail
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:w-1/3">
            <!-- Recommendation Sidebar -->
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-5">
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-900">Rekomendasi Lainnya</h2>
                <!-- Recommendation Type Badge -->
                <span 
                  v-if="recommendationType"
                  :class="{
                    'bg-green-100 text-green-800': recommendationType === 'content_based',
                    'bg-blue-100 text-blue-800': recommendationType === 'category_based'
                  }"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ recommendationType === 'content_based' ? 'Berbasis Konten' : 'Berbasis Kategori' }}
                </span>
              </div>
              
              <!-- Error Message -->
              <div v-if="recommendationError" class="text-red-500 text-sm mb-4">
                {{ recommendationError }}
              </div>
              
              <!-- Loading State -->
              <div v-if="loadingRecommendations" class="space-y-4">
                <div v-for="n in 3" :key="n" class="animate-pulse">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              
              <div v-else class="space-y-4">
                <div
                  v-for="doc in recommendedDocs"
                  :key="doc.id"
                  class="group p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                >
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span 
                      v-if="doc.kategori && doc.kategori !== '-' && doc.kategori !== ''"
                      class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ doc.kategori }}
                    </span>
                    <span 
                      v-if="doc.jenis_dokumen && doc.jenis_dokumen !== '-' && doc.jenis_dokumen !== ''"
                      class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                    >
                      {{ doc.jenis_dokumen }}
                    </span>
                    <!-- Show similarity score only for content-based recommendations -->
                    <!-- <span 
                      v-if="recommendationType === 'content_based' && doc.similarity_score"
                      class="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                    >
                      {{ Math.round(doc.similarity_score * 100) }}% match
                    </span> -->
                  </div>
                  <NuxtLink :to="`/detail/${doc.id}`" class="block">
                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {{ doc.judul }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">Oleh: {{ doc.penulis }}</p>
                    
                    <div class="mt-2 flex items-center text-sm text-blue-600">
                      Lihat detail
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </NuxtLink>
                </div>
                
                <div v-if="recommendedDocs.length === 0" class="text-center py-4 text-gray-500">
                  Tidak ada rekomendasi yang tersedia
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Share Modal -->
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
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from '~/composables/useToast';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';

const { public: { apiBaseUrl } } = useRuntimeConfig();
const { showToast } = useToast();
const route = useRoute();
const authStore = useUnifiedAuthStore();
const router = useRouter();
const { $toast } = useNuxtApp();

useHead({
  title: 'Detail Koleksi - Sistem Repositori Pusdiklat BPS'
});

// Data states
const koleksi = ref({});
const showDeleteModal = ref(false);
const koleksiToDelete = ref(null);
const recommendedDocs = ref([]);
const loadingRecommendations = ref(false);
const recommendationError = ref(null);
const recommendationType = ref(null); // Track recommendation type
const isLoading = ref(false);
const errorMessage = ref('');
const showShareModal = ref(false);
const shareLink = ref('');
const selectedItem = ref(null);
const relatedDocs = ref([]);

// YouTube specific states
const youtubeData = ref(null);
const loadingYoutube = ref(false);
const youtubeError = ref(null);

// Favorites and Saved items
const favorites = ref({});
const savedItems = ref({});

// Favorite functions
const isFavorite = (koleksiId) => favorites.value[koleksiId] || false;

// Fixed fetchRecommendations function to use correct endpoint
const fetchRecommendations = async () => {
  try {
    loadingRecommendations.value = true;
    recommendationError.value = null;
    recommendationType.value = null;
    
    console.log('Fetching recommendations for koleksi ID:', route.params.id);
    
    // Use the correct POST endpoint that matches backend
    const response = await axios.post(`${apiBaseUrl}/api/recommendations`, {
      koleksi_id: parseInt(route.params.id),
      top_n: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Recommendations API Response:', response.data);
    
    if (response.data.success) {
      const data = response.data.data;
      recommendationType.value = response.data.recommendation_type;
      
      // Handle different response structures based on recommendation type
      let recommendations = [];
      
      if (response.data.recommendation_type === 'content_based') {
        // Content-based response structure
        recommendations = data.recommendations || [];
      } else if (response.data.recommendation_type === 'category_based') {
        // Category-based response structure  
        recommendations = data.recommendations || [];
      }
      
      console.log('Processed recommendations:', recommendations);
      console.log('Recommendation type:', recommendationType.value);
      
      // Map recommendations to consistent format
      recommendedDocs.value = recommendations.map(item => ({
        id: item.id,
        judul: item.judul,
        penulis: item.penulis,
        kategori: item.kategori || '-',
        jenis_dokumen: item.jenis_dokumen || '-',
        tahun_terbit: item.tahun_terbit,
        similarity_score: item.similarity_score || null,
        views: item.views || 0
      }));
      
      console.log('Final recommendedDocs:', recommendedDocs.value);
      
    } else {
      recommendationError.value = response.data.message || 'Gagal memuat rekomendasi';
      console.error('Recommendation API error:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    console.error('Error response:', error.response?.data);
    recommendationError.value = 'Gagal memuat rekomendasi';
    
    // Try fallback recommendations
    await fetchFallbackRecommendations();
  } finally {
    loadingRecommendations.value = false;
  }
};

// Fallback recommendations function
const fetchFallbackRecommendations = async () => {
  try {
    console.log('Fetching fallback recommendations...');
    
    // Get latest collections as fallback
    const response = await axios.get(`${apiBaseUrl}/api/koleksi`, {
      params: {
        limit: 5,
        sort_by: 'terbaru',
        exclude: route.params.id
      }
    });
    
    if (response.data.data) {
      recommendedDocs.value = response.data.data.map(item => ({
        id: item.id,
        judul: item.judul,
        penulis: item.penulis,
        kategori: item.kategoriBangKom || '-',
        jenis_dokumen: item.jenis_dokumen || '-',
        tahun_terbit: item.tahun_terbit,
        similarity_score: null,
        views: item.views || 0
      }));
      
      recommendationType.value = 'fallback';
      console.log('Fallback recommendations loaded:', recommendedDocs.value);
    }
  } catch (error) {
    console.error('Error fetching fallback recommendations:', error);
    recommendedDocs.value = [];
  }
};

// Fetch koleksi detail
const getKoleksiDetail = async () => {
  try {
    isLoading.value = true;
    console.log('Fetching collection detail for ID:', route.params.id);
    
    const res = await axios.get(`${apiBaseUrl}/api/koleksi/${route.params.id}`);
    koleksi.value = res.data.data;
    
    console.log('Collection data received:', koleksi.value);
    console.log('Has YouTube link:', !!koleksi.value.youtube_link);
    console.log('YouTube link value:', koleksi.value.youtube_link);
    
    // If koleksi has YouTube link, fetch YouTube data
    if (koleksi.value.youtube_link) {
      console.log('Collection has YouTube link, fetching YouTube data...');
      await fetchYoutubeData();
    } else {
      console.log('No YouTube link found in collection data');
    }
  } catch (error) {
    console.error('Gagal mengambil data koleksi:', error);
    errorMessage.value = 'Gagal memuat data koleksi';
    if ($toast) {
      showToast('error', 'Gagal memuat data koleksi');
    }
  } finally {
    isLoading.value = false;
  }
};

// Fetch YouTube data
const fetchYoutubeData = async () => {
  if (!koleksi.value.youtube_link) {
    console.log('No YouTube link found in koleksi data');
    return;
  }
  
  try {
    loadingYoutube.value = true;
    youtubeError.value = null;
    
    console.log('Fetching YouTube data for collection:', route.params.id);
    console.log('YouTube link from koleksi:', koleksi.value.youtube_link);
    
    const response = await axios.get(`${apiBaseUrl}/api/youtube/embed/${route.params.id}`);
    
    console.log('YouTube API Response:', response.data);
    
    if (response.data.success) {
      youtubeData.value = response.data.data;
      console.log('YouTube data set successfully:', youtubeData.value);
    } else {
      throw new Error(response.data.message || 'Failed to get YouTube data');
    }
    
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    console.error('Error response:', error.response?.data);
    
    youtubeError.value = 'Gagal memuat video YouTube';
    
    // Fallback: Try to extract embed ID directly
    console.log('Attempting fallback extraction...');
    const embedId = extractYoutubeId(koleksi.value.youtube_link);
    console.log('Fallback extracted ID:', embedId);
    
    if (embedId) {
      youtubeData.value = {
        embed_id: embedId,
        watch_url: koleksi.value.youtube_link,
        embed_url: `https://www.youtube.com/embed/${embedId}`
      };
      console.log('Fallback YouTube data set:', youtubeData.value);
      youtubeError.value = null;
    }
  } finally {
    loadingYoutube.value = false;
  }
};

// Extract YouTube ID from URL
const extractYoutubeId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Track YouTube view
const trackYoutubeView = async () => {
  if (!koleksi.value.id) return;
  
  try {
    await axios.post(`${apiBaseUrl}/api/youtube/track-view/${koleksi.value.id}`);
    if (koleksi.value.views !== undefined) {
      koleksi.value.views++;
    }
  } catch (error) {
    console.error('Error tracking YouTube view:', error);
  }
};

// Handle YouTube iframe load
const onYoutubeLoad = () => {
  trackYoutubeView();
};

// Open YouTube in new tab
const openYouTubeInNewTab = () => {
  if (!youtubeData.value || !youtubeData.value.watch_url) {
    if (koleksi.value.youtube_link) {
      window.open(koleksi.value.youtube_link, '_blank');
    }
    return;
  }
  
  window.open(youtubeData.value.watch_url, '_blank');
};

const openYouTubeWithTracking = async () => {
  try {
    await trackYoutubeView();
    openYouTubeInNewTab();
  } catch (error) {
    console.error('Error tracking YouTube view:', error);
    openYouTubeInNewTab();
  }
};

const checkAuthBeforeView = async (id) => {
  if (!authStore.isAuthenticated) {
    const confirmed = confirm('Anda harus login terlebih dahulu untuk membaca dokumen. Apakah Anda ingin login sekarang?');
    if (confirmed) {
      return navigateTo('/auth/login');
    }
    return;
  }
  const timestamp = Date.now();
  const pdfUrl = `/detail/pdf-view/${id}?t=${timestamp}`;
  window.open(pdfUrl, '_blank');
};

const viewPdf = async (id) => {
  const authStore = useAuthStore();
  
  try {
    const isValid = await authStore.verifyToken();
    if (!isValid) {
      await authStore.logout();
      $toast.error('Sesi telah berakhir. Silakan login kembali.');
      return navigateTo('/auth/login');
    }
    
    const timestamp = Date.now();
    const pdfViewerUrl = `/detail/pdf-view/${id}?t=${timestamp}`;
    
    window.open(pdfViewerUrl, '_blank');
    
  } catch (error) {
    console.error('Error:', error);
    showToast('error', 'Terjadi kesalahan saat membuka dokumen');
  }
};

// Function to toggle favorite status
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

const handleDeleteConfirm = async () => {
  if (koleksiToDelete.value) {
    await toggleFavorite(koleksiToDelete.value);
    koleksiToDelete.value = null;
    showDeleteModal.value = false;
  }
};

const handleDeleteCancel = () => {
  koleksiToDelete.value = null;
  showDeleteModal.value = false;
};

const toggleFavorite = async (koleksiId) => {
  try {
    if (isFavorite(koleksiId)) {
      await axios.delete(`${apiBaseUrl}/api/favorit/by-koleksi/${koleksiId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      favorites.value[koleksiId] = false;
      showToast('success', 'Koleksi dihapus dari favorit');
    } else {
      await axios.post(`${apiBaseUrl}/api/favorit`, {
        koleksi_id: koleksiId
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      favorites.value[koleksiId] = true;
      showToast('success', 'Koleksi ditambahkan ke favorit');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    if (error.response?.status === 401) {
      await authStore.logout();
      await navigateTo('/auth/login');
    }
    showToast('error', 'Gagal mengubah status favorit');
  }
};

// Function to load favorites
const loadFavorites = async () => {
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
    console.error('Error loading favorites:', error);
  }
};

// Share functions
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

const shareViaTelegram = () => {
  const text = `Lihat koleksi "${selectedItem.value.judul}" di: ${shareLink.value}`;
  const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

const openShareModal = () => {
  shareLink.value = `${window.location.origin}/detail/${route.params.id}`;
  showShareModal.value = true;
};

const closeShareModal = () => {
  showShareModal.value = false;
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareLink.value)
    .then(() => {
      showToast('success', 'Tautan berhasil disalin');
    })
    .catch(() => {
      const input = document.createElement('input');
      input.value = shareLink.value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('success', 'Tautan berhasil disalin');
    });
};

// Load favorites and saved items
const loadUserCollections = async () => {
  if (!authStore.isLoggedIn) return;
  
  try {
    const favRes = await axios.get(`${apiBaseUrl}/api/favorit`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    if (favRes.data.success) {
      favRes.data.data.forEach(item => {
        favorites.value[item.koleksi_id] = true;
      });
    }
    
    const savedRes = await axios.get(`${apiBaseUrl}/api/simpan-koleksi`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    if (savedRes.data.success) {
      savedRes.data.data.forEach(item => {
        savedItems.value[item.koleksi_id] = true;
      });
    }
  } catch (error) {
    console.error('Error loading user collections:', error);
  }
};

// Mounted hook
onMounted(async () => {
  await authStore.initializeAuth();
  await getKoleksiDetail();
  await fetchRecommendations();
  if (authStore.isAuthenticated) {
    await loadUserCollections();
  }
});

// Watch for auth changes
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await loadUserCollections();
  } else {
    favorites.value = {};
    savedItems.value = {};
  }
});

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await getKoleksiDetail();
    await fetchRecommendations();
  }
});
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}

.youtube-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .youtube-container {
    padding-bottom: 56.25%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
