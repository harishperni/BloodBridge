const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const connectDB = require('./config');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// OpenStreetMap Nominatim API for geocoding
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

// Google Places API configuration
const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const GOOGLE_PLACES_DETAILS_API = 'https://maps.googleapis.com/maps/api/place/details/json';

// Sample blood bank data with more locations
const sampleBloodBanks = [
  {
    name: "New York Blood Center",
    address: "310 East 67th Street, New York, NY 10065",
    location: {
      type: "Point",
      coordinates: [-73.9619, 40.7648]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 20 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(212) 570-3000",
      email: "info@nybc.org"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "8:00 PM"
    }
  },
  {
    name: "American Red Cross - Manhattan",
    address: "520 West 49th Street, New York, NY 10019",
    location: {
      type: "Point",
      coordinates: [-73.9911, 40.7645]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 18 },
      'A-': { available: true, quantity: 9 },
      'B+': { available: true, quantity: 14 },
      'B-': { available: true, quantity: 7 },
      'AB+': { available: true, quantity: 6 },
      'AB-': { available: true, quantity: 4 },
      'O+': { available: true, quantity: 25 },
      'O-': { available: true, quantity: 12 }
    },
    contact: {
      phone: "(212) 875-2000",
      email: "manhattan@redcross.org"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  },
  {
    name: "Chicago Blood Center",
    address: "2200 W Harrison St, Chicago, IL 60612",
    location: {
      type: "Point",
      coordinates: [-87.6748, 41.8747]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 12 },
      'A-': { available: true, quantity: 6 },
      'B+': { available: true, quantity: 10 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 15 },
      'O-': { available: true, quantity: 8 }
    },
    contact: {
      phone: "(312) 942-4000",
      email: "info@chicagoblood.org"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "8:00 PM"
    }
  }
];

// Blood Bank Schema
const bloodBankSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
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

// Helper function to get coordinates from address
async function getCoordinates(address) {
  try {
    const response = await axios.get(NOMINATIM_API, {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'BloodBridge/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

// Helper function to search for blood banks using Google Places API
async function searchBloodBanks(location) {
  try {
    const response = await axios.get(GOOGLE_PLACES_API, {
      params: {
        query: `blood bank ${location}`,
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.results) {
      const bloodBanks = await Promise.all(
        response.data.results.map(async (place) => {
          // Get additional details for each place
          const detailsResponse = await axios.get(GOOGLE_PLACES_DETAILS_API, {
            params: {
              place_id: place.place_id,
              fields: 'name,formatted_address,formatted_phone_number,opening_hours,website',
              key: process.env.GOOGLE_PLACES_API_KEY
            }
          });

          const details = detailsResponse.data.result;
          return {
            name: place.name,
            address: place.formatted_address,
            location: {
              type: 'Point',
              coordinates: [place.geometry.location.lng, place.geometry.location.lat]
            },
            contact: {
              phone: details.formatted_phone_number || 'Not available',
              website: details.website || 'Not available'
            },
            operatingHours: details.opening_hours ? {
              open: details.opening_hours.open_now ? 'Open' : 'Closed',
              periods: details.opening_hours.periods
            } : 'Hours not available',
            bloodTypes: {
              'A+': { available: true, quantity: Math.floor(Math.random() * 20) + 1 },
              'A-': { available: true, quantity: Math.floor(Math.random() * 10) + 1 },
              'B+': { available: true, quantity: Math.floor(Math.random() * 20) + 1 },
              'B-': { available: true, quantity: Math.floor(Math.random() * 10) + 1 },
              'AB+': { available: true, quantity: Math.floor(Math.random() * 10) + 1 },
              'AB-': { available: true, quantity: Math.floor(Math.random() * 5) + 1 },
              'O+': { available: true, quantity: Math.floor(Math.random() * 30) + 1 },
              'O-': { available: true, quantity: Math.floor(Math.random() * 15) + 1 }
            }
          };
        })
      );
      return bloodBanks;
    }
    return [];
  } catch (error) {
    console.error('Error searching blood banks:', error);
    return [];
  }
}

// API Routes
app.get('/api/blood-banks/nearby', async (req, res) => {
  try {
    const { searchTerm, radius = 5000 } = req.query;
    console.log('Search term:', searchTerm);
    
    if (searchTerm) {
      // First try to find in MongoDB
      const query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      const bloodBanks = await BloodBank.find(query);
      if (bloodBanks.length > 0) {
        return res.json(bloodBanks);
      }

      // If no results in MongoDB, return sample data
      if (/^\d{5}$/.test(searchTerm)) {
        // NYC ZIP codes
        if (['10001', '10019', '10065'].includes(searchTerm)) {
          return res.json(sampleBloodBanks.filter(bank => 
            bank.address.includes('New York') || bank.address.includes('Manhattan')
          ));
        }
        // Chicago ZIP codes
        if (['60601', '60612'].includes(searchTerm)) {
          return res.json(sampleBloodBanks.filter(bank => 
            bank.address.includes('Chicago')
          ));
        }
      }
      
      // Check for city names
      const searchTermLower = searchTerm.toLowerCase();
      if (searchTermLower.includes('new york') || searchTermLower.includes('nyc') || searchTermLower.includes('manhattan')) {
        return res.json(sampleBloodBanks.filter(bank => 
          bank.address.includes('New York') || bank.address.includes('Manhattan')
        ));
      }
      if (searchTermLower.includes('chicago')) {
        return res.json(sampleBloodBanks.filter(bank => 
          bank.address.includes('Chicago')
        ));
      }
    }

    // If no specific search term or no results found, return all blood banks
    const allBloodBanks = await BloodBank.find({});
    return res.json(allBloodBanks.length > 0 ? allBloodBanks : sampleBloodBanks);
  } catch (error) {
    console.error('Error fetching blood banks:', error);
    res.status(500).json({ 
      error: 'Error fetching blood banks',
      details: error.message 
    });
  }
});

app.get('/api/blood-banks/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Use OpenStreetMap's Nominatim service for geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${query} blood bank`,
        format: 'json',
        limit: 10
      },
      headers: {
        'User-Agent': 'BloodBridge/1.0'
      }
    });

    const places = response.data.map(place => ({
      name: place.display_name.split(',')[0],
      address: place.display_name,
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      },
      placeId: place.place_id
    }));

    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blood-banks/all', async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({});
    console.log('All blood banks:', bloodBanks); // Debug log
    res.json(bloodBanks);
  } catch (error) {
    console.error('Error fetching all blood banks:', error);
    res.status(500).json({ 
      error: 'Error fetching blood banks',
      details: error.message 
    });
  }
});

// Add new blood bank
app.post('/api/blood-banks', async (req, res) => {
  try {
    const bloodBank = new BloodBank(req.body);
    await bloodBank.save();
    res.status(201).json(bloodBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update blood bank
app.put('/api/blood-banks/:id', async (req, res) => {
  try {
    const bloodBank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bloodBank) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }
    res.json(bloodBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete blood bank
app.delete('/api/blood-banks/:id', async (req, res) => {
  try {
    const bloodBank = await BloodBank.findByIdAndDelete(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }
    res.json({ message: 'Blood bank deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

let server;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
  console.error('Unhandled Rejection:', err);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}); 