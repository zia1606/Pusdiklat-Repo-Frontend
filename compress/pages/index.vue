<template>
  <div class="bg-soft-white">
    <NuxtLayout>
      <div class="relative">
        <section class="bg-gradient-to-b from-blue-900 to-blue-800 pt-20 pb-10">
          <div class="w-full mx-auto px-4 lg:px-20 overflow-hidden">
            <div class="w-full mx-auto lg:px-8 lg:items-center">
              <div class="text-center">
                <img src="/img/download.webp" width="2880" height="1358" decoding="async" data-nimg="1" class="w-full h-full object-cover m-auto absolute inset-0 pointer-events-none" loading="lazy" style="color:transparent">
                <h1 class="text-yellow-400 font-bold text-6xl lg:text-6xl leading-tight">Digital Library</h1>
                <h2 class="text-white font-bold text-4xl lg:text-5xl leading-tight mb-3">Pusdiklat Badan Pusat Statistik</h2>
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

      <!-- Guest Book CTA Banner -->
      <section class="py-10 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-lg border border-blue-700/30">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div class="text-center md:text-left">
                <h3 class="text-xl md:text-2xl font-bold mb-1 tracking-tight">Selamat Datang di Perpustakaan!</h3>
                <p class="text-blue-100 text-sm md:text-base font-medium opacity-80">
                  Silakan scan QR code untuk mengisi buku tamu digital atau login ke sistem
                </p>
              </div>
            </div>
            <NuxtLink to="/scan" class="w-full md:w-auto">
              <button class="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center justify-center gap-2 whitespace-nowrap px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan Buku Tamu
              </button>
            </NuxtLink>
          </div>
        </div>
      </section>

      <CardKoleksiTerbaru/>
      <KolomKoleksiBeranda/>
    </NuxtLayout>
    </div>
  </template> 
  
<script setup>
  import { useRouter } from 'vue-router';

  useHead({
    title: 'Beranda - Sistem Repositori Pusdiklat BPS'
  })

  const router = useRouter();

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