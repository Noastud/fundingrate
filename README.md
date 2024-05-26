
= SPEC-001: Kraken Funding Rate Arbitrage Bot
:sectnums:
:toc:

== Background

The goal of this project is to create a locally hosted web application using Node.js that serves as a funding rate arbitrage bot for the Kraken cryptocurrency exchange. This bot will monitor funding rates in real-time, identify arbitrage opportunities, and alert users to these opportunities. In the future, the application may be expanded to include other exchanges, but the initial focus is solely on Kraken.

== Requirements

*Must Have:*
- Real-time data fetching from Kraken
- Display of funding rates and arbitrage opportunities
- Notification system using Discord for alerting on potential arbitrage opportunities

*Should Have:*
- Dashboard with charts to visualize funding rates
- Tables to list arbitrage opportunities
- Basic and clean design using a popular UI framework like React

*Could Have:*
- Historical data analysis
- Advanced user settings and preferences
- Integration with other exchanges

*Won't Have:*
- User authentication and registration (single-user system)
- Expansion to other exchanges (initially)

== Method

=== Architecture Design

The application will be designed using a modular architecture to ensure scalability and ease of maintenance. The primary components of the architecture are:

1. **Frontend**: A React-based user interface.
2. **Backend**: A Node.js server to handle API requests and business logic.
3. **Database**: MongoDB for storing historical funding rates and arbitrage opportunities.
4. **APIs**: Integration with Kraken's APIs for fetching real-time data.
5. **Notification System**: Integration with Discord to send alerts.

[plantuml]
@startuml
package "Frontend" {
  [React Application]
}

package "Backend" {
  [Node.js Server]
  [Arbitrage Module]
}

package "Database" {
  [MongoDB]
}

package "External APIs" {
  [Kraken API 1]
  [Kraken API 2]
}

package "Notification System" {
  [Discord Bot]
}

[React Application] --> [Node.js Server] : "User Interactions"
[Node.js Server] --> [Arbitrage Module] : "Arbitrage Logic"
[Node.js Server] --> [MongoDB] : "Data Storage"
[Arbitrage Module] --> [Kraken API 1] : "Fetch Real-time Data"
[Arbitrage Module] --> [Kraken API 2] : "Fetch Real-time Data"
[Arbitrage Module] --> [Discord Bot] : "Send Notifications"
@enduml

=== Database Schema

The MongoDB database will have the following collections:

1. **FundingRates**: To store funding rates fetched from Kraken.
2. **ArbitrageOpportunities**: To store identified arbitrage opportunities.

Schema definitions:

```javascript
// FundingRates collection schema
const fundingRateSchema = new mongoose.Schema({
  timestamp: Date,
  rate: Number,
  pair: String
});

// ArbitrageOpportunities collection schema
const arbitrageOpportunitySchema = new mongoose.Schema({
  timestamp: Date,
  pair: String,
  rateDifference: Number,
  opportunityDetails: String
});
```

=== Components

1. **React Application**: Provides the user interface for interacting with the bot, including dashboards, charts, and tables.
2. **Node.js Server**: Handles API requests and implements the business logic for arbitrage.
3. **Arbitrage Module**: Implements the logic for fetching data from Kraken, analyzing funding rates, and identifying arbitrage opportunities.
4. **Notification System**: Sends alerts to users about potential arbitrage opportunities via Discord.

== Implementation

=== Step 1: Setup Development Environment
1. Install Node.js and npm (Node Package Manager) on your local machine.
2. Install MongoDB and start the MongoDB server.
3. Set up a new Node.js project and initialize it with `npm init`.
4. Install necessary dependencies:
   ```bash
   npm install express mongoose axios
   npm install react react-dom
   npm install @discordjs/rest discord-api-types discord.js
   ```

=== Step 2: Develop Backend
1. **Initialize Express Server**:
   - Create an Express server to handle API requests.

   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const bodyParser = require('body-parser');

   const app = express();
   app.use(bodyParser.json());

   mongoose.connect('mongodb://localhost:27017/arbitrageBot', { useNewUrlParser: true, useUnifiedTopology: true });

   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

2. **Fetch and Store Data from Kraken**:
   - Use Axios to fetch data from Kraken APIs and store it in MongoDB.

   ```javascript
   const axios = require('axios');

   async function fetchFundingRates() {
     const response = await axios.get('KRACKEN_API_URL_1');
     // Process and store data in MongoDB
   }

   async function fetchArbitrageOpportunities() {
     const response = await axios.get('KRACKEN_API_URL_2');
     // Process and store data in MongoDB
   }

   setInterval(fetchFundingRates, 60000); // Fetch every minute
   setInterval(fetchArbitrageOpportunities, 60000); // Fetch every minute
   ```

3. **Discord Notification System**:
   - Set up a Discord bot and use it to send notifications.

   ```javascript
   const { Client, Intents } = require('discord.js');
   const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

   client.once('ready', () => {
     console.log('Discord bot is ready');
   });

   async function sendDiscordNotification(message) {
     const channel = client.channels.cache.get('YOUR_DISCORD_CHANNEL_ID');
     if (channel) {
       channel.send(message);
     }
   }

   client.login('YOUR_DISCORD_BOT_TOKEN');
   ```

4. **Arbitrage Logic**:
   - Implement the logic to analyze funding rates and identify arbitrage opportunities.

   ```javascript
   function analyzeArbitrage() {
     // Fetch data from MongoDB, analyze it, and identify opportunities
     // Use sendDiscordNotification to alert users
   }

   setInterval(analyzeArbitrage, 60000); // Analyze every minute
   ```

=== Step 3: Develop Frontend
1. **Create React Application**:
   - Set up a new React application to provide the user interface.

   ```bash
   npx create-react-app arbitrage-bot-ui
   cd arbitrage-bot-ui
   npm start
   ```

2. **Develop UI Components**:
   - Implement components for displaying funding rates and listing arbitrage opportunities.

   ```jsx
   // Example: Display Funding Rates Component
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
   ```

=== Step 4: Testing and Deployment
1. **Testing**:
   - Test each component and integration point thoroughly.
   - Perform system testing to ensure all requirements are met.

2. **Deployment**:
   - Deploy the Node.js server and MongoDB instance locally.
   - Serve the React application using a tool like `serve`.

   ```bash
   npm install -g serve
   serve -s build
   ```

== Milestones

1. **Week 1**: Setup development environment and create initial project structure.
2. **Week 2**: Implement backend services including data fetching and notification system.
3. **Week 3**: Develop frontend components and integrate with backend.
4. **Week 4**: Implement arbitrage logic and finalize the application.
5. **Week 5**: Testing and deployment.

== Gathering Results

To evaluate whether the requirements were addressed properly and the performance of the system post-production:
1. **User Feedback**: Collect feedback on the usability and effectiveness of the bot.
2. **System Monitoring**: Monitor the performance and accuracy of arbitrage detection.
3. **Bug Fixes and Enhancements**: Address any issues and implement necessary improvements based on feedback.
