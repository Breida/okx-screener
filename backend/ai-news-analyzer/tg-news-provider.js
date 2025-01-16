require('dotenv').config();

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const prompt = require('prompt-sync')();
const logger = require('../logger');

const { TG_APP_ID, TG_APP_HASH, TG_APP_SESSION, TG_ACCOUNT_PHONE_NUMBER } = process.env;

const session = new StringSession(TG_APP_SESSION ?? '');

async function authorizeTelegram() {
    const client = new TelegramClient(session, +TG_APP_ID, TG_APP_HASH, { connectionRetries: 5 });

    try {
        await client.start({
            phoneNumber: async () => TG_ACCOUNT_PHONE_NUMBER,
            phoneCode: async () => prompt('Enter the confirmation code: '),
            onError: (err) => logger.error('Authorization error:', {
                message: err.message,
                stack: err.stack
              }),
        });

        logger.info('Telegram client initialized successfully.');

        return client;
    } catch (err) {
        logger.error('Failed to authorize:', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

async function getChannelHistory(client, channelName, limit = 10) {
    try {
        const channel = await client.getEntity(channelName);
        const messages = await client.getMessages(channel, {limit});

        logger.info(`Synced last #${limit} tg posts from the channel '${channelName}'.`);

        return messages;
    } catch (err) {
        logger.error('Failed to get channel history:', {
            message: err.message,
            stack: err.stack
          });
          
        throw err;
    }
}

async function subscribeToChannel(client, channelName, callback) {
    try {
        const channel = await client.getEntity(channelName);

        client.addEventHandler(async (event) => {
            const message = event.message;
            if (message && callback) {
                await callback(message, channelName);
            }
        }, new NewMessage({ chats: [channel.id] }));

        logger.info(`Subscribed to new messages from ${channelName}.`);
    } catch (err) {
        logger.error('Failed to subscribe to channel:', {
            message: err.message,
            stack: err.stack
          });

        throw err;
    }
}

module.exports = {authorizeTelegram, getChannelHistory, subscribeToChannel};