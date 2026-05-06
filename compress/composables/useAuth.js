// // composables/useAuth.js
// import { ref, computed } from 'vue';

// export const useAuth = () => {
//   const user = ref(JSON.parse(localStorage.getItem('auth_user')) || null);
//   const token = ref(localStorage.getItem('auth_token'));
  
//   const isAuthenticated = computed(() => !!token.value);

//   const setAuthData = (userData, authToken) => {
//     user.value = userData;
//     token.value = authToken;
//     localStorage.setItem('auth_user', JSON.stringify(userData));
//     localStorage.setItem('auth_token', authToken);
//   };

//   const clearAuthData = () => {
//     user.value = null;
//     token.value = null;
//     localStorage.removeItem('auth_user');
//     localStorage.removeItem('auth_token');
//   };

//   return {
//     user,
//     token,
//     isAuthenticated,
//     setAuthData,
//     clearAuthData
//   };
// };

// composables/useAuth.js
export const useAuth = () => {
    const user = useState('user', () => null)
    const isAuthenticated = computed(() => !!user.value)
  
    // Cek auth status saat pertama kali load
    const checkAuth = () => {
      if (process.client) {
        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            user.value = JSON.parse(userData)
          } catch {
            clearUser()
          }
        }
      }
    }
  
    // Set user setelah login berhasil
    const setUser = (userData) => {
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    }
  
    // Clear user saat logout
    const clearUser = () => {
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
    }
  
    // Panggil checkAuth saat composable pertama kali digunakan
    checkAuth()
  
    return {
      user,
      isAuthenticated,
      setUser,
      clearUser,
      checkAuth
    }
  }