document.addEventListener('DOMContentLoaded', () => {
  render();

  function render() {
    const container = document.getElementById('account-content');
    const user = Auth.getUser();

    if (!user) {
      container.innerHTML = `
        <div class="form">
          <h2 style="margin-bottom: 0.5rem;">Entrar</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Informe um nome de usuário para acessar sua conta.</p>
          <label class="form__label">Nome de usuário
            <input class="form__input" id="login-name" placeholder="Ex: GamerBR" required>
          </label>
          <button class="btn btn--primary" id="login-btn">Entrar</button>
        </div>
      `;
      document.getElementById('login-btn').addEventListener('click', () => {
        const name = document.getElementById('login-name').value.trim();
        if (!name) { Toast.error('Informe um nome.'); return; }
        Auth.login(name);
        Toast.success(`Bem-vindo, ${name}!`);
        render();
      });
      return;
    }

    container.innerHTML = `
      <div class="account-card">
        <div class="account-card__avatar">👤</div>
        <div>
          <h2>${Utils.escapeHtml(user.username)}</h2>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">Membro desde ${Utils.formatDate(user.since)}</p>
        </div>
      </div>
      <div class="account-links">
        <a href="meus-anuncios.html" class="account-link">📋 Meus anúncios</a>
        <a href="painel-vendedor.html" class="account-link">📊 Painel do vendedor</a>
        <a href="carrinho.html" class="account-link">🛒 Meu carrinho</a>
      </div>
      <button class="btn btn--outline" id="logout-btn" style="margin-top: 1.5rem;">Sair</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      Auth.logout();
      Toast.info('Você saiu da conta.');
      render();
    });
  }
});
