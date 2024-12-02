const okx = require('okx-api')
const models = require('./models')


const startLiquidationsStream = () => {
    const client = new okx.WebsocketClient({market: 'prod'})

    client.subscribe({
        channel: 'liquidation-orders',
        'instType': 'SWAP'
    })

    client.on('update', (eventData) => {
        setTimeout(() => {
            eventData.data.forEach(i => {
                i.details.forEach(d => {
                    setTimeout(() => {
                        models.Liquidation
                            .create({
                                symbol: i.instFamily,
                                time: parseInt(d.ts),
                                price: d.bkPx,
                                size: parseFloat(d.sz),
                                side: d.posSide?.toUpperCase(),
                                exchange: 'OKX-FUTURES-SWAP'
                            })
                            .catch(err => console.log(err?.message))
                    })
                })
            })
        })
    })
}


const getLiquidations = async (symbol, timeFrom) => {
    const liquidations = await models.Liquidation.find({symbol, time: {$gt: timeFrom}})

    return liquidations || []
}

module.exports = {
    startLiquidationsStream,
    getLiquidations
}
