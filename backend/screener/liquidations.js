const okx = require('okx-api');
const models = require('./models');

const startLiquidationsStream = () => {
    const client = new okx.WebsocketClient({market: 'prod'});

    client.subscribe({
        channel: 'liquidation-orders',
        'instType': 'SWAP'
    });

    client.on('update', (eventData) => {
        eventData.data.forEach(i => {
            i.details.forEach(d => {
                models.Liquidation.create({
                        symbol: i.instFamily,
                        time: parseInt(d.ts),
                        price: d.bkPx,
                        size: parseFloat(d.sz),
                        side: d.posSide?.toUpperCase(),
                        exchange: 'OKX-FUTURES-SWAP'
                    }).catch(err => {
                    console.log('Error happened during saving of liquidation:', err?.message);
                });
            });
        });
    });
}

const getLiquidations = async (symbol, timeFrom) => {

    if (!symbol) {
        return models.Liquidation.find({time: {$gt: timeFrom}});
    }

    return models.Liquidation.find({symbol, time: {$gt: timeFrom}});
}

module.exports = {
    startLiquidationsStream,
    getLiquidations
}
