const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const app = express();

// Configuration
const openaiKey = '';
const openaiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Middleware
app.use(bodyParser.json());
app.use(morgan('combined')); // Logging requests

// Route handling for news analysis
app.post('/analyze-news', async (req, res) => {
    const userMessage = req.body.message.trim();

    // Check for cached response
    const cacheKey = response-${userMessage};
    const cached = myCache.get(cacheKey);
    
    if (cached) {
        return res.json({ reply: cached });
    }

    const processedMessage = preprocessText(userMessage); // Preprocess and clean the news text

    let messages = [
        {'role': 'system', 'content': 'Отпиши новость и дай ей оценку по десятибальной шкале по степени важности.'},
        {'role': 'user', 'content': processedMessage},
        {'role': 'assistant', 'content': ''}
    ];

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages
    };

    const headers = {
        'Authorization': ''},
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(openaiUrl, payload, {headers: headers});
        const reply = response.data.choices[0].message.content;

       
        myCache.set(cacheKey, reply); // Caching the response

        res.json({ reply });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).send('Error processing your request');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});