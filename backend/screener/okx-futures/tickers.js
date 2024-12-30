const okx = require('okx-api');

const client = new okx.RestClient();

const getFuturesTickers = async () => {
    try {
        const result = await client.getTickers('SWAP');
        console.log('OKX FUTURES tickers length: ', result.length);

        return result;
    } catch (e) {
        console.log('Error happened during spot tickers procession:', e.message);
        return getFuturesTickers();
    }

}

module.exports = { getFuturesTickers }
