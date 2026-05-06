<template>
  <div ref="viewer"></div>
</template>

<script>
export default {
  name: "WebViewer",
  props: {
    path: String,
  },
  data() {
    return {
      instance: null,
      watermarkOptions: null
    }
  },
  mounted() {
    this.loadWatermark().then(() => {
      this.initWebViewer();
    });
  },
  methods: {
    async loadWatermark() {
      const watermarkPath = `${process.env.BASE_URL || '/'}img/logo.png`;
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve) => {
        img.onload = () => {
          this.watermarkOptions = {
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
        img.src = watermarkPath;
      });
    },

    async initWebViewer() {
      try {
        const WebViewer = (await import('@pdftron/pdfjs-express-viewer')).default;
        
        WebViewer(
          {
            path: this.path,
            initialDoc: `${process.env.BASE_URL || '/'}files/demo.pdf`,
            licenseKey: 'VMeLR5MsW5lX3X9YfqQF',
            // disabledElements: [
            //   'downloadButton',
            //   'printButton',
            //   'printModal'
            // ],
            // enablePrint: false
    //         disabledElements: [
    //   'textSelectToolGroupButton', // Nonaktifkan grup tool select
    //   'textSelectToolButton', // Nonaktifkan tool select teks
    //   'selectToolButton', // Nonaktifkan tool select umum
    //   'stickyToolGroupButton', // Nonaktifkan sticky tools jika ada
    //   'annotationPopup', // Nonaktifkan popup anotasi
    // ],
          },
          this.$refs.viewer
        ).then((instance) => {
          this.instance = instance;
          const { Core, UI } = instance;
          const { documentViewer } = Core;

          // Nonaktifkan fitur
          instance.disableFeatures([
            instance.Feature.TextSelection,
            instance.Feature.Copy,
            instance.Feature.Print,
            instance.Feature.Download
          ]);

          // Blokir shortcut keyboard
        //   UI.disableShortcut('print');
        //   UI.disableShortcut('download');

        // Set tool default ke Pan tool
//   instance.UI.setToolMode('Pan');
          
          // Blokir Ctrl/Cmd+P dan Ctrl/Cmd+S
          document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
              e.preventDefault();
              e.stopImmediatePropagation();
              return false;
            }
          });

          // Set watermark
          if (this.watermarkOptions) {
            documentViewer.setWatermark(this.watermarkOptions);
            
            documentViewer.addEventListener('documentLoaded', () => {
              documentViewer.setWatermark(this.watermarkOptions);
              setTimeout(() => {
                documentViewer.setWatermark(this.watermarkOptions);
              }, 500);
            });
          }

          UI.setHeaderItems((header) => {
            header.push({
              type: "actionButton",
              img: "https://icons.getbootstrap.com/assets/icons/caret-right-fill.svg",
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
            });
          });
        });
      } catch (error) {
        console.error("Error initializing WebViewer:", error);
      }
    }
  }
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100vh;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Sembunyikan tombol yang tidak diinginkan */
[data-element="downloadButton"],
[data-element="printButton"],
[data-element="printModal"] {
  display: none !important;
}
</style>