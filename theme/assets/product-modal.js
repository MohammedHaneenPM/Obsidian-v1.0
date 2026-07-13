if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
      }

      hide() {
        super.hide();
        window.pauseAllMedia();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
      }

      showActiveMedia() {
        // Derive the modal-namespaced media ID from the opener's data-media-id attribute.
        // On-page slides use "{sectionId}-{mediaId}".
        // Modal slides are namespaced as "{sectionId}-{mediaId}-modal".
        const pageMediaId = this.openedBy.getAttribute('data-media-id');
        if (!pageMediaId) return;

        const modalMediaId = `${pageMediaId}-modal`;

        // Use the modal's MediaGallery instance to perform the active-slide switch.
        // This reuses all existing MediaGallery logic: thumbnail sync, live region
        // announcements, deferred media loading, and scroll-into-view behaviour.
        const modalGallery = this.querySelector('media-gallery');
        if (modalGallery) {
          modalGallery.setActiveMedia(modalMediaId, false);
          return;
        }

        // Fallback for when the modal contains no media-gallery (legacy / edge case).
        this.querySelectorAll(
          `[data-media-id]:not([data-media-id="${modalMediaId}"])`
        ).forEach((element) => {
          element.classList.remove('active');
        });
        const activeMedia = this.querySelector(`[data-media-id="${modalMediaId}"]`);
        if (!activeMedia) return;
        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        activeMedia.classList.add('active');
        activeMedia.scrollIntoView();

        const container = this.querySelector('[role="document"]');
        container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;

        if (
          activeMedia.nodeName == 'DEFERRED-MEDIA' &&
          activeMediaContent &&
          activeMediaContent.querySelector('.js-youtube')
        )
          activeMedia.loadContent();
      }
    }
  );
}
