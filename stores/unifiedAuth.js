// stores/unifiedAuth.js
import { defineStore } from "pinia"
import { $fetch } from "ofetch"

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
      // Panggil API logout hanya jika token ada
      if (this.token) {
        await $fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Tetap lanjutkan clear auth meski API error
    } finally {
      // Bersihkan state dan localStorage
      this.clearAuth()
      
      // Tambahkan redirect di store untuk memastikan konsistensi
      if (process.client) {
        window.location.href = '/auth/login' // Hard redirect untuk pastikan bersih
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

      // Simpan ke localStorage
      if (process.client) {
        localStorage.setItem("auth_token", authData.token)
        localStorage.setItem("auth_user", JSON.stringify(authData.user))
        localStorage.setItem("auth_role", authData.role)
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
      }
    },

    async initializeAuth() {
      if (this.isInitialized) return
      
      if (process.client) {
        const token = localStorage.getItem("auth_token")
        const user = localStorage.getItem("auth_user")
        const role = localStorage.getItem("auth_role")

        if (token && user && role) {
          this.token = token
          this.user = JSON.parse(user)
          this.role = role
          this.isAuthenticated = true
          
          // Verifikasi token dengan backend
          try {
            const response = await $fetch("http://127.0.0.1:8000/api/check-auth", {
              headers: { Authorization: `Bearer ${token}` }
            })
            
            if (!response?.status) {
              console.log("Token invalid, clearing auth")
              this.clearAuth()
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
      if (!this.token) return false

      try {
        const response = await $fetch("http://127.0.0.1:8000/api/check-auth", {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (response?.status) {
          // Update user data jika ada perubahan
          if (response.data) {
            this.user = response.data
            localStorage.setItem("auth_user", JSON.stringify(response.data))
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