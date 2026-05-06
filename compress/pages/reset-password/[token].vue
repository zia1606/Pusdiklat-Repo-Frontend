<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-96 px-4 sm:px-8">
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="Logo" class="w-12 h-auto"/>
      </div>
      
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      
      <!-- Loading state saat validasi token -->
      <div v-if="validatingToken" class="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-center">
        <div class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memvalidasi token...
        </div>
      </div>

      <!-- Info email (opsional, bisa dihapus jika tidak diperlukan) -->
      <!-- <div v-if="form.email && !validatingToken" class="mb-4 p-2 bg-gray-100 text-sm rounded">
        <span class="text-gray-600">Reset password untuk: </span>
        <span class="font-medium">{{ form.email }}</span>
      </div> -->
      
      <!-- Form hanya muncul jika token valid dan email sudah ter-set -->
      <form v-if="!validatingToken && form.email" @submit.prevent="handleResetPassword">
        <!-- Email (hidden) -->
        <input type="hidden" v-model="form.email">
        
        <!-- Password Baru -->
<div class="mb-4">
  <label for="password" class="ml-1 text-sm font-medium block text-gray-700">Password Baru</label>
  <div class="relative">
    <input
      id="password"
      v-model="form.password"
      :type="showNewPassword ? 'text' : 'password'"
      class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-200 pr-10"
      placeholder="Masukkan password baru"
      required
      minlength="8"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
      @click="showNewPassword = !showNewPassword"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-if="!showNewPassword"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-else
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  </div>
  <p class="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
</div>

<!-- Konfirmasi Password -->
<div class="mb-6">
  <label for="password_confirmation" class="ml-1 text-sm font-medium block text-gray-700">Konfirmasi Password</label>
  <div class="relative">
    <input
      id="password_confirmation"
      v-model="form.password_confirmation"
      :type="showConfirmPassword ? 'text' : 'password'"
      class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-200 pr-10"
      placeholder="Konfirmasi password baru"
      required
      minlength="8"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
      @click="showConfirmPassword = !showConfirmPassword"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-if="!showConfirmPassword"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
      
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-else
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  </div>
</div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
        
        <!-- Tombol Reset Password -->
        <button
          type="submit"
          :disabled="loading || !form.email || !form.password || !form.password_confirmation"
          class="w-full bg-blue-800 cursor-pointer border border-gray-300 rounded-lg shadow-lg text-white py-2 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
          <span v-else>Reset Password</span>
        </button>
      </form>

      <!-- Pesan jika token tidak valid -->
      <div v-if="!validatingToken && !form.email" class="text-center">
        <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage || 'Token tidak valid atau sudah kadaluarsa' }}
        </div>
        <NuxtLink 
          to="/auth/resetPassword" 
          class="inline-block bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Minta Link Reset Baru
        </NuxtLink>
      </div>

      <!-- Link kembali ke login -->
      <div v-if="!validatingToken" class="text-center mt-4">
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 text-sm">
          Kembali ke halaman login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const validatingToken = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const form = ref({
  token: route.params.token,
  email: '',
  password: '',
  password_confirmation: ''
})
const { public: { apiBaseUrl } } = useRuntimeConfig();
// Validasi token saat page load
onMounted(async () => {
  await validateToken()
})

const validateToken = async () => {
  validatingToken.value = true
  errorMessage.value = ''
  
  try {
    const response = await $fetch(`${apiBaseUrl}/api/validasi-forgot-password/${form.value.token}`)
    
    console.log('Response validasi token:', response) // Debug
    
    if (response.status) {
      form.value.email = response.data.email
      console.log('Email ter-set:', form.value.email) // Debug
    } else {
      errorMessage.value = response.message
    }
  } catch (error) {
    console.error('Error validasi token:', error)
    errorMessage.value = error.data?.message || 'Token tidak valid atau sudah kadaluarsa'
  } finally {
    validatingToken.value = false
  }
}

const handleResetPassword = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validasi frontend
  if (!form.value.email) {
    errorMessage.value = 'Email tidak ditemukan. Silakan coba lagi.'
    loading.value = false
    return
  }
  
  if (form.value.password !== form.value.password_confirmation) {
    errorMessage.value = 'Konfirmasi password tidak cocok'
    loading.value = false
    return
  }
  
  if (form.value.password.length < 8) {
    errorMessage.value = 'Password minimal 8 karakter'
    loading.value = false
    return
  }

  // Validasi kekuatan password (opsional)
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  // if (!passwordRegex.test(form.value.password)) {
  //   errorMessage.value = 'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus'
  //   loading.value = false
  //   return
  // }

  try {
    const payload = {
      token: form.value.token,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    }
    
    console.log('Payload yang akan dikirim:', payload) // Debug

    const response = await $fetch(`${apiBaseUrl}/api/reset-password-act`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (response.status) {
      successMessage.value = response.message
      
      // Reset form
      form.value.password = ''
      form.value.password_confirmation = ''
      
      // Redirect setelah 3 detik
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } else {
      errorMessage.value = response.message
    }
  } catch (error) {
    console.error('Detail error:', error)
    
    // Handle different types of errors
    if (error.status === 404) {
      errorMessage.value = 'Token tidak valid atau sudah kadaluarsa'
    } else if (error.status === 400) {
      errorMessage.value = error.data?.message || 'Data yang dikirim tidak valid'
    } else {
      errorMessage.value = error.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
    }
  } finally {
    loading.value = false
  }
}

// Meta untuk SEO
useHead({
  title: 'Reset Password',
  meta: [
    { name: 'description', content: 'Reset password akun Anda' }
  ]
})
</script>