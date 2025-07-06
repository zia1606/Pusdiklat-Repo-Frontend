<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue';

// app.vue - Pindahkan preload ke mounted untuk menghindari blocking render awal
onMounted(() => {
  if (!window.__PDFJSExpress) {
    const script = document.createElement('script');
    script.src = 'https://cdn.pdftron.com/pdfjs-express-viewer.min.js';
    script.onload = () => {
      window.__PDFJSExpress = window.PDFJSExpress;
    };
    document.head.appendChild(script);
  }
});

// onBeforeMount(() => {
//   if (process.client) {
//     // Preload PDF.js Express dan library penting lainnya
//     const preloadResources = [
//       import('@pdftron/pdfjs-express-viewer').then(module => {
//         window.__PDFJSExpress = module.default;
//       }),
//       new Promise(resolve => {
//         const img = new Image();
//         img.src = '/files/BPS.png'; // Preload watermark
//         img.onload = resolve;
//       })
//     ];
    
//     Promise.allSettled(preloadResources).catch(console.error);
//   }
// });
</script>