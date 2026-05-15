import { COURSES, getCoursesForMajorAndYear } from './coursesData.js';

export class Recommend {
  constructor(api) {
    this.api = api;
    this.gradeRowCount = 0;
    this.container = document.getElementById('manual-grades');
    this.errorEl = document.getElementById('manual-error');
    this.currentRecommendations = [];
    this.currentUser = null;
    this.mode = 'manual';
    this.parsedPasteGrades = [];

    document.addEventListener('lang:changed', () => {
      this.updateCourseDropdowns();
      if (this.currentRecommendations.length > 0) this.renderResults(this.currentRecommendations);
    });

    this.init();
  }

  init() {
    document.getElementById('add-grade-row').addEventListener('click', () => this.addGradeRow());
    document.getElementById('manual-submit').addEventListener('click', () => this.submitManual());
    document.getElementById('parse-grades-btn').addEventListener('click', () => this.handleParsePaste());

    document.querySelectorAll('.grade-input-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchMode(tab.dataset.mode));
    });
  }

  setUser(user) { this.currentUser = user; }
  getLang() { return document.body.getAttribute('dir') === 'rtl' ? 'ar' : 'en'; }

  switchMode(mode) {
    this.mode = mode;
    document.querySelectorAll('.grade-input-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    document.getElementById('grade-manual-mode').classList.toggle('hidden', mode !== 'manual');
    document.getElementById('grade-paste-mode').classList.toggle('hidden', mode !== 'paste');
    this.errorEl.classList.add('hidden');
  }

  getAllMajorCourses() {
    if (!this.currentUser) return COURSES;
    const major = this.currentUser.major;
    return COURSES.filter(c => {
      if (c.major === major) return true;
      if ((major === 'IS' || major === 'IT') && c.major === 'CS' && c.level <= 4) return true;
      return false;
    });
  }

  getSelectedCodes() {
    const codes = [];
    this.container.querySelectorAll('.grade-course').forEach(sel => {
      if (sel.value) codes.push(sel.value);
    });
    return codes;
  }

  populateInitialCourses(major, year) {
    this.container.innerHTML = '';
    this.gradeRowCount = 0;
    const courses = getCoursesForMajorAndYear(major, parseInt(year));
    if (courses.length > 0) {
      courses.forEach(c => this.addGradeRow(c.code));
    } else {
      this.addGradeRow();
    }
  }

  getCourseOptionsHtml(selectedCode = '') {
    const lang = this.getLang();
    const all = this.getAllMajorCourses();
    let options = `<option value="">${lang === 'ar' ? 'اختر المقرر' : 'Select Course'}</option>`;
    const sorted = [...all].sort((a, b) => a.level - b.level);
    sorted.forEach(c => {
      const name = lang === 'ar' ? c.arName : c.enName;
      const code = this.translateCode(c.code, lang);
      const selected = c.code === selectedCode ? 'selected' : '';
      options += `<option value="${c.code}" ${selected}>${code} - ${name}</option>`;
    });
    return options;
  }

  updateCourseDropdowns() {
    const lang = this.getLang();
    this.container.querySelectorAll('.grade-course').forEach(select => {
      const val = select.value;
      select.innerHTML = this.getCourseOptionsHtml(val);
    });
    this.container.querySelectorAll('.grade-value').forEach(select => {
      const first = select.querySelector('option[value=""]');
      if (first) first.textContent = lang === 'ar' ? 'الدرجة' : 'Grade';
    });
  }

  checkPrereqs(courseCode) {
    const course = COURSES.find(c => c.code === courseCode);
    if (!course || course.prereqs.length === 0) return { ok: true, missing: [] };
    const selected = this.getSelectedCodes();
    const missing = course.prereqs.filter(p => !selected.includes(p));
    return { ok: missing.length === 0, missing };
  }

  addGradeRow(prefilledCourseCode = '') {
    this.gradeRowCount++;
    const row = document.createElement('div');
    row.className = 'grade-row';
    const lang = this.getLang();

    row.innerHTML = `
      <select class="grade-course">${this.getCourseOptionsHtml(prefilledCourseCode)}</select>
      <select class="grade-value">
        <option value="">${lang === 'ar' ? 'الدرجة' : 'Grade'}</option>
        <option value="A+">A+</option><option value="A">A</option>
        <option value="B+">B+</option><option value="B">B</option>
        <option value="C+">C+</option><option value="C">C</option>
        <option value="D+">D+</option><option value="D">D</option>
        <option value="F">F</option>
      </select>
      <button class="btn-remove-row" title="Remove">✕</button>
    `;

    const courseSelect = row.querySelector('.grade-course');
    courseSelect.addEventListener('change', () => {
      const code = courseSelect.value;
      if (!code) return;
      const { ok, missing } = this.checkPrereqs(code);
      if (!ok) {
        const lang = this.getLang();
        const missingNames = missing.map(m => {
          const c = COURSES.find(x => x.code === m);
          return c ? `${this.translateCode(m, lang)} (${lang === 'ar' ? c.arName : c.enName})` : this.translateCode(m, lang);
        }).join('، ');
        const msg = lang === 'ar'
          ? `⚠️ تحذير: لم تضف المتطلب السابق لهذه المادة: ${missingNames}`
          : `⚠️ Warning: Missing prerequisite: ${missingNames}`;
        alert(msg);
        courseSelect.value = '';
      }
    });

    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      row.remove();
      this.gradeRowCount--;
    });

    this.container.appendChild(row);
  }

  // ─── Paste mode ───────────────────────────────
  toWesternDigits(s) {
    return s.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660));
  }

  reverseTranslateCode(code) {
    return code
      .replace(/^CS(\d+)/, 'عال$1').replace(/^IS(\d+)/, 'نال$1').replace(/^IT(\d+)/, 'تال$1')
      .replace(/^MATH(\d+)/, 'ريض$1').replace(/^PHY(\d+)/, 'فيز$1').replace(/^ENG(\d+)/, 'نجل$1')
      .replace(/^STAT(\d+)/, 'احص$1').replace(/^ACCT(\d+)/, 'حسب$1');
  }

  parseSmart(text) {
    const lang = this.getLang();
    const majorCodes = this.getAllMajorCourses().map(c => c.code);
    const arGradeMap = {
      'أ+': 'A+', 'أ': 'A', 'ا+': 'A+', 'ا': 'A',
      'ب+': 'B+', 'ب': 'B',
      'ج+': 'C+', 'ج': 'C',
      'د+': 'D+', 'د': 'D',
      'را': 'F', 'ر': 'F'
    };
    const enGrades = new Set(['A+','A','B+','B','C+','C','D+','D','F']);
    const headerKeywords = ['التقدير', 'المعدل', 'الوحدات', 'المقرر', 'الفصلي', 'التراكمي'];
    const parsed = [];

    text.split('\n').forEach(line => {
      line = line.trim();
      if (!line || headerKeywords.some(k => line.includes(k))) return;

      const tokens = this.toWesternDigits(line).split(/[\t\s]+/).map(t => t.trim()).filter(Boolean);
      let foundCourse = null;
      let grade = null;

      for (const token of tokens) {
        if (!foundCourse && /^[؀-ۿ]{2,4}\d{3,4}$/.test(token)) {
          const course = COURSES.find(c => c.code === token && majorCodes.includes(c.code));
          if (course) foundCourse = course;
        }
        if (!foundCourse && /^(CS|IS|IT|MATH|PHY|ENG|STAT|ACCT)\d{3,4}$/i.test(token)) {
          const course = COURSES.find(c => c.code === this.reverseTranslateCode(token.toUpperCase()) && majorCodes.includes(c.code));
          if (course) foundCourse = course;
        }
        if (!grade && enGrades.has(token.toUpperCase())) grade = token.toUpperCase();
        if (!grade && arGradeMap[token]) grade = arGradeMap[token];
      }

      if (foundCourse && grade) {
        parsed.push({ course: foundCourse.code, grade, displayCode: this.translateCode(foundCourse.code, lang), name: lang === 'ar' ? foundCourse.arName : foundCourse.enName });
      }
    });

    return parsed;
  }

  handleParsePaste() {
    const text = document.getElementById('grade-paste-input').value.trim();
    if (!text) return;

    const newParsed = this.parseSmart(text);

    newParsed.forEach(p => {
      const existing = this.parsedPasteGrades.findIndex(x => x.course === p.course);
      if (existing >= 0) this.parsedPasteGrades[existing].grade = p.grade;
      else this.parsedPasteGrades.push({ course: p.course, grade: p.grade });
    });

    this.renderPastePreview();
  }

  renderPastePreview() {
    const lang = this.getLang();
    const preview = document.getElementById('paste-preview');

    if (this.parsedPasteGrades.length === 0) {
      preview.classList.add('hidden');
      return;
    }

    const items = this.parsedPasteGrades.map(p => {
      const course = COURSES.find(c => c.code === p.course);
      return {
        code: p.course,
        grade: p.grade,
        displayCode: this.translateCode(p.course, lang),
        name: lang === 'ar' ? course?.arName : course?.enName
      };
    });

    preview.innerHTML = `
      <div class="paste-preview-header">
        <p class="paste-preview-count">${lang === 'ar' ? `${items.length} مقرر محدد` : `${items.length} course(s) identified`}</p>
        <button class="paste-clear-all" id="paste-clear-all">${lang === 'ar' ? 'مسح الكل' : 'Clear All'}</button>
      </div>
      <div class="paste-preview-list">
        ${items.map(p => `
          <div class="paste-preview-row">
            <span>${p.displayCode} — ${p.name}</span>
            <div class="paste-row-actions">
              <span class="paste-grade-badge">${p.grade}</span>
              <button class="paste-delete-btn" data-code="${p.code}">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    preview.classList.remove('hidden');

    preview.querySelectorAll('.paste-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.parsedPasteGrades = this.parsedPasteGrades.filter(p => p.course !== btn.dataset.code);
        this.renderPastePreview();
      });
    });

    document.getElementById('paste-clear-all').addEventListener('click', () => {
      this.parsedPasteGrades = [];
      this.renderPastePreview();
    });
  }

  // ─── Collect & Submit ─────────────────────────
  collectGrades() {
    if (this.mode === 'paste') return this.parsedPasteGrades;

    const grades = [];
    document.querySelectorAll('.grade-row').forEach(row => {
      const course = row.querySelector('.grade-course').value;
      const grade = row.querySelector('.grade-value').value;
      if (course && grade) grades.push({ course, grade });
    });
    return grades;
  }

  async submitManual() {
    this.errorEl.classList.add('hidden');
    const grades = this.collectGrades();
    const lang = this.getLang();

    if (grades.length === 0) {
      this.errorEl.textContent = lang === 'ar' ? 'أدخل مقرراً واحداً على الأقل مع الدرجة.' : 'Enter at least one course and grade.';
      this.errorEl.classList.remove('hidden');
      return;
    }

    this.showLoading();
    try {
      const { recommendations } = await this.api.post('/api/recommend/manual', { grades, language: lang });
      this.renderResults(recommendations);
      document.dispatchEvent(new CustomEvent('recommend:success'));
    } catch (err) {
      this.errorEl.textContent = err.message;
      this.errorEl.classList.remove('hidden');
      this.hideLoading();
    }
  }

  showLoading() {
    document.getElementById('results-placeholder').classList.add('hidden');
    document.getElementById('results-grid').classList.add('hidden');
    document.getElementById('results-loading').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('results-loading').classList.add('hidden');
    document.getElementById('results-placeholder').classList.remove('hidden');
  }

  translateCode(code, lang) {
    if (lang === 'ar') return code;
    return code
      .replace('عال', 'CS').replace('نال', 'IS').replace('تال', 'IT')
      .replace('ريض', 'MATH').replace('فيز', 'PHY').replace('نجل', 'ENG')
      .replace('احص', 'STAT').replace('حسب', 'ACCT');
  }

  renderResults(recs) {
    this.currentRecommendations = recs;
    document.getElementById('results-loading').classList.add('hidden');
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';
    const lang = this.getLang();

    recs.forEach((rec, i) => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      card.style.animationDelay = `${i * 0.08}s`;
      const circ = 2 * Math.PI * 36;
      const offset = circ - (rec.match / 100) * circ;
      const name = lang === 'ar' ? rec.name : rec.enName;
      const reason = lang === 'ar' ? rec.reason : rec.enReason;
      const desc = lang === 'ar' ? (rec.description || '') : (rec.enDescription || rec.description || '');
      const displayCode = this.translateCode(rec.code, lang);

      card.innerHTML = `
        <div class="rec-card-header">
          <div class="match-ring">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" class="ring-bg"/>
              <circle cx="40" cy="40" r="36" class="ring-fill" style="stroke-dasharray:${circ};stroke-dashoffset:${offset}"/>
            </svg>
            <span class="match-pct">${rec.match}%</span>
          </div>
          <div>
            <span class="rec-code">${displayCode}</span>
            <h3 class="rec-name">${name}</h3>
            <span class="rec-dept">${rec.department}</span>
          </div>
        </div>
        <p class="rec-reason">${reason}</p>
        ${desc ? `<p class="rec-desc">${desc}</p>` : ''}
      `;
      grid.appendChild(card);
    });
    grid.classList.remove('hidden');
  }
}
