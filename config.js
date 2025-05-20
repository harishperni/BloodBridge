const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URI = 'mongodb+srv://sebastiananand123:RG4Lrw8dJhgYOHqP@bloodcluster.xbaz7nf.mongodb.net/bloodbridge?retryWrites=true&w=majority&appName=bloodcluster';
        
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 