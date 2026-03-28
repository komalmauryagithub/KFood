const express = require('express');
const router = express.Router();
const { signup, login, getMe, adminLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/admin-login
// @access  Public (admin only)
router.post('/admin-login', adminLogin);

module.exports = router;
