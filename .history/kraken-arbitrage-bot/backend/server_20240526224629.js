const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { fetchFuturesFundingRates, fetchArbitrageOpportunities } = require('./fetchData');
const analyzeArbitrage = require('./arbitrageLogic');
const sendDiscordNotification = require('./discordBot');
const FundingRate = require('./models/FundingRate'); // Importiere das FundingRate Modell
const ArbitrageOpportunity = require('./models/ArbitrageOpportunity'); // Importiere das ArbitrageOpportunity Modell

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/arbitrageBot', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Beispielroute zum Senden einer DM
app.get('/sendNotification', async (req, res) => {
  const userId = 'klimbamimbs'; // Ersetze durch die tatsächliche Benutzer-ID
  const message = 'This is a test notification!';
  await sendDiscordNotification(message, userId);
  res.send('Notification sent');
});

// Optional: Endpunkte zum Auslösen des Datenabrufs oder der Analyse
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
