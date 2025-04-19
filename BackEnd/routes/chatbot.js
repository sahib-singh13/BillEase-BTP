// routes/chatbot.js
const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controller/chatbotController');
// Note: Decide if this route needs authentication (protect middleware)
// If only logged-in users can chat, add 'protect'
// const { protect } = require('../middleware/authMiddleware');

// POST /billease/chatbot/query
router.post('/query', handleChatQuery); // Add protect here if needed: router.post('/query', protect, handleChatQuery);

module.exports = router;