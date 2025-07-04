<template>
  <div v-if="authStore.isInitialized">
    <div v-if="authStore.isAuthenticated && authStore.isAdmin" class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Konten admin -->
    </div>
    <div v-else>
      <!-- Redirect dengan loading state -->
      <div class="flex items-center justify-center h-screen bg-gray-50">
        <div class="text-center">
          <p class="text-lg">Mengarahkan ke halaman login...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

const authStore = useUnifiedAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
  
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    // Tambahkan delay kecil untuk memastikan CSS terload
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 100)
  }
})
</script>