const tickers = require('./tickers');
const Screener = require('./Screener');

let screeners = [];
let screenerData = [];
const getScreenerData = () => screenerData || [];

const start = async () => {
    const futuresTickers = await tickers.getFuturesTickers();

    for (const ticker of futuresTickers) {
        const screener = new Screener(ticker.instId);
        const isScreenerInitialized = await screener.init();

        if (isScreenerInitialized) {
            screeners.push(screener);
        }
    }

    setInterval(() => {
        screenerData = screeners.map(i => i.getTickerData()) || [];
    }, 1000 * 2);
}

module.exports  = {
    start,
    getScreenerData
}
