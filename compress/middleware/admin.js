export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  
  const authStore = useUnifiedAuthStore()
  await authStore.initializeAuth()

  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    // Gunakan window.location untuk hard redirect jika diperlukan
    if (process.client) {
      window.location.href = '/auth/login'
    }
    return
  }
})