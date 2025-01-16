const NewsInfo = require('./models/news-info');
const logger = require('../logger');

async function isNewsInDatabase(id) {
    try {
        const existingNews = await NewsInfo.findOne({ id });
        return !!existingNews;
    } catch (err) {
        logger.error(`Error checking news by id #${id} in database:`, {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

async function saveNewsToDatabase(newsData) {
    try {
        const news = new NewsInfo(newsData);
        const savedNews = await news.save();

        logger.info(`Piece of news #${savedNews.id} saved successfully.`);

        return savedNews;
    } catch (err) {
        logger.error('Error saving news to database:', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

async function saveNewsToDatabaseIfNotExists(newsData) {
    try {
        const exists = await isNewsInDatabase(newsData.id);
        if (exists) {
            logger.info(`Piece of news ${newsData.id} already exists in database:`, newsData.id);

            return;
        }

        await saveNewsToDatabase(newsData);
    } catch (err) {
        logger.error('Error processing news:', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

async function getLastNews(limit) {
    try {
        return await NewsInfo.find().sort({date: -1}).limit(limit);
    } catch (err) {
        logger.error('Error fetching last news:', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

module.exports = {
    isNewsInDatabase,
    saveNewsToDatabase,
    getLastNews,
    saveNewsToDatabaseIfNotExists,
};
