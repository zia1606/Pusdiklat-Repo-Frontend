<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :show="showSidebar" @close="showSidebar = false" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Background Decoration -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>

      <!-- Header -->
      <HeaderAdmin 
        :pageTitle="pageTitle" 
        @toggle-sidebar="toggleSidebar" 
      />
            
      <!-- Form Container -->
      <div class="flex-1 overflow-y-auto p-6 md:p-10 pt-24 relative z-10">
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-10">
            <div class="flex items-center space-x-4">
              <NuxtLink 
                to="/admin/tabelKoleksi" 
                class="h-12 w-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-md transition-all duration-300 group"
              >
                <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </NuxtLink>
              <div>
                <h1 class="text-2xl font-black text-gray-900 tracking-tight">Edit Koleksi</h1>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Perbarui informasi aset digital</p>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-100/20 border border-white overflow-hidden animate-modalIn">
            <!-- Form Header Gradient -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-10 relative overflow-hidden">
              <div class="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white opacity-10"></div>
              <div class="relative z-10">
                <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ID: #{{ koleksiId }}
                </div>
                <h2 class="text-2xl font-black text-white tracking-tight">Informasi Koleksi</h2>
                <p class="text-blue-100 text-sm font-medium mt-1">Lengkapi data berikut untuk melakukan pembaruan</p>
              </div>
            </div>
            
            <!-- Form Content -->
            <div class="p-10">
              <div v-if="isLoading && !koleksi.judul" class="py-20 flex flex-col items-center justify-center">
                <div class="h-12 w-12 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin mb-4"></div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Memuat Data...</p>
              </div>
              
              <div v-else>
                <form @submit.prevent="editKoleksi" class="space-y-10">
                  <!-- Section 1: Basic Info -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                      <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Informasi Utama</h3>
                    </div>

                    <!-- Judul -->
                    <div class="space-y-2 group">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Judul Koleksi <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="koleksi.judul" 
                        type="text" 
                        required
                        @paste="(e) => handlePasteText(e, 'judul')"
                        placeholder="Masukkan judul lengkap dokumen..."
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                      >
                      <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.judul">{{ errorList.judul?.[0] }}</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Penulis -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Penulis / Narasumber <span class="text-red-500">*</span>
                        </label>
                        <input 
                          v-model="koleksi.penulis" 
                          type="text" 
                          required
                          @paste="(e) => handlePasteText(e, 'penulis')"
                          placeholder="Nama lengkap penulis..."
                          class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                        >
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.penulis">{{ errorList.penulis?.[0] }}</p>
                      </div>
                      
                      <!-- Tahun Terbit -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Tahun Penyelenggaraan <span class="text-red-500">*</span>
                        </label>
                        <input 
                          v-model="koleksi.tahun_terbit" 
                          type="text" 
                          required
                          placeholder="Contoh: 2024"
                          class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                        >
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.tahun_terbit">{{ errorList.tahun_terbit?.[0] }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Metadata -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                      <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Klasifikasi & Metadata</h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Kategori -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Kategori Pengembangan Kompetensi
                        </label>
                        <div class="relative">
                          <select 
                            v-model="koleksi.kategori_bang_kom_id"
                            class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 appearance-none"
                          >
                            <option :value="null">Pilih Kategori</option>
                            <option v-for="kategori in kategoriBangKomList" :key="kategori.id" :value="kategori.id">
                              {{ kategori.nama }}
                            </option>
                          </select>
                          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.kategori_bang_kom_id">{{ errorList.kategori_bang_kom_id?.[0] }}</p>
                      </div>

                      <!-- Jenis Dokumen -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Jenis Dokumen
                        </label>
                        <div class="relative">
                          <select 
                            v-model="koleksi.jenis_dokumen_id"
                            class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 appearance-none"
                          >
                            <option :value="null">Pilih Jenis Dokumen</option>
                            <option v-for="jenis in jenisDokumenList" :key="jenis.id" :value="jenis.id">
                              {{ jenis.nama }}
                            </option>
                          </select>
                          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.jenis_dokumen_id">{{ errorList.jenis_dokumen_id?.[0] }}</p>
                      </div>
                    </div>

                    <!-- Ringkasan -->
                    <div class="space-y-2 group">
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Ringkasan Deskripsi
                      </label>
                      <textarea 
                        v-model="koleksi.ringkasan" 
                        @paste="(e) => handlePasteText(e, 'ringkasan')"
                        rows="5"
                        placeholder="Tuliskan deskripsi singkat koleksi..."
                        class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium text-gray-900 placeholder-gray-300 leading-relaxed"
                      ></textarea>
                      <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.ringkasan">{{ errorList.ringkasan?.[0] }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Penerbit -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Penerbit / Penyelenggara
                        </label>
                        <input 
                          v-model="koleksi.penerbit" 
                          type="text" 
                          @paste="(e) => handlePasteText(e, 'penerbit')"
                          placeholder="Contoh: Pusdiklat BPS"
                          class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                        >
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.penerbit">{{ errorList.penerbit?.[0] }}</p>
                      </div>
                      
                      <!-- Keywords -->
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Tag / Kata Kunci
                        </label>
                        <input 
                          v-model="koleksi.keywords" 
                          type="text" 
                          @paste="(e) => handlePasteText(e, 'keywords')"
                          placeholder="Pisahkan dengan koma (contoh: Statistik, Big Data)"
                          class="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                        >
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.keywords">{{ errorList.keywords?.[0] }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Section 3: Content -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="h-6 w-1 bg-blue-600 rounded-full"></div>
                      <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Konten Aset Digital</h3>
                    </div>

                    <!-- Content Type Selection -->
                    <div class="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center">
                        Pilih Tipe Konten Utama
                      </label>
                      <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <label 
                          class="relative flex-1 cursor-pointer group"
                          :class="koleksi.content_type === 'pdf' ? 'opacity-100' : 'opacity-60'"
                        >
                          <input type="radio" v-model="koleksi.content_type" value="pdf" class="sr-only">
                          <div 
                            class="p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-center space-x-3"
                            :class="koleksi.content_type === 'pdf' ? 'bg-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-transparent border-gray-200 hover:border-blue-200'"
                          >
                            <div class="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <span class="font-black text-xs uppercase tracking-widest text-gray-900">Dokumen PDF</span>
                          </div>
                        </label>

                        <label 
                          class="relative flex-1 cursor-pointer group"
                          :class="koleksi.content_type === 'youtube' ? 'opacity-100' : 'opacity-60'"
                        >
                          <input type="radio" v-model="koleksi.content_type" value="youtube" class="sr-only">
                          <div 
                            class="p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-center space-x-3"
                            :class="koleksi.content_type === 'youtube' ? 'bg-white border-red-600 shadow-xl shadow-red-100' : 'bg-transparent border-gray-200 hover:border-red-200'"
                          >
                            <div class="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                              </svg>
                            </div>
                            <span class="font-black text-xs uppercase tracking-widest text-gray-900">Video YouTube</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <!-- PDF Upload Section -->
                    <div v-if="koleksi.content_type === 'pdf'" class="animate-fadeIn">
                      <div v-if="koleksi.dokumen_pdf && !newFile && !existingFileRemoved" class="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 border-dashed">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <div class="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-600 border border-gray-100">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div class="max-w-md">
                              <p class="text-sm font-black text-gray-900 truncate tracking-tight">{{ koleksi.dokumen_pdf.split('/').pop() }}</p>
                              <div class="flex items-center mt-1">
                                <span class="text-[10px] font-black uppercase tracking-widest bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md mr-2">PDF Aktif</span>
                                <span class="text-[10px] font-bold text-gray-400">Arsip tersimpan di server</span>
                              </div>
                            </div>
                          </div>
                          <div class="flex space-x-2">
                            <label for="dokumen_pdf_replace" class="h-11 px-6 rounded-xl bg-green-50 text-green-600 border border-green-100 flex items-center justify-center text-xs font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer">
                              Ganti File
                            </label>
                            <input id="dokumen_pdf_replace" type="file" @change="handleFileUpload" accept="application/pdf" class="hidden">
                            <button @click="removeExistingFile" type="button" class="h-11 w-11 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group/btn">
                              <svg class="w-5 h-5 transition-transform group-hover/btn:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- New File Upload State -->
                      <div v-else-if="newFile" class="bg-blue-50 rounded-[2rem] p-8 border border-blue-200 border-dashed">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <div class="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-blue-100">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div class="max-w-md">
                              <p class="text-sm font-black text-gray-900 truncate tracking-tight">{{ newFile.name }}</p>
                              <div class="flex items-center mt-1">
                                <span class="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded-md mr-2">Baru</span>
                                <span class="text-[10px] font-bold text-blue-400">{{ (newFile.size / 1024 / 1024).toFixed(2) }} MB</span>
                              </div>
                            </div>
                          </div>
                          <div class="flex space-x-2">
                            <button @click="previewNewFile" type="button" class="h-11 px-6 rounded-xl bg-white text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300">
                              Pratinjau
                            </button>
                            <button @click="removeNewFile" type="button" class="h-11 w-11 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Empty Upload State -->
                      <div v-else class="group">
                        <label for="dokumen_pdf" class="flex flex-col items-center justify-center w-full h-48 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-500 overflow-hidden relative group">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                            <div class="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500 mb-4">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                              </svg>
                            </div>
                            <p class="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Klik untuk mengunggah file PDF</p>
                            <p class="text-[10px] font-bold text-gray-400 mt-2">Maksimal ukuran file: 10MB</p>
                          </div>
                          <input id="dokumen_pdf" type="file" @change="handleFileUpload" accept="application/pdf" class="hidden">
                        </label>
                      </div>
                      <p class="text-[10px] font-bold text-red-500 mt-2 ml-2" v-if="errorList.dokumen_pdf">{{ errorList.dokumen_pdf?.[0] }}</p>
                    </div>

                    <!-- YouTube Section -->
                    <div v-if="koleksi.content_type === 'youtube'" class="animate-fadeIn">
                      <div class="space-y-2 group">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID / Link YouTube</label>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-red-500">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                          </div>
                          <input 
                            v-model="koleksi.youtube_link" 
                            type="url" 
                            placeholder="https://www.youtube.com/watch?v=..."
                            class="block w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-gray-900 placeholder-gray-300"
                          >
                        </div>
                        <p class="text-[10px] font-bold text-gray-400 ml-1">Gunakan link format https://www.youtube.com/watch?v=... atau https://youtu.be/...</p>
                        <p class="text-[10px] font-bold text-red-500 mt-1 ml-1" v-if="errorList.youtube_link">{{ errorList.youtube_link?.[0] }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button Area -->
                  <div class="pt-10 border-t border-gray-50 flex flex-col sm:flex-row gap-4 items-center">
                    <button 
                      type="submit" 
                      :disabled="isLoading"
                      class="w-full sm:flex-1 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 group"
                    >
                      <span v-if="!isLoading" class="flex items-center justify-center">
                        Simpan Perubahan
                        <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <span v-else class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sinkronisasi...
                      </span>
                    </button>
                    <NuxtLink 
                      to="/admin/tabelKoleksi"
                      class="w-full sm:w-auto px-10 py-5 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-gray-100 transition-all text-center"
                    >
                      Batal
                    </NuxtLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <!-- Page Footer -->
          <div class="mt-10 text-center">
            <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2024 Pusdiklat BPS RI • SIKOMPAK</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { definePageMeta, navigateTo } from '#imports'
import { $fetch } from 'ofetch'
import { useToast } from '~/composables/useToast'

// Import components
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'

const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Edit Koleksi - Sistem Repositori Pusdiklat BPS'
})

const { showToast } = useToast()

// Middleware to ensure only admin can access
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const route = useRoute()
const authStore = useUnifiedAuthStore()

const pageTitle = ref('Manajemen Aset')
const showSidebar = ref(false)
const koleksiId = ref('')
const koleksi = ref({
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
  content_type: '', // 'pdf' or 'youtube'
})
const kategoriBangKomList = ref([])
const jenisDokumenList = ref([])
const isLoading = ref(false)
const isLoadingTitle = ref('Loading')
const errorList = ref({})
const newFile = ref(null)
const existingFileRemoved = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// Authentication check using unified auth
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
    if (newFile.value) {
      newFile.value = null
    }
    existingFileRemoved.value = false
  }
})

// Initial check when component is mounted
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return

  koleksiId.value = route.params.id
  await Promise.all([
    getKoleksi(koleksiId.value),
    fetchKategoriBangKom(),
    fetchJenisDokumen()
  ])
})

const getKoleksi = async (id) => {
  isLoading.value = true
  try {
    const response = await $fetch(`${apiBaseUrl}/api/koleksi/${id}/edit`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    
    if (response.koleksi) {
      const koleksiData = response.koleksi
      
      // Set koleksi data and determine content_type
      koleksi.value = {
        judul: koleksiData.judul || '',
        penulis: koleksiData.penulis || '',
        ringkasan: koleksiData.ringkasan || '',
        kategori_bang_kom_id: koleksiData.kategori_bang_kom_id || null,
        jenis_dokumen_id: koleksiData.jenis_dokumen_id || null,
        tahun_terbit: koleksiData.tahun_terbit || '',
        penerbit: koleksiData.penerbit || '',
        keywords: koleksiData.keywords || '',
        dokumen_pdf: koleksiData.dokumen_pdf || null,
        youtube_link: koleksiData.youtube_link || '',
        content_type: koleksiData.youtube_link ? 'youtube' : 'pdf'
      }
    } else {
      showToast('error', 'Gagal mengambil data koleksi')
    }
  } catch (error) {
    console.error('Error fetching koleksi:', error)
    if (error.status === 401) {
      showToast('error', 'Sesi telah berakhir, silakan login kembali')
      await authStore.logout()
      await navigateTo('/auth/login')
    } else {
      showToast('error', 'Terjadi kesalahan saat mengambil data koleksi')
    }
  } finally {
    isLoading.value = false
  }
}

const fetchKategoriBangKom = async () => {
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
  }
}

const fetchJenisDokumen = async () => {
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
  }
}

// Paste handlers for all text fields
const handlePasteText = (e, fieldName) => {
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  const cleanedText = pastedText.replace(/\s+/g, ' ').trim()
  
  if (e.target.tagName.toLowerCase() === 'textarea') {
    const currentPosition = e.target.selectionStart
    const textBefore = koleksi.value[fieldName].substring(0, currentPosition)
    const textAfter = koleksi.value[fieldName].substring(e.target.selectionEnd)
    
    koleksi.value[fieldName] = textBefore + cleanedText + textAfter
    e.preventDefault()
    
    nextTick(() => {
      e.target.selectionStart = currentPosition + cleanedText.length
      e.target.selectionEnd = currentPosition + cleanedText.length
    })
  } 
  else {
    koleksi.value[fieldName] = (koleksi.value[fieldName] + cleanedText).substring(0, 255)
    e.preventDefault()
  }
}

const handleFileUpload = (event) => {
  if (event.target.files && event.target.files[0]) {
    newFile.value = event.target.files[0]
    event.target.value = ''
  }
}

const removeExistingFile = () => {
  existingFileRemoved.value = true
  koleksi.value.dokumen_pdf = null
}

const removeNewFile = () => {
  newFile.value = null
}

const previewNewFile = () => {
  if (newFile.value) {
    const fileURL = URL.createObjectURL(newFile.value)
    window.open(fileURL, '_blank')
    setTimeout(() => { URL.revokeObjectURL(fileURL) }, 10000)
  }
}

const editKoleksi = async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo('/auth/login')
    return
  }

  isLoading.value = true
  isLoadingTitle.value = "Memperbarui"

  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('judul', koleksi.value.judul)
  formData.append('penulis', koleksi.value.penulis)
  formData.append('ringkasan', koleksi.value.ringkasan || '')
  formData.append('kategori_bang_kom_id', koleksi.value.kategori_bang_kom_id || '')
  formData.append('jenis_dokumen_id', koleksi.value.jenis_dokumen_id || '')
  formData.append('tahun_terbit', koleksi.value.tahun_terbit)
  formData.append('penerbit', koleksi.value.penerbit || '')
  formData.append('keywords', koleksi.value.keywords || '')
  formData.append('content_type', koleksi.value.content_type)
  
  if (koleksi.value.content_type === 'pdf') {
    if (newFile.value) { formData.append('dokumen_pdf', newFile.value) }
    if (existingFileRemoved.value) { formData.append('remove_file', 'true') }
  } else if (koleksi.value.content_type === 'youtube') {
    formData.append('youtube_link', koleksi.value.youtube_link)
    if (koleksi.value.dokumen_pdf) { formData.append('remove_file', 'true') }
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/api/koleksi/${koleksiId.value}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    
    if (response.message) {
      showToast('success', response.message)
      await navigateTo('/admin/tabelKoleksi')
    }
  } catch (error) {
    console.error('Error updating koleksi:', error)
    if (error.status === 422) {
      errorList.value = error.data.error
      showToast('error', 'Validasi gagal: Silakan periksa kembali input Anda.')
    } else {
      showToast('error', 'Terjadi kesalahan saat memperbarui data.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-modalIn {
  animation: modalIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>