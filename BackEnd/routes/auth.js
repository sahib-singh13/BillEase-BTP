// routes/auth.js
const express = require('express');
const router = express.Router();
// Import the new updateProfile function
const { register, login, getMe, googleAuth, updateProfile } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe); // Route to get current user data
router.patch('/profile', protect, updateProfile); // <-- Add PATCH route for profile update

module.exports = router;