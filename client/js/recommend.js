/**
 * Recommend Class
 * Handles manual grade inputs and UI updates for recommendations.
 */
export class Recommend {
  /**
   * Initialize Recommend class
   * @param {ApiService} api - Reference to ApiService instance
   */
  constructor(api) {
    this.api = api;
    this.gradeRowCount = 0;
    this.container = document.getElementById('manual-grades');
    this.errorEl = document.getElementById('manual-error');
    
    this.init();
  }

  /**
   * Attach event listeners and setup initial state
   */
  init() {
    this.addGradeRow();
    this.addGradeRow();
    this.addGradeRow();
    
    document.getElementById('add-grade-row').addEventListener('click', () => this.addGradeRow());
    document.getElementById('manual-submit').addEventListener('click', () => this.submitManual());
  }

  /**
   * Add a new empty grade input row to the UI
   */
  addGradeRow() {
    this.gradeRowCount++;
    const row = document.createElement('div');
    row.className = 'grade-row';
    row.innerHTML = `
      <input type="text" placeholder="Course (e.g. CS101)" class="grade-course" />
      <select class="grade-value">
        <option value="">Grade</option>
        <option value="A+">A+</option><option value="A">A</option><option value="A-">A-</option>
        <option value="B+">B+</option><option value="B">B</option><option value="B-">B-</option>
        <option value="C+">C+</option><option value="C">C</option><option value="C-">C-</option>
        <option value="D+">D+</option><option value="D">D</option>
        <option value="F">F</option>
      </select>
      <button class="btn-remove-row" title="Remove">✕</button>
    `;
    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      row.remove();
      this.gradeRowCount--;
    });
    this.container.appendChild(row);
  }

  /**
   * Parse the input fields and collect valid course grades
   * @returns {Array} List of grade objects
   */
  collectGrades() {
    const rows = document.querySelectorAll('.grade-row');
    const grades = [];
    rows.forEach(row => {
      const course = row.querySelector('.grade-course').value.trim();
      const grade = row.querySelector('.grade-value').value;
      if (course && grade) grades.push({ course, grade });
    });
    return grades;
  }

  /**
   * Handle recommendation submission
   */
  async submitManual() {
    this.errorEl.classList.add('hidden');
    const grades = this.collectGrades();
    
    if (grades.length === 0) {
      this.errorEl.textContent = 'Enter at least one course and grade.';
      this.errorEl.classList.remove('hidden');
      return;
    }
    
    this.showLoading();
    
    try {
      const { recommendations } = await this.api.recommendManual(grades);
      this.renderResults(recommendations);
    } catch (err) {
      this.errorEl.textContent = err.message;
      this.errorEl.classList.remove('hidden');
      this.hideLoading();
    }
  }

  /**
   * Display loading spinner in UI
   */
  showLoading() {
    document.getElementById('results-placeholder').classList.add('hidden');
    document.getElementById('results-grid').classList.add('hidden');
    document.getElementById('results-loading').classList.remove('hidden');
  }

  /**
   * Hide loading spinner in UI
   */
  hideLoading() {
    document.getElementById('results-loading').classList.add('hidden');
    document.getElementById('results-placeholder').classList.remove('hidden');
  }

  /**
   * Render AI recommendations as cards
   * @param {Array} recs - Array of recommendation objects
   */
  renderResults(recs) {
    document.getElementById('results-loading').classList.add('hidden');
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';
    
    recs.forEach((rec, i) => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      card.style.animationDelay = `${i * 0.08}s`;
      
      const circumference = 2 * Math.PI * 36;
      const offset = circumference - (rec.match / 100) * circumference;
      
      card.innerHTML = `
        <div class="rec-card-header">
          <div class="match-ring">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" class="ring-bg"/>
              <circle cx="40" cy="40" r="36" class="ring-fill" style="stroke-dasharray:${circumference};stroke-dashoffset:${offset}"/>
            </svg>
            <span class="match-pct">${rec.match}%</span>
          </div>
          <div>
            <span class="rec-code">${rec.code}</span>
            <h3 class="rec-name">${rec.name}</h3>
            <span class="rec-dept">${rec.department}</span>
          </div>
        </div>
        <p class="rec-reason">${rec.reason}</p>
        ${rec.description ? `<p class="rec-desc">${rec.description}</p>` : ''}
      `;
      grid.appendChild(card);
    });
    
    grid.classList.remove('hidden');
  }
}
