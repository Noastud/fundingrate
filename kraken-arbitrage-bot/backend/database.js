const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arbitrageBot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB', { location: 'connectDB', file: 'database.js' });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { location: 'connectDB', file: 'database.js', error: error.message });
    process.exit(1);
  }
};

module.exports = { connectDB };
