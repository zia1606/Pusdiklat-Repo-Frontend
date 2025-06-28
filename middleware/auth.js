import { defineNuxtRouteMiddleware } from "#app"
import { useAuthStore } from "~/stores/auth"
import { navigateTo } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Initialize auth store
  authStore.init()

  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    return navigateTo("/auth/login")
  }
})
