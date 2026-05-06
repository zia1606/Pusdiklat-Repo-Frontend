<template>
    <header class="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div class="flex items-center justify-between h-16 px-6">
        <!-- Left Section -->
        <div class="flex items-center md:pl-64">
          <button 
            @click="toggleSidebar"
            class="md:hidden mr-4 text-gray-500 rounded-xl p-2 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="text-lg font-bold text-gray-900 tracking-tight">{{ pageTitle }}</h1>
        </div>
  
        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- User Profile -->
          <div class="relative group" @mouseleave="onMouseLeaveProfile">
            <button 
              @click="toggleUserMenu"
              @mouseenter="onMouseEnterProfile"
              class="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none"
            >
              <div class="text-right hidden md:block">
                <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ adminName }}</p>
                <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Administrator</p>
              </div>
              <div class="relative">
                <div class="h-9 w-9 rounded-xl bg-blue-50 overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                  <img 
                    :src="adminAvatar" 
                    alt="Admin profile"
                    class="h-full w-full object-cover"
                  >
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </button>
  
            <!-- User Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95 translate-y-2"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100 translate-y-0"
              leave-to-class="transform opacity-0 scale-95 translate-y-2"
            >
              <div 
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100"
                @mouseenter="onMouseEnterDropdown"
                @mouseleave="onMouseLeaveDropdown"
              >
                <div class="px-4 py-3 border-b border-gray-50 mb-1">
                  <p class="text-sm font-bold text-gray-900">{{ adminName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ adminEmail }}</p>
                </div>
                
                <div class="px-2">
                  <button 
                    @click="logout"
                    class="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <div class="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100 text-red-600 mr-3 group-hover:bg-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
  
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  
  const props = defineProps({
    pageTitle: {
      type: String,
      default: 'Dashboard'
    }
  });
  
  const emit = defineEmits(['toggle-sidebar']);
  const authStore = useUnifiedAuthStore();
  
  const isUserMenuOpen = ref(false);
  let hoverTimeout = null;
  let dropdownHoverTimeout = null;
  
  // Computed properties
  const adminName = computed(() => authStore.user?.name || 'Admin');
  const adminEmail = computed(() => authStore.user?.email || 'admin@example.com');
  const adminAvatar = computed(() => authStore.getUserAvatar || 
  `https://ui-avatars.com/api/?name=${authStore.user?.name || 'Admin'}&background=random&color=fff`
)
  
  const toggleSidebar = () => {
    emit('toggle-sidebar');
  };
  
  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
    // Clear any pending hover timeouts when clicking
    clearTimeout(hoverTimeout);
    clearTimeout(dropdownHoverTimeout);
  };
  
  const onMouseEnterProfile = () => {
    clearTimeout(hoverTimeout);
    clearTimeout(dropdownHoverTimeout);
    isUserMenuOpen.value = true;
  };
  
  const onMouseLeaveProfile = () => {
    hoverTimeout = setTimeout(() => {
      if (!isUserMenuOpen.value) return;
      isUserMenuOpen.value = false;
    }, 300); // Delay before closing when leaving profile area
  };
  
  const onMouseEnterDropdown = () => {
    clearTimeout(hoverTimeout);
    clearTimeout(dropdownHoverTimeout);
    isUserMenuOpen.value = true;
  };
  
  const onMouseLeaveDropdown = () => {
    dropdownHoverTimeout = setTimeout(() => {
      isUserMenuOpen.value = false;
    }, 300); // Delay before closing when leaving dropdown
  };
  
  const logout = async () => {
  try {
    // Tutup dropdown menu segera
    isUserMenuOpen.value = false
    
    // Tambahkan loading state jika perlu
    const loading = ref(true)
    
    await authStore.logout()
    
    // Gunakan window.location untuk pastikan semua state reset
    window.location.href = '/auth/login'
    
  } catch (error) {
    console.error('Logout failed:', error)
    // Fallback jika ada error
    authStore.clearAuth()
    window.location.href = '/auth/login'
  }
}
  </script>
  
  <style scoped>
  header {
    transition: all 0.3s ease;
  }
  
  /* Improved dropdown animation */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
  
  /* Better z-index handling */
  .z-50 {
    z-index: 50;
  }
  </style>