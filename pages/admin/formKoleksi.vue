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
            
      <!-- Form Container -->
      <div class="flex-1 overflow-y-auto p-8">
      <div class="p-10">
        <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden mb-10">
          <!-- Form Header -->
          <div class="relative overflow-hidden bg-blue-600 px-8 py-10">
            <!-- Decor -->
            <div class="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-blue-500 opacity-20"></div>
            <div class="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-blue-700 opacity-20"></div>
            
            <div class="relative z-10 flex items-center space-x-5">
              <div class="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-black text-white tracking-tight">{{ isEdit ? 'Edit Koleksi' : 'Tambah Koleksi Baru' }}</h2>
                <p class="text-blue-100 font-medium mt-1">{{ isEdit ? 'Perbarui informasi dokumen yang sudah ada' : 'Lengkapi informasi dokumen di bawah ini' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Form Content -->
          <div class="p-8">
            <div v-if="isLoading && isLoadingTitle === 'Loading'">
              <loading :title="isLoadingTitle" />
            </div>
            
            <div v-else>
              <form @submit.prevent="saveKoleksi" class="space-y-8">
                <!-- Group 1: Informasi Dasar -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-2 pb-2 border-b border-gray-50">
                    <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Informasi Dasar</h3>
                  </div>

                  <!-- Judul -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Judul Koleksi <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="koleksi.judul" 
                      type="text" 
                      placeholder="Masukkan judul lengkap dokumen..."
                      @paste="handlePasteJudul"
                      class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                      required
                    >
                    <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.judul">{{ errorList.judul?.[0] }}</p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- No Induk -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Nomor Induk
                      </label>
                      <input 
                        v-model="koleksi.no_induk" 
                        type="text" 
                        placeholder="Contoh: 1234/BPS/2024"
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                      >
                    </div>

                    <!-- Tahun Terbit -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Tahun <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="koleksi.tahun_terbit" 
                        type="text" 
                        placeholder="Contoh: 2024"
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                        required
                      >
                      <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.tahun_terbit">{{ errorList.tahun_terbit?.[0] }}</p>
                    </div>
                  </div>

                  <!-- Penulis Selector -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Penulis / Creator <span class="text-red-500">*</span>
                    </label>
                    <AuthorSelector 
                      v-model="koleksi.penulis_list" 
                      @open-modal="handleOpenModal"
                    />
                    <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.penulis_ids">{{ errorList.penulis_ids?.[0] }}</p>
                  </div>
                </div>

                <!-- Group 2: Klasifikasi -->
                <div class="space-y-6 pt-4">
                  <div class="flex items-center space-x-2 pb-2 border-b border-gray-50">
                    <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Klasifikasi & Metadata</h3>
                  </div>

                  <!-- Category & SubCategory Selector -->
                  <CategorySelector 
                    v-model:categoryValue="koleksi.kategori_id"
                    v-model:subCategoryValue="koleksi.sub_kategori_id"
                    @open-modal="handleOpenModal"
                    ref="categorySelector"
                  />

                  <!-- DDC, Cutter, Call Number -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DDC</label>
                      <input v-model="koleksi.ddc" type="text" placeholder="Contoh: 310" class="block w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cutter</label>
                      <input v-model="koleksi.cutter" type="text" placeholder="Contoh: BPS" class="block w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Call Number</label>
                      <input v-model="koleksi.call_number" type="text" placeholder="Contoh: 310 BPS" class="block w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium">
                    </div>
                  </div>

                  <!-- Ringkasan -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Ringkasan / Abstrak
                    </label>
                    <textarea 
                      v-model="koleksi.ringkasan" 
                      @paste="handlePasteRingkasan"
                      rows="4"
                      placeholder="Masukkan ringkasan singkat isi dokumen..."
                      class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                    ></textarea>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Penerbit -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Penerbit
                      </label>
                      <input 
                        v-model="koleksi.penerbit" 
                        type="text" 
                        placeholder="Nama penerbit..."
                        @paste="(e) => handlePasteText(e, 'penerbit')"
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                      >
                    </div>
                    
                    <!-- Keywords -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Kata Kunci (Keywords)
                      </label>
                      <input 
                        v-model="koleksi.keywords" 
                        type="text" 
                        placeholder="Pisahkan dengan koma (contoh: bps, statistik)"
                        @paste="(e) => handlePasteText(e, 'keywords')"
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                      >
                    </div>
                  </div>
                </div>

                <!-- Group 3: Konten -->
                <div class="space-y-6 pt-4">
                  <div class="flex items-center space-x-2 pb-2 border-b border-gray-50">
                    <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Format & Unggah Konten</h3>
                  </div>

                  <div class="space-y-4 hidden">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Pilih Tipe Konten <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-1 gap-4">
                      <label 
                        class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer bg-blue-50 border-blue-600 text-blue-700 shadow-lg shadow-blue-100"
                      >
                        <input type="radio" v-model="koleksi.content_type" value="pdf" class="sr-only">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs font-bold uppercase tracking-widest">Dokumen PDF</span>
                      </label>
                    </div>
                  </div>

                  <!-- PDF Upload Section -->
                  <div v-if="koleksi.content_type === 'pdf'" class="animate-fadeIn">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Unggah File PDF</label>
                    <div v-if="!koleksi.dokumen_pdf" class="flex items-center justify-center w-full">
                      <label class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50/30 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <div class="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                          </div>
                          <p class="text-sm text-gray-500 font-bold tracking-tight">Tarik & lepaskan file atau <span class="text-blue-600">Klik di sini</span></p>
                          <p class="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Format PDF (Maks. 10MB)</p>
                        </div>
                        <input id="dokumen_pdf" type="file" @change="handleFileUpload" accept="application/pdf" class="hidden">
                      </label>
                    </div>
                    <!-- After Upload -->
                    <div v-else class="relative overflow-hidden bg-white rounded-2xl border border-blue-100 p-5 shadow-lg shadow-blue-50 flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-gray-900 truncate max-w-[300px]">{{ koleksi.dokumen_pdf.name }}</p>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ (koleksi.dokumen_pdf.size / 1024 / 1024).toFixed(2) }} MB</p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button @click="previewFile" type="button" class="h-9 w-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button @click="koleksi.dokumen_pdf = null" type="button" class="h-9 w-9 rounded-xl flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- YouTube Link Section (Removed) -->

                  <!-- Thumbnail Upload -->
                  <div class="space-y-4 pt-4 border-t border-gray-50">
                    <label class="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 mb-2">Thumbnail / Cover Image</label>
                    <div class="flex flex-col md:flex-row gap-6 items-start">
                      <!-- Preview -->
                      <div class="w-32 h-44 rounded-2xl bg-gray-100 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img v-if="thumbnailPreview" :src="thumbnailPreview" class="w-full h-full object-cover" />
                        <svg v-else class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <!-- Upload Area -->
                      <div class="flex-1 w-full">
                        <label class="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50/30 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-xs text-gray-500 font-bold">Pilih foto sampul atau <span class="text-blue-600">Klik</span></p>
                            <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">JPG, PNG (Maks. 2MB)</p>
                          </div>
                          <input type="file" @change="handleThumbnailUpload" accept="image/*" class="hidden">
                        </label>
                        <button v-if="thumbnailPreview" @click="removeThumbnail" type="button" class="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors">
                          Hapus Sampul
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  <!-- Group 4: Pengaturan Status -->
                  <div class="space-y-6 pt-4">
                    <div class="flex items-center space-x-2 pb-2 border-b border-gray-50">
                      <div class="h-6 w-1 bg-emerald-600 rounded-full"></div>
                      <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Pengaturan Status</h3>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                      <div>
                        <p class="text-xs font-black text-gray-900 uppercase tracking-widest">Status Publikasi</p>
                        <p class="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest italic">Tentukan apakah koleksi ini dapat dilihat publik</p>
                      </div>
                      <div class="flex items-center space-x-3">
                        <span class="text-[10px] font-black uppercase tracking-widest" :class="koleksi.is_active ? 'text-emerald-600' : 'text-gray-400'">
                          {{ koleksi.is_active ? 'Aktif' : 'Non-Aktif' }}
                        </span>
                        <button 
                          type="button"
                          @click="koleksi.is_active = koleksi.is_active === 1 ? 0 : 1"
                          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          :class="koleksi.is_active ? 'bg-emerald-600' : 'bg-gray-200'"
                        >
                          <span 
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="koleksi.is_active ? 'translate-x-5' : 'translate-x-0'"
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>

                <!-- Action Buttons -->
                <div class="pt-8 flex items-center justify-end space-x-4 border-t border-gray-50">
                  <button 
                    type="button"
                    @click="router.back()"
                    class="px-8 py-4 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    :disabled="isLoading || !koleksi.content_type"
                    class="px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <span v-if="!isLoading">Simpan Koleksi</span>
                    <span v-else class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Modals -->
    <AuthorModal 
      :isOpen="modalState.author" 
      @close="modalState.author = false" 
      @success="handleAuthorAdded" 
    />
    <CategoryModal 
      :isOpen="modalState.category || modalState.subcategory" 
      :type="modalState.category ? 'category' : 'subcategory'"
      :parentId="modalState.parentId"
      @close="closeCategoryModal" 
      @success="handleCategoryAdded" 
    />

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo, useHead, useRuntimeConfig } from '#imports'
import { useToast } from '~/composables/useToast'

// Components
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import AuthorSelector from '@/components/Admin/AuthorSelector.vue'
import CategorySelector from '@/components/Admin/CategorySelector.vue'
import AuthorModal from '@/components/Admin/AuthorModal.vue'
import CategoryModal from '@/components/Admin/CategoryModal.vue'

useHead({
  title: 'Tambah Koleksi - Sistem Repositori Pusdiklat BPS'
})

const { public: { apiBaseUrl } } = useRuntimeConfig();
const pageTitle = ref('Formulir Tambah Koleksi');
const { showToast } = useToast()
const router = useRouter()
const authStore = useUnifiedAuthStore()
const route = useRoute()
const isEdit = computed(() => !!route.query.id)
const { apiFetch } = useApi()

// Middleware
definePageMeta({
  middleware: 'admin'
})

// State
const showSidebar = ref(false)
const categorySelector = ref(null)
const isLoading = ref(false)
const isLoadingTitle = ref('Loading')
const errorList = ref({})

const koleksi = reactive({
  judul: '',
  no_induk: '',
  penulis_list: [],
  kategori_id: '',
  sub_kategori_id: '',
  ddc: '',
  cutter: '',
  call_number: '',
  ringkasan: '',
  tahun_terbit: '',
  penerbit: '',
  keywords: '',
  dokumen_pdf: null,
  thumbnail: null,
  youtube_link: '',
  content_type: 'pdf',
  is_active: 1
})

// Watchers (Cleaned up YouTube logic)

const thumbnailPreview = ref(null)

const modalState = reactive({
  author: false,
  category: false,
  subcategory: false,
  parentId: null
})

// Auth Check
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }
  if (!authStore.canAccessAdmin) {
    showToast('error', 'Akses ditolak.')
    await navigateTo('/')
    return false
  }
  return true
}

onMounted(async () => {
  const authed = await checkAuth()
  if (!authed) return

  if (isEdit.value) {
    pageTitle.value = 'Formulir Edit Koleksi'
    await fetchKoleksiDetail()
  }
})

const fetchKoleksiDetail = async () => {
  try {
    isLoading.value = true
    isLoadingTitle.value = 'Memuat Data'
    const response = await apiFetch(`/koleksi/${route.query.id}/edit`)
    const data = response.data

    // Map response data to koleksi reactive object
    koleksi.judul = data.judul
    koleksi.no_induk = data.no_induk
    koleksi.penulis_list = data.penulis_list || []
    koleksi.ringkasan = data.ringkasan
    koleksi.tahun_terbit = data.tahun_terbit
    koleksi.penerbit = data.penerbit
    koleksi.keywords = data.keywords
    koleksi.content_type = 'pdf'
    koleksi.is_active = data.is_active
    koleksi.ddc = data.ddc
    koleksi.cutter = data.cutter
    koleksi.call_number = data.call_number
    
    // Set category and subcategory
    if (data.kategoris && data.kategoris.length > 0) {
      koleksi.kategori_id = data.kategoris[0].id
    }
    if (data.sub_kategoris && data.sub_kategoris.length > 0) {
      koleksi.sub_kategori_id = data.sub_kategoris[0].id
    }

    // Note: dokumen_pdf and thumbnail are handled as URLs usually, 
    // but in form we only show if they exist or allow new upload
    if (data.thumbnail) {
      thumbnailPreview.value = data.thumbnail
    }
    // existingPdfUrl.value = data.dokumen_pdf
  } catch (error) {
    console.error('Failed to fetch collection detail:', error)
    showToast('error', 'Gagal memuat data koleksi')
    router.push('/admin/tabelKoleksi')
  } finally {
    isLoading.value = false
    isLoadingTitle.value = 'Loading'
  }
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// Modal Handlers
const handleOpenModal = (type, parentId = null) => {
  if (type === 'author') modalState.author = true;
  else if (type === 'category') modalState.category = true;
  else if (type === 'subcategory') {
    modalState.subcategory = true;
    modalState.parentId = parentId;
  }
}

const closeCategoryModal = () => {
  modalState.category = false;
  modalState.subcategory = false;
  modalState.parentId = null;
}

const handleAuthorAdded = (newAuthor) => {
  koleksi.penulis_list.push(newAuthor);
}

const handleCategoryAdded = () => {
  if (categorySelector.value) {
    categorySelector.value.refresh();
  }
}

// Paste Handlers
const handlePasteJudul = (e) => {
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  koleksi.judul = (koleksi.judul + cleanedText).substring(0, 255)
  e.preventDefault()
}

const handlePasteRingkasan = (e) => {
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  const currentPosition = e.target.selectionStart
  const textBefore = koleksi.ringkasan.substring(0, currentPosition)
  const textAfter = koleksi.ringkasan.substring(e.target.selectionEnd)
  koleksi.ringkasan = textBefore + cleanedText + textAfter
  e.preventDefault()
  nextTick(() => {
    e.target.selectionStart = currentPosition + cleanedText.length
    e.target.selectionEnd = currentPosition + cleanedText.length
  })
}

const handlePasteText = (e, fieldName) => {
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  koleksi[fieldName] = (koleksi[fieldName] + cleanedText).substring(0, 255)
  e.preventDefault()
}

// File Handlers
const handleFileUpload = (event) => {
  koleksi.dokumen_pdf = event.target.files[0];
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    koleksi.thumbnail = file;
    thumbnailPreview.value = URL.createObjectURL(file);
  }
}

const removeThumbnail = () => {
  koleksi.thumbnail = null;
  thumbnailPreview.value = null;
}

const previewFile = () => {
  if (koleksi.dokumen_pdf) {
    const fileURL = URL.createObjectURL(koleksi.dokumen_pdf);
    window.open(fileURL, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  }
}

// Save Logic
const saveKoleksi = async () => {
  isLoading.value = true;
  isLoadingTitle.value = "Menyimpan";
  errorList.value = {};

  const formData = new FormData();
  formData.append('judul', koleksi.judul);
  formData.append('no_induk', koleksi.no_induk || '');
  formData.append('ringkasan', koleksi.ringkasan || '');
  formData.append('tahun_terbit', koleksi.tahun_terbit);
  formData.append('penerbit', koleksi.penerbit || '');
  formData.append('keywords', koleksi.keywords || '');
  formData.append('content_type', 'pdf');
  formData.append('is_active', koleksi.is_active);
  
  if (koleksi.dokumen_pdf) {
    formData.append('dokumen_pdf', koleksi.dokumen_pdf);
  }
  formData.append('youtube_link', '');

  formData.append('ddc', koleksi.ddc || '');
  formData.append('cutter', koleksi.cutter || '');
  formData.append('call_number', koleksi.call_number || '');

  // Relations
  koleksi.penulis_list.forEach(p => formData.append('penulis_ids[]', p.id));
  if (koleksi.kategori_id) formData.append('kategori_ids[]', koleksi.kategori_id);
  if (koleksi.sub_kategori_id) formData.append('sub_kategori_ids[]', koleksi.sub_kategori_id);


  if (koleksi.thumbnail) {
    formData.append('thumbnail', koleksi.thumbnail);
  }

  try {
    const url = isEdit.value ? `${apiBaseUrl}/api/koleksi/${route.query.id}` : `${apiBaseUrl}/api/koleksi`;
    
    // Use POST with _method: PUT for Laravel to handle multipart/form-data with PUT
    if (isEdit.value) {
      formData.append('_method', 'PUT');
    }

    const response = await $fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });
    showToast('success', response.message || 'Koleksi berhasil disimpan!');
    resetForm();
    router.push('/admin/tabelKoleksi');
  } catch (error) {
    console.error(error);
    if (error.status === 422) {
      errorList.value = error.data.errors || error.data.error;
      showToast('error', 'Validasi gagal. Mohon cek kembali inputan Anda.');
    } else {
      showToast('error', 'Terjadi kesalahan saat menyimpan data.');
    }
  } finally {
    isLoading.value = false;
    isLoadingTitle.value = "Loading";
  }
}

const resetForm = () => {
  Object.assign(koleksi, {
    judul: '',
    no_induk: '',
    penulis_list: [],
    kategori_id: '',
    sub_kategori_id: '',
    ddc: '',
    cutter: '',
    call_number: '',
    ringkasan: '',
    tahun_terbit: '',
    penerbit: '',
    keywords: '',
    dokumen_pdf: null,
    thumbnail: null,
    youtube_link: '',
    content_type: 'pdf',
    is_active: 1
  });
  thumbnailPreview.value = null;
  errorList.value = {};
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
