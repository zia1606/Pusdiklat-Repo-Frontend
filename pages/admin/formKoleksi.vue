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
      <div class="flex-1 overflow-y-auto p-6 py-30">
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <h2 class="text-2xl font-semibold text-white">Input Koleksi Baru</h2>
            <p class="text-blue-100">Isi formulir berikut untuk menambahkan koleksi baru</p>
          </div>
          
          <!-- Form Content -->
          <div class="p-6">
            <div v-if="isLoading">
              <loading :title="isLoadingTitle" />
            </div>
            
            <div v-else>
              <form @submit.prevent="saveKoleksi" class="space-y-6">
                <!-- Judul -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Judul <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="koleksi.judul" 
                    type="text" 
                    @paste="handlePasteJudul"
                    class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    required
                  >
                  <p class="text-sm text-red-500" v-if="errorList.judul">{{ errorList.judul?.[0] }}</p>
                </div>
                
                <!-- Grid Columns -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Penulis -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Penulis <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="koleksi.penulis" 
                      type="text" 
                      @paste="(e) => handlePasteText(e, 'penulis')"
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                      required
                    >
                    <p class="text-sm text-red-500" v-if="errorList.penulis">{{ errorList.penulis?.[0] }}</p>
                  </div>
                  
                  <!-- Tahun Terbit -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Tahun Terbit <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="koleksi.tahun_terbit" 
                      type="text" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                      required
                    >
                    <p class="text-sm text-red-500" v-if="errorList.tahun_terbit">{{ errorList.tahun_terbit?.[0] }}</p>
                  </div>
                  
                  <!-- Kategori -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 truncate">
                      Kategori Pengembangan Kompetensi
                    </label>
                    <select 
                      v-model="koleksi.kategori_bang_kom_id"
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    >
                      <option value="">Pilih Kategori</option>
                      <option v-for="kategori in kategoriBangKomList" :key="kategori.id" :value="kategori.id">
                        {{ kategori.nama }}
                      </option>
                    </select>
                    <p class="text-sm text-red-500" v-if="errorList.kategori_bang_kom_id">{{ errorList.kategori_bang_kom_id?.[0] }}</p>
                  </div>
                  
                  <!-- Jenis Dokumen -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Jenis Dokumen
                    </label>
                    <select 
                      v-model="koleksi.jenis_dokumen_id"
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    >
                      <option value="">Pilih Jenis Dokumen</option>
                      <option v-for="jenis in jenisDokumenList" :key="jenis.id" :value="jenis.id">
                        {{ jenis.nama }}
                      </option>
                    </select>
                    <p class="text-sm text-red-500" v-if="errorList.jenis_dokumen_id">{{ errorList.jenis_dokumen_id?.[0] }}</p>
                  </div>
                </div>
                
                <!-- Ringkasan -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Ringkasan
                  </label>
                  <textarea 
                    v-model="koleksi.ringkasan" 
                    @paste="handlePasteRingkasan"
                    rows="4"
                    class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                  ></textarea>
                  <p class="text-sm text-red-500" v-if="errorList.ringkasan">{{ errorList.ringkasan?.[0] }}</p>
                </div>
                
                <!-- Penerbit & Keywords -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Penerbit -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Penerbit
                    </label>
                    <input 
                      v-model="koleksi.penerbit" 
                      type="text" 
                      @paste="(e) => handlePasteText(e, 'penerbit')"
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    >
                    <p class="text-sm text-red-500" v-if="errorList.penerbit">{{ errorList.penerbit?.[0] }}</p>
                  </div>
                  
                  <!-- Keywords -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Kata Kunci
                    </label>
                    <input 
                      v-model="koleksi.keywords" 
                      type="text" 
                      @paste="(e) => handlePasteText(e, 'keywords')"
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    >
                    <p class="text-sm text-red-500" v-if="errorList.keywords">{{ errorList.keywords?.[0] }}</p>
                  </div>
                </div>
                
                <!-- Content Type Selection -->
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700">
                    Tipe Konten <span class="text-red-500">*</span>
                  </label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="koleksi.content_type" 
                        value="pdf"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      >
                      <span class="ml-2 text-sm text-gray-700">File PDF</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="koleksi.content_type" 
                        value="youtube"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      >
                      <span class="ml-2 text-sm text-gray-700">Video YouTube</span>
                    </label>
                  </div>
                  <p class="text-sm text-red-500" v-if="errorList.content_type">{{ errorList.content_type?.[0] }}</p>
                </div>

                <!-- PDF Upload Section -->
<div v-if="koleksi.content_type === 'pdf'" class="mb-6">
  <label class="block text-sm font-medium text-gray-700 mb-2">Dokumen PDF</label>
  
  <div v-if="!koleksi.dokumen_pdf" class="flex items-center justify-center w-full">
    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition duration-150">
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-sm text-gray-500 mt-2">
          <span class="font-semibold">Klik untuk upload</span>
        </p>
        <p class="text-xs text-gray-500">PDF (max. 10MB)</p>
      </div>
      <input 
        id="dokumen_pdf" 
        type="file" 
        @change="handleFileUpload" 
        accept="application/pdf" 
        class="hidden"
      >
    </label>
  </div>

  <!-- After Upload -->
  <div v-else class="border border-gray-200 rounded-lg p-4 bg-gray-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3 min-w-0"> <!-- Added min-w-0 -->
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <div class="min-w-0"> <!-- Added min-w-0 -->
          <p class="text-sm font-medium text-gray-900 truncate">{{ koleksi.dokumen_pdf.name }}</p>
          <p class="text-xs text-gray-500">{{ (koleksi.dokumen_pdf.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
      </div>
      <div class="flex space-x-2 flex-shrink-0"> <!-- Added flex-shrink-0 -->
        <button
          @click="previewFile"
          type="button"
          class="text-blue-500 hover:text-blue-700 cursor-pointer"
          title="Preview file"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>
        <button 
          @click="koleksi.dokumen_pdf = null" 
          type="button" 
          class="text-red-500 hover:text-red-700 cursor-pointer"
          title="Hapus file"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <p class="text-sm text-red-500 mt-2" v-if="errorList.dokumen_pdf">{{ errorList.dokumen_pdf?.[0] }}</p>
</div>

                <!-- YouTube Link Section -->
                <div v-if="koleksi.content_type === 'youtube'" class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Link YouTube</label>
                  <div class="space-y-2">
                    <input 
                      v-model="koleksi.youtube_link" 
                      type="url" 
                      placeholder="https://www.youtube.com/watch?v=..."
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:outline-hidden focus:ring-blue-300 focus:border-blue-300 transition duration-150"
                    >
                    <p class="text-xs text-gray-500">Masukkan link YouTube yang valid (contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ)</p>
                    <p class="text-sm text-red-500" v-if="errorList.youtube_link">{{ errorList.youtube_link?.[0] }}</p>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-6">
                  <button 
                    type="submit" 
                    :disabled="isLoading || !koleksi.content_type"
                    class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span v-if="!isLoading">Simpan Koleksi</span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<!-- <script>
import axios from 'axios';
import Sidebar from '~/components/Admin/Sidebar.vue';
import HeaderAdmin from '~/components/Admin/HeaderAdmin.vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuth';

export default {
  components: {
    Sidebar,
    HeaderAdmin
  },
  name: "KoleksiCreate",
  data() {
    return {
      router: useRouter(),
      authStore: useAdminAuthStore(),
      showSidebar: false,
      koleksi: {
        judul: '',
        penulis: '',
        ringkasan: '',
        kategori_bang_kom_id: '',
        jenis_dokumen_id: '',
        tahun_terbit: '',
        penerbit: '',
        keywords: '',
        dokumen_pdf: null,
        youtube_link: '',
        content_type: '', // 'pdf' atau 'youtube'
      },
      kategoriBangKomList: [],
      jenisDokumenList: [],
      isLoading: false,
      isLoadingTitle: 'Loading',
      errorList: {},
    };
  },
  async created() {
    const isAuthenticated = await this.checkAuth();
    if (!isAuthenticated) return;

    await this.fetchKategoriBangKom();
    await this.fetchJenisDokumen();
  },
  methods: {
    async checkAuth() {
      await this.authStore.init();
      
      if (!this.authStore.isLoggedIn) {
        this.router.push('/admin/auth/login');
        return false;
      }

      try {
        const isValid = await this.authStore.verifyToken();
        if (!isValid) {
          alert('Sesi telah berakhir, silakan login kembali');
          await this.authStore.logout();
          this.router.push('/admin/auth/login');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Authentication error:', error);
        alert('Terjadi kesalahan saat verifikasi sesi');
        await this.authStore.logout();
        this.router.push('/admin/auth/login');
        return false;
      }
    },

    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },

    async fetchKategoriBangKom() {
      if (!this.authStore.isLoggedIn) {
        this.router.push('/admin/auth/login');
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/kategori-bang-kom', {
          headers: {
            'Authorization': `Bearer ${this.authStore.token}`
          }
        });
        this.kategoriBangKomList = response.data.data;
      } catch (error) {
        console.error('Gagal mengambil data kategori bang kom:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await this.authStore.logout();
          this.router.push('/admin/auth/login');
        }
      }
    },

    async fetchJenisDokumen() {
      if (!this.authStore.isLoggedIn) {
        this.router.push('/admin/auth/login');
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/jenis-dokumen', {
          headers: {
            'Authorization': `Bearer ${this.authStore.token}`
          }
        });
        this.jenisDokumenList = response.data.data;
      } catch (error) {
        console.error('Gagal mengambil data jenis dokumen:', error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await this.authStore.logout();
          this.router.push('/admin/auth/login');
        }
      }
    },

    handlePasteJudul(e) {
      // Dapatkan teks yang dipaste
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      
      // Hapus line breaks dan ganti dengan spasi tunggal
      const cleanedText = pastedText.replace(/\s+/g, ' ').trim();
      
      // Gabungkan dengan teks yang sudah ada
      this.koleksi.judul = (this.koleksi.judul + cleanedText).substring(0, 255); // Batasi panjang judul jika perlu
      
      // Cegah paste default
      e.preventDefault();
    },
    
    handlePasteRingkasan(e) {
      // Dapatkan teks yang dipaste
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      
      // Hapus line breaks dan ganti dengan spasi tunggal
      const cleanedText = pastedText.replace(/\s+/g, ' ').trim();
      
      // Gabungkan dengan teks yang sudah ada
      const currentPosition = e.target.selectionStart;
      const textBefore = this.koleksi.ringkasan.substring(0, currentPosition);
      const textAfter = this.koleksi.ringkasan.substring(e.target.selectionEnd);
      
      this.koleksi.ringkasan = textBefore + cleanedText + textAfter;
      
      // Cegah paste default
      e.preventDefault();
      
      // Setel posisi kursor setelah teks yang dipaste
      this.$nextTick(() => {
        e.target.selectionStart = currentPosition + cleanedText.length;
        e.target.selectionEnd = currentPosition + cleanedText.length;
      });
    },

    handleFileUpload(event) {
      this.koleksi.dokumen_pdf = event.target.files[0];
    },

    previewFile() {
            if (this.koleksi.dokumen_pdf) {
                const fileURL = URL.createObjectURL(this.koleksi.dokumen_pdf);
                window.open(fileURL, '_blank');
                
                // Clean up the object URL after some time
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 10000);
            }
        },

    async saveKoleksi() {
      if (!this.authStore.isLoggedIn) {
        this.router.push('/admin/auth/login');
        return;
      }

      this.isLoading = true;
      this.isLoadingTitle = "Menyimpan";

      const formData = new FormData();
      formData.append('judul', this.koleksi.judul);
      formData.append('penulis', this.koleksi.penulis);
      formData.append('ringkasan', this.koleksi.ringkasan);
      formData.append('kategori_bang_kom_id', this.koleksi.kategori_bang_kom_id);
      formData.append('jenis_dokumen_id', this.koleksi.jenis_dokumen_id);
      formData.append('tahun_terbit', this.koleksi.tahun_terbit);
      formData.append('penerbit', this.koleksi.penerbit);
      formData.append('keywords', this.koleksi.keywords);
      formData.append('content_type', this.koleksi.content_type);
      
      if (this.koleksi.content_type === 'pdf' && this.koleksi.dokumen_pdf) {
        formData.append('dokumen_pdf', this.koleksi.dokumen_pdf);
      }
      
      if (this.koleksi.content_type === 'youtube' && this.koleksi.youtube_link) {
        formData.append('youtube_link', this.koleksi.youtube_link);
      }

      try {
        const response = await axios.post(`${apiBaseUrl}/api/koleksi', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.authStore.token}`
          },
        });
        alert(response.data.message);
        this.resetForm();
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          alert('Sesi telah berakhir, silakan login kembali');
          await this.authStore.logout();
          this.router.push('/admin/auth/login');
        } else if (error.response && error.response.status === 422) {
          this.errorList = error.response.data.error;
        } else {
          alert('Terjadi kesalahan saat menyimpan data.');
        }
      } finally {
        this.isLoading = false;
        this.isLoadingTitle = "Loading";
      }
    },

    resetForm() {
      this.koleksi = {
        judul: '',
        penulis: '',
        ringkasan: '',
        kategori_bang_kom_id: '',
        jenis_dokumen_id: '',
        tahun_terbit: '',
        penerbit: '',
        keywords: '',
        dokumen_pdf: null,
        youtube_link: '',
        content_type: '',
      };
      this.errorList = {};
    },
  },
};
</script> -->

<script setup>
// import { ref } from 'vue';
useHead({
  title: 'Tambah Koleksi - Sistem Repositori Pusdiklat BPS'
})
const { public: { apiBaseUrl } } = useRuntimeConfig();
const pageTitle = ref('Formulir Tambah Koleksi');

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo } from '#imports'
import { $fetch } from 'ofetch'

// Import komponen
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import { useToast } from '~/composables/useToast'

const { showToast } = useToast()

// Middleware untuk memastikan hanya admin yang bisa akses
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const authStore = useUnifiedAuthStore()

const showSidebar = ref(false)
const koleksi = ref({
  judul: '',
  penulis: '',
  ringkasan: '',
  kategori_bang_kom_id: '',
  jenis_dokumen_id: '',
  tahun_terbit: '',
  penerbit: '',
  keywords: '',
  dokumen_pdf: null,
  youtube_link: '',
  content_type: '', // 'pdf' atau 'youtube'
})
const kategoriBangKomList = ref([])
const jenisDokumenList = ref([])
const isLoading = ref(false)
const isLoadingTitle = ref('Loading')
const errorList = ref({})

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// Authentication check menggunakan unified auth
const checkAuth = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return false
  }

  if (!authStore.canAccessAdmin) {
    showToast('error', 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.')
    await navigateTo('/')
    return false
  }

  try {
    const isValid = await authStore.checkAuthStatus()
    if (!isValid) {
      showToast('error', 'Sesi telah berakhir, silakan login kembali')
      await navigateTo('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    showToast('error', 'Terjadi kesalahan saat verifikasi sesi')
    await authStore.logout()
    await navigateTo('/auth/login')
    return false
  }
}

// Pengecekan awal saat komponen dimount
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return

  await Promise.all([
    fetchKategoriBangKom(),
    fetchJenisDokumen()
  ])
})

// Watch for content_type changes
watch(() => koleksi.value.content_type, (newVal) => {
  if (newVal === 'pdf') {
    // Clear YouTube link if PDF is selected
    if (koleksi.value.youtube_link) {
      koleksi.value.youtube_link = ''
    }
  } else if (newVal === 'youtube') {
    // Clear PDF file if YouTube is selected
    if (koleksi.value.dokumen_pdf) {
      koleksi.value.dokumen_pdf = null
    }
  }
})

const fetchKategoriBangKom = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/api/kategori-bang-kom`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    kategoriBangKomList.value = response.data || []
  } catch (error) {
    console.error('Gagal mengambil data kategori bang kom:', error)
    if (error.status === 401) {
      showToast('error', 'Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      showToast('error', 'Gagal mengambil data kategori')
    }
  }
}

const fetchJenisDokumen = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/api/jenis-dokumen`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    jenisDokumenList.value = response.data || []
  } catch (error) {
    console.error('Gagal mengambil data jenis dokumen:', error)
    if (error.status === 401) {
      showToast('error', 'Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      showToast('error', 'Gagal mengambil data jenis dokumen')
    }
  }
}

// Paste handlers for all text fields
const handlePasteText = (e, fieldName) => {
  // Get pasted text
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  
  // Clean the text (remove extra spaces and line breaks)
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  
  // For textarea fields (ringkasan)
  if (e.target.tagName.toLowerCase() === 'textarea') {
    const currentPosition = e.target.selectionStart
    const textBefore = koleksi.value[fieldName].substring(0, currentPosition)
    const textAfter = koleksi.value[fieldName].substring(e.target.selectionEnd)
    
    koleksi.value[fieldName] = textBefore + cleanedText + textAfter
    
    // Prevent default paste
    e.preventDefault()
    
    // Set cursor position after pasted text
    nextTick(() => {
      e.target.selectionStart = currentPosition + cleanedText.length
      e.target.selectionEnd = currentPosition + cleanedText.length
    })
  } 
  // For input fields (judul, penulis, penerbit, keywords)
  else {
    // Combine with existing text
    koleksi.value[fieldName] = (koleksi.value[fieldName] + cleanedText).substring(0, 255)
    
    // Prevent default paste
    e.preventDefault()
  }
}

const handlePasteJudul = (e) => {
  // Dapatkan teks yang dipaste
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  
  // Hapus line breaks dan ganti dengan spasi tunggal
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  
  // Gabungkan dengan teks yang sudah ada
  koleksi.value.judul = (koleksi.value.judul + cleanedText).substring(0, 255) // Batasi panjang judul jika perlu
  
  // Cegah paste default
  e.preventDefault()
}

const handlePasteRingkasan = (e) => {
  // Dapatkan teks yang dipaste
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  
  // Hapus line breaks dan ganti dengan spasi tunggal
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  
  // Gabungkan dengan teks yang sudah ada
  const currentPosition = e.target.selectionStart
  const textBefore = koleksi.value.ringkasan.substring(0, currentPosition)
  const textAfter = koleksi.value.ringkasan.substring(e.target.selectionEnd)
  
  koleksi.value.ringkasan = textBefore + cleanedText + textAfter
  
  // Cegah paste default
  e.preventDefault()
  
  // Setel posisi kursor setelah teks yang dipaste
  nextTick(() => {
    e.target.selectionStart = currentPosition + cleanedText.length
    e.target.selectionEnd = currentPosition + cleanedText.length
  })
}

const handleFileUpload = (event) => {
  koleksi.value.dokumen_pdf = event.target.files[0]
}

const previewFile = () => {
  if (koleksi.value.dokumen_pdf) {
    const fileURL = URL.createObjectURL(koleksi.value.dokumen_pdf)
    window.open(fileURL, '_blank')
    
    // Clean up the object URL after some time
    setTimeout(() => {
      URL.revokeObjectURL(fileURL)
    }, 10000)
  }
}

const saveKoleksi = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  isLoading.value = true
  isLoadingTitle.value = "Menyimpan"

  const formData = new FormData()
  formData.append('judul', koleksi.value.judul)
  formData.append('penulis', koleksi.value.penulis)
  formData.append('ringkasan', koleksi.value.ringkasan)
  formData.append('kategori_bang_kom_id', koleksi.value.kategori_bang_kom_id)
  formData.append('jenis_dokumen_id', koleksi.value.jenis_dokumen_id)
  formData.append('tahun_terbit', koleksi.value.tahun_terbit)
  formData.append('penerbit', koleksi.value.penerbit)
  formData.append('keywords', koleksi.value.keywords)
  formData.append('content_type', koleksi.value.content_type)
  
  if (koleksi.value.content_type === 'pdf' && koleksi.value.dokumen_pdf) {
    formData.append('dokumen_pdf', koleksi.value.dokumen_pdf)
  }
  
  if (koleksi.value.content_type === 'youtube' && koleksi.value.youtube_link) {
    formData.append('youtube_link', koleksi.value.youtube_link)
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/api/koleksi`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    showToast('success', response.message || 'Koleksi berhasil disimpan')
    await navigateTo('/admin/tabelKoleksi') // Navigate to koleksi table after success
  } catch (error) {
    console.error(error)
    if (error.status === 401) {
      showToast('error', 'Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else if (error.status === 422) {
      errorList.value = error.data.error
      showToast('error', 'Terdapat kesalahan dalam form. Silakan periksa kembali.')
    } else {
      showToast('error', 'Terjadi kesalahan saat menyimpan data.')
    }
  } finally {
    isLoading.value = false
    isLoadingTitle.value = "Loading"
  }
}

const resetForm = () => {
  koleksi.value = {
    judul: '',
    penulis: '',
    ringkasan: '',
    kategori_bang_kom_id: '',
    jenis_dokumen_id: '',
    tahun_terbit: '',
    penerbit: '',
    keywords: '',
    dokumen_pdf: null,
    youtube_link: '',
    content_type: '',
  }
  errorList.value = {}
}
</script>
