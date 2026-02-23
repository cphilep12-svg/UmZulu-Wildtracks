/**
 * UmZulu Wildtrack - Booking Model
 * Schema for safari booking enquiries
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  safariPackage: {
    type: String,
    required: [true, 'Please select a safari package'],
    enum: [
      'Big Five Morning Safari',
      'Family Afternoon Safari',
      'Night Safari Drive',
      'Private Tour',
      'Bird Watching Safari',
      'Photography Safari',
      'Walking Safari',
      'Custom Package'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Please select a date'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Date must be in the future'
    }
  },
  guests: {
    type: Number,
    required: [true, 'Please specify number of guests'],
    min: [1, 'Minimum 1 guest required'],
    max: [20, 'Maximum 20 guests allowed']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for querying by date
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to calculate total based on package
bookingSchema.methods.calculateTotal = function(packagePrice) {
  this.totalAmount = packagePrice * this.guests;
  return this.totalAmount;
};

module.exports = mongoose.model('Booking', bookingSchema);
