import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { $fetch } from "ofetch" // Declare $fetch variable

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null)
  const user = ref(null)

  // Computed properties
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role?.name === "admin")
  const isUser = computed(() => user.value?.role?.name === "user")
  const userRole = computed(() => user.value?.role?.name || null)
  const userAvatar = computed(
    () =>
      user.value?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.name || "User")}&background=random&color=fff`,
  )

  // Backward compatibility - computed property untuk admin
  const admin = computed(() => {
    if (!user.value || !isAdmin.value) return null
    return {
      id: user.value.id,
      name: user.value.name,
      email: user.value.email,
      avatar: userAvatar.value,
    }
  })

  function setAuth(authData) {
    token.value = authData.token
    user.value = authData.user

    console.log("Setting auth data:", {
      token: token.value,
      user: user.value,
      isAdmin: isAdmin.value,
    })

    // Save to localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: token.value,
        user: user.value,
      }),
    )

    // Backward compatibility - juga simpan dalam format adminAuth jika admin
    if (isAdmin.value) {
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          token: token.value,
          admin: admin.value,
        }),
      )
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null

    // Clear all auth data
    localStorage.removeItem("auth")
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
  }

  async function verifyToken() {
    if (!token.value) return false

    try {
      const response = await $fetch("http://127.0.0.1:8000/api/check-auth", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (response.status === true) {
        // Update user data jika ada perubahan
        user.value = response.data
        return true
      }
      return false
    } catch (error) {
      console.error("Token verification failed:", error)
      clearAuth()
      return false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await $fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuth()
    }
  }

  function init() {
    if (process.client) {
      // Coba load dari auth store yang baru
      let authData = JSON.parse(localStorage.getItem("auth"))

      // Jika tidak ada, coba load dari adminAuth store lama (backward compatibility)
      if (!authData) {
        const adminAuthData = JSON.parse(localStorage.getItem("adminAuth"))
        if (adminAuthData && adminAuthData.admin) {
          // Convert format lama ke format baru
          authData = {
            token: adminAuthData.token,
            user: {
              id: adminAuthData.admin.id,
              name: adminAuthData.admin.name,
              email: adminAuthData.admin.email,
              avatar: adminAuthData.admin.avatar,
              role: { name: "admin" }, // Assume admin role
            },
          }

          // Migrate to new format
          localStorage.setItem("auth", JSON.stringify(authData))
          localStorage.removeItem("adminAuth")
        }
      }

      if (authData) {
        token.value = authData.token
        user.value = authData.user
        console.log("Auth initialized:", {
          token: token.value,
          user: user.value,
          isAdmin: isAdmin.value,
        })
      }
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    isUser,
    userRole,
    userAvatar,
    admin, // Backward compatibility
    setAuth,
    clearAuth,
    verifyToken,
    logout,
    init,
  }
})
