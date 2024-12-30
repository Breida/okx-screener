const NewsInfo = require('./models/news-info');

async function isNewsInDatabase(id) {
    try {
        const existingNews = await NewsInfo.findOne({ id });
        return !!existingNews;
    } catch (error) {
        console.error(`Error checking news by id #${id} in database:`, error.message);
        throw error;
    }
}

async function saveNewsToDatabase(newsData) {
    try {
        const news = new NewsInfo(newsData);
        const savedNews = await news.save();

        console.log(`Piece of news #${savedNews.id} saved successfully.`);
        return savedNews;
    } catch (error) {
        console.error('Error saving news to database:', error.message);
        throw error;
    }
}

async function saveNewsToDatabaseIfNotExists(newsData) {
    try {
        const exists = await isNewsInDatabase(newsData.id);
        if (exists) {
            console.log(`Piece of news ${newsData.id} already exists in database:`, newsData.id);
            return;
        }

        await saveNewsToDatabase(newsData);
    } catch (error) {
        console.error('Error processing news:', error.message);
        throw error;
    }
}

async function getLastNews(limit) {
    try {
        return await NewsInfo.find().sort({date: -1}).limit(limit);
    } catch (error) {
        console.error('Error fetching last news:', error.message);
        throw error;
    }
}

module.exports = {
    isNewsInDatabase,
    saveNewsToDatabase,
    getLastNews,
    saveNewsToDatabaseIfNotExists,
};
