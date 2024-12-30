const okx = require('okx-api');

const client = new okx.RestClient();

const getFuturesTickers = async (retries = 5) => {
    try {
        const result = await client.getTickers('SWAP');

        if (result.length === 0) {
            console.warn('No tickers received from API.');
            return [];
        }

        console.log('OKX FUTURES tickers length: ', result.length);

        return result;
    } catch (e) {
        console.log('Error spot fetching tickers:', e.message);

        if (retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return getFuturesTickers(retries - 1);
        }

        throw new Error('Failed to fetch tickers after multiple attempts.');
    }
}

module.exports = { getFuturesTickers }
