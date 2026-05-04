import { ApiService } from './api.js';
import { Auth } from './auth.js';
import { Recommend } from './recommend.js';

/**
 * Main App Class
 * Orchestrates the overall UI logic, sidebar navigation, and connects modules using CustomEvents.
 */
class App {
  /**
   * Initialize application and sub-modules
   */
  constructor() {
    this.api = new ApiService();
    this.auth = new Auth(this.api);
    this.recommend = new Recommend(this.api);

    this.initEventListeners();
  }

  /**
   * Setup global app event listeners
   */
  initEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
      });
    });

    // Logout trigger
    document.getElementById('logout-btn').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('auth:request_logout'));
    });

    // Auth events
    document.addEventListener('auth:success', (e) => this.onLogin(e.detail.user));
    document.addEventListener('auth:logged_out', () => this.onLogout());
  }

  /**
   * Handle user login UI state updates
   * @param {Object} user - The logged in user data
   */
  onLogin(user) {
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-meta').textContent = `${user.major} · Year ${user.year}`;
    document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();
  }

  /**
   * Handle user logout UI state updates
   */
  onLogout() {
    // Reset UI state if necessary
    document.getElementById('manual-grades').innerHTML = '';
    this.recommend.addGradeRow();
    this.recommend.addGradeRow();
    this.recommend.addGradeRow();
    document.getElementById('results-grid').innerHTML = '';
    document.getElementById('results-grid').classList.add('hidden');
    document.getElementById('results-placeholder').classList.remove('hidden');
  }
}

// Instantiate the App
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
