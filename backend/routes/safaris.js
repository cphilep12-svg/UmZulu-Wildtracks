/**
 * UmZulu Wildtrack - Safari Package Routes
 */

const express = require('express');
const router = express.Router();
const {
  getSafaris,
  getSafari,
  createSafari,
  updateSafari,
  deleteSafari,
  toggleAvailability,
  seedSafaris
} = require('../controllers/safariController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getSafaris);
router.get('/:id', getSafari);

// Protected routes (admin only)
router.post('/', verifyToken, createSafari);
router.post('/seed', verifyToken, seedSafaris);
router.put('/:id', verifyToken, updateSafari);
router.patch('/:id/toggle', verifyToken, toggleAvailability);
router.delete('/:id', verifyToken, deleteSafari);

module.exports = router;
