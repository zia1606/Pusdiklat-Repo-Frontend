export const useToast = () => {
    const showToast = (type, message) => {
      const app = useNuxtApp();
      if (app.$toast) {
        app.$toast[type](message);
      } else {
        console.warn('Toast plugin not available');
        // Fallback to alert if toast isn't available
        alert(message);
      }
    };
  
    return { showToast };
  };