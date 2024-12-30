const { Schema, model } = require('mongoose');

const schema = new Schema({
    symbol: { type: String },
    time: { type: Number },
    price: { type: String },
    size: { type: Number },
    side: { type: String },
    exchange: { type: String },
});

module.exports = model('Liquidation', schema);