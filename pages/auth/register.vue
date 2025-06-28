<template>
    <div>
      <!-- <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3932B7] via-[#4038D6] to-[#7974DE]"> -->
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
        <div class="bg-white p-8 rounded-xl shadow-md w-96 px-4 sm:px-8">
          <!-- logo tengah -->
          <div class="flex justify-center">
            <img src="/img/logo.png" alt="Logo" class="w-12 h-auto" />
          </div>
          <!-- Judul -->
          <h2 class="text-2xl font-bold mb-9 text-center">Registrasi Akun</h2>
          <form @submit.prevent="handleRegister">
            <!-- Username -->
            <div class="mb-4">
              <label for="name" class="ml-1 text-sm font-medium block text-gray-700">Username</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Masukkan username anda"
                required
              />
            </div>
            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="ml-1 text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Masukkan email anda"
                required
              />
            </div>
            <!-- Password -->
            <div class="mb-4">
              <label for="password" class="ml-1 text-sm font-medium block text-gray-700">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Masukkan password"
                required
              />
            </div>
            <!-- Confirm password -->
            <div class="mb-4">
              <label for="confirmPassword" class="ml-1 text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                id="confirmPassword"
                v-model="form.password_confirmation"
                type="password"
                class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Masukkan kembali password anda"
                required
                @input="checkPasswordMatch"
              />
              <p v-if="!passwordMatch && form.password_confirmation" class="text-red-500 text-xs mt-1">
                Password tidak sama!
              </p>
            </div>
            <!-- Tombol register -->
            <button
              type="submit"
              :disabled="loading || !passwordMatch"
              class="w-full bg-blue-800 cursor-pointer border border-gray-300 rounded-lg shadow-lg text-white py-2 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Memproses...</span>
              <span v-else>Register</span>
            </button>
          </form>
          <!-- Login -->
          <p class="text-center mt-4">
            Sudah punya akun?
            <NuxtLink to="/auth/login" class="text-secondary-blue hover:text-indigo-800">Masuk</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  
  const passwordMatch = ref(true)
  const loading = ref(false)
  
  const checkPasswordMatch = () => {
    passwordMatch.value = form.value.password === form.value.password_confirmation
  }
  
  const handleRegister = async () => {
    // Validasi frontend
    if (form.value.password !== form.value.password_confirmation) {
      alert('Password dan konfirmasi password tidak sama!')
      return
    }
  
    loading.value = true
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register', {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      })
  
      alert('Registrasi berhasil! Silakan login.')
      router.push('/auth/login')
    } catch (error) {
      if (error.response) {
        // Handle error validasi dari Laravel
        if (error.response.status === 400) {
          const errors = error.response.data.message || error.response.data
          alert(`Validasi gagal: ${JSON.stringify(errors)}`)
        } else {
          alert(`Error: ${error.response.data?.message || 'Registrasi gagal'}`)
        }
      } else if (error.request) {
        alert('Tidak ada respon dari server. Cek koneksi internet Anda.')
      } else {
        alert(`Error: ${error.message}`)
      }
    } finally {
      loading.value = false
    }
  }
  </script>