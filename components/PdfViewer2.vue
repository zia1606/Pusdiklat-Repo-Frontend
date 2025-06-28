<!-- <template>
    <ClientOnly>
      <div :id="containerId" class="pdf-viewer-container"></div>
    </ClientOnly>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    pdfUrl: {
      type: String,
      required: true
    }
  });
  
  const containerId = ref('adobe-dc-view-' + Math.random().toString(36).substring(2, 9));
  
  onMounted(() => {
    if (process.client) {
      const script = document.createElement('script');
      script.src = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
      script.async = true;
      document.head.appendChild(script);
  
      script.onload = () => {
        document.addEventListener('adobe_dc_view_sdk.ready', () => {
          const adobeDCView = new AdobeDC.View({
            clientId: "2d626035309641b7953686a56df6329f",
            divId: containerId.value
          });
  
          const previewFilePromise = adobeDCView.previewFile({
            content: {
              location: {
                url: props.pdfUrl
              }
            },
            metaData: {
              fileName: "Document.pdf"
            }
          }, {
            showAnnotationTools: true,
            showDownloadPDF: true,
            showPrintPDF: true,
            showLeftHandPanel: true,
            showPageControls: true,
            defaultViewMode: "FIT_WIDTH"
          });
  
        });
      };
    }
  });
  </script>
  
  <style>
  .pdf-viewer-container {
    width: 100%;
    height: 100vh;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
  
  /* Optional: Additional CSS to prevent text selection in the container */
  #adobe-dc-view {
    user-select: none !important;
    -webkit-user-select: none !important;
  }
  </style> -->

  <template>
  <ClientOnly>
    <div ref="viewer" class="pdf-viewer-container"></div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  watermarkImage: {
    type: String,
    default: '/files/BPS.png' // Path default untuk gambar watermark
  }
});

const emit = defineEmits(['document-loaded']);
const viewer = ref(null);
const instance = ref(null);
const watermarkOptions = ref(null);

// Fungsi untuk memuat watermark
const loadWatermark = async () => {
  if (!props.watermarkImage) return;
  
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  return new Promise((resolve) => {
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
    img.onerror = (err) => {
      console.error("Error loading watermark:", err);
      resolve();
    };
    img.src = props.watermarkImage;
  });
};

// Fungsi untuk menginisialisasi PDF.js Express
const initPDFViewer = async () => {
  try {
    const WebViewer = (await import('@pdftron/pdfjs-express-viewer')).default;
    
    WebViewer(
      {
        path: '/pdfjsexpress', // Path ke folder PDF.js Express
        initialDoc: props.pdfUrl,
        licenseKey: 'VMeLR5MsW5lX3X9YfqQF', // Ganti dengan license key Anda
      },
      viewer.value
    ).then((webViewerInstance) => {
      instance.value = webViewerInstance;
      const { Core, UI } = webViewerInstance;
      const { documentViewer } = Core;

documentViewer.setWatermark(watermarkOptions.value);
      // Event listener ketika dokumen selesai dimuat
      documentViewer.addEventListener('documentLoaded', () => {
        emit('document-loaded', documentViewer.getDocument());
        
        // Refresh watermark setelah dokumen dimuat
        if (watermarkOptions.value) {
          documentViewer.setWatermark(watermarkOptions.value);
        }
      });

      // Tambahkan tombol navigasi custom di header
      UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.055 7.06l-1.77-1.77A7 7 0 0013 20v-2a5 5 0 01-5-5V7.06zm7.945-3.055v2a5 5 0 015 5v2h2a7 7 0 00-7-7z"/></svg>',
          onClick: () => {
            const currentPage = documentViewer.getCurrentPage();
            const totalPages = documentViewer.getPageCount();
            const atLastPage = currentPage === totalPages;

            if (atLastPage) {
              documentViewer.setCurrentPage(1);
            } else {
              documentViewer.setCurrentPage(currentPage + 1);
            }
          },
          title: 'Next Page'
        });
      });
    });
  } catch (error) {
    console.error('Error initializing PDF.js Express:', error);
  }
};

// Watch untuk perubahan URL PDF
watch(() => props.pdfUrl, (newUrl) => {
  if (newUrl && instance.value) {
    instance.value.UI.loadDocument(newUrl);
  }
});

onMounted(async () => {
  if (process.client) {
    await loadWatermark();
    await initPDFViewer();
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