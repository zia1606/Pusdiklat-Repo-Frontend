<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar :show="showSidebar" @close="showSidebar = false" />
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <HeaderAdmin 
          :pageTitle="pageTitle" 
          @toggle-sidebar="toggleSidebar" 
        />
  
        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto pt-16">
          <div class="p-6">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Sidebar from '@/components/Admin/Sidebar.vue';
  import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';
  
  // const showSidebar = ref(true);
  const props = defineProps({
    pageTitle: {
      type: String,
      default: 'Dashboard'
    }
  });
  
  // const toggleSidebar = () => {
  //   showSidebar.value = !showSidebar.value;
  // };
  
  // Di parent component (Layout Admin)
  const showSidebar = ref(false);
  
  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
  };
  
  </script>