<template>
    <header class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center justify-between h-16 px-4">
        <!-- Left Section -->
        <div class="flex items-center md:pl-63">
          <button 
            @click="toggleSidebar"
            class="md:hidden mr-4 text-gray-500 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>
  
        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- User Profile -->
          <div class="relative group" @mouseleave="onMouseLeaveProfile">
            <button 
              @click="toggleUserMenu"
              @mouseenter="onMouseEnterProfile"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <div class="text-right hidden md:block">
                <p class="text-sm font-medium text-gray-700">{{ adminName }}</p>
                <p class="text-xs text-gray-500">Admin</p>
              </div>
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-100 overflow-hidden">
                  <img 
                    :src="adminAvatar" 
                    alt="Admin profile"
                    class="h-full w-full object-cover"
                  >
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 ml-1 text-gray-400 group-hover:text-gray-600 transition-colors"
                  :class="{ 'transform rotate-180': isUserMenuOpen }"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </button>
  
            <!-- User Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                @mouseenter="onMouseEnterDropdown"
                @mouseleave="onMouseLeaveDropdown"
              >
                <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  <p class="font-medium">{{ adminName }}</p>
                  <p class="truncate">{{ adminEmail }}</p>
                </div>
                <button 
                  @click="logout"
                  class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
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