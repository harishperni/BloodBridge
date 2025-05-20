const mongoose = require('mongoose');
const connectDB = require('./config');

// Blood Bank Schema
const bloodBankSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  bloodTypes: {
    'A+': { available: Boolean, quantity: Number },
    'A-': { available: Boolean, quantity: Number },
    'B+': { available: Boolean, quantity: Number },
    'B-': { available: Boolean, quantity: Number },
    'AB+': { available: Boolean, quantity: Number },
    'AB-': { available: Boolean, quantity: Number },
    'O+': { available: Boolean, quantity: Number },
    'O-': { available: Boolean, quantity: Number }
  },
  contact: {
    phone: String,
    email: String
  },
  operatingHours: {
    open: String,
    close: String
  },
  lastUpdated: { type: Date, default: Date.now }
});

bloodBankSchema.index({ location: '2dsphere' });

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

// Sample data
const sampleBloodBanks = [
  {
    name: "City Central Blood Bank",
    address: "123 Main Street, Downtown",
    location: {
      type: "Point",
      coordinates: [-73.935242, 40.730610]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 12 },
      'B-': { available: false, quantity: 0 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: false, quantity: 0 },
      'O+': { available: true, quantity: 20 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "555-0101",
      email: "central@bloodbank.com"
    },
    operatingHours: {
      open: "08:00",
      close: "20:00"
    }
  },
  {
    name: "Metro Blood Center",
    address: "456 Park Avenue, Midtown",
    location: {
      type: "Point",
      coordinates: [-73.985130, 40.748817]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 10 },
      'A-': { available: true, quantity: 5 },
      'B+': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 7 },
      'AB+': { available: true, quantity: 3 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 15 },
      'O-': { available: true, quantity: 8 }
    },
    contact: {
      phone: "555-0102",
      email: "metro@bloodbank.com"
    },
    operatingHours: {
      open: "07:00",
      close: "19:00"
    }
  },
  {
    name: "Emergency Blood Services",
    address: "789 Broadway, Lower Manhattan",
    location: {
      type: "Point",
      coordinates: [-74.006015, 40.712776]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'A-': { available: true, quantity: 12 },
      'B+': { available: true, quantity: 18 },
      'B-': { available: true, quantity: 9 },
      'AB+': { available: true, quantity: 7 },
      'AB-': { available: true, quantity: 4 },
      'O+': { available: true, quantity: 30 },
      'O-': { available: true, quantity: 15 }
    },
    contact: {
      phone: "555-0103",
      email: "emergency@bloodservices.com"
    },
    operatingHours: {
      open: "24/7",
      close: "24/7"
    }
  },
  {
    name: "Community Blood Center",
    address: "321 5th Avenue, Upper East Side",
    location: {
      type: "Point",
      coordinates: [-73.965355, 40.782865]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 8 },
      'A-': { available: false, quantity: 0 },
      'B+': { available: true, quantity: 14 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: false, quantity: 0 },
      'O+': { available: true, quantity: 22 },
      'O-': { available: true, quantity: 11 }
    },
    contact: {
      phone: "555-0104",
      email: "community@bloodcenter.com"
    },
    operatingHours: {
      open: "09:00",
      close: "17:00"
    }
  },
  {
    name: "Brooklyn Blood Bank",
    address: "567 Atlantic Avenue, Brooklyn",
    location: {
      type: "Point",
      coordinates: [-73.985656, 40.684555]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 20 },
      'A-': { available: true, quantity: 10 },
      'B+': { available: true, quantity: 16 },
      'B-': { available: true, quantity: 8 },
      'AB+': { available: true, quantity: 6 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 25 },
      'O-': { available: true, quantity: 12 }
    },
    contact: {
      phone: "555-0105",
      email: "brooklyn@bloodbank.com"
    },
    operatingHours: {
      open: "08:00",
      close: "18:00"
    }
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await BloodBank.deleteMany({});
    console.log('Cleared existing blood bank data');
    
    // Insert sample data
    const result = await BloodBank.insertMany(sampleBloodBanks);
    console.log(`Successfully seeded ${result.length} blood banks`);
    
    // Verify the data
    const count = await BloodBank.countDocuments();
    console.log(`Total blood banks in database: ${count}`);
    
    // Show sample query results
    const nearbyBanks = await BloodBank.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          $maxDistance: 5000
        }
      }
    });
    console.log('\nNearby blood banks:');
    console.log(JSON.stringify(nearbyBanks, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 