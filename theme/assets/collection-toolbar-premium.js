class PremiumCollectionToolbar extends HTMLElement {
  constructor() {
    super();
    this.gridContainer = document.querySelector('.premium-grid-container');
    this.buttons = this.querySelectorAll('.grid-selector__btn');

    this.buttons.forEach((button) => {
      button.addEventListener('click', this.onGridChange.bind(this));
    });
  }

  onGridChange(event) {
    const target = event.currentTarget;
    if (target.classList.contains('is-active')) return;

    // Remove active class from all buttons
    this.buttons.forEach((btn) => btn.classList.remove('is-active'));
    
    // Add active class to clicked button
    target.classList.add('is-active');

    // Update grid container classes
    const columns = target.dataset.columns;
    if (this.gridContainer) {
      // Remove all existing desktop column classes
      this.gridContainer.className = this.gridContainer.className.replace(/premium-grid-container--desktop-\d/g, '').trim();
      
      // Add new class
      this.gridContainer.classList.add(`premium-grid-container--desktop-${columns}`);
    }
  }
}

customElements.define('premium-collection-toolbar', PremiumCollectionToolbar);
