const https = require('follow-redirects').https;
const mongoose = require('mongoose');
const Futures = require('./models/Futures');
const Spot = require('./models/Spot');

function fetchFuturesTickers() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'futures.kraken.com',
      path: '/derivatives/api/v3/tickers',
      headers: {
        'Accept': 'application/json',
      },
      maxRedirects: 20,
    };

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.end();
  });
}

async function saveFuturesData() {
  try {
    const data = await fetchFuturesTickers();
    if (data.result !== 'success') {
      throw new Error('Failed to fetch futures data');
    }

    const futuresData = data.tickers.map(ticker => ({
      tag: ticker.tag,
      pair: ticker.pair,
      symbol: ticker.symbol,
    }));

    await Futures.insertMany(futuresData);
    console.log('Futures data saved');
  } catch (error) {
    console.error('Error saving futures data:', error);
  }
}

function convertPairFormat(pair) {
  return pair.replace(':', '/');
}

function fetchSpotPrice(pair) {
  return new Promise((resolve, reject) => {
    const convertedPair = convertPairFormat(pair);
    const options = {
      method: 'GET',
      hostname: 'api.kraken.com',
      path: `/0/public/Ticker?pair=${convertedPair}`,
      headers: {
        'Accept': 'application/json',
      },
      maxRedirects: 20,
    };

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.end();
  });
}

async function saveSpotData() {
  try {
    const futuresPairs = await Futures.find({});
    for (const future of futuresPairs) {
      const spotData = await fetchSpotPrice(future.pair);
      const pairKey = Object.keys(spotData.result)[0];
      const price = parseFloat(spotData.result[pairKey].c[0]);
      const spotRecord = {
        pair: convertPairFormat(future.pair),
        price,
        timestamp: new Date(),
      };
      await Spot.create(spotRecord);
      console.log(`Spot data saved for pair: ${future.pair}`);
    }
  } catch (error) {
    console.error('Error saving spot data:', error);
  }
}

mongoose.connect('mongodb://localhost:27017/arbitrageBot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

setInterval(saveFuturesData, 60000); // Fetch and save futures data every minute
setInterval(saveSpotData, 60000); // Fetch and save spot data every minute

module.exports = {
  fetchFuturesTickers,
  saveFuturesData,
  fetchSpotPrice,
  saveSpotData,
};
