<template>
    <div class="bg-gray-50 min-h-screen">
      <NuxtLayout>
        <!-- Banner Section -->
        <div class="relative">
          <banner />
          <div class="absolute inset-x-0 bottom-0 h-10"></div>
        </div>
  
        <!-- Main Content -->
        <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          <!-- Hero Section -->
          <!-- <section class="text-center mb-16">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">Tentang Kami</h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                Pusat Pendidikan dan Pelatihan Badan Pusat Statistik berkomitmen untuk menyediakan pendidikan dan pelatihan statistik berkualitas tinggi.
              </p>
            </div>
          </section> -->
  
          <!-- Visi Misi Section -->
          <section>
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Visi Card -->
              <!-- <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center mb-6">
                  <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900">Visi Kami</h2>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Menjadi pusat pendidikan dan pelatihan statistik terkemuka yang mendukung pengembangan kapasitas SDM statistik nasional untuk menghasilkan data berkualitas.
                </p>
              </div> -->
  
              <!-- Misi Card -->
              <!-- <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center mb-6">
                  <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900">Misi Kami</h2>
                </div>
                <ul class="space-y-4 text-gray-600 pl-5">
                  <li class="flex items-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                    <span>Menyelenggarakan pendidikan dan pelatihan statistik yang berkualitas</span>
                  </li>
                  <li class="flex items-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                    <span>Mengembangkan kurikulum berbasis kompetensi</span>
                  </li>
                  <li class="flex items-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                    <span>Meningkatkan kapasitas SDM statistik nasional</span>
                  </li>
                  <li class="flex items-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                    <span>Mendorong inovasi dalam pendidikan statistik</span>
                  </li>
                </ul>
              </div> -->
            </div>
          </section>
  
          <!-- Map Section -->
          <section>
            <!-- <div class="max-w-4xl mx-auto mb-12"> -->
              <div class="mx-auto mb-12">
              <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Kunjungi Kami</h2>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Map -->
              <div class="rounded-2xl overflow-hidden shadow-xl h-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.4845917481803!2d106.83116690000001!3d-6.331205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed79f8d1c7d7%3A0x7eb704e8bf10b6e8!2sPusdiklat%20BPS%20RI!5e0!3m2!1sid!2sid!4v1737714661539!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style="border:0; min-height: 400px;" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  class="rounded-2xl"
                ></iframe>
              </div>
              
              <!-- Contact Info -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <div class="p-8 h-full flex flex-col">
                  <div class="mb-8">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Pusdiklat BPS RI</h3>
                    <p class="text-gray-600">Pusat Pendidikan dan Pelatihan Badan Pusat Statistik</p>
                  </div>
                  
                  <div class="space-y-6 flex-grow">
                    <!-- Address -->
                    <div class="flex">
                      <div class="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-medium text-gray-900">Alamat</h4>
                        <p class="mt-1 text-gray-600 leading-relaxed">
                          Jl. Raya Jagakarsa No.70 3, RT.4/RW.1, Jagakarsa, Kec. Jagakarsa, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12620
                        </p>
                      </div>
                    </div>
                    
                    <!-- Hours -->
                    <div class="flex">
                      <div class="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-medium text-gray-900">Jam Operasional</h4>
                        <div class="mt-1 space-y-1 text-gray-600">
                          <p class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            Senin - Kamis: 07.30 - 16.00 WIB
                          </p>
                          <p class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            Jumat: 07.30 - 16.30 WIB
                          </p>
                          <p class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            Sabtu - Minggu: Tutup
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Contact -->
                    <div class="flex">
                      <div class="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-medium text-gray-900">Kontak</h4>
                        <div class="mt-1 space-y-1 text-gray-600">
                          <p class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            Email: pusdiklat@bps.go.id
                          </p>
                          <p class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            Telepon: (021) 12345678
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </NuxtLayout>
    </div>
  </template>
  
  <script setup>
  useHead({
  title: 'Tentang Kami - Sistem Repositori Pusdiklat BPS'
})
  </script>
  
  <style scoped>
  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
  }
  </style>