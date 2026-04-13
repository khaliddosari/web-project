const Auth = (() => {
  const authScreen = document.getElementById('auth-screen');
  const appEl = document.getElementById('app');
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');

  function init() {
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    checkSession();
  }

  function switchTab(tab) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    loginForm.classList.toggle('active', tab === 'login');
    registerForm.classList.toggle('active', tab === 'register');
    loginError.classList.add('hidden');
    registerError.classList.add('hidden');
  }

  async function handleLogin(e) {
    e.preventDefault();
    loginError.classList.add('hidden');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    try {
      const { user } = await API.login(email, password);
      enterApp(user);
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.remove('hidden');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    registerError.classList.add('hidden');
    const fields = {
      username: document.getElementById('reg-username').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      major: document.getElementById('reg-major').value,
      year: parseInt(document.getElementById('reg-year').value, 10),
      gpaRange: document.getElementById('reg-gpa').value,
    };
    if (!fields.username || !fields.email || !fields.password || !fields.major || !fields.year || !fields.gpaRange) {
      registerError.textContent = 'All fields are required.';
      registerError.classList.remove('hidden');
      return;
    }
    try {
      const { user } = await API.register(fields);
      enterApp(user);
    } catch (err) {
      registerError.textContent = err.message;
      registerError.classList.remove('hidden');
    }
  }

  async function checkSession() {
    try {
      const { user } = await API.me();
      enterApp(user);
    } catch {
      showAuth();
    }
  }

  function enterApp(user) {
    authScreen.classList.add('hidden');
    appEl.classList.remove('hidden');
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-meta').textContent = `${user.major} · Year ${user.year}`;
    document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();
    if (typeof App !== 'undefined' && App.onLogin) App.onLogin(user);
  }

  function showAuth() {
    authScreen.classList.remove('hidden');
    appEl.classList.add('hidden');
  }

  function logout() {
    API.logout().finally(() => {
      showAuth();
    });
  }

  return { init, logout };
})();
