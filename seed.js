const mongoose = require('mongoose');
const connectDB = require('./config');

const bloodBanks = [
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
      'AB-': { available: true, quantity: 0 },
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
      'O-': { available: true, quantity: 0 }
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
  },
  {
    name: "Memorial Sloan Kettering Blood Donor Room",
    address: "1275 York Avenue, New York, NY 10065",
    location: {
      type: "Point",
      coordinates: [-73.9557, 40.7644]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 10 },
      'A-': { available: true, quantity: 5 },
      'B+': { available: true, quantity: 8 },
      'B-': { available: true, quantity: 4 },
      'AB+': { available: true, quantity: 3 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 6 }
    },
    contact: {
      phone: "(212) 639-7643",
      email: "blooddonor@mskcc.org"
    },
    operatingHours: {
      open: "8:30 AM",
      close: "4:30 PM"
    }
  },
  {
    name: "Northwestern Memorial Hospital Blood Bank",
    address: "251 E Huron St, Chicago, IL 60611",
    location: {
      type: "Point",
      coordinates: [-87.6218, 41.8947]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 14 },
      'A-': { available: true, quantity: 7 },
      'B+': { available: true, quantity: 11 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 18 },
      'O-': { available: true, quantity: 9 }
    },
    contact: {
      phone: "(312) 926-2000",
      email: "bloodbank@nm.org"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  },
  {
    name: "UCLA Blood & Platelet Center",
    address: "1045 Gayley Ave, Los Angeles, CA 90024",
    location: {
      type: "Point",
      coordinates: [-118.4452, 34.0635]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 0 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 13 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 22 },
      'O-': { available: true, quantity: 11 }
    },
    contact: {
      phone: "(310) 825-0888",
      email: "bloodcenter@mednet.ucla.edu"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "6:00 PM"
    }
  },
  {
    name: "Stanford Blood Center",
    address: "3373 Hillview Ave, Palo Alto, CA 94304",
    location: {
      type: "Point",
      coordinates: [-122.1430, 37.4171]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 17 },
      'A-': { available: true, quantity: 0},
      'B+': { available: true, quantity: 14 },
      'B-': { available: true, quantity: 7 },
      'AB+': { available: true, quantity: 6 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 24 },
      'O-': { available: true, quantity: 12 }
    },
    contact: {
      phone: "(650) 723-7831",
      email: "bloodcenter@stanford.edu"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  },
  {
    name: "MD Anderson Blood Bank",
    address: "1515 Holcombe Blvd, Houston, TX 77030",
    location: {
      type: "Point",
      coordinates: [-95.3977, 29.7070]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 13 },
      'A-': { available: true, quantity: 7 },
      'B+': { available: true, quantity: 11 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 19 },
      'O-': { available: true, quantity: 9 }
    },
    contact: {
      phone: "(713) 792-7777",
      email: "bloodbank@mdanderson.org"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "5:00 PM"
    }
  },
  {
    name: "Mayo Clinic Blood Donor Center",
    address: "200 First St SW, Rochester, MN 55905",
    location: {
      type: "Point",
      coordinates: [-92.4666, 44.0225]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 21 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(507) 284-4475",
      email: "blooddonor@mayo.edu"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "6:00 PM"
    }
  },
  {
    name: "Cleveland Clinic Blood Bank",
    address: "9500 Euclid Ave, Cleveland, OH 44195",
    location: {
      type: "Point",
      coordinates: [-81.6205, 41.5025]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 14 },
      'A-': { available: true, quantity: 7 },
      'B+': { available: true, quantity: 11 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 20 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(216) 444-1240",
      email: "bloodbank@ccf.org"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "5:00 PM"
    }
  },
  {
    name: "Johns Hopkins Blood Bank",
    address: "1800 Orleans St, Baltimore, MD 21287",
    location: {
      type: "Point",
      coordinates: [-76.5922, 39.2976]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 16 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 13 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 0 },
      'O+': { available: true, quantity: 22 },
      'O-': { available: true, quantity: 11 }
    },
    contact: {
      phone: "(410) 955-5000",
      email: "bloodbank@jhmi.edu"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  },
  {
    name: "Massachusetts General Hospital Blood Bank",
    address: "55 Fruit St, Boston, MA 02114",
    location: {
      type: "Point",
      coordinates: [-71.0689, 42.3601]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 21 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(617) 726-2000",
      email: "bloodbank@mgh.harvard.edu"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "6:00 PM"
    }
  },
  {
    name: "UCSF Medical Center Blood Bank",
    address: "505 Parnassus Ave, San Francisco, CA 94143",
    location: {
      type: "Point",
      coordinates: [-122.4574, 37.7629]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 14 },
      'A-': { available: true, quantity: 7 },
      'B+': { available: true, quantity: 11 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 20 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(415) 476-1000",
      email: "bloodbank@ucsf.edu"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  },
  {
    name: "Duke University Hospital Blood Bank",
    address: "2301 Erwin Rd, Durham, NC 27710",
    location: {
      type: "Point",
      coordinates: [-78.9382, 36.0014]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 13 },
      'A-': { available: true, quantity: 6 },
      'B+': { available: true, quantity: 10 },
      'B-': { available: true, quantity: 5 },
      'AB+': { available: true, quantity: 4 },
      'AB-': { available: true, quantity: 2 },
      'O+': { available: true, quantity: 18 },
      'O-': { available: true, quantity: 9 }
    },
    contact: {
      phone: "(919) 684-8111",
      email: "bloodbank@duke.edu"
    },
    operatingHours: {
      open: "8:00 AM",
      close: "5:00 PM"
    }
  },
  {
    name: "UPMC Presbyterian Blood Bank",
    address: "200 Lothrop St, Pittsburgh, PA 15213",
    location: {
      type: "Point",
      coordinates: [-79.9628, 40.4418]
    },
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B+': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 6 },
      'AB+': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 3 },
      'O+': { available: true, quantity: 21 },
      'O-': { available: true, quantity: 10 }
    },
    contact: {
      phone: "(412) 647-7000",
      email: "bloodbank@upmc.edu"
    },
    operatingHours: {
      open: "7:00 AM",
      close: "7:00 PM"
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await mongoose.connection.collection('bloodbanks').deleteMany({});
    
    // Insert new data
    await mongoose.connection.collection('bloodbanks').insertMany(bloodBanks);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 