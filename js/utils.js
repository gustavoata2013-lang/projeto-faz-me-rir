const Utils = {
  formatPrice(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
  },

  formatDate(iso) {
    return new Date(iso).toLocaleDateString('pt-BR');
  },

  formatCategory(catId) {
    const map = {
      contas: 'Contas',
      skins: 'Skins & Itens',
      itens: 'Skins & Itens',
      moedas: 'Moedas & Gold',
      boosting: 'Serviços & Boosting',
      servicos: 'Serviços & Boosting',
      giftcards: 'Gift Cards'
    };
    if (!catId) return '';
    if (map[catId]) return map[catId];
    return catId.charAt(0).toUpperCase() + catId.slice(1);
  },

  stars(rating) {
    const full = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return full + empty;
  },

  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  debounce(fn, delay = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  },

  loadUserProducts() {
    try {
      const raw = JSON.parse(localStorage.getItem('fmr-user-products'));
      if (!Array.isArray(raw)) return [];
      return raw.filter(p => p && typeof p === 'object' && p.id != null);
    } catch {
      return [];
    }
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Aplica o tema salvo imediatamente, em todas as páginas que carregam utils.js
(function applyStoredTheme() {
  const saved = localStorage.getItem('fmr-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

const Favorites = {
  KEY: 'fmr-favorites',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.map(Number) : [];
    } catch { return []; }
  },
  has(id) { return this.get().includes(Number(id)); },
  toggle(id) {
    const n = Number(id);
    const list = this.get();
    const next = list.includes(n) ? list.filter(x => x !== n) : [...list, n];
    localStorage.setItem(this.KEY, JSON.stringify(next));
    return next.includes(n);
  }
};
