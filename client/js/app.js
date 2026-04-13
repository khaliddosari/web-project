const App = (() => {
  function init() {
    Auth.init();
    Recommend.init();

    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
      });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', Auth.logout);
  }

  function onLogin(user) {
    // Hook for post-login actions if needed
  }

  return { init, onLogin };
})();

document.addEventListener('DOMContentLoaded', App.init);
