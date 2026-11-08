// Componente de card de anúncio compartilhado entre a home e a página do vendedor.
const Card = {
  gradient() {
    return 'linear-gradient(180deg, #1A1C1F, #101114)';
  },

  build(p, opts = {}) {
    const base = opts.base !== undefined ? opts.base : 'pages/';
    const discount = p.originalPrice && p.originalPrice > p.price
      ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const level = (p.sellerLevel || 'quartzo').toLowerCase();
    const levelInfo = (API_MOCK.sellerLevels && API_MOCK.sellerLevels[level]) || { icon: '💠' };
    const label = Utils.escapeHtml(p.subcategory || Utils.formatCategory(p.category));
    const sellerHref = `${base}vendedor.html?id=${encodeURIComponent(p.seller)}`;

    return `
    <article class="card" data-id="${p.id}">
      <div class="card__image" style="background: ${this.gradient()};">
        ${opts.rank ? `<span class="card__rank">#${opts.rank}</span>` : ''}
        <span class="card__game-pill">${label}</span>
        <span class="card__image-icon">${p.icon}</span>
        <button type="button" class="card__fav ${Favorites.has(p.id) ? 'card__fav--active' : ''}" data-fav="${p.id}" aria-label="Favoritar anúncio" aria-pressed="${Favorites.has(p.id)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7.5-4.6-10-9.2C.5 8.2 2.3 5 5.7 5c1.9 0 3.4 1 4.3 2.4C11 6 12.5 5 14.3 5c3.4 0 5.2 3.2 3.7 6.8C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <div class="card__tags">
          ${p.deliveryType === 'auto' ? '<span class="card__tag card__tag--auto">AUTO</span>' : ''}
          ${discount > 0 ? `<span class="card__tag card__tag--discount">-${discount}%</span>` : ''}
        </div>
      </div>
      <div class="card__body">
        <h3 class="card__title">${Utils.escapeHtml(p.title)}</h3>
        <a class="card__seller-link" href="${sellerHref}">
          <span class="card__seller-mini">
            <span class="card__seller-avatar">${Utils.escapeHtml(String(p.seller || '?').charAt(0).toUpperCase())}</span>
            <span>${Utils.escapeHtml(p.seller)}</span>
            ${p.sellerVerified ? '<span class="verified-icon">✓</span>' : ''}
            <span class="badge badge--level badge--level-${level}" title="${Utils.escapeHtml(p.sellerLevel || 'Quartzo')}">${levelInfo.icon}</span>
          </span>
        </a>
        <div class="card__rating">
          <span class="stars">★ ${p.rating.toFixed(1)}</span>
          <span class="card__reviews">(${p.reviewCount || 0})</span>
          <span>· ${p.soldCount || 0} vendas</span>
        </div>
        <div class="card__footer">
          <div class="card__price-block">
            ${p.originalPrice && p.originalPrice > p.price ? `<span class="card__old-price">${Utils.formatPrice(p.originalPrice)}</span>` : ''}
            <span class="card__price">${Utils.formatPrice(p.price)}</span>
          </div>
          <a class="btn--card-buy" href="${base}produto.html?id=${p.id}">Comprar</a>
        </div>
      </div>
    </article>
  `;
  },

  bind(container, base = 'pages/') {
    if (!container || container.dataset.bound) return;
    container.dataset.bound = '1';
    container.addEventListener('click', e => {
      const favBtnCard = e.target.closest('[data-fav]');
      if (favBtnCard) {
        e.stopPropagation();
        const active = Favorites.toggle(favBtnCard.dataset.fav);
        favBtnCard.classList.toggle('card__fav--active', active);
        favBtnCard.setAttribute('aria-pressed', String(active));
        Toast.show(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', active ? 'success' : 'info');
        return;
      }
      if (e.target.closest('a[href]')) return;
      const card = e.target.closest('.card');
      if (!card) return;
      const id = Number(card.dataset.id);
      const product = API_MOCK.products.find(p => p.id === id);
      if (product) window.location.href = `${base}produto.html?id=${product.id}`;
    });
  }
};
