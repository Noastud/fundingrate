import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FundingRates from './components/FundingRates';
import ArbitrageOpportunities from './components/ArbitrageOpportunities';

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Kraken Funding Rate Arbitrage Bot</h1>
          <nav>
            <Link to="/funding-rates"><button>Funding Rates</button></Link>
            <Link to="/arbitrage-opportunities"><button>Arbitrage Opportunities</button></Link>
          </nav>
        </header>
        <div className="container">
          <Switch>
            <Route path="/funding-rates">
              <FundingRates />
            </Route>
            <Route path="/arbitrage-opportunities">
              <ArbitrageOpportunities />
            </Route>
            <Route path="/">
              <h2>Welcome to the Kraken Funding Rate Arbitrage Bot</h2>
              <p>Select a view to see the data.</p>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
