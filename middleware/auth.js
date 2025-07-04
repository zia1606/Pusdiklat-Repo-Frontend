// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  
  const authStore = useUnifiedAuthStore()
  await authStore.initializeAuth()

  if (!authStore.isAuthenticated && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
})