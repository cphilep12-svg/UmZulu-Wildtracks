/**
 * UmZulu Wildtrack - Message Model
 * Schema for contact form messages
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['general', 'booking', 'feedback', 'partnership', 'other'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for querying
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ category: 1 });

// Virtual for message preview
messageSchema.virtual('preview').get(function() {
  return this.message.length > 100 
    ? this.message.substring(0, 100) + '...' 
    : this.message;
});

module.exports = mongoose.model('Message', messageSchema);
