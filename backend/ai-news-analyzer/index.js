const { startNewsProcession } = require('./news-processor');
const { getLastNews } = require("./db-news-service");

module.exports = {
    startNewsProcession,
    getLastNews
};