// Perfis de vendedores (nome de exibição, avatar e biografia) gerenciados
// pelo Painel do Vendedor e exibidos na página pública pages/vendedor.html.
const SellerStore = {
  KEY: 'fmr_seller_profiles',

  all() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { return {}; }
  },

  get(name) {
    const profiles = this.all();
    return profiles[name] || { displayName: name, avatar: '', bio: '' };
  },

  save(name, data) {
    const profiles = this.all();
    profiles[name] = {
      displayName: String(data.displayName || name).trim(),
      avatar: String(data.avatar || '').trim(),
      bio: String(data.bio || '').trim()
    };
    localStorage.setItem(this.KEY, JSON.stringify(profiles));
  }
};
