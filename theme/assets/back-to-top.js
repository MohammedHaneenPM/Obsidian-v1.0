class BackToTop extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.visibleAfter = 600;
    this.ticking = false;

    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.button.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    this.onScroll();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;

    requestAnimationFrame(() => {
      this.classList.toggle('back-to-top--visible', window.scrollY > this.visibleAfter);
      this.ticking = false;
    });
  }
}

customElements.define('back-to-top-button', BackToTop);
