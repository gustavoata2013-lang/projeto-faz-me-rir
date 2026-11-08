# Faça Me Rir — Marketplace gamer (demonstração)

Marketplace estático de contas, skins, itens, moedas e serviços para jogos.
A interface simula um fluxo de **custódia (escrow)**, mas **pagamento e custódia
reais NÃO estão implementados**, e **não existe backend**: todos os dados são
mock (`js/api-mock.js`) ou vivem no `localStorage` do navegador.

## Stack

HTML5, CSS3 e JavaScript vanilla (módulos-objeto `const X = {...}`).
Sem build, sem bundler, sem dependências npm.

## Identidade visual

Estética **fintech** (não "gamer neon"): fundo `#0B0E14`, cards `#151B28`,
acento verde `#10B981` e azul `#3B82F6`, tipografia **Plus Jakarta Sans** e
**JetBrains Mono** para preços e métricas. Header com ícones SVG em linha.
Tema claro disponível via `data-theme="light"`.

## Como rodar

```bash
python -m http.server 8000
# http://localhost:8000
```

## Estrutura

```
index.html             home (catálogo, filtros, modais, carrinho)
style.css              estilos globais
script.js              bootstrap da home (filtros, cards, seções, roteamento de views)
js/
  account.js           página Minha conta
  anunciar.js          publicação de anúncio
  api-mock.js          dados simulados
  auth.js              sessão local (localStorage)
  cart-page.js         página do carrinho
  cart.js              carrinho (localStorage)
  filters.js           filtro/ordenação + render do grid
  meus-anuncios.js     listagem dos anúncios do usuário
  modal.js             modais (produto, checkout rápido, favoritos)
  product-page.js      página de produto
  theme.js             tema, badge do carrinho e busca nas páginas internas
  toast.js             notificações
  utils.js             helpers (preço, data, escape, favoritos)
pages/
  anunciar.html
  carrinho.html
  meus-anuncios.html
  minha-conta.html
  painel-vendedor.html
  produto.html
```

## O que funciona

- Busca (com autocomplete), filtros, ordenação, tema claro/escuro
- Cards, modal acessível (Esc, focus trap, `role="dialog"`), favoritos
- Carrinho persistente, login local, publicação de anúncio e listagem
  dos próprios anúncios, página de produto do usuário

## O que NÃO está implementado

- Backend, autenticação real, banco de dados
- **Pagamentos e custódia reais** — Pix e "Forma de pagamento" são apenas
  simulação visual
- Finalização de compra (o botão do carrinho apenas informa indisponibilidade)
- Sistema de pedidos, disputas, chat e upload de imagens

## Licença

MIT
