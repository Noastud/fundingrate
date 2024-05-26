// File: backend/fetchData.js
const axios = require('axios');
const mongoose = require('mongoose');

const fundingRateSchema = new mongoose.Schema({
  timestamp: Date,
  rate: Number,
  pair: String,
});

const arbitrageOpportunitySchema = new mongoose.Schema({
  timestamp: Date,
  pair: String,
  rateDifference: Number,
  opportunityDetails: String,
});

const FundingRate = mongoose.model('FundingRate', fundingRateSchema);
const ArbitrageOpportunity = mongoose.model('ArbitrageOpportunity', arbitrageOpportunitySchema);

async function fetchFundingRates() {
  const response = await axios.get('KRACKEN_API_URL_1');
  // Process and store data in MongoDB
  const data = response.data; // Adapt this line to the actual API response
  const fundingRates = data.map(item => ({
    timestamp: new Date(item.timestamp),
    rate: item.rate,
    pair: item.pair,
  }));
  await FundingRate.insertMany(fundingRates);
}

async function fetchArbitrageOpportunities() {
  const response = await axios.get('KRACKEN_API_URL_2');
  // Process and store data in MongoDB
  const data = response.data; // Adapt this line to the actual API response
  const opportunities = data.map(item => ({
    timestamp: new Date(item.timestamp),
    pair: item.pair,
    rateDifference: item.rateDifference,
    opportunityDetails: item.details,
  }));
  await ArbitrageOpportunity.insertMany(opportunities);
}

setInterval(fetchFundingRates, 60000); // Fetch every minute
setInterval(fetchArbitrageOpportunities, 60000); // Fetch every minute
