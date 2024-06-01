import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FundingRates() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/api/funding-rates');
      setRates(response.data);
    }
    fetchData();
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
          {rates.map(rate => (
            <tr key={rate.timestamp}>
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
