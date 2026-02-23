/**
 * UmZulu Wildtrack - Safari Package Controller
 * CRUD operations for safari packages
 */

const SafariPackage = require('../models/SafariPackage');

/**
 * @desc    Get all safari packages
 * @route   GET /api/safaris
 * @access  Public
 */
const getSafaris = async (req, res) => {
  try {
    const { available, category, popular } = req.query;
    
    const query = {};
    
    // Filter by availability
    if (available === 'true') {
      query.isAvailable = true;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by popular
    if (popular === 'true') {
      query.isPopular = true;
    }

    const safaris = await SafariPackage.find(query)
      .sort({ isPopular: -1, price: 1 });

    res.json({
      success: true,
      count: safaris.length,
      safaris
    });

  } catch (error) {
    console.error('Get safaris error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching safari packages'
    });
  }
};

/**
 * @desc    Get single safari package
 * @route   GET /api/safaris/:id
 * @access  Public
 */
const getSafari = async (req, res) => {
  try {
    const safari = await SafariPackage.findById(req.params.id);

    if (!safari) {
      return res.status(404).json({
        success: false,
        message: 'Safari package not found'
      });
    }

    res.json({
      success: true,
      safari
    });

  } catch (error) {
    console.error('Get safari error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching safari package'
    });
  }
};

/**
 * @desc    Create new safari package
 * @route   POST /api/safaris
 * @access  Private/Admin
 */
const createSafari = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      duration,
      maxGuests,
      minGuests,
      image,
      features,
      includes,
      schedule,
      isAvailable,
      isPopular,
      category,
      requirements
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !duration || !maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if package with same name exists
    const existingPackage = await SafariPackage.findOne({ name });
    if (existingPackage) {
      return res.status(400).json({
        success: false,
        message: 'Safari package with this name already exists'
      });
    }

    // Create package
    const safari = await SafariPackage.create({
      name,
      description,
      shortDescription,
      price,
      duration,
      maxGuests,
      minGuests,
      image,
      features,
      includes,
      schedule,
      isAvailable,
      isPopular,
      category,
      requirements
    });

    res.status(201).json({
      success: true,
      message: 'Safari package created successfully',
      safari
    });

  } catch (error) {
    console.error('Create safari error:', error);
    
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
      message: 'Server error creating safari package'
    });
  }
};

/**
 * @desc    Update safari package
 * @route   PUT /api/safaris/:id
 * @access  Private/Admin
 */
const updateSafari = async (req, res) => {
  try {
    const safari = await SafariPackage.findById(req.params.id);

    if (!safari) {
      return res.status(404).json({
        success: false,
        message: 'Safari package not found'
      });
    }

    // Update fields
    const updateFields = [
      'name', 'description', 'shortDescription', 'price', 'duration',
      'maxGuests', 'minGuests', 'image', 'features', 'includes',
      'schedule', 'isAvailable', 'isPopular', 'category', 'requirements'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        safari[field] = req.body[field];
      }
    });

    await safari.save();

    res.json({
      success: true,
      message: 'Safari package updated successfully',
      safari
    });

  } catch (error) {
    console.error('Update safari error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating safari package'
    });
  }
};

/**
 * @desc    Delete safari package
 * @route   DELETE /api/safaris/:id
 * @access  Private/Admin
 */
const deleteSafari = async (req, res) => {
  try {
    const safari = await SafariPackage.findById(req.params.id);

    if (!safari) {
      return res.status(404).json({
        success: false,
        message: 'Safari package not found'
      });
    }

    await safari.deleteOne();

    res.json({
      success: true,
      message: 'Safari package deleted successfully'
    });

  } catch (error) {
    console.error('Delete safari error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting safari package'
    });
  }
};

/**
 * @desc    Toggle safari availability
 * @route   PATCH /api/safaris/:id/toggle
 * @access  Private/Admin
 */
const toggleAvailability = async (req, res) => {
  try {
    const safari = await SafariPackage.findById(req.params.id);

    if (!safari) {
      return res.status(404).json({
        success: false,
        message: 'Safari package not found'
      });
    }

    safari.isAvailable = !safari.isAvailable;
    await safari.save();

    res.json({
      success: true,
      message: `Safari package is now ${safari.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: safari.isAvailable
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling availability'
    });
  }
};

/**
 * @desc    Seed default safari packages
 * @route   POST /api/safaris/seed
 * @access  Private/Admin
 */
const seedSafaris = async (req, res) => {
  try {
    const defaultPackages = [
      {
        name: 'Big Five Morning Safari',
        description: 'Experience the thrill of tracking the Big Five (lion, leopard, rhino, elephant, and buffalo) in their natural habitat. Our expert guides will take you through the best viewing spots during the golden morning hours when wildlife is most active.',
        shortDescription: 'Track the Big Five during the golden morning hours',
        price: 1200,
        duration: '4 hours',
        maxGuests: 8,
        minGuests: 2,
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
        features: ['Expert ranger guide', 'Open safari vehicle', 'Refreshments included', 'Small groups'],
        includes: ['Morning coffee & snacks', 'Bottled water', 'Binoculars', 'Park fees'],
        schedule: {
          startTime: '05:30',
          endTime: '09:30',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: true,
        category: 'morning',
        requirements: ['Comfortable clothing', 'Closed shoes', 'Sun hat', 'Camera']
      },
      {
        name: 'Family Afternoon Safari',
        description: 'A child-friendly safari experience designed for families. Our patient guides tailor the experience for all ages, ensuring everyone has a memorable time while learning about African wildlife.',
        shortDescription: 'Child-friendly safari perfect for the whole family',
        price: 950,
        duration: '3 hours',
        maxGuests: 6,
        minGuests: 2,
        image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800&q=80',
        features: ['Family-friendly guide', 'Educational focus', 'Flexible pace', 'Child seats available'],
        includes: ['Juice & snacks', 'Activity booklet', 'Junior ranger certificate'],
        schedule: {
          startTime: '14:00',
          endTime: '17:00',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: true,
        category: 'afternoon',
        requirements: ['Sun protection', 'Comfortable shoes']
      },
      {
        name: 'Night Safari Drive',
        description: 'Experience the African bush after dark. Using spotlights, track nocturnal animals like leopards, hyenas, and bush babies. The night safari offers a completely different perspective of the wild.',
        shortDescription: 'Discover nocturnal wildlife under the African stars',
        price: 1400,
        duration: '3 hours',
        maxGuests: 6,
        minGuests: 2,
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc12044d2?w=800&q=80',
        features: ['Spotlight tracking', 'Nocturnal wildlife', 'Star gazing', 'Night vision equipment'],
        includes: ['Warm drinks', 'Snacks', 'Blankets', 'Safety briefing'],
        schedule: {
          startTime: '19:00',
          endTime: '22:00',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: true,
        category: 'night',
        requirements: ['Warm jacket', 'Closed shoes', 'Insect repellent']
      },
      {
        name: 'Private Tour',
        description: 'Enjoy an exclusive safari experience with your own private vehicle and guide. Perfect for special occasions, photography enthusiasts, or those seeking a personalized adventure.',
        shortDescription: 'Exclusive private vehicle and dedicated guide',
        price: 2500,
        duration: 'Full day',
        maxGuests: 4,
        minGuests: 1,
        image: 'https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=800&q=80',
        features: ['Private vehicle', 'Dedicated guide', 'Custom itinerary', 'Flexible timing'],
        includes: ['Full day vehicle', 'Private guide', 'Gourmet lunch', 'Premium drinks'],
        schedule: {
          startTime: 'Flexible',
          endTime: 'Flexible',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: false,
        category: 'private',
        requirements: ['Advance booking required']
      },
      {
        name: 'Bird Watching Safari',
        description: 'UmZulu is home to over 350 bird species. Our specialist birding guide will help you spot everything from majestic raptors to colorful bee-eaters in their natural habitats.',
        shortDescription: 'Spot over 350 bird species with expert guides',
        price: 800,
        duration: '3 hours',
        maxGuests: 6,
        minGuests: 2,
        image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
        features: ['Birding specialist', 'High-quality binoculars', 'Species checklist', 'Best viewing spots'],
        includes: ['Binoculars', 'Bird guide book', 'Coffee & tea', 'Checklist'],
        schedule: {
          startTime: '06:00',
          endTime: '09:00',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: false,
        category: 'specialty',
        requirements: ['Neutral colored clothing', 'Camera with zoom lens optional']
      },
      {
        name: 'Walking Safari',
        description: 'Experience the bush on foot with our armed rangers. Learn tracking skills, identify plants and insects, and feel the thrill of being close to nature.',
        shortDescription: 'Explore the bush on foot with armed rangers',
        price: 700,
        duration: '2 hours',
        maxGuests: 8,
        minGuests: 2,
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&q=80',
        features: ['Armed ranger guide', 'Tracking lessons', 'Botanical education', 'Close encounters'],
        includes: ['Safety briefing', 'Walking stick', 'Water', 'First aid kit'],
        schedule: {
          startTime: '07:00',
          endTime: '09:00',
          meetingPoint: 'Main Lodge Reception'
        },
        isAvailable: true,
        isPopular: false,
        category: 'specialty',
        requirements: ['Good fitness level', 'Closed hiking shoes', 'Long pants', 'Age 16+']
      }
    ];

    // Clear existing packages
    await SafariPackage.deleteMany({});
    
    // Insert new packages
    const created = await SafariPackage.insertMany(defaultPackages);

    res.json({
      success: true,
      message: `Seeded ${created.length} safari packages`,
      packages: created
    });

  } catch (error) {
    console.error('Seed safaris error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error seeding safari packages'
    });
  }
};

module.exports = {
  getSafaris,
  getSafari,
  createSafari,
  updateSafari,
  deleteSafari,
  toggleAvailability,
  seedSafaris
};
