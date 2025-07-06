<template>
  <ClientOnly>
    <div ref="viewer" class="pdf-viewer-container"></div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  pdfUrl: String,
  watermarkImage: {
    type: String,
    default: '/files/BPS.png'
  }
});

const viewer = ref(null);
const instance = ref(null);

const initPDFViewer = async () => {
  try {
    const WebViewer = window.__PDFJSExpress || 
      (await import('@pdftron/pdfjs-express-viewer')).default;
    
    instance.value = await WebViewer({
      path: '/pdfjsexpress',
      initialDoc: props.pdfUrl,
      extension: 'pdf',
      licenseKey: '6y2mb6vTzXAQi79dyjig',
      disableHeadRequest: true,
      isReadOnly: true,
      disabledElements: [
        'downloadButton',
        'printButton',
        'textSelectToolButton'
      ]
    }, viewer.value);

    // Lazy load watermark setelah viewer ready
    if (props.watermarkImage) {
      const img = new Image();
      img.onload = () => {
        instance.value.Core.documentViewer.setWatermark({
          custom: (ctx, pageNumber, pageWidth, pageHeight) => {
            // Watermark drawing logic
          }
        });
      };
      img.src = props.watermarkImage;
    }

  } catch (err) {
    console.error('PDF Viewer init error:', err);
  }
};

// Hanya initialize sekali
onMounted(() => {
  if (process.client && props.pdfUrl) {
    initPDFViewer();
  }
});

// Jika pdfUrl berubah, gunakan instance yang sama
watch(() => props.pdfUrl, (newUrl) => {
  if (newUrl && instance.value) {
    instance.value.UI.loadDocument(newUrl);
  }
});
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
  height: 100vh;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  user-select: none !important;
  -webkit-user-select: none !important;
}
</style>