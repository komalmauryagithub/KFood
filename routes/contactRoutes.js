const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  deleteMessage
} = require('../controllers/contactController');

// Public route - Create contact message
router.post('/', createContactMessage);

// Protected routes (admin only) - Get all messages and delete message
router.get('/', getAllMessages);
router.delete('/:id', deleteMessage);

module.exports = router;
