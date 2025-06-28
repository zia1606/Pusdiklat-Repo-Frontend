<template>
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="[
          'px-4 py-2 rounded-md shadow-lg text-white flex items-center',
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        ]"
      >
        <svg 
          v-if="toast.type === 'success'" 
          class="h-5 w-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg 
          v-else-if="toast.type === 'error' || toast.type === 'warning'"
          class="h-5 w-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg 
          v-else
          class="h-5 w-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const { $toasts } = useNuxtApp();
  const toasts = $toasts;
  </script>