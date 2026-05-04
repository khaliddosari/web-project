import { ApiService } from './api.js';
import { Auth } from './auth.js';
import { Recommend } from './recommend.js';
import { COURSES } from './coursesData.js';

class App {
  constructor() {
    this.api = new ApiService();
    this.auth = new Auth(this.api);
    this.recommend = new Recommend(this.api);
    this.currentLang = 'ar';
    this.currentUser = null;
    this.currentHistory = [];
    this.completedCourses = JSON.parse(localStorage.getItem('nusuk_completed') || '[]');

    this.initEventListeners();
    this.applyLanguage();
  }

  initEventListeners() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
        if (btn.dataset.page === 'history') this.fetchHistory();
        if (btn.dataset.page === 'curriculum') this.renderCurriculum();
      });
    });

    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.dispatchEvent(new CustomEvent('auth:request_logout'));
    });

    document.addEventListener('auth:success', (e) => this.onLogin(e.detail.user));
    document.addEventListener('auth:logged_out', () => this.onLogout());
    document.getElementById('lang-toggle').addEventListener('click', () => this.toggleLanguage());
    document.addEventListener('recommend:success', () => this.fetchHistory());

    // Profile modal
    document.getElementById('sidebar-user').addEventListener('click', (e) => {
      if (e.target.closest('#logout-btn')) return;
      this.openProfileModal();
    });
    document.getElementById('profile-modal-close').addEventListener('click', () => this.closeProfileModal());
    document.getElementById('profile-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeProfileModal();
    });
    document.getElementById('profile-form').addEventListener('submit', (e) => this.saveProfile(e));
  }

  // ─── Language ─────────────────────────────────
  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    document.body.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
    document.getElementById('lang-toggle').textContent = this.currentLang === 'ar' ? 'English' : 'عربي';
    this.applyLanguage();
    document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: this.currentLang } }));
    if (this.currentHistory && this.currentHistory.length > 0) this.renderHistory(this.currentHistory);
    else this.renderHistory([]);
    if (document.getElementById('page-curriculum').classList.contains('active')) this.renderCurriculum();
  }

  translateCode(code) {
    if (this.currentLang === 'ar') return code;
    return code.replace('عال', 'CS').replace('نال', 'IS').replace('تال', 'IT')
      .replace('ريض', 'MATH').replace('فيز', 'PHY').replace('نجل', 'ENG')
      .replace('احص', 'STAT').replace('حسب', 'ACCT');
  }

  applyLanguage() {
    document.querySelectorAll('[data-ar]').forEach(el => {
      const text = el.getAttribute(`data-${this.currentLang}`);
      if (!text) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = text; }
      else if (el.children.length === 0 || el.tagName === 'OPTION') { el.textContent = text; }
      else {
        const span = el.querySelector('span[data-ar]');
        if (span) span.textContent = span.getAttribute(`data-${this.currentLang}`);
      }
    });
  }

  // ─── Auth ─────────────────────────────────────
  onLogin(user) {
    this.currentUser = user;
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-meta').textContent = `${user.major} · Year ${user.year}`;
    document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();
    this.recommend.setUser(user);
    this.recommend.populateInitialCourses(user.major, user.year);
    this.fetchHistory();
  }

  onLogout() {
    this.currentUser = null;
    this.currentHistory = [];
    document.getElementById('manual-grades').innerHTML = '';
    document.getElementById('results-grid').innerHTML = '';
    document.getElementById('results-grid').classList.add('hidden');
    document.getElementById('results-placeholder').classList.remove('hidden');
    this.renderHistory([]);
  }

  // ─── Profile Modal ────────────────────────────
  openProfileModal() {
    if (!this.currentUser) return;
    document.getElementById('profile-major').value = this.currentUser.major;
    document.getElementById('profile-year').value = this.currentUser.year;
    document.getElementById('profile-gpa').value = this.currentUser.gpa;
    document.getElementById('profile-error').classList.add('hidden');
    document.getElementById('profile-modal').classList.remove('hidden');
    this.applyLanguage();
  }

  closeProfileModal() { document.getElementById('profile-modal').classList.add('hidden'); }

  async saveProfile(e) {
    e.preventDefault();
    const major = document.getElementById('profile-major').value;
    const year = parseInt(document.getElementById('profile-year').value);
    const gpa = parseFloat(document.getElementById('profile-gpa').value);
    try {
      const { user } = await this.api.request('PUT', '/api/auth/profile', { major, year, gpa });
      this.currentUser = user;
      document.getElementById('user-meta').textContent = `${user.major} · Year ${user.year}`;
      this.recommend.setUser(user);
      this.recommend.populateInitialCourses(user.major, user.year);
      this.closeProfileModal();
      this.showToast(this.currentLang === 'ar' ? 'تم حفظ التعديلات' : 'Profile updated');
    } catch (err) {
      document.getElementById('profile-error').textContent = err.message;
      document.getElementById('profile-error').classList.remove('hidden');
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast success';
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }

  // ─── History ──────────────────────────────────
  async fetchHistory() {
    try {
      const r = await this.api.get('/api/recommend/history');
      if (r && r.history) { this.currentHistory = r.history; this.renderHistory(r.history); }
    } catch (e) { console.error("History error", e); }
  }

  renderHistory(history) {
    const list = document.getElementById('history-list');
    if (!history || history.length === 0) {
      list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>${this.currentLang === 'ar' ? 'لا يوجد سجل.' : 'No history yet.'}</p></div>`;
      return;
    }
    list.innerHTML = history.map(session => {
      const date = new Date(session.date).toLocaleDateString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      return `<div style="background:rgba(255,255,255,.03);padding:20px;border-radius:14px;margin-bottom:20px;border:1px solid rgba(255,255,255,.06);">
        <h3 style="margin:0 0 16px;color:var(--accent-light);font-size:1rem;">${this.currentLang === 'ar' ? 'توصيات بتاريخ' : 'Recommendations from'} ${date}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${session.recommendations.map(r => `<div style="background:rgba(0,0,0,.2);padding:14px 16px;border-radius:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:8px;">
              <strong style="color:var(--accent-light);">${this.translateCode(r.code)} — <span style="color:var(--text);">${this.currentLang === 'ar' ? r.name : r.enName}</span></strong>
              <span style="background:var(--accent);color:#fff;padding:2px 10px;border-radius:10px;font-size:.8rem;font-weight:600;">${r.match}%</span>
            </div>
            <p style="margin:0;font-size:.85rem;color:var(--text-dim);line-height:1.5;">${this.currentLang === 'ar' ? r.reason : r.enReason}</p>
          </div>`).join('')}
        </div>
      </div>`;
    }).join('');
  }

  // ─── Curriculum Map ───────────────────────────
  toggleCourseCompleted(code) {
    const idx = this.completedCourses.indexOf(code);
    if (idx >= 0) this.completedCourses.splice(idx, 1);
    else this.completedCourses.push(code);
    localStorage.setItem('nusuk_completed', JSON.stringify(this.completedCourses));
    this.renderCurriculum();
  }

  renderCurriculum() {
    const container = document.getElementById('curriculum-map');
    if (!this.currentUser) { container.innerHTML = ''; return; }

    const major = this.currentUser.major;
    const lang = this.currentLang;

    const majorCourses = COURSES.filter(c => {
      if (c.major === major) return true;
      if ((major === 'IS' || major === 'IT') && c.major === 'CS' && c.level <= 4) return true;
      return false;
    });

    const ELECTIVES_MAP = {
      CS: [
        { code: 'عال1462', arName: 'معالجة اللغات الطبيعية', enName: 'Natural Language Processing', prereqs: ['عال1360'] },
        { code: 'عال1465', arName: 'الشبكات العصبية والتعلم العميق', enName: 'Neural Networks & Deep Learning', prereqs: ['عال1360'] },
        { code: 'عال1463', arName: 'الأمثلة والخوارزميات الذكية', enName: 'Optimization & Metaheuristics', prereqs: ['عال1360'] },
        { code: 'عال1464', arName: 'معالجة الصور الرقمية', enName: 'Digital Image Processing', prereqs: ['عال1360'] },
        { code: 'عال1471', arName: 'قواعد البيانات المتقدمة', enName: 'Advanced Database', prereqs: ['عال1370'] },
        { code: 'عال1445', arName: 'تطوير تطبيقات الويب', enName: 'Web Application Development', prereqs: ['عال1351', 'عال1352'] },
        { code: 'عال1447', arName: 'تطوير تطبيقات الألعاب', enName: 'Game Application Development', prereqs: ['عال1351', 'عال1352', 'عال1360'] },
        { code: 'عال1474', arName: 'أمن شبكات الحاسب', enName: 'Network Security', prereqs: ['عال1472'] },
        { code: 'عال1475', arName: 'أمن البرمجيات', enName: 'Software Security', prereqs: ['عال1472'] },
        { code: 'عال1433', arName: 'النظم الموزعة', enName: 'Distributed Systems', prereqs: ['عال1330'] },
        { code: 'عال1424', arName: 'مقدمة في الروبوتات', enName: 'Introduction to Robotics', prereqs: ['عال1360'] },
        { code: 'عال1434', arName: 'إنترنت الأشياء', enName: 'Internet of Things', prereqs: ['عال1330'] },
      ],
      IS: [
        { code: 'نال1356', arName: 'تنقيب البيانات', enName: 'Data Mining', prereqs: ['نال1321'] },
        { code: 'نال1357', arName: 'ذكاء الأعمال', enName: 'Business Intelligence', prereqs: ['نال1321'] },
        { code: 'نال1358', arName: 'أنظمة دعم القرار', enName: 'Decision Support Systems', prereqs: ['نال1235'] },
        { code: 'نال1470', arName: 'الحوسبة السحابية', enName: 'Cloud Computing', prereqs: ['نال1341'] },
        { code: 'نال1388', arName: 'الأمن السيبراني', enName: 'Cybersecurity', prereqs: ['نال1330'] },
      ],
      IT: [
        { code: 'تال1384', arName: 'التطبيقات القائمة على السحابة', enName: 'Cloud-Based Applications', prereqs: ['تال1360'] },
        { code: 'تال1443', arName: 'إدارة شبكات الحاسب', enName: 'Network Administration', prereqs: ['تال1340'] },
        { code: 'تال1413', arName: 'أمن الشبكات وتقنيات التشفير', enName: 'Network Security & Cryptography', prereqs: ['تال1340'] },
        { code: 'تال1414', arName: 'أساسيات الأدلة الجنائية الرقمية', enName: 'Digital Forensics', prereqs: ['تال1410'] },
      ]
    };

    const levels = {};
    majorCourses.forEach(c => {
      if (!levels[c.level]) levels[c.level] = [];
      levels[c.level].push(c);
    });

    const levelNames = {
      ar: ['', 'المستوى الأول', 'المستوى الثاني', 'المستوى الثالث', 'المستوى الرابع', 'المستوى الخامس', 'المستوى السادس', 'المستوى السابع', 'المستوى الثامن'],
      en: ['', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8']
    };

    let html = '';
    const sortedLevels = Object.keys(levels).map(Number).sort((a, b) => a - b);
    sortedLevels.forEach(lvl => {
      html += `<div class="level-row">
        <div class="level-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          ${levelNames[lang][lvl] || `Level ${lvl}`}
        </div>
        <div class="level-courses">
          ${levels[lvl].map(c => this.renderCourseCard(c, lang, false)).join('')}
        </div>
      </div>`;
    });

    // Electives
    const electives = ELECTIVES_MAP[major] || [];
    if (electives.length > 0) {
      html += `<div class="level-row">
        <div class="elective-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${lang === 'ar' ? 'المقررات الاختيارية' : 'Elective Courses'}
        </div>
        <div class="level-courses">
          ${electives.map(e => this.renderCourseCard(e, lang, true)).join('')}
        </div>
      </div>`;
    }

    container.innerHTML = html;

    // Attach click handlers
    container.querySelectorAll('.course-card[data-code]').forEach(card => {
      card.addEventListener('click', () => this.toggleCourseCompleted(card.dataset.code));
    });
  }

  renderCourseCard(c, lang, isElective) {
    const name = lang === 'ar' ? c.arName : c.enName;
    const code = this.translateCode(c.code);
    const done = this.completedCourses.includes(c.code);
    const prereqTags = c.prereqs.length > 0
      ? c.prereqs.map(p => `<span class="prereq-tag">${this.translateCode(p)}</span>`).join('')
      : `<span class="prereq-tag none">${lang === 'ar' ? 'بدون متطلب' : 'No prereq'}</span>`;
    const classes = ['course-card'];
    if (isElective) classes.push('elective-card');
    if (done) classes.push('completed');

    return `<div class="${classes.join(' ')}" data-code="${c.code}" title="${lang === 'ar' ? 'اضغط لتأشير الإنجاز' : 'Click to mark as completed'}">
      ${done ? '<div class="completed-check">✓</div>' : ''}
      <div class="course-card-code">${code}</div>
      <div class="course-card-name">${name}</div>
      <div class="course-card-prereqs">${prereqTags}</div>
    </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => { new App(); });
