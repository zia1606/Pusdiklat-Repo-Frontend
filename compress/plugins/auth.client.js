export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useUnifiedAuthStore()
  
  nuxtApp.hook('app:mounted', async () => {
    await authStore.initializeAuth()
    
    if (process.client) {
      const route = useRoute()
      if (route.path.startsWith('/admin') && !authStore.isAdmin) {
        // Tambahkan delay untuk memastikan rendering
        setTimeout(() => {
          navigateTo('/auth/login')
        }, 50)
      }
    }
  })
})