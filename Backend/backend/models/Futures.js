const mongoose = require('mongoose');

const futuresSchema = new mongoose.Schema({
  tag: String,
  pair: String,
  symbol: String,
  price: Number,
  fundingRate: Number,
});

module.exports = mongoose.models.Futures || mongoose.model('Futures', futuresSchema);
