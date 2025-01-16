if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const logger = require('./logger');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const screener = require('./screener');
const routes = require('./routes');
const aiNewsAnalyzer = require('./ai-news-analyzer');

const app = express();
app.use(cors());

app.use('/api/v1', routes);

const {PORT, DATABASE_CONNECTION_URI} = process.env

const start = async () => {
    try {
        mongoose.connect(DATABASE_CONNECTION_URI)
            .then(async () => {
                logger.info('Mongodb connected...')

                aiNewsAnalyzer.startNewsProcession();
                screener.start();

                app.listen(PORT, () => {
                    logger.info(`Server started at ${PORT}`);
                });
            })
            .catch(err => {
                logger.error('Error happened during work of application. Restarting system.', {
                    message: err.message,
                    stack: err.stack
                  });

                logger.info('Restarting application in 10 seconds...');
                setTimeout(() => {
                    start();
                }, 1000 * 10);
            });
    } catch (err) {
        logger.error('Error happened during starting of application. Shutting down.', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

start();
