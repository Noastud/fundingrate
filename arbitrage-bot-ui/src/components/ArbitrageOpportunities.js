import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArbitrageOpportunities() {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/api/arbitrage-opportunities');
                setOpportunities(response.data);
            } catch (error) {
                console.error('Error fetching arbitrage opportunities:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2>Arbitrage Opportunities</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pair</th>
                        <th>Future Price</th>
                        <th>Spot Price</th>
                        <th>Discrepancy (Absolute)</th>
                        <th>Discrepancy (Relative)</th>
                        <th>Funding Rate</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {opportunities.map((opportunity, index) => (
                        <tr key={index}>
                            <td>{opportunity.pair}</td>
                            <td>{opportunity.futurePrice}</td>
                            <td>{opportunity.spotPrice}</td>
                            <td>{opportunity.discrepancyAbsolute}</td>
                            <td>{opportunity.discrepancyRelative}%</td>
                            <td>{opportunity.fundingRate}</td>
                            <td>{new Date(opportunity.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ArbitrageOpportunities;
