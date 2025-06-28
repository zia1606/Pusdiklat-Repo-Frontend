<template>
    <div class="sticky top-0 z-50 transition-all duration-300">
      <!-- <div :class="{'bg-primary-blue': !isScrolled, 'bg-primary-blue backdrop-blur-md shadow-blue-900 shadow-md': isScrolled}" class="w-full mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-4 lg:px-20 py-3"> -->
        <div :class="{'bg-blue-900': !isScrolled, 'bg-blue-900 backdrop-blur-md shadow-blue-900 shadow-md': isScrolled}" class="w-full mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-4 lg:px-20 py-3">
        
        <!-- Logo di Kiri -->
        <a href="/" class="flex items-center justify-start">
          <img src="/img/logo putih.png" alt="Logo" class="w-56 md:w-50 h-auto">
        </a>
  
        <!-- Menu Tengah (Desktop) -->
<div class="hidden md:flex justify-center">
  <ul class="flex space-x-1">
    <li>
      <NuxtLink to="/" 
      :class="{
        'bg-gray-200 text-blue-800': isBerandaActive,
        'text-off-white text-blue-800': !isBerandaActive
      }" 
      class="flex item-centers px-4 py-2 rounded-md hover:bg-gray-200 font-medium hover:text-blue-800 transition-colors duration-300">
        Beranda
      </NuxtLink>
    </li>

    <li class="relative" ref="dropdown"
        @mouseover="isDropdownOpen = true"
        @mouseleave="isDropdownOpen = false"
        @click.self="toggleDropdown">
      <a  
      :class="{
        'bg-gray-200 text-blue-800': isLayananActive,
        'text-off-white text-blue-800': !isLayananActive
      }" 
      class="flex items-center font-medium px-3 py-2 hover:text-blue-800 rounded-md hover:bg-gray-200 transition-colors duration-300">
        Koleksi
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>

      <!-- Dropdown Menu -->
      <ul 
        :class="{'opacity-100 scale-100 translate-y-1 visible': isDropdownOpen, 'opacity-0 scale-95 invisible': !isDropdownOpen}" 
        class="absolute top-10 -left-15 bg-blue-900 ring-1 shadow-2xl ring-black/10 py-2 rounded-md w-52 transform transition-all duration-300">
        <li>
          <a href="/koleksi" 
            @click="animateClick('koleksi')" 
            :class="{'scale-105 bg-gray-300 duration-300': clickedMenu === 'koleksi'}"
            class="flex items-center text-white px-4 py-2 font-medium rounded-md mx-3 hover:bg-gray-200 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Daftar Koleksi
          </a>
        </li>
        <li>
          <a href="#" 
            @click.prevent="navigateToRiwayat" 
            :class="{'scale-105 bg-gray-300 transition-all duration-300': clickedMenu === 'riwayat'}"
            class="flex items-center text-white px-4 py-2 font-medium rounded-md mx-3 hover:bg-gray-200 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Riwayat Baca
          </a>
        </li>
        <li>
          <a href="#" 
            @click.prevent="navigateToFavorit" 
            :class="{'scale-105 bg-gray-300 transition-all duration-300': clickedMenu === 'favorit'}"
            class="flex items-center text-white px-4 py-2 font-medium rounded-md mx-3 hover:bg-gray-200 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Koleksi Favorit
          </a>
        </li>
      </ul>
    </li>

    <li>
      <NuxtLink to="/tentangKami" 
      :class="{
        'bg-gray-200 text-blue-800': isTentangKamiActive,
        'text-off-white hover:text-blue-800': !isTentangKamiActive
      }" class="flex item-centers font-medium hover:text-blue-800 transition-colors duration-300 px-1 py-2 rounded-md hover:bg-gray-200 whitespace-nowrap">
        Tentang Kami
      </NuxtLink>
    </li>
  </ul>
</div>
  
        <!-- Tombol Masuk di Kanan (Desktop) -->
        <div class="hidden md:flex justify-end">
  
          <!-- Avatar (hanya tampil jika sudah login) -->
          <div v-if="isLoggedIn" x-data="{ userDropDownIsOpen: false, openWithKeyboard: false }"
            @keydown.esc.window="userDropDownIsOpen = false, openWithKeyboard = false" 
            class="relative flex items-center ml-4">
            <button 
              @click="toggleUserDropdown"
              @mouseenter="handleHoverOpen"
              @mouseleave="handleHoverClose"
              :aria-expanded="userDropDownIsOpen"
              @keydown.space.prevent="openWithKeyboard = true"
              @keydown.enter.prevent="openWithKeyboard = true"
              @keydown.down.prevent="openWithKeyboard = true"
              class="inline-flex items-center p-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
              aria-controls="userMenu">
              
              <span class="sr-only">User Menu</span>
                <div class="hidden md:flex md:flex-col md:items-end md:leading-tight">
                  <span class="text-xs text-gray-300">Selamat datang,</span>
                  <span class="font-semibold text-sm text-gray-200">{{ firstName }}</span>
                </div>
  
                <span class="w-10 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
              <img 
                :src="userAvatar || `https://ui-avatars.com/api/?name=${firstName}&background=random&color=fff`"
                alt="User Profile"
                class="object-cover rounded-full size-10 cursor-pointer" />
              </span>
  
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="hidden sm:block h-5 w-5 text-gray-300">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg> 
  
            </button>
            
            <!-- User Dropdown -->
            <ul 
              v-show="userDropDownIsOpen"
              @mouseenter="handleHoverOpen"
              @mouseleave="handleHoverClose"
              @click.outside="userDropDownIsOpen = false, openWithKeyboard = false"
              @keydown.down.prevent="$focus.wrap().next()" 
              @keydown.up.prevent="$focus.wrap().previous()" 
              id="userMenu"
              class="absolute right-0 top-14 flex w-full min-w-[12rem] flex-col overflow-hidden rounded-md border border-gray-400 py-1.5 bg-gray-200">
              <li class="border-b border-gray-400">
                <div class="flex flex-col px-4 py-2">
                  <span class="text-sm font-medium text-gray-700">
                    {{ userName || 'User' }}
                  </span>
                  <p class="text-xs text-gray-700">
                    {{ userEmail || 'user@example.com' }}
                  </p>
                </div>
              </li>
              <li>
                <a 
                  href="#"
                  @click.prevent="logout"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </a>
              </li>
            </ul>
          </div>
  
          <!-- Tombol Masuk (hanya tampil jika belum login) -->
          <NuxtLink 
            v-else
            to="/auth/login" 
            class="bg-gray-200 font-medium hover:bg-gray-300 text-primary-blue px-4 py-2 rounded-lg transition-colors duration-300">
            Masuk
          </NuxtLink>
        </div>
  
        <!-- Tombol Menu Mobile -->
        <div class="md:hidden flex justify-end">
          <button @click="toggleMobileMenu" class="text-off-white hover:text-gray-400 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Overlay dan Menu Mobile -->
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300" @click="toggleMobileMenu"></div>
      
      <nav v-if="isMobileMenuOpen" class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300"
           :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">
        <div class="flex flex-col p-5">
          <button @click="toggleMobileMenu" class="self-end text-gray-700 hover:text-red-500 transition-all">
            ✕
          </button>
          <ul class="mt-4 space-y-4">
            <li>
              <NuxtLink to="/" @click="toggleMobileMenu" 
                :class="{
                  'text-blue-800': isBerandaActive, 
                  'text-gray-900': !isBerandaActive}"
                class="block text-lg font-medium hover:text-gray-600">Beranda
              </NuxtLink>
            </li>
            <li>
              <button @click="toggleMobileDropdown" 
              :class="{
                'text-blue-800': isLayananActive, 
                'text-gray-900': !isLayananActive}"
              class="flex justify-between w-full text-lg font-medium hover:text-gray-600">
                Koleksi
                <span :class="isMobileDropdownOpen ? 'rotate-180' : 'rotate-0'" class="transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
              <ul v-show="isMobileDropdownOpen" class="mt-2 space-y-2 pl-4 border-l border-gray-300">
                <li>
                  <NuxtLink to="/koleksi" 
                  @click="toggleMobileMenu" 
                  :class="{
                    'text-blue-800': activeRoute === '/koleksi', 
                    'text-gray-800': activeRoute !== '/koleksi'}"
                  class="block text-md font-medium hover:text-gray-500">
                  Daftar Koleksi
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    v-if="isLoggedIn"
                    to="/riwayat" 
                    @click="toggleMobileMenu"
                    :class="{
                      'text-blue-800': activeRoute === '/riwayat', 
                      'text-gray-800': activeRoute !== '/riwayat'}"
                    class="block text-md font-medium hover:text-gray-500"
                  >
                    Riwayat Baca
                  </NuxtLink>
  <!-- <a href="#" @click.prevent="navigateToRiwayat; toggleMobileMenu();" class="block text-lg text-gray-700 hover:text-gray-500">
        Riwayat
      </a> -->
                  <!-- <NuxtLink to="/riwayat" @click="toggleMobileMenu" class="block text-lg text-gray-700 hover:text-gray-500">Riwayat</NuxtLink> -->
                </li>
                <li>
                  <NuxtLink 
                    v-if="isLoggedIn"
                    to="/favorit" 
                    @click="toggleMobileMenu"
                    :class="{
                      'text-blue-800': activeRoute === '/favorit', 
                      'text-gray-800': activeRoute !== '/favorit'}"
                    class="block text-md font-medium hover:text-gray-500"
                  >
                    Koleksi Favorit
                  </NuxtLink>
                </li>
                <!-- <li>
                  <NuxtLink 
                    v-if="isLoggedIn"
                    to="/simpan" 
                    @click="toggleMobileMenu"
                    :class="{
                      'text-blue-800': activeRoute === '/simpan', 
                      'text-gray-800': activeRoute !== '/simpan'}"
                    class="block text-md font-medium hover:text-gray-500"
                  >
                    Simpan
                  </NuxtLink>
                </li> -->
              </ul>
            </li>
            <li><NuxtLink to="/tentangKami" @click="toggleMobileMenu" 
              :class="{'text-blue-800': isTentangKamiActive, 'text-gray-900': !isTentangKamiActive}"
              class="block text-lg font-medium hover:text-gray-600">Tentang Kami</NuxtLink></li>
            <li v-if="!isLoggedIn">
              <NuxtLink to="/auth/login" @click="toggleMobileMenu" class="block bg-blue-800 font-medium text-white text-center py-2 rounded-md hover:bg-blue-700 transition-all">
                Masuk
              </NuxtLink>
            </li>
            <li v-if="isLoggedIn" class="flex items-center space-x-3">
              <!-- <img 
                :src="userAvatar || 'https://penguinui.s3.amazonaws.com/component-assets/avatar-8.webp'"
                alt="User Profile"
                class="object-cover rounded-full size-10" /> -->
                <NuxtImg
                  :key="userAvatar"
                  :src="userAvatar || 'https://penguinui.s3.amazonaws.com/component-assets/avatar-8.webp'"
                  alt="User Profile"
                  class="object-cover rounded-full size-10"
                />
                <div>
                <p class="text-sm font-medium">{{ userName || 'User' }}</p>
                <button 
                  @click="logout"
                  class="text-sm text-blue-800 hover:text-blue-700">
                  Keluar
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDropdownOpen: false,
        clickedMenu: null,
        isMobileMenuOpen: false,
        isMobileDropdownOpen: false,
        isScrolled: false,
        isLoggedIn: false,
  
        // User dropdown states
        userDropDownIsOpen: false,
        openWithKeyboard: false,
        hoverTimeout: null
      };
    },
    async mounted() {
      document.addEventListener("click", this.closeDropdown);
      window.addEventListener("scroll", this.handleScroll);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.closeDropdown);
      window.removeEventListener("scroll", this.handleScroll);
  
      this.clearHoverTimeout();
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      closeDropdown(event) {
        if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
          this.isDropdownOpen = false;
        }
      },
      toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        if (!this.isMobileMenuOpen) {
          this.isMobileDropdownOpen = false;
        }
      },
      toggleMobileDropdown() {
        this.isMobileDropdownOpen = !this.isMobileDropdownOpen;
      },
      animateClick(menu) {
        this.clickedMenu = menu;
        setTimeout(() => {
          this.clickedMenu = null;
        }, 300);
      },
      handleScroll() {
        this.isScrolled = window.scrollY > 50;
      },
  
      // User dropdown methods
      toggleUserDropdown() {
        this.userDropDownIsOpen = !this.userDropDownIsOpen;
        this.openWithKeyboard = false;
        this.clearHoverTimeout();
      },
      
      openUserDropdownWithKeyboard() {
        this.userDropDownIsOpen = true;
        this.openWithKeyboard = true;
        this.clearHoverTimeout();
      },
      
      closeUserDropdown() {
        this.userDropDownIsOpen = false;
        this.openWithKeyboard = false;
      },
      
      handleHoverOpen() {
        this.clearHoverTimeout();
        this.userDropDownIsOpen = true;
      },
      
      handleHoverClose() {
        this.hoverTimeout = setTimeout(() => {
          if (!this.openWithKeyboard) {
            this.userDropDownIsOpen = false;
          }
        }, 300);
      },
      
      clearHoverTimeout() {
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout);
          this.hoverTimeout = null;
        }
      },
      
    },
  };
  </script>
  
  <script setup>
  import { useAuthStore } from '~/stores/auth'
  import { computed, onMounted, ref } from 'vue'
  // Update the script setup section
  import { useToast } from '~/composables/useToast'; // Adjust path as needed
  
  // In the setup script
  const { showToast } = useToast();
  
  const authStore = useAuthStore()
  const isLoggedIn = ref(false)
  
  const route = useRoute()
  
  const activeRoute = computed(() => {
    return route.path
  })
  
  const isBerandaActive = computed(() => {
    return activeRoute.value === '/'
  })
  
  const isLayananActive = computed(() => {
    return ['/koleksi', '/riwayat', '/favorit', '/simpan'].includes(activeRoute.value)
  })
  
  const isTentangKamiActive = computed(() => {
    return activeRoute.value === '/tentangKami'
  })
  
  // Dalam script setup NavBar.vue
  const navigateToRiwayat = () => {
    if (!authStore.isLoggedIn) {
      showToast('warning', 'Silakan masuk terlebih dahulu untuk melihat riwayat baca');
      // return navigateTo('/auth/login');
      return;
    }
    navigateTo('/riwayat');
  };
  
  const navigateToFavorit = () => {
    if (!authStore.isLoggedIn) {
      showToast('warning', 'Silakan masuk terlebih dahulu untuk melihat koleksi favorit');
      // return navigateTo('/auth/login');
      return;
    }
    navigateTo('/favorit');
  };
  
  const navigateToSimpan = () => {
    if (!authStore.isLoggedIn) {
      showToast('warning', 'Silakan masuk terlebih dahulu untuk melihat koleksi tersimpan');
      return;
      // return navigateTo('/auth/login');
    }
    navigateTo('/simpan');
  };
  
  // Inisialisasi dan verifikasi token
  onMounted(async () => {
    authStore.init()
    
    // Jika ada token, verifikasi ke backend
    if (authStore.token) {
      const isValid = await authStore.verifyToken()
      isLoggedIn.value = isValid
    } else {
      isLoggedIn.value = false
    }
  })
  
  const userAvatar = computed(() => authStore.user?.avatar || `https://ui-avatars.com/api/?name=${authStore.user?.name || 'User'}&background=random&color=fff`)
  const userName = computed(() => authStore.user?.name || 'User')
  const userEmail = computed(() => authStore.user?.email || '')
  
  const firstName = computed(() => {
    return userName.value.split(' ')[0]
  })
  
  const logout = async () => {
    await authStore.logout()
    isLoggedIn.value = false
    showToast('success', 'Logout berhasil!');
    navigateTo('/')
  }
  </script>