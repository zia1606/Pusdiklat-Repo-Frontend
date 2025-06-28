import { defineNuxtRouteMiddleware } from "#app"
import { useAuthStore } from "~/stores/auth"
import { navigateTo } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Initialize auth store
  authStore.init()

  // Check if user is logged in and is admin
  if (!authStore.isLoggedIn) {
    return navigateTo("/admin/auth/login")
  }

  if (!authStore.isAdmin) {
    // User is logged in but not admin
    return navigateTo("/admin/auth/login")
  }
})
