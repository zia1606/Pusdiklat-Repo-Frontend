// composables/useApi.js
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

export const useApi = () => {
  const authStore = useUnifiedAuthStore()

  const apiFetch = async (url, options = {}) => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` }),
      ...options.headers
    }

    try {
      return await $fetch(url, {
        baseURL: 'http://127.0.0.1:8000/api',
        ...options,
        headers
      })
    } catch (error) {
      if (error.status === 401) {
        authStore.clearAuth()
        navigateTo('/auth/login')
      }
      throw error
    }
  }

  return {
    apiFetch
  }
}