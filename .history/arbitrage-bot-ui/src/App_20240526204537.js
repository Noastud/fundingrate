import React from 'react';
import FundingRates from './components/FundingRates';
import ArbitrageOpportunities from './components/ArbitrageOpportunities';

function App() {
  return (
    <div>
      <h1>Kraken Funding Rate Arbitrage Bot</h1>
      <FundingRates />
      <ArbitrageOpportunities />
    </div>
  );
}

export default App;
