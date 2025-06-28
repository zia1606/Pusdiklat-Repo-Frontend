<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <div class="flex justify-center mb-6">
          <img src="/img/logo lengkap2.png" alt="Admin Logo" class="w-16 h-auto"/>
        </div>
        
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal</h2>
        
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Admin</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              placeholder="admin@example.com"
              required
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          
          <!-- Password -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="errors.password ? 'border-red-500' : 'border-gray-300'"
              placeholder="********"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
          
          <!-- Error message umum -->
          <div v-if="errors.general" class="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {{ errors.general }}
          </div>
          
          <!-- Tombol Login -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>Masuk sebagai Admin</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAdminAuthStore } from '~/stores/adminAuth'
  
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
      const response = await $fetch('http://127.0.0.1:8000/api/login', {
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
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name)}&background=random&color=fff`
          }
        })
        await router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response) {
        const backendError = error.response._data
        
        // Handle error validasi dari backend
        if (error.response.status === 422) {
          if (backendError.errors?.email) {
            errors.value.email = backendError.errors.email[0]
          }
          if (backendError.errors?.password) {
            errors.value.password = backendError.errors.password[0]
          }
        } 
        // Handle email/password salah
        else if (error.response.status === 404 || error.response.status === 401) {
          errors.value.general = backendError.message || 'Email atau password salah'
        } 
        // Handle error lainnya
        else {
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
  /* Animasi untuk error message */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>