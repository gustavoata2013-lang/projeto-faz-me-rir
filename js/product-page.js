document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  Cart.updateBadge();

  const id = Number(Utils.getParam('id'));
  const product = API_MOCK.products.find(p => p.id === id) ||
    Utils.loadUserProducts().find(p => p.id === id);
  const container = document.getElementById('product-page');

  // Registra a visita no histórico "Continue de onde parou"
  try {
    const stored = JSON.parse(localStorage.getItem('fmr-history')) || [];
    localStorage.setItem('fmr-history', JSON.stringify([id, ...stored.filter(x => x !== id)].slice(0, 5)));
  } catch { /* ignore */ }

  if (!product) {
    container.innerHTML = `
      <div class="cart-empty">
        <p style="font-size: 3rem;">🔍</p>
        <p style="color: var(--text-secondary); margin: 1rem 0;">Produto não encontrado ou removido.</p>
        <a href="../index.html" class="btn btn--primary">Voltar ao catálogo</a>
      </div>
    `;
    return;
  }

  // ===== Estado da página =====
  const variants = product.variants && product.variants.length
    ? product.variants
    : [{ name: 'Padrão', price: product.price, stock: product.stock || 1 }];
  const state = { variant: 0, qty: 1, tab: 'descricao' };
  const variant = () => variants[state.variant];
  const total = () => variant().price * state.qty;

  const level = (product.sellerLevel || 'quartzo').toLowerCase();
  const levelInfo = (API_MOCK.sellerLevels && API_MOCK.sellerLevels[level]) || { icon: '💠', label: 'Quartzo' };
  const reviews = API_MOCK.getReviews(product);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Perguntas persistidas (localStorage)
  const questions = [...(product.questions || [])];
  try {
    const stored = JSON.parse(localStorage.getItem('fmr-questions') || '{}');
    (stored[product.id] || []).forEach(q => {
      if (!questions.some(m => m.question === q.question && m.user === q.user)) questions.push(q);
    });
  } catch { /* ignore */ }

  // ===== Helpers de renderização =====
  const reviewsHtml = () => reviews.length
    ? reviews.map(r => `
        <div class="review">
          <div class="review__header">
            <strong>${Utils.escapeHtml(r.user)}</strong>
            <span class="stars">${Utils.stars(r.rating)}</span>
          </div>
          <p class="review__comment">${Utils.escapeHtml(r.comment)}</p>
          <span class="review__date">${Utils.formatDate(r.date)}</span>
        </div>
      `).join('')
    : '<p style="color: var(--text-secondary);">Ainda sem avaliações.</p>';

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++; });
  const totalReviews = reviews.length || 1;
  const ratingBarsHtml = () => [5, 4, 3, 2, 1].map(n => {
    const pct = Math.round((ratingCounts[n] / totalReviews) * 100);
    return `<div class="reviews-bar"><span class="reviews-bar__label">${n}★</span><div class="reviews-bar__track"><div class="reviews-bar__fill" style="width:${pct}%"></div></div><span class="reviews-bar__count">${pct}%</span></div>`;
  }).join('');

  const questionsHtml = () => questions.length
    ? questions.map(q => `
        <div class="qa-item">
          <div class="qa-item__question"><span class="qa-item__icon">❓</span><div><strong>${Utils.escapeHtml(q.user)}:</strong> ${Utils.escapeHtml(q.question)}</div></div>
          ${q.answer ? `<div class="qa-item__answer"><span class="qa-item__icon">💬</span><div><strong>Vendedor:</strong> ${Utils.escapeHtml(q.answer)}</div></div>` : ''}
        </div>
      `).join('')
    : '<p style="color: var(--text-secondary);">Nenhuma pergunta ainda. Seja o primeiro!</p>';

  const variantsHtml = () => variants.map((v, i) => `
      <div class="variant-option ${i === state.variant ? 'variant-option--active' : ''}" data-variant="${i}">
        <span>${Utils.escapeHtml(v.name)}</span>
        <span class="variant-option__price">${Utils.formatPrice(v.price)}</span>
      </div>
    `).join('');

  const images = product.images || [product.icon];
  const thumbsHtml = () => images.map((img, i) => `
      <div class="product-detail__thumb ${i === 0 ? 'product-detail__thumb--active' : ''}" data-thumb="${i}">${img}</div>
    `).join('');

  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="../index.html">Início</a> ›
      <a href="../index.html">${Utils.formatCategory(product.category)}</a> ›
      <span>${Utils.escapeHtml(product.title)}</span>
    </nav>
    <div class="product-detail">
      <div class="product-detail__main">
        <div class="product-detail__gallery">
          <div class="product-detail__image" id="gallery-main">${images[0]}</div>
          <div class="product-detail__thumbs">${thumbsHtml()}</div>
        </div>
        <div class="product-detail__seller-row">
          <p class="product-detail__seller">Vendedor: <a class="product-detail__seller-link" href="vendedor.html?id=${encodeURIComponent(product.seller)}"><strong>${Utils.escapeHtml(product.seller)}</strong></a> ${product.sellerVerified ? '<span class="verified-icon">✓</span>' : ''} <span class="badge badge--level badge--level-${level}">${levelInfo.icon} ${levelInfo.label}</span></p>
          <button type="button" class="product-fav ${Favorites.has(product.id) ? 'product-fav--active' : ''}" id="product-fav" aria-label="Favoritar anúncio" aria-pressed="${Favorites.has(product.id)}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7.5-4.6-10-9.2C.5 8.2 2.3 5 5.7 5c1.9 0 3.4 1 4.3 2.4C11 6 12.5 5 14.3 5c3.4 0 5.2 3.2 3.7 6.8C19.5 16.4 12 21 12 21z"/></svg>
          </button>
        </div>
        <h1 class="product-detail__title">${Utils.escapeHtml(product.title)}</h1>
        <div class="product-detail__rating-row">
          <div class="product-detail__rating">
            <span class="stars">${Utils.stars(product.rating)}</span>
            <span style="color: var(--text-secondary);">(${product.reviewCount} avaliações)</span>
          </div>
          <div class="product-detail__meta">
            <span>⏱ Entrega: ${product.deliveryTime || '—'}</span>
            <span>📦 Estoque: ${product.stock || 0}</span>
            <span>${product.deliveryType === 'auto' ? '⚡ Entrega Automática' : '👤 Entrega Manual'}</span>
          </div>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab tab--active" data-tab="descricao" role="tab" aria-selected="true">Descrição</button>
          <button class="tab" data-tab="avaliacoes" role="tab" aria-selected="false">Avaliações (${reviews.length})</button>
          <button class="tab" data-tab="perguntas" role="tab" aria-selected="false">Perguntas (${questions.length})</button>
        </div>
        <div class="tab-panel" id="panel-descricao" role="tabpanel">
          <p class="product-detail__description">${Utils.escapeHtml(product.description || '')}</p>
        </div>
        <div class="tab-panel" id="panel-avaliacoes" role="tabpanel" hidden>
          <div class="reviews-summary">
            <div class="reviews-summary__score">
              <div class="reviews-summary__score-value">${product.rating.toFixed(1)}</div>
              <div class="stars">${Utils.stars(product.rating)}</div>
              <div class="reviews-summary__score-label">${product.reviewCount} avaliações</div>
            </div>
            <div class="reviews-bars">${ratingBarsHtml()}</div>
          </div>
          <div class="product-detail__reviews">${reviewsHtml()}</div>
        </div>
        <div class="tab-panel" id="panel-perguntas" role="tabpanel" hidden>
          <div class="qa-warning">⚠️ Nunca compartilhe dados pessoais ou realize pagamentos fora da plataforma.</div>
          <div>${questionsHtml()}</div>
          <form class="qa-form" id="qa-form">
            <input type="text" id="qa-input" placeholder="Faça uma pergunta ao vendedor..." required>
            <button type="submit" class="btn btn--primary">Enviar</button>
          </form>
        </div>
      </div>
      <aside class="product-detail__sidebar">
        <div class="seller-card">
          <a class="seller-card__avatar-link" href="vendedor.html?id=${encodeURIComponent(product.seller)}"><div class="seller-card__avatar">${product.seller.charAt(0).toUpperCase()}</div></a>
          <div class="seller-card__info">
            <div class="seller-card__name">
              <a class="product-detail__seller-link" href="vendedor.html?id=${encodeURIComponent(product.seller)}">${Utils.escapeHtml(product.seller)}</a>
              ${product.sellerVerified ? '<span class="verified-icon">✓</span>' : ''}
            </div>
            <div class="seller-card__status ${product.sellerOnline ? 'seller-card__status--online' : ''}">
              <span class="seller-card__status-dot"></span>
              ${product.sellerOnline ? 'Online agora' : 'Offline'} · desde ${product.sellerMemberSince || '2020'}
            </div>
            <span class="badge badge--level badge--level-${level}">${levelInfo.icon} ${levelInfo.label}</span>
          </div>
        </div>
        <div class="buy-panel">
          <div class="buy-panel__price-box">
            ${discount > 0 ? `<span class="card__discount" style="position:static;">-${discount}%</span>` : ''}
            ${product.originalPrice && product.originalPrice > variant().price ? `<span class="card__old-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
            <p class="product-detail__price" id="buy-price">${Utils.formatPrice(variant().price)}</p>
          </div>
          <label class="buy-panel__label">Variação</label>
          <div class="buy-panel__variants" id="buy-variants">${variantsHtml()}</div>
          <div class="buy-panel__qty" id="buy-qty-block">
            <label class="buy-panel__label">Quantidade</label>
            <div class="qty-selector">
              <button type="button" id="qty-minus" aria-label="Diminuir quantidade">−</button>
              <input type="number" id="qty-input" value="1" min="1" max="${variant().stock}">
              <button type="button" id="qty-plus" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <div class="buy-panel__total">
            <span>Total</span>
            <span id="buy-total">${Utils.formatPrice(total())}</span>
          </div>
          <p class="buy-panel__custody">🔒 Compra protegida pelo sistema de segurança. O valor só é liberado ao vendedor após você confirmar o recebimento.</p>
          <div class="buy-panel__actions">
            <button class="btn btn--primary btn--lg" id="buy-now">Comprar com segurança</button>
          </div>
        </div>
      </aside>
    </div>
  `;

  // ===== Eventos =====
  const updatePrice = () => {
    document.getElementById('buy-price').textContent = Utils.formatPrice(variant().price);
    document.getElementById('buy-total').textContent = Utils.formatPrice(total());
  };

  const qtyInput = document.getElementById('qty-input');

  // Oculta o bloco de quantidade quando só existe 1 unidade em estoque
  const updateQtyVisibility = () => {
    const block = document.getElementById('buy-qty-block');
    const hide = variant().stock <= 1;
    if (block) block.hidden = hide;
    if (hide) state.qty = 1;
  };
  updateQtyVisibility();

  document.getElementById('buy-variants').addEventListener('click', (e) => {
    const el = e.target.closest('[data-variant]');
    if (!el) return;
    state.variant = Number(el.dataset.variant);
    state.qty = 1;
    qtyInput.value = 1;
    qtyInput.max = variant().stock;
    document.getElementById('buy-variants').innerHTML = variantsHtml();
    updateQtyVisibility();
    updatePrice();
  });

  document.getElementById('qty-minus').addEventListener('click', () => {
    if (state.qty > 1) { state.qty--; qtyInput.value = state.qty; updatePrice(); }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    if (state.qty < variant().stock) { state.qty++; qtyInput.value = state.qty; updatePrice(); }
  });
  qtyInput.addEventListener('change', () => {
    let v = parseInt(qtyInput.value) || 1;
    v = Math.max(1, Math.min(v, variant().stock));
    state.qty = v;
    qtyInput.value = v;
    updatePrice();
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.tab = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => {
        const active = t === tab;
        t.classList.toggle('tab--active', active);
        t.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.hidden = p.id !== 'panel-' + state.tab;
      });
    });
  });

  document.querySelectorAll('.product-detail__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = Number(thumb.dataset.thumb);
      document.getElementById('gallery-main').textContent = images[idx];
      document.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('product-detail__thumb--active'));
      thumb.classList.add('product-detail__thumb--active');
    });
  });

  document.getElementById('product-fav').addEventListener('click', (e) => {
    e.stopPropagation();
    const active = Favorites.toggle(product.id);
    const btn = document.getElementById('product-fav');
    btn.classList.toggle('product-fav--active', active);
    btn.setAttribute('aria-pressed', String(active));
    Toast.show(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', active ? 'success' : 'info');
  });

  document.getElementById('qa-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('qa-input');
    const text = input.value.trim();
    if (!text) return;
    const newQ = { user: Auth.getUser()?.username || 'Você', question: text, answer: null, date: new Date().toISOString().slice(0, 10) };
    questions.push(newQ);
    try {
      const stored = JSON.parse(localStorage.getItem('fmr-questions') || '{}');
      if (!stored[product.id]) stored[product.id] = [];
      stored[product.id].push(newQ);
      localStorage.setItem('fmr-questions', JSON.stringify(stored));
    } catch { /* ignore */ }
    input.value = '';
    Toast.show('Pergunta enviada ao vendedor!', 'success');
    document.querySelector('#panel-perguntas div:nth-child(2)').innerHTML = questionsHtml();
    const tabPerguntas = document.querySelector('.tab[data-tab="perguntas"]');
    tabPerguntas.textContent = `Perguntas (${questions.length})`;
  });

  document.getElementById('buy-now').addEventListener('click', () => {
    Modal.openSecurity(
      { ...product, price: total() },
      { variantName: variants.length > 1 ? variant().name : null, qty: state.qty }
    );
  });
});
