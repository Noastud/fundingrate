const express = require('express');
const router = express.Router();

// Beispielroute
router.get('/', (req, res) => {
  res.send('Futures endpoint');
});

module.exports = router;
