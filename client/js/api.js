const API = {
  async request(method, url, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // Auth
  register(fields) { return this.request('POST', '/api/auth/register', fields); },
  login(email, password) { return this.request('POST', '/api/auth/login', { email, password }); },
  logout() { return this.request('POST', '/api/auth/logout'); },
  me() { return this.request('GET', '/api/auth/me'); },

  // Recommend
  getElectives() { return this.request('GET', '/api/recommend/electives'); },
  recommendManual(grades) { return this.request('POST', '/api/recommend/manual', { grades }); },

  async recommendUpload(file) {
    const form = new FormData();
    form.append('transcript', file);
    const res = await fetch('/api/recommend/upload', { method: 'POST', body: form, credentials: 'same-origin' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
};
