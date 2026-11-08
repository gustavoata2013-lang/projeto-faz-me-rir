document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.getUser();
  if (!user) {
    Toast.warning('Faça login para acessar o painel do vendedor.');
    window.location.href = '../index.html';
    return;
  }

  // Estatísticas da loja (dados locais)
  const mine = Utils.loadUserProducts().filter(p => p.seller === user.username);
  const total = mine.reduce((s, p) => s + (Number(p.price) || 0), 0);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  if (mine.length) {
    set('seller-ads', mine.length);
    set('seller-total', Utils.formatPrice(total));
    set('seller-avg', Utils.formatPrice(total / mine.length));
  }

  // Link para o perfil público
  const link = document.getElementById('public-profile-link');
  if (link) link.href = 'vendedor.html?id=' + encodeURIComponent(user.username);

  // Formulário do perfil público
  const profile = SellerStore.get(user.username);
  const form = document.getElementById('seller-profile-form');
  if (!form) return;
  form.querySelector('[name="displayName"]').value = profile.displayName || '';
  form.querySelector('[name="avatar"]').value = profile.avatar || '';
  form.querySelector('[name="bio"]').value = profile.bio || '';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    SellerStore.save(user.username, {
      displayName: form.displayName.value || user.username,
      avatar: form.avatar.value,
      bio: form.bio.value
    });
    Toast.show('Perfil atualizado com sucesso!', 'success');
  });
});
