document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  render();

  document.addEventListener('cart:updated', render);

  function render() {
    const container = document.getElementById('cart-content');
    const items = Cart.get();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <p style="font-size: 3rem;">🛒</p>
          <p style="color: var(--text-secondary); margin: 1rem 0;">Seu carrinho está vazio.</p>
          <a href="../index.html" class="btn btn--primary">Explorar anúncios</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-list">
        ${items.map(i => `
          <div class="cart-item">
            <div class="cart-item__icon">${i.icon}</div>
            <div class="cart-item__info">
              <h3>${Utils.escapeHtml(i.title)}</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">${Utils.escapeHtml(i.seller)}${i.variantName ? ' · ' + Utils.escapeHtml(i.variantName) : ''} · Qtd: ${i.qty || 1}</p>
            </div>
            <div class="cart-item__price">${Utils.formatPrice(i.price * (i.qty || 1))}</div>
            <button class="btn btn--outline cart-item__remove" data-cart-id="${i.cartItemId}">Remover</button>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <div class="cart-summary__row">
          <span>Subtotal</span>
          <strong>${Utils.formatPrice(Cart.total())}</strong>
        </div>
        <div class="cart-summary__row">
          <span>Taxa de custódia</span>
          <strong style="color: var(--neon);">Grátis</strong>
        </div>
        <div class="cart-summary__row cart-summary__total">
          <span>Total</span>
          <strong>${Utils.formatPrice(Cart.total())}</strong>
        </div>
        <button class="btn btn--primary btn--lg" id="checkout-btn" style="width:100%;">Finalizar compra</button>
      </div>
    `;

    container.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => Cart.remove(btn.dataset.cartId));
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
      if (!Auth.isLoggedIn()) {
        Toast.warning('Faça login para finalizar a compra.');
        return;
      }
      const items = Cart.get();
      if (!items.length) return;
      const total = Cart.total();
      const seller = items.map(i => i.seller).filter((v, i, a) => a.indexOf(v) === i).join(', ');
      Modal.openConfirm(
        {
          title: items.length === 1 ? items[0].title : `${items.length} itens do carrinho`,
          seller,
          deliveryType: 'manual',
          deliveryTime: 'após pagamento',
          price: total,
          icon: '🛒',
          sellerVerified: true,
          sellerLevel: 'quartzo'
        },
        { variantName: null, qty: null, onSuccess: () => Cart.clear() }
      );
    });
  }
});
