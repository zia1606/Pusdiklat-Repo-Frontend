<template>
  <div>
    <section class="bg-gradient-to-b from-blue-900 to-blue-800 py-16">
      <div class="container mx-auto px-4">
        <div class="container mx-auto px-8">
          <div class="text-center">
            <h1 class="text-white text-center font-medium text-4xl leading-tight mb-3">{{ pageTitle }}</h1>

            <!-- Breadcrumb Navigation -->
            <nav class="flex justify-center mb-6" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2">
                <li class="inline-flex items-center">
                  <NuxtLink to="/" class="inline-flex items-center text-sm font-medium text-white hover:text-blue-200">
                    <svg class="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Beranda
                  </NuxtLink>
                </li>
                
                <li v-for="(crumb, index) in breadcrumbs" :key="index">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 text-white mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <NuxtLink 
                      v-if="index < breadcrumbs.length - 1 || !isCurrentPage(crumb.path)"
                      :to="crumb.path" 
                      class="ml-1 text-sm font-medium text-white hover:text-blue-200 md:ml-2">
                      {{ crumb.title }}
                    </NuxtLink>
                    <span 
                      v-else
                      class="ml-1 text-sm font-medium text-blue-200 md:ml-2">
                      {{ crumb.title }}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCurrentPage = (path) => {
  return route.path === path
}

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/koleksi') return 'Koleksi Diklat'
  if (path === '/riwayat') return 'Riwayat Baca'
  if (path === '/favorit') return 'Koleksi Favorit'
  if (path === '/simpan') return 'Koleksi Tersimpan'
  if (path === '/tentangKami') return 'Tentang Kami'
  if (path.startsWith('/detail/')) return 'Detail Dokumen'
  return 'Koleksi Diklat'
})

const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs = []
  
  if (path === '/') return crumbs
  
  // Level 2 (Koleksi/Riwayat/dll)
  if (path === '/koleksi' || path.startsWith('/detail/')) {
    crumbs.push({ title: 'Koleksi', path: '/koleksi' })
  } 
  else if (path === '/riwayat') {
    crumbs.push({ title: 'Riwayat', path: '/riwayat' })
  }
  else if (path === '/favorit') {
    crumbs.push({ title: 'Favorit', path: '/favorit' })
  }
  else if (path === '/simpan') {
    crumbs.push({ title: 'Simpan', path: '/simpan' })
  }
  else if (path === '/tentangKami') {
    crumbs.push({ title: 'Tentang Kami', path: '/tentangKami' })
  }
  
  // Level 3 (Detail)
  if (path.startsWith('/detail/')) {
    crumbs.push({ title: 'Detail', path: route.path })
  }
  
  return crumbs
})
</script>