<template>
  <ClientOnly>
    <div ref="viewer" class="pdf-viewer-container"></div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  watermarkImage: {
    type: String,
    default: '/files/BPS.png'
  }
});

const emit = defineEmits(['document-loaded']);
const viewer = ref(null);
const instance = ref(null);
const watermarkOptions = ref(null);
let webViewerModule = null;

onMounted(async () => {
  if (process.client) {
    try {
      // Gunakan yang sudah dipreload di app.vue
      if (!window.__PDFJSExpress) {
        window.__PDFJSExpress = (await import('@pdftron/pdfjs-express-viewer')).default;
      }
      
      // Load watermark dan init viewer secara paralel
      await Promise.all([
        loadWatermark(),
        initPDFViewer()
      ]);
    } catch (err) {
      console.error('Failed to initialize PDF viewer:', err);
    }
  }
});

const loadWatermark = () => {
  return new Promise((resolve) => {
    if (!props.watermarkImage) return resolve();
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      watermarkOptions.value = {
        footer: null,
        custom: (ctx, pageNumber, pageWidth, pageHeight) => {
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }
          
          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.drawImage(
            img,
            pageWidth / 2 - width / 2,
            pageHeight / 2 - height / 2,
            width,
            height
          );
          ctx.restore();
        }
      };
      resolve();
    };
    
    img.onerror = () => resolve();
    img.src = props.watermarkImage;
  });
};

const initPDFViewer = async () => {
  try {
    const WebViewer = webViewerModule.default;
    
    instance.value = await WebViewer(
      {
        path: '/pdfjsexpress',
        initialDoc: props.pdfUrl,
        extension: 'pdf',
        licenseKey: '6y2mb6vTzXAQi79dyjig',
        disableHeadRequest: true,
        disabledElements: [
          'downloadButton',
          'printButton',
          'printModal',
          'textSelectToolGroupButton',
          'textSelectToolButton',
          'selectToolButton',
          'stickyToolGroupButton',
          'annotationPopup'
        ],
        enableFilePicker: false,
        isReadOnly: true,
        custom: { disablePDFEditing: true }
      },
      viewer.value
    );

    const { Core, UI } = instance.value;
    const { documentViewer } = Core;

    instance.value.disableFeatures([
      instance.value.Feature.TextSelection,
      instance.value.Feature.Copy,
      instance.value.Feature.Print,
      instance.value.Feature.Download,
      instance.value.Feature.Edit
    ]);

    UI.setToolMode('Pan');
    
    if (watermarkOptions.value) {
      documentViewer.setWatermark(watermarkOptions.value);
    }

    documentViewer.addEventListener('documentLoaded', () => {
      emit('document-loaded', documentViewer.getDocument());
      if (watermarkOptions.value) {
        documentViewer.setWatermark(watermarkOptions.value);
      }
    });

  } catch (error) {
    console.error('Error initializing PDF.js Express:', error);
  }
};

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.UI.dispose();
  }
});

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