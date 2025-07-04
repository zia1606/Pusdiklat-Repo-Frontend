<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-96 px-4 sm:px-8">
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="Logo" class="w-12 h-auto"/>
      </div>
      
      <h2 class="text-2xl font-bold mb-6 text-center">Lupa Password</h2>
      
      <p class="text-sm text-gray-600 mb-6 text-center">
        Masukkan email Anda yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
      </p>

      <form @submit.prevent="handleResetPassword">
        <!-- Email -->
        <div class="mb-6">
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

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
        
        <!-- Tombol Kirim -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-800 cursor-pointer border border-gray-300 rounded-lg shadow-lg text-white py-2 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          <span v-if="loading">Mengirim...</span>
          <span v-else>Kirim Link Reset</span>
        </button>
      </form>

      <!-- Kembali ke login -->
      <p class="text-center mt-4">
        Ingat password Anda?
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800">Kembali ke halaman login</NuxtLink> 
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Reset Password - Sistem Repositori Pusdiklat BPS'
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  email: ''
})

const handleResetPassword = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/forgot-password-act', {
      method: 'POST',
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (response.status) {
      successMessage.value = 'Silakan cek email Anda untuk link reset password.'
    } else {
      errorMessage.value = response.message
    }
  } catch (error) {
    console.error('Reset password error:', error)
    errorMessage.value = error.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
  } finally {
    loading.value = false
  }
}
</script>