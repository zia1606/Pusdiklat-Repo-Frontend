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
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
            placeholder="Masukkan password anda"
            required
          />
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
      <p class="text-center mt-4">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="text-secondary-blue hover:text-indigo-800">Daftar disini</NuxtLink> 
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
import { $fetch } from 'ofetch'

useHead({
  title: 'Login - Sistem Repositori Pusdiklat BPS'
})

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
    window.location.href = `http://127.0.0.1:8000/api/auth/google/redirect?redirect_uri=${redirectUri}`
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
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/login', {
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
    // Handle error
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
