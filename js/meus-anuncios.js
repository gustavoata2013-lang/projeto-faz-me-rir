document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('my-ads');
  const user = Auth.getUser();

  if (!user) {
    container.innerHTML = '<p style="color: var(--text-secondary);">Faça login para ver seus anúncios. <a href="minha-conta.html" style="color: var(--neon);">Entrar</a></p>';
    return;
  }

  function loadUserProducts() {
    return Utils.loadUserProducts();
  }

  function render() {
    const myProducts = loadUserProducts().filter(p => p.seller === user.username);

    if (!myProducts.length) {
      container.innerHTML = `
        <div class="cart-empty">
          <p style="font-size: 3rem;">🏷</p>
          <p style="color: var(--text-secondary); margin: 1rem 0;">Você ainda não publicou nenhum anúncio.</p>
          <a href="anunciar.html" class="btn btn--primary">Criar meu primeiro anúncio</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-list">
        ${myProducts.map(p => `
          <div class="cart-item">
            <div class="cart-item__icon">${p.icon}</div>
            <div class="cart-item__info">
              <h3>${Utils.escapeHtml(p.title)}</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">${Utils.formatCategory(p.category)} • Estoque: ${p.stock}</p>
            </div>
            <div class="cart-item__price">${Utils.formatPrice(p.price)}</div>
            <a href="produto.html?id=${p.id}" class="btn btn--outline">Ver</a>
            <button class="btn btn--outline" data-delete-ad="${p.id}">🗑 Excluir</button>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('[data-delete-ad]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.deleteAd);
        if (!window.confirm('Excluir este anúncio? Esta ação não pode ser desfeita.')) return;
        const remaining = loadUserProducts().filter(p => p.id !== id);
        localStorage.setItem('fmr-user-products', JSON.stringify(remaining));
        Toast.info('Anúncio excluído.');
        render();
      });
    });
  }

  render();
});
