const Cart = {
  KEY: 'fmr_cart',

  get() {
    try {
      const items = JSON.parse(localStorage.getItem(this.KEY)) || [];
      return items.map(i => ({
        ...i,
        qty: i.qty || 1,
        cartItemId: i.cartItemId || `${i.id}-default-${i.price}`
      }));
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
  },

  add(product, qty = 1, variantName = null) {
    const items = this.get();
    const cartItemId = `${product.id}-${variantName || 'default'}-${product.price}`;
    const existing = items.find(i => i.cartItemId === cartItemId);

    if (existing) {
      existing.qty = (existing.qty || 1) + qty;
      this.save(items);
      Toast.success('Quantidade atualizada no carrinho!');
      return;
    }

    items.push({
      id: product.id,
      cartItemId,
      title: product.title,
      price: product.price,
      icon: product.icon,
      seller: product.seller,
      qty,
      variantName
    });
    this.save(items);
    Toast.success('Adicionado ao carrinho!');
  },

  remove(cartItemId) {
    const items = this.get().filter(i => i.cartItemId !== cartItemId);
    this.save(items);
    Toast.info('Item removido do carrinho.');
  },

  clear() {
    this.save([]);
  },

  count() {
    return this.get().reduce((n, i) => n + (i.qty || 1), 0);
  },

  total() {
    return this.get().reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  },

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const n = this.count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }
};
