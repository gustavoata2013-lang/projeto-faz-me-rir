const THEME_ICONS = {
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};

document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  Cart.updateBadge();
  mergeUserProducts();
  initTheme();
  initKeyboardShortcuts();
  initCountdown();
  initSocialProof();
  renderPillbar();
  renderContinue();
  renderTrending();
  renderDailyDeals();
  renderCombos();
  renderComboBuilder();
  renderGameCovers();
  renderBanners();
  renderServices();
  renderSwimlanes();
  renderReviewsMarquee();
  initAutocomplete();

  const grid = document.getElementById('ads-grid');
  const categorySelect = document.getElementById('filter-category');
  const priceSelect = document.getElementById('filter-price');
  const ratingSelect = document.getElementById('filter-rating');
  const deliverySelect = document.getElementById('filter-delivery');
  const sortSelect = document.getElementById('filter-sort');
  const verifiedCheckbox = document.getElementById('filter-verified');
  const searchInput = document.getElementById('search-input');
  const authBtn = document.getElementById('auth-btn');

  // Popula categorias no select
  API_MOCK.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });

  // Auth button + dropdown
  if (authBtn) {
    const user = Auth.getUser();
    if (user) {
      authBtn.textContent = user.username;
      authBtn.classList.add('account-dropdown');
      const menu = document.createElement('div');
      menu.className = 'account-dropdown__menu';
      menu.innerHTML = `
        <div class="account-dropdown__header">
          <div class="account-dropdown__name">${Utils.escapeHtml(user.username)}</div>
          <div class="account-dropdown__email">${Utils.escapeHtml(user.email || 'jogador@facamerir.com')}</div>
        </div>
        <a href="pages/minha-conta.html" class="account-dropdown__item">👤 Minha conta</a>
        <a href="pages/minha-conta.html#compras" class="account-dropdown__item">📦 Minhas compras</a>
        <a href="pages/minha-conta.html#vendas" class="account-dropdown__item">🏷 Minhas vendas</a>
        <a href="pages/carrinho.html" class="account-dropdown__item">🛒 Carrinho</a>
        <div class="account-dropdown__item account-dropdown__item--danger" id="logout-btn">🚪 Sair</div>
      `;
      authBtn.parentElement.style.position = 'relative';
      authBtn.parentElement.appendChild(menu);
      authBtn.addEventListener('click', e => {
        e.preventDefault();
        menu.classList.toggle('account-dropdown__menu--open');
      });
      document.addEventListener('click', e => {
        if (!e.target.closest('.account-dropdown') && !e.target.closest('.account-dropdown__menu')) {
          menu.classList.remove('account-dropdown__menu--open');
        }
      });
      menu.querySelector('#logout-btn').addEventListener('click', () => {
        Auth.logout();
        window.location.reload();
      });
    }
  }

  // Busca via lupa
  const searchBtn = document.querySelector('.header__search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      Filters.state.search = searchInput.value;
      Filters.render(API_MOCK.products, grid);
      document.getElementById('anuncios')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Favoritos
  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => Modal.openFavorites());
  }

  // Notificações
  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const badge = document.getElementById('notif-badge');
      if (badge) badge.style.display = 'none';
      Toast.show('Você não tem novas notificações.', 'info');
    });
  }

  // Saldo do usuário logado
  const balanceEl = document.getElementById('header-balance-value');
  if (balanceEl) {
    let wallet = { balance: 0 };
    try { wallet = { ...wallet, ...JSON.parse(localStorage.getItem('fmr-wallet')) }; } catch { /* ignore */ }
    balanceEl.textContent = Utils.formatPrice(wallet.balance);
  }

  // Busca vinda de páginas internas (?busca=)
  const initialQuery = Utils.getParam('busca');
  if (initialQuery) {
    searchInput.value = initialQuery;
    Filters.state.search = initialQuery;
  }

  // Render inicial
  Filters.render(API_MOCK.products, grid);

  // Eventos de filtro
  categorySelect.addEventListener('change', e => {
    Filters.state.category = e.target.value;
    Filters.state.subcategory = '';
    Filters.state.hotOnly = false;
    Filters.render(API_MOCK.products, grid);
  });

  priceSelect.addEventListener('change', e => {
    Filters.state.price = e.target.value;
    Filters.render(API_MOCK.products, grid);
  });

  ratingSelect.addEventListener('change', e => {
    Filters.state.rating = e.target.value;
    Filters.render(API_MOCK.products, grid);
  });

  if (deliverySelect) {
    deliverySelect.addEventListener('change', e => {
      Filters.state.deliveryType = e.target.value;
      Filters.render(API_MOCK.products, grid);
    });
  }

  if (verifiedCheckbox) {
    verifiedCheckbox.addEventListener('change', e => {
      Filters.state.verifiedSellersOnly = e.target.checked;
      Filters.render(API_MOCK.products, grid);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      Filters.state.sort = e.target.value;
      Filters.render(API_MOCK.products, grid);
    });
  }

  searchInput.addEventListener('input', Utils.debounce(e => {
    Filters.state.search = e.target.value;
    Filters.render(API_MOCK.products, grid);
  }, 250));

  // Clique em card redireciona para a página interna do anúncio
  grid.addEventListener('click', e => {
    const favBtnCard = e.target.closest('[data-fav]');
    if (favBtnCard) {
      e.stopPropagation();
      const active = Favorites.toggle(favBtnCard.dataset.fav);
      favBtnCard.classList.toggle('card__fav--active', active);
      favBtnCard.setAttribute('aria-pressed', String(active));
      Toast.show(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', active ? 'success' : 'info');
      return;
    }
    // Links (botão Comprar) navegam por conta própria
    if (e.target.closest('a[href]')) return;
    const card = e.target.closest('.card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const product = API_MOCK.products.find(p => p.id === id);
    if (product) window.location.href = `pages/produto.html?id=${product.id}`;
  });

  // Logo volta para home (scroll suave ao topo)
  document.getElementById('logo-home').addEventListener('click', e => {
    e.preventDefault();
    showHome();
  });

  function showHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Scroll dos carrosséis
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.scroll);
      if (!track) return;
      const dir = Number(btn.dataset.dir) || 1;
      track.scrollBy({ left: dir * 300, behavior: 'smooth' });
    });
  });

  // Suporte a swipe em carrosséis (touch)
  document.querySelectorAll('.carousel__track').forEach(track => {
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      scrollStart = track.scrollLeft;
      isDragging = true;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      track.scrollLeft = scrollStart - dx;
    }, { passive: true });
    track.addEventListener('touchend', () => { isDragging = false; });
  });
});

/* ===== Tema ===== */
function initTheme() {
  const saved = localStorage.getItem('fmr-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerHTML = saved === 'light' ? THEME_ICONS.sun : THEME_ICONS.moon;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('fmr-theme', current);
    btn.innerHTML = current === 'light' ? THEME_ICONS.sun : THEME_ICONS.moon;
  });
}

/* ===== Atalhos de teclado ===== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === '/') {
      e.preventDefault();
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }
  });
}

/* ===== Countdown ===== */
function initCountdown() {
  const el = document.getElementById('countdown-time');
  if (!el || !API_MOCK.dailyDeals) return;
  const endsAt = API_MOCK.dailyDeals.endsAt;
  const tick = () => {
    const diff = Math.max(0, endsAt - Date.now());
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ===== Prova social ===== */
function initSocialProof() {
  const m = API_MOCK.metrics;
  if (!m) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sp-transactions', 'R$ ' + (m.totalTransactions / 1000000).toFixed(1) + 'M+');
  set('sp-orders', m.totalOrders.toLocaleString('pt-BR') + '+');
  set('sp-satisfaction', m.satisfaction + '%');
  set('sp-sellers', m.activeSellers.toLocaleString('pt-BR') + '+');
  set('sp-online', m.onlineNow);
}

/* ===== Anúncios criados pelo usuário ===== */
function mergeUserProducts() {
  Utils.loadUserProducts().forEach(p => {
    if (!API_MOCK.products.some(existing => existing.id === p.id)) API_MOCK.products.push(p);
  });
}

/* ===== Cards de anúncio: ver js/card.js (Card.build / Card.bind) ===== */

/* ===== Quick Filters ===== */
function applyQuickFilter(opts) {
  Filters.state.category = opts.category || '';
  Filters.state.subcategory = opts.subcategory || '';
  Filters.state.deliveryType = opts.delivery || '';
  Filters.state.hotOnly = opts.quick === 'hot';
  Filters.state.sort = opts.quick === 'auto' ? '' : (opts.quick === 'sold' ? 'sold' : Filters.state.sort);

  const categorySelect = document.getElementById('filter-category');
  const deliverySelect = document.getElementById('filter-delivery');
  const sortSelect = document.getElementById('filter-sort');
  if (categorySelect) categorySelect.value = Filters.state.category;
  if (deliverySelect) deliverySelect.value = Filters.state.deliveryType;
  if (sortSelect) sortSelect.value = Filters.state.sort;

  const grid = document.getElementById('ads-grid');
  if (grid) Filters.render(API_MOCK.products, grid);
  document.getElementById('anuncios')?.scrollIntoView({ behavior: 'smooth' });
}

/* ===== Pillbar de categorias em alta ===== */
function renderPillbar() {
  const el = document.getElementById('pillbar-trending');
  if (!el) return;
  const pills = [
    { label: '🔥 Em alta', hot: true, quick: 'hot' },
    { label: '⚡ Entrega Automática', quick: 'auto' },
    { label: '🏆 Mais Vendidos', quick: 'sold' },
    { label: '💎 Skins Raras', category: 'skins' },
    { label: '🎯 Valorant', subcategory: 'Valorant' },
    { label: '🔫 CS2', subcategory: 'CS2' },
    { label: '⚔️ LoL', subcategory: 'League of Legends' },
    { label: '🪙 Gift Cards', category: 'moedas' },
    { label: '🚀 Boosting', category: 'boosting' }
  ];
  el.innerHTML = pills.map((p, i) => `
    <button class="header__pill ${p.hot ? 'header__pill--hot' : ''}" data-pill="${i}">${p.label}</button>
  `).join('');

  el.querySelectorAll('[data-pill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = pills[Number(btn.dataset.pill)];
      applyQuickFilter({
        quick: p.quick,
        category: p.category,
        subcategory: p.subcategory,
        delivery: p.quick === 'auto' ? 'auto' : ''
      });
    });
  });
}

/* ===== Continue de onde parou (split-view) ===== */
function renderContinue() {
  const section = document.getElementById('continue-section');
  const container = document.getElementById('continue-split');
  if (!section || !container) return;
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem('fmr-history')) || []; } catch { ids = []; }
  if (!ids.length) ids = API_MOCK.history || [];
  if (!ids.length) return;
  const items = ids.map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
  if (!items.length) return;
  section.style.display = 'block';

  const featured = items[0];
  const rest = items.slice(1, 5);

  container.innerHTML = `
    <div class="split-view__featured" data-id="${featured.id}">
      <span class="split-view__featured-icon">${featured.icon}</span>
      <div class="split-view__featured-title">${Utils.escapeHtml(featured.title)}</div>
      <div class="split-view__featured-meta">${Utils.escapeHtml(featured.seller)} · ⭐ ${featured.rating.toFixed(1)}</div>
      <div class="split-view__featured-price">${Utils.formatPrice(featured.price)}</div>
    </div>
    <div class="split-view__list">
      ${rest.map(p => `
        <div class="split-view__item" data-id="${p.id}">
          <div class="split-view__item-icon">${p.icon}</div>
          <div class="split-view__item-info">
            <div class="split-view__item-title">${Utils.escapeHtml(p.title)}</div>
            <div class="split-view__item-price">${Utils.formatPrice(p.price)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      const product = API_MOCK.products.find(p => p.id === Number(el.dataset.id));
      if (product) window.location.href = `pages/produto.html?id=${product.id}`;
    });
  });
}

/* ===== Trending Top 10 ===== */
function renderTrending() {
  const track = document.getElementById('trending-track');
  if (!track) return;
  const ids = API_MOCK.trending || [];
  const items = ids.map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
  track.innerHTML = items.map((p, i) => Card.build(p, { rank: i + 1, base: 'pages/' })).join('');
  Card.bind(track, 'pages/');
}

/* ===== Ofertas do dia ===== */
function renderDailyDeals() {
  const grid = document.getElementById('daily-deals-grid');
  if (!grid || !API_MOCK.dailyDeals) return;
  const items = API_MOCK.dailyDeals.productIds
    .map(id => API_MOCK.products.find(p => p.id === id))
    .filter(Boolean);
  grid.innerHTML = items.map(p => Card.build(p, { base: 'pages/' })).join('');
  Card.bind(grid, 'pages/');
}

/* ===== Combos ===== */
function renderCombos() {
  const grid = document.getElementById('combos-grid');
  if (!grid || !API_MOCK.combos) return;
  grid.innerHTML = API_MOCK.combos.map(combo => {
    const items = combo.items.map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
    const original = items.reduce((s, p) => s + p.price, 0);
    const final = original * (1 - combo.discount / 100);
    return `
      <div class="combo-card">
        <div class="combo-card__header">
          <span class="combo-card__icon">${combo.icon}</span>
          <div>
            <div class="combo-card__name">${Utils.escapeHtml(combo.name)}</div>
            <div class="combo-card__desc">${Utils.escapeHtml(combo.description)}</div>
          </div>
        </div>
        <div class="combo-card__items">
          ${items.map(p => `<div class="combo-card__item"><span>${Utils.escapeHtml(p.title)}</span><span>${Utils.formatPrice(p.price)}</span></div>`).join('')}
        </div>
        <div class="combo-card__footer">
          <div>
            <div class="combo-card__price">${Utils.formatPrice(final)}</div>
            <span class="combo-card__discount">-${combo.discount}%</span>
          </div>
          <button class="btn btn--primary" data-combo="${combo.id}">Adicionar ao carrinho</button>
        </div>
      </div>
    `;
  }).join('');
  grid.querySelectorAll('[data-combo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const combo = API_MOCK.combos.find(c => c.id === btn.dataset.combo);
      if (!combo) return;
      const items = combo.items.map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
      items.forEach(p => {
        const discountedPrice = +(p.price * (1 - combo.discount / 100)).toFixed(2);
        Cart.add({ ...p, price: discountedPrice }, 1, `${combo.name} -${combo.discount}%`);
      });
      Toast.show(`"${combo.name}" adicionado ao carrinho!`, 'success');
      window.location.href = 'pages/carrinho.html';
    });
  });
}

/* ===== Combo Builder ===== */
function renderComboBuilder() {
  const grid = document.getElementById('combo-builder-grid');
  const progress = document.getElementById('combo-progress');
  if (!grid || !progress) return;

  const rules = API_MOCK.comboRules || [];
  const selected = new Set();
  let currentDiscount = 0;
  let currentSavings = 0;

  progress.innerHTML = rules.map(r => `
    <div class="combo-builder__step" data-min="${r.minItems}">
      ${r.minItems}+ itens → <strong>${r.discount}% OFF</strong>
    </div>
  `).join('');

  const candidates = API_MOCK.products.slice(0, 8);
  grid.innerHTML = candidates.map(p => `
    <div class="combo-builder__item" data-id="${p.id}">
      <span class="combo-builder__item-icon">${p.icon}</span>
      <div class="combo-builder__item-info">
        <div class="combo-builder__item-title">${Utils.escapeHtml(p.title)}</div>
        <div class="combo-builder__item-price">${Utils.formatPrice(p.price)}</div>
      </div>
      <span class="combo-builder__item-check">✓</span>
    </div>
  `).join('');

  const update = () => {
    const count = selected.size;
    const items = [...selected].map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
    const subtotal = items.reduce((s, p) => s + p.price, 0);
    const rule = [...rules].reverse().find(r => count >= r.minItems);
    const discount = rule ? rule.discount : 0;
    const total = subtotal * (1 - discount / 100);
    const savings = subtotal - total;

    currentDiscount = discount;
    currentSavings = savings;

    document.getElementById('combo-count').textContent = count;
    document.getElementById('combo-discount').textContent = discount + '%';
    document.getElementById('combo-total').textContent = Utils.formatPrice(total);
    document.getElementById('combo-add-cart').disabled = count < 2;

    let savingsEl = document.getElementById('combo-savings');
    if (!savingsEl) {
      savingsEl = document.createElement('span');
      savingsEl.id = 'combo-savings';
      savingsEl.className = 'combo-builder__savings';
      document.querySelector('.combo-builder__summary').appendChild(savingsEl);
    }
    savingsEl.textContent = savings > 0 ? `Economia: ${Utils.formatPrice(savings)}` : '';

    progress.querySelectorAll('.combo-builder__step').forEach(step => {
      step.classList.toggle('combo-builder__step--active', count >= Number(step.dataset.min));
    });
  };

  grid.querySelectorAll('.combo-builder__item').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.id); // eslint-disable-line
      if (selected.has(id)) {
        selected.delete(id);
        el.classList.remove('combo-builder__item--selected');
      } else {
        selected.add(id);
        el.classList.add('combo-builder__item--selected');
      }
      update();
    });
  });

  document.getElementById('combo-add-cart').addEventListener('click', () => {
    const items = [...selected].map(id => API_MOCK.products.find(p => p.id === id)).filter(Boolean);
    items.forEach(p => {
      const discountedPrice = +(p.price * (1 - currentDiscount / 100)).toFixed(2);
      Cart.add({ ...p, price: discountedPrice }, 1, `Combo -${currentDiscount}%`);
    });
    Toast.show(`Combo adicionado! Você economizou ${Utils.formatPrice(currentSavings)}.`, 'success');
    selected.clear();
    grid.querySelectorAll('.combo-builder__item').forEach(el => el.classList.remove('combo-builder__item--selected'));
    update();
  });

  update();
}

/* ===== Game Covers ===== */
function filterGridByLabel(label) {
  const adsGrid = document.getElementById('ads-grid');
  if (!adsGrid) return;
  const hasSubcat = API_MOCK.products.some(p => p.subcategory === label);
  if (hasSubcat) {
    Filters.state.subcategory = label;
    Filters.state.category = '';
    Filters.state.hotOnly = false;
    Filters.state.search = '';
  } else {
    const cat = API_MOCK.categories.find(c => c.name.toLowerCase() === label.toLowerCase());
    if (cat) {
      Filters.state.category = cat.id;
      Filters.state.subcategory = '';
      Filters.state.hotOnly = false;
      Filters.state.search = '';
    } else {
      Filters.state.search = label;
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = label;
    }
  }
  const categorySelect = document.getElementById('filter-category');
  if (categorySelect) categorySelect.value = Filters.state.category || '';
  Filters.render(API_MOCK.products, adsGrid);
  document.getElementById('anuncios')?.scrollIntoView({ behavior: 'smooth' });
}

function renderGameCovers() {
  const grid = document.getElementById('game-covers-grid');
  if (!grid) return;
  const items = (SiteConfig.get().categories || []).map(c => ({
    ...c,
    count: API_MOCK.products.filter(p => p.subcategory === c.name).length
  }));
  grid.innerHTML = items.map(g => `
    <div class="game-cover" data-game="${g.id}">
      <div class="game-cover__bg"></div>
      <span class="game-cover__icon">${g.icon}</span>
      <div class="game-cover__name">${Utils.escapeHtml(g.name)}</div>
      <div class="game-cover__count">${g.count.toLocaleString('pt-BR')} anúncios</div>
    </div>
  `).join('');
  grid.querySelectorAll('.game-cover').forEach(el => {
    el.addEventListener('click', () => {
      const game = items.find(g => g.id === el.dataset.game);
      if (game) filterGridByLabel(game.name);
    });
  });
}

/* ===== Banners (gerenciados pelo Painel Admin) ===== */
function renderBanners() {
  const section = document.getElementById('banners-section');
  if (!section) return;
  const banners = SiteConfig.get().banners || [];
  if (!banners.length) { section.style.display = 'none'; return; }
  section.style.display = '';
  section.innerHTML = banners.map(b => `
    <a class="banner-card" href="${Utils.escapeHtml(b.link || '#')}">
      ${b.image ? `<span class="banner-card__img" style="background-image: url('${Utils.escapeHtml(b.image)}');"></span>` : ''}
      ${b.title ? `<span class="banner-card__title">${Utils.escapeHtml(b.title)}</span>` : ''}
    </a>
  `).join('');
}

// Atualizações do Painel Admin refletidas na hora
document.addEventListener('siteconfig:updated', () => {
  renderBanners();
  renderGameCovers();
});

/* ===== Services ===== */
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid || !API_MOCK.services) return;
  grid.innerHTML = API_MOCK.services.map(s => `
    <div class="service-card" data-service="${s.id}">
      <span class="service-card__icon">${s.icon}</span>
      <div>
        <div class="service-card__name">${Utils.escapeHtml(s.name)}</div>
        <div class="service-card__desc">${Utils.escapeHtml(s.desc)}</div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.service-card').forEach(el => {
    el.addEventListener('click', () => {
      const service = API_MOCK.services.find(s => s.id === el.dataset.service);
      if (service) filterGridByLabel(service.name);
    });
  });
}

/* ===== Reviews Marquee ===== */
function renderReviewsMarquee() {
  const track = document.getElementById('reviews-marquee-track');
  if (!track || !API_MOCK.verifiedReviews) return;
  const reviews = API_MOCK.verifiedReviews;
  const doubled = [...reviews, ...reviews];
  track.innerHTML = doubled.map(r => `
    <div class="review-card">
      <div class="review-card__header">
        <span class="review-card__user">${Utils.escapeHtml(r.user)}</span>
        <span class="review-card__game">${Utils.escapeHtml(r.game)}</span>
      </div>
      <div class="stars" style="margin-bottom: 0.4rem;">${Utils.stars(r.rating)}</div>
      <p class="review-card__comment">"${Utils.escapeHtml(r.comment)}"</p>
    </div>
  `).join('');
}

/* ===== Autocomplete ===== */
function initAutocomplete() {
  const input = document.getElementById('search-input');
  const box = document.getElementById('search-suggestions');
  if (!input || !box) return;
  const suggestions = API_MOCK.autocompleteSuggestions || [];
  let activeIndex = -1;

  const render = (list) => {
    if (!list.length) {
      box.classList.remove('search-suggestions--open');
      box.innerHTML = '';
      return;
    }
    box.innerHTML = list.map((s, i) => `
      <div class="search-suggestion ${i === activeIndex ? 'search-suggestion--active' : ''}" data-value="${Utils.escapeHtml(s)}">
        <span class="search-suggestion__icon">🔍</span> ${Utils.escapeHtml(s)}
      </div>
    `).join('');
    box.classList.add('search-suggestions--open');
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    activeIndex = -1;
    if (!q) { render([]); return; }
    const filtered = suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
    if (!filtered.length) {
      box.innerHTML = '<div class="search-suggestions__empty">Nenhuma sugestão encontrada</div>';
      box.classList.add('search-suggestions--open');
      return;
    }
    render(filtered);
  });

  input.addEventListener('focus', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return;
    const filtered = suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
    if (filtered.length) render(filtered);
  });

  input.addEventListener('keydown', (e) => {
    const items = box.querySelectorAll('.search-suggestion');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      items.forEach((it, i) => it.classList.toggle('search-suggestion--active', i === activeIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('search-suggestion--active', i === activeIndex));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      input.value = items[activeIndex].dataset.value;
      box.classList.remove('search-suggestions--open');
      input.dispatchEvent(new Event('input'));
    } else if (e.key === 'Escape') {
      box.classList.remove('search-suggestions--open');
    }
  });

  box.addEventListener('click', (e) => {
    const item = e.target.closest('.search-suggestion');
    if (!item) return;
    input.value = item.dataset.value;
    box.classList.remove('search-suggestions--open');
    Filters.state.search = item.dataset.value;
    const grid = document.getElementById('ads-grid');
    if (grid) Filters.render(API_MOCK.products, grid);
    document.getElementById('anuncios')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__search')) {
      box.classList.remove('search-suggestions--open');
    }
  });
}

/* ===== Swimlanes ===== */
function renderSwimlanes() {
  const container = document.getElementById('swimlanes');
  if (!container || !API_MOCK.swimlanes) return;
  container.innerHTML = API_MOCK.swimlanes.map(lane => {
    const items = API_MOCK.products.filter(lane.filter).slice(0, 8);
    if (!items.length) return '';
    return `
      <div class="swimlane">
        <div class="swimlane__header">
          <h2 class="swimlane__title">${lane.title}</h2>
          <div class="carousel__nav">
            <button class="carousel__btn" data-scroll="lane-${lane.id}" data-dir="-1">‹</button>
            <button class="carousel__btn" data-scroll="lane-${lane.id}" data-dir="1">›</button>
          </div>
        </div>
        <div class="carousel">
          <div class="carousel__track" id="lane-${lane.id}">
            ${items.map(p => Card.build(p, { base: 'pages/' })).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
  container.querySelectorAll('.carousel__track').forEach(track => {
    Card.bind(track, 'pages/');
    // Suporte a swipe
    let startX = 0, scrollStart = 0, isDragging = false;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      scrollStart = track.scrollLeft;
      isDragging = true;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
      if (!isDragging) return;
      track.scrollLeft = scrollStart - (e.touches[0].clientX - startX);
    }, { passive: true });
    track.addEventListener('touchend', () => { isDragging = false; });
  });
  container.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.scroll);
      if (!track) return;
      const dir = Number(btn.dataset.dir) || 1;
      track.scrollBy({ left: dir * 300, behavior: 'smooth' });
    });
  });
}

