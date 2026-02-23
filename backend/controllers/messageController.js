/**
 * UmZulu Wildtrack - Message Controller
 * CRUD operations for contact messages
 */

const Message = require('../models/Message');

/**
 * @desc    Get all messages
 * @route   GET /api/messages
 * @access  Private/Admin
 */
const getMessages = async (req, res) => {
  try {
    const { isRead, category, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (category) query.category = category;

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({ isRead: false });

    res.json({
      success: true,
      count: messages.length,
      total: count,
      unreadCount,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    });
  }
};

/**
 * @desc    Get single message
 * @route   GET /api/messages/:id
 * @access  Private/Admin
 */
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching message'
    });
  }
};

/**
 * @desc    Create new message (contact form)
 * @route   POST /api/messages
 * @access  Public
 */
const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message: messageText, category } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !messageText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create message
    const message = await Message.create({
      name,
      email,
      phone,
      subject,
      message: messageText,
      category: category || 'general',
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
      data: {
        id: message._id,
        name: message.name,
        subject: message.subject,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Create message error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error sending message'
    });
  }
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private/Admin
 */
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating message'
    });
  }
};

/**
 * @desc    Delete message
 * @route   DELETE /api/messages/:id
 * @access  Private/Admin
 */
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting message'
    });
  }
};

/**
 * @desc    Get message statistics
 * @route   GET /api/messages/stats/overview
 * @access  Private/Admin
 */
const getMessageStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });
    
    // Messages by category
    const categoryStats = await Message.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent messages
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject isRead createdAt');

    res.json({
      success: true,
      stats: {
        total: totalMessages,
        unread: unreadMessages,
        categories: categoryStats
      },
      recentMessages
    });

  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  markAsRead,
  deleteMessage,
  getMessageStats
};
