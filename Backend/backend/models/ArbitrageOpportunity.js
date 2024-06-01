// backend/models/ArbitrageOpportunity.js
const mongoose = require('mongoose');

const arbitrageOpportunitySchema = new mongoose.Schema({
  pair: String,
  futurePrice: Number,
  spotPrice: Number,
  discrepancyAbsolute: Number,
  discrepancyRelative: Number,
  fundingRate: Number,
  timestamp: Date,
});

module.exports = mongoose.models.ArbitrageOpportunity || mongoose.model('ArbitrageOpportunity', arbitrageOpportunitySchema);
