/**
 * UmZulu Wildtrack - Database Seeder
 * Seed initial data for development/testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./database');
const SafariPackage = require('../models/SafariPackage');
const Admin = require('../models/Admin');

// Default safari packages
const defaultSafaris = [
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
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
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

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seed...\n');
    
    // Clear existing safari packages
    await SafariPackage.deleteMany({});
    console.log('✅ Cleared existing safari packages');
    
    // Insert new safari packages
    const createdSafaris = await SafariPackage.insertMany(defaultSafaris);
    console.log(`✅ Created ${createdSafaris.length} safari packages`);
    
    // Create default admin if not exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        email: 'admin@umzuluwildtrack.co.za',
        role: 'admin'
      });
      console.log('✅ Created default admin user (username: admin, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSafari Packages:');
    createdSafaris.forEach(safari => {
      console.log(`  • ${safari.name} - R${safari.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
