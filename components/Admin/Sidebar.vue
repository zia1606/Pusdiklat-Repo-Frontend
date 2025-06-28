<template>
    <!-- Overlay dengan efek blur -->
    <div v-if="show" class="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-xs md:hidden" @click="closeSidebar"></div>
  
    <!-- Sidebar -->
    <aside :class="{'fixed inset-y-0 z-50 w-64 h-screen overflow-y-auto  text-gray-700 transform transition-transform duration-200 ease-in-out bg-white border border-gray-300 md:relative md:translate-x-0': true, 'translate-x-0': show, '-translate-x-full': !show}">
      <!-- Tombol silang untuk menutup sidebar -->
      <button @click="closeSidebar" class="absolute top-4 right-4 text-grsy-700 hover:text-gray-400 focus:outline-none md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Bagian Header Sidebar yang sudah dimodernkan -->
      <div class="px-6 py-4 border-b border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 p-2">
            <img 
              src="/img/logo.png" 
              alt="Logo Repository Pusdiklat BPS" 
              class="h-full w-auto object-contain transition-transform hover:scale-105"
              loading="lazy"
            >
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-800 leading-tight">Repository</p>
            <p class="text-sm font-medium text-gray-500 leading-tight">Pusdiklat BPS</p>
          </div>
        </div>
      </div>

       <!-- Navigasi dan konten sidebar lainnya -->
       <nav class="my-10 px-2">
              <!-- Main Navigation -->
              <div class="space-y-4">
                  <!-- Dashboard -->
                  <NuxtLink 
          to="/admin/dashboard"
          :class="{
            'group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all': true,
            'bg-blue-50 text-blue-600': isDashboardActive,
            'text-gray-600 hover:bg-gray-100': !isDashboardActive
          }"
        >
          <svg class="h-5 w-5 mr-3" :class="{'text-blue-500': isDashboardActive, 'text-gray-500': !isDashboardActive}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NuxtLink>

                  <!-- Koleksi Dropdown -->
                  <div class="space-y-1">
                    <button
                        @click="toggleDropdown"
                        class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 focus:outline-none"
                        aria-expanded="isDropdownOpen"
                        aria-controls="analytics-dropdown"
                        >
                        <div class="flex items-center">
                            <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                              Manajemen Koleksi
                          </div>
                          <svg :class="{'rotate-180': isDropdownOpen, 'rotate-0': !isDropdownOpen}" class="ml-2 h-5 w-5 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                      </button>
                      <div v-if="isDropdownOpen" class="space-y-1 pl-11" id="analytics-dropdown">
                        <NuxtLink 
              to="/admin/tabelKoleksi"
              :class="{
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                'bg-blue-50 text-blue-600': isTabelKoleksiActive,
                'text-gray-600 hover:bg-gray-100': !isTabelKoleksiActive
              }"
            >
              Tabel Koleksi
            </NuxtLink>
            <NuxtLink 
              to="/admin/formKoleksi"
              :class="{
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                'bg-blue-50 text-blue-600': isFormKoleksiActive,
                'text-gray-600 hover:bg-gray-100': !isFormKoleksiActive
              }"
            >
              Tambah Koleksi
            </NuxtLink>
                      </div>
                  </div>

                  <!-- Menu Dropdown -->
                  <div class="space-y-1">
                      <button @click="toggleOtherTablesDropdown" class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 focus:outline-none" aria-expanded="true" aria-controls="analytics-dropdown">
                          <div class="flex items-center">
                            <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                              Tabel Lainnya
                          </div>
                          <svg :class="{'rotate-180': isOtherTablesDropdownOpen, 'rotate-0': !isOtherTablesDropdownOpen}" class="ml-2 h-5 w-5 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                      </button>
                      <div v-if="isOtherTablesDropdownOpen" class="space-y-1 pl-11" id="analytics-dropdown">
                          <NuxtLink 
                            to="/admin/kategoriBangKom"
                            :class="{
                                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                                'bg-blue-50 text-blue-600': isKategoriBangKomActive,
                                'text-gray-600 hover:bg-gray-100': !isKategoriBangKomActive
                            }"
                            >
                            Kategori Pengembangan Kompetensi
                            </NuxtLink>
                            <NuxtLink 
                                to="/admin/jenisDokumen"
                                :class="{
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                                    'bg-blue-50 text-blue-600': isJenisDokumenActive,
                                    'text-gray-600 hover:bg-gray-100': !isJenisDokumenActive
                                }"
                                >
                                Jenis Dokumen
                            </NuxtLink>
                      </div>
                  </div>

                  <!-- Team Dropdown -->
                  <!-- <div class="space-y-1">
                      <button class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white focus:outline-none" aria-expanded="false" aria-controls="team-dropdown">
                          <div class="flex items-center">
                              <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              Team
                          </div>
                          <svg class="ml-2 h-5 w-5 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                      </button>
                  </div> -->
              </div>
          </nav>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
        return {
            isDropdownOpen: true, // State untuk mengontrol dropdown
            isOtherTablesDropdownOpen: true, 
        };
    },
    computed: {
        isDashboardActive() {
        return this.$route.path === '/admin/dashboard';
        },
        isTabelKoleksiActive() {
        return this.$route.path === '/admin/tabelKoleksi';
        },
        isFormKoleksiActive() {
        return this.$route.path === '/admin/formKoleksi';
        },
        isKategoriBangKomActive() {
        return this.$route.path === '/admin/kategoriBangKom';
        },
        isJenisDokumenActive() {
        return this.$route.path === '/admin/jenisDokumen';
        },
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    emits: ['close', 'toggle'], // Tambahkan ini
    methods: {
      toggleSidebar() {
        this.$emit('toggle'); // Tambahkan method ini
      },
      closeSidebar() {
        this.$emit('close'); // Emit event untuk menutup sidebar
      },
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen; // Toggle state dropdown
      },
      toggleOtherTablesDropdown() {
        this.isOtherTablesDropdownOpen = !this.isOtherTablesDropdownOpen; // Toggle state dropdown
        },
    }
  };
  </script>
  
  <style>
  /* Tambahkan style jika diperlukan */
  </style>