<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';

onMounted(() => {
  if (process.client) {
    // Preload PDFTron dan watermark
    const preload = Promise.all([
      import('@pdftron/pdfjs-express-viewer').then(module => {
        window.__PDFJSExpress = module.default;
      }),
      new Promise(resolve => {
        const img = new Image();
        img.src = '/files/BPS.png';
        img.onload = resolve;
      })
    ]).catch(console.error);
  }
});
</script>