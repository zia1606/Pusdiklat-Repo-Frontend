<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtLayout name="default">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Pusat Bantuan & FAQ</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar layanan Repositori Pusdiklat BPS.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Sidebar: Categories -->
          <div class="lg:w-1/4">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-24">
              <nav class="space-y-1">
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  @click="activeCategory = cat.id"
                  :class="[
                    activeCategory === cat.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  class="w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group"
                >
                  <!-- Manual SVG Icons -->
                  <div class="flex-shrink-0 mr-3 h-5 w-5">
                    <svg v-if="cat.id === 'all'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <svg v-else-if="cat.id === 'general'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="cat.id === 'account'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <svg v-else-if="cat.id === 'collection'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  {{ cat.name }}
                  <span 
                    v-if="activeCategory === cat.id"
                    class="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"
                  ></span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Right Content: FAQ List -->
          <div class="lg:w-3/4">
            <div class="space-y-4">
              <div 
                v-for="(faq, index) in filteredFaqs" 
                :key="index"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:border-blue-200"
              >
                <button 
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span class="text-lg font-bold text-gray-900 pr-8">{{ faq.question }}</span>
                  <span 
                    class="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center transition-transform duration-300"
                    :class="{ 'rotate-180 bg-blue-50 text-blue-600': openFaq === index }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  v-show="openFaq === index"
                  class="px-6 pb-6 text-gray-600 leading-relaxed text-base border-t border-gray-50 pt-4"
                >
                  {{ faq.answer }}
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredFaqs.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Tidak ada pertanyaan ditemukan</h3>
                <p class="text-gray-500">Coba pilih kategori lain atau hubungi admin.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

useHead({
  title: 'FAQ - Sistem Repositori Pusdiklat BPS'
})

const activeCategory = ref('all')
const openFaq = ref(null)

const { data: kategorisData } = await useFetch(`${apiBaseUrl}/api/faq-kategori`)
const { data: faqsData } = await useFetch(`${apiBaseUrl}/api/faqs`)

const categories = computed(() => {
  const base = [{ id: 'all', name: 'Semua Topik' }]
  if (kategorisData.value?.data) {
    return base.concat(kategorisData.value.data.map(k => ({ id: k.slug, name: k.name })))
  }
  return base
})

const faqs = computed(() => {
  if (faqsData.value?.data) {
    return faqsData.value.data.map(f => ({
      category: f.kategori?.slug || '',
      question: f.question,
      answer: f.answer
    }))
  }
  return []
})

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') return faqs.value
  return faqs.value.filter(faq => faq.category === activeCategory.value)
})

const toggleFaq = (index) => {
  if (openFaq.value === index) {
    openFaq.value = null
  } else {
    openFaq.value = index
  }
}
</script>
