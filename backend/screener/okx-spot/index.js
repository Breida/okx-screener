const tickers = require('./tickers')
const Screener = require('./Screener')


let screeners = []
let screenerData = []
const getScreenerData = () => screenerData || []

const start = async () => {
    const fTickers = await tickers.getFuturesTickers()

    for (const i in fTickers.slice(0, 10)) {
        const ticker = fTickers[i]
        const screener = new Screener(ticker.instId)
        const isInit = await screener.init()
        if (isInit) screeners.push(screener)
    }

    setInterval(() => {
        screenerData = screeners.map(i => i.getTickerData()) || []
    }, 1000 * 2)
}

module.exports  = {
    start,
    getScreenerData
}
