<template>
    <div class="min-h-screen flex flex-col">
        <NavBar />
        <main class="flex-grow">
            <slot />
        </main>
        <Toast />
        <Footer />
    </div>
</template>
  
<script setup>
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

const authStore = useUnifiedAuthStore()

// Jika admin mengakses halaman user, tetap tampilkan NavBar
// Tidak perlu redirect karena middleware sudah menangani
</script>