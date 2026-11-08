// Dados simulados - preparado para futura integração com API REST
const API_MOCK = {
  categories: [
    { id: 'contas', name: 'Contas', icon: '👤', subcategories: ['Valorant', 'League of Legends', 'CS2', 'Fortnite', 'Genshin'] },
    { id: 'skins', name: 'Skins', icon: '🎨', subcategories: ['CS2', 'Valorant', 'LoL', 'Fortnite'] },
    { id: 'itens', name: 'Itens', icon: '📦', subcategories: ['Dota 2', 'Fortnite', 'LoL'] },
    { id: 'moedas', name: 'Moedas', icon: '🪙', subcategories: ['V-Bucks', 'RP', 'Apex Coins'] },
    { id: 'boosting', name: 'Boosting', icon: '🚀', subcategories: ['CS2', 'Valorant', 'LoL'] }
  ],

  products: [
    { id: 1, title: 'Conta Valorant Imortal 2 — 45 skins + BP completo', description: 'Conta com rank Imortal 2, 45 skins, battle pass completo. Email original incluso.', category: 'contas', subcategory: 'Valorant', price: 350, originalPrice: 420, seller: 'ProGamerBR', sellerVerified: true, sellerLevel: 'Diamante', sellerMemberSince: '2021', sellerOnline: true, rating: 5, reviewCount: 128, soldCount: 1420, icon: '🎯', images: ['🎯', '🖼️', '🎮', '🏆'], badges: ['verificado', 'auto-entrega'], deliveryType: 'auto', deliveryTime: '5 min', stock: 1, hot: true, variants: [{ name: 'Imortal 2', price: 350, stock: 1 }, { name: 'Imortal 3', price: 420, stock: 1 }, { name: 'Radiant', price: 680, stock: 1 }], questions: [{ user: 'GamerX', question: 'O email original está incluso mesmo?', answer: 'Sim, email original e senha são entregues.', date: '2024-11-12' }] },
    { id: 2, title: 'Skin AK-47 Neon Revolution — Factory New', description: 'Skin AK-47 Neon Revolution em estado Factory New. Entrega imediata via trade.', category: 'skins', subcategory: 'CS2', price: 120, originalPrice: 150, seller: 'SkinMaster', sellerVerified: true, sellerLevel: 'Ônix', sellerMemberSince: '2020', sellerOnline: true, rating: 4, reviewCount: 87, soldCount: 890, icon: '🔫', images: ['🔫', '🎨', '💥'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '2 min', stock: 5, hot: false, variants: [{ name: 'Factory New', price: 120, stock: 5 }, { name: 'Minimal Wear', price: 95, stock: 8 }, { name: 'Field Tested', price: 70, stock: 12 }], questions: [] },
    { id: 3, title: 'Conta LoL Diamante 4 — 120 campeões + 80 skins', description: 'Conta Diamante 4 com 120 campeões, 80 skins, todas as runas.', category: 'contas', subcategory: 'League of Legends', price: 480, originalPrice: 550, seller: 'LoLPro', sellerVerified: true, sellerLevel: 'Turquesa', sellerMemberSince: '2019', sellerOnline: false, rating: 5, reviewCount: 203, soldCount: 2100, icon: '⚔️', images: ['⚔️', '🛡️', '👑'], badges: ['verificado', 'em-promoção'], deliveryType: 'manual', deliveryTime: '10 min', stock: 1, hot: true, variants: [{ name: 'Diamante 4', price: 480, stock: 1 }, { name: 'Mestre', price: 720, stock: 1 }], questions: [{ user: 'LoLPlayer', question: 'Tem todas as skins de luxo?', answer: 'Sim, 80 skins incluindo várias de luxo.', date: '2024-11-08' }] },
    { id: 4, title: '1000 V-Bucks — Entrega Imediata', description: '1000 V-Bucks entregues via gift card. Código enviado por email.', category: 'moedas', subcategory: 'V-Bucks', price: 45, originalPrice: 50, seller: 'FortniteStore', sellerVerified: true, sellerLevel: 'Quartzo', sellerMemberSince: '2022', sellerOnline: true, rating: 4, reviewCount: 512, soldCount: 5400, icon: '💎', images: ['💎', '🎁', '🪙'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '1 min', stock: 100, hot: true, variants: [{ name: '1000 V-Bucks', price: 45, stock: 100 }, { name: '2800 V-Bucks', price: 110, stock: 50 }, { name: '5000 V-Bucks', price: 190, stock: 30 }], questions: [] },
    { id: 5, title: 'Boosting CS2 até Global Elite', description: 'Serviço de boosting do seu rank atual até Global Elite. Feito por jogadores profissionais.', category: 'boosting', subcategory: 'CS2', price: 250, originalPrice: 300, seller: 'BoostKing', sellerVerified: true, sellerLevel: 'Diamante', sellerMemberSince: '2020', sellerOnline: true, rating: 5, reviewCount: 64, soldCount: 320, icon: '🚀', images: ['🚀', '🏆', '🎯'], badges: ['verificado'], deliveryType: 'manual', deliveryTime: '7 dias', stock: 10, hot: false, variants: [{ name: 'Até MG', price: 150, stock: 10 }, { name: 'Até Global Elite', price: 250, stock: 10 }], questions: [] },
    { id: 6, title: 'Faca Karambit Doppler Phase 2 — FN', description: 'Karambit Doppler Phase 2 Factory New. Item raro e valorizado.', category: 'skins', subcategory: 'CS2', price: 890, originalPrice: 1100, seller: 'KnifeTrader', sellerVerified: true, sellerLevel: 'Ônix', sellerMemberSince: '2018', sellerOnline: true, rating: 5, reviewCount: 42, soldCount: 180, icon: '🗡️', images: ['🗡️', '💎', '✨'], badges: ['verificado', 'em-promoção'], deliveryType: 'manual', deliveryTime: '15 min', stock: 1, hot: true, variants: [{ name: 'Factory New', price: 890, stock: 1 }], questions: [] },
    { id: 7, title: 'Conta Genshin AR60 — 15 personagens 5★', description: 'AR60 com 15 personagens 5 estrelas, incluindo Raiden e Zhongli.', category: 'contas', subcategory: 'Genshin', price: 620, originalPrice: 700, seller: 'GenshinGod', sellerVerified: false, sellerLevel: 'Quartzo', sellerMemberSince: '2023', sellerOnline: false, rating: 4, reviewCount: 31, soldCount: 95, icon: '🌸', images: ['🌸', '⚡', '🌙'], badges: [], deliveryType: 'manual', deliveryTime: '30 min', stock: 1, hot: false, variants: [{ name: 'AR60', price: 620, stock: 1 }], questions: [] },
    { id: 8, title: 'Arcana Rara Dota 2 — Colecionável', description: 'Arcana rara do Dota 2. Item colecionável.', category: 'itens', subcategory: 'Dota 2', price: 75, originalPrice: 90, seller: 'DotaMaster', sellerVerified: false, sellerLevel: 'Quartzo', sellerMemberSince: '2023', sellerOnline: true, rating: 3, reviewCount: 18, soldCount: 60, icon: '🛡️', images: ['🛡️', '⚔️'], badges: [], deliveryType: 'manual', deliveryTime: '1 hora', stock: 3, hot: false, variants: [{ name: 'Arcana', price: 75, stock: 3 }], questions: [] },
    { id: 9, title: 'Conta Free Fire Elite Pass — 50 skins', description: 'Conta Elite Pass com 50 skins raras e diamantes.', category: 'contas', subcategory: 'Fortnite', price: 90, originalPrice: 120, seller: 'FFStore', sellerVerified: true, sellerLevel: 'Turquesa', sellerMemberSince: '2021', sellerOnline: true, rating: 4, reviewCount: 156, soldCount: 780, icon: '🔥', images: ['🔥', '💥', '🎮'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '5 min', stock: 2, hot: false, variants: [{ name: 'Elite Pass', price: 90, stock: 2 }], questions: [] },
    { id: 10, title: 'AWP Dragon Lore — Factory New', description: 'AWP Dragon Lore Factory New. A skin mais icônica do CS2.', category: 'skins', subcategory: 'CS2', price: 999, originalPrice: 1500, seller: 'CS2Legend', sellerVerified: true, sellerLevel: 'Ônix', sellerMemberSince: '2017', sellerOnline: true, rating: 5, reviewCount: 89, soldCount: 210, icon: '🐉', images: ['🐉', '🔥', '💎'], badges: ['verificado', 'em-promoção'], deliveryType: 'manual', deliveryTime: '20 min', stock: 1, hot: true, variants: [{ name: 'Factory New', price: 999, stock: 1 }], questions: [{ user: 'SniperPro', question: 'Tem float baixo?', answer: 'Sim, float 0.01.', date: '2024-11-15' }] },
    { id: 11, title: '5000 Riot Points — Código Imediato', description: '5000 Riot Points entregues via código. Resgate imediato.', category: 'moedas', subcategory: 'RP', price: 180, originalPrice: 200, seller: 'RiotShop', sellerVerified: true, sellerLevel: 'Diamante', sellerMemberSince: '2020', sellerOnline: true, rating: 4, reviewCount: 340, soldCount: 3200, icon: '💠', images: ['💠', '🪙', '🎁'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '1 min', stock: 50, hot: false, variants: [{ name: '5000 RP', price: 180, stock: 50 }, { name: '10000 RP', price: 340, stock: 25 }], questions: [] },
    { id: 12, title: 'Boosting Valorant até Radiant — Premium', description: 'Boosting até o rank Radiant. Serviço premium com garantia.', category: 'boosting', subcategory: 'Valorant', price: 750, originalPrice: 900, seller: 'RadiantBoost', sellerVerified: true, sellerLevel: 'Ônix', sellerMemberSince: '2019', sellerOnline: true, rating: 5, reviewCount: 27, soldCount: 140, icon: '⭐', images: ['⭐', '🚀', '🏆'], badges: ['verificado'], deliveryType: 'manual', deliveryTime: '14 dias', stock: 5, hot: true, variants: [{ name: 'Até Imortal', price: 450, stock: 5 }, { name: 'Até Radiant', price: 750, stock: 5 }], questions: [] },
    { id: 13, title: 'Conta Apex Predator — 20 lendas', description: 'Conta Apex Predator com 20 lendas desbloqueadas.', category: 'contas', subcategory: 'Valorant', price: 420, originalPrice: 500, seller: 'ApexPro', sellerVerified: false, sellerLevel: 'Quartzo', sellerMemberSince: '2023', sellerOnline: false, rating: 4, reviewCount: 45, soldCount: 130, icon: '🎮', images: ['🎮', '🏆'], badges: [], deliveryType: 'manual', deliveryTime: '1 hora', stock: 1, hot: false, variants: [{ name: 'Predator', price: 420, stock: 1 }], questions: [] },
    { id: 14, title: 'M4A4 Howl — Factory New (Descontinuada)', description: 'M4A4 Howl Factory New. Item descontinuado e raríssimo.', category: 'skins', subcategory: 'CS2', price: 650, originalPrice: 800, seller: 'HowlTrader', sellerVerified: true, sellerLevel: 'Ônix', sellerMemberSince: '2018', sellerOnline: true, rating: 5, reviewCount: 73, soldCount: 165, icon: '🐺', images: ['🐺', '🔥', '💎'], badges: ['verificado'], deliveryType: 'manual', deliveryTime: '10 min', stock: 1, hot: true, variants: [{ name: 'Factory New', price: 650, stock: 1 }], questions: [] },
    { id: 15, title: 'Item Mítico Fortnite — Colecionável', description: 'Item mítico raro do Fortnite. Colecionável.', category: 'itens', subcategory: 'Fortnite', price: 55, originalPrice: 70, seller: 'MythicStore', sellerVerified: false, sellerLevel: 'Quartzo', sellerMemberSince: '2023', sellerOnline: true, rating: 3, reviewCount: 22, soldCount: 75, icon: '🌟', images: ['🌟', '✨'], badges: [], deliveryType: 'manual', deliveryTime: '2 horas', stock: 4, hot: false, variants: [{ name: 'Mítico', price: 55, stock: 4 }], questions: [] },
    { id: 16, title: 'Conta Minecraft Java + Bedrock Full', description: 'Conta Minecraft Java + Bedrock com acesso completo.', category: 'contas', subcategory: 'Fortnite', price: 35, originalPrice: 45, seller: 'MCShop', sellerVerified: true, sellerLevel: 'Turquesa', sellerMemberSince: '2020', sellerOnline: true, rating: 4, reviewCount: 890, soldCount: 8900, icon: '⛏️', images: ['⛏️', '🧱', '🌍'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '1 min', stock: 20, hot: false, variants: [{ name: 'Java + Bedrock', price: 35, stock: 20 }], questions: [] },
    { id: 17, title: '2000 Apex Coins — Código Digital', description: '2000 Apex Coins entregues via código.', category: 'moedas', subcategory: 'Apex Coins', price: 95, originalPrice: 110, seller: 'ApexCoins', sellerVerified: true, sellerLevel: 'Diamante', sellerMemberSince: '2021', sellerOnline: true, rating: 4, reviewCount: 178, soldCount: 1900, icon: '🪙', images: ['🪙', '💠'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '1 min', stock: 30, hot: false, variants: [{ name: '2000 Coins', price: 95, stock: 30 }, { name: '4000 Coins', price: 180, stock: 15 }], questions: [] },
    { id: 18, title: 'Boosting LoL até Mestre — Garantido', description: 'Boosting até Mestre no League of Legends.', category: 'boosting', subcategory: 'LoL', price: 380, originalPrice: 450, seller: 'MasterBoost', sellerVerified: true, sellerLevel: 'Turquesa', sellerMemberSince: '2020', sellerOnline: true, rating: 5, reviewCount: 51, soldCount: 240, icon: '👑', images: ['👑', '🚀'], badges: ['verificado'], deliveryType: 'manual', deliveryTime: '10 dias', stock: 8, hot: false, variants: [{ name: 'Até Diamante', price: 220, stock: 8 }, { name: 'Até Mestre', price: 380, stock: 8 }], questions: [] },
    { id: 19, title: 'AWP Asiimov — Field Tested', description: 'AWP Asiimov Field Tested. Clássica e procurada.', category: 'skins', subcategory: 'CS2', price: 210, originalPrice: 260, seller: 'AWPKing', sellerVerified: true, sellerLevel: 'Diamante', sellerMemberSince: '2021', sellerOnline: true, rating: 4, reviewCount: 112, soldCount: 640, icon: '🎯', images: ['🎯', '🔫'], badges: ['auto-entrega'], deliveryType: 'auto', deliveryTime: '5 min', stock: 3, hot: false, variants: [{ name: 'Field Tested', price: 210, stock: 3 }, { name: 'Minimal Wear', price: 280, stock: 2 }], questions: [] },
    { id: 20, title: 'Conta Overwatch Grandmaster — Todas as skins', description: 'Conta Overwatch Grandmaster com todas as skins de temporada.', category: 'contas', subcategory: 'Valorant', price: 290, originalPrice: 350, seller: 'OWPro', sellerVerified: true, sellerLevel: 'Turquesa', sellerMemberSince: '2020', sellerOnline: false, rating: 5, reviewCount: 67, soldCount: 310, icon: '🦾', images: ['🦾', '🏆'], badges: ['verificado'], deliveryType: 'manual', deliveryTime: '30 min', stock: 1, hot: false, variants: [{ name: 'Grandmaster', price: 290, stock: 1 }], questions: [] }
  ],

  reviews: [
    { productId: 1, user: 'CompradorAnônimo', rating: 5, comment: 'Entrega super rápida, conta exatamente como descrito!', date: '2024-11-15' },
    { productId: 1, user: 'GamerX', rating: 5, comment: 'Vendedor confiável, recomendo!', date: '2024-11-10' },
    { productId: 4, user: 'FortniteFan', rating: 4, comment: 'Código chegou em 2 minutos. Bom.', date: '2024-11-20' },
    { productId: 10, user: 'CS2Player', rating: 5, comment: 'Skin linda, entrega impecável.', date: '2024-11-18' }
  ],

  // Top 10 em alta (IDs ordenados por popularidade)
  trending: [10, 1, 6, 4, 14, 3, 12, 2, 11, 5],

  // Histórico de navegação simulado do utilizador
  history: [1, 4, 10, 6, 2, 12],

  // Sugestões de autocomplete para a busca
  autocompleteSuggestions: [
    'Conta Valorant', 'Conta LoL', 'Conta CS2', 'Conta Genshin',
    'Skin AK-47', 'Skin AWP', 'Karambit', 'Dragon Lore',
    'V-Bucks', 'Riot Points', 'Apex Coins',
    'Boosting Valorant', 'Boosting CS2', 'Boosting LoL',
    'Conta Fortnite', 'Conta Minecraft', 'Conta Apex'
  ],

  // Categorias de capas verticais (biblioteca de jogos)
  gameCovers: [
    { id: 'cs2', name: 'CS2', icon: '🔫', color: '#f19304', count: 1240 },
    { id: 'valorant', name: 'Valorant', icon: '🎯', color: '#d91e18', count: 980 },
    { id: 'lol', name: 'League of Legends', icon: '⚔️', color: '#007bff', count: 1560 },
    { id: 'fortnite', name: 'Fortnite', icon: '🔥', color: '#39b54a', count: 870 },
    { id: 'genshin', name: 'Genshin', icon: '🌸', color: '#b47dff', count: 640 },
    { id: 'dota2', name: 'Dota 2', icon: '🛡️', color: '#d91e18', count: 520 },
    { id: 'apex', name: 'Apex Legends', icon: '🦾', color: '#f19304', count: 410 },
    { id: 'minecraft', name: 'Minecraft', icon: '⛏️', color: '#39b54a', count: 730 }
  ],

  // Serviços (categorias de serviços)
  services: [
    { id: 'boosting', name: 'Boosting', icon: '🚀', desc: 'Suba de rank com profissionais' },
    { id: 'coaching', name: 'Coaching', icon: '🎓', desc: 'Aulas com jogadores pro' },
    { id: 'giftcards', name: 'Gift Cards', icon: '🎁', desc: 'Códigos digitais instantâneos' },
    { id: 'topup', name: 'Recarga', icon: '💳', desc: 'Recarregue moedas do jogo' }
  ],

  // Combos pré-montados
  combos: [
    {
      id: 'combo-starter',
      name: 'Starter Gamer',
      description: 'Conta + 1000 V-Bucks para começar com tudo',
      items: [4, 16],
      discount: 10,
      icon: '🎁'
    },
    {
      id: 'combo-cs2',
      name: 'Pack CS2 Elite',
      description: 'Skin AK-47 + AWP Asiimov',
      items: [2, 19],
      discount: 15,
      icon: '🔫'
    },
    {
      id: 'combo-boost',
      name: 'Boost Total',
      description: 'Boosting Valorant + Conta Imortal',
      items: [1, 12],
      discount: 12,
      icon: '🚀'
    }
  ],

  // Regras de desconto progressivo para o widget "Monte seu Combo"
  comboRules: [
    { minItems: 2, discount: 5 },
    { minItems: 3, discount: 12 },
    { minItems: 4, discount: 18 },
    { minItems: 5, discount: 25 }
  ],

  // Reviews verificadas para o marquee
  verifiedReviews: [
    { user: 'Lucas M.', rating: 5, comment: 'Entrega em 3 minutos, conta perfeita!', game: 'Valorant' },
    { user: 'Pedro S.', rating: 5, comment: 'Melhor marketplace, custódia salvou minha compra.', game: 'CS2' },
    { user: 'Ana R.', rating: 5, comment: 'Vendedor super atencioso, recomendo demais.', game: 'LoL' },
    { user: 'Rafael T.', rating: 4, comment: 'Tudo certo, só demorou um pouco a entrega.', game: 'Fortnite' },
    { user: 'Julia C.', rating: 5, comment: 'Já é minha 5ª compra aqui, nunca tive problema.', game: 'Genshin' },
    { user: 'Bruno L.', rating: 5, comment: 'Skin linda, float baixo como prometido.', game: 'CS2' },
    { user: 'Marina F.', rating: 5, comment: 'Boosting rápido e discreto, nota 10.', game: 'Valorant' },
    { user: 'Diego P.', rating: 5, comment: 'Suporte respondeu em minutos, resolvido!', game: 'LoL' }
  ],

  // Ofertas do dia (com timestamp de expiração)
  dailyDeals: {
    endsAt: Date.now() + 1000 * 60 * 60 * 8, // 8 horas
    productIds: [4, 10, 14, 6]
  },

  // Níveis de vendedor com ícones de pedra preciosa
  sellerLevels: {
    quartzo: { label: 'Quartzo', icon: '💠', color: '#c0c0c8' },
    turquesa: { label: 'Turquesa', icon: '🔷', color: '#00d4e8' },
    diamante: { label: 'Diamante', icon: '💎', color: '#4da3ff' },
    onix: { label: 'Ônix', icon: '🖤', color: '#b47dff' }
  },

  // Métricas globais para prova social
  metrics: {
    totalTransactions: 1520000,
    totalOrders: 25400,
    satisfaction: 99.8,
    activeSellers: 3200,
    onlineNow: 847
  },

  // Prateleiras (swimlanes) por nicho
  swimlanes: [
    { id: 'cs2', title: '🔥 CS2 em destaque', filter: p => p.subcategory === 'CS2' },
    { id: 'valorant', title: '🎯 Valorant', filter: p => p.subcategory === 'Valorant' },
    { id: 'lol', title: '⚔️ League of Legends', filter: p => p.subcategory === 'League of Legends' },
    { id: 'moedas', title: '🪙 Moedas & Gift Cards', filter: p => p.category === 'moedas' },
    { id: 'boosting', title: '🚀 Serviços de Boosting', filter: p => p.category === 'boosting' }
  ],

  // Gera avaliações determinísticas quando o produto tem reviewCount > 0
  // mas não possui entradas reais em API_MOCK.reviews
  getReviews(product) {
    const real = (this.reviews || []).filter(r => r.productId === product.id);
    if (real.length) return real;
    if (!product.reviewCount) return [];

    const names = ['CompradorAnônimo', 'GamerX', 'PlayerBR', 'Lucas M.', 'Ana R.', 'Bruno L.', 'Pedro S.', 'Julia C.'];
    const comments = {
      5: ['Entrega rápida e produto exatamente como descrito.', 'Vendedor confiável, recomendo!', 'Tudo perfeito, superou as expectativas.'],
      4: ['Bom produto, entrega dentro do prazo.', 'Tudo certo, só demorou um pouco.'],
      3: ['Produto ok, atendimento razoável.', 'Cumpriu o combinado, nada além disso.'],
      2: ['Demorou mais que o previsto, mas chegou.'],
      1: ['Tive problemas, mas o suporte resolveu.']
    };

    const base = Math.max(1, Math.min(5, Math.round(product.rating)));
    const count = Math.min(5, Math.max(1, product.reviewCount));
    const out = [];

    for (let i = 0; i < count; i++) {
      const seed = product.id * 7 + i * 13;
      let rating = base;
      if (i % 4 === 3 && rating > 1) rating -= 1;
      const pool = comments[rating];
      out.push({
        productId: product.id,
        user: names[seed % names.length],
        rating,
        comment: pool[seed % pool.length],
        date: `2024-11-${String(1 + (seed % 28)).padStart(2, '0')}`
      });
    }
    return out;
  }
};
