const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const ELECTIVES = require('../config/electives');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Multer Setup ─────────────────────────────
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/csv', 'text/plain'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and CSV files are allowed.'));
    }
  },
});

router.use(requireAuth);

// ─── Electives List (for frontend) ───────────
// GET /api/recommend/electives
router.get('/electives', (req, res) => {
  return res.json(ELECTIVES);
});

// ─── Manual Grade Entry ───────────────────────
// POST /api/recommend/manual
// Body: { grades: [{ course: "CS101", grade: "A" }, ...] }
router.post('/manual', async (req, res) => {
  try {
    const { grades } = req.body;

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: 'grades array is required.' });
    }

    const user = await User.findById(req.session.userId);
    const gradesText = grades
      .map(g => `${g.course}: ${g.grade}`)
      .join('\n');

    const recommendations = await getRecommendations(user, gradesText);
    return res.json({ recommendations });
  } catch (err) {
    console.error('Manual recommend error:', err.message);
    return res.status(500).json({ error: err.message || 'Recommendation failed.' });
  }
});

// ─── Transcript Upload ────────────────────────
// POST /api/recommend/upload
router.post('/upload', upload.single('transcript'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const user = await User.findById(req.session.userId);
    let gradesText = '';

    // Parse file content
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      gradesText = pdfData.text;
    } else {
      // CSV or plain text
      gradesText = fs.readFileSync(req.file.path, 'utf8');
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (!gradesText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded file.' });
    }

    const recommendations = await getRecommendations(user, gradesText);
    return res.json({ recommendations });
  } catch (err) {
    // Clean up file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload recommend error:', err.message);
    return res.status(500).json({ error: err.message || 'Recommendation failed.' });
  }
});

// ─── Core OpenAI Logic ────────────────────────
async function getRecommendations(user, gradesText) {
  const electivesList = ELECTIVES.map(e =>
    `- ${e.code}: ${e.name} (${e.department}) — ${e.description}`
  ).join('\n');

  const systemPrompt = `You are an academic advisor AI for a university. Your job is to analyze a student's past course grades and recommend the most suitable elective courses from a fixed list.

You must respond ONLY with a valid JSON array of exactly 5 objects. No preamble, no explanation outside the JSON.

Each object must have:
- "code": the course code (string)
- "name": the course name (string)  
- "match": a match percentage 0-100 (number)
- "reason": a 2-3 sentence explanation of why this course suits this student (string)
- "department": the department code (string)

Base your recommendations on:
1. The student's grades — strong grades in relevant subjects indicate readiness
2. The student's major (${user.major}), year (${user.year}), and GPA range (${user.gpaRange})
3. Logical course progression and complementary skills
4. Only recommend courses from the provided list`;

  const userPrompt = `Student Profile:
- Major: ${user.major}
- Year: ${user.year}
- GPA Range: ${user.gpaRange}

Past Grades:
${gradesText}

Available Electives:
${electivesList}

Return exactly 5 recommendations as a JSON array.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content.trim();

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned an invalid response. Please try again.');
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  // Enrich with full elective data
  return parsed.slice(0, 5).map(rec => {
    const elective = ELECTIVES.find(e => e.code === rec.code) || {};
    return {
      code: rec.code,
      name: rec.name || elective.name,
      department: rec.department || elective.department,
      description: elective.description || '',
      match: rec.match,
      reason: rec.reason,
    };
  });
}

module.exports = router;
