const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { fetchFuturesFundingRates, fetchArbitrageOpportunities } = require('./fetchData');
const analyzeArbitrage = require('./arbitrageLogic');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/arbitrageBot', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Optionally, add endpoints to trigger data fetching or analysis
app.get('/api/funding-rates', async (req, res) => {
  const fundingRates = await FundingRate.find().sort({ timestamp: -1 }).limit(100);
  res.json(fundingRates);
});

app.get('/api/arbitrage-opportunities', async (req, res) => {
  const opportunities = await ArbitrageOpportunity.find().sort({ timestamp: -1 }).limit(100);
  res.json(opportunities);
});

app.get('/fetchFundingRates', async (req, res) => {
  await fetchFuturesFundingRates();
  res.send('Funding rates fetched');
});

app.get('/fetchArbitrageOpportunities', async (req, res) => {
  await fetchArbitrageOpportunities();
  res.send('Arbitrage opportunities fetched');
});

app.get('/analyzeArbitrage', async (req, res) => {
  await analyzeArbitrage();
  res.send('Arbitrage analysis complete');
});
