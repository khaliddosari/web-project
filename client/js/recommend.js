const Recommend = (() => {
  let gradeRowCount = 0;

  function init() {
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.getElementById('manual-panel').classList.toggle('active', btn.dataset.mode === 'manual');
        document.getElementById('upload-panel').classList.toggle('active', btn.dataset.mode === 'upload');
      });
    });

    // Manual grades
    addGradeRow();
    addGradeRow();
    addGradeRow();
    document.getElementById('add-grade-row').addEventListener('click', addGradeRow);
    document.getElementById('manual-submit').addEventListener('click', submitManual);

    // Upload
    const fileInput = document.getElementById('file-input');
    document.getElementById('browse-btn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    const zone = document.getElementById('upload-zone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect();
      }
    });

    document.getElementById('remove-file').addEventListener('click', clearFile);
    document.getElementById('upload-submit').addEventListener('click', submitUpload);
  }

  function addGradeRow() {
    gradeRowCount++;
    const container = document.getElementById('manual-grades');
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
      gradeRowCount--;
    });
    container.appendChild(row);
  }

  function collectGrades() {
    const rows = document.querySelectorAll('.grade-row');
    const grades = [];
    rows.forEach(row => {
      const course = row.querySelector('.grade-course').value.trim();
      const grade = row.querySelector('.grade-value').value;
      if (course && grade) grades.push({ course, grade });
    });
    return grades;
  }

  async function submitManual() {
    const errorEl = document.getElementById('manual-error');
    errorEl.classList.add('hidden');
    const grades = collectGrades();
    if (grades.length === 0) {
      errorEl.textContent = 'Enter at least one course and grade.';
      errorEl.classList.remove('hidden');
      return;
    }
    showLoading();
    try {
      const { recommendations } = await API.recommendManual(grades);
      renderResults(recommendations);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      hideLoading();
    }
  }

  function handleFileSelect() {
    const file = document.getElementById('file-input').files[0];
    if (!file) return;
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('upload-zone').classList.add('hidden');
    document.getElementById('file-preview').classList.remove('hidden');
  }

  function clearFile() {
    document.getElementById('file-input').value = '';
    document.getElementById('upload-zone').classList.remove('hidden');
    document.getElementById('file-preview').classList.add('hidden');
  }

  async function submitUpload() {
    const errorEl = document.getElementById('upload-error');
    errorEl.classList.add('hidden');
    const file = document.getElementById('file-input').files[0];
    if (!file) {
      errorEl.textContent = 'Please select a file first.';
      errorEl.classList.remove('hidden');
      return;
    }
    showLoading();
    try {
      const { recommendations } = await API.recommendUpload(file);
      renderResults(recommendations);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      hideLoading();
    }
  }

  function showLoading() {
    document.getElementById('results-placeholder').classList.add('hidden');
    document.getElementById('results-grid').classList.add('hidden');
    document.getElementById('results-loading').classList.remove('hidden');
  }

  function hideLoading() {
    document.getElementById('results-loading').classList.add('hidden');
    document.getElementById('results-placeholder').classList.remove('hidden');
  }

  function renderResults(recs) {
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

  return { init };
})();
