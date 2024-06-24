const express = require('express');
const router = express.Router();
const { fetchMarketPricesAndSaveArbitrageOpportunities } = require('../fetchData');

// Route to trigger arbitrage opportunities fetching and saving
router.get('/update', async (req, res) => {
  try {
    await fetchMarketPricesAndSaveArbitrageOpportunities();
    res.status(200).send('Arbitrage opportunities updated successfully');
  } catch (error) {
    res.status(500).send('Error updating arbitrage opportunities');
  }
});

module.exports = router;
