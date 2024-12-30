module.exports = (candles, period) => {

    const highs = candles.map(i => typeof i[2] === 'string' ? parseFloat(i[2]) : i[2]);
    const lows = candles.map(i => typeof i[3] === 'string' ? parseFloat(i[3]) : i[3]);
    const closes = candles.map(i => typeof i[4] === 'string' ? parseFloat(i[4]) : i[4]);

    const atr = [];
    const tr = [];

    for (let i = 0; i < highs.length; i++) {
        if (i === 0) {
            tr.push(highs[i] - lows[i]);
        }
        else {
            const highMinusLow = Math.abs(highs[i] - lows[i]);
            const highMinusPrevClose = Math.abs(highs[i] - closes[i - 1]);
            const lowMinusPrevClose = Math.abs(lows[i] - closes[i - 1]);
            const trueRange = Math.max(highMinusLow, highMinusPrevClose, lowMinusPrevClose);
            tr.push(trueRange);
        }
        if (i >= period) {
            let sum = 0;
            for (let j = i - period; j <= i; j++) {
                sum += tr[j];
            }
            const average = sum / period;
            atr.push(average);
        }
    }

    return atr;
}
