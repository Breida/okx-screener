require('dotenv').config();
const logger = require('../logger');

const {analyzeNews} = require('./ai-analyzer');
const {authorizeTelegram, getChannelHistory, subscribeToChannel} = require('./tg-news-provider')
const { isNewsInDatabase, saveNewsToDatabaseIfNotExists } = require('./db-news-service');

const { TG_NEWS_CHANNEL_NAME_ARRAY } = process.env;

async function startNewsProcession() {
    const telegramClient = await authorizeTelegram();

    const processNewsCallback = async (message, channelName) => {
        try {
            const newsText = message.message;
            const messageId = message.id;
            const internalMessageId = `${channelName.toLowerCase()}-${messageId}`;

            const isExisting = await isNewsInDatabase(internalMessageId);
            if (isExisting) {
                logger.info(`Skipping tg post #${internalMessageId} as it already exist in database.`);
                return;
            }

            const analysisState = await analyzeNews(newsText);

            if (!analysisState.isValid) {
                logger.info(`Skipping tg post #${internalMessageId} was not interpreted as a piece of news.`);
                return;
            }

            const newsToSave = {
                id: internalMessageId,
                text: newsText,
                originalPostUrl: `https://t.me/${channelName.toLowerCase()}/${messageId}`,
                analysis: analysisState,
                date: message.date,
            };

            saveNewsToDatabaseIfNotExists(newsToSave);
        }
        catch (err) {
            logger.error(`Error happened during procession of message #${internalMessageId}`, {
                message: err.message,
                stack: err.stack
              });

            throw err;
        }
    };

    const channelNames = TG_NEWS_CHANNEL_NAME_ARRAY.split(',').map(item => item.trim());
    for (const channelName of channelNames) {
        subscribeToChannel(telegramClient, channelName, processNewsCallback);

        const messages = await getChannelHistory(telegramClient, channelName, 20);

        for (const message of messages) {
            processNewsCallback(message, channelName);
        }
    }
}

module.exports = { startNewsProcession };