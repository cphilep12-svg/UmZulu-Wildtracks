/**
 * UmZulu Wildtrack - Safari Package Model
 * Schema for safari packages and pricing
 */

const mongoose = require('mongoose');

const safariPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide package name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'ZAR',
    enum: ['ZAR', 'USD', 'EUR', 'GBP']
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration'],
    enum: [
      '2 hours',
      '3 hours',
      '4 hours',
      'Half day',
      'Full day',
      'Multi-day'
    ]
  },
  maxGuests: {
    type: Number,
    required: [true, 'Please specify maximum guests'],
    min: [1, 'Minimum 1 guest'],
    max: [50, 'Maximum 50 guests']
  },
  minGuests: {
    type: Number,
    default: 1,
    min: 1
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'
  },
  features: [{
    type: String,
    trim: true
  }],
  includes: [{
    type: String,
    trim: true
  }],
  schedule: {
    startTime: String,
    endTime: String,
    meetingPoint: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'private', 'specialty'],
    default: 'morning'
  },
  requirements: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Auto-generate slug from name
safariPackageSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for formatted price
safariPackageSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: this.currency
  }).format(this.price);
});

// Index for querying
safariPackageSchema.index({ isAvailable: 1 });
safariPackageSchema.index({ isPopular: 1 });
safariPackageSchema.index({ category: 1 });
safariPackageSchema.index({ price: 1 });

module.exports = mongoose.model('SafariPackage', safariPackageSchema);
