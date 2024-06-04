const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  pair: String,
  price: Number,
  timestamp: Date,
});

module.exports = mongoose.models.Spot || mongoose.model('Spot', spotSchema);
