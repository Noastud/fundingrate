// File: src/components/FundingRates.js
import React, { useEffect, useState } from 'react';
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
  );
}

export default FundingRates;
