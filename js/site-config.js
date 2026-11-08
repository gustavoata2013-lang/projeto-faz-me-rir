// Configuração central do site: todo conteúdo editável pelo Painel Admin
// vive aqui (defaults) ou no localStorage (override salvo pelo admin).
const SiteConfig = {
  KEY: 'fmr_site_config',

  DEFAULTS: {
    footer: {
      email: 'suporte@facamerir.com',
      copyright: '© 2024–{year} Faça Me Rir Marketplace. Todos os direitos reservados. Support: {email}',
      columns: [
        {
          title: 'Para Parceiros',
          links: [
            { label: 'Seja um Vendedor', href: '__anunciar__' },
            { label: 'Programa de Afiliados', href: '#' },
            { label: 'Regras para Vendedores', href: '#' }
          ]
        },
        {
          title: 'Para Compradores',
          links: [
            { label: 'Perguntas Frequentes (FAQ)', href: '#' },
            { label: 'Política de Reembolso', href: '#' },
            { label: 'Como Comprar com Segurança', href: '__comoFunciona__' }
          ]
        },
        {
          title: 'Suporte & Contato',
          links: [
            { label: 'Central de Ajuda', href: '#' },
            { label: 'Avaliações da Plataforma', href: '#' },
            { label: 'Termos de Uso', href: '#' },
            { label: 'Política de Privacidade', href: '#' }
          ]
        }
      ]
    },
    social: [
      { label: 'Discord', href: '#', icon: 'discord' },
      { label: 'Telegram', href: '#', icon: 'telegram' },
      { label: 'X', href: '#', icon: 'x' },
      { label: 'Instagram', href: '#', icon: 'instagram' }
    ],
    categories: [
      { id: 'cs2', name: 'CS2', icon: '🔫' },
      { id: 'valorant', name: 'Valorant', icon: '🎯' },
      { id: 'lol', name: 'League of Legends', icon: '⚔️' },
      { id: 'fortnite', name: 'Fortnite', icon: '🔥' },
      { id: 'genshin', name: 'Genshin', icon: '🌸' },
      { id: 'dota2', name: 'Dota 2', icon: '🛡️' },
      { id: 'apex', name: 'Apex Legends', icon: '🦾' },
      { id: 'minecraft', name: 'Minecraft', icon: '⛏️' }
    ],
    banners: [
      {
        image: 'https://picsum.photos/seed/fmr1/1200/300',
        title: 'Anúncios em destaque',
        link: '#anuncios'
      }
    ],
    pix: {
      code: '00020126580014BR.GOV.BCB.PIX0136faca-me-rir-demo5204000053039865802BR5913FACA ME RIR6009SAO PAULO62070503***6304ABCD'
    }
  },

  get() {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { stored = {}; }
    return {
      footer: stored.footer || this.DEFAULTS.footer,
      social: stored.social || this.DEFAULTS.social,
      categories: stored.categories || this.DEFAULTS.categories,
      banners: stored.banners || this.DEFAULTS.banners,
      pix: stored.pix || this.DEFAULTS.pix
    };
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent('siteconfig:updated'));
  },

  reset() {
    localStorage.removeItem(this.KEY);
    document.dispatchEvent(new CustomEvent('siteconfig:updated'));
  }
};

// Sincroniza entre abas: quando outra aba salva, esta também atualiza
window.addEventListener('storage', (e) => {
  if (e.key === SiteConfig.KEY) {
    document.dispatchEvent(new CustomEvent('siteconfig:updated'));
  }
});
