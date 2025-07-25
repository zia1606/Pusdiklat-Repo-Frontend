// composables/useApi.js
export const useApi = () => {
  const { apiRequest } = useApiRequest()
  const authStore = useUnifiedAuthStore()

  const apiCall = async (endpoint, options = {}) => {
    const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    
    const headers = {
      ...options.headers
    }
    
    // Add Authorization header only if token exists (for token-based auth)
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }
    
    const fetchOptions = {
      ...options,
      headers
    }
    
    return await apiRequest(url, fetchOptions)
  }

  // Maintain backward compatibility
  const apiFetch = async (url, options = {}) => {
    return await apiCall(url, options)
  }

  return { apiCall, apiFetch }
}