const Auth = {
  KEY: 'fmr_user',

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY));
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  login(username) {
    const user = { username, since: new Date().toISOString() };
    localStorage.setItem(this.KEY, JSON.stringify(user));
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: user }));
    return user;
  },

  logout() {
    localStorage.removeItem(this.KEY);
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: null }));
  }
};
