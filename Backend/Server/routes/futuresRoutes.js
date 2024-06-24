const express = require('express');
const router = express.Router();
const { saveFuturesData } = require('../fetchData');

// Route to trigger futures data fetching and saving
router.get('/update', async (req, res) => {
  try {
    await saveFuturesData();
    res.status(200).send('Futures data updated successfully');
  } catch (error) {
    res.status(500).send('Error updating futures data');
  }
});

module.exports = router;
