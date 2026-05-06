// composables/useToast.js
export const useToast = () => {
  const toasts = useState('toasts', () => [])

  const showToast = (type, message, duration = 5000) => {
    const id = Date.now()
    toasts.value.push({ id, type, message })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return { toasts, showToast, removeToast }
}