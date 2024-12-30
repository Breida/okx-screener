require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const screener = require('./screener');
const routes = require('./routes');
const aiNewsAnalyzer = require('./ai-news-analyzer');

const app = express();
app.use(cors());

app.use('/api/v1', routes);

const {APP_PORT, APP_IP, DATABASE_CONNECTION_URI} = process.env

const start = async () => {
    try {
        await mongoose.connect(DATABASE_CONNECTION_URI)
            .then(async () => {
                console.log('Mongodb connected...')
                aiNewsAnalyzer.startNewsProcession();

                await screener.start();

                app.listen(APP_PORT, () => {
                    console.log('server started...')
                });
            })
            .catch(err => {
                console.log('Error happened during work of application. Restarting system.', err);

                setTimeout(() => {
                    start();
                }, 1000 * 10);
            });
    } catch (err) {
        console.log('Error happened during starting of application. Shutting down.', err);

        throw err;
    }
}

start();
