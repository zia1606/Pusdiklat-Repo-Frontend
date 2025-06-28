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
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 class="text-2xl font-semibold text-white">Edit Koleksi</h2>
            <p class="text-blue-100">Edit formulir berikut untuk memperbarui koleksi</p>
          </div>
          
          <!-- Form Content -->
          <div class="p-6">
            <div v-if="isLoading">
              <loading :title="isLoadingTitle" />
            </div>
            
            <div v-else>
              <form @submit.prevent="editKoleksi" class="space-y-6">
                <!-- Judul -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Judul <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="koleksi.judul" 
                    type="text" 
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
                      <option :value="null">Pilih Kategori</option>
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
                      <option :value="null">Pilih Jenis Dokumen</option>
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
                  
                  <!-- Display existing PDF -->
                  <div v-if="koleksi.dokumen_pdf && !newFile && !existingFileRemoved" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {{ koleksi.dokumen_pdf.split('/').pop() }}
                          </p>
                          <p class="text-xs text-gray-500">PDF File</p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button
                          @click="viewPdf(koleksi.id)"
                          type="button"
                          class="text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Lihat file"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <label for="dokumen_pdf_replace" class="text-green-500 hover:text-green-700 cursor-pointer" title="Ganti file">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                          </svg>
                        </label>
                        <input 
                          id="dokumen_pdf_replace" 
                          type="file" 
                          @change="handleFileUpload" 
                          accept="application/pdf" 
                          class="hidden"
                        >
                        <button 
                          @click="removeExistingFile" 
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

                  <!-- Display new uploaded file -->
                  <div v-if="newFile" class="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ newFile.name }}</p>
                          <p class="text-xs text-gray-500">{{ (newFile.size / 1024 / 1024).toFixed(2) }} MB - File Baru</p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button
                          @click="previewNewFile"
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
                          @click="removeNewFile" 
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
                  
                  <!-- Upload area -->
                  <div v-if="(!koleksi.dokumen_pdf && !newFile) || (existingFileRemoved && !newFile)" class="flex items-center justify-center w-full">
                    <label for="dokumen_pdf" class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition duration-150">
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
                    <span v-if="!isLoading">Update Koleksi</span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memperbarui...
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
</template>

<script>
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
    name: "koleksiEdit",
    data() {
        return {
            router: useRouter(),
            authStore: useAdminAuthStore(),
            showSidebar: false,
            koleksiId: '',
            koleksi: {
                judul: '',
                penulis: '',
                ringkasan: '',
                kategori_bang_kom_id: null,
                jenis_dokumen_id: null,
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
            newFile: null,
            existingFileRemoved: false
        }
    },
    async created() {
        const isAuthenticated = await this.checkAuth();
        if (!isAuthenticated) return;

        this.koleksiId = this.$route.params.id;
        await this.getKoleksi(this.koleksiId);
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

        async viewPdf(id) {
            try {
                if (!this.authStore.isLoggedIn) {
                    alert('Anda harus login terlebih dahulu');
                    return this.router.push('/admin/auth/login');
                }

                const isValid = await this.authStore.verifyToken();
                if (!isValid) {
                    await this.authStore.logout();
                    return this.router.push('/admin/auth/login');
                }

                this.router.push(`/admin/pdf-view2/${id}`);

            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat membuka PDF');
            }
        },

        toggleSidebar() {
            this.showSidebar = !this.showSidebar;
        },

        async getKoleksi(koleksiId) {
            this.isLoading = true;
            try {
                const response = await axios.get(`http://localhost:8000/api/koleksi/${koleksiId}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${this.authStore.token}`
                    }
                });
                
                const koleksiData = response.data.koleksi;
                
                // Set data koleksi dengan menentukan content_type berdasarkan data yang ada
                this.koleksi = {
                    ...koleksiData,
                    kategori_bang_kom_id: koleksiData.kategori_bang_kom_id,
                    jenis_dokumen_id: koleksiData.jenis_dokumen_id,
                    // Tentukan content_type berdasarkan data yang ada
                    content_type: koleksiData.youtube_link ? 'youtube' : 'pdf'
                };
                
                this.isLoading = false;
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    alert('Sesi telah berakhir, silakan login kembali');
                    await this.authStore.logout();
                    this.router.push('/admin/auth/login');
                }
                this.isLoading = false;
            }
        },

        async fetchKategoriBangKom() {
            try {
                const response = await axios.get('http://localhost:8000/api/kategori-bang-kom', {
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
            try {
                const response = await axios.get('http://localhost:8000/api/jenis-dokumen', {
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

        handleFileUpload(event) {
            if (event.target.files && event.target.files[0]) {
                this.newFile = event.target.files[0];
                event.target.value = '';
                console.log('File baru dipilih:', this.newFile.name);
            }
        },

        removeExistingFile() {
            this.existingFileRemoved = true;
            this.koleksi.dokumen_pdf = null;
            console.log('File existing dihapus');
        },

        removeNewFile() {
            this.newFile = null;
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');
            console.log('File baru dihapus');
        },

        previewNewFile() {
            if (this.newFile) {
                const fileURL = URL.createObjectURL(this.newFile);
                window.open(fileURL, '_blank');
                
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 10000);
            }
        },

        async editKoleksi() {
            if (!this.authStore.isLoggedIn) {
                this.router.push('/admin/auth/login');
                return;
            }

            this.isLoading = true;
            this.isLoadingTitle = "Memperbarui";

            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('judul', this.koleksi.judul);
            formData.append('penulis', this.koleksi.penulis);
            formData.append('ringkasan', this.koleksi.ringkasan || '');
            formData.append('kategori_bang_kom_id', this.koleksi.kategori_bang_kom_id || '');
            formData.append('jenis_dokumen_id', this.koleksi.jenis_dokumen_id || '');
            formData.append('tahun_terbit', this.koleksi.tahun_terbit);
            formData.append('penerbit', this.koleksi.penerbit || '');
            formData.append('keywords', this.koleksi.keywords || '');
            formData.append('content_type', this.koleksi.content_type);
            
            if (this.koleksi.content_type === 'pdf') {
                if (this.newFile) {
                    formData.append('dokumen_pdf', this.newFile);
                }
                
                if (this.existingFileRemoved) {
                    formData.append('remove_file', 'true');
                }
            } else if (this.koleksi.content_type === 'youtube') {
                formData.append('youtube_link', this.koleksi.youtube_link);
            }

            try {
                const response = await axios.post(`http://localhost:8000/api/koleksi/${this.koleksiId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.authStore.token}`
                    },
                });
                
                alert(response.data.message);
                this.router.push('/admin/tabelKoleksi');
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    alert('Sesi telah berakhir, silakan login kembali');
                    await this.authStore.logout();
                    this.router.push('/admin/auth/login');
                } else if (error.response && error.response.status === 422) {
                    this.errorList = error.response.data.error;
                } else {
                    alert('Terjadi kesalahan saat memperbarui data.');
                }
            } finally {
                this.isLoading = false;
                this.isLoadingTitle = "Loading";
            }
        }
    }
}
</script>

<script setup>
import { ref } from 'vue';

const pageTitle = ref('Formulir Edit Koleksi');
</script>
