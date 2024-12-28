require('dotenv').config();

const { OpenAI } = require('openai');
const { z } = require('zod');
const { zodResponseFormat } = require('openai/helpers/zod');
const { OPENAI_API_KEY } = process.env;

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
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'system',
          content: `You are a cryptocurrency news analyst. Analyze the given text to determine if it is related to financial markets or cryptocurrency news. 
          If the text is unrelated or not a valid news article, return {"isValid": false}. 
          Otherwise, analyze the news and return the following JSON schema:
          {
            "isValid": true,
            "impact": "positive" | "negative",
            "importance": 1-3,
            "summary": "string"
          }`,
        },
        {
          role: 'user',
          content: `Analyze this news: "${newsText}".`,
        },
      ],
      response_format: zodResponseFormat(responseSchema, 'newsAnalysis'),
    });

    console.log('Validated response:', response.choices[0]);
    return response.choices[0].message.parsed;
  } catch (error) {
    console.error('Error while analyzing the news:', error.message);
    throw error;
  }
}

module.exports = {analyzeNews};