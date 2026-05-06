<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtLayout name="default">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Pemberitahuan</h1>
          <p class="text-gray-600 mt-2">Dapatkan informasi terbaru seputar layanan dan koleksi perpustakaan.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sisi Kiri: List Card Pemberitahuan -->
          <div class="lg:col-span-2 space-y-6">
            <div v-for="(notif, index) in notifications" :key="index" 
                 class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div class="flex items-start gap-4">
                <div :class="notif.color" class="p-3 rounded-lg flex-shrink-0">
                  <!-- SVG Icons -->
                  <svg v-if="notif.iconType === 'book'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <svg v-else-if="notif.iconType === 'refresh'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H15" />
                  </svg>
                  <svg v-else-if="notif.iconType === 'alert'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-lg font-bold text-gray-900 truncate">{{ notif.title }}</h3>
                    <span class="text-xs text-gray-500 whitespace-nowrap">{{ notif.date }}</span>
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ notif.description }}</p>
                  <div v-if="notif.link" class="mt-4">
                    <NuxtLink :to="notif.link" class="text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                      Lihat Selengkapnya
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State if no notifications -->
            <div v-if="notifications.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p class="text-gray-500">Belum ada pemberitahuan baru.</p>
            </div>
          </div>

          <!-- Sisi Kanan: Tata Tertib & Tautan Cepat -->
          <div class="space-y-8">
            <!-- Tata Tertib -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-blue-800 px-6 py-4">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Tata Tertib
                </h3>
              </div>
              <div class="p-6">
                <ul class="space-y-4">
                  <li v-for="(rule, index) in rules" :key="index" class="flex gap-3">
                    <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {{ index + 1 }}
                    </span>
                    <p class="text-sm text-gray-600">{{ rule }}</p>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tautan Cepat -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Tautan Cepat</h3>
              <div class="grid grid-cols-1 gap-3">
                <NuxtLink v-for="(link, index) in quickLinks" :key="index" :to="link.url"
                   class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <span class="text-sm font-medium text-gray-700 group-hover:text-blue-800">{{ link.name }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: 'Pemberitahuan - Sistem Repositori Pusdiklat BPS'
})

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Fetch Pemberitahuan
const { data: notifData } = await useFetch(`${apiBaseUrl}/api/pemberitahuan`)
const notifications = computed(() => notifData.value?.data || [])

// Fetch Tata Tertib
const { data: rulesData } = await useFetch(`${apiBaseUrl}/api/tata-tertib`)
const rules = computed(() => rulesData.value?.data?.map(r => r.rule_text) || [])

const quickLinks = [
  { name: 'Daftar Koleksi', url: '/koleksi' },
  { name: 'Panduan Pengguna', url: '/faq' },
  { name: 'Tentang Kami', url: '/tentangKami' },
  { name: 'Scan Buku Tamu', url: '/scan' }
]
</script>
