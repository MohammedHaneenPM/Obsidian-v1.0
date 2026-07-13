/**
 * Premium announcement bar behaviors: dismiss button (remembered per
 * visitor) and an optional per-announcement countdown timer.
 *
 * Both are opt-in via section/block settings in sections/announcement-bar.liquid
 * and only load this file when at least one of those settings is enabled.
 */

class AnnouncementBarDismiss extends HTMLElement {
  connectedCallback() {
    this.storageKey = this.dataset.storageKey;
    this.rememberDays = parseInt(this.dataset.rememberDays, 10) || 0;
    this.button = this.querySelector('[data-dismiss-announcement]');

    if (this.button) {
      this.button.addEventListener('click', this.dismiss.bind(this));
    }
  }

  dismiss() {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify({ dismissedAt: Date.now() }));
    } catch (error) {
      // localStorage unavailable; fall back to hiding for this page view only.
    }

    this.setAttribute('hidden', '');
    this.style.display = 'none';
  }
}

customElements.define('announcement-bar-dismiss', AnnouncementBarDismiss);

class AnnouncementCountdown extends HTMLElement {
  connectedCallback() {
    const target = new Date((this.dataset.target || '').replace(' ', 'T'));

    if (Number.isNaN(target.getTime())) {
      // Invalid/unparsable date from the merchant; don't show a broken timer.
      this.remove();
      return;
    }

    this.target = target;
    this.tick = this.tick.bind(this);
    this.tick();
    this.interval = window.setInterval(this.tick, 1000);
  }

  disconnectedCallback() {
    window.clearInterval(this.interval);
  }

  tick() {
    const diff = this.target.getTime() - Date.now();

    if (diff <= 0) {
      window.clearInterval(this.interval);
      this.setAttribute('hidden', '');
      this.textContent = '';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${String(hours).padStart(2, '0')}h`);
    parts.push(`${String(minutes).padStart(2, '0')}m`);
    parts.push(`${String(seconds).padStart(2, '0')}s`);

    this.textContent = parts.join(' ');
  }
}

customElements.define('announcement-countdown', AnnouncementCountdown);
