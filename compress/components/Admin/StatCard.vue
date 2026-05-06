<template>
  <div 
    class="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- Background Decor -->
    <div 
      class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150"
      :class="`bg-${color}-600`"
    ></div>

    <div class="flex items-center justify-between relative z-10">
      <div>
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ title }}</p>
        <div class="flex items-baseline space-x-1">
          <p class="text-3xl font-black text-gray-900 tracking-tight">{{ formattedValue }}</p>
          <span class="text-xs font-medium text-gray-400">unit</span>
        </div>
      </div>
      <div 
        class="flex items-center justify-center h-14 w-14 rounded-2xl transition-colors duration-300" 
        :class="`bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white`"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-7 w-7" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path v-if="icon === 'book'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          <path v-if="icon === 'star'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          <path v-if="icon === 'tag'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          <path v-if="icon === 'document'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path v-if="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          <path v-if="icon === 'eye'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    </div>
    
    <!-- Footer Decor -->
    <div class="mt-4 flex items-center text-[10px] font-bold text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
      </svg>
      <span>Peningkatan 12% bulan ini</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: {
    type: String,
    default: 'book'
  },
  color: {
    type: String,
    default: 'blue'
  }
})

defineEmits(['click'])

const formattedValue = computed(() => {
  const num = Number(props.value)
  if (isNaN(num)) return props.value
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
})
</script>

<style scoped>
/* Warna yang digunakan */
.border-blue-500 { border-color: #3b82f6; }
.bg-blue-100 { background-color: #dbeafe; }
.text-blue-600 { color: #2563eb; }

.border-yellow-500 { border-color: #eab308; }
.bg-yellow-100 { background-color: #fef9c3; }
.text-yellow-600 { color: #ca8a04; }

.border-green-500 { border-color: #22c55e; }
.bg-green-100 { background-color: #dcfce7; }
.text-green-600 { color: #16a34a; }

.border-indigo-500 { border-color: #6366f1; }
.bg-indigo-100 { background-color: #e0e7ff; }
.text-indigo-600 { color: #4f46e5; }

.border-red-500 { border-color: #ef4444; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-600 { color: #dc2626; }
</style>
