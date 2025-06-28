<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-96 px-4 sm:px-8">
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="Logo" class="w-12 h-auto"/>
      </div>
      
      <h2 class="text-2xl font-bold mb-9 text-center">Masuk</h2>
      
      <!-- Masuk dengan google -->
      <button 
        @click="loginWithGoogle"
        class="w-full bg-white shadow text-gray-700 border border-gray-300 cursor-pointer rounded-lg text-sm font-medium py-2 hover:bg-gray-200 transition flex items-center justify-center">
        <Google />
        <span>Masuk dengan Google</span>
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
            placeholder="Masukkan email anda"
            required
          />
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
            placeholder="Masukkan password anda"
            required
          />
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
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

// Handle Google Login
const loginWithGoogle = () => {
  if (process.client) {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
    window.location.href = `http://127.0.0.1:8000/api/auth/google/redirect?redirect_uri=${redirectUri}`
  }
}

// Handle manual login
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  console.log('=== DEBUG LOGIN ===')
  console.log('Form data:', form.value)
  
  try {
    // Gunakan $fetch untuk API call
    const response = await $fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    console.log('Login response:', response)
    
    if (response.status) {
      successMessage.value = response.message
      
      // Ekstrak data user dan token dari response
      const userData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        role_id: response.data.role_id,
        // Tambahkan field lain yang diperlukan
      }
      
      // Set auth data ke store
      authStore.setAuth({
        token: response.data.token,
        user: userData
      })
      
      // Redirect berdasarkan role
      // role_id: 1 = admin, 2 = user (sesuaikan dengan database Anda)
      if (response.data.role_id === 1) {
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } else {
      errorMessage.value = response.message || 'Login gagal'
    }
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle different types of errors
    if (error.status === 404) {
      errorMessage.value = 'Email tidak ditemukan'
    } else if (error.status === 400) {
      // Handle validation errors
      if (error.data?.message) {
        errorMessage.value = error.data.message
      } else if (error.data?.errors) {
        const errors = Object.values(error.data.errors).flat()
        errorMessage.value = errors.join(', ')
      } else {
        errorMessage.value = 'Data yang dikirim tidak valid'
      }
    } else if (error.status === 401) {
      errorMessage.value = 'Email atau password salah'
    } else {
      errorMessage.value = error.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.'
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
        user: userData
      }
      
      authStore.setAuth(authData)
      router.push('/')
    } catch (error) {
      console.error('Error parsing Google auth data:', error)
      errorMessage.value = 'Terjadi kesalahan saat login dengan Google'
    }
  }
})
</script>