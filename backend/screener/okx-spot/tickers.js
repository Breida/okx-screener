const okx = require('okx-api');

const client = new okx.RestClient();

const getFuturesTickers = async () => {
    try {
        const result = await client.getTickers('SPOT');
        const usdtTickers = result.filter(i => i.instId.includes('USDT'));

        console.log('OKX SPOT tickers length: ', usdtTickers.length);

        return usdtTickers;
    } catch (e) {
        console.log('Error happened during spot tickers procession:', e.message);
        return getFuturesTickers();
    }
}

module.exports = { getFuturesTickers }
