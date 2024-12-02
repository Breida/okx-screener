require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const screener = require('./screener')
const routes = require('./routes')

const app = express()
app.use(cors())

app.use('/api/v1', routes)

const {APP_PORT, APP_IP, DATABASE_CONNECTION_URI} = process.env

const start = async () => {
    try {
        await mongoose
            .connect(DATABASE_CONNECTION_URI)
            .then(async () => {
                console.log('Mongo connected...')

                await screener.start()

                app.listen(APP_PORT, () => {
                    console.log('server started...')
                })
            })
            .catch(err => {
                console.log(err)
                setTimeout(() => {
                    start()
                }, 1000 * 10)
            })

    } catch (err) {
        throw err
    }
}

start();
