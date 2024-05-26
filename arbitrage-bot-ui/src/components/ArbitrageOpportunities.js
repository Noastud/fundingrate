import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ArbitrageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    async function fetchArbitrageOpportunities() {
      try {
        const response = await axios.get('/api/arbitrage-opportunities');
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching arbitrage opportunities:', error);
      }
    }
    fetchArbitrageOpportunities();
  }, []);

  return (
    <div>
      <h2>Arbitrage Opportunities</h2>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Rate Difference</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opportunity, index) => (
            <tr key={index}>
              <td>{opportunity.pair}</td>
              <td>{opportunity.rateDifference}</td>
              <td>{opportunity.opportunityDetails}</td>
              <td>{new Date(opportunity.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArbitrageOpportunities;
