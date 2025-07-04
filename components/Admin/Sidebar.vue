<template>
  <!-- Overlay dengan efek blur -->
  <div v-if="show" class="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-xs md:hidden" @click="closeSidebar"></div>

  <!-- Sidebar -->
  <aside :class="{'fixed inset-y-0 z-50 w-64 h-screen overflow-y-auto text-gray-700 transform transition-transform duration-200 ease-in-out bg-white border border-gray-300 md:relative md:translate-x-0': true, 'translate-x-0': show, '-translate-x-full': !show}">
    <!-- Tombol silang untuk menutup sidebar -->
    <button @click="closeSidebar" class="absolute top-4 right-4 text-gray-700 hover:text-gray-400 focus:outline-none md:hidden">
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
      <div class="space-y-1">
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </NuxtLink>

        <!-- Beranda -->
        <NuxtLink 
          to="/"
          :class="{
            'group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all': true,
            'bg-blue-50 text-blue-600': isHomeActive,
            'text-gray-600 hover:bg-gray-100': !isHomeActive
          }"
        >
          <svg class="h-5 w-5 mr-3" :class="{'text-blue-500': isHomeActive, 'text-gray-500': !isHomeActive}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Beranda
        </NuxtLink>

        <!-- Kelola Koleksi -->
        <div class="space-y-1">
          <button
            @click="toggleKoleksiDropdown"
            class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 focus:outline-none"
            aria-expanded="isKoleksiDropdownOpen"
            aria-controls="koleksi-dropdown"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Kelola Koleksi
            </div>
            <svg :class="{'rotate-180': isKoleksiDropdownOpen, 'rotate-0': !isKoleksiDropdownOpen}" class="ml-2 h-5 w-5 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div v-if="isKoleksiDropdownOpen" class="space-y-1 pl-11" id="koleksi-dropdown">
            <NuxtLink 
              to="/admin/tabelKoleksi"
              :class="{
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                'bg-blue-50 text-blue-600': isTabelKoleksiActive,
                'text-gray-600 hover:bg-gray-100': !isTabelKoleksiActive
              }"
            >
              Daftar Koleksi
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

        <!-- Kelola Kategori -->
        <div class="space-y-1">
          <button
            @click="toggleKategoriDropdown"
            class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 focus:outline-none"
            aria-expanded="isKategoriDropdownOpen"
            aria-controls="kategori-dropdown"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Kelola Kategori
            </div>
            <svg :class="{'rotate-180': isKategoriDropdownOpen, 'rotate-0': !isKategoriDropdownOpen}" class="ml-2 h-5 w-5 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div v-if="isKategoriDropdownOpen" class="space-y-1 pl-11" id="kategori-dropdown">
            <NuxtLink 
              to="/admin/kategoriBangKom"
              :class="{
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all': true,
                'bg-blue-50 text-blue-600': isKategoriBangKomActive,
                'text-gray-600 hover:bg-gray-100': !isKategoriBangKomActive
              }"
            >
              Kategori Kompetensi
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

        <!-- Kelola Pengguna -->
        <NuxtLink 
          to="/admin/tabelUsers"
          :class="{
            'group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all': true,
            'bg-blue-50 text-blue-600': isTabelUsersActive,
            'text-gray-600 hover:bg-gray-100': !isTabelUsersActive
          }"
        >
          <svg class="h-5 w-5 mr-3" :class="{'text-blue-500': isTabelUsersActive, 'text-gray-500': !isTabelUsersActive}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Kelola Pengguna
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isKoleksiDropdownOpen = ref(true)
const isKategoriDropdownOpen = ref(true)

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle'])

// Computed properties untuk active states
const isHomeActive = computed(() => route.path === '/')
const isDashboardActive = computed(() => route.path === '/admin/dashboard')
const isTabelKoleksiActive = computed(() => route.path === '/admin/tabelKoleksi')
const isFormKoleksiActive = computed(() => route.path === '/admin/formKoleksi')
const isTabelUsersActive = computed(() => route.path === '/admin/tabelUsers')
const isKategoriBangKomActive = computed(() => route.path === '/admin/kategoriBangKom')
const isJenisDokumenActive = computed(() => route.path === '/admin/jenisDokumen')

// Methods
const toggleSidebar = () => {
  emit('toggle')
}

const closeSidebar = () => {
  emit('close')
}

const toggleKoleksiDropdown = () => {
  isKoleksiDropdownOpen.value = !isKoleksiDropdownOpen.value
}

const toggleKategoriDropdown = () => {
  isKategoriDropdownOpen.value = !isKategoriDropdownOpen.value
}
</script>