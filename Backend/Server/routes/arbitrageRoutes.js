const express = require('express');
const router = express.Router();

// Beispielroute
router.get('/', (req, res) => {
  res.send('Arbitrage endpoint');
});

module.exports = router;
