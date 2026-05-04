/**
 * Auth Class
 * Manages user authentication UI and coordinates with ApiService.
 */
export class Auth {
  /**
   * Initialize Auth class
   * @param {ApiService} api - Reference to the ApiService instance
   */
  constructor(api) {
    this.api = api;
    this.authScreen = document.getElementById('auth-screen');
    this.appEl = document.getElementById('app');
    this.tabs = document.querySelectorAll('.auth-tab');
    this.loginForm = document.getElementById('login-form');
    this.registerForm = document.getElementById('register-form');
    this.loginError = document.getElementById('login-error');
    this.registerError = document.getElementById('register-error');

    this.init();
  }

  /**
   * Attach event listeners and check session on load
   */
  init() {
    this.tabs.forEach(tab => tab.addEventListener('click', () => this.switchTab(tab.dataset.tab)));
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    
    // Listen for logout event
    document.addEventListener('auth:request_logout', () => this.logout());

    // Don't auto-login, always show auth screen
    this.showAuthScreen();
  }

  /**
   * Switch between login and register tabs
   * @param {string} tab - The tab to switch to ('login' or 'register')
   */
  switchTab(tab) {
    this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    this.loginForm.classList.toggle('active', tab === 'login');
    this.registerForm.classList.toggle('active', tab === 'register');
    this.loginError.classList.add('hidden');
    this.registerError.classList.add('hidden');
  }

  /**
   * Handle login form submission
   * @param {Event} e - Submit event
   */
  async handleLogin(e) {
    e.preventDefault();
    this.loginError.classList.add('hidden');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    try {
      const { user } = await this.api.login(email, password);
      document.dispatchEvent(new CustomEvent('auth:success', { detail: { user } }));
      this.hideAuthScreen();
    } catch (err) {
      this.loginError.textContent = err.message;
      this.loginError.classList.remove('hidden');
    }
  }

  /**
   * Handle register form submission
   * @param {Event} e - Submit event
   */
  async handleRegister(e) {
    e.preventDefault();
    this.registerError.classList.add('hidden');
    
    const fields = {
      username: document.getElementById('reg-username').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      major: document.getElementById('reg-major').value,
      year: parseInt(document.getElementById('reg-year').value, 10),
      gpa: parseFloat(document.getElementById('reg-gpa').value),
    };

    if (!fields.username || !fields.email || !fields.password || !fields.major || !fields.year || isNaN(fields.gpa)) {
      this.registerError.textContent = 'All fields are required and GPA must be a number.';
      this.registerError.classList.remove('hidden');
      return;
    }

    try {
      const { user } = await this.api.register(fields);
      document.dispatchEvent(new CustomEvent('auth:success', { detail: { user } }));
      this.hideAuthScreen();
    } catch (err) {
      this.registerError.textContent = err.message;
      this.registerError.classList.remove('hidden');
    }
  }

  /**
   * Check if a user is currently logged in on page load
   */
  async checkSession() {
    try {
      const { user } = await this.api.me();
      document.dispatchEvent(new CustomEvent('auth:success', { detail: { user } }));
      this.hideAuthScreen();
    } catch {
      this.showAuthScreen();
    }
  }

  /**
   * Hide the auth screen and trigger app UI
   */
  hideAuthScreen() {
    this.authScreen.classList.add('hidden');
    this.appEl.classList.remove('hidden');
  }

  /**
   * Show the auth screen and hide app UI
   */
  showAuthScreen() {
    this.authScreen.classList.remove('hidden');
    this.appEl.classList.add('hidden');
  }

  /**
   * Logout user and return to auth screen
   */
  logout() {
    this.api.logout().finally(() => {
      this.showAuthScreen();
      document.dispatchEvent(new CustomEvent('auth:logged_out'));
    });
  }
}
