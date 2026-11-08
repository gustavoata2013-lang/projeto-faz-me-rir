document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  const container = document.getElementById('seller-content');
  const name = Utils.getParam('id') || '';

  const products = [
    ...API_MOCK.products.filter(p => p.seller === name),
    ...Utils.loadUserProducts().filter(p => p.seller === name)
  ];
  const profile = SellerStore.get(name);

  const level = (products[0] && products[0].sellerLevel) || 'quartzo';
  const levelInfo = (API_MOCK.sellerLevels && API_MOCK.sellerLevels[level]) || { icon: '💠', label: 'Quartzo' };
  const online = products.some(p => p.sellerOnline);
  const memberSince = (products[0] && products[0].sellerMemberSince) || '';
  const verified = products.some(p => p.sellerVerified);

  const avgRating = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : '—';
  const totalSales = products.reduce((s, p) => s + (p.soldCount || 0), 0);

  const minutes = products
    .map(p => ({ t: String(p.deliveryTime || ''), m: /(\d+)/.exec(String(p.deliveryTime || '')) }))
    .filter(x => /min/i.test(x.t))
    .map(x => Number(x.m ? x.m[1] : 0));
  const avgDelivery = minutes.length
    ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length) + ' min'
    : '—';

  const reviews = products.flatMap(p =>
    API_MOCK.getReviews(p).map(r => ({ ...r, productTitle: p.title }))
  );

  if (!products.length && !profile.bio) {
    container.innerHTML = `
      <div class="cart-empty">
        <p style="font-size: 3rem;">👤</p>
        <p style="color: var(--text-secondary); margin: 1rem 0;">Vendedor não encontrado.</p>
        <a href="../index.html" class="btn btn--primary">Voltar ao catálogo</a>
      </div>
    `;
    return;
  }

  const avatarHtml = profile.avatar
    ? `<img class="profile-header__avatar-img" src="${Utils.escapeHtml(profile.avatar)}" alt="">`
    : `<div class="profile-header__avatar">${Utils.escapeHtml(String(profile.displayName || name).charAt(0).toUpperCase())}</div>`;

  const reviewsHtml = reviews.length
    ? reviews.map(r => `
        <div class="review">
          <div class="review__header">
            <strong>${Utils.escapeHtml(r.user)}</strong>
            <span class="stars">${Utils.stars(r.rating)}</span>
          </div>
          <p class="review__comment">${Utils.escapeHtml(r.comment)}</p>
          <div class="review__meta">
            <span class="review__date">${Utils.formatDate(r.date)}</span>
            <span class="review__product">· ${Utils.escapeHtml(r.productTitle)}</span>
          </div>
        </div>
      `).join('')
    : '<p style="color: var(--text-secondary);">Ainda sem avaliações.</p>';

  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="../index.html">Início</a> ›
      <span>${Utils.escapeHtml(profile.displayName || name)}</span>
    </nav>
    <section class="profile-header">
      ${avatarHtml}
      <div class="profile-header__info">
        <div class="profile-header__name-row">
          <h1 class="profile-header__name">${Utils.escapeHtml(profile.displayName || name)}</h1>
          ${verified ? '<span class="verified-icon">✓</span>' : ''}
          <span class="badge badge--level badge--level-${level}">${levelInfo.icon} ${levelInfo.label}</span>
        </div>
        <div class="profile-header__status ${online ? 'profile-header__status--online' : ''}">
          <span class="seller-card__status-dot"></span>
          ${online ? 'Online agora' : 'Offline'}
          ${memberSince ? `<span>· Membro desde ${Utils.escapeHtml(memberSince)}</span>` : ''}
        </div>
        ${profile.bio ? `<p class="profile-bio">${Utils.escapeHtml(profile.bio)}</p>` : ''}
      </div>
    </section>
    <section class="profile-metrics">
      <div class="metric-card">
        <span class="metric-card__icon">⭐</span>
        <span class="metric-card__value">${avgRating} <small>/ 5</small></span>
        <span class="metric-card__label">Avaliação média</span>
      </div>
      <div class="metric-card">
        <span class="metric-card__icon">⏱</span>
        <span class="metric-card__value">${avgDelivery}</span>
        <span class="metric-card__label">Tempo médio de entrega</span>
      </div>
      <div class="metric-card">
        <span class="metric-card__icon">📦</span>
        <span class="metric-card__value">${totalSales.toLocaleString('pt-BR')}</span>
        <span class="metric-card__label">Vendas concluídas</span>
      </div>
    </section>
    <div class="tabs" role="tablist" id="seller-tabs">
      <button class="tab tab--active" data-tab="anuncios" role="tab" aria-selected="true">Anúncios Ativos (${products.length})</button>
      <button class="tab" data-tab="avaliacoes" role="tab" aria-selected="false">Avaliações (${reviews.length})</button>
    </div>
    <div class="tab-panel" id="panel-anuncios" role="tabpanel">
      ${products.length ? `<div class="ads__grid" id="seller-ads-grid">${products.map(p => Card.build(p, { base: '' })).join('')}</div>` : '<p style="color: var(--text-secondary);">Nenhum anúncio ativo.</p>'}
    </div>
    <div class="tab-panel" id="panel-avaliacoes" role="tabpanel" hidden>
      <div class="product-detail__reviews">${reviewsHtml}</div>
    </div>
  `;

  const grid = document.getElementById('seller-ads-grid');
  if (grid) Card.bind(grid, '');

  document.getElementById('seller-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('#seller-tabs .tab').forEach(t => {
      const active = t === tab;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.hidden = p.id !== 'panel-' + tab.dataset.tab;
    });
  });
});
