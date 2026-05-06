<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans">
    <Sidebar :show="showSidebar" @close="showSidebar = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderAdmin :pageTitle="'Manajemen Koleksi'" @toggle-sidebar="showSidebar = !showSidebar" />

      <main class="flex-1 overflow-y-auto p-4 sm:p-8 pt-20">
      <div class="p-10">
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="text-gray-500 font-medium animate-pulse">Memuat data koleksi...</p>
        </div>

        <div v-else-if="koleksi" class="max-w-4xl mx-auto space-y-6 pb-20">
          <!-- Quick Actions & Status -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-4">
              <button @click="router.back()" class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" title="Kembali">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div class="h-8 w-px bg-gray-200"></div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
                <span :class="koleksi.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {{ koleksi.is_active ? 'Aktif' : 'Non-Aktif' }}
                </span>
                <button v-if="koleksi.is_best_collection" class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  ⭐ Best
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <template v-if="!isEditing">
                <button @click="startEditing" class="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Koleksi
                </button>
              </template>
              <template v-else>
                <button @click="cancelEditing" class="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-all">
                  Batal
                </button>
                <button @click="saveChanges" :disabled="isSaving" class="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm">
                  <svg v-if="!isSaving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Simpan
                </button>
              </template>
            </div>
          </div>

          <!-- Main Table Card -->
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Header Section with Media -->
            <div class="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row gap-10">
              <!-- Thumbnail -->
              <div class="relative group w-full md:w-48 flex-shrink-0">
                <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100 shadow-md flex items-center justify-center relative">
                  <img v-if="tempThumbnailUrl || koleksi.thumbnail" :src="tempThumbnailUrl || koleksi.thumbnail" class="w-full h-full object-cover" />
                  <svg v-else class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  
                  <!-- Edit Overlay -->
                  <div v-if="isEditing" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" @click="$refs.thumbnailInput.click()">
                    <div class="text-white text-center">
                      <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span class="text-[10px] font-black uppercase">Ganti Sampul</span>
                    </div>
                  </div>
                  <input type="file" ref="thumbnailInput" accept="image/*" class="hidden" @change="handleThumbnailChange" />
                </div>
              </div>

              <!-- Basic Titles -->
              <div class="flex-1 py-2">
                <div class="space-y-4">
                  <div>
                    <label class="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Judul Utama</label>
                    <input v-if="isEditing" v-model="editForm.judul" class="w-full text-2xl font-black text-gray-900 border-b-2 border-blue-200 focus:border-blue-600 outline-none bg-transparent pb-1" />
                    <h1 v-else class="text-3xl font-black text-gray-900 leading-tight">{{ koleksi.judul }}</h1>
                  </div>
                  
                  <div>
                    <label class="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Penulis</label>
                    <div v-if="isEditing">
                      <AuthorSelector v-model="editForm.penulis_list" @open-modal="authorModalOpen = true" />
                    </div>
                    <p v-else class="text-lg text-gray-600 font-bold italic">
                      <span v-for="(p, idx) in koleksi.penulis_list" :key="p.id">{{ p.nama }}{{ idx < koleksi.penulis_list.length - 1 ? ', ' : '' }}</span>
                      <span v-if="!koleksi.penulis_list || koleksi.penulis_list.length === 0">{{ koleksi.penulis || '-' }}</span>
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-4 pt-2">
                    <div class="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span class="text-xs font-bold text-blue-800">{{ koleksi.tahun_terbit || '-' }}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span class="text-xs font-bold text-emerald-800">{{ koleksi.views || 0 }} Views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Unified Metadata Table -->
            <div class="overflow-hidden">
              <table class="w-full">
                <tbody class="divide-y divide-gray-100">
                  <!-- Custom rows for complex data -->
                  
                  <!-- No. Induk -->
                  <tr class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">No. Induk</td>
                    <td class="px-8 py-4 relative">
                      <input v-if="isEditing" v-model="editForm.no_induk" class="w-full border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-bold bg-transparent" />
                      <div v-else class="flex justify-between items-center">
                        <span class="text-sm font-bold text-gray-800">{{ koleksi.no_induk || '-' }}</span>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity p-1 hover:bg-blue-100 rounded">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Penerbit -->
                  <tr class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">Penerbit</td>
                    <td class="px-8 py-4">
                      <input v-if="isEditing" v-model="editForm.penerbit" class="w-full border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-bold bg-transparent" />
                      <div v-else class="flex justify-between items-center">
                        <span class="text-sm font-bold text-gray-800">{{ koleksi.penerbit || '-' }}</span>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Tempat Terbit -->
                  <tr class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">Tempat Terbit</td>
                    <td class="px-8 py-4">
                      <input v-if="isEditing" v-model="editForm.tempat_terbit" class="w-full border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-bold bg-transparent" />
                      <div v-else class="flex justify-between items-center">
                        <span class="text-sm font-bold text-gray-800">{{ koleksi.tempat_terbit || '-' }}</span>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Kategori & Sub (View Mode Only) -->
                  <tr v-if="!isEditing" class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">Kategori</td>
                    <td class="px-8 py-4">
                      <div class="flex justify-between items-center">
                        <div class="flex flex-wrap gap-2">
                          <span v-for="k in koleksi.kategoris" :key="k.id" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-100">
                            {{ k.nama }}
                          </span>
                          <span v-for="s in koleksi.sub_kategoris" :key="s.id" class="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-black uppercase border border-gray-100">
                            {{ s.nama }}
                          </span>
                        </div>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Kategori Selection (Edit Mode Only) -->
                  <tr v-else class="bg-blue-50/20">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50 align-top pt-6">Ganti Kategori</td>
                    <td class="px-8 py-4">
                      <div class="grid grid-cols-2 gap-3">
                        <label v-for="k in kategoriList" :key="k.id" class="flex items-center gap-2 p-2 rounded-xl border border-white hover:border-blue-200 cursor-pointer bg-white/50">
                          <input type="checkbox" :value="k.id" v-model="editForm.kategori_ids" class="h-4 w-4 text-blue-600 rounded" />
                          <span class="text-xs font-bold text-gray-700">{{ k.nama }}</span>
                        </label>
                      </div>
                    </td>
                  </tr>

                  <!-- Bibliographic Standard Data -->
                  <tr v-for="field in standardFields" :key="field.key" class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">{{ field.label }}</td>
                    <td class="px-8 py-4">
                      <input v-if="isEditing" v-model="editForm[field.key]" :type="field.type || 'text'" class="w-full border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-bold bg-transparent" />
                      <div v-else class="flex justify-between items-center">
                        <span class="text-sm font-bold text-gray-800">{{ koleksi[field.key] || '-' }}</span>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Ringkasan (Textarea style) -->
                  <tr class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50 align-top pt-6">Ringkasan</td>
                    <td class="px-8 py-4">
                      <div v-if="isEditing">
                        <textarea v-model="editForm.ringkasan" rows="6" class="w-full p-4 rounded-2xl border border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none text-sm font-medium resize-none bg-blue-50/10"></textarea>
                      </div>
                      <div v-else class="flex justify-between items-start">
                        <p class="text-sm text-gray-600 leading-relaxed text-justify">{{ koleksi.ringkasan || '-' }}</p>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded ml-4 flex-shrink-0">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Keywords -->
                  <tr class="group hover:bg-blue-50/30 transition-colors">
                    <td class="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-50">Keywords</td>
                    <td class="px-8 py-4">
                      <input v-if="isEditing" v-model="editForm.keywords" placeholder="Misal: ekonomi, statistik, pembangunan" class="w-full border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-bold bg-transparent" />
                      <div v-else class="flex justify-between items-center">
                        <div class="flex flex-wrap gap-2">
                          <span v-for="tag in keywordsList" :key="tag" class="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase">#{{ tag }}</span>
                          <span v-if="keywordsList.length === 0" class="text-sm font-bold text-gray-400">-</span>
                        </div>
                        <button @click="startEditing" class="opacity-0 group-hover:opacity-100 text-blue-600 p-1 hover:bg-blue-100 rounded ml-4">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- File / Media Management -->
                  <tr class="bg-gray-50/50">
                    <td class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest w-1/3 border-r border-gray-100 align-top">Media & Berkas</td>
                    <td class="px-8 py-6">
                      <div class="space-y-4">
                        <!-- PDF Management -->
                        <div class="flex flex-col gap-2">
                          <label class="text-[10px] font-black text-orange-600 uppercase tracking-widest">Berkas PDF</label>
                          <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div class="flex items-center gap-3">
                              <div class="p-2 bg-orange-100 rounded-lg">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              </div>
                              <div>
                                <p class="text-sm font-bold text-gray-800">{{ koleksi.dokumen_pdf ? 'PDF Tersedia' : 'Belum ada berkas' }}</p>
                                <p v-if="tempPdfName" class="text-[10px] text-blue-600 font-bold italic">Baru: {{ tempPdfName }}</p>
                                <p v-else class="text-[10px] text-gray-400 font-medium">Format: PDF (Max 10MB)</p>
                              </div>
                            </div>
                            
                            <template v-if="isEditing">
                              <button @click="$refs.pdfInput.click()" class="px-4 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm">
                                Ganti File
                              </button>
                              <input type="file" ref="pdfInput" accept=".pdf" class="hidden" @change="handlePdfChange" />
                            </template>
                            <a v-else-if="koleksi.dokumen_pdf" :href="koleksi.dokumen_pdf" target="_blank" class="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 transition-all">
                              Lihat File
                            </a>
                          </div>
                        </div>

                        <!-- YouTube Management -->
                        <div class="flex flex-col gap-2">
                          <label class="text-[10px] font-black text-red-600 uppercase tracking-widest">Link YouTube</label>
                          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <input v-if="isEditing" v-model="editForm.youtube_link" placeholder="https://youtube.com/watch?v=..." class="w-full border-b border-red-200 focus:border-red-500 outline-none text-sm font-bold bg-transparent" />
                            <div v-else class="flex justify-between items-center">
                              <span class="text-sm font-bold text-gray-800 truncate max-w-[300px]">{{ koleksi.youtube_link || '-' }}</span>
                              <a v-if="koleksi.youtube_link" :href="koleksi.youtube_link" target="_blank" class="text-red-600 hover:text-red-800 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            <!-- Footer Meta -->
            <div class="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Ditambahkan: {{ formatDate(koleksi.created_at) }}</span>
              <span>Terakhir Update: {{ formatDate(koleksi.updated_at) }}</span>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  </div>

  <AuthorModal :isOpen="authorModalOpen" @close="authorModalOpen = false" @success="handleAuthorAdded" />
  <Toast />
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { useToast } from '~/composables/useToast'
import { useRuntimeConfig } from '#app'
import Sidebar from '@/components/Admin/Sidebar.vue'
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue'
import AuthorSelector from '@/components/Admin/AuthorSelector.vue'
import AuthorModal from '@/components/Admin/AuthorModal.vue'

definePageMeta({ middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const authStore = useUnifiedAuthStore()
const { showToast } = useToast()
const { public: { apiBaseUrl } } = useRuntimeConfig()

const koleksi = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const isEditing = ref(false)
const showSidebar = ref(false)
const authorModalOpen = ref(false)
const kategoriList = ref([])

// For media preview
const tempThumbnailUrl = ref(null)
const tempPdfName = ref(null)

const editForm = reactive({
  judul: '', no_induk: '', tahun_terbit: '', penerbit: '', keywords: '',
  ringkasan: '', ddc: '', cutter: '', call_number: '', Klasifikasi: '', kode: '',
  isbn: '', isbn_digital: '', issn: '', edisi_cetak: '', tempat_terbit: '',
  jml_hal_romawi: '', jml_hal_angka: '', youtube_link: '',
  kategori_ids: [], penulis_list: [],
  thumbnail: null, dokumen_pdf: null
})

// Fields displayed in the loop
const standardFields = [
  { key: 'tahun_terbit', label: 'Tahun Terbit' },
  { key: 'ddc', label: 'DDC' },
  { key: 'cutter', label: 'Cutter' },
  { key: 'call_number', label: 'Call Number' },
  { key: 'Klasifikasi', label: 'Klasifikasi' },
  { key: 'kode', label: 'Kode' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'isbn_digital', label: 'ISBN Digital' },
  { key: 'issn', label: 'ISSN' },
  { key: 'edisi_cetak', label: 'Edisi Cetak' },
  { key: 'jml_hal_romawi', label: 'Hal. Romawi' },
  { key: 'jml_hal_angka', label: 'Hal. Angka' },
]

const fetchDetail = async () => {
  try {
    isLoading.value = true
    const res = await axios.get(`${apiBaseUrl}/api/koleksi/${route.params.id}/edit`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    koleksi.value = res.data.data || res.data
  } catch {
    showToast('error', 'Gagal mengambil data koleksi')
    router.push('/admin/tabelKoleksi')
  } finally {
    isLoading.value = false
  }
}

const fetchKategori = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/kategori`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    kategoriList.value = res.data.data || res.data
  } catch {}
}

const startEditing = () => {
  const k = koleksi.value
  Object.assign(editForm, {
    judul: k.judul, no_induk: k.no_induk, tahun_terbit: k.tahun_terbit,
    penerbit: k.penerbit, keywords: k.keywords, ringkasan: k.ringkasan,
    ddc: k.ddc, cutter: k.cutter, call_number: k.call_number,
    Klasifikasi: k.Klasifikasi, kode: k.kode, isbn: k.isbn,
    isbn_digital: k.isbn_digital, issn: k.issn, edisi_cetak: k.edisi_cetak,
    tempat_terbit: k.tempat_terbit, jml_hal_romawi: k.jml_hal_romawi,
    jml_hal_angka: k.jml_hal_angka, youtube_link: k.youtube_link,
    kategori_ids: (k.kategoris || []).map(c => c.id),
    penulis_list: [...(k.penulis_list || [])],
    thumbnail: null, dokumen_pdf: null
  })
  isEditing.value = true
}

const cancelEditing = () => { 
  isEditing.value = false 
  tempThumbnailUrl.value = null
  tempPdfName.value = null
}

const handleThumbnailChange = (e) => { 
  const file = e.target.files[0]
  if (file) {
    editForm.thumbnail = file
    tempThumbnailUrl.value = URL.createObjectURL(file)
  }
}

const handlePdfChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    editForm.dokumen_pdf = file
    tempPdfName.value = file.name
  }
}

const handleAuthorAdded = (a) => { editForm.penulis_list.push(a) }

const saveChanges = async () => {
  isSaving.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    
    // Add simple fields
    const allFields = ['judul','no_induk','tahun_terbit','penerbit','keywords','ringkasan',
      'ddc','cutter','call_number','Klasifikasi','kode','isbn','isbn_digital','issn',
      'edisi_cetak','tempat_terbit','jml_hal_romawi','jml_hal_angka', 'youtube_link']
    
    allFields.forEach(f => {
      formData.append(f, editForm[f] !== null && editForm[f] !== undefined ? editForm[f] : '')
    })
    
    // Arrays
    editForm.penulis_list.forEach(p => formData.append('penulis_ids[]', p.id))
    editForm.kategori_ids.forEach(id => formData.append('kategori_ids[]', id))
    
    // Files
    if (editForm.thumbnail) formData.append('thumbnail', editForm.thumbnail)
    if (editForm.dokumen_pdf) formData.append('dokumen_pdf', editForm.dokumen_pdf)

    await axios.post(`${apiBaseUrl}/api/koleksi/${route.params.id}`, formData, {
      headers: { 
        'Authorization': `Bearer ${authStore.token}`, 
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    
    showToast('success', 'Koleksi berhasil diperbarui!')
    isEditing.value = false
    tempThumbnailUrl.value = null
    tempPdfName.value = null
    await fetchDetail()
  } catch (e) {
    console.error('Save Error:', e.response?.data)
    showToast('error', e.response?.data?.message || 'Gagal menyimpan perubahan')
  } finally {
    isSaving.value = false
  }
}

const keywordsList = computed(() => {
  if (!koleksi.value?.keywords) return []
  return koleksi.value.keywords.split(',').map(s => s.trim()).filter(Boolean)
})

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { 
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([fetchDetail(), fetchKategori()])
})
</script>
