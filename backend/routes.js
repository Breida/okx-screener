const express = require('express');
const router = express.Router();
const screener = require('./screener');
const liquidations = require('./screener/liquidations');
const aiNewsAnalyzer = require('./ai-news-analyzer');

router.get('/okx-futures-tickers', async (req, res) => {
    res.json(screener.okxFutures.getScreenerData());
});

router.get('/okx-spot-tickers', async (req, res) => {
    res.json(screener.okxSpot.getScreenerData());
});

router.get('/liquidations', async (req, res) => {
    const query = req.query;

    if (!query?.timeFrom) {
        return res.status(400).json({ error: `'timeFrom' parameter is required.` });
    }

    const result = await liquidations.getLiquidations(query.symbol, parseInt(query.timeFrom));
    console.log('Liquidations request fulfilled.');

    return res.json(result);
});

router.get('/analyzed-news', async (req, res) => {
    const query = req.query;
    if (!query?.last) {
        return res.status(400).json({ error: `'last' parameter is required.` });
    }

    const analyzedNews = await aiNewsAnalyzer.getLastNews(query.last);
    res.json(analyzedNews);
});

module.exports = router;