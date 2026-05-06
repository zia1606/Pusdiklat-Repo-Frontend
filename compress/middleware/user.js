// middleware/user.js
import { defineNuxtRouteMiddleware, navigateTo, createError } from "#app"
import { useUnifiedAuthStore } from "~/stores/unifiedAuth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useUnifiedAuthStore()

  // Skip middleware di server-side untuk menghindari hydration issues
  if (process.server) return

  // Tunggu inisialisasi auth jika belum dilakukan
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login")
  }

  // Perubahan utama di sini - izinkan admin mengakses route user
  if (!authStore.isUser && !authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Akses ditolak.",
    })
  }
})