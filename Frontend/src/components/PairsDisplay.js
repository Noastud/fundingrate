import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PairsDisplay = () => {
  const [futuresPairs, setFuturesPairs] = useState([]);
  const [spotPairs, setSpotPairs] = useState([]);

  useEffect(() => {
    const fetchFuturesPairs = async () => {
      try {
        const response = await axios.get('/api/futures-pairs');
        setFuturesPairs(response.data);
      } catch (error) {
        console.error('Error fetching futures pairs:', error);
      }
    };

    const fetchSpotPairs = async () => {
      try {
        const response = await axios.get('/api/spot-pairs');
        setSpotPairs(response.data);
      } catch (error) {
        console.error('Error fetching spot pairs:', error);
      }
    };

    fetchFuturesPairs();
    fetchSpotPairs();
  }, []);

  return (
    <div>
      <h2>Futures Pairs</h2>
      <ul>
        {futuresPairs.map((pair) => (
          <li key={pair._id}>{pair.pair} - {pair.tag}</li>
        ))}
      </ul>

      <h2>Spot Pairs</h2>
      <ul>
        {spotPairs.map((pair) => (
          <li key={pair._id}>{pair.pair} - {pair.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default PairsDisplay;
