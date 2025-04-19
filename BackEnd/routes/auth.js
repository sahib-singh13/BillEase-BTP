// routes/auth.js
const express = require('express');
const router = express.Router();
// Make sure to import googleAuth
const { register, login, getMe, googleAuth } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/google', googleAuth); // <-- Add Google Auth route

module.exports = router;