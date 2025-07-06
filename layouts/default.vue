<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow relative">
      <!-- Tambahkan loading indicator global -->
      <div v-if="isInitializing" class="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
        <div class="animate-pulse text-center">
          <Spinner class="w-12 h-12 mx-auto" />
          <p class="mt-2 text-gray-600">Menyiapkan aplikasi...</p>
        </div>
      </div>
      <slot v-else />
    </main>
    <Toast />
    <Footer />
  </div>
</template>

<script setup>
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

const authStore = useUnifiedAuthStore()
const isInitializing = ref(true)

onMounted(async () => {
  await authStore.initializeAuth()
  isInitializing.value = false
})
</script>