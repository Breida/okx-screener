const okxFutures = require('./okx-futures');
const okxSpot = require('./okx-spot');
const liquidations = require('./liquidations');

const start = async () => {
    await liquidations.startLiquidationsStream();
    await okxFutures.start();
    await okxSpot.start();
}

module.exports = {
    start,
    okxFutures,
    okxSpot
}
