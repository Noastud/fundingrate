const express = require('express');
const router = express.Router();
const { saveSpotData } = require('../fetchData');

// Route to trigger spot data fetching and saving
router.get('/update', async (req, res) => {
  try {
    await saveSpotData();
    res.status(200).send('Spot data updated successfully');
  } catch (error) {
    res.status(500).send('Error updating spot data');
  }
});

module.exports = router;
