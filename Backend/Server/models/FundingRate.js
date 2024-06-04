const mongoose = require('mongoose');

const fundingRateSchema = new mongoose.Schema({
  timestamp: Date,
  rate: Number,
  pair: String,
});

module.exports = mongoose.model('FundingRate', fundingRateSchema);
