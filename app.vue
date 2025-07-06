<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  if (process.client) {
    // Preload PDF.js Express dan library penting lainnya
    const preloadResources = [
      import('@pdftron/pdfjs-express-viewer').then(module => {
        window.__PDFJSExpress = module.default;
      }),
      new Promise(resolve => {
        const img = new Image();
        img.src = '/files/BPS.png'; // Preload watermark
        img.onload = resolve;
      })
    ];
    
    Promise.allSettled(preloadResources).catch(console.error);
  }
});
</script>