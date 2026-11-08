document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('admin-content');

  const loadState = () => {
    const cfg = SiteConfig.get();
    return {
      banners: (cfg.banners || []).map(b => ({ ...b })),
      categories: (cfg.categories || []).map(c => ({ ...c })),
      footer: {
        email: cfg.footer.email,
        copyright: cfg.footer.copyright,
        columns: (cfg.footer.columns || []).map(col => ({
          title: col.title,
          links: (col.links || []).map(l => ({ ...l }))
        }))
      },
      pix: { code: cfg.pix.code },
      social: (cfg.social || []).map(s => ({ ...s }))
    };
  };

  let state = loadState();

  const slug = (name) => name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const esc = (v) => Utils.escapeHtml(v || '');

  const setByPath = (obj, path, value) => {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in cur)) cur[part] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      cur = cur[part];
    }
    cur[parts[parts.length - 1]] = value;
  };

  // Mantém o estado sincronizado com qualquer input digitado
  content.addEventListener('input', (e) => {
    if (e.target.dataset && e.target.dataset.field) {
      setByPath(state, e.target.dataset.field, e.target.value);
    }
  });

  // ===== Abas =====
  document.getElementById('admin-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('#admin-tabs .tab').forEach(t => {
      const active = t === tab;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', String(active));
    });
    render(tab.dataset.tab);
  });

  const render = (tab) => {
    if (tab === 'banners') renderBanners();
    else if (tab === 'categorias') renderCategories();
    else renderGeneral();
  };

  const bindRemove = (key, rerender) => {
    content.querySelectorAll('.admin-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        state[key].splice(Number(btn.dataset.remove), 1);
        rerender();
      });
    });
  };

  // ===== Banners =====
  const renderBanners = () => {
    content.innerHTML = `
      <div class="admin-list">
        ${state.banners.map((b, i) => `
          <div class="admin-item">
            <div class="admin-item__head">
              <strong>Banner ${i + 1}</strong>
              <button class="btn btn--outline admin-remove" data-remove="${i}">✕ Remover</button>
            </div>
            <label class="form__label">URL da imagem
              <input class="form__input" data-field="banners.${i}.image" value="${esc(b.image)}" placeholder="https://exemplo.com/banner.jpg">
            </label>
            <label class="form__label">Título
              <input class="form__input" data-field="banners.${i}.title" value="${esc(b.title)}" placeholder="Título do banner">
            </label>
            <label class="form__label">Link de redirecionamento
              <input class="form__input" data-field="banners.${i}.link" value="${esc(b.link)}" placeholder="#anuncios">
            </label>
          </div>
        `).join('')}
      </div>
      <button class="btn btn--outline" id="banner-add">+ Adicionar banner</button>
    `;
    bindRemove('banners', renderBanners);
    document.getElementById('banner-add').addEventListener('click', () => {
      state.banners.push({ image: '', title: '', link: '#' });
      renderBanners();
    });
  };

  // ===== Categorias =====
  const renderCategories = () => {
    content.innerHTML = `
      <div class="admin-list">
        ${state.categories.map((c, i) => `
          <div class="admin-item">
            <div class="admin-item__head">
              <strong>Categoria ${i + 1}</strong>
              <button class="btn btn--outline admin-remove" data-remove="${i}">✕ Remover</button>
            </div>
            <div class="admin-item__row">
              <label class="form__label form__label--sm">Ícone
                <input class="form__input form__input--sm" data-field="categories.${i}.icon" value="${esc(c.icon)}" placeholder="🎮">
              </label>
              <label class="form__label">Nome do jogo
                <input class="form__input" data-field="categories.${i}.name" value="${esc(c.name)}" placeholder="Ex: Valorant">
              </label>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn--outline" id="category-add">+ Adicionar categoria</button>
    `;
    bindRemove('categories', renderCategories);
    document.getElementById('category-add').addEventListener('click', () => {
      state.categories.push({ id: 'novo-' + Date.now(), name: '', icon: '🎮' });
      renderCategories();
    });
  };

  // ===== Geral & Rodapé =====
  const renderGeneral = () => {
    content.innerHTML = `
      <div class="admin-item">
        <strong>Informações institucionais</strong>
        <label class="form__label">E-mail de suporte
          <input class="form__input" data-field="footer.email" value="${esc(state.footer.email)}" placeholder="suporte@seusite.com">
        </label>
        <label class="form__label">Texto de copyright
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Placeholders disponíveis: {year} e {email}</span>
          <input class="form__input" data-field="footer.copyright" value="${esc(state.footer.copyright)}">
        </label>
      </div>
      <div class="admin-item">
        <strong>Pagamento PIX</strong>
        <label class="form__label">Chave Pix do Mercado Pago
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Cole o código "copia e cola" (EMV) gerado pelo Mercado Pago. Ele será usado no checkout e no QR Code.</span>
          <textarea class="form__input" data-field="pix.code" rows="3">${esc(state.pix.code)}</textarea>
        </label>
      </div>
      <div class="admin-item">
        <strong>Redes sociais</strong>
        ${state.social.map((s, i) => `
          <div class="admin-item__row">
            <label class="form__label">Nome
              <input class="form__input" data-field="social.${i}.label" value="${esc(s.label)}">
            </label>
            <label class="form__label">Link
              <input class="form__input" data-field="social.${i}.href" value="${esc(s.href)}" placeholder="https://...">
            </label>
          </div>
        `).join('')}
      </div>
      ${state.footer.columns.map((col, ci) => `
        <div class="admin-item">
          <div class="admin-item__head">
            <strong>Coluna ${ci + 1} do rodapé</strong>
          </div>
          <label class="form__label">Título da coluna
            <input class="form__input" data-field="footer.columns.${ci}.title" value="${esc(col.title)}">
          </label>
          <div class="admin-list">
            ${col.links.map((l, li) => `
              <div class="admin-item__row">
                <label class="form__label">Texto
                  <input class="form__input" data-field="footer.columns.${ci}.links.${li}.label" value="${esc(l.label)}">
                </label>
                <label class="form__label">Link
                  <input class="form__input" data-field="footer.columns.${ci}.links.${li}.href" value="${esc(l.href)}" placeholder="#">
                </label>
                <button class="btn btn--outline admin-remove-link" data-col="${ci}" data-link="${li}" aria-label="Remover link">✕</button>
              </div>
            `).join('')}
          </div>
          <button class="btn btn--outline" data-add-link="${ci}">+ Adicionar link</button>
        </div>
      `).join('')}
    `;

    content.querySelectorAll('[data-add-link]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.footer.columns[Number(btn.dataset.addLink)].links.push({ label: '', href: '#' });
        renderGeneral();
      });
    });
    content.querySelectorAll('.admin-remove-link').forEach(btn => {
      btn.addEventListener('click', () => {
        state.footer.columns[Number(btn.dataset.col)].links.splice(Number(btn.dataset.link), 1);
        renderGeneral();
      });
    });
  };

  // ===== Salvar / Restaurar =====
  document.getElementById('admin-save').addEventListener('click', () => {
    const data = {
      banners: state.banners
        .map(b => ({ image: b.image || '', title: b.title || '', link: b.link || '#' }))
        .filter(b => b.image || b.title),
      categories: state.categories
        .filter(c => String(c.name || '').trim())
        .map(c => ({
          id: c.id && !String(c.id).startsWith('novo-') ? c.id : slug(c.name) || 'cat-' + Date.now(),
          name: String(c.name).trim(),
          icon: c.icon || '🎮'
        })),
      footer: {
        email: state.footer.email,
        copyright: state.footer.copyright,
        columns: state.footer.columns.map(col => ({
          title: col.title,
          links: col.links
            .filter(l => String(l.label || '').trim())
            .map(l => ({ label: String(l.label).trim(), href: l.href || '#' }))
        }))
      },
      social: state.social.map(s => ({ label: s.label || s.icon, href: s.href || '#', icon: s.icon })),
      pix: { code: state.pix ? String(state.pix.code || '') : '' }
    };
    SiteConfig.save(data);
    state = loadState();
    Toast.show('Alterações salvas e refletidas em todas as páginas!', 'success');
  });

  document.getElementById('admin-reset').addEventListener('click', () => {
    SiteConfig.reset();
    state = loadState();
    const active = document.querySelector('#admin-tabs .tab--active');
    render(active ? active.dataset.tab : 'banners');
    Toast.show('Configurações restauradas para os padrões.', 'info');
  });

  render('banners');
});
