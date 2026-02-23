/**
 * UmZulu Wildtrack - Message Routes
 */

const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessage,
  createMessage,
  markAsRead,
  deleteMessage,
  getMessageStats
} = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/', createMessage);

// Protected routes (admin only)
router.get('/', verifyToken, getMessages);
router.get('/stats/overview', verifyToken, getMessageStats);
router.get('/:id', verifyToken, getMessage);
router.put('/:id/read', verifyToken, markAsRead);
router.delete('/:id', verifyToken, deleteMessage);

module.exports = router;
