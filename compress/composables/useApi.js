// composables/useApi.js
import { useUnifiedAuthStore } from '~/stores/unifiedAuth'

export const useApi = () => {
  const authStore = useUnifiedAuthStore()
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  const apiFetch = async (url, options = {}) => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` }),
      ...options.headers
    }

    try {
      return await $fetch(url, {
        baseURL: `${apiBaseUrl}/api`,
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