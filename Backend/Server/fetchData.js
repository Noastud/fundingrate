const https = require('follow-redirects').https;
const axios = require('axios');
const mongoose = require('mongoose');
const logger = require('./logger');
const ArbitrageOpportunity = require('./models/ArbitrageOpportunity');
const Futures = require('./models/Futures');
const Spot = require('./models/Spot');

// MongoDB schema and model setup
const SpotDataSchema = new mongoose.Schema({
    pair: String,
    data: Object
}, { timestamps: true });

const FuturesDataSchema = new mongoose.Schema({
    pair: String,
    data: Object
}, { timestamps: true });

const SpotData = mongoose.model('SpotData', SpotDataSchema);
const FuturesData = mongoose.model('FuturesData', FuturesDataSchema);

async function fetchFuturesTickers() {
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
                logger.info('Fetched futures tickers', { location: 'fetchFuturesTickers', file: 'fetchData.js', data: body });
                resolve(JSON.parse(body));
            });

            res.on('error', (error) => {
                logger.error('Error fetching futures tickers', { location: 'fetchFuturesTickers', file: 'fetchData.js', error: error.message });
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

        for (const ticker of data.tickers) {
            const futuresData = {
                tag: ticker.tag,
                pair: ticker.pair,
                symbol: ticker.symbol,
                price: parseFloat(ticker.last),
                fundingRate: ticker.fundingRate !== null ? parseFloat(ticker.fundingRate) : null,
            };

            if (!isNaN(futuresData.price) && futuresData.pair) {
                if (futuresData.fundingRate === null) {
                    logger.warn('Funding rate is null, skipping record', { location: 'saveFuturesData', file: 'fetchData.js', data: futuresData });
                    continue;
                }
                await Futures.updateOne(
                    { pair: futuresData.pair },
                    futuresData,
                    { upsert: true }
                );
                logger.info('Futures data saved', { location: 'saveFuturesData', file: 'fetchData.js', pair: futuresData.pair });
            } else {
                logger.warn('Invalid futures data', { location: 'saveFuturesData', file: 'fetchData.js', data: futuresData });
            }
        }

    } catch (error) {
        logger.error('Error saving futures data', { location: 'saveFuturesData', file: 'fetchData.js', error: error.message });
    }
}

function convertPairFormat(pair) {
    return pair.replace(':', '/');
}

function fetchSpotPrice(pair) {
    return new Promise((resolve, reject) => {
        const convertedPair = convertPairFormat(pair);
        logger.info(`Fetching spot price for ${pair}`, { location: 'fetchSpotPrice', file: 'fetchData.js', pair: pair });
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
                const response = JSON.parse(body);
                if (response.error && response.error.length > 0) {
                    logger.error('Error fetching spot price', { location: 'fetchSpotPrice', file: 'fetchData.js', pair: pair, error: response.error });
                    reject(response.error);
                } else {
                    logger.info(`Fetched spot price for ${pair}`, { location: 'fetchSpotPrice', file: 'fetchData.js', data: body });
                    resolve(response);
                }
            });

            res.on('error', (error) => {
                logger.error('Error fetching spot price', { location: 'fetchSpotPrice', file: 'fetchData.js', pair: pair, error: error.message });
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
            if (isNaN(price)) {
                logger.error(`Invalid spot price for pair: ${future.pair}`, { location: 'saveSpotData', file: 'fetchData.js', pair: future.pair });
                continue;
            }
            const spotRecord = {
                pair: convertPairFormat(future.pair),
                price,
                timestamp: new Date(),
            };
            await Spot.updateOne(
                { pair: spotRecord.pair },
                spotRecord,
                { upsert: true }
            );
            logger.info(`Spot data saved for pair: ${future.pair}`, { location: 'saveSpotData', file: 'fetchData.js', pair: future.pair });
        }
    } catch (error) {
        logger.error('Error saving spot data', { location: 'saveSpotData', file: 'fetchData.js', error: error.message });
    }
}

async function fetchMarketPricesAndSaveArbitrageOpportunities() {
    try {
        const futuresPairs = await Futures.find({});
        for (const future of futuresPairs) {
            const futurePrice = parseFloat(future.price);
            if (isNaN(futurePrice)) {
                logger.error(`Invalid future price for pair: ${future.pair}`, { location: 'fetchMarketPricesAndSaveArbitrageOpportunities', file: 'fetchData.js', pair: future.pair });
                continue;
            }
            const spotPair = convertPairFormat(future.pair);
            const spotData = await fetchSpotPrice(spotPair);
            const pairKey = Object.keys(spotData.result)[0];
            const spotPrice = parseFloat(spotData.result[pairKey].c[0]);

            if (isNaN(spotPrice)) {
                logger.error(`Invalid spot price for pair: ${future.pair}`, { location: 'fetchMarketPricesAndSaveArbitrageOpportunities', file: 'fetchData.js', pair: future.pair });
                continue;
            }

            const discrepancyAbsolute = futurePrice - spotPrice;
            const discrepancyRelative = ((futurePrice - spotPrice) / spotPrice) * 100;
            const fundingRate = parseFloat(future.fundingRate);

            if (isNaN(discrepancyAbsolute) || isNaN(discrepancyRelative) || isNaN(fundingRate)) {
                logger.error(`Invalid calculated values for pair: ${future.pair}`, { location: 'fetchMarketPricesAndSaveArbitrageOpportunities', file: 'fetchData.js', pair: future.pair });
                continue;
            }

            const arbitrageOpportunity = {
                pair: future.pair,
                futurePrice,
                spotPrice,
                discrepancyAbsolute,
                discrepancyRelative,
                fundingRate,
                timestamp: new Date(),
            };

            await ArbitrageOpportunity.create(arbitrageOpportunity);
            logger.info(`Arbitrage opportunity saved for pair: ${future.pair}`, { location: 'fetchMarketPricesAndSaveArbitrageOpportunities', file: 'fetchData.js', pair: future.pair });
        }
    } catch (error) {
        logger.error('Error saving arbitrage opportunities', { location: 'fetchMarketPricesAndSaveArbitrageOpportunities', file: 'fetchData.js', error: error.message });
    }
}

module.exports = {
    fetchFuturesTickers,
    saveFuturesData,
    fetchSpotPrice,
    saveSpotData,
    fetchMarketPricesAndSaveArbitrageOpportunities,
};
