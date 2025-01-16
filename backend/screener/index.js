const okxFutures = require('./okx-futures');
const okxSpot = require('./okx-spot');
const liquidations = require('./liquidations');

const start = async () => {
    liquidations.startLiquidationsStream();
    okxFutures.start();
    okxSpot.start();
}

module.exports = {
    start,
    okxFutures,
    okxSpot
};
