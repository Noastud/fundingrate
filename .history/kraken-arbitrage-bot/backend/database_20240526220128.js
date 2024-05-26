const mongoose = require('mongoose');

// Verbindung zur MongoDB herstellen
mongoose.connect('mongodb://localhost:27017/arbitrage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema und Model für Arbitrage Opportunities definieren
const arbitrageOpportunitySchema = new mongoose.Schema({
  timestamp: Date,
  pair: String,
  rateDifference: Number,
  opportunityDetails: String,
});

const ArbitrageOpportunity = mongoose.model('ArbitrageOpportunity', arbitrageOpportunitySchema);

// Funktion zum Speichern von Funding Rates (Anpassung je nach Struktur)
async function saveFundingRates(fundingRates) {
  // Implementieren Sie die Logik zum Speichern von Funding Rates
  console.log('Funding rates saved:', fundingRates);
}

// Funktion zum Speichern von Arbitrage Opportunities
async function saveArbitrageOpportunities(opportunity) {
  const arbitrageOpportunity = new ArbitrageOpportunity(opportunity);
  await arbitrageOpportunity.save();
  console.log('Arbitrage opportunity saved:', opportunity);
}

module.exports = {
  saveFundingRates,
  saveArbitrageOpportunities,
};
