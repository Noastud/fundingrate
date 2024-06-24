require('dotenv').config();
const express = require('express');
const { connectDB } = require('./database');
const logger = require('./logger');
const {
  saveFuturesData,
  saveSpotData,
  fetchMarketPricesAndSaveArbitrageOpportunities
} = require('./fetchData');

// Connect to MongoDB
connectDB().then(() => {
  logger.info('Connected to MongoDB');
  // Manually trigger data fetching
  saveFuturesData();
  saveSpotData();
  fetchMarketPricesAndSaveArbitrageOpportunities();
}).catch((error) => {
  logger.error('Error connecting to MongoDB', { error: error.message });
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { location: 'server.js' });
});

// Routes
const futuresRoutes = require('./routes/futuresRoutes');
const spotRoutes = require('./routes/spotRoutes');
const arbitrageRoutes = require('./routes/arbitrageRoutes');

app.use('/futures', futuresRoutes);
app.use('/spot', spotRoutes);
app.use('/arbitrage', arbitrageRoutes);

// Manual routes to trigger data fetching
app.get('/fetch-futures', async (req, res) => {
  try {
    await saveFuturesData();
    res.status(200).send('Futures data fetched and saved successfully');
  } catch (error) {
    logger.error('Error fetching futures data', { error: error.message });
    res.status(500).send('Error fetching futures data');
  }
});

app.get('/fetch-spot', async (req, res) => {
  try {
    await saveSpotData();
    res.status(200).send('Spot data fetched and saved successfully');
  } catch (error) {
    logger.error('Error fetching spot data', { error: error.message });
    res.status(500).send('Error fetching spot data');
  }
});

app.get('/fetch-arbitrage', async (req, res) => {
  try {
    await fetchMarketPricesAndSaveArbitrageOpportunities();
    res.status(200).send('Arbitrage opportunities fetched and saved successfully');
  } catch (error) {
    logger.error('Error fetching arbitrage opportunities', { error: error.message });
    res.status(500).send('Error fetching arbitrage opportunities');
  }
});

module.exports = app;
