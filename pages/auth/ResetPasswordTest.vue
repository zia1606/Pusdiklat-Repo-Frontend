<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-96 px-4 sm:px-8">
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="Logo" class="w-12 h-auto"/>
      </div>
      
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password Link</h2>
      
      <div class="mb-6 p-4 bg-gray-100 rounded-lg">
        <p class="text-sm mb-2">Email: {{ email }}</p>
        <p class="text-sm mb-4 break-all">Token: {{ token }}</p>
        
        <p class="text-sm mb-4">In production, this link would be sent to your email:</p>
        <a 
          :href="resetUrl" 
          class="text-blue-600 hover:underline break-all"
          target="_blank"
        >
          {{ resetUrl }}
        </a>
      </div>

      <div class="text-center">
        <p class="text-sm mb-4">Untuk testing, Anda bisa:</p>
        <button
          @click="copyToken"
          class="w-full bg-blue-800 text-white py-2 rounded-lg mb-2 hover:bg-blue-700"
        >
          Salin Token
        </button>
        <button
          @click="goToResetPage"
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
        >
          Ke Halaman Reset Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const token = ref('')
const resetUrl = ref('')

onMounted(() => {
  email.value = route.query.email
  token.value = route.query.token
  resetUrl.value = route.query.reset_url
})

const copyToken = () => {
  navigator.clipboard.writeText(token.value)
  alert('Token berhasil disalin!')
}

const goToResetPage = () => {
  window.location.href = resetUrl.value
}
</script>