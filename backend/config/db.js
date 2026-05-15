const mongoose = require('mongoose');

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kfood');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit on auth error, keep server running for static routes
    console.log('Server continuing without DB...');
  }
};

module.exports = connectDB;
