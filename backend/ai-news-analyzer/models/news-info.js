const { Schema, model } = require('mongoose');

const analysisSchema = new Schema({
    isValid: { type: Boolean, required: true },
    impact: { type: String, enum: ['positive', 'negative'], required: false },
    importance: { type: Number, min: 1, max: 3, required: false },
    summary: { type: String, required: false }
});

const schema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    originalPostUrl: { type: String, required: true },
    analysis: { type: analysisSchema, required: true },
    date: { type: Number, required: true }
});

module.exports = model('NewsInfo', schema);