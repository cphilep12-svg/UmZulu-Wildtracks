/**
 * UmZulu Wildtrack - Authentication Controller
 * Admin login and token management
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check environment-based admin (for single admin setup)
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH) {
      if (username === process.env.ADMIN_USERNAME) {
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        
        if (isMatch) {
          const token = jwt.sign(
            { 
              id: 'env-admin',
              username: process.env.ADMIN_USERNAME,
              role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
          );

          return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: 'env-admin',
              username: process.env.ADMIN_USERNAME,
              role: 'admin'
            }
          });
        }
      }
    }

    // Check database admin
    const admin = await Admin.findOne({ username, isActive: true }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = jwt.sign(
      { 
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @desc    Verify token validity
 * @route   GET /api/auth/verify
 * @access  Private
 */
const verify = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Logout (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  // JWT tokens are stateless, so we just inform client to remove token
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * @desc    Create new admin (admin only)
 * @route   POST /api/auth/create-admin
 * @access  Private/Admin
 */
const createAdmin = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username already exists'
      });
    }

    // Create new admin
    const admin = await Admin.create({
      username,
      password,
      name,
      email,
      role: role || 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating admin'
    });
  }
};

module.exports = {
  login,
  verify,
  logout,
  createAdmin
};
