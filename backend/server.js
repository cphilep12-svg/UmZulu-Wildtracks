/**
 * UmZulu Wildtrack - Main Server
 * Express application with MongoDB integration
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
connectDB();
// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');
const safariRoutes = require('./routes/safaris');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/safaris', safariRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'UmZulu Wildtrack API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve frontend (if in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🦁 UmZulu Wildtrack API Server                         ║
║                                                          ║
║   Running on port: ${PORT}${' '.repeat(28 - PORT.toString().length)}║
║   Environment: ${process.env.NODE_ENV || 'development'}${' '.repeat(32 - (process.env.NODE_ENV || 'development').length)}║
║   API URL: http://localhost:${PORT}/api${' '.repeat(16 - PORT.toString().length)}║
║   Admin: http://localhost:${PORT}/admin${' '.repeat(18 - PORT.toString().length)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
