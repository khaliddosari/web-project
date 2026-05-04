const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const ELECTIVES = require('../config/electives');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// ─── Core Gemini API Logic ────────────────────────
/**
 * Contacts the Google Gemini API to get recommendations
 * @param {Object} user - The user document
 * @param {String} gradesText - Formatted string of user's past grades
 * @returns {Array} List of 5 recommendations
 */
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
2. The student's major (${user.major}), year (${user.year}), and GPA (${user.gpa})
3. Logical course progression and complementary skills
4. Only recommend courses from the provided list`;

  const userPrompt = `${systemPrompt}\n\nStudent Profile:
- Major: ${user.major}
- Year: ${user.year}
- GPA: ${user.gpa}

Past Grades:
${gradesText}

Available Electives:
${electivesList}

Return exactly 5 recommendations as a JSON array.`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  const content = response.text().trim();

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
