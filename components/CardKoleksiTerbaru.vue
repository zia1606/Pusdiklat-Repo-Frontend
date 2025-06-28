<template>
    <div class="pt-20 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section with Explore Button -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-10 gap-6 px-4">
  <div class="text-left w-full lg:w-auto">
    <!-- New Badge with consistent styling -->
    <!-- <div class="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-blue-800 text-white text-xs font-bold tracking-wide shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      BARU
    </div> -->
    
    <h2 class="text-3xl font-bold text-gray-900 mb-2">
      Koleksi <span class="text-blue-800">Terbaru</span>
    </h2>
    <p class="text-gray-600 max-w-lg">Temukan koleksi terupdate dari koleksi kami</p>
  </div>

  <div class="w-full lg:w-auto flex justify-end">
    <NuxtLink 
      to="/koleksi" 
      class="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
    >
      Lihat Semua
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
  </div>
</div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <Loading title="Memuat koleksi terbaru..." />
        </div>
  
        <!-- Empty State -->
        <div v-else-if="cards.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Tidak ada koleksi tersedia</h3>
          <p class="mt-1 text-gray-500">Coba periksa kembali nanti.</p>
        </div>
  
        <!-- Carousel Container -->
<div v-else class="relative">
  <!-- Carousel Wrapper -->
  <div class="overflow-x-hidden overflow-y-visible pb-1">
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: carouselTransform }"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="px-3 flex-shrink-0"
        :style="{ width: `${100 / cardsPerSlide}%` }"
      >
        <div class="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300 border border-gray-200 group hover:border-blue-200 relative">
          <!-- Badge BEST -->
          <!-- <div v-if="card.isBestCollection" class="absolute top-4 right-4 z-10">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
              BEST
            </span>
          </div> -->

          <!-- Card Image Placeholder -->
          <!-- <div class="h-40 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div> -->

          <!-- Best Collection Badge -->
    <div 
      v-if="card.isBestCollection"
      class="absolute top-0 right-0 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md"
    >
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
        Best Collection
      </div>
    </div>

          <!-- Card Content -->
          <div class="p-5 mt-2 flex-1 flex flex-col">
            <!-- Category and Document Type -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-if="card.kategori" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ card.kategori }}
              </span>
              <span v-if="card.jenisDokumen" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {{ card.jenisDokumen }}
              </span>
              <!-- <span v-if="card.isBestCollection" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                BEST
              </span> -->
            </div>

            <!-- Title -->
            <NuxtLink 
              :to="`/detail/${card.id}`" 
              class="block text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2"
            >
              {{ card.title }}
            </NuxtLink>

            <p class="text-sm text-gray-500 mt-1">
              <span class="font-semibold">Oleh: </span>
              {{ card.penulis }}
            </p>

            <!-- Author and Year -->
            <div class="flex items-center text-sm text-gray-500 my-3 space-x-4">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-blue-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>{{ card.views }} dibaca</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ card.tahunTerbit }}</span>
              </div>
            </div>

            <!-- Spacer to push button to bottom -->
            <div class="flex-grow"></div>

            <!-- Detail Button - Now positioned at bottom right -->
            <div class="pt-3 border-t border-gray-100 flex justify-end">
              <NuxtLink 
                :to="`/detail/${card.id}`" 
                class="inline-flex items-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform group-hover:scale-[1.02]"
              >
                Lihat Detail
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
          <!-- Navigation Buttons -->
          <button
            @click="scrollCarousel(-1)"
            class="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-800 z-10 transition-all duration-200 hover:scale-110"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
            :disabled="currentIndex === 0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            @click="scrollCarousel(1)"
            class="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-800 z-10 transition-all duration-200 hover:scale-110"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex >= maxGulir }"
            :disabled="currentIndex >= maxGulir"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
  
        <!-- Dots Indicator -->
        <div v-if="cards.length > 0" class="flex justify-center mt-8 space-x-2">
          <button
            v-for="i in totalDots"
            :key="i"
            @click="currentIndex = i-1"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
            :class="{
              'w-6 bg-blue-800': currentIndex === i-1,
              'bg-gray-300': currentIndex !== i-1
            }"
            aria-label="Go to slide"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from "vue";
  import axios from 'axios';
  
  // KONFIGURASI
  const TOTAL_CARDS = 10; // Selalu tampilkan 10 card
  const CARDS_PER_SLIDE = {
    small: 1,   // <470px
    medium1: 2, // 470-775px
    medium2: 3, // 775-1024px
    large: 4    // ≥1024px
  };
  
  // State
  const currentIndex = ref(0);
  const cards = ref([]); // Data dari API saja, tanpa dummy
  const cardsPerSlide = ref(CARDS_PER_SLIDE.small);
  const isLoading = ref(true);
  
  // Fungsi pembantu
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text || '';
  };
  
  // Update cards per slide berdasarkan ukuran layar
  const updateCardsPerSlide = () => {
    const width = window.innerWidth;
    if (width < 550) cardsPerSlide.value = CARDS_PER_SLIDE.small;
    else if (width < 870) cardsPerSlide.value = CARDS_PER_SLIDE.medium1;
    else if (width < 1155) cardsPerSlide.value = CARDS_PER_SLIDE.medium2;
    else cardsPerSlide.value = CARDS_PER_SLIDE.large;
    
    currentIndex.value = 0; // Reset ke slide pertama
  };
  
  // Navigasi carousel
  const scrollCarousel = (direction) => {
    if (cards.value.length === 0) return;
    
    const maxGulir = Math.max(0, cards.value.length - cardsPerSlide.value);
    let newIndex = currentIndex.value + direction;
    
    if (newIndex > maxGulir) newIndex = 0;
    else if (newIndex < 0) newIndex = maxGulir;
    
    currentIndex.value = newIndex;
  };
  
  // Ambil data dari API
  const getKoleksiTerbaru = async () => {
    try {
      isLoading.value = true;
      const res = await axios.get('http://127.0.0.1:8000/api/koleksi', {
        params: { 
          sort_by: 'terbaru',
          per_page: TOTAL_CARDS 
        }
      });
      
      cards.value = res.data.data.slice(0, TOTAL_CARDS).map(item => ({
        id: item.id,
        title: truncateText(item.judul, 50),
        penulis: item.penulis || 'Penulis tidak tersedia',
        kategori: item.kategoriBangKom,
        jenisDokumen: item.jenis_dokumen,
        tahunTerbit: item.tahun_terbit,
        views: item.views,
        isBestCollection: item.is_best_collection
      }));
    } catch (error) {
      console.error('Gagal memuat data:', error);
      cards.value = []; // Kosongkan jika error
    } finally {
      isLoading.value = false;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    getKoleksiTerbaru();
  });
  
  onUnmounted(() => {
    window.removeEventListener("resize", updateCardsPerSlide);
  });
  
  // Computed properties
  const carouselTransform = computed(() => {
    return cards.value.length > 0 
      ? `translateX(-${currentIndex.value * (100 / cardsPerSlide.value)}%)`
      : '';
  });
  
  const totalDots = computed(() => {
    return cards.value.length > 0
      ? Math.max(1, cards.value.length - cardsPerSlide.value + 1)
      : 0;
  });
  
  const maxGulir = computed(() => {
    return cards.value.length > 0
      ? cards.value.length - cardsPerSlide.value
      : 0;
  });
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>