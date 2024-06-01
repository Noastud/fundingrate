const express = require('express');
const { connectDB } = require('./database');
const { saveFuturesData, saveSpotData, fetchMarketPricesAndSaveArbitrageOpportunities } = require('./fetchData');
const Futures = require('./models/Futures');
const Spot = require('./models/Spot');
const ArbitrageOpportunity = require('./models/ArbitrageOpportunity');
const logger = require('./logger');
require('dotenv').config();

// Connect to MongoDB
connectDB();
const app = express();

app.use(express.json());

app.listen(3000, () => {
  logger.info('Server running on port 3000', { location: 'server.js', file: 'server.js' });
});

// Rate limiting for logging
let lastLogTimeFutures = 0;
let lastLogTimeSpot = 0;
const logInterval = 60000; // 1 minute

setInterval(() => {
  const currentTime = Date.now();
  
  if (currentTime - lastLogTimeFutures > logInterval) {
    lastLogTimeFutures = currentTime;
    logger.info('Saving futures data...', { location: 'setInterval', file: 'server.js' });
  }
  
  saveFuturesData().catch(error => logger.error(`Error saving futures data: ${error.message}`, { location: 'setInterval', file: 'server.js' }));
}, 60000); // Fetch and save futures data every minute

setInterval(() => {
  const currentTime = Date.now();
  
  if (currentTime - lastLogTimeSpot > logInterval) {
    lastLogTimeSpot = currentTime;
    logger.info('Saving spot data...', { location: 'setInterval', file: 'server.js' });
  }
  
  saveSpotData().catch(error => logger.error(`Error saving spot data: ${error.message}`, { location: 'setInterval', file: 'server.js' }));
}, 15000); // Fetch and save spot data every minute

app.get('/fetchFundingRates', async (req, res) => {
  try {
    logger.info('Fetching funding rates...', { location: 'fetchFundingRates', file: 'server.js' });
    await saveFuturesData();
    res.send('Funding rates fetched and saved');
    logger.info('Funding rates fetched and saved successfully', { location: 'fetchFundingRates', file: 'server.js' });
  } catch (error) {
    logger.error(`Error fetching funding rates: ${error.message}`, { location: 'fetchFundingRates', file: 'server.js' });
    res.status(500).send('Error fetching funding rates');
  }
});

app.get('/fetchSpotRates', async (req, res) => {
  try {
    logger.info('Fetching spot rates...', { location: 'fetchSpotRates', file: 'server.js' });
    await saveSpotData();
    res.send('Spot rates fetched and saved');
    logger.info('Spot rates fetched and saved successfully', { location: 'fetchSpotRates', file: 'server.js' });
  } catch (error) {
    logger.error(`Error fetching spot rates: ${error.message}`, { location: 'fetchSpotRates', file: 'server.js' });
    res.status(500).send('Error fetching spot rates');
  }
});

// New endpoint to fetch futures pairs
app.get('/api/futures-pairs', async (req, res) => {
  try {
    logger.info('Fetching futures pairs...', { location: 'api/futures-pairs', file: 'server.js' });
    const pairs = await Futures.find({});
    res.json(pairs);
    logger.info('Futures pairs fetched successfully', { location: 'api/futures-pairs', file: 'server.js' });
  } catch (error) {
    logger.error(`Error fetching futures pairs: ${error.message}`, { location: 'api/futures-pairs', file: 'server.js' });
    res.status(500).send('Error fetching futures pairs');
  }
});

// New endpoint to fetch spot pairs
app.get('/api/spot-pairs', async (req, res) => {
  try {
    logger.info('Fetching spot pairs...', { location: 'api/spot-pairs', file: 'server.js' });
    const pairs = await Spot.find({});
    res.json(pairs);
    logger.info('Spot pairs fetched successfully', { location: 'api/spot-pairs', file: 'server.js' });
  } catch (error) {
    logger.error(`Error fetching spot pairs: ${error.message}`, { location: 'api/spot-pairs', file: 'server.js' });
    res.status(500).send('Error fetching spot pairs');
  }
});

// Endpoint to fetch funding rates
app.get('/api/funding-rates', async (req, res) => {
  try {
    logger.info('Fetching funding rates...', { location: 'api/funding-rates', file: 'server.js' });
    const rates = await ArbitrageOpportunity.find({});
    res.json(rates);
    logger.info('Funding rates fetched successfully', { location: 'api/funding-rates', file: 'server.js' });
  } catch (error) {
    logger.error(`Error fetching funding rates: ${error.message}`, { location: 'api/funding-rates', file: 'server.js' });
    res.status(500).send('Error fetching funding rates');
  }
});

module.exports = app;
