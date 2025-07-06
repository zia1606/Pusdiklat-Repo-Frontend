<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-md px-4 sm:px-8">
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="Logo" class="w-12 h-auto"/>
      </div>
      
      <h2 class="text-2xl font-bold mb-9 text-center">Masuk</h2>
      
      <!-- Masuk dengan google -->
      <button 
    @click="loginWithGoogle"
    :disabled="googleLoading"
    class="w-full bg-white shadow text-gray-700 border border-gray-300 cursor-pointer rounded-lg text-sm font-medium py-2 hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50">
    <Google />
    <span v-if="googleLoading">Memproses...</span>
    <span v-else>Masuk dengan Google</span>
  </button>
      
      <div class="flex w-full items-center gap-2 py-4 text-sm text-slate-600">
        <div class="h-px w-full bg-slate-400"></div>
        atau
        <div class="h-px w-full bg-slate-400"></div>
      </div>
      
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="ml-1 text-sm font-medium block text-gray-700">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
            :class="errors.email ? 'border-red-500' : 'border-gray-300'"
            placeholder="Masukkan email anda"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <!-- Password -->
<div class="mb-4">
  <div class="flex justify-between items-center mb-1">
    <label for="password" class="ml-1 text-sm font-medium text-gray-700">Password</label>
    <NuxtLink 
      to="/auth/resetPassword" 
      class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
    >
      Lupa Password?
    </NuxtLink>
  </div>
  <div class="relative">
    <input
      id="password"
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-200 pr-10"
      :class="errors.password ? 'border-red-500' : 'border-gray-300'"
      placeholder="Masukkan password anda"
      required
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
      @click="showPassword = !showPassword"
    >
      
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        
        v-if="!showPassword"
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
  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
</div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
        
        <!-- Tombol Masuk -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-800 cursor-pointer border border-gray-300 rounded-lg shadow-lg text-white py-2 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </form>
      
      <!-- Sign up -->
      <!-- <p class="text-center mt-4">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="text-secondary-blue hover:text-indigo-800">Daftar disini</NuxtLink> 
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { $fetch } from 'ofetch'
const { public: { apiBaseUrl } } = useRuntimeConfig();
useHead({
  title: 'Login - Sistem Repositori Pusdiklat BPS'
})
const showPassword = ref(false);
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const googleLoading = ref(false) // Tambahkan state untuk loading Google
const errorMessage = ref('')
const successMessage = ref('')
const authStore = useUnifiedAuthStore()

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
  errorMessage.value = ''
}

// Handle Google Login
// Di login.vue
const loginWithGoogle = () => {
  googleLoading.value = true
  if (process.client) {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
    window.location.href = `${apiBaseUrl}/api/auth/google/redirect?redirect_uri=${redirectUri}`
  }
}

onMounted(() => {
  if (process.client && route.query.token && route.query.user) {
    try {
      const userData = JSON.parse(decodeURIComponent(route.query.user))
      
      authStore.setAuth({
        token: route.query.token,
        user: userData,
        role: userData.role.name.toLowerCase()
      })
      
      const redirectPath = authStore.isAdmin ? '/admin/dashboard' : '/'
      navigateTo(redirectPath)
    } catch (error) {
      console.error('Error parsing Google auth data:', error)
      errorMessage.value = 'Terjadi kesalahan saat login dengan Google'
    } finally {
      googleLoading.value = false
    }
  }
})

// Handle manual login
// Di script setup login.vue
const handleLogin = async () => {
  loading.value = true
  resetErrors()
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      body: form.value
    })
    
    if (response.status) {
      authStore.setAuth({
        token: response.data.token,
        user: response.data.user,
        role: response.data.user.role.name.toLowerCase()
      })
      
      // Redirect admin ke dashboard, tapi biarkan mereka bisa akses halaman user
      if (authStore.isAdmin) {
        await navigateTo('/admin/dashboard')
      } else {
        await navigateTo('/')
      }
    }
  } catch (error) {
    // Handle error response dari backend
    if (error.data) {
      if (error.data.message === 'Invalid email') {
        errors.value.email = 'Email tidak valid'
      } else if (error.data.message === 'Invalid Password') {
        errors.value.password = 'Password tidak valid'
      } else {
        errorMessage.value = error.data.message || 'Terjadi kesalahan saat login'
      }
    } else {
      errorMessage.value = 'Terjadi kesalahan pada server'
    }
  } finally {
    loading.value = false
  }
}

// Handle Google callback after component mounts
onMounted(() => {
  if (process.client && route.query.token && route.query.user) {
    try {
      const userData = JSON.parse(route.query.user)
      
      const authData = {
        token: route.query.token,
        user: userData,
        role: userData.role_id === 1 ? 'admin' : 'user'
      }
      
      authStore.setAuth(authData)
      
      // Redirect berdasarkan role
      if (userData.role_id === 1) {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error parsing Google auth data:', error)
      errorMessage.value = 'Terjadi kesalahan saat login dengan Google'
    }
  }
})
</script>
