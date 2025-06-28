<template>
    <div class="bg-soft-white">
      <NuxtLayout>
      <div class="relative">

        <!-- <section class="bg-gradient-to-b from-[#3932B7] via-[#4038D6] to-[#7974DE] pt-20 pb-35"> -->
          <!-- <section class="bg-gradient-to-b from-blue-900 to-blue-800 pt-20 pb-35"> -->
            <section class="bg-gradient-to-b from-blue-900 to-blue-800 pt-20 pb-10">
          <div class="w-full mx-auto px-4 lg:px-20 overflow-hidden">
            <div class="w-full mx-auto lg:px-8 lg:items-center">
              <div class="text-center">
                <img src="https://i.ibb.co/8D7rcYv/download.webp" width="2880" height="1358" decoding="async" data-nimg="1" class="w-full h-full object-cover m-auto absolute inset-0 pointer-events-none" loading="lazy" style="color:transparent">
                <h1 class="text-yellow-400 font-bold text-6xl lg:text-6xl leading-tight">Repository</h1>
                <h2 class="text-white font-bold text-4xl lg:text-5xl leading-tight mb-3">Pusdiklat Badan Pusat Statistik</h2>
               <!-- Teks yang berubah-ubah -->
          <div class="h-10 flex items-center justify-center">
            <p class="text-white text-lg mb-0 sm:px-10 md:px-40 transition-opacity duration-1000" v-html="currentText"></p>
          </div>
              </div>
              
              <div class="pt-20 pb-12">
                <search @search="handleSearch" />
              </div>
             
            
            </div>
          </div>
        </section>
  
      </div>
  
      <!-- Statistik -->
      <!-- <CardStatistik /> -->


      <!-- <CardKoleksiBeranda/> -->

          
      <CardKoleksiTerbaru/>

      <KolomKoleksiBeranda />
  
      
  
  </NuxtLayout>
    </div>
  </template> 
  
  <script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Fungsi untuk menangani pencarian

// const handleSearch = (query) => {
//   console.log('Search query received:', query); // Debugging
//   router.push({
//     path: '/koleksi',
//     query: { search: query }
//   });
// };

// Fungsi untuk menangani pencarian dari beranda
const handleSearch = (query) => {
  console.log('Search query received:', query); // Debugging
  
  // Simpan keyword pencarian ke sessionStorage
  if (process.client) {
    sessionStorage.setItem('searchFromHome', query);
  }
  
  // Navigasi ke halaman koleksi tanpa query parameter
  router.push('/koleksi');
};


//animasi banner
import { ref, onMounted, onUnmounted } from 'vue';

// Data teks yang akan ditampilkan
const texts = [
  "Dapatkan akses ke hasil <span class='text-yellow-300 font-semibold'>Pendidikan</span> dan <span class='text-yellow-300 font-semibold'>Pelatihan</span> Pusdiklat BPS.",
  "Eksplorasi koleksi hasil <span class='text-yellow-300 font-semibold'>Pendidikan</span> dan <span class='text-yellow-300 font-semibold'>Pelatihan</span> dengan Cepat.",
  "Cari, Temukan, dan Manfaatkan koleksi hasil <span class='text-yellow-300 font-semibold'>Pendidikan</span> dan <span class='text-yellow-300 font-semibold'>Pelatihan</span> Pusdiklat BPS."
];

const currentText = ref(texts[0]); // Teks yang sedang ditampilkan
const currentIndex = ref(0); // Indeks teks yang sedang ditampilkan

// Fungsi untuk mengganti teks
const changeText = () => {
  currentIndex.value = (currentIndex.value + 1) % texts.length; // Pindah ke teks berikutnya
  currentText.value = texts[currentIndex.value]; // Perbarui teks yang ditampilkan
};

// Jalankan interval saat komponen dimount
let interval;
onMounted(() => {
  interval = setInterval(changeText, 3000); // Ganti teks setiap 3 detik
});

// Hentikan interval saat komponen di-unmount
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style>
/* Animasi transisi teks */
.transition-opacity {
  transition: opacity 3s ease-in-out;
}
</style>