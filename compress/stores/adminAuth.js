import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref(null)
  const admin = ref(null)
  
  const isLoggedIn = computed(() => !!token.value)
  
  function setAuth(authData) {
    token.value = authData.token
    admin.value = {
      id: authData.admin.id,
      name: authData.admin.name,
      email: authData.admin.email,
      avatar: authData.admin.avatar || 
             `https://ui-avatars.com/api/?name=${authData.admin.name}&background=random&color=fff`
    }
    
    console.log('Setting admin auth:', { token: token.value, admin: admin.value }) // Debugging
    
    localStorage.setItem('adminAuth', JSON.stringify({
      token: token.value,
      admin: admin.value
    }))
    
    console.log('LocalStorage after set:', localStorage.getItem('adminAuth')) // Debugging
  }
  
  function clearAuth() {
    token.value = null
    admin.value = null
    localStorage.removeItem('adminAuth')
  }
  
  async function verifyToken() {
    if (!token.value) return false
      
    try {
      const response = await $fetch('http://127.0.0.1:8000/api/check-auth', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      return response?.status === true || response?.valid === true
    } catch (error) {
      console.error('Token verification failed:', error)
      clearAuth()
      return false
    }
  }
  
  async function logout() {
    try {
      if (token.value) {
        await $fetch('http://127.0.0.1:8000/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.error('Admin logout error:', error)
    } finally {
      clearAuth()
    }
  }
  
  function init() {
    if (process.client) {
      const authData = JSON.parse(localStorage.getItem('adminAuth'))
      if (authData) {
        token.value = authData.token
        admin.value = authData.admin
      }
    }
  }
  
  return {
    token,
    admin,
    isLoggedIn,
    setAuth,
    clearAuth,
    verifyToken,
    logout,
    init
  }
})