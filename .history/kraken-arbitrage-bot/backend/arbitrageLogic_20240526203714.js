const mongoose = require('mongoose');
const sendDiscordNotification = require('./discordBot');

const FundingRate = mongoose.model('FundingRate');
const ArbitrageOpportunity = mongoose.model('ArbitrageOpportunity');

async function analyzeArbitrage() {
  try {
    const fundingRates = await FundingRate.find().sort({ timestamp: -1 }).limit(2);
    if (fundingRates.length < 2) return;

    const [latestRate, previousRate] = fundingRates;
    const rateDifference = latestRate.rate - previousRate.rate;

    if (rateDifference > 0.01) { // Define your threshold for arbitrage opportunity
      const opportunity = {
        timestamp: new Date(),
        pair: latestRate.pair,
        rateDifference,
        opportunityDetails: `Rate increased from ${previousRate.rate} to ${latestRate.rate}`,
      };
      await ArbitrageOpportunity.create(opportunity);
      sendDiscordNotification(`Arbitrage opportunity detected: ${opportunity.opportunityDetails}`);
      console.log('Arbitrage opportunity detected:', opportunity);
    }
  } catch (error) {
    console.error('Error analyzing arbitrage:', error);
  }
}

setInterval(analyzeArbitrage, 60000); // Analyze every minute

module.exports = analyzeArbitrage;
