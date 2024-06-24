const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arbitrageBot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error', { error: error.message });
    throw error;
  }
};

module.exports = { connectDB };
