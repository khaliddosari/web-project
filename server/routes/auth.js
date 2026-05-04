const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, major, year, gpa } = req.body;

    if (!username || !email || !password || !major || !year || !gpa) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(409).json({ error: 'Username or email already taken.' });
    }

    const user = await User.create({ username, email, password, major, year, gpa });
    req.session.userId = user._id;

    return res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, major: user.major, year: user.year, gpa: user.gpa },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user._id;

    return res.json({
      user: { id: user._id, username: user.username, email: user.email, major: user.major, year: user.year, gpa: user.gpa },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out.' });
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { major, year, gpa } = req.body;
    const updates = {};
    if (major && ['CS', 'IS', 'IT'].includes(major)) updates.major = major;
    if (year && [1,2,3,4].includes(Number(year))) updates.year = Number(year);
    if (gpa !== undefined && gpa >= 0 && gpa <= 5) updates.gpa = Number(gpa);

    const user = await User.findByIdAndUpdate(req.session.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: { id: user._id, username: user.username, email: user.email, major: user.major, year: user.year, gpa: user.gpa } });
  } catch (err) {
    console.error('Profile update error:', err.message);
    return res.status(500).json({ error: 'Profile update failed.' });
  }
});

module.exports = router;
