const Modal = {
  root: null,
  lastFocused: null,
  initialized: false,

  init() {
    this.root = document.getElementById('modal-root');
    if (this.initialized) return;
    this.initialized = true;
    document.addEventListener('keydown', (e) => {
      const modal = this.root && this.root.querySelector('.modal');
      if (!modal) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const inside = modal.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    });
  },

  activate(dialog, labelId) {
    if (!dialog) return;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', labelId);
    document.body.classList.add('modal-open');
    const first = dialog.querySelector('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    if (first) first.focus();
  },

  openProduct(product) {
    this.lastFocused = document.activeElement;
    const reviews = API_MOCK.getReviews(product);
    const reviewsHtml = reviews.length
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
      : '<p style="color: var(--text-secondary); font-size: 0.9rem;">Ainda sem avaliações.</p>';

    this.root.innerHTML = `
      <div class="modal-overlay" data-close="true">
        <div class="modal" data-close="false">
          <button class="modal__close" data-close="true" aria-label="Fechar">×</button>
          <div class="modal__hero">${product.icon}</div>
          <h2 class="modal__title" id="modal-title">${Utils.escapeHtml(product.title)}</h2>
          <p class="modal__seller">Vendedor: <strong>${Utils.escapeHtml(product.seller)}</strong> ${product.sellerVerified ? '<span class="verified-icon">✓</span>' : ''}</p>
          <div class="modal__rating">
            <span class="stars">${Utils.stars(product.rating)}</span>
            <span style="color: var(--text-secondary);">(${product.reviewCount} avaliações)</span>
          </div>
          <p class="modal__description">${Utils.escapeHtml(product.description || '')}</p>
          <div class="modal__meta">
            <span>⏱ Entrega: ${product.deliveryTime || '—'}</span>
            <span>📦 Estoque: ${product.stock || 0}</span>
          </div>
          <p class="card__price" style="margin: 1rem 0; font-size: 1.5rem;">${Utils.formatPrice(product.price)}</p>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            🔒 Compra protegida pelo sistema de segurança. O valor só é liberado ao vendedor após você confirmar o recebimento.
          </p>
          <h3 class="modal__section-title">Avaliações</h3>
          <div class="modal__reviews">${reviewsHtml}</div>
          <div class="modal__actions">
            <button class="btn btn--outline" data-close="true">Cancelar</button>
            <button class="btn btn--outline" id="add-cart">🛒 Adicionar</button>
            <button class="btn btn--primary" id="confirm-buy">Comprar com segurança</button>
          </div>
        </div>
      </div>
    `;
    this.bindEvents(product);
    this.activate(this.root.querySelector('.modal'), 'modal-title');
    const addBtn = document.getElementById('add-cart');
    if (addBtn) addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      Cart.add(product);
      this.close();
    });
  },

  openSecurity(product, opts = {}) {
    this.lastFocused = document.activeElement;
    const plans = {
      none: { name: 'Sem seguro adicional', price: 0 },
      basic: { name: 'Seguro Básico', price: 0.79 },
      premium: { name: 'Seguro Premium', price: 1.49 }
    };
    let selected = 'none';
    const insurancePrice = () => plans[selected].price;
    const total = () => product.price + insurancePrice();

    this.root.innerHTML = `
      <div class="modal-overlay" data-close="true">
        <div class="modal modal--security" data-close="false">
          <button class="modal__close" data-close="true" aria-label="Fechar">×</button>
          <h2 class="modal__title" id="security-title">Proteção adicional (opcional)</h2>
          <div class="security-layout">
            <div class="security-plans">
              <div class="plan-card" data-plan="basic">
                <div class="plan-card__head">
                  <span class="plan-card__name">Seguro Básico</span>
                  <span class="plan-card__price">+ R$ 0,79</span>
                </div>
                <ul class="plan-card__benefits">
                  <li>Reclamação em até 6h (em vez de 12h)</li>
                  <li>Suporte estendido por 45 dias</li>
                  <li>Resposta rápida de moderador</li>
                </ul>
              </div>
              <div class="plan-card plan-card--featured" data-plan="premium">
                <div class="plan-card__head">
                  <span class="plan-card__name">Seguro Premium</span>
                  <span class="plan-card__price">+ R$ 1,49</span>
                </div>
                <span class="plan-card__chip">Recomendado</span>
                <ul class="plan-card__benefits">
                  <li>Reclamação em 1h (em vez de 12h)</li>
                  <li>Suporte estendido por 90 dias</li>
                  <li>Resposta prioritária</li>
                  <li>Ganhe o dobro de pontos</li>
                </ul>
              </div>
              <button type="button" class="plan-none plan-none--active" data-plan="none">
                <span>Continuar sem seguro</span>
                <span class="plan-none__hint">Garantia padrão de 30 dias</span>
              </button>
            </div>
            <div class="security-summary">
              <h3 class="security-summary__title">Resumo da compra</h3>
              <div class="checkout-summary__row">
                <span>Produto</span>
                <span>${Utils.formatPrice(product.price)}</span>
              </div>
              ${opts.variantName ? `<div class="checkout-summary__row"><span>Variante</span><span>${Utils.escapeHtml(opts.variantName)}</span></div>` : ''}
              ${opts.qty && opts.qty > 1 ? `<div class="checkout-summary__row"><span>Quantidade</span><span>${opts.qty}x</span></div>` : ''}
              <div class="checkout-summary__row">
                <span>Seguro</span>
                <span id="sec-insurance">${Utils.formatPrice(0)}</span>
              </div>
              <div class="checkout-summary__row checkout-summary__row--fee">
                <span>Taxa de serviço</span>
                <span>Grátis</span>
              </div>
              <div class="checkout-summary__row checkout-summary__total">
                <span>Total Geral</span>
                <span id="sec-total">${Utils.formatPrice(total())}</span>
              </div>
              <button class="btn btn--primary btn--lg" id="go-payment" style="width:100%; margin-top: 0.75rem;">Ir para o pagamento</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.bindEvents();
    this.activate(this.root.querySelector('.modal'), 'security-title');

    const updateSummary = () => {
      document.getElementById('sec-insurance').textContent = Utils.formatPrice(insurancePrice());
      document.getElementById('sec-total').textContent = Utils.formatPrice(total());
    };

    this.root.querySelectorAll('[data-plan]').forEach(el => {
      el.addEventListener('click', () => {
        selected = el.dataset.plan;
        this.root.querySelectorAll('[data-plan]').forEach(x => {
          const active = x === el;
          x.classList.toggle('plan-card--active', active && x.classList.contains('plan-card'));
          x.classList.toggle('plan-none--active', active && x.classList.contains('plan-none'));
        });
        updateSummary();
      });
    });

    document.getElementById('go-payment').addEventListener('click', (e) => {
      e.stopPropagation();
      const insurance = selected === 'none' ? null : { name: plans[selected].name, price: plans[selected].price };
      this.openConfirm(product, { ...opts, insurance });
    });
  },

  openConfirm(product, opts = {}) {
    this.lastFocused = document.activeElement;
    const cfg = SiteConfig.get();
    const pixCode = (cfg.pix && cfg.pix.code) || '00020126580014BR.GOV.BCB.PIX0136faca-me-rir-demo5204000053039865802BR5913FACA ME RIR6009SAO PAULO62070503***6304ABCD';
    this._onSuccess = opts.onSuccess || null;
    const insurance = opts.insurance || null;
    const total = product.price + (insurance ? insurance.price : 0);
    this.root.innerHTML = `
      <div class="modal-overlay" data-close="true">
        <div class="modal" data-close="false">
          <button class="modal__close" data-close="true" aria-label="Fechar">×</button>
          <h2 class="modal__title" id="confirm-title">Pagamento via PIX</h2>
          <div class="checkout-summary">
            <div class="checkout-summary__row">
              <span>Produto</span>
              <strong>${Utils.escapeHtml(product.title)}</strong>
            </div>
            ${opts.variantName ? `<div class="checkout-summary__row"><span>Variante</span><span>${Utils.escapeHtml(opts.variantName)}</span></div>` : ''}
            ${opts.qty && opts.qty > 1 ? `<div class="checkout-summary__row"><span>Quantidade</span><span>${opts.qty}x</span></div>` : ''}
            ${insurance ? `<div class="checkout-summary__row"><span>Seguro</span><span>${Utils.escapeHtml(insurance.name)} · ${Utils.formatPrice(insurance.price)}</span></div>` : ''}
            <div class="checkout-summary__row checkout-summary__row--fee">
              <span>Taxa de serviço</span>
              <span>Grátis</span>
            </div>
            <div class="checkout-summary__row checkout-summary__total">
              <span>Total</span>
              <span>${Utils.formatPrice(total)}</span>
            </div>
          </div>
          <div class="pix-box mp-pix">
            <div class="mp-pix__header">
              <span class="mp-pix__logo">M</span>
              <span class="mp-pix__brand">Mercado Pago</span>
              <span class="mp-pix__badge">PIX</span>
            </div>
            <div class="mp-pix__qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixCode)}" alt="QR Code PIX">
            </div>
            <p class="mp-pix__value">${Utils.formatPrice(total)}</p>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Escaneie o QR Code ou copie o código PIX abaixo:</p>
            <div class="pix-box__code">${pixCode}</div>
            <button class="btn btn--outline" id="copy-pix" style="font-size: 0.8rem;">📋 Copiar Código</button>
          </div>
          <div class="custody-notice">
            🔒 <strong>Garantia Escrow:</strong> seu pagamento fica protegido pelo sistema de segurança. O valor só é liberado ao vendedor após você confirmar o recebimento do produto.
          </div>
          <div class="modal__actions">
            <button class="btn btn--outline" data-close="true">Cancelar</button>
            <button class="btn btn--primary" id="finalize-buy">Já paguei — Confirmar</button>
          </div>
        </div>
      </div>
    `;
    this.bindEvents();
    this.activate(this.root.querySelector('.modal'), 'confirm-title');

    const copyBtn = document.getElementById('copy-pix');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(pixCode);
        Toast.show('Código PIX copiado!', 'success');
      });
    }

    document.getElementById('finalize-buy').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openSuccess();
    });
  },

  openSuccess() {
    this.lastFocused = document.activeElement;
    if (typeof this._onSuccess === 'function') this._onSuccess();
    this._onSuccess = null;
    this.root.innerHTML = `
      <div class="modal-overlay" data-close="true">
        <div class="modal" data-close="false">
          <h2 class="modal__title" id="success-title">✅ Pagamento recebido!</h2>
          <p>Seu pagamento via PIX foi confirmado. O produto está protegido pelo sistema de segurança e será liberado após você validar o recebimento.</p>
          <div class="custody-notice" style="margin-top: 1rem;">
            🔒 Seu pagamento está protegido. Libere apenas após confirmar o recebimento.
          </div>
          <div class="modal__actions">
            <button class="btn btn--primary" data-close="true">Fechar</button>
          </div>
        </div>
      </div>
    `;
    this.bindEvents();
    this.activate(this.root.querySelector('.modal'), 'success-title');
    Toast.show('Pagamento recebido! Compra protegida.', 'success');
  },

  bindEvents(product) {
    this.bindClose();
    const confirmBtn = document.getElementById('confirm-buy');
    if (confirmBtn && product) {
      confirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openConfirm(product);
      });
    }
  },

  bindClose() {
    this.root.querySelectorAll('[data-close="true"]').forEach(el => {
      el.addEventListener('click', e => {
        if (el.classList.contains('modal-overlay') && e.target !== el) return;
        this.close();
      });
    });
  },

  openFavorites() {
    this.lastFocused = document.activeElement;
    const ids = Favorites.get();
    const items = API_MOCK.products.filter(p => ids.includes(p.id));
    const list = items.length
      ? items.map(p => `
          <div class="fav-item">
            <span class="fav-item__icon">${p.icon}</span>
            <div class="fav-item__info">
              <strong>${Utils.escapeHtml(p.title)}</strong>
              <span>${Utils.formatPrice(p.price)}</span>
            </div>
            <button class="btn btn--outline" data-fav-open="${p.id}">Abrir</button>
            <button class="btn btn--outline" data-fav-remove="${p.id}" aria-label="Remover dos favoritos">✕</button>
          </div>
        `).join('')
      : '<p style="color: var(--text-secondary); font-size: 0.9rem;">Você ainda não favoritou nenhum anúncio.</p>';

    this.root.innerHTML = `
      <div class="modal-overlay" data-close="true">
        <div class="modal" data-close="false">
          <button class="modal__close" data-close="true" aria-label="Fechar">×</button>
          <h2 class="modal__title" id="fav-title">Favoritos (${items.length})</h2>
          <div class="fav-list">${list}</div>
          <div class="modal__actions">
            <button class="btn btn--outline" data-close="true">Fechar</button>
          </div>
        </div>
      </div>
    `;
    this.bindClose();
    this.activate(this.root.querySelector('.modal'), 'fav-title');

    this.root.querySelectorAll('[data-fav-open]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = API_MOCK.products.find(p => p.id === Number(btn.dataset.favOpen));
        this.close();
        if (product) window.location.href = `pages/produto.html?id=${product.id}`;
      });
    });
    this.root.querySelectorAll('[data-fav-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevFocus = this.lastFocused;
        Favorites.toggle(btn.dataset.favRemove);
        this.openFavorites();
        this.lastFocused = prevFocus;
      });
    });
  },

  close() {
    if (this.root) this.root.innerHTML = '';
    document.body.classList.remove('modal-open');
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') this.lastFocused.focus();
    this.lastFocused = null;
  }
};
