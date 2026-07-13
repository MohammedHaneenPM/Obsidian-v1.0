class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';

    // Recent / popular search suggestions, shown before the visitor types.
    this.suggestionsContainer = this.querySelector('[data-predictive-search-suggestions]');
    this.showRecent = this.dataset.showRecent === 'true';
    this.showPopular = this.dataset.showPopular === 'true';
    this.recentSearchesKey = 'theme:recent-searches';
    this.maxRecentSearches = 5;

    try {
      this.popularTerms = this.showPopular ? JSON.parse(this.dataset.popularTerms || '[]') : [];
    } catch (error) {
      this.popularTerms = [];
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));

    if (this.suggestionsContainer) {
      this.addEventListener('click', this.onSuggestionItemClick.bind(this));
    }
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    super.onChange();
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      if (this.suggestionsContainer && (this.showRecent || this.showPopular)) {
        this.renderSuggestions();
      } else {
        this.close(true);
      }
      return;
    }

    if (this.suggestionsContainer) this.suggestionsContainer.hidden = true;
    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    if (this.showRecent && this.getQuery().length) this.addRecentSearch(this.getQuery());
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }

  onFormReset(event) {
    super.onFormReset(event);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    if (!currentSearchTerm.length) {
      if (this.suggestionsContainer && (this.showRecent || this.showPopular)) {
        this.renderSuggestions();
      }
      return;
    }

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onKeyup(event) {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector('[data-predictive-search-search-for-text]');
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll('li, button.predictive-search__item')).filter(
      (element) => element.offsetParent !== null
    );
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }

  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"] a, button[aria-selected="true"]');

    if (selectedOption) selectedOption.click();
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      const searchDeferred = this.dispatchSearchUpdateEvent(searchTerm);
      searchDeferred?.resolve({ totalCount: this.getTotalResultCount() });
      return;
    }

    const searchDeferred = this.dispatchSearchUpdateEvent(searchTerm);

    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`, {
      signal: this.abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
          predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
        });
        this.renderSearchResults(resultsMarkup);

        searchDeferred?.resolve({ totalCount: this.getTotalResultCount() });
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          searchDeferred?.reject(error);
          return;
        }
        searchDeferred?.reject(error);
        this.close();
        throw error;
      });
  }

  getTotalResultCount() {
    return parseInt(this.predictiveSearchResults.querySelector('[data-total-results]')?.dataset.totalResults) || 0;
  }

  dispatchSearchUpdateEvent(query) {
    const { SearchUpdateEvent } = window.StandardEvents || {};
    if (!SearchUpdateEvent) return null;

    const deferred = SearchUpdateEvent.createPromise();
    this.dispatchEvent(
      new SearchUpdateEvent({
        search: { query },
        promise: deferred.promise,
      })
    );
    return deferred;
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    if (this.suggestionsContainer) this.suggestionsContainer.hidden = true;
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }

  // --- Recent / popular search suggestions -------------------------------

  onSuggestionItemClick(event) {
    const item = event.target.closest('.predictive-search__item');
    if (!item || !this.showRecent) return;

    const heading = item.querySelector('.predictive-search__item-heading');
    const term = heading?.textContent?.trim();
    if (term) this.addRecentSearch(term);
  }

  getRecentSearches() {
    try {
      const raw = window.localStorage.getItem(this.recentSearchesKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  addRecentSearch(term) {
    if (!term || !this.showRecent) return;
    try {
      let recent = this.getRecentSearches().filter((existing) => existing.toLowerCase() !== term.toLowerCase());
      recent.unshift(term);
      recent = recent.slice(0, this.maxRecentSearches);
      window.localStorage.setItem(this.recentSearchesKey, JSON.stringify(recent));
    } catch (error) {
      // localStorage unavailable (e.g. private browsing); fail silently.
    }
  }

  removeRecentSearch(term) {
    try {
      const recent = this.getRecentSearches().filter((existing) => existing !== term);
      window.localStorage.setItem(this.recentSearchesKey, JSON.stringify(recent));
    } catch (error) {
      // localStorage unavailable; fail silently.
    }
  }

  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  renderSuggestionGroup(heading, terms, { removable } = {}) {
    const items = terms
      .map((term) => {
        const label = this.escapeHtml(term);
        const removeButton = removable
          ? `<button type="button" class="predictive-search__remove-recent" data-remove-recent="${label}" aria-label="${this.getAttribute(
              'data-remove-label'
            ) || 'Remove'} ${label}">&times;</button>`
          : '';
        return `
          <li class="predictive-search__list-item" role="option" aria-selected="false">
            <a href="${this.getAttribute('data-search-url')}?q=${encodeURIComponent(
              term
            )}" class="predictive-search__item link link--text" tabindex="-1">
              <div class="predictive-search__item-content predictive-search__item-content--centered">
                <p class="predictive-search__item-heading h5">${label}</p>
              </div>
            </a>
            ${removeButton}
          </li>`;
      })
      .join('');

    return `
      <div class="predictive-search__result-group">
        <h2 class="predictive-search__heading text-body caption-with-letter-spacing">${heading}</h2>
        <ul class="predictive-search__results-list list-unstyled" role="group">${items}</ul>
      </div>`;
  }

  renderSuggestions() {
    if (!this.suggestionsContainer) return;

    const recent = this.showRecent ? this.getRecentSearches() : [];
    const popular = this.popularTerms;

    if (!recent.length && !popular.length) {
      this.suggestionsContainer.hidden = true;
      return;
    }

    let html = '';
    if (recent.length) {
      html += this.renderSuggestionGroup(this.getAttribute('data-recent-label') || 'Recent searches', recent, {
        removable: true,
      });
    }
    if (popular.length) {
      html += this.renderSuggestionGroup(this.getAttribute('data-popular-label') || 'Popular searches', popular);
    }

    this.suggestionsContainer.innerHTML = html;
    this.suggestionsContainer.hidden = false;
    this.predictiveSearchResults.innerHTML = '';
    this.removeAttribute('results');

    this.suggestionsContainer.querySelectorAll('[data-remove-recent]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.removeRecentSearch(button.dataset.removeRecent);
        this.renderSuggestions();
      });
    });

    this.open();
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight =
      window.innerHeight - document.querySelector('.section-header')?.getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  open() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', '');
    this.removeAttribute('loading');
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
    if (clearSearchTerm && this.suggestionsContainer) this.suggestionsContainer.hidden = true;
  }
}

customElements.define('predictive-search', PredictiveSearch);
