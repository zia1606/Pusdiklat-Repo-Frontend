// composables/useApiRequest.js
import { $fetch } from 'ofetch'

/**
 * Composable for making API requests with automatic CSRF token handling
 * for Laravel Sanctum stateful authentication
 */
export const useApiRequest = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  /**
   * Get CSRF token from cookie
   */
  const getCsrfToken = () => {
    if (!process.client) return null
    
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
    
    return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null
  }

  /**
   * Make an API request with automatic CSRF token handling
   * @param {string} url - The API endpoint (relative to apiBaseUrl)
   * @param {object} options - Fetch options
   * @returns {Promise} - The fetch response
   */
  const apiRequest = async (url, options = {}) => {
    // Ensure URL starts with apiBaseUrl
    const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`
    
    // Prepare headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    // Add CSRF token for requests to apiBaseUrl
    if (fullUrl.startsWith(apiBaseUrl)) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken
      }
    }
    
    // Prepare fetch options
    const fetchOptions = {
      credentials: 'include', // Always include credentials for stateful auth
      ...options,
      headers
    }
    
    try {
      return await $fetch(fullUrl, fetchOptions)
    } catch (error) {
      // Handle authentication errors
      if (error.status === 401) {
        // Clear auth and redirect to login
        const authStore = useUnifiedAuthStore()
        authStore.clearAuth()
        
        if (process.client) {
          await navigateTo('/auth/login')
        }
      }
      throw error
    }
  }

  /**
   * Initialize CSRF cookie for Sanctum
   */
  const initializeCsrf = async () => {
    try {
      await $fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      })
    } catch (error) {
      // Continue even if CSRF request fails due to CORS
      // The cookie might still be set by the browser
      console.log('CSRF cookie request failed, but continuing:', error.message)
    }
  }

  return {
    apiRequest,
    initializeCsrf,
    getCsrfToken
  }
}