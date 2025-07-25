// stores/unifiedAuth.js
import { defineStore } from "pinia"
import { $fetch } from "ofetch"
import { useApiRequest } from "~/composables/useApiRequest"

export const useUnifiedAuthStore = defineStore("unifiedAuth", {
  state: () => ({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
    isInitialized: false,
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user',
    getUserAvatar: (state) => state.user?.avatar || null,
    canAccessAdmin: (state) => state.role === 'admin',
    canAccessUser: (state) => state.role === 'user' || state.role === 'admin'
  },

  actions: {
    async logout() {
      try {
        const { apiRequest } = useApiRequest();
        
        // Call logout API with appropriate auth method
        if (this.token) {
          // Token-based auth logout
          await apiRequest('/api/logout', {
            method: 'POST'
          })
        } else {
          // Stateful auth logout
          await apiRequest('/logout', {
            method: 'POST'
          })
        }
      } catch (error) {
        console.error('Logout API error:', error)
        // Continue with clearing auth even if API fails
      } finally {
        // Clear state and localStorage
        this.clearAuth()
        
        // Redirect to login
        if (process.client) {
          window.location.href = '/auth/login'
        }
      }
    },
  
  clearAuth() {
    this.token = null
    this.user = null
    this.role = null
    this.isAuthenticated = false
    
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_role')
    }
  },
    setAuth(authData) {
      this.token = authData.token
      this.user = authData.user
      this.role = authData.role
      this.isAuthenticated = true
      this.isInitialized = true

      // Save to localStorage
      if (process.client) {
        // Only save token if it exists (for token-based auth)
        if (authData.token) {
          localStorage.setItem("auth_token", authData.token)
        } else {
          localStorage.removeItem("auth_token")
        }
        localStorage.setItem("auth_user", JSON.stringify(authData.user))
        localStorage.setItem("auth_role", authData.role)
        // Set a flag to indicate stateful auth is being used
        localStorage.setItem("auth_type", authData.token ? "token" : "stateful")
      }
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.role = null
      this.isAuthenticated = false
      this.isInitialized = true

      if (process.client) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        localStorage.removeItem("auth_role")
        localStorage.removeItem("auth_type")
      }
    },

    async initializeAuth() {
      if (this.isInitialized) return
      
      if (process.client) {
        const token = localStorage.getItem("auth_token")
        const user = localStorage.getItem("auth_user")
        const role = localStorage.getItem("auth_role")
        const authType = localStorage.getItem("auth_type")
        const { public: { apiBaseUrl } } = useRuntimeConfig();

        if (user && role) {
          this.token = token
          this.user = JSON.parse(user)
          this.role = role
          this.isAuthenticated = true
          
          // Verify authentication with backend
          try {
            const { apiRequest } = useApiRequest();
            let response
            if (authType === "token" && token) {
              // Token-based auth verification
              response = await apiRequest('/api/check-auth')
            } else {
              // Stateful auth verification
              response = await apiRequest('/api/user')
            }
            
            if (!response || (response.status === false)) {
              console.log("Authentication invalid, clearing auth")
              this.clearAuth()
            } else if (response.data || response.user) {
              // Update user data if available
              this.user = response.data || response.user || response
              localStorage.setItem("auth_user", JSON.stringify(this.user))
            }
          } catch (error) {
            console.error("Auth verification failed:", error)
            this.clearAuth()
          }
        }
      }
      
      this.isInitialized = true
    },

    async checkAuthStatus() {
      if (!this.isAuthenticated) return false
      const { apiRequest } = useApiRequest();
      const authType = process.client ? localStorage.getItem("auth_type") : null;
      
      try {
        let response
        if (authType === "token" && this.token) {
          // Token-based auth check
          response = await apiRequest('/api/check-auth')
        } else {
          // Stateful auth check
          response = await apiRequest('/api/user')
        }

        if (response && response.status !== false) {
          // Update user data if available
          const userData = response.data || response.user || response
          if (userData && typeof userData === 'object') {
            this.user = userData
            if (process.client) {
              localStorage.setItem("auth_user", JSON.stringify(userData))
            }
          }
          return true
        }
        return false
      } catch (error) {
        console.error("Auth check failed:", error)
        this.clearAuth()
        return false
      }
    },
  }
})