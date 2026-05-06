<template>
    <div class="flex justify-center items-center h-screen">
      <div class="text-center">
        <Loading title="Memproses login..."/>
      </div>
    </div>
  </template>
  
  <script setup>
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'
const authStore = useUnifiedAuthStore()
const route = useRoute()

onMounted(async () => {
  try {
    const token = route.query.token
    const user = route.query.user ? JSON.parse(decodeURIComponent(route.query.user)) : null
    
    if (token && user) {
      await authStore.setAuth({
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: {
            name: user.role_id === 1 ? 'admin' : 'user'
          }
        },
        role: user.role_id === 1 ? 'admin' : 'user'
      })
      
      // Redirect based on role
      await navigateTo(authStore.isAdmin ? '/admin/dashboard' : '/')
    } else {
      await navigateTo('/auth/login?error=invalid_google_response')
    }
  } catch (error) {
    console.error('Google login error:', error)
    await navigateTo('/auth/login?error=google_login_failed')
  }
})
</script>