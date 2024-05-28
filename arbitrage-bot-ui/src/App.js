import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FundingRates from './components/FundingRates';
import ArbitrageOpportunities from './components/ArbitrageOpportunities';
import PairsDisplay from './components/PairsDisplay';

function App() {
    return (
        <Router>
            <div>
                <header>
                    <h1>Kraken Funding Rate Arbitrage Bot</h1>
                    <nav>
                        <Link to="/funding-rates"><button>Funding Rates</button></Link>
                        <Link to="/arbitrage-opportunities"><button>Arbitrage Opportunities</button></Link>
                        <Link to="/pairs-display"><button>Pairs Display</button></Link>
                    </nav>
                </header>
                <div className="container">
                    <Routes>
                        <Route path="/funding-rates" element={<FundingRates />} />
                        <Route path="/arbitrage-opportunities" element={<ArbitrageOpportunities />} />
                        <Route path="/pairs-display" element={<PairsDisplay />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h2>Welcome to the Kraken Funding Rate Arbitrage Bot</h2>
            <p>Select a view to see the data.</p>
        </div>
    );
}

export default App;
