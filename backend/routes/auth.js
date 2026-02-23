/**
 * UmZulu Wildtrack - Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { login, verify, logout, createAdmin } = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/verify', verifyToken, verify);
router.post('/logout', verifyToken, logout);
router.post('/create-admin', verifyToken, requireAdmin, createAdmin);

module.exports = router;
