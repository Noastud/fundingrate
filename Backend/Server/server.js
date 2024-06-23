const express = require('express');
const { connectDB } = require('./database');
const fetchData = require('./fetchData');
const logger = require('./logger');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { location: 'server.js' });
});

// Routes
const futuresRoutes = require('./routes/futuresRoutes');
const spotRoutes = require('./routes/spotRoutes');
const arbitrageRoutes = require('./routes/arbitrageRoutes');

app.use('/futures', futuresRoutes);
app.use('/spot', spotRoutes);
app.use('/arbitrage', arbitrageRoutes);

module.exports = app;
