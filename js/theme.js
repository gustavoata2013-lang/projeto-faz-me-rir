const ThemeToggle = {
  icons: {
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  },
  init() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const saved = document.documentElement.getAttribute('data-theme') || 'dark';
    btn.innerHTML = saved === 'light' ? this.icons.sun : this.icons.moon;
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('fmr-theme', next);
      btn.innerHTML = next === 'light' ? this.icons.sun : this.icons.moon;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeToggle.init();
  if (typeof Cart !== 'undefined') Cart.updateBadge();

  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');
  if (!input) return;
  const go = () => {
    const q = (input.value || '').trim();
    window.location.href = '../index.html' + (q ? '?busca=' + encodeURIComponent(q) : '');
  };
  if (btn) btn.addEventListener('click', go);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
});
