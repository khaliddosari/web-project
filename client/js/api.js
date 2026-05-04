/**
 * ApiService Class
 * Handles all HTTP requests to the backend API.
 */
export class ApiService {
  /**
   * Core request method
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} url - API endpoint
   * @param {Object} [body] - Optional request body
   * @returns {Promise<Object>} JSON response
   */
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
  }

  /**
   * Register a new user
   * @param {Object} fields - User registration data
   * @returns {Promise<Object>} Response data
   */
  register(fields) { 
    return this.request('POST', '/api/auth/register', fields); 
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response data
   */
  login(email, password) { 
    return this.request('POST', '/api/auth/login', { email, password }); 
  }

  /**
   * Logout the current user
   * @returns {Promise<Object>} Response data
   */
  logout() { 
    return this.request('POST', '/api/auth/logout'); 
  }

  /**
   * Get current user session
   * @returns {Promise<Object>} Response data
   */
  me() { 
    return this.request('GET', '/api/auth/me'); 
  }

  /**
   * Get manual recommendations based on grades
   * @param {Array} grades - Array of course/grade objects
   * @returns {Promise<Object>} Response data containing recommendations
   */
  recommendManual(grades) { 
    return this.request('POST', '/api/recommend/manual', { grades }); 
  }
}
