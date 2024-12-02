const okx = require('okx-api')
const ta = require('../ta')


class Screener {
    coin = ''
    symbol = ''
    price = 0
    open24h = 0
    volume = 0
    quoteVolume = 0
    founding = ''
    candles_1m = []
    candles_5m = []
    wsClient
    restClient

    constructor(symbol) {
        this.wsClient = new okx.WebsocketClient({market: 'prod'})
        this.restClient = new okx.RestClient()
        this.symbol = symbol
        this.coin = symbol.split('-')?.[0]
    }

    async init () {
        try {
            this.candles_1m = await this.getCandles('1m', 100)
            this.candles_5m = await this.getCandles('5m', 100)
            this.candles_1m.reverse()
            this.candles_5m.reverse()
            this.startStream()
            return true
        } catch (e) {
            return false
        }
    }

    getPivotPoints (candles, prevIndex, nextIndex) {
        const points = []
        let sLineAdded = false
        let rLineAdded = false
        const reversedCandles = JSON.parse(JSON.stringify(candles))
        reversedCandles.reverse()

        for (let index = 0; index < reversedCandles.length; index++) {
            const c = reversedCandles[index]
            const currentCandle = reversedCandles[0]
            const currentPrice = parseFloat(currentCandle[4])


            if (index >= prevIndex && index + nextIndex <= candles.length -1) {
                const nextCandle = reversedCandles[index + 1]
                const nextCandleHigh = parseFloat(nextCandle[2])
                const nextCandleLow = parseFloat(nextCandle[3])
                const prevCandles = reversedCandles.slice(index - prevIndex, index)
                const nextCandles = reversedCandles.slice(index + 1, index + nextIndex)
                const candleLow = parseFloat(c[3])
                const candleHigh = parseFloat(c[2])

                const prevCandlesMin = Math.min(...prevCandles.map(i => parseFloat(i[3])))
                const prevCandlesMax = Math.max(...prevCandles.map(i => parseFloat(i[2])))

                const nextCandlesMin = Math.min(...nextCandles.map(i => parseFloat(i[3])))
                const nextCandlesMax = Math.max(...nextCandles.map(i => parseFloat(i[2])))

                if (candleLow <= prevCandlesMin && candleLow <= nextCandlesMin && candleLow < currentPrice && candleLow < nextCandleLow) {
                    if(sLineAdded)  {
                        const pointsMin = Math.min(...points)
                        if (candleLow < pointsMin - pointsMin * 0.002) points.push(candleLow)
                    } else {
                        points.push(candleLow)
                    }
                    sLineAdded = true
                }

                if (candleHigh >= prevCandlesMax && candleHigh >= nextCandlesMax && candleHigh > currentPrice && candleHigh > nextCandleHigh) {
                    if(rLineAdded)  {
                        const pointsMax = Math.max(...points)
                        if (candleHigh > pointsMax + pointsMax * 0.002) points.push(candleHigh)
                    } else {
                        points.push(candleHigh)
                    }
                    rLineAdded = true
                }
            }
        }

        return points
    }

    startStream () {

        // Funding rate channel
        // this.wsClient.subscribe({
        //     channel: '',
        //     instId: this.symbol,
        // })

        // Tickers channel
        this.wsClient.subscribe({
            channel: 'tickers',
            instId: this.symbol,
        })

        // Candlesticks channel 1m
        this.wsClient.subscribe({
            channel: 'candle1m',
            instId: this.symbol,
        })

        // Candlesticks channel 5m
        this.wsClient.subscribe({
            channel: 'candle5m',
            instId: this.symbol,
        })

        this.wsClient.on('update', (eventData) => {
            setTimeout(() => {
                if (eventData.arg?.channel === 'funding-rate') {
                    this.founding = eventData.data[0]?.fundingRate
                }

                if (eventData.arg?.channel === 'tickers') {
                    const data = eventData.data[0] || {}
                    this.price = parseFloat(data.last)
                    this.open24h = parseFloat(data.open24h)
                    this.volume = parseFloat(data.volCcy24h)
                    this.quoteVolume = this.volume * this.price
                }

                if (eventData.arg?.channel === 'candle1m') {
                    let lastCandleIndex = this.candles_1m.length - 1
                    let lastCandleTime = this.candles_1m[lastCandleIndex][0]
                    const candle = eventData.data[0] || []

                    if (candle[0] !== lastCandleTime) {
                        this.candles_1m.push(candle)
                        this.candles_1m.shift()
                    }
                }

                if (eventData.arg?.channel === 'candle5m') {
                    let lastCandleIndex = this.candles_5m.length - 1
                    let lastCandleTime = this.candles_5m[lastCandleIndex][0]
                    const candle = eventData.data[0] || []
                    if (candle[0] !== lastCandleTime) {
                        this.candles_5m.push(candle)
                        this.candles_5m.shift()
                    }
                }
            })
        })
    }


    async getCandles (interval, limit) {
        return this.restClient.getCandles(this.symbol, interval, { limit })
    }

    getTickerData () {
        return {
            exchange: 'OKX-SPOT',
            coin: this.coin,
            symbol: this.symbol,
            price: this.price,
            changePercent: ta.getDifferencePercent(this.open24h, this.price),
            volume: this.volume,
            quoteVolume: this.quoteVolume,
            founding: parseFloat(this.founding) * 100,
            NART_1m: ta.getAtr(this.candles_1m.slice(this.candles_1m.length - 31, this.candles_1m.length - 1), 29) * 100 / this.price,
            NART_5m: ta.getAtr(this.candles_5m.slice(this.candles_5m.length - 13, this.candles_5m.length - 1), 11) * 100 / this.price,
            points5min: this.getPivotPoints(this.candles_5m, 10, 11),
            points1min: this.getPivotPoints(this.candles_1m, 10, 21),
        }
    }
}


module.exports = Screener
