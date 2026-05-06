<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
    
    <div class="relative z-10 w-full max-w-md px-6">
      <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-white p-10 transform transition-all hover:scale-[1.01]">
        <!-- Logo & Title -->
        <div class="text-center mb-10">
          <div class="inline-block p-4 bg-white rounded-3xl shadow-sm mb-6">
            <img src="/img/logo lengkap2.png" alt="Pusdiklat BPS" class="h-16 w-auto mx-auto"/>
          </div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Portal Admin</h1>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Sistem Repositori Digital</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Administrator</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                placeholder="admin@bps.go.id"
              />
            </div>
            <p v-if="errors.email" class="text-[10px] font-bold text-red-500 mt-1 ml-1">{{ errors.email }}</p>
          </div>
          
          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="block w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium placeholder-gray-300"
                placeholder="••••••••"
              />
            </div>
            <p v-if="errors.password" class="text-[10px] font-bold text-red-500 mt-1 ml-1">{{ errors.password }}</p>
          </div>
          
          <!-- General Error -->
          <div v-if="errors.general" class="p-4 bg-red-50 rounded-2xl flex items-center space-x-3 border border-red-100 animate-shake">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs font-bold text-red-600">{{ errors.general }}</p>
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              Masuk ke Dashboard
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memperifikasi...
            </span>
          </button>
        </form>

        <!-- Footer Info -->
        <div class="mt-10 text-center">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2024 Pusdiklat BPS RI</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl
const router = useRouter()
const loading = ref(false)
const authStore = useAdminAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: '',
  general: ''
})

const resetErrors = () => {
  errors.value = {
    email: '',
    password: '',
    general: ''
  }
}

const handleLogin = async () => {
  resetErrors()
  loading.value = true
  
  try {
    const response = await $fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      body: form.value
    })

    if (response?.status === true && response.data?.token) {
      authStore.setAuth({
        token: response.data.token,
        admin: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name)}&background=2563eb&color=fff&bold=true`
        }
      })
      await router.push('/admin/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.response) {
      const backendError = error.response._data
      
      if (error.response.status === 422) {
        if (backendError.errors?.email) {
          errors.value.email = backendError.errors.email[0]
        }
        if (backendError.errors?.password) {
          errors.value.password = backendError.errors.password[0]
        }
      } else if (error.response.status === 404 || error.response.status === 401) {
        errors.value.general = backendError.message || 'Email atau password salah'
      } else {
        errors.value.general = backendError.message || 'Terjadi kesalahan saat login'
      }
    } else {
      errors.value.general = 'Tidak dapat terhubung ke server. Cek koneksi internet Anda.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-modalIn {
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>