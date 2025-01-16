const okx = require('okx-api');
const logger = require('../../logger');

const client = new okx.RestClient();

const getFuturesTickers = async (retries = 5) => {
    try {
        const result = await client.getTickers('SPOT');

        if (result.length === 0) {
            logger.warn('No tickers received from API.');
            return [];
        }

        const usdtTickers = result.filter(i => i.instId.includes('USDT'));

        logger.info(`OKX SPOT tickers length: ${usdtTickers.length}`);

        return usdtTickers;
    } catch (err) {
        logger.error('Error fetching spot tickers:', {
            message: err.message,
            stack: err.stack
          });

        if (retries > 0) {
            logger.info(`Retrying... Attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));

            return getFuturesTickers(retries - 1);
        }

        throw new Error('Failed to fetch tickers after multiple attempts.');
    }
}

module.exports = { getFuturesTickers };
