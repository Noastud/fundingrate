const axios = require('axios');
const { saveFundingRates, saveArbitrageOpportunities } = require('./database');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundingRateSchema = new mongoose.Schema({
  timestamp: Date,
  rate: Number,
  pair: String,
});
const FundingRate = mongoose.model('FundingRate', fundingRateSchema);

const arbitrageOpportunitySchema = new mongoose.Schema({
  timestamp: Date,
  pair: String,
  rateDifference: Number,
  opportunityDetails: String,
});
const ArbitrageOpportunity = mongoose.models.ArbitrageOpportunity || mongoose.model('ArbitrageOpportunity', arbitrageOpportunitySchema);


async function fetchFuturesFundingRates() {
  try {
    const response = await axios.get('https://api.kraken.com/0/public/FundingRates');
    const fundingRates = response.data.result;

    const filteredRates = fundingRates.filter(rate => rate.symbol === 'BTCUSD');
    await saveFundingRates(filteredRates);
  } catch (error) {
    console.error('Error fetching futures funding rates:', error);
  }
}

async function storeArbitrageOpportunity(opportunity) {
  await saveArbitrageOpportunities(opportunity);
}

async function fetchSpotRates() {
  try {
    const response = await axios.get('https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD,XXBTZEUR');
    const data = response.data;
    const usdRate = parseFloat(data.result.XXBTZUSD.c[0]);
    const eurRate = parseFloat(data.result.XXBTZEUR.c[0]);
    return { usdRate, eurRate };
  } catch (error) {
    console.error('Error fetching spot rates:', error);
    return null;
  }
}

async function fetchArbitrageOpportunities() {
  const spotRates = await fetchSpotRates();
  if (!spotRates) return;

  const { usdRate, eurRate } = spotRates;
  const rateDifference = usdRate - eurRate;
  const opportunity = {
    timestamp: new Date(),
    pair: 'BTC/USD-EUR',
    rateDifference,
    opportunityDetails: `Buy in EUR at ${eurRate} and sell in USD at ${usdRate}`,
  };

  try {
    await ArbitrageOpportunity.create(opportunity);
    console.log('Arbitrage opportunity stored:', opportunity);
  } catch (error) {
    console.error('Error storing arbitrage opportunity:', error);
  }
}

setInterval(fetchFuturesFundingRates, 60000); // Fetch every minute
setInterval(fetchArbitrageOpportunities, 60000); // Fetch every minute

module.exports = {
  fetchFuturesFundingRates,
  fetchSpotRates,
  fetchArbitrageOpportunities,
  storeArbitrageOpportunity,
  ArbitrageOpportunity,
};
