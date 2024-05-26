import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FundingRates() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    async function fetchFundingRates() {
      try {
        const response = await axios.get('/api/funding-rates');
        setRates(response.data);
      } catch (error) {
        console.error('Error fetching funding rates:', error);
      }
    }
    fetchFundingRates();
  }, []);

  return (
    <div>
      <h2>Funding Rates</h2>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Rate</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, index) => (
            <tr key={index}>
              <td>{rate.pair}</td>
              <td>{rate.rate}</td>
              <td>{new Date(rate.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FundingRates;
