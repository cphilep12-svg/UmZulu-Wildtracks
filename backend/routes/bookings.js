/**
 * UmZulu Wildtrack - Booking Routes
 */

const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/', createBooking);

// Protected routes (admin only)
router.get('/', verifyToken, getBookings);
router.get('/stats/overview', verifyToken, getBookingStats);
router.get('/:id', verifyToken, getBooking);
router.put('/:id', verifyToken, updateBooking);
router.delete('/:id', verifyToken, deleteBooking);

module.exports = router;
