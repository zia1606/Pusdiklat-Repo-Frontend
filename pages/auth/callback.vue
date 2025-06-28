<template>
    <div class="flex justify-center items-center h-screen">
      <div class="text-center">
        <Loading title="Memproses login..."/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '~/stores/auth'
  const authStore = useAuthStore()
  const route = useRoute()
  
  onMounted(async () => {
    const token = route.query.token
    const user = route.query.user ? JSON.parse(route.query.user) : null
    
    if (token && user) {
      authStore.setAuth({
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'https://penguinui.s3.amazonaws.com/component-assets/avatar-8.webp'
        }
      })
      
      await navigateTo('/')
    } else {
      await navigateTo('/login?error=Google login failed')
    }
  })
  </script>