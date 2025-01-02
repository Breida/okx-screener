require('dotenv').config();

const { OpenAI } = require('openai');
const { z } = require('zod');
const { zodResponseFormat } = require('openai/helpers/zod');
const { OPENAI_API_KEY, OPENAI_AI_MODEL } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const responseSchema = z.object({
  isValid: z.boolean(),
  impact: z.enum(['positive', 'negative']).optional(),
  importance: z.enum(['1', '2', '3']).optional(),
  summary: z.string().optional(),
});

async function analyzeNews(newsText) {
  try {
    const response = await openai.beta.chat.completions.parse({
      model: OPENAI_AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a cryptocurrency news analyst. Analyze the given text to determine if it is related to financial markets or cryptocurrency news. 
In "summary" I need only Ticker of a coin ($XXX) and keywords within 1 sentence. 
If there is no specific Coin print "ALL" 
          If the text is unrelated or not a valid news article, return {"isValid": false}. 
          Otherwise, analyze the news and return the following JSON schema:
          {
            "isValid": true,
            "impact": "positive" | "negative",
            "importance": 1-3,
            "summary": "string"
          }
New strength equals percentage of change on a cryptocurrency within a minute. 
1 - is less then 1%
2 - is more than 5%
3 - is more than 10% 
If a coin is listed on Upbit | Coinbase | Binance it's 3
Be more strict about Importance and say 2 or 3 to really significant events`,
        },
        {
          role: 'user',
          content: `Analyze this news: "${newsText}".`,
        },
      ],
      response_format: zodResponseFormat(responseSchema, 'newsAnalysis'),
    });

    return response.choices[0].message.parsed;
  } catch (error) {
    console.error('Error while analyzing the news:', error.message);

    throw error;
  }
}

module.exports = {analyzeNews};