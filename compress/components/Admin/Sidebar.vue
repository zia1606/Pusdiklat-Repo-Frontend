<template>
  <!-- Overlay dengan efek blur -->
  <div v-if="show" class="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-xs md:hidden" @click="closeSidebar"></div>

  <!-- Sidebar -->
  <!-- Sidebar -->
  <aside :class="{'fixed inset-y-0 z-50 w-64 h-screen overflow-y-auto transform transition-all duration-300 ease-in-out bg-white shadow-xl md:relative md:translate-x-0': true, 'translate-x-0': show, '-translate-x-full': !show}">
    <!-- Tombol silang untuk menutup sidebar -->
    <button @click="closeSidebar" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 focus:outline-none md:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
    
    <!-- Bagian Header Sidebar -->
    <div class="px-6 py-8">
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 p-2.5">
          <img 
            src="/img/logo.png" 
            alt="Logo" 
            class="h-full w-auto object-contain brightness-0 invert"
            loading="lazy"
          >
        </div>
        <div>
          <p class="text-xl font-bold text-gray-900 tracking-tight">Admin</p>
          <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Repository</p>
        </div>
      </div>
    </div>

    <!-- Navigasi -->
    <nav class="px-4 pb-10">
      <div class="space-y-6">
        <!-- Main Section -->
        <div>
          <p class="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
          <div class="space-y-1">
            <!-- Dashboard -->
            <NuxtLink 
              to="/admin/dashboard"
              class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              :class="isDashboardActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
            >
              <svg class="h-5 w-5 mr-3" :class="isDashboardActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </NuxtLink>

            <!-- Beranda -->
            <NuxtLink 
              to="/"
              class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Buka Portal Utama
            </NuxtLink>
          </div>
        </div>

        <!-- Management Section -->
        <div>
          <p class="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Management</p>
          <div class="space-y-1">
            <!-- Kelola Koleksi -->
            <div class="space-y-1">
              <button
                @click="toggleKoleksiDropdown"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                :class="isKoleksiParentActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
              >
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-3" :class="isKoleksiParentActive ? 'text-white' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Koleksi
                </div>
                <svg :class="{'rotate-180': isKoleksiDropdownOpen, 'text-white': isKoleksiParentActive, 'text-gray-400': !isKoleksiParentActive}" class="h-4 w-4 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-show="isKoleksiDropdownOpen" class="space-y-1 mt-1">
                <NuxtLink 
                  to="/admin/tabelKoleksi"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isTabelKoleksiActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Daftar Koleksi
                </NuxtLink>
                <NuxtLink 
                  to="/admin/formKoleksi"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isFormKoleksiActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Tambah Koleksi
                </NuxtLink>
                <NuxtLink 
                  to="/admin/penulis"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isPenulisActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Daftar Penulis
                </NuxtLink>
                <NuxtLink 
                  to="/admin/kategori"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isKategoriActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Kategori & Subkategori
                </NuxtLink>
              </div>
            </div>

            <!-- Konten & Informasi -->
            <div class="space-y-1">
              <button
                @click="toggleKontenDropdown"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                :class="isKontenParentActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
              >
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-3" :class="isKontenParentActive ? 'text-white' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                  </svg>
                  Konten & Informasi
                </div>
                <svg :class="{'rotate-180': isKontenDropdownOpen, 'text-white': isKontenParentActive, 'text-gray-400': !isKontenParentActive}" class="h-4 w-4 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-show="isKontenDropdownOpen" class="space-y-1 mt-1">
                <NuxtLink 
                  to="/admin/pemberitahuan"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isPemberitahuanActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Pemberitahuan
                </NuxtLink>
                <NuxtLink 
                  to="/admin/faq"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isFaqActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  FAQ
                </NuxtLink>
                <NuxtLink 
                  to="/admin/tata-tertib"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isTataTertibActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Tata Tertib
                </NuxtLink>
                <NuxtLink 
                  to="/admin/tentang-kami"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isTentangKamiActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Tentang Kami
                </NuxtLink>
              </div>
            </div>

            <!-- Kelola Pengguna -->
            <div class="space-y-1">
              <button
                @click="togglePenggunaDropdown"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                :class="isPenggunaParentActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
              >
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-3" :class="isPenggunaParentActive ? 'text-white' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Kelola Pengguna
                </div>
                <svg :class="{'rotate-180': isPenggunaDropdownOpen, 'text-white': isPenggunaParentActive, 'text-gray-400': !isPenggunaParentActive}" class="h-4 w-4 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-show="isPenggunaDropdownOpen" class="space-y-1 mt-1">
                <NuxtLink 
                  to="/admin/tabelAdmin"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isAdministratorActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Administrator
                </NuxtLink>
                <NuxtLink 
                  to="/admin/tabelUsers"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isTabelUsersActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Users
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Aktifitas Pengguna Section -->
        <div>
          <p class="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Aktifitas Pengguna</p>
          <div class="space-y-1">
            <!-- Buku Tamu -->
            <div class="space-y-1">
              <button
                @click="toggleBukuTamuDropdown"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                :class="isBukuTamuParentActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
              >
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-3" :class="isBukuTamuParentActive ? 'text-white' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Buku Tamu
                </div>
                <svg :class="{'rotate-180': isBukuTamuDropdownOpen, 'text-white': isBukuTamuParentActive, 'text-gray-400': !isBukuTamuParentActive}" class="h-4 w-4 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-show="isBukuTamuDropdownOpen" class="space-y-1 mt-1">
                <NuxtLink 
                  to="/admin/buku-tamu"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isBukuTamuActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Daftar Kunjungan
                </NuxtLink>
                <NuxtLink 
                  to="/admin/buku-tamu/qr"
                  class="flex items-center pl-12 pr-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="isBukuTamuQRActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                >
                  Tampilkan QR
                </NuxtLink>
              </div>
            </div>

            <!-- Log -->
            <NuxtLink 
              to="/admin/log-aktivitas"
              class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              :class="isLogAktivitasActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
            >
              <svg class="h-5 w-5 mr-3" :class="isLogAktivitasActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Log
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isKoleksiDropdownOpen = ref(false)
const isKategoriDropdownOpen = ref(false)
const isPenggunaDropdownOpen = ref(false)
const isBukuTamuDropdownOpen = ref(false)
const isKontenDropdownOpen = ref(false)

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle'])

// Computed properties untuk active states
const isDashboardActive = computed(() => route.path === '/admin/dashboard')
const isTabelKoleksiActive = computed(() => route.path === '/admin/tabelKoleksi')
const isFormKoleksiActive = computed(() => route.path === '/admin/formKoleksi')
const isPenulisActive = computed(() => route.path === '/admin/penulis')
const isKategoriActive = computed(() => route.path === '/admin/kategori')

const isPemberitahuanActive = computed(() => route.path === '/admin/pemberitahuan')
const isFaqActive = computed(() => route.path === '/admin/faq')
const isTataTertibActive = computed(() => route.path === '/admin/tata-tertib')
const isTentangKamiActive = computed(() => route.path === '/admin/tentang-kami')

const isAdministratorActive = computed(() => route.path === '/admin/tabelAdmin')
const isTabelUsersActive = computed(() => route.path === '/admin/tabelUsers')

const isBukuTamuActive = computed(() => route.path === '/admin/buku-tamu')
const isBukuTamuQRActive = computed(() => route.path === '/admin/buku-tamu/qr')
const isLogAktivitasActive = computed(() => route.path === '/admin/log-aktivitas')

// Parent active states
const isKoleksiParentActive = computed(() => 
  isTabelKoleksiActive.value || isFormKoleksiActive.value || isPenulisActive.value || isKategoriActive.value
)
const isKontenParentActive = computed(() => 
  isPemberitahuanActive.value || isFaqActive.value || isTataTertibActive.value || isTentangKamiActive.value
)
const isPenggunaParentActive = computed(() => 
  isAdministratorActive.value || isTabelUsersActive.value
)
const isBukuTamuParentActive = computed(() => 
  isBukuTamuActive.value || isBukuTamuQRActive.value
)

// Function to auto-open dropdowns based on route
const syncDropdownsWithRoute = () => {
  if (isKoleksiParentActive.value) isKoleksiDropdownOpen.value = true
  if (isKontenParentActive.value) isKontenDropdownOpen.value = true
  if (isPenggunaParentActive.value) isPenggunaDropdownOpen.value = true
  if (isBukuTamuParentActive.value) isBukuTamuDropdownOpen.value = true
}

// Watch for route changes to keep dropdowns open
watch(() => route.path, () => {
  syncDropdownsWithRoute()
}, { immediate: true })

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

const togglePenggunaDropdown = () => {
  isPenggunaDropdownOpen.value = !isPenggunaDropdownOpen.value
}

const toggleBukuTamuDropdown = () => {
  isBukuTamuDropdownOpen.value = !isBukuTamuDropdownOpen.value
}

const toggleKontenDropdown = () => {
  isKontenDropdownOpen.value = !isKontenDropdownOpen.value
}

</script>