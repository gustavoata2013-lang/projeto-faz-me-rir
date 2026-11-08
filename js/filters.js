const Filters = {
  state: {
    search: '',
    category: '',
    subcategory: '',
    price: '',
    rating: '',
    deliveryType: '',
    hotOnly: false,
    verifiedSellersOnly: false,
    sort: ''
  },

  apply(products) {
    return products.filter(p => {
      if (this.state.search) {
        const q = this.state.search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.seller.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (this.state.category && p.category !== this.state.category) return false;
      if (this.state.subcategory && p.subcategory !== this.state.subcategory) return false;
      if (this.state.price) {
        const parts = this.state.price.split('-').map(Number);
        const [min, max] = parts.length === 2 ? parts : [parts[0], 999999];
        if (p.price < min || p.price > max) return false;
      }
      if (this.state.rating && p.rating < Number(this.state.rating)) return false;
      if (this.state.deliveryType && p.deliveryType !== this.state.deliveryType) return false;
      if (this.state.hotOnly && !p.hot) return false;
      if (this.state.verifiedSellersOnly && !p.sellerVerified) return false;
      return true;
    });
  },

  sort(products) {
    const list = [...products];
    switch (this.state.sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'hot': return list.sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0));
      case 'sold': return list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      default: return list;
    }
  },

  render(products, container) {
    const filtered = this.sort(this.apply(products));
    if (filtered.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum anúncio encontrado.</p>';
      return;
    }
    container.innerHTML = filtered.map((p, i) => Card.build(p, { delay: i * 40, base: 'pages/' })).join('');
  }
};
