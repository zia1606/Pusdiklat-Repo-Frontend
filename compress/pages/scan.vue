<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div class="p-8">
          <div class="uppercase tracking-wide text-sm text-blue-600 font-bold mb-4 text-center">Scan Buku Tamu</div>
          
          <!-- Scanner Container -->
          <div v-if="!scanSuccess" class="relative bg-black rounded-lg overflow-hidden aspect-square border-4 border-blue-100 shadow-inner">
            <qrcode-stream @detect="onDetect" @error="onError" @camera-on="onCameraOn" />
            
            <!-- Scanning Overlay Animation -->
            <div v-if="!loading" class="absolute inset-0 pointer-events-none">
              <div class="absolute inset-x-0 top-0 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line"></div>
              <div class="absolute inset-0 border-2 border-blue-500/20 m-12 rounded-lg"></div>
            </div>

            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/60 text-white flex-col space-y-3">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span>Menyiapkan Kamera...</span>
            </div>
            
            <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white p-6 text-center flex-col space-y-4 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="font-bold">{{ error }}</p>
              <button @click="resetScanner" class="bg-white text-red-900 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-100 transition-colors">Coba Lagi</button>
            </div>
          </div>

          <!-- Success State Display -->
          <div v-else class="text-center py-10">
            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-bounce">
              <svg class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900">Scan Berhasil!</h2>
            <p class="mt-3 text-lg text-gray-600">Terima kasih telah berkunjung. Mohon lengkapi data tujuan Anda di bawah ini.</p>
          </div>

          <!-- Instructions -->
          <div v-if="!scanSuccess" class="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Petunjuk
            </h4>
            <p class="text-sm text-blue-700 leading-relaxed">
              Arahkan kamera smartphone Anda ke QR Code yang tertera di meja resepsionis atau display informasi buku tamu.
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Tujuan Berkunjung (Glassmorphism Effect) -->
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="handleCancel"></div>

        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all w-full max-w-lg z-10 border border-gray-100">
          <div class="bg-blue-900 px-6 py-4">
            <h3 class="text-xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Lengkapi Data Kunjungan
            </h3>
          </div>
          
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Apa tujuan kunjungan Anda?</label>
              <div class="relative">
                <select v-model="form.tujuan" class="appearance-none block w-full bg-gray-50 border border-gray-300 text-gray-900 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-200">
                  <option value="" disabled>Pilih Tujuan...</option>
                  <option value="membaca">Membaca</option>
                  <option value="bekerja/belajar">Bekerja/Belajar</option>
                  <option value="diskusi">Diskusi</option>
                  <option value="lain-lain">Lain-lain</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.707 6.586 4.293 8z"/></svg>
                </div>
              </div>
            </div>

            <div v-if="form.tujuan === 'lain-lain'" class="animate-fade-in">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Keterangan Tujuan Lainnya</label>
              <textarea 
                v-model="form.tujuan_lain" 
                rows="4" 
                class="block w-full bg-gray-50 border border-gray-300 text-gray-900 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-200"
                placeholder="Misal: Bertemu staf IT, Pengambilan berkas, dll..."
              ></textarea>
            </div>
          </div>

          <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
            <button 
              @click="submitGuestBook" 
              type="button" 
              class="w-full sm:w-auto px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting || !form.tujuan || (form.tujuan === 'lain-lain' && !form.tujuan_lain)"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
              <span v-else>Simpan Kunjungan</span>
            </button>
            <button 
              @click="handleCancel" 
              type="button" 
              class="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { useToast } from '~/composables/useToast'

const { public: { apiBaseUrl } } = useRuntimeConfig()
const authStore = useUnifiedAuthStore()
const { showToast } = useToast()
const router = useRouter()

// Valid content that should be in the QR Code
const VALID_QR_CONTENT = "BUKU-TAMU-PUSDIKLAT"

// State
const loading = ref(true)
const scanSuccess = ref(false)
const showModal = ref(false)
const isSubmitting = ref(false)
const error = ref("")

const form = reactive({
  tujuan: "",
  tujuan_lain: ""
})

// Methods
const onCameraOn = () => {
  loading.value = false
  error.value = ""
}

const onError = (err) => {
  loading.value = false
  if (err.name === 'NotAllowedError') {
    error.value = "Akses kamera ditolak. Mohon izinkan akses kamera untuk melakukan scan."
  } else if (err.name === 'NotFoundError') {
    error.value = "Kamera tidak ditemukan pada perangkat ini."
  } else if (err.name === 'NotSupportedError') {
    error.value = "Kamera tidak didukung dalam konteks tidak aman (HTTPS diperlukan)."
  } else if (err.name === 'NotReadableError') {
    error.value = "Kamera mungkin sedang digunakan oleh aplikasi lain."
  } else if (err.name === 'OverconstrainedError') {
    error.value = "Konfigurasi kamera tidak sesuai."
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value = "Browser Anda tidak mendukung fitur ini."
  } else {
    error.value = "Terjadi kesalahan pada kamera: " + err.message
  }
}

const onDetect = (detectedCodes) => {
  if (detectedCodes.length === 0) return
  
  const result = detectedCodes[0].rawValue
  if (result === VALID_QR_CONTENT) {
    scanSuccess.value = true
    showModal.value = true
    showToast('success', 'Scan QR Berhasil!')
  } else {
    showToast('error', 'QR Code tidak valid untuk Buku Tamu.')
  }
}

const resetScanner = () => {
  error.value = ""
  loading.value = true
  scanSuccess.value = false
}

const handleCancel = () => {
  showModal.value = false
  scanSuccess.value = false
}

const submitGuestBook = async () => {
  if (!form.tujuan) return
  
  isSubmitting.value = true
  try {
    const response = await $fetch(`${apiBaseUrl}/api/buku-tamu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        tujuan: form.tujuan,
        tujuan_lain: form.tujuan === 'lain-lain' ? form.tujuan_lain : null
      }
    })

    if (response.success) {
      showToast('success', 'Berhasil mengisi buku tamu. Selamat berkunjung!')
      showModal.value = false
      // Redirect to home after success
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  } catch (err) {
    console.error('Error saving guest book:', err)
    showToast('error', err.data?.message || 'Gagal menyimpan data buku tamu.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    showToast('warning', 'Silakan login terlebih dahulu untuk mengisi buku tamu.')
    router.push('/auth/login')
  }
})

useHead({
  title: 'Scan Buku Tamu - Repositori Pusdiklat'
})
</script>

<style scoped>
@keyframes scan-line {
  0% { top: 0; }
  100% { top: 100%; }
}

.animate-scan-line {
  animation: scan-line 2s linear infinite;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
