document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('form-category');
  const gameSelect = document.getElementById('form-subcategory');
  const variantList = document.getElementById('variant-list');
  const form = document.getElementById('ad-form');

  // Tipo de produto (categorias do catálogo)
  API_MOCK.categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    typeSelect.appendChild(opt);
  });

  // Jogos/categorias configurados no Painel Admin (SiteConfig.categories)
  const fillGames = () => {
    const games = SiteConfig.get().categories || [];
    gameSelect.innerHTML = '';
    games.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.name;
      opt.textContent = `${g.icon} ${g.name}`;
      gameSelect.appendChild(opt);
    });
  };
  fillGames();
  document.addEventListener('siteconfig:updated', fillGames);

  // Variantes dinâmicas (opcional)
  const addVariant = (name = '', price = '') => {
    const row = document.createElement('div');
    row.className = 'variant-row';
    row.innerHTML = `
      <input class="form__input" type="text" data-vname placeholder="Nome da opção (ex: Com Skins)" value="${Utils.escapeHtml(name)}">
      <input class="form__input" type="number" data-vprice min="0" step="0.01" placeholder="Preço (R$)" value="${Utils.escapeHtml(price)}">
      <button type="button" class="btn btn--outline variant-remove" aria-label="Remover opção">✕</button>
    `;
    variantList.appendChild(row);
    row.querySelector('.variant-remove').addEventListener('click', () => row.remove());
  };

  document.getElementById('variant-add').addEventListener('click', () => addVariant());

  form.addEventListener('submit', e => {
    e.preventDefault();
    const user = Auth.getUser();

    const title = form.elements['title'].value.trim();
    const description = form.elements['description'].value.trim();
    const price = parseFloat(form.elements['price'].value) || 0;
    const stock = parseInt(form.elements['stock'].value, 10) || 0;
    const category = form.elements['category'].value;
    const subcategory = form.elements['subcategory'].value;
    const deliveryTime = form.elements['deliveryTime'].value.trim() || '5 min';
    const deliveryType = form.elements['autoDelivery'].checked ? 'auto' : 'manual';

    if (title.length < 5) { Toast.error('O título deve ter pelo menos 5 caracteres.'); return; }
    if (!description) { Toast.error('Informe uma descrição para o anúncio.'); return; }
    if (!(price > 0)) { Toast.error('O preço deve ser maior que zero.'); return; }
    if (!(stock >= 1)) { Toast.error('O estoque deve ser de pelo menos 1 unidade.'); return; }
    if (!subcategory) { Toast.error('Escolha o jogo/categoria do anúncio.'); return; }

    // Variantes do formulário
    const variants = [];
    variantList.querySelectorAll('.variant-row').forEach(row => {
      const name = row.querySelector('[data-vname]').value.trim();
      const vPrice = parseFloat(row.querySelector('[data-vprice]').value);
      if (name && !isNaN(vPrice) && vPrice >= 0) {
        variants.push({ name, price: vPrice, stock });
      }
    });
    if (!variants.length) variants.push({ name: 'Padrão', price, stock });

    const game = (SiteConfig.get().categories || []).find(g => g.name === subcategory);
    const icon = (game && game.icon) || '🛒';
    const sellerName = user ? user.username : 'Você';

    const newAd = {
      id: Date.now(),
      title,
      description,
      category,
      subcategory,
      price,
      originalPrice: null,
      stock,
      deliveryType,
      deliveryTime,
      icon,
      images: [icon],
      seller: sellerName,
      sellerVerified: false,
      sellerLevel: 'quartzo',
      sellerOnline: true,
      sellerMemberSince: new Date().getFullYear().toString(),
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      hot: false,
      variants,
      questions: []
    };

    let stored = [];
    try { stored = JSON.parse(localStorage.getItem('fmr-user-products')) || []; } catch { stored = []; }
    stored.push(newAd);
    localStorage.setItem('fmr-user-products', JSON.stringify(stored));

    Toast.show('Anúncio publicado! Redirecionando para a home...', 'success');
    setTimeout(() => { window.location.href = '../index.html#anuncios'; }, 1200);
  });
});

