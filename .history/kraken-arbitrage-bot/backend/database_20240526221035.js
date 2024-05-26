const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/arbitrage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const arbitrageOpportunitySchema = new mongoose.Schema({
  timestamp: Date,
  pair: String,
  rateDifference: Number,
  opportunityDetails: String,
});

const ArbitrageOpportunity = mongoose.model('ArbitrageOpportunity', arbitrageOpportunitySchema);

async function saveFundingRates(fundingRates) {
  console.log('Funding rates saved:', fundingRates);
}

async function saveArbitrageOpportunities(opportunity) {
  const arbitrageOpportunity = new ArbitrageOpportunity(opportunity);
  await arbitrageOpportunity.save();
  console.log('Arbitrage opportunity saved:', opportunity);
}

module.exports = {
  saveFundingRates,
  saveArbitrageOpportunities,
};
